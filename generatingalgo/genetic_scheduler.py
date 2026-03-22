import random
import json
import sys

class TimetableGA:
    def __init__(self, data):
        self.classes_input = data
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.periods_per_day = 8 # 3 before lunch, 5 after
        self.population_size = 30
        self.generations = 50

    def solve(self):
        population = [self.generate_random_schedule() for _ in range(self.population_size)]
        
        for generation in range(self.generations):
            population = sorted(population, key=lambda x: self.calculate_fitness(x), reverse=True)
            if self.calculate_fitness(population[0]) >= 0.999: break
            
            new_pop = population[:5] # Elitism
            while len(new_pop) < self.population_size:
                p1, p2 = random.sample(population[:15], 2)
                child = self.crossover(p1, p2)
                self.mutate(child)
                new_pop.append(child)
            population = new_pop

        # Post-process: Add "Study/Library" periods for gaps if day is too empty
        return self.fill_gaps(population[0])

    def fill_gaps(self, schedule):
        # Auto-fill gaps with constructive activities to make it look "Effective"
        for cls_num in schedule:
            for sec_name in schedule[cls_num]:
                existing_slots = {(s['day'], s['period']) for s in schedule[cls_num][sec_name]}
                filled_sessions = list(schedule[cls_num][sec_name])
                
                # If a day has classes but also many gaps, add "Self Study" in the middle
                for day in self.days:
                    day_slots = sorted([p for d, p in existing_slots if d == day])
                    if not day_slots: continue
                    
                    min_p, max_p = min(day_slots), max(day_slots)
                    for p in range(min_p, max_p + 1):
                        if (day, p) not in existing_slots:
                            filled_sessions.append({
                                'subject': 'Self Study',
                                'teacher': 'N/A',
                                'priority': 0,
                                'isLab': False,
                                'room': 'Library',
                                'day': day,
                                'period': p,
                                'isAutoFill': True
                            })
                schedule[cls_num][sec_name] = filled_sessions
        return schedule

    def generate_random_schedule(self):
        schedule = {}
        for cls in self.classes_input:
            cls_num = cls['number']
            schedule[cls_num] = {}
            for sec in cls['sections']:
                sec_name = sec['name']
                schedule[cls_num][sec_name] = []
                
                # Pool of sessions to schedule
                sessions = []
                for sub in sec['subjects']:
                    for _ in range(sub['maxPeriods']):
                        sessions.append({
                            'subject': sub['name'],
                            'teacher': sub['teacher'],
                            'priority': sub['priority'],
                            'isLab': sub['isLab'],
                            'room': f"Room {cls_num}-{sec_name}" if not sub['isLab'] else "Lab-X"
                        })
                
                slots = [(d, p) for d in self.days for p in range(self.periods_per_day)]
                random.shuffle(slots)
                
                for i, sess in enumerate(sessions):
                    if i < len(slots):
                        d, p = slots[i]
                        sess.update({'day': d, 'period': p})
                        schedule[cls_num][sec_name].append(sess)
        return schedule

    def calculate_fitness(self, schedule):
        penalties = 0
        teacher_load = {}
        
        for cls_num, sections in schedule.items():
            for sec_name, sessions in sections.items():
                day_sessions = {} # day -> list of periods
                day_sub_count = {}
                
                for s in sessions:
                    # Teacher Collision
                    t_key = (s['day'], s['period'], s['teacher'])
                    teacher_load[t_key] = teacher_load.get(t_key, 0) + 1
                    if teacher_load[t_key] > 1: penalties += 1000 # Critical
                    
                    # Morning Priority
                    if s['priority'] >= 4 and s['period'] > 3: penalties += 50
                    
                    # Subject frequency limit
                    ds_key = (s['day'], s['subject'])
                    day_sub_count[ds_key] = day_sub_count.get(ds_key, 0) + 1
                    if day_sub_count[ds_key] > 2: penalties += 30
                    
                    # Track periods per day for compactness
                    day_sessions.setdefault(s['day'], []).append(s['period'])
                
                # Compactness Penalty: gaps between min and max period of the day
                for day, periods in day_sessions.items():
                    if not periods: continue
                    periods.sort()
                    span = max(periods) - min(periods) + 1
                    gaps = span - len(periods)
                    penalties += gaps * 25 # High penalty for holes
                    
                    # Bonus for starting early (not starting after period 2)
                    if min(periods) > 1: penalties += 20
        
        return 1 / (1 + penalties)

    def crossover(self, p1, p2):
        child = {}
        for k in p1.keys():
            child[k] = p1[k] if random.random() > 0.5 else p2[k]
        return child

    def mutate(self, schedule):
        cls = random.choice(list(schedule.keys()))
        sec = random.choice(list(schedule[cls].keys()))
        if len(schedule[cls][sec]) > 2:
            i1, i2 = random.sample(range(len(schedule[cls][sec])), 2)
            s1, s2 = schedule[cls][sec][i1], schedule[cls][sec][i2]
            s1['day'], s2['day'] = s2['day'], s1['day']
            s1['period'], s2['period'] = s2['period'], s1['period']

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        ga = TimetableGA(input_data)
        print(json.dumps(ga.solve()))
    except:
        print(json.dumps({"error": "Invalid input"}))
