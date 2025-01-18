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
    profileName = []
    profileType = []
    for d in data:
        suspended.append(d["suspended"])
        profileName.append(d["profileName"])
        if d["profileType"] == "Seller":
            profileType.append("Seller")
        elif d["profileType"] == "Buyer":
            profileType.append("Buyer")
        elif d["profileType"] == "UsedCarAgent":
            profileType.append("UsedCarAgent")
        elif d["profileType"] == "UserAdmin":
            profileType.append("UserAdmin")

    print(suspended.count(True), suspended.count(False))
    print(len(profileName), len(set(profileName)))
    # How many profiles are there for each profileType
    print(profileType.count("Seller"))
    print(profileType.count("Buyer"))
    print(profileType.count("UsedCarAgent"))
    print(profileType.count("UserAdmin"))


file = "dummy-profiles.json"
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
# description: "Who wants to sell a used car",
# profileName: "Seller",
# profileType: "Seller",
# suspended: false,
# }, {
# …
# }
# ]

# Below is the rules for data.
# a. suspended field can be true / false. (make 20 true and 80 false)
# b. profileType field should be one of the following. (25 entries each)
#    1. "UsedCarAgent"
#    2. "Buyer"
#    3. "Seller"
#    4. "UserAdmin"
# c. profileName can be some words which can show the identity of profile type. For example, if there are two sellers, one can be SGCarMartSeller and another one can be CommonSeller.
# d. Description should be related to profileName. For example, if the profileName is SGCarMartSeller, it can be "Seller from SGCarMart."

# You should create 100 entries.
