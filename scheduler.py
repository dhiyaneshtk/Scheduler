import psycopg2
import json
from itertools import product
from datetime import time

DB_NAME = "coursesdb"
DB_USER = "root"
DB_PASS = "password"
DB_HOST = "localhost"
DB_PORT = "5432"


def connect_db():
    return psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )

def time_overlap(a_start, a_end, b_start, b_end):
    if not all([a_start, a_end, b_start, b_end]):
        return False
    return not (a_end <= b_start or b_end <= a_start)

def fetch_courses(course_codes):
    conn = connect_db()
    cur = conn.cursor()

    placeholders = ','.join(['%s'] * len(course_codes))
    query = f"""
        SELECT subject_name, course_code, course_title, section, day,
               start_time, end_time, instructor, room
        FROM courses
        WHERE course_code IN ({placeholders});
    """
    cur.execute(query, course_codes)
    rows = cur.fetchall()

    # Organize by course_code
    data = {}
    for r in rows:
        subject_name, code, title, section, days, start, end, instructor, room = r
        data.setdefault(code, []).append({
            "course_title": title,
            "section": section,
            "days": days.split("|") if "|" in days else [days],
            "start_time": start.strip(),
            "end_time": end.strip(),
            "instructor": instructor,
            "room": room
        })

    conn.close()
    return data


def parse_time(t):
    """
    Safely parse messy time strings like:
    '14:00 | 14:00' → 14:00
    '08:00 ' → 08:00
    'TBA' or '' → return None
    """
    if not t or "TBA" in t:
        return None

    # Take the first valid time before any "|"
    t = t.split("|")[0].strip()

    try:
        h, m = map(int, t.split(":"))
        return time(h, m)
    except Exception:
        return None


def time_overlap(a_start, a_end, b_start, b_end):
    return not (a_end <= b_start or b_end <= a_start)


def schedule_conflicts(schedule):
    """Return True if any courses in the schedule overlap"""
    for i in range(len(schedule)):
        for j in range(i + 1, len(schedule)):
            a = schedule[i]
            b = schedule[j]
            for d1 in a["days"]:
                for d2 in b["days"]:
                    if d1.strip() == d2.strip():
                        if time_overlap(
                            parse_time(a["start_time"]), parse_time(a["end_time"]),
                            parse_time(b["start_time"]), parse_time(b["end_time"])
                        ):
                            return True
    return False


def generate_schedules(course_codes, preferences=None):
    """
    preferences = {
        "exclude": [("Monday", "09:00", "12:00"), ("Friday", "14:00", "17:00")],
        "include": [("Tuesday", "10:00", "16:00")]
    }
    """
    all_courses = fetch_courses(course_codes)

    # Generate all combinations (1 section per course)
    all_combos = list(product(*all_courses.values()))
    valid_schedules = []

    for combo in all_combos:
        # Apply time restrictions
        skip = False
        if preferences:
            for day, start, end in preferences.get("exclude", []):
                for c in combo:
                    if day in [d.strip() for d in c["days"]]:
                        if time_overlap(parse_time(start), parse_time(end),
                                        parse_time(c["start_time"]), parse_time(c["end_time"])):
                            skip = True
                            break
                if skip:
                    break
        if skip:
            continue

        # Check conflicts
        if not schedule_conflicts(combo):
            valid_schedules.append(combo)

    # Output as JSON
    return json.dumps(valid_schedules, indent=2)


# Example use
if __name__ == "__main__":
    course_list = ["DDDD 102", "DDDD 207", "DDDD 301"]
    prefs = {
        "exclude": [("Friday", "08:00", "12:00")],
        "include": [("Tuesday", "09:00", "18:00")]
    }

    result_json = generate_schedules(course_list, prefs)
    print(result_json)