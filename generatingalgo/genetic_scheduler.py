import random
import json
import sys

class TimetableGA:
    def __init__(self, data):
        # Input format change: data now contains 'classes' and 'config'
        self.classes_input = data.get('classes', [])
        self.config = data.get('config', {})
        
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.total_periods = self.config.get('totalPeriodsPerDay', 8)
        self.bell_times = self.config.get('bellTimes', [])
        self.labs = self.config.get('labs', [])
        
        # Determine which periods are actually available (not breaks)
        self.active_periods = sorted([
            bt['periodNumber'] - 1 # 0-indexed for the algorithm
            for bt in self.bell_times if not bt.get('isBreak', False)
        ])
        
        self.population_size = 30
        self.generations = 50

    def solve(self):
        if not self.classes_input:
            return {"error": "No classes provided"}
            
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

        return self.fill_gaps(population[0])

    def fill_gaps(self, schedule):
        for cls_num in schedule:
            for sec_name in schedule[cls_num]:
                existing_slots = {(s['day'], s['period']) for s in schedule[cls_num][sec_name]}
                filled_sessions = list(schedule[cls_num][sec_name])
                
                for day in self.days:
                    day_slots = sorted([p for d, p in existing_slots if d == day])
                    if not day_slots: continue
                    
                    min_p, max_p = min(day_slots), max(day_slots)
                    # Only fill gaps within the active periods range
                    for p in self.active_periods:
                        if p < min_p or p > max_p: continue
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
        # Get available labs
        available_labs = [l['name'] for l in self.labs if l.get('isAvailable', True)]
        
        for cls in self.classes_input:
            cls_num = cls['number']
            schedule[cls_num] = {}
            for sec in cls['sections']:
                sec_name = sec['name']
                schedule[cls_num][sec_name] = []
                
                sessions = []
                for sub in sec['subjects']:
                    for _ in range(sub['maxPeriods']):
                        lab_name = random.choice(available_labs) if sub['isLab'] and available_labs else "Lab-X"
                        sessions.append({
                            'subject': sub['name'],
                            'teacher': sub['teacher'],
                            'priority': sub['priority'],
                            'isLab': sub['isLab'],
                            'room': f"Room {cls_num}-{sec_name}" if not sub['isLab'] else lab_name
                        })
                
                # Use only active periods for scheduling
                slots = [(d, p) for d in self.days for p in self.active_periods]
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
        room_load = {} # day, period, room -> count
        
        for cls_num, sections in schedule.items():
            for sec_name, sessions in sections.items():
                day_sessions = {}
                day_sub_count = {}
                
                for s in sessions:
                    # Teacher Collision
                    t_key = (s['day'], s['period'], s['teacher'])
                    if s['teacher'] != 'N/A':
                        teacher_load[t_key] = teacher_load.get(t_key, 0) + 1
                        if teacher_load[t_key] > 1: penalties += 1000
                    
                    # Room/Lab Collision
                    r_key = (s['day'], s['period'], s['room'])
                    room_load[r_key] = room_load.get(r_key, 0) + 1
                    if room_load[r_key] > 1: penalties += 500
                    
                    # Morning Priority (High priority subjects in first 3 active periods)
                    first_slots = self.active_periods[:3]
                    if s['priority'] >= 4 and s['period'] not in first_slots: penalties += 50
                    
                    # Subject frequency limit (Max 2 of same subject per day)
                    ds_key = (s['day'], s['subject'])
                    day_sub_count[ds_key] = day_sub_count.get(ds_key, 0) + 1
                    if day_sub_count[ds_key] > 2: penalties += 30
                    
                    day_sessions.setdefault(s['day'], []).append(s['period'])
                
                for day, periods in day_sessions.items():
                    if not periods: continue
                    periods.sort()
                    
                    # Compactness Penalty
                    # We check for gaps within the active periods that are between min and max assigned periods
                    span_range = [p for p in self.active_periods if min(periods) <= p <= max(periods)]
                    gaps = len(span_range) - len(periods)
                    penalties += gaps * 25
                    
                    # Start early bonus (if starts at the very first active period)
                    if min(periods) > self.active_periods[0]: penalties += 20
        
        return 1 / (1 + penalties)

    def crossover(self, p1, p2):
        child = {}
        for k in p1.keys():
            child[k] = p1[k] if random.random() > 0.5 else p2[k]
        return child

    def mutate(self, schedule):
        cls = random.choice(list(schedule.keys()))
        if not schedule[cls]: return
        sec = random.choice(list(schedule[cls].keys()))
        if len(schedule[cls][sec]) > 2:
            i1, i2 = random.sample(range(len(schedule[cls][sec])), 2)
            s1, s2 = schedule[cls][sec][i1], schedule[cls][sec][i2]
            s1['day'], s2['day'] = s2['day'], s1['day']
            s1['period'], s2['period'] = s2['period'], s1['period']

if __name__ == "__main__":
    try:
        input_raw = sys.stdin.read()
        if not input_raw:
             print(json.dumps({"error": "No input received"}))
             sys.exit(1)
        input_data = json.loads(input_raw)
        ga = TimetableGA(input_data)
        print(json.dumps(ga.solve()))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
