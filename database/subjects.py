import psycopg2
import yaml
import os
from scheduler import connect_db

def create_unique_courses_table():
    conn = connect_db()
    cur = conn.cursor()

    # Drop + recreate table
    cur.execute("""
        DROP TABLE IF EXISTS unique_courses;
        CREATE TABLE unique_courses AS
        SELECT DISTINCT
            course_code,
            course_title,
            MIN(subject_name) AS subject_name
        FROM courses
        GROUP BY course_code, course_title
        ORDER BY course_code;
    """)

    conn.commit()

    # Verify number of rows
    cur.execute("SELECT COUNT(*) FROM unique_courses;")
    count = cur.fetchone()[0]
    print(f"Table 'unique_courses' created successfully with {count} rows.")

    cur.close()
    conn.close()

if __name__ == "__main__":
    create_unique_courses_table()