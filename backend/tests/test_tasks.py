import pytest

@pytest.fixture
def test_project(client, admin_token):
    response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Task Project", "description": "For task tests", "owner_id": 1}
    )
    return response.json()

def test_create_task(client, admin_token, test_project):
    response = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "New Task", "description": "Task desc", "project_id": test_project["id"], "priority": "High", "status": "To Do"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Task"

def test_get_tasks(client, admin_token, test_project):
    client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Task 1", "project_id": test_project["id"], "priority": "Low", "status": "To Do"}
    )
    response = client.get(f"/tasks/?project_id={test_project['id']}", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_update_task(client, admin_token, test_project):
    create_resp = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Task 2", "project_id": test_project["id"], "priority": "Medium", "status": "To Do"}
    )
    task_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"status": "In Progress"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "In Progress"

def test_delete_task(client, admin_token, test_project):
    create_resp = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Task 3", "project_id": test_project["id"], "priority": "Medium", "status": "To Do"}
    )
    task_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/tasks/{task_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert delete_resp.status_code == 204
    
    get_resp = client.get(f"/tasks/{task_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert get_resp.status_code == 404
