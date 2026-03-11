import csv

def export_timetable(schedule):

    with open("data/timetable.csv", "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            "Class", "Section", "Day", "Period", "Subject", "Teacher", "Room"
        ])

        for class_name in schedule:

            for section in schedule[class_name]:

                for day in schedule[class_name][section]:

                    for period in schedule[class_name][section][day]:

                        slot = schedule[class_name][section][day][period]

                        writer.writerow([
                            class_name,
                            section,
                            day + 1,
                            period + 1,
                            slot["subject"],
                            slot["teacher"],
                            slot["room"]
                        ])