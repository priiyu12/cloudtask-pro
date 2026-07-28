def test_login_success(client):
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "adminpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure(client):
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "wrongpassword"})
    assert response.status_code == 401

def test_get_current_user(client, admin_token):
    response = client.get("/users/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "admin@test.com"
