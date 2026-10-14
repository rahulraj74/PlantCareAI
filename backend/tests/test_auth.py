import pytest

def test_register_and_login(client):
    # 1. Register a new user
    reg_payload = {
        "username": "tester_farmer",
        "email": "tester@example.com",
        "password": "Password123!",
        "full_name": "Test Farmer"
    }
    reg_resp = client.post("/api/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    user_data = reg_resp.json()
    assert user_data["username"] == "tester_farmer"
    assert user_data["email"] == "tester@example.com"
    assert "hashed_password" not in user_data

    # 2. Duplicate registration rejection
    dup_resp = client.post("/api/auth/register", json=reg_payload)
    assert dup_resp.status_code == 400

    # 3. Login with credentials
    login_resp = client.post(
        "/api/auth/login",
        data={"username": "tester_farmer", "password": "Password123!"}
    )
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 4. Get Current User profile with Token
    me_resp = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["username"] == "tester_farmer"

def test_login_invalid_credentials(client):
    login_resp = client.post(
        "/api/auth/login",
        data={"username": "non_existent_user", "password": "wrongpassword"}
    )
    assert login_resp.status_code == 401
