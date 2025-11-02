import sys, os
import psycopg2
import csv

# ✅ Add parent directory (Scheduler/) to Python path before any imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scheduler import connect_db  # Now Python can find scheduler.py


def rebuild_courses_table():
    conn = connect_db()
    cur = conn.cursor()

    # Drop old table
    cur.execute("DROP TABLE IF EXISTS courses;")

    # Recreate structure
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

    # CSV path
    csv_path = os.path.join(os.path.dirname(__file__), "courses.csv")

    def clean_value(v):
        return None if v.strip() == "" else v

    # Insert data
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            for k, v in row.items():
                row[k] = clean_value(v)
            cur.execute("""
                INSERT INTO courses (
                    subject_name, course_code, course_title, option_number,
                    component, class_nbr, section, meeting_start_date,
                    meeting_end_date, day, start_time, end_time, room,
                    instructor, seats_open, seats_cap
                ) VALUES (
                    %(subject_name)s, %(course_code)s, %(course_title)s, %(option_number)s,
                    %(component)s, %(class_nbr)s, %(section)s, %(meeting_start_date)s,
                    %(meeting_end_date)s, %(day)s, %(start_time)s, %(end_time)s,
                    %(room)s, %(instructor)s, %(seats_open)s, %(seats_cap)s
                );
            """, row)

    conn.commit()

    # Verify count
    cur.execute("SELECT COUNT(*) FROM courses;")
    row = cur.fetchone()
    count = row["count"] if isinstance(row, dict) else row[0]
    print(f"✅ Successfully inserted {count} rows into 'courses' table.")

    cur.close()
    conn.close()


if __name__ == "__main__":
    rebuild_courses_table()