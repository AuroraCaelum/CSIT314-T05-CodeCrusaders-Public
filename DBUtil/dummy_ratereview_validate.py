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
    reviewTo = []
    reviewerUsername = []
    for d in data:
        reviewTo.append(d["reviewTo"])
        reviewerUsername.append(d["reviewerUsername"])

        # Check if the rate is between 1 and 5
        rate = d["rate"]
        if rate < 1 or rate > 5:
            print("Rate is not between 1 and 5")

    print(len(reviewTo), len(set(reviewTo)))
    print(len(reviewerUsername), len(set(reviewerUsername)))


file = "dummy-ratereview.json"
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
# rate: 5,
# review: "Really good agent. Helped me find the perfect car for my needs. Would recommend to anyone looking for a used car.",
# reviewTo: "usedcaragent",
# reviewerType: "Buyer",
# reviewerUsername: "buyer"
# }, {
# …
# }
# ]
# Below is the rules for data.
# a. rate should be between 1 and 5.
# b. review should be some value which makes sense. It should looks like a real-review.
# c. reviewTo should be one of the following:
#    1. "usedcaragent"
#    2. "kyle_mitchell"
#    3. "eric_johnson"
#    4. "emily_robinson"
# d. reviewerType should be one of the following:
#    1. "Seller"
#    2. "Buyer"
# e. reviewerUsername should be one of the following:
#    1. "seller"
#    2. "steven_miller"
#    3. "amber_clark"
#    4. "daniel_miller"
#    5. "buyer"
#    6. "tiffany_martin"
#    7. "george_wood"
#    8. "paul_martinez"

# You should create 100 entries. Output with less than 100 entries will not accepted.
