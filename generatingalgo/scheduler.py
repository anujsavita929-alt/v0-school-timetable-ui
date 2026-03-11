import random

def create_schedule(school, days, periods, rooms, labs):

    schedule = {}

    for class_name in school:

        schedule[class_name] = {}

        for section in school[class_name]:

            schedule[class_name][section] = {}

            subjects = list(school[class_name][section].keys())

            for d in range(days):

                schedule[class_name][section][d] = {}

                for p in range(periods):

                    subject = random.choice(subjects)

                    teacher = school[class_name][section][subject]["teacher"]

                    room = random.randint(1, rooms)

                    schedule[class_name][section][d][p] = {
                        "subject": subject,
                        "teacher": teacher,
                        "room": room
                    }

    return schedule