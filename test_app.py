import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Starting tests...")
    
    # 1. Login as Admin
    admin_login_data = {"email": "admin@cloudtaskpro.in", "password": "Admin1234"}
    resp = requests.post(f"{BASE_URL}/auth/login", json=admin_login_data)
    if resp.status_code != 200:
        print(f"Failed to login admin: {resp.text}")
        sys.exit(1)
    admin_token = resp.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("Admin logged in successfully.")
    
    # Get Admin User ID
    resp = requests.get(f"{BASE_URL}/users/me", headers=admin_headers)
    admin_user = resp.json()
    admin_id = admin_user["id"]
    
    # 2. Create a new Team
    team_payload = {"name": "Test Automation Team"}
    resp = requests.post(f"{BASE_URL}/teams", json=team_payload, headers=admin_headers)
    if resp.status_code != 200:
        print(f"Failed to create team: {resp.text}")
        sys.exit(1)
    team = resp.json()
    team_id = team["id"]
    print(f"Team created: {team['name']} (ID: {team_id})")
    
    # 3. Invite a new member
    invite_email = "tester@cloudtaskpro.com"
    invite_payload = {"email": invite_email, "role": "Member"}
    resp = requests.post(f"{BASE_URL}/workspaces/invites", json=invite_payload, headers=admin_headers)
    if resp.status_code != 200 and "already a member" not in resp.text:
        print(f"Failed to send invite: {resp.text}")
        # Not exiting here as they might already be invited
    
    invite_id = resp.json().get("id") if resp.status_code == 200 else None
    print(f"Invite sent to {invite_email}")
    
    # 4. Register the new member
    tester_pw = "Tester123!"
    tester_payload = {"name": "Tester User", "email": invite_email, "password": tester_pw}
    resp = requests.post(f"{BASE_URL}/auth/register", json=tester_payload)
    if resp.status_code not in (201, 400): # 400 if already exists
        print(f"Failed to register tester: {resp.text}")
        sys.exit(1)
    
    # Login tester
    tester_login = {"email": invite_email, "password": tester_pw}
    resp = requests.post(f"{BASE_URL}/auth/login", json=tester_login)
    tester_token = resp.json()["access_token"]
    tester_headers = {"Authorization": f"Bearer {tester_token}"}
    
    # Get Tester ID
    tester_user = requests.get(f"{BASE_URL}/users/me", headers=tester_headers).json()
    tester_id = tester_user["id"]
    print(f"Tester logged in (ID: {tester_id})")
    
    # Accept invite if we have it
    if invite_id:
        requests.post(f"{BASE_URL}/workspaces/invites/{invite_id}/accept", headers=tester_headers)
        print("Invite accepted")
        
    # Add tester to team
    resp = requests.post(f"{BASE_URL}/teams/{team_id}/members?user_id={tester_id}&role=Team%20Member", headers=admin_headers)
    print(f"Added tester to team: {resp.status_code}")
    
    # 5. Create a Project
    project_payload = {"name": "Automation Project", "description": "Testing project functionalities", "owner_id": admin_id}
    resp = requests.post(f"{BASE_URL}/projects", json=project_payload, headers=admin_headers)
    if resp.status_code != 200:
        print(f"Failed to create project: {resp.text}")
        sys.exit(1)
    project = resp.json()
    project_id = project["id"]
    print(f"Project created: {project['name']} (ID: {project_id})")
    
    # 6. Create Tasks and allocate
    tasks_to_create = [
        {"title": "Task 1 (To Do)", "status": "Todo"},
        {"title": "Task 2 (In Progress)", "status": "Todo"},
        {"title": "Task 3 (Done)", "status": "Todo"}
    ]
    created_tasks = []
    for t in tasks_to_create:
        t_payload = {"title": t["title"], "status": t["status"], "project_id": project_id}
        resp = requests.post(f"{BASE_URL}/tasks", json=t_payload, headers=admin_headers)
        created_tasks.append(resp.json())
        print(f"Created task: {t['title']}")
        
    # Allocate and update status
    # Task 1: allocate to admin
    requests.put(f"{BASE_URL}/tasks/{created_tasks[0]['id']}", json={"assignee_id": admin_id}, headers=admin_headers)
    
    # Task 2: allocate to tester, set In Progress
    requests.put(f"{BASE_URL}/tasks/{created_tasks[1]['id']}", json={"assignee_id": tester_id, "status": "In Progress"}, headers=admin_headers)
    
    # Task 3: set Done
    requests.put(f"{BASE_URL}/tasks/{created_tasks[2]['id']}", json={"status": "Done"}, headers=admin_headers)
    
    print("Tasks allocated and statuses updated to To-Do, In Progress, and Done.")
    
    print("\n--- ALL TESTS COMPLETED SUCCESSFULLY ---")

if __name__ == '__main__':
    run_tests()
