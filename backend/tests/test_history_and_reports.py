import io
from PIL import Image

def test_history_and_pdf_report(client):
    # 1. Run a scan to populate history
    buf = io.BytesIO()
    Image.new("RGB", (100, 100), (40, 180, 40)).save(buf, format="JPEG")
    buf.seek(0)
    files = {"file": ("leaf.jpg", buf, "image/jpeg")}
    pred_resp = client.post("/api/diagnosis/predict", files=files, data={"crop": "Tomato"})
    assert pred_resp.status_code == 200
    diag_id = pred_resp.json()["diagnosis_id"]

    # 2. Query scan history
    hist_resp = client.get("/api/history")
    assert hist_resp.status_code == 200
    hist_data = hist_resp.json()
    assert hist_data["total"] >= 1
    assert any(item["id"] == diag_id for item in hist_data["items"])

    # 3. Export PDF report
    pdf_resp = client.get(f"/api/reports/{diag_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 500  # Non-trivial PDF binary

    # 4. Delete scan
    del_resp = client.delete(f"/api/history/{diag_id}")
    assert del_resp.status_code == 200

    # 5. Verify deleted from history
    hist_resp_after = client.get("/api/history")
    assert not any(item["id"] == diag_id for item in hist_resp_after.json()["items"])
