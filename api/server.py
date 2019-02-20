# Main server file
from flask import Flask, jsonify, request, session, current_app
from flask_pymongo import PyMongo
from pymongo import MongoClient, UpdateOne
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util
import logging
import random
import string
import json
import hashlib
import io
import datetime
import os
from seed_db import *
from devpost_scraper import *

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object('config')
mongo = PyMongo(app)

# Global variables
publish_winners = False # Flag that admin can flip to show winner status in '/'


# Auth Decorators
def is_sponsor_or_admin(func):
    def function_wrapper(*args, **kwargs):
        print("Checking if logged in as sponsor before calling " + func.__name__)
        if 'user_type' in session and (session['user_type'] == 'sponsor' or session['user_type'] == 'admin'):
            return func(*args, **kwargs)
        else:
            return 'Error: You are not authorized to complete that request.', 403
    # Renaming the function name:
    function_wrapper.__name__ = func.__name__
    return function_wrapper


def is_admin(func):
    def function_wrapper(*args, **kwargs):
        print("Checking if logged in as admin before calling " + func.__name__)
        if 'user_type' in session and session['user_type'] == 'admin':
            return func(*args, **kwargs)
        else:
            return 'Error: You are not authorized to complete that request.', 403
    # Renaming the function name:
    function_wrapper.__name__ = func.__name__
    return function_wrapper


@app.route('/')
def hello():
    return get_all_projects()


# Public routes ################################################################
# All endpoints under the public routes should not require any authentication.

@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    projects = mongo.db.projects

    projects_list = []
    for p in projects.find():
        temp_project = {
            'project_id': str(p['_id']),
            'table_number': p['table_number'],
            'project_name': p['project_name'],
            'project_url': p['project_url'],
            'challenges': p['challenges'],
            'challenges_won': p['challenges_won']
        }
        projects_list.append(temp_project)

    output = {
        'publish_winners': publish_winners,
        'projects': projects_list
    }
    return jsonify(output)

@app.route('/api/projects/id/<project_id>', methods=['GET'])
def get_project(project_id):
    projects = mongo.db.projects

    project_obj = projects.find_one({'_id': ObjectId(project_id)})
    temp_project = {
        'project_id': str(project_obj['_id']),
        'table_number': project_obj['table_number'],
        'project_name': project_obj['project_name'],
        'project_url': project_obj['project_url'],
        'challenges': project_obj['challenges'],
        'challenges_won': project_obj['challenges_won']
    }

    return jsonify(temp_project)

@app.route('/api/challenges', methods=['GET'])
def get_all_challenges():
    companies = mongo.db.companies
    output = {}
    for curr_company in companies.find():
        if not curr_company['challenges']:
            output[curr_company['company_name']] = []
        else:
            curr_challenges_list = []
            for curr_challenge_id, curr_challenge in curr_company['challenges'].items():
                curr_challenges_list.append(curr_challenge['challenge_name'])
            output[curr_company['company_name']] = curr_challenges_list
    return jsonify(output)

@app.route('/api/projects/publish_winners_status', methods=['GET'])
def get_publish_winners_flag():
    global publish_winners  # Use the var defined at top of file
    return str(publish_winners)


# Admin routes #################################################################
# All endpoints under the Admin routes should require admin authorization.

## MONGODB SCHEMA:
# Project (data from Devpost)
    # Table Number
    # Project Name
    # Project URL
    # Attempted Challenges
    # Challenges Won

@app.route('/test/seed_db', methods=['GET'])
@is_admin
def csv_tester():
    return """
        <html>
            <body>
                <h1>Devpost CSV DB Seeder</h1>
                <h2>(Testing Page)</h2>

                <form action="/parse_csv" method="post" enctype="multipart/form-data">
                    <input type="file" name="projects_csv" />
                    <input type="submit" />
                </form>
            </body>
        </html>
    """

@app.route('/parse_csv', methods=['POST'])
@is_admin
def parse_csv():
    file = request.files['projects_csv']
    if not file:
        return "No file"
    with file.stream as temp_file:
        fd = temp_file.fileno()
        reader = csv.DictReader(io.open(fd, "rt", encoding="utf8", errors='ignore'))
        moving, not_moving = parse_csv_internal(reader, current_app.config['CUSTOM_DEVPOST_STAY_AT_TABLE_QUESTION'])
        bulk_add_projects_internal(get_project_list(not_moving))
        bulk_add_projects_internal(get_project_list(moving))
    # TODO(timothychen01): Just return the integer
    return "Seeded DB with " + str(len(moving) + len(not_moving)) + " projects"

