import requests
import re

r = requests.get("https://expo-api.gotechnica.org/api/projects")

data = re.findall('\"project_name\": \"(.+)\"', r.text)
projects = list(map(lambda x: x.strip(), data))
projects.sort()
print(projects)
print("Number of projects: " + str(len(projects)))
