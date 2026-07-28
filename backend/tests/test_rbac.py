def test_member_cannot_delete_project(client, admin_token, member_token):
    # Admin creates a project
    create_resp = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "RBAC Project", "description": "Test RBAC", "owner_id": 1}
    )
    project_id = create_resp.json()["id"]

    # Member tries to delete it
    delete_resp = client.delete(f"/projects/{project_id}", headers={"Authorization": f"Bearer {member_token}"})
    
    # Ideally this should be 403 Forbidden.
    # We will verify what the current implementation returns.
    assert delete_resp.status_code in (403, 401)