def get_project_list(projects_obj):
    project_data = []
    for project_name in projects_obj:
        info = {
            'table_number': projects_obj[project_name].table_number,
            'project_name': project_name,
            'project_url': projects_obj[project_name].project_url,
            'challenges': projects_obj[project_name].challenges,
            'challenges_won': []
        }
        project_data.append(info)
    return project_data

def bulk_add_projects_internal(packet):
    if len(packet) != 0:
        projects = mongo.db.projects
        result = projects.insert_many(packet)
        return result

@app.route('/api/projects/assign_tables', methods=['POST'])
@is_admin
def assign_remaining_table_numbers():
    projects = mongo.db.projects
    all_projects = projects.find()

    # Get all used table assignments
    used_tables_array = []
    for p in all_projects.clone():
        if p['table_number'] != '':
            used_tables_array.append(p['table_number'])

    # Check for existing duplicates
    used_tables_set = set(used_tables_array)
    if (len(used_tables_array) != len(used_tables_set)):
        duplicates = list(set([x for x in used_tables_array if used_tables_array.count(x) > 1]))
        return f'Error: there exists {len(duplicates)} duplicate table number(s) in the DB. Please resolve duplicate before continuing.\n{duplicates}'

    available_tables_list = get_available_table_numbers(request.json, used_tables_set, all_projects.count())
    i = 0
    db_update_operations = []
    for p in all_projects:
        # If table number hasn't been assigned yet, assign next available one
        if p['table_number'] == '' and i < len(available_tables_list):
            db_update_operations.append(UpdateOne(
                {'_id': ObjectId(p['_id'])},
                {'$set': {'table_number': available_tables_list[i]}}
            ))
            i += 1
    if (len(db_update_operations) > 0):
        result = projects.bulk_write(db_update_operations)
        print(result.bulk_api_result)
        num_modified = result.bulk_api_result.get('nModified')
        return f'{num_modified} projects have been assigned tables. {len(used_tables_array)} projects maintain their old table.'
    else:
        return 'No projects have been assigned new tables.'

# Valid schemas: 'numeric', 'evens', 'odds', 'custom'
def get_available_table_numbers(request_params, used_tables_set, num_projects):
    table_assignment_schema = request_params['table_assignment_schema']
    max_table_numbers_list = []
    num_tables_needed = num_projects + len(used_tables_set)
    if table_assignment_schema == 'evens':
        max_table_numbers_list = range(2, num_tables_needed * 2 + 2, 2)
    elif table_assignment_schema == 'odds':
        max_table_numbers_list = range(1, num_tables_needed * 2 + 1, 2)
    elif table_assignment_schema == 'numeric':
        max_table_numbers_list = range(1, num_tables_needed + 1)
    elif table_assignment_schema == 'custom':
        for letter in char_range(request_params['table_start_letter'], request_params['table_end_letter']):
            for number in range(request_params['table_start_number'], request_params['table_end_number'] + 1):
                max_table_numbers_list.append(letter + str(number))
        if request_params['skip_every_other_table']:
            max_table_numbers_list = max_table_numbers_list[::2]
    # Remove used table numbers
    for table in max_table_numbers_list:
        if table in used_tables_set:
            max_table_numbers_list.remove(table)
    print(max_table_numbers_list)
    return max_table_numbers_list

def char_range(c1, c2):
    """Generates the characters from `c1` to `c2`, inclusive."""
    for c in range(ord(c1), ord(c2)+1):
        yield chr(c)

@app.route('/api/projects/clear_table_assignments', methods=['POST'])
@is_admin
def remove_all_table_numbers():
    projects = mongo.db.projects
    all_projects = projects.find()

    db_update_operations = []
    for p in all_projects:
        db_update_operations.append(UpdateOne(
            {'_id': ObjectId(p['_id'])},
            {'$set': {'table_number': ''}}
        ))
    if (len(db_update_operations) > 0):
        result = projects.bulk_write(db_update_operations)
        num_modified = result.bulk_api_result.get('nModified')
        if current_app.config['CUSTOM_DEVPOST_STAY_AT_TABLE_QUESTION']:
            return f'Cleared table assignments from {num_modified} projects. Remember to manually assign table numbers to projects requesting a specific table.'
        else:
            return f'Cleared {num_modified} projects of table assignments.'
    else:
        return 'No table assignments were cleared.'

