import csv
import re
import requests
import json

def tableToNum(table):
	letter = table[0].upper()
	num = table[1:]
	return (ord(letter) - 65) * 15 + int(num)

# numeric value to table number: 210 -> N15, 1 -> A1
def numToTable(number):
	letter = chr((int(number) - 1)//15 + 65)
	num = int(number) - (int(number) - 1)//15 * 15
	return str(letter) + str(num)

def available_tables():
	r = requests.get("http://127.0.0.1:5000/api/projects")
	print(r.text)
	taken = re.findall('\"table_number\": \"(\w\d+)\"', r.text)
	taken.sort()
	print(taken)

def main():
	project_name = input('What is the project name? ')      
	attempted_challenges = input('What prizes are they signed up for? ')
	available_tables()

if __name__== "__main__":
	main()