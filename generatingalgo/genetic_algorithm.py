import random
from scheduler import create_schedule
from conflict_checker import check_teacher_conflicts

POP_SIZE = 30
GENERATIONS = 50

def fitness(schedule):

    conflicts = check_teacher_conflicts(schedule)

    return -conflicts


def generate_timetable(school, days, periods, rooms, labs):

    population = [
        create_schedule(school, days, periods, rooms, labs)
        for _ in range(POP_SIZE)
    ]

    for g in range(GENERATIONS):

        population = sorted(population, key=fitness, reverse=True)

        new_population = population[:10]

        while len(new_population) < POP_SIZE:

            child = create_schedule(school, days, periods, rooms, labs)

            new_population.append(child)

        population = new_population

    return population[0]