@app.route('/api/projects/publish_winners_status', methods=['POST'])
@is_admin
def update_publish_winners_flag():
    global publish_winners  # Use the var defined at top of file
    publish_winners = request.json['publish_winners']
    return str(publish_winners)

@app.route('/api/projects/add', methods=['POST'])
@is_admin
def add_project():
    projects = mongo.db.projects

    table_number = request.json['table_number']
    project_name = request.json['project_name']
    project_url = request.json['project_url']
    try:
        challenges = format_challenges(request.json['challenges'])
    except:
        challenges = []

    project = {
        'table_number': table_number,
        'project_name': project_name,
        'project_url': project_url,
        'challenges': challenges,
        'challenges_won': []
    }

    project_id = projects.insert(project)
    return str(project_id)

@app.route('/api/projects/bulk_add', methods=['POST'])
@is_admin
def bulk_add_project():
    packet = request.json['projects']
    return bulk_add_projects_internal(packet)

@app.route('/api/projects/id/<project_id>', methods =['POST'])
@is_admin
def update_project(project_id):
    projects = mongo.db.projects

    updated_project_obj = {
        'table_number': request.json['table_number'],
        'project_name': request.json['project_name'],
        'project_url': request.json['project_url'],
        'challenges': request.json['challenges'],
        # 'challenges_won': []  // Don't update challenges_won array
    }

    old_project_obj = projects.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': updated_project_obj}
    )

    return "The following project data was overridden: " + json.dumps(old_project_obj, default=json_util.default)

def get_all_attempted_challenge_strings(project_obj):
    output = []
    for challenge_obj in project_obj['challenges']:
        output.append(challenge_obj['challenge_name'] + ' - ' + challenge_obj['company'])
    return output

# Note: this helper not currently used
def get_all_possible_challenges():
    companies = mongo.db.companies
    output = []
    for curr_company in companies.find():
        output.append(format_company_obj_to_old_schema(curr_company))
    companies_list = [y for x in output for y in x]

    challenges = []
    for comp in companies_list:
        try:
            challenges.append(comp['challenge_name'])
        except:
            # Do nothing if no challenge in that comp
            None
    return challenges

@app.route('/api/projects/id/<project_id>', methods=['DELETE'])
@is_admin
def delete_project(project_id):
    projects = mongo.db.projects
    result = projects.delete_one({'_id': ObjectId(project_id)})
    if result.deleted_count == 1:
        return "Deleted project " + project_id
    else:
        return "Did not find project " + project_id


@app.route('/api/projects/deleteAll', methods=['DELETE'])
@is_admin
def delete_all_projects():
    projects = mongo.db.projects

    projects.delete_many({})
    return jsonify({'Delete': 'all'})


# Company (defined by organizers in admin dash)
    # Company Name
    # Access code
    # Challenge Name
    # Number of prizes they can choose per challenge
    # ProjectID that won the challenge

@app.route('/api/seed-challenges-from-devpost')
def import_challenges():
    devpost_url = current_app.config['DEVPOST_ROOT_URL']
    companies = mongo.db.companies

    print(type(companies))

    prize_list = get_challenges(devpost_url)
    company_list = []
    company_names = list(set([prize[1] for prize in prize_list]))
    
    for company_name in company_names:
        challenge_info = [[prize[0],prize[2]] for prize in prize_list
                         if prize[1] == company_name]

        #Autogenerate access_code
        access_code = generate_random_access_code(8)
        company_obj = companies.find_one({'access_code': {'$eq': access_code.upper()}})
        # Keep generating codes until unique
        while company_obj != None:
            access_code = generate_random_access_code(8)
            company_obj = companies.find_one({'access_code': {'$eq': access_code.upper()}})

        company_name_no_spaces = "".join(company_name.split())
        challenges_obj = {}

        # Go through all challenges
        for challenge_name, num_winners in challenge_info:
            challenge_id = company_name_no_spaces + '_challenge' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')

            challenges_obj[challenge_id] = {
                'challenge_name': challenge_name,
                'num_winners': num_winners,
                'winners': []
            }

        
        company_list.append({
            'company_name':company_name,
            'access_code':access_code.upper(),
            'challenges':challenges_obj
        })
        companies.insert(company_list[-1])

    return str(prize_list)

