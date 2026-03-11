import json
from genetic_algorithm import generate_timetable

def run_scheduler(data):

    school = data["school"]
    days = data["days"]
    periods = data["periods"]
    rooms = data["rooms"]
    labs = data["labs"]

    timetable = generate_timetable(school, days, periods, rooms, labs)

    return timetable


if __name__ == "__main__":

    import sys

    input_data = json.loads(sys.stdin.read())

    result = run_scheduler(input_data)

    print(json.dumps(result))