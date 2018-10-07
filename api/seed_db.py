import csv
import re
import requests
import json
import time


# Assumption: Given A1 -> N15
#  A1 ............ N15            1  16 ........ 196
#  A2              N2             2  17          197
#  .               .              .  .           .
#  .               .       --->   .  .           .
#  .               .              .  .           .
#  A15 ..........  N15            15 30 ........ 210

# Global variables:
# moving -> list of projects that can move
# not_moving -> list of projects that can't move
# spots -> dict that goes table number:hack name
# assignments -> list of spots that are taken

# TODO: remove this comment block, don't need.
# # gdi_devpost -> csv is dumb lmao
# gdi_devpost = "Does Your Hack Need To Stay At Your Current Table? " \
#               "(I.E. Hardware, Vr/Ar Hacks). If So, What Table" \
#               " Number Are You At?"

moving, not_moving = {}, {}

# number of tables available
# assume 10 spots per table
num_tables = 26
spots_per_table = 10
assignments = ["None | "] * (num_tables * spots_per_table)


class Project:
    def __init__(self, project_url, challenges):
        self.project_url = project_url
        self.challenges = challenges
        self.table_number = ""

    def __str__(self):
        return str(self.table_number) + " " + str(self.project_url)


# table number to numeric value: A1 -> 1, O10 -> 150
def table_to_number(table):
    letter = table[0].upper()
    num = table[1:]
    return (ord(letter) - 65) * spots_per_table + int(num)


# numeric value to table number: 150 -> O10, A1 -> 1
def number_to_table(number):
    letter = chr((int(number) - 1)//spots_per_table + 65)
    num = int(number) - (int(number) - 1)//spots_per_table * spots_per_table
    return str(letter) + str(num)


# checks if hacker responds with a table number, so they can't move
# can match table numbers which are either purely numerical or prefixed by A-Z
def check_if_needs_to_stay(response):
    return re.search('([a-zA-Z]*\d+)', response)


# best domain name......
def format_challenges(challenges):
    challenges_list = []
    if challenges is not "":
        challenges = challenges.split(',')
        for challenge in challenges:
            # TODO: possibly look into creating a hash from companies DB
            # instead of hard coding the dash separator rule
            data = str.strip(challenge).split(' - ')
            prize = {
                'company': data[1],
                'challenge_name': data[0],
                'won': False
            }
            challenges_list.append(prize)
    return challenges_list


# not used but just still here
def already_in_db():
    r = requests.get("http://127.0.0.1:5000/api/projects")
    data = re.findall('\"project_name\": \"(.+)\"', r.text)
    projects = list(map(lambda x: x.strip(), data))
    return projects


# parses devpost csv and separates hackers into two groups
# can't move: assigns table and spot, adds not_moving list
# can move: adds to moving list
def parse_csv_internal(reader, not_moving_question=None):
    #already_stored = already_in_db()
    for row in reader:
        project_name = row["Submission Title"]
        project_url = row["Submission Url"]
        challenges = format_challenges(row["Desired Prizes"])

        if not_moving_question is None:
            needs_to_stay = None
            response = None
        else:
            # If config file has a question string defined for Devpost question
            # asking if project shouldn't move, then get curr row's response
            response = row[not_moving_question]
            needs_to_stay = check_if_needs_to_stay(response)

        name = row['Submission Title'].strip()
        if needs_to_stay is not None:
            not_moving[project_name] = Project(project_url, challenges)
            assignments[table_to_number(needs_to_stay.group(0))] = name + " | "
            not_moving[project_name].table_number = needs_to_stay.group(0)
        else:
            moving[project_name] = Project(project_url, challenges)
    return moving, not_moving


# evenly spreads out hackers amongst available seats
def fancy_seed_hackers():
    place = 0
    skip = 391//len(moving)
    for hacker in moving:
        while (assignments[place] != "None | "):
            place = (place + 1) % 391
        assignments[place] = hacker + " | "
        moving[hacker].table_number = number_to_table(place)
        place = (place + skip) % 391


# normal seeding
def seed_hackers():
    place = 0
    for hacker in moving:
        while (assignments[place] != "None | "):
            place = place + 1
        assignments[place] = hacker + " | "
        moving[hacker].table_number = number_to_table(place)


def add_project(projects):
    url = "http://127.0.0.1:5000/api/projects/add"

    for project_name in projects:
        info = {
            'table_number': projects[project_name].table_number,
            'project_name': project_name,
            'project_url': projects[project_name].project_url,
            'challenges': projects[project_name].challenges,
            'challenges_won': []
        }
        r = requests.post(url, json=info)



def bulk_add_projects_local(projects):
    url = 'http://127.0.0.1:5000/api/projects/bulk_add'
    project_data = []
    for project_name in projects:
        info = {
            'table_number': projects[project_name].table_number,
            'project_name': project_name,
            'project_url': projects[project_name].project_url,
            'challenges': projects[project_name].challenges,
            'challenges_won': []
        }
        project_data.append(info)
    packet = {
        'projects': project_data
    }
    r = requests.post(url, json=packet)



def main():
    # csvFile = open("sample-devpost-submissions-export.csv", 'rt')
    # reader = csv.DictReader(csvFile)
    reader = csv.DictReader(open("sample-devpost-submissions-export.csv", "rt", encoding="utf8", errors='ignore'))

    parse_csv_internal(reader)
    seed_hackers()
    # fancy_seed_hackers()
    #add_project(not_moving)
    #add_project(moving)
    bulk_add_projects_local(not_moving)
    bulk_add_projects_local(moving)


if __name__ == "__main__":
    main()
