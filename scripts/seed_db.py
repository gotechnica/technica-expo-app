import csv
import re
import requests
import json
import time

# Assumption: Given A1 -> N15
#  A1 ............ N15            1  16 ........ 196
#  A2			   N2             2  17			 197
#  .			   .              .  .			 .
#  .			   .       --->   .  .			 .
#  .			   .			  .  . 			 .
#  A15 ..........  N15			  15 30	........ 210


# gdi_devpost -> csv is dumb lmao
# moving -> list of projects that can move
# notMoving -> list of projects that can't move
# spots -> dict that goes table number:hack name
# assignments -> list of spots that are taken
gdi_devpost = "Does Your Hack Need To Stay At Your Current Table? (I.E. Hardware, Vr/Ar Hacks). If So, What Table Number Are You At?"
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
def tableToNum(table):
	letter = table[0].upper()
	num = table[1:]
	return (ord(letter) - 65) * 15 + int(num)

# numeric value to table number: 210 -> N15, 1 -> A1
def numToTable(number):
	letter = chr((int(number) - 1)//15 + 65)
	num = int(number) - (int(number) - 1)//15 * 15
	return str(letter) + str(num)

# checks if hacker responds with a table number, so they can't move 
def needsToStay(response):
	return re.search('(\w\d+)', response)

# parses devpost csv and separates hackers into two groups
# can't move: assigns table and spot, adds notMoving list 
# can move: adds to moving list
def parseCSV(reader):
	for row in reader:
		project_name = row["Submission Title"]
		project_url = row["Submission Url"]
		attempted_challenges = row["Desired Prizes"]

		name = row['Submission Title'].strip()
		staying = needsToStay(row[gdi_devpost])
		if (staying is None):
			moving[project_name] = Project(project_url, attempted_challenges)
		else:
			notMoving[project_name] = Project(project_url, attempted_challenges)
			assignments[tableToNum(staying.group(0))] = name + " | "
			notMoving[project_name].table_number = staying.group(0)

# takes remaining hackers in moving list and spreads them 
# around the remaining open spots
def seedHackers():
	place = 0
	skip = 391//len(moving)
	for hacker in moving:
		while (assignments[place] != "None | "):
			place = (place + 1)%391
		assignments[place] = hacker + " | "
		place = (place + skip)%391
		moving[hacker].table_number = numToTable(place)

# prints it in the order shown above
def prettyPrint(assignments):
	for i in range(1, 26):
		start = (i - 1) * 15
		end = start + 15
		print(' '.join(assignments[start:end]))

# seeds all projects 
def add_project(projects):
	url = "http://127.0.0.1:5000/api/projects/add"
	for project_name in projects:
		data = {
			'table_number': projects[project_name].table_number,
		    'project_name': project_name,
		    'project_url': projects[project_name].project_url,
		    'attempted_challenges': projects[project_name].attempted_challenges,
		    'challenges_won': ""
		}
		req = requests.Request('POST', url, data=json.dumps(data))
		prepared = req.prepare()
		pretty_print_POST(prepared)

		s = requests.Session()
		r = s.send(prepared)

		#r = requests.post(url, data=json.dumps(data))
		print(r.text)
		print('\n\n\n\n\n\n')
		time.sleep(2)

# just prints all projects from DB
def get_all_projects():
	r = requests.get("http://127.0.0.1:5000/api/projects")
	print(r.text)

# helper method for printing stuff
def pretty_print_POST(req):
    print('{}\n{}\n{}\n\n{}'.format(
        '-----------START-----------',
        req.method + ' ' + req.url,
        '\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
        req.body,
    ))

def main():
	csvFile = open("sample-devpost-submissions-export.csv", 'rt', 
		encoding='ANSI')
	reader = csv.DictReader(csvFile)

	parseCSV(reader)
	seedHackers()
#	prettyPrint(assignments)
	add_project(notMoving)
	add_project(moving)
#	get_all_projects()

if __name__== "__main__":
	main()