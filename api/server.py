# Main server file
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from pymongo import MongoClient

app = Flask(__name__)
mongo = PyMongo(app)

@app.route('/')
def hello():
    return "Hello World!"


# Database CRUD routes



# Public CRUD routes



# Private CRUD routes




if __name__ == '__main__':
    app.run(debug=True)
