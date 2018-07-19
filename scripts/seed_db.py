import csv
import re


# Assumption: Given A1 -> N15
#  A1 ............ N15            1  16 ........ 196
#  A2			   N2             2  17			 197
#  .			   .              .  .			 .
#  .			   .       --->   .  .			 .
#  .			   .			  .  . 			 .
#  A15 ..........  N15			  15 30	........ 210


# gdi_devpost -> csv is dumb lmao
# moving -> list of hacks that can move
# notMoving -> list of hacks that can't move
# spots -> dict that goes table number:hack name
# assignments -> list of spots that are taken
gdi_devpost = "Does Your Hack Need To Stay At Your Current Table? (I.E. Hardware, Vr/Ar Hacks). If So, What Table Number Are You At?"
moving, notMoving = [], []
spots = {}
assignments = ["None | "] * 391

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
		ans = row[gdi_devpost]
		name = row['Submission Title'].strip()
		staying = needsToStay(ans)
		if (staying is None):
			moving.append(name)
		else:
			notMoving.append(name)
			spots[staying.group(0)] = name
			assignments[tableToNum(staying.group(0))] = name + " | "

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
		spots[numToTable(place)] = hacker

# prints it in the order shown above
def prettyPrint(assignments):
	for i in range(1, 26):
		start = (i - 1) * 15
		end = start + 15
		print(' '.join(assignments[start:end]))

def main():
	csvFile = open("sample-devpost-submissions-export.csv", 'rt', 
		encoding='ANSI')
	reader = csv.DictReader(csvFile)

	parseCSV(reader)
	seedHackers()
	prettyPrint(assignments)

if __name__== "__main__":
	main()