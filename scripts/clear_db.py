import csv
import re
import requests
import json


def delete_project():
    project_name = input('What is the project name? ')
    password = input('What is the password? ')

    url = "http://127.0.0.1:5000/api/projects/delete"

    payload = {
        'project_name': project_name,
        'password': password
    }
    r = requests.delete(url, json=payload)
    print(r.url)


def delete_all_projects():
    password = input('What is the password? ')

    url = "http://127.0.0.1:5000/api/projects/deleteAll"

    payload = {
        'password': password
    }
    r = requests.delete(url, json=payload)


def main():
    #delete_project()
    delete_all_projects()

if __name__ == "__main__":
    main()
