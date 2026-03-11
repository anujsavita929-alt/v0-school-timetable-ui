def check_teacher_conflicts(schedule):

    teacher_busy = {}

    conflicts = 0

    for class_name in schedule:
        for section in schedule[class_name]:
            for day in schedule[class_name][section]:
                for period in schedule[class_name][section][day]:

                    teacher = schedule[class_name][section][day][period]["teacher"]

                    key = (day, period)

                    if key not in teacher_busy:
                        teacher_busy[key] = []

                    if teacher in teacher_busy[key]:
                        conflicts += 1
                    else:
                        teacher_busy[key].append(teacher)

    return conflicts