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
@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return '', 204

    # Get frontend data safely
    data = request.get_json(force=True)
    print("\n✅ RECEIVED DATA FROM FRONTEND:")
    print(json.dumps(data, indent=2))
    print("------------------------------\n")

    # ---- Extract courses and restrictions ----
    course_codes = [c["code"] for c in data.get("courses", [])]
    restrictions = data.get("restrictions", [])

    # ---- Convert restrictions to the format your scheduler expects ----
    preferences = {"exclude": [], "include": []}

    for r in restrictions:
        # Only include if fully filled
        if r.get("day") and r.get("startTime") and r.get("endTime"):
            entry = (r["day"], r["startTime"], r["endTime"])
            if r.get("allowed", True):
                preferences["include"].append(entry)
            else:
                preferences["exclude"].append(entry)

    # ---- Run the scheduling logic ----
    try:
        result_json = generate_schedules(course_codes, preferences)
        result = json.loads(result_json)
        print(f"✅ Generated {len(result)} valid schedule(s)")
        return jsonify({
            "status": "success",
            "valid_schedules": len(result),
            "schedules": result
        })
    except Exception as e:
        print("❌ Error during schedule generation:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


# ---- Run Flask ----
if __name__ == "__main__":
    app.run(debug=True, port=5000)