@app.route('/api/companies/add', methods=['POST'])
@is_admin
def add_company():
    companies = mongo.db.companies

    company_name = request.json['company_name']
    access_code = request.json['access_code'].upper()
    
    # Autogenerate 8-character access code if blank one was sent
    if access_code == '':
        access_code = generate_random_access_code(8)
        company_obj = companies.find_one({'access_code': {'$eq': access_code.upper()}})
        # Keep generating codes until unique
        while company_obj != None:
            access_code = generate_random_access_code(8)
            company_obj = companies.find_one({'access_code': {'$eq': access_code.upper()}})
    else:
        # Check if user-defined access code is already used
        company_obj = companies.find_one({'access_code': {'$eq': access_code.upper()}})
        if company_obj != None:
            return "Access code already in use."

    company = {
        'company_name': company_name,
        'access_code': access_code.upper(),
        'challenges': {}
    }
    company_id = str(companies.insert(company))
    return company_id

def generate_random_access_code(length):
    # Only allow characters that are not ambiguous (I, L, O, 1, 0)
    return ''.join(random.choice('ABCDEFGHJKMNPQRTUVWXYZ2346789') for _ in range(length))

@app.route('/api/companies/id/<company_id>', methods=['POST'])
@is_admin
def update_company_name_or_code(company_id):
    companies = mongo.db.companies

    # winners_arr = []
    # if request.json.get('winners') != None:
    #     winners_arr = request.json.get('winners').split()

    # Both fields must be present in the POST request body
    updated_company = {
        'company_name': request.json['company_name'],
        'access_code': request.json['access_code'].upper()
    }
    updated_company_obj = companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': updated_company}
    )

    return "The following company data was overridden: " + json.dumps(updated_company_obj, default=json_util.default)

@app.route('/api/companies/id/<company_id>', methods=['DELETE'])
@is_admin
def delete_company(company_id):
    companies = mongo.db.companies
    result = companies.delete_one({'_id': ObjectId(company_id)})
    # TODO(timothychen01): Explore adding additional side effect for challenges
    if result.deleted_count == 1:
        return "Deleted company " + company_id
    else:
        return "Did not find company " + company_id

@app.route('/api/companies/id/<company_id>/challenges/add', methods=['POST'])
@is_admin
def add_challenge_to_company(company_id):
    companies = mongo.db.companies
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenges_obj = company_obj['challenges']

    # TODO: Come up with better id creation method
    company_name_no_spaces = "".join(company_obj['company_name'].split())
    challenge_id = company_name_no_spaces + '_challenge' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    challenges_obj[challenge_id] = {
        'challenge_name': request.json['challenge_name'],
        'num_winners': int(request.json['num_winners']),
        'winners': []
    }

    updated_company = {
        'challenges': challenges_obj
    }
    updated_company_obj = companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': updated_company}
    )

    return "The following company data was overridden: " + json.dumps(updated_company_obj, default=json_util.default)

@app.route('/api/companies/id/<company_id>/challenges/<challenge_id>', methods=['POST', 'DELETE'])
@is_admin
def update_company_challenge(company_id, challenge_id):
    companies = mongo.db.companies
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenges_obj = company_obj['challenges']

    if request.method == 'DELETE':
        try:
            # Check if there are any winners assigned yet
            if len(challenges_obj[challenge_id]['winners']) == 0:
                del challenges_obj[challenge_id]
            else:
                return "Cannot delete challenge " + challenge_id + " because winners have already been selected"
        except:
            return "Error deleting challenge " + challenge_id
    elif request.method == 'POST':
        challenges_obj[challenge_id]['challenge_name'] = request.json['challenge_name']
        challenges_obj[challenge_id]['num_winners'] = int(request.json['num_winners'])

    updated_company = {
        'challenges': challenges_obj
    }
    updated_company_obj = companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': updated_company}
    )

    if request.method == 'DELETE':
        return challenge_id + " has been deleted from " + company_obj['company_name']
    return "The following company data was overridden: " + json.dumps(updated_company_obj, default=json_util.default)

