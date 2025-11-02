import psycopg2
import csv

# DB connection
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="Cfgecamp@1",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Drop and recreate table
cur.execute("DROP TABLE IF EXISTS courses;")
cur.execute("""
CREATE TABLE courses (
    subject_name TEXT,
    course_code TEXT,
    course_title TEXT,
    option_number INT,
    component TEXT,
    class_nbr INT,
    section TEXT,
    meeting_start_date DATE,
    meeting_end_date DATE,
    day TEXT,
    start_time TEXT,
    end_time TEXT,
    room TEXT,
    instructor TEXT,
    seats_open INT,
    seats_cap INT
);
""")
conn.commit()

def clean_value(v):
    return None if v.strip() == "" else v

# Read CSV + insert
with open("database/courses.csv", newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        for k, v in row.items():
            row[k] = clean_value(v)
        cur.execute("""
            INSERT INTO courses (
                subject_name, course_code, course_title, option_number, component,
                class_nbr, section, meeting_start_date, meeting_end_date, day,
                start_time, end_time, room, instructor, seats_open, seats_cap
            ) VALUES (
                %(subject_name)s, %(course_code)s, %(course_title)s, %(option_number)s, %(component)s,
                %(class_nbr)s, %(section)s, %(meeting_start_date)s, %(meeting_end_date)s, %(day)s,
                %(start_time)s, %(end_time)s, %(room)s, %(instructor)s, %(seats_open)s, %(seats_cap)s
            )
        """, row)

conn.commit()

# Verify row count
cur.execute("SELECT COUNT(*) FROM courses;")
count = cur.fetchone()[0]
print(f"Successfully inserted {count} rows into 'courses' table.")

cur.close()
conn.close()