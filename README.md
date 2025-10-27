# Cloud-Based Quiz Platform (FastAPI + Google Firestore)

This repository contains a Python backend for a cloud-based quiz platform using FastAPI and Google Cloud Firestore.

Features
- Teacher registration and login
- Student registration and login
- Teachers can create quizzes with multiple questions and choices
- Students can list quizzes and submit attempts
- Attempts stored in Firestore with computed scores
- JWT-based authentication and role-based access control

Prerequisites
- Python 3.10+
- Google Cloud project with Firestore enabled
- Service account JSON key with Firestore permissions
- Docker (optional, for container deployment)

Quick setup

1. Create a Google Cloud service account, download the JSON key, and set the environment variable:
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"

2. Copy the example environment file and edit values:
   cp .env.example .env
   (Set values for JWT_SECRET, FIRESTORE_PROJECT, ACCESS_TOKEN_EXPIRE_MINUTES, etc.)

3. Install dependencies:
   python -m pip install -r requirements.txt

4. Run the app locally:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

API endpoints overview

Authentication
- POST /auth/register
  payload: { "username", "email", "password", "role": "teacher" | "student" }

- POST /auth/login
  payload: { "username", "password" }
  returns: { "access_token": "JWT", "token_type": "bearer" }

Quizzes
- POST /quizzes
  (teacher only) create a quiz with questions
- GET /quizzes
  list quizzes (does not expose correct answers)
- GET /quizzes/{quiz_id}
  get quiz (teacher sees correct answers; students won't)
- POST /quizzes/{quiz_id}/attempt
  (student only) submit answers and receive score
- GET /quizzes/{quiz_id}/attempts
  (teacher only) list attempts for a quiz

Deployment
- You can containerize using provided Dockerfile and deploy to Cloud Run or similar.
- Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your environment or use Workload Identity on GCP.

Security notes
- For production, use a strong JWT_SECRET and rotate keys.
- Consider using Firebase Auth or another managed identity provider in production for easier auth scaling.