@app.route('/api/companies/id/<company_id>', methods=['GET'])
@is_admin
def get_company(company_id):
    companies = mongo.db.companies
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    return jsonify(format_company_obj_to_old_schema(company_obj))

@app.route('/api/companies', methods=['GET'])
@is_admin
def get_all_companies():
    companies = mongo.db.companies
    output = []
    for curr_company in companies.find():
        output.append(format_company_obj_to_old_schema(curr_company))
    flattened_output = [y for x in output for y in x]
    return jsonify(flattened_output)

def format_company_obj_to_old_schema(company_obj):
    output = []
    if not company_obj['challenges']:
        return [{
            'company_id': str(company_obj['_id']),
            'company_name': company_obj['company_name'],
            'access_code': company_obj['access_code'],
        }]
    for curr_challenge_id, curr_challenge in company_obj['challenges'].items():
        company_old_schema = {
            'company_id': str(company_obj['_id']),
            'company_name': company_obj['company_name'],
            'access_code': company_obj['access_code'],
            'challenge_id': curr_challenge_id,
            'challenge_name': curr_challenge['challenge_name'],
            'num_winners': curr_challenge['num_winners'],
            'winners': curr_challenge['winners']
        }
        output.append(company_old_schema)
    return output


# Second version of the company endpoints with cleaner output
# Note: v2 is not used by frontend
@app.route('/api/v2/companies/id/<company_id>', methods=['GET'])
@is_admin
def get_company_cleaner_schema(company_id):
    companies = mongo.db.companies

    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    output = {
        'company_id': str(company_obj['_id']),
        'company_name': company_obj['company_name'],
        'access_code': company_obj['access_code'],
        'challenges': company_obj['challenges']
    }
    return jsonify(output)

@app.route('/api/v2/companies', methods=['GET'])
@is_admin
def get_all_companies_cleaner_schema():
    companies = mongo.db.companies

    output = []
    for c in companies.find():
        temp_company = {
            'company_id': str(c['_id']),
            'company_name': c['company_name'],
            'access_code': c['access_code'],
            'challenges': c['challenges']
        }
        output.append(temp_company)

    return jsonify(output)


# Private / sponsor routes #####################################################
# All endpoints under the private routes should require the access token.

# Second version of the company endpoints with cleaner output
# Note: v2 is not used by frontend
@app.route('/api/v2/companies/current_sponsor', methods=['GET'])
def get_logged_in_company_cleaner_schema():
    if 'user_type' in session and session['user_type'] == 'sponsor':
        companies = mongo.db.companies

        company_obj = companies.find_one({'company_name': {'$eq': session['name']}})
        output = {
            'company_id': str(company_obj['_id']),
            'company_name': company_obj['company_name'],
            'access_code': company_obj['access_code'],
            'challenges': company_obj['challenges']
        }
        return jsonify(output)
    else:
        return 'Error: You are not authorized to complete that request.', 403

@app.route('/api/projects/id/<project_id>/challenge_status', methods=['POST'])
@is_sponsor_or_admin
def update_project_challenge_status(project_id):
    projects = mongo.db.projects

    company_name = request.json['company_name']
    challenge_name = request.json['challenge_name']
    is_winner = request.json['is_winner']     # boolean

    project_obj = projects.find_one(
        {'_id': ObjectId(project_id)}
    )
    challenges = project_obj['challenges']

    for ind, challenge in enumerate(challenges):
        if challenge['company'] == company_name and challenge['challenge_name'] == challenge_name:
            print(str(ind), challenge)
            challenges[ind]['won'] = is_winner
            print(is_winner)
            print(challenges[ind]['won'])

    updated_project_obj = projects.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': project_obj}
    )

    return "The following project data was overridden: " + json.dumps(updated_project_obj, default=json_util.default)


# NOTE: THIS API FORCES US TO NEVER NAME A CHALLENGE AS A SUBSTRING OF ANOTHER CHALLENGE
def update_win_status(project_challenge_obj, company_name, challenge_name, didWin):
    if (project_challenge_obj['company'] == company_name and project_challenge_obj['challenge_name'] in challenge_name):
        project_challenge_obj['won'] = didWin
    return project_challenge_obj

