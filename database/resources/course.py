from flask import jsonify, request
from flask_restful import Resource, reqparse
from scheduler import connect_db

class Course(Resource):
    def get(self): #get all courses
        sql = """
        SELECT * from courses
        """
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(sql)
        tuple_list = cur.fetchall()
        conn.close()
        for row in tuple_list:
            if row.get("meeting_start_date"):
                row["meeting_start_date"] = row["meeting_start_date"].isoformat()
            if row.get("meeting_end_date"):
                row["meeting_end_date"] = row["meeting_end_date"].isoformat()
        return tuple_list