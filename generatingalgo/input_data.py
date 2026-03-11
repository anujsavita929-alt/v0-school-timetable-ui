def get_school_data():

    days = int(input("Enter number of days: "))
    periods = int(input("Enter periods per day: "))

    classes = int(input("Enter number of classes: "))

    school = {}

    for c in range(classes):

        class_name = input(f"\nEnter class name {c+1}: ")
        sections = int(input("Number of sections: "))

        school[class_name] = {}

        for s in range(sections):

            section = input("Section name: ")
            subjects_count = int(input("Number of subjects: "))

            subjects = {}

            for i in range(subjects_count):

                subject = input("Subject: ")
                teacher = input("Teacher: ")
                limit = int(input("Weekly periods: "))
                lab = input("Lab required (y/n): ") == "y"

                subjects[subject] = {
                    "teacher": teacher,
                    "limit": limit,
                    "lab": lab
                }

            school[class_name][section] = subjects

    rooms = int(input("Number of rooms: "))
    labs = int(input("Number of labs: "))

    return school, days, periods, rooms, labs