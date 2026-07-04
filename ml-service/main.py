from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import os

app = FastAPI(title="Crop Disease ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = ["Healthy", "Yellow Fungus", "Other Disease"]
model = None


def load_model():
    global model
    try:
        import tensorflow as tf
        if os.path.exists("model.h5"):
            model = tf.keras.models.load_model("model.h5")
            print("✅ model.h5 loaded")
        else:
            print("⚠️  model.h5 not found — using fallback predictions. Run train.py first.")
    except Exception as e:
        print(f"⚠️  Could not load model: {e}")


load_model()


class SoilData(BaseModel):
    temperature: float
    humidity: float
    ph: float


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict-soil")
def predict_soil(data: SoilData):
    risk = 0

    # Temperature (optimal 15–28 °C)
    if data.temperature > 35 or data.temperature < 10:
        risk += 40
    elif data.temperature > 30 or data.temperature < 15:
        risk += 20

    # Humidity (optimal 40–70 %)
    if data.humidity > 85:
        risk += 40
    elif data.humidity > 70:
        risk += 20

    # pH (optimal 6.0–7.0)
    if data.ph < 5.0 or data.ph > 8.0:
        risk += 30
    elif data.ph < 5.5 or data.ph > 7.5:
        risk += 15

    risk = min(risk, 100)

    if risk > 60:
        message = "High risk of crop disease. Immediate action recommended."
    elif risk > 30:
        message = "Moderate risk. Monitor crops closely."
    else:
        message = "Soil conditions look healthy."

    return {
        "risk_percentage": risk,
        "message": message,
        "inputs": {
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
        },
    }


@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
        img_array = np.expand_dims(np.array(image) / 255.0, axis=0)

        if model is not None:
            preds = model.predict(img_array)
            idx = int(np.argmax(preds[0]))
            confidence = round(float(preds[0][idx]) * 100, 2)
            prediction = CLASS_NAMES[idx]
        else:
            # Fallback until model.h5 is trained
            prediction = "Healthy"
            confidence = 85.0

        return {
            "prediction": prediction,
            "confidence": confidence,
            "model_loaded": model is not None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
