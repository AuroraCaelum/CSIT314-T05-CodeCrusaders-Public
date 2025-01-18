import os
import sys
import json
import requests
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, storage
from google_images_search import GoogleImagesSearch

gis = GoogleImagesSearch(
    os.getenv("GOOGLE_IMAGE_SEARCH_KEY"), os.getenv("GOOGLE_IMAGE_SEARCH_CX")
)
cred = credentials.Certificate(os.getenv("GOOGLE_CLOUD_CREDS"))
firebase_admin.initialize_app(cred, {"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")})

db = firestore.client()
bucket = storage.bucket()


def upload_used_car(file_name):
    # Read json file and upload to firestore. Search image from google, upload the first searched image to firebase storage and save the firebase storage download url to firestore
    with open(file_name, "r") as f:
        data = json.load(f)

    for d in data:
        # Search image from google
        search_params = {
            "q": d["car_name"],
            "num": 1,
            "safe": "off",
            "fileType": "jpg",
        }

        timestamp = str(int(time.time() * 1000))
        # gis.search(search_params=search_params)
        # if len(gis.results()) != 0:

        # image_url = gis.results()[0].url
        image_url = d["car_image"]

        # Upload image to firebase storage (milliseconds timestamp)
        # timestamp = str(int(time.time() * 1000))
        blob = bucket.blob(f"car_images/{timestamp}.jpg")
        blob.upload_from_string(
            requests.get(image_url).content, content_type="image/jpg"
        )

        # Save download url (firebasestorage.googleapis.com) to firestore
        d["car_image"] = (
            f"https://firebasestorage.googleapis.com/v0/b/{os.getenv("FIREBASE_STORAGE_BUCKET")}/o/car_images%2F{timestamp}.jpg?alt=media"
        )

        db.collection("UsedCar").document(timestamp).set(d)


def upload_user_account(file_name):
    with open(file_name, "r") as f:
        data = json.load(f)

    # Document ID should be same as username
    for d in data:
        db.collection("UserAccount").document(d["username"]).set(d)


def upload_user_profile(file_name):
    with open(file_name, "r") as f:
        data = json.load(f)

    # Document ID should be same as profile name
    for d in data:
        db.collection("UserProfile").document(d["profileName"]).set(d)


def upload_rate_review(file_name):
    with open(file_name, "r") as f:
        data = json.load(f)

    # Document ID should be the current timestamp_reviewerUsername
    for d in data:
        timestamp = str(int(time.time() * 1000))
        db.collection("RateReview").document(f'{timestamp}{d["reviewerUsername"]}').set(
            d
        )


# def upload_shortlist(file_name):
#     with open(file_name, "r") as f:
#         data = json.load(f)

#     # Document ID should be the current timestamp_username
#     timestamp = str(int(time.time() * 1000))
#     for d in data:
#         db.collection("Shortlist").document(f'{timestamp}_{d["username"]}').set(d)


def main(collection_name, file_name):
    # Read json file and upload to firestore
    if collection_name == "UsedCar":
        upload_used_car(file_name)
    elif collection_name == "UserAccount":
        upload_user_account(file_name)
    elif collection_name == "UserProfile":
        upload_user_profile(file_name)
    elif collection_name == "RateReview":
        upload_rate_review(file_name)
    # elif collection_name == "Shortlist":
    #     upload_shortlist(file_name)


if __name__ == "__main__":
    # if len(sys.argv) != 2:
    #     print("Usage: python dummy_bulk_upload.py <collection_name> <file_name>")
    #     sys.exit()

    collection_name = sys.argv[1]
    file_name = sys.argv[2]
    main(collection_name, file_name)