@app.route('/api/projects/id/<project_id>/makeWinner', methods=['POST'])
@is_sponsor_or_admin
def make_winner(project_id):
    projects = mongo.db.projects
    companies = mongo.db.companies
    company_id = request.json['company_id']
    challenge_id = request.json['challenge_id']

    project_obj = projects.find_one({'_id': ObjectId(project_id)})
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenge_obj = company_obj['challenges'][challenge_id]
    challenge_name = challenge_obj['challenge_name']

    # Check if project has already won the same challenge (prevent duplicate form entry)
    if project_id in challenge_obj['winners']:
        return "Error: Project " + project_id + " is already winner for " + challenge_name

    # Error if the challenge cannot accept more winners
    challenge_winners_cap = challenge_obj['num_winners']
    curr_num_winners = len(challenge_obj['winners'])
    if curr_num_winners >= int(challenge_winners_cap):
        return "Error: Challenge " + challenge_id + " is capped at " + str(challenge_winners_cap) + " winner(s)"

    # Modify company object
    company_obj['challenges'][challenge_id]['winners'].append(project_id)
    companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': company_obj}
    )

    # Modify project object
    company_name = company_obj['company_name']
    updated_challenges_list = list(map(lambda challenge_obj: update_win_status(challenge_obj, company_name, challenge_name, True), project_obj['challenges']))
    project_obj['challenges'] = updated_challenges_list
    project_obj['challenges_won'].append(challenge_id)
    projects.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': project_obj}
    )

    return "Updated project " + project_id

@app.route('/api/projects/id/<project_id>/makeNonWinner', methods=['POST'])
@is_sponsor_or_admin
def make_non_winner(project_id):
    projects = mongo.db.projects
    companies = mongo.db.companies
    company_id = request.json['company_id']
    challenge_id = request.json['challenge_id']

    project_obj = projects.find_one({'_id': ObjectId(project_id)})
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenge_obj = company_obj['challenges'][challenge_id]
    challenge_name = challenge_obj['challenge_name']

    # Modify company object
    old_winners_list = challenge_obj['winners']
    company_obj['challenges'][challenge_id]['winners'] = list(filter(lambda winner_id: winner_id != project_id, old_winners_list))
    companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': company_obj}
    )

    # Modify project object
    if project_obj is None:
        return "Project does not exist, exiting early."
    company_name = company_obj['company_name']
    updated_challenges_list = list(map(lambda challenge_obj: update_win_status(challenge_obj, company_name, challenge_name, False), project_obj['challenges']))
    project_obj['challenges'] = updated_challenges_list
    old_challenges_won_list = project_obj['challenges_won']
    project_obj['challenges_won'] = list(filter(lambda c_id: c_id != challenge_id, old_challenges_won_list))
    projects.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': project_obj}
    )

    return "Updated project " + project_id


# Auth routes ##################################################################
# Modifies the user's session

@app.route('/api/whoami', methods=['GET'])
def return_session_info():
    if 'user_type' in session:
        return json.dumps({
            'user_type': session['user_type'],  # sponsor or admin
            'name': session['name'],            # company name or "admin"
            'id': session['id']
        }, default=json_util.default)
    return "{}" # Return empty object if not logged in

@app.route('/api/login/sponsor', methods=['POST'])
def sponsor_login():
    companies = mongo.db.companies
    attempted_access_code = request.json['access_code'].upper()
    if attempted_access_code == '':
        return "Access denied."
    company_obj = companies.find_one({'access_code': {'$eq': attempted_access_code.upper()}})
    if company_obj == None:
        return "Access denied."
    else:
        session['user_type'] = 'sponsor'
        session['name'] = company_obj['company_name']
        session['id'] = str(company_obj['_id'])
        return "Logged in as " + company_obj['company_name']

@app.route('/api/login/admin', methods=['POST'])
def admin_login():
    attempted_access_code = request.json['access_code'].upper()
    if attempted_access_code != current_app.config['ADMIN_ACCESS_CODE'].upper():
        return "Access denied."
    else:
        session['user_type'] = 'admin'
        session['name'] = 'Admin'
        session['id'] = 'admin'
        return "Logged in as admin"

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_type', None)
    session.pop('name', None)
    session.pop('id', None)
    return "Logged out"

if __name__ == '__main__':
    app.run(debug=True)

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.debug')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
