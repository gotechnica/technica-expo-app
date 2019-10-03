# Hackathon Expo App API

We use Flask as an API for the expo app. It mainly interfaces with the database, and gives CRUD endpoints that the React app calls from.
___
# General Guidelines / Tips

* Make sure to be using Python 3!
* The easiest way to develop/deploy is by using docker compose.
* Make sure your code follows [PEP8](https://www.python.org/dev/peps/pep-0008/).
* Try to keep features in their own file, i.e. any database access should go through db.py
* Flask has patterns on their [website](http://flask.pocoo.org/docs/1.0/patterns/). We don't strictly follow these, but they're good to keep in mind.
* Write tests! More on this further down!

___
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

___
# Local Development
## General Docker/Docker Compose Steps
### `config.py`
Rename config.ex.py (or make a duplicate if you want to refer back to the example file) as `config.py`. This file is used to customize various parts of your application, such as MongoDB connections, admin access codes, etc...
### Docker Compose
The easiest way to deploy this application is to run it using Docker. To start you want to install docker and docker-compose. Documentation can be found [here](https://www.docker.com/).
### Running the App
To run the app use the command `docker-compose -f docker-compose-dev.yml up`.  To use the local database provided by Docker edit your `api/config.py` to contain the following values:
```
MONGO_DBNAME = 'expo-testing'
MONGO_HOST = 'mongodb://admin:password@db:27017/'
ADMIN_ACCESS_CODE = 'admin'
```
### Adding packages
To install new packages, you will want to drop into a Docker shell using this command `docker exec -ti <container-name> /bin/bash`. You can then run `pip3 install <package>`, and then to save it, run `pip3 freeze > requirements.txt`

## Manual Installation
### Virtualenv
We use virtualenv. To install on Linux/MacOS, make sure you have `python3` installed (using homebrew, `brew install python3`). Run `python3 -m venv venv` to create a virtual environment called `venv` in this directory. To use it, cd into this directory and run `source venv/bin/activate` on Linux/MacOS or `.\venv\Scripts\activate` on Windows.

Run `deactivate` to exit the virtual environment.

### Installation
Once in the virtualenv, run `pip3 install -r requirements.txt`. This installs the required packages.

### `config.py`
Rename config.ex.py (or make a duplicate if you want to refer back to the example file) as `config.py`. This file is used to customize various parts of your application, such as MongoDB connections, admin access codes, etc...

### Running
To run the server, just run `python3 server.py`. The Flask server is then accessible from http://127.0.0.1:5000/.

### Adding packages
To install new packages, just run `pip3 install <package>`, and then to save it, run `pip3 freeze > requirements.txt`


# Deployment
You can either deploy the api by manually setting up a http and proxy service, or by using Docker
## Through Docker
This is the easiest way to deploy. First install docker/docker-compose (docs [here]((https://www.docker.com/)), then run `nginx/init-letsencrypt.sh` to get your ssl cert and secure your application you can run the certbot script at `nginx/init-letsencrypt.sh`.
**Make sure to update the script with your domain name before running it.**
Also update the `nginx/nginx.conf` with your own url. After this just run `docker-compose up` and you will be up and running (optional `-d` flag to run it in detached mode).
## Without Docker
If you do not want to use Docker, we recommend using Gunicron and Nginx for your deployment.
### `config.py`
Rename config.ex.py (or make a duplicate if you want to refer back to the example file) as `config.py`. This file is used to customize various parts of your application, such as MongoDB connections, admin access codes, etc...
## AWS Deployment
If you want to deploy to AWS you can follow these steps.

1. Start a new EC2 instance. When choosing an image we recommend Ubuntu Server 18.04.
2. Choose what size instance you want.
3. Most of the other defaults will be ok to keep, however you will want to configure your security group to have port 80 and 443 open. SSH port should already be configured.

   | Type | Protocol | Port Range | Source |
   | --- | --- | --- | --- |
   | HTTPS | TCP | 443 | Anywhere |
   | HTTP | TCP | 80 | Anywhere |
4. You can then click review and launch, make sure to create and save a key pair or use an existing key.
5. Now you can go to your instances panel and view the public ip of the instance. You will want to point your DNS for your domain at it. **Note:** It might take a while for dns to propogate after this.
6. SSH into your machine using the key from earlier and install docker/docker compose. You can then clone this repo.
7. Setup ufw and allow ports 80 and 443. Instruction can be found [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04) .
7. Follow the rest of the [above](#Through-Docker).

---

# Testing
We use Pytest. From the root directory (one up from here), you can run

`sudo docker-compose -f docker-compose-test.yml up --abort-on-container-exit`

To run all the tests in a docker image.