# from collections import defaultdict

# def schedule_judging(judging_length=10):

#     projects = mongo.db.projects 
#     projects = projects.find()
#     categories = []
#     teams = []
#     team_availability = defaultdict()
#     cat_availability = defaultdict()

#     start_time = 0
#     end_time = 100

#     for cat in categories: 
#         cat_slot = 0
#         scheduled = False
#         cat_teams = [] # fill

#         while not scheduled:
#             team, time = find_earliest_time(cat_teams, cat_slot)

#             if team is not None:
#                 team_availability[team][time] = False # set team availability to False
#                 scheduled = True
#                 cat_slot = 0 # get_next_time
#             else:
#                 return -1
                    

#     return 0

# def is_available(start_time, team, availability):
#     if availability[team] >= start_time:
#         return True
#     return False

# def find_earliest_time(teams, start_time):
#     min_time = float('inf')
#     min_team = None
#     for team in teams:
#         try:
#             index = teams.index(True, start_time)
#         except ValueError:
#             index = -1
        
#         if index != -1:
#             if index < min_time:
#                 min_time = index
#                 min_team = team
    
#     return min_team, min_time

# def get_next_availability(item):
#     pass

from datetime import timedelta
import pytz

# create a timezone object for East Coast
ny_timezone = pytz.timezone('America/New_York')


def find_common_availability(a1, a2):
    """
    Finds minimum index of True value (available). Returns -1 if it doesn't exist. 
    """
    for i in range(len(a1)):
        if a1[i] and a2[i]:
            return i
    
    return -1

def index_to_time(index, interval, start_time):
    """
    Converting from an index time slot to an actual time using an interval, index, and the start time
    """
    time = start_time + timedelta(minutes=interval*index)

    return time.astimezone(ny_timezone)


    