def test_create_project(client, admin_token):
    response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Test Project", "description": "Test Desc", "owner_id": 1}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Project"

def test_get_projects(client, admin_token):
    client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Test Project 1", "description": "Test Desc 1", "owner_id": 1}
    )
    response = client.get("/projects/", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_update_project(client, admin_token):
    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Test Project 2", "description": "Test Desc 2", "owner_id": 1}
    )
    project_id = create_response.json()["id"]

    update_response = client.put(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Updated Project"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated Project"

def test_delete_project(client, admin_token):
    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Project to Delete", "description": "Test Desc", "owner_id": 1}
    )
    project_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert delete_response.status_code == 204
    
    get_response = client.get(f"/projects/{project_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert get_response.status_code == 404
