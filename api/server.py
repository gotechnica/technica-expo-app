# Main server file
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util
import json
import hashlib
import io
from seed_db import *

app = Flask(__name__)
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
    return json.dumps(project_obj, default=json_util.default)


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

    # Currently only 1 challenge per company - create another company with same
    # access_code and company_name if need another prize

    # TODO(kjeffc) Make prize selection compatible with this system
    # (e.g. Company X is in the DB twice, but with same access token - they
    # shouldn't notice a difference/have to re-login etc...)
    challenge_name = request.json['challenge_name']
    num_winners = request.json['num_winners']

    company = {
        'company_name': company_name,
        'access_code': access_code,
        'challenge_name': challenge_name,
        'num_winners': num_winners,
        'winners': []      # Empty array
    }

    company_id = str(companies.insert(company))
    return company_id

@app.route('/api/companies/id/<company_id>', methods =['POST'])
def update_company(company_id):
    companies = mongo.db.companies

    winners_arr = []
    if request.json.get('winners') != None:
        winners_arr = request.json.get('winners').split()

    updated_company = {
        'company_name': request.json['company_name'],
        'access_code': request.json['access_code'],
        'challenge_name': request.json['challenge_name'],
        'num_winners': request.json['num_winners'],
        'winners': winners_arr  # Winners entered as project_ids split by whitespace
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
            'challenge_name': c['challenge_name'],
            'num_winners': c['num_winners'],
            'winners': c['winners']
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


if __name__ == '__main__':
    app.run(debug=True)
