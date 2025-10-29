import os
import firebase_admin
from firebase_admin import credentials, firestore


def initialize_firestore():
    """
    Connect to Google Firestore using service account key.
    Create base collections if they don't already exist.
    """
    # Path to service account JSON file
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")

    if not os.path.exists(cred_path):
        raise FileNotFoundError(
            f"Service account key not found at {cred_path}. "
            "Download it from Google Cloud IAM & Admin → Service Accounts."
        )

    # Initialize Firebase app
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("Firebase app initialized successfully.")
    else:
        print("Firebase app already initialized.")

    db = firestore.client()

    # Base collections required by the backend
    base_collections = ["teachers", "students", "quizzes", "attempts"]

    print("\n🚀 Initializing Firestore collections...")
    for col in base_collections:
        doc_ref = db.collection(col).document("_init")
        if not doc_ref.get().exists:
            doc_ref.set({"initialized": True})
            print(f"Created collection: {col}")
        else:
            print(f"Collection already exists: {col}")

    print("\n🎉 Firestore setup completed successfully.")


if __name__ == "__main__":
    initialize_firestore()
