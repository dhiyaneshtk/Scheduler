from flask import jsonify
from flask_restful import Resource
from scheduler import connect_db


class Course(Resource):
    """
    RESTful resource to fetch course data from PostgreSQL
    """

    def get(self):
        """
        Returns all available courses (for search)
        """
        sql = """
        SELECT DISTINCT
            subject_name,
            course_code,
            course_title
        FROM courses
        ORDER BY subject_name, course_code;
        """

        conn = connect_db()
        cur = conn.cursor()
        cur.execute(sql)
        tuple_list = cur.fetchall()
        conn.close()

        # Convert any date fields if they exist (safety)
        for row in tuple_list:
            if row.get("meeting_start_date"):
                row["meeting_start_date"] = row["meeting_start_date"].isoformat()
            if row.get("meeting_end_date"):
                row["meeting_end_date"] = row["meeting_end_date"].isoformat()

        return jsonify(tuple_list)