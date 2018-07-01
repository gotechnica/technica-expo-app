# Technica Expo App API

We use Flask as an API for the expo app. It mainly interfaces with the database, and gives CRUD endpoints that the React app calls from.

# General Guidelines / Tips

* Make sure your code follows [PEP8](https://www.python.org/dev/peps/pep-0008/).
* Try to keep features in their own file, i.e. any database access should go through db.py
* Flask has patterns on their [website](http://flask.pocoo.org/docs/1.0/patterns/). We don't strictly follow these, but they're good to keep in mind.
* Write tests! More on this further down!


# Setup
## Virtualenv
We use virtualenv. To install on Linux/MacOS, run `sudo pip install virtualenv` and then run `virtualenv venv`. To use it, cd into this directory and run `source venv/bin/activate` on Linux/MacOS or `.\venv\Scripts\activate` on Windows.

Run `deactivate` to exit the virtual environment.

## Installation
Once in the virtualenv, run `pip install -r requirements.txt`. This installs the required packages.

# Running
To run the server, just run `python server.py`. The Flask server is then accessible from http://127.0.0.1:5000/.

# Developing
The server file is separated out into database, public, and private CRUD routes. When adding endpoints, make sure it goes into the right section. If you need to create a new section, please feel free to.

## Adding packages
To install new packages, just run `pip install <package>`, and then to save it, run `pip freeze > requirements.txt`

# Testing
[Coming soon]
