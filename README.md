# AI Crop Disease Detection System

An end-to-end AI-powered platform for early crop disease detection using deep learning image classification and IoT soil sensor analysis. Built with a React frontend, Node.js middleware, and a Python FastAPI ML service.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│              React + Vite  (port 3000 / 5173)               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────┐
│               Node.js / Express  (port 5000)                │
│   • Forwards image/soil requests to ML service              │
│   • Generates AI recommendations via Claude API             │
│   • Stores prediction history (in-memory)                   │
└──────┬────────────────────────────────────────┬─────────────┘
       │ HTTP                                   │ Anthropic API
┌──────▼──────────────────┐        ┌────────────▼────────────┐
│  Python FastAPI          │        │  Claude Haiku           │
│  TensorFlow / ResNet50   │        │  (AI Recommendations)   │
│  (port 8000)             │        └─────────────────────────┘
└─────────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Image Disease Detection** | Upload a crop photo → ResNet50 CNN classifies disease with confidence score |
| **Soil Risk Analysis** | Input temperature, humidity & pH → rule-based risk engine returns risk % |
| **AI Recommendations** | High-risk detections trigger Claude AI for actionable farming advice |
| **Prediction History** | All predictions logged and available via `/history` API |
| **Graceful Fallback** | ML service runs in demo mode if `model.h5` hasn't been trained yet |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express 5, Multer, Axios |
| ML Service | Python 3.10, FastAPI, TensorFlow 2.15, ResNet50 |
| AI | Anthropic Claude Haiku (recommendations) |
| Container | Docker, Docker Compose, Nginx |

---

## Quickstart

### Option A — venv (local development)

**1. ML Service (Python)**

```bash
cd ml-service
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Backend (Node.js)**

```bash
cd backend
npm install
# Create .env from the example
copy .env.example .env        # Windows
# cp .env.example .env        # macOS/Linux

# ANTHROPIC_API_KEY is optional — if omitted, recommendations use
# a built-in rule-based engine instead of Claude AI.
node server.js
```

**3. Frontend (React)**

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

### Option B — Docker (one command)

**Prerequisites:** Docker Desktop installed and running.

```bash
# 1. Copy and fill in your API key
copy .env.example .env        # Windows
# cp .env.example .env        # macOS/Linux

# 2. Start all three services
docker-compose up --build

# Open http://localhost:3000
```

To stop:
```bash
docker-compose down
```

---

## Training the Model

The model is not included in this repo. Train it on your own dataset:

```bash
cd ml-service
# Place your dataset in ml-service/dataset/
# Folder structure:
#   dataset/
#     Healthy/      (crop images)
#     Yellow Fungus/
#     Other Disease/

python train.py
# Produces model.h5 — restart the ML service to load it
```

> **Tip:** For better accuracy and more disease classes, use the [PlantVillage dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) (38 classes, 54,000+ images).

---

## API Reference

### ML Service — `http://localhost:8000`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health + model status |
| POST | `/predict-soil` | `{temperature, humidity, ph}` | Returns risk % and message |
| POST | `/predict-image` | `multipart/form-data: file` | Returns prediction + confidence |

### Backend — `http://localhost:5000`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/soil` | `{temperature, humidity, ph}` | Soil risk via ML service |
| POST | `/image` | `multipart/form-data: file` | Image prediction via ML service |
| POST | `/recommendation` | `{temperature, humidity, ph, risk}` | Claude AI recommendation |
| GET | `/history` | — | All past predictions |

---

## Environment Variables

### Backend (`.env`)

```env
ANTHROPIC_API_KEY=your_key_here     # Optional — omit to use rule-based fallback
ML_SERVICE_URL=http://127.0.0.1:8000  # Default; use http://ml-service:8000 in Docker
PORT=5000
```

### Frontend

```env
VITE_API_URL=http://localhost:5000  # Override for production deployments
```

---

## Project Structure

```
Crop Disease/
├── ml-service/          # Python FastAPI + TensorFlow
│   ├── main.py          # Prediction API (soil + image)
│   ├── train.py         # Model training script
│   ├── requirements.txt
│   └── Dockerfile
│
├── backend/             # Node.js / Express middleware
│   ├── server.js        # API routes + Claude integration
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/            # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/       # Home, Prediction, Results, About, Contact, Technology
│   │   ├── components/  # Navbar, Footer, Hero, FeatureCard, Stats
│   │   └── config.js    # API_URL config
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Roadmap

- [ ] MongoDB persistence for prediction history
- [ ] PlantVillage dataset integration (38 disease classes)
- [ ] History page UI (endpoint already built)
- [ ] Fine-tuning pipeline for custom crops
- [ ] PWA support for field use on mobile

---

## License

MIT
