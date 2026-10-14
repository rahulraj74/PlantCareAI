def test_get_crops(client):
    resp = client.get("/api/crops")
    assert resp.status_code == 200
    crops = resp.json()
    assert len(crops) >= 1
    assert any(c["name"] == "Tomato" for c in crops)

def test_get_diseases(client):
    resp = client.get("/api/diseases")
    assert resp.status_code == 200
    diseases = resp.json()
    assert len(diseases) >= 10
    assert any(d["id"] == "Tomato___Early_blight" for d in diseases)
    assert any(d["id"] == "Tomato___healthy" for d in diseases)

def test_get_disease_by_id(client):
    resp = client.get("/api/diseases/Tomato___Early_blight")
    assert resp.status_code == 200
    data = resp.json()
    assert data["display_name"] == "Tomato Early Blight"
    assert "symptoms" in data
    assert "management" in data
    assert "sources" in data

def test_disease_not_found(client):
    resp = client.get("/api/diseases/Non_Existent_Disease")
    assert resp.status_code == 404
