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


# gdi_devpost -> csv is dumb lmao
# moving -> list of projects that can move
# notMoving -> list of projects that can't move
# spots -> dict that goes table number:hack name
# assignments -> list of spots that are taken
gdi_devpost = "Does Your Hack Need To Stay At Your Current Table? " \
              "(I.E. Hardware, Vr/Ar Hacks). If So, What Table" \
              " Number Are You At?"
moving, notMoving = {}, {}
assignments = ["None | "] * 391


class Project:
    def __init__(self, project_url, attempted_challenges):
        self.project_url = project_url
        self.attempted_challenges = attempted_challenges
        self.table_number = ""

    def __str__(self):
        return str(self.table_number) + " " + str(self.project_url)


# table number to numeric value: A1 -> 1, N15 -> 210
def table_to_number(table):
    letter = table[0].upper()
    num = table[1:]
    return (ord(letter) - 65) * 15 + int(num)


# numeric value to table number: 210 -> N15, 1 -> A1
def number_to_table(number):
    letter = chr((int(number) - 1)//15 + 65)
    num = int(number) - (int(number) - 1)//15 * 15
    return str(letter) + str(num)


# checks if hacker responds with a table number, so they can't move
def needs_to_stay(response):
    return re.search('(\w\d+)', response)


# best domain name......
def format_challenges(attempted_challenges):
    output = []
    challenges = attempted_challenges.split(',')
    for challenge in challenges:
        data = challenge.split(' - ')
        print(data)
        prize = {
            'company': data[1],
            'challenge': data[0],
            'winner': 'false'
        }
        output.append(prize)
    return jsonify({'Attempted Challenges': output})


def already_in_db():
    r = requests.get("http://127.0.0.1:5000/api/projects")
    data = re.findall('\"project_name\": \"(.+)\"', r.text)
    projects = list(map(lambda x: x.strip(), data))
    return projects


# parses devpost csv and separates hackers into two groups
# can't move: assigns table and spot, adds notMoving list
# can move: adds to moving list
def parseCSV(reader):
    already_stored = already_in_db()
    for row in reader:
        project_name = row["Submission Title"]
        project_url = row["Submission Url"]
        #attempted_challenges = format_challenges(row["Desired Prizes"])
        attempted_challenges = row["Desired Prizes"]

        name = row['Submission Title'].strip()
        if name not in already_stored:
            staying = needs_to_stay(row[gdi_devpost])
            if (staying is None):
                moving[project_name] = Project(project_url, attempted_challenges)
            else:
                notMoving[project_name] = Project(project_url, attempted_challenges)
                assignments[table_to_number(staying.group(0))] = name + " | "
                notMoving[project_name].table_number = staying.group(0)


def seedHackers():
    place = 0
    skip = 391//len(moving)
    for hacker in moving:
        while (assignments[place] != "None | "):
            place = (place + 1) % 391
        assignments[place] = hacker + " | "
        place = (place + skip) % 391
        moving[hacker].table_number = number_to_table(place)


def add_project(projects):
    url = "http://127.0.0.1:5000/api/projects/add"
    count = 0
    for project_name in projects:
        count += 1
        info = {
            'table_number': projects[project_name].table_number,
            'project_name': project_name,
            'project_url': projects[project_name].project_url,
            'attempted_challenges': projects[project_name].attempted_challenges,
            'challenges_won': ""
        }
        r = requests.post(url, json=info)


def main():
    csvFile = open("sample-devpost-submissions-export.csv", 'rt',
                   encoding='ANSI')
    reader = csv.DictReader(csvFile)

    parseCSV(reader)
    seedHackers()
    add_project(notMoving)
    add_project(moving)

if __name__ == "__main__":
    main()
