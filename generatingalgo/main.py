from input_data import get_school_data
from genetic_algorithm import generate_timetable
from export_csv import export_timetable

def main():

    school, days, periods, rooms, labs = get_school_data()

    timetable = generate_timetable(school, days, periods, rooms, labs)

    export_timetable(timetable)

    print("\nTimetable Generated Successfully!")

if __name__ == "__main__":
    main()