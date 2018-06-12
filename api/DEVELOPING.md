# Expo App API

We use Flask as an API.

# Setup
## Virtualenv
We use virtualenv. To use it, run `source venv/bin/activate` on Linix/MacOS, and `.\venv\Scripts\activate` on Windows.

Run `deactivate` to exit the virtual enviroment.

## Installation
Once in the virtualenv, run `pip install -r requirements.txt`. This installs the required packages.

### Adding packages
To install new packages, just run `pip install <package>`, and then to save it, run `pip freeze > requirements.txt`

# Running
To run the server, just run `python server.py`