import requests
import re

r = requests.get("http://127.0.0.1:5000/api/projects")
print(r.text)

data = re.findall('\"project_name\": \"(.+)\"', r.text)
projects = list(map(lambda x: x.strip(), data)) 
projects.sort()
print(projects)
print("Number of projects: " + str(len(projects)))