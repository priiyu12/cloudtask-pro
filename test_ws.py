import requests
res = requests.post("http://localhost:8000/auth/login", json={"email": "krish@example.com", "password": "password"})
# I don't know Krish's exact email, let me check the DB.
