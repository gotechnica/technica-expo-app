# Main server file
from flask import Flask, jsonify, request, session, current_app
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util
import json
import hashlib
import io
import datetime
import os
from seed_db import *

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)
app.config.from_object('config')
mongo = PyMongo(app)


@app.route('/')
def hello():
    return get_all_projects()


# Public routes ################################################################
# All endpoints under the public routes should not require any authentication.

@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    projects = mongo.db.projects

    output = []
    for p in projects.find():
        temp_project = {
            'project_id': str(p['_id']),
            'table_number': p['table_number'],
            'project_name': p['project_name'],
            'project_url': p['project_url'],
            'challenges': p['challenges'],
            'challenges_won': p['challenges_won']
        }
        output.append(temp_project)

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
def parse_csv():
    file = request.files['projects_csv']
    if not file:
        return "No file"
    with file.stream as temp_file:
        fd = temp_file.fileno()
        reader = csv.DictReader(io.open(fd, "rt", encoding="utf8", errors='ignore'))
        moving, not_moving = parse_CSV(reader)
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
            'challenges_won': ""
        }
        project_data.append(info)
    return project_data

def bulk_add_projects_internal(packet):
    projects = mongo.db.projects
    result = projects.insert_many(packet)
    return result

@app.route('/api/projects/add', methods=['POST'])
def add_project():
    projects = mongo.db.projects

    table_number = request.json['table_number']
    project_name = request.json['project_name']
    project_url = request.json['project_url']
    challenges = request.json['challenges']
    challenges_won = request.json['challenges_won']

    project = {
        'table_number': table_number,
        'project_name': project_name,
        'project_url': project_url,
        'challenges': challenges,
        'challenges_won': challenges_won
    }

    project_id = projects.insert(project)
    return project_id

@app.route('/api/projects/bulk_add', methods=['POST'])
def bulk_add_project():
    packet = request.json['projects']
    return bulk_add_projects_internal(packet)

@app.route('/api/projects/id/<project_id>', methods =['POST'])
def update_project(project_id):
    projects = mongo.db.projects

    challenges_won_arr = []
    if request.json.get('challenges_won') != None:
        challenges_won_arr = request.json.get('challenges_won').split()

    updated_project = {
        'table_number': request.json['table_number'],
        'project_name': request.json['project_name'],
        'project_url': request.json['project_url'],
        'challenges': request.json['challenges'],
        'challenges_won': challenges_won_arr    # Challenges won entered as company_ids split by whitespace
    }
    updated_project_obj = projects.find_one_and_update(
        {'_id': ObjectId(project_id)},
        {'$set': updated_project}
    )

    return "The following project data was overridden: " + json.dumps(updated_project_obj, default=json_util.default)

@app.route('/api/projects/delete', methods=['DELETE'])
def delete_project():
    projects = mongo.db.projects

    project_id = request.json['project_id']
    projects.delete_one({'_id': project_id})


@app.route('/api/projects/deleteAll', methods=['DELETE'])
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

@app.route('/api/companies/add', methods=['POST'])
def add_company():
    companies = mongo.db.companies

    company_name = request.json['company_name']
    access_code = request.json['access_code']

    # TODO(kjeffc) Make prize selection compatible with this system
    # (e.g. Company X is in the DB twice, but with same access token - they
    # shouldn't notice a difference/have to re-login etc...)

    # TODO(timothychen01): Remove challenge related details in initial creation
    # challenge_name = request.json['challenge_name']
    # num_winners = request.json['num_winners']

    company = {
        'company_name': company_name,
        'access_code': access_code,
        'challenges': {}
    }

    company_id = str(companies.insert(company))
    return company_id

@app.route('/api/companies/id/<company_id>', methods=['POST'])
def update_company_name_or_code(company_id):
    companies = mongo.db.companies

    # winners_arr = []
    # if request.json.get('winners') != None:
    #     winners_arr = request.json.get('winners').split()

    # Both fields must be present in the POST request body
    updated_company = {
        'company_name': request.json['company_name'],
        'access_code': request.json['access_code']
    }
    updated_company_obj = companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': updated_company}
    )

    return "The following company data was overridden: " + json.dumps(updated_company_obj, default=json_util.default)

@app.route('/api/companies/id/<company_id>/challenges/add', methods=['POST'])
def add_challenge_to_company(company_id):
    companies = mongo.db.companies
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenges_obj = company_obj['challenges']

    # TODO: Come up with better id creation method
    challenge_id = company_obj['company_name'] + '_challenge' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    challenges_obj[challenge_id] = {
        'challenge_name': request.json['challenge_name'],
        'num_winners': request.json['num_winners'],
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

@app.route('/api/companies/id/<company_id>/challenges/<challenge_id>', methods=['POST'])
def update_company_challenge(company_id, challenge_id):
    companies = mongo.db.companies
    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    challenges_obj = company_obj['challenges']
    challenges_obj[challenge_id]['challenge_name'] = request.json['challenge_name']
    challenges_obj[challenge_id]['num_winners'] = request.json['num_winners']

    updated_company = {
        'challenges': challenges_obj
    }
    updated_company_obj = companies.find_one_and_update(
        {'_id': ObjectId(company_id)},
        {'$set': updated_company}
    )

    return "The following company data was overridden: " + json.dumps(updated_company_obj, default=json_util.default)

@app.route('/api/companies/id/<company_id>', methods=['GET'])
def get_company(company_id):
    companies = mongo.db.companies

    company_obj = companies.find_one({'_id': ObjectId(company_id)})
    return json.dumps(company_obj, default=json_util.default)

@app.route('/api/companies', methods=['GET'])
def get_all_companies():
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

@app.route('/api/projects/id/<project_id>/challenge_status', methods=['POST'])
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
    attempted_access_code = request.json['access_code']
    company_obj = companies.find_one({'access_code': re.compile(attempted_access_code, re.IGNORECASE)})
    if company_obj == None:
        return "Access denied."
    else:
        session['user_type'] = 'sponsor'
        session['name'] = company_obj['company_name']
        session['id'] = str(company_obj['_id'])
        return "Logged in as " + company_obj['company_name']

@app.route('/api/login/admin', methods=['POST'])
def admin_login():
    attempted_access_code = request.json['access_code']
    if attempted_access_code != current_app.config['ADMIN_ACCESS_CODE']:
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
