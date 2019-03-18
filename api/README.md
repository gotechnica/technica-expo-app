# Hackathon Expo App API

We use Flask as an API for the expo app. It mainly interfaces with the database, and gives CRUD endpoints that the React app calls from.

# General Guidelines / Tips

* Make sure to be using Python 3!
* Make sure your code follows [PEP8](https://www.python.org/dev/peps/pep-0008/).
* Try to keep features in their own file, i.e. any database access should go through db.py
* Flask has patterns on their [website](http://flask.pocoo.org/docs/1.0/patterns/). We don't strictly follow these, but they're good to keep in mind.
* Write tests! More on this further down!


# Setup
## Virtualenv
We use virtualenv. To install on Linux/MacOS, make sure you have `python3` installed (using homebrew, `brew install python3`). Run `python3 -m venv venv` to create a virtual environment called `venv` in this directory. To use it, cd into this directory and run `source venv/bin/activate` on Linux/MacOS or `.\venv\Scripts\activate` on Windows.

Run `deactivate` to exit the virtual environment.

## Installation
Once in the virtualenv, run `pip3 install -r requirements.txt`. This installs the required packages.

## `config.py`
Rename config.ex.py (or make a duplicate if you want to refer back to the example file) as `config.py`. This file is used to customize various parts of your application, such as MongoDB connections, admin access codes, etc...

# Running
To run the server, just run `python3 server.py`. The Flask server is then accessible from http://127.0.0.1:5000/.

# Endpoints
## Public Routes

GET get all projects `/api/projects`

GET get project with specific id `/api/projects/id/<project_id>`

## Admin Routes

POST add a project `api/projects/add`

POST bulk add projects `api/projects/bulk_add`

POST update project with id project_id `/api/projects/id/<project_id>`

DELETE delete project with id specified in request body `/api/projects/delete`

DELETE wipe projects database `/api/projects/deleteAll`

POST add a company `/api/companies/add`

POST update a company with id company_id `/api/companies/id/<company_id>`

GET get company with id company_id `/api/companies/id/<company_id>`

GET get all companies `/api/companies`

# Developing
The server file is separated out into database, public, and private CRUD routes. When adding endpoints, make sure it goes into the right section. If you need to create a new section, please feel free to.

## Adding packages
To install new packages, just run `pip3 install <package>`, and then to save it, run `pip3 freeze > requirements.txt`

# Testing
[Coming soon]
