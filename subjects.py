import psycopg2

DB_NAME = "coursesdb"
DB_USER = "root"
DB_PASS = "password"
DB_HOST = "localhost"
DB_PORT = "5432"

def create_unique_courses_table():
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )
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
    print(f"[✅] Table 'unique_courses' created successfully with {count} rows.")

    cur.close()
    conn.close()

if __name__ == "__main__":
    create_unique_courses_table()