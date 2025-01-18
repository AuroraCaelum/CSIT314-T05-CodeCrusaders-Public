import sys
import json
import requests
import time
import random


# Read json file and count the number of records
def read_json(file_name):
    with open(file_name, "r") as f:
        data = json.load(f)
    print(len(data))


# Read json file and check is there any duplicated profileName fields.
def read_json_profile(file_name):
    with open(file_name, "r") as f:
        data = json.load(f)
    suspended = []
    username = []
    userProfile = []
    for d in data:
        suspended.append(d["suspended"])
        username.append(d["username"])
        userProfile.append(d["userProfile"])

    print(suspended.count(True), suspended.count(False))
    print(len(username), len(set(username)))
    # How many profiles are there for each profileType
    print(userProfile.count("UsedCarAgent"))
    print(userProfile.count("UserAdmin"))
    print(userProfile.count("Buyer"))
    print(userProfile.count("Seller"))
    print(userProfile.count("AuctionLuxurySeller"))
    print(userProfile.count("DigitalAutoAgent"))
    print(userProfile.count("OnlineBuyer"))
    print(userProfile.count("PolicyManager"))
    print(userProfile.count("SUVSpecialist"))
    print(userProfile.count("BMWCarBuyer"))


file = "dummy-accounts.json"
read_json(file)
read_json_profile(file)

# Randomize the order of the records in the json file
with open(file, "r") as f:
    data = json.load(f)
    random_data = data.copy()
    random.shuffle(random_data)

with open("random_" + file, "w") as f:
    json.dump(random_data, f, indent=4)

# Create a dummy dataset JSON file.
# The structure should be like as follows.
# [
# {
# email: "sample@sample.com",
# fName: "John",
# lName: "Doe",
# password: "samplepassword",
# phoneNum: "8123 4567",
# suspended: true,
# userProfile: "UsedCarAgent",
# username: "sample",
# }, {
# …
# }
# ]
# Below is the rules for data.
# a. suspended field can be true / false. (make 20 true and 80 false)
# b. userProfile field should be one of the following. (10 entries each)
#    1. "UsedCarAgent"
#    2. "Buyer"
#    3. "Seller"
#    4. "UserAdmin"
#    5. "AuctionLuxurySeller"
#    6. "DigitalAutoAgent"
#    7. "OnlineBuyer"
#    8. "PolicyManager"
#    9. "SUVSpecialist"
#    10. "BMWCarBuyer"
# c. phoneNum should be have 8 digits, just as like the sample. (e.g., "1234 5678") You should add space in between 4 digits.
# d. password should be some easy words.
# You should create 100 entries. Output with less than 100 entries will not accepted.

# Username should be unique but simple. Do not make it like sample1, sample2, etc.
