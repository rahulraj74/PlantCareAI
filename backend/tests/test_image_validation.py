import io
from PIL import Image

def create_test_image(size=(100, 100), color=(0, 200, 0), format="JPEG"):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf

def test_valid_image_prediction(client):
    img_buf = create_test_image()
    files = {"file": ("test_leaf.jpg", img_buf, "image/jpeg")}
    data = {"crop": "Tomato"}

    resp = client.post("/api/diagnosis/predict", files=files, data=data)
    assert resp.status_code == 200
    res = resp.json()
    assert "diagnosis_id" in res
    assert "class_id" in res
    assert "confidence" in res
    assert 0.0 <= res["confidence"] <= 1.0
    assert "is_reliable" in res
    assert "alternatives" in res

def test_empty_image_rejected(client):
    empty_buf = io.BytesIO(b"")
    files = {"file": ("empty.jpg", empty_buf, "image/jpeg")}
    resp = client.post("/api/diagnosis/predict", files=files, data={"crop": "Tomato"})
    assert resp.status_code in [400, 422]

def test_corrupted_file_rejected(client):
    fake_buf = io.BytesIO(b"This is not a real image binary file.")
    files = {"file": ("fake.jpg", fake_buf, "image/jpeg")}
    resp = client.post("/api/diagnosis/predict", files=files, data={"crop": "Tomato"})
    assert resp.status_code in [400, 415]
