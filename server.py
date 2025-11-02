from database.resources.course import Course
from flask import Flask
from flask_restful import Api
import os
import subprocess

app = Flask(__name__)
api = Api(app)

DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "Cfgecamp@1"
DB_HOST = "localhost"
DB_PORT = "5432"

if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    runner_path = os.path.join(os.path.dirname(__file__), "database", "runner.py")
    subprocess.run(["python3", runner_path])

api.add_resource(Course, '/course')

if __name__ == "__main__":
    app.run(debug=True)