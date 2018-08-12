# Main server file
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json
import hashlib

app = Flask(__name__)
app.config.from_object('config')
mongo = PyMongo(app)


@app.route('/')
def hello():
    return "Welcome to the Technica Expo App!"




# Public routes ################################################################
# All endpoints under the public routes should not require any authentication.

@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    projects = mongo.db.projects

    output = []
    for p in projects.find():
        temp_project = {
            'table_number': p['table_number'],
            'project_name': p['project_name'],
            'project_url': p['project_url'],
            'attempted_challenges': p['attempted_challenges'],
            'challenges_won': p['challenges_won']
        }
        output.append(temp_project)

    return jsonify({'All Projects': output})


# Admin routes #################################################################
# All endpoints under the Admin routes should require admin authorization.

## MONGODB SCHEMA:
# Project (data from Devpost)
    # Table Number
    # Project Name
    # Project URL
    # Attempted Challenges
    # Challenges Won
# Company
    # Company Name
    # Access code
    # Challenge Name
    # Number of prizes they can choose per challenge
    # ProjectID that won the challenge


@app.route('/api/projects/add', methods=['POST'])
def add_project():
    projects = mongo.db.projects

    table_number = request.json['table_number']
    project_name = request.json['project_name']
    project_url = request.json['project_url']
    attempted_challenges = request.json['attempted_challenges']
    challenges_won = request.json['challenges_won']

    temp_project = {
        'table_number': table_number,
        'project_name': project_name,
        'project_url': project_url,
        'attempted_challenges': attempted_challenges,
        'challenges_won': challenges_won
    }

    project_id = projects.insert(temp_project)

    new_project = projects.find_one({'_id': project_id})
    output = {
        'table_number': new_project['table_number'],
        'project_name': new_project['project_name'],
        'project_url': new_project['project_url'],
        'attempted_challenges': new_project['attempted_challenges'],
        'challenges_won': new_project['challenges_won']
    }

    return jsonify({'Newly created project': output})

@app.route('/api/projects/bulk_add', methods=['POST'])
def bulk_add_project():
    projects = mongo.db.projects

    packet = request.json['projects']
    
    result = projects.insert_many(packet)
    return jsonify({'New IDs': "tmp"})


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
    num_prizes_allotted = request.json['num_prizes_allotted']
    winner_project_id = None

    temp_company = {
        'company_name': company_name,
        'access_code': access_code,
        'challenge_name': challenge_name,
        'num_prizes_allotted': num_prizes_allotted,
        'winner_project_id': winner_project_id
    }
    company_id = companies.insert(temp_company)

    new_company = companies.find_one({'_id': company_id})
    output = {
        'company_name': new_company['company_name'],
        'access_code': new_company['access_code'],
        'challenge_name': new_company['challenge_name'],
        'num_prizes_allotted': new_company['num_prizes_allotted'],
        'winner_project_id': new_company['winner_project_id']
    }

    return jsonify({'Newly created company': output})


@app.route('/api/companies', methods=['GET'])
def get_all_companies():
    companies = mongo.db.companies

    output = []
    for c in companies.find():
        temp_company = {
            'company_name': c['company_name'],
            'access_code': c['access_code'],
            'challenge_name': c['challenge_name'],
            'num_prizes_allotted': c['num_prizes_allotted'],
            'winner_project_id': c['winner_project_id']
        }
        output.append(temp_company)

    return jsonify({'All Companies' : output})




# Private / sponsor routes #####################################################
# All endpoints under the private routes should require the access token.


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


if __name__ == '__main__':
    app.run(debug=True)
