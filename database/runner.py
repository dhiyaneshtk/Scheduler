import subprocess

files = [
    "courses.py",
    "scheduler.py",
    "subjects.py"
]

for file in files:
    result = subprocess.run(["python3", file], capture_output=True, text=True)
    print(result.stdout)

print("Files executed successfully")