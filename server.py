from flask import Flask, request, jsonify
from flask_restful import Api
from flask_cors import CORS
import os, subprocess, json
from database.resources.course import Course
from scheduler import generate_schedules  # ✅ import your Python logic

# ---- Initialize Flask ----
app = Flask(__name__)
CORS(app)
api = Api(app)

# ---- Run your database runner.py once on startup ----
if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    runner_path = os.path.join(os.path.dirname(__file__), "database", "runner.py")
    subprocess.run(["python3", runner_path])

api.add_resource(Course, "/course")

# ---- Main schedule generation endpoint ----
# ---- Main schedule generation endpoint ----
@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json(force=True)
    print("\n✅ RECEIVED DATA FROM FRONTEND:")
    print(json.dumps(data, indent=2))
    print("------------------------------\n")

    course_codes = [c["course_code"] for c in data.get("courses", [])]
    restrictions = data.get("restrictions", [])

    preferences = {"exclude": [], "include": []}
    for r in restrictions:
        if r.get("day") and r.get("startTime") and r.get("endTime"):
            entry = (r["day"], r["startTime"], r["endTime"])
            if r.get("allowed", True):
                preferences["include"].append(entry)
            else:
                preferences["exclude"].append(entry)

    try:
        result_json = generate_schedules(course_codes, preferences)
        result = json.loads(result_json)

        print(f"✅ Generated {len(result)} valid schedule(s)")
        if result:
            print("🧩 First valid schedule preview:")
            print(json.dumps(result[0], indent=2))
        else:
            print("⚠️ No valid schedules found!")

        return jsonify({
            "status": "success",
            "valid_schedules": len(result),
            "best_schedule": result[0] if result else [],
            "schedules": result
        })
    except Exception as e:
        print("❌ Error during schedule generation:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# ---- Run Flask ----
if __name__ == "__main__":
    app.run(debug=True, port=5000)