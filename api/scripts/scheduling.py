
from datetime import timedelta
import pytz

# create a timezone object for East Coast
ny_timezone = pytz.timezone('America/New_York')


def find_common_availability(proj, challenge):
    """
    Finds minimum index of True value (available). Returns -1 if it doesn't exist. 
    """
    for i in range(len(proj)):
        if proj[i] and challenge[i] > 0:
            return i
    
    return -1

def index_to_time(index, interval, start_time):
    """
    Converting from an index time slot to an actual time using an interval, index, and the start time
    """
    time = start_time + timedelta(minutes=interval*index)

    return time.astimezone(ny_timezone)


    