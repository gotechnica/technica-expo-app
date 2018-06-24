# Main server file
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from pymongo import MongoClient

app = Flask(__name__)
mongo = PyMongo(app)

@app.route('/')
def hello():
    return "Hello World!"


# Database CRUD routes #########################################################



# Public CRUD routes ###########################################################
# All end points under the public routes should not require any authentication.



# Private CRUD routes ##########################################################
# All end points under the private routes should require the access token.



if __name__ == '__main__':
    app.run(debug=True)
