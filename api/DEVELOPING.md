# Technica Expo App API

We use Flask as an API for the expo app. It mainly interfaces with the database, and gives CRUD endpoints that the React app calls from.

# Setup
## Virtualenv
We use virtualenv. To use it, run `source venv/bin/activate` on Linix/MacOS, and `.\venv\Scripts\activate` on Windows.

Run `deactivate` to exit the virtual enviroment.

## Installation
Once in the virtualenv, run `pip install -r requirements.txt`. This installs the required packages.

# Running
To run the server, just run `python server.py`. The Flask server is then accessible from http://127.0.0.1:5000/

# Devloping
Each file uses *blueprints*. See http://flask.pocoo.org/docs/1.0/blueprints/ for more details - it works mostly the same normal Flask, and gives us modularity.

## Adding packages
To install new packages, just run `pip install <package>`, and then to save it, run `pip freeze > requirements.txt`