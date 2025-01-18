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
    agent_username = []
    seller_username = []
    for d in data:
        agent_username.append(d["agent_username"])
        seller_username.append(d["seller_username"])

        # Check if the sum of the shortlist_history is equal to shortlist_count
        shortlist_count = d["shortlist_count"]
        shortlist_history = d["shortlist_history"]
        shortlist_sum = sum(shortlist_history.values())
        if shortlist_sum != shortlist_count:
            print("Shortlist count mismatch")

        # Check if the sum of the view_history is equal to view_count
        view_count = d["view_count"]
        view_history = d["view_history"]
        view_sum = sum(view_history.values())
        if view_sum != view_count:
            print("View count mismatch")

    print(len(agent_username), len(set(agent_username)))
    print(len(seller_username), len(set(seller_username)))


file = "dummy-usedcar.json"
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
# agent_username: "usedcaragent",
# car_manufacturer: "Hyundai",
# car_name: "Hyundai Sonata",
# car_type: "Sedan",
# description: "2 Owner only! High ARF $69049! White paintwork w/ black leather interior! Immaculate condition. No repairs needed. Call us for viewing now!",
# engine_cap: 1991,
# features: "2.0L turbo charged engine producing 207bhp, 7G- tronic auto transmission, keyless entry/start, auto LED lights, rain sensor, electric tailgate.",
# manufacture_year: 2015,
# mileage: 184200,
# price: 59800,
# seller_username: "kt",
# shortlist_count: 37,
# shortlist_history: {
#     "2024-06": 1,
#     "2024-07": 10,
#     "2024-08": 7,
#     "2024-09": 6,
#     "2024-10": 9,
#     "2024-11": 4
# }
# view_count: 268
# view_history: {
#     "2024-06": 15,
#     "2024-07": 62,
#     "2024-08": 35,
#     "2024-09": 24,
#     "2024-10": 80,
#     "2024-11": 52
# }, {
# …
# }
# ]
# Below is the rules for data.
# a. All of the fields should be the value with makes sense. Especially, price, mileage, engine_cap, manufacture_year should be the value with makes sense. Description and feature should be some real-world description.
# b. car_name and car_manufacturer should be the real-existing car name and manufacturer.
# b. car_type fields should be one of the following:
#    1. "Sedan"
#    2. "SUV"
#    3. "Hatchback"
#    4. "Wagon"
#    5. "Coupe"
#    6. "Van"
#    7. "MiniVan"
#    8. "Pickup Truck"
#    9. "Convertible"
#    10. "Sports Car"
# c. shortlist_history should be including "2024-06" to "2024-11" with some random number. The sum of the shortlist_history should be same with shortlist_count.
# d. view_history should be including "2024-06" to "2024-11" with some random number. The sum of the view_history should be same with view_count.
# e. agent_username should be one of the following:
#    1. "usedcaragent"
#    2. "kyle_mitchell"
#    3. "eric_johnson"
#    4. "emily_robinson"
# f. seller_username should be one of the following:
#    1. "seller"
#    2. "steven_miller"
#    3. "amber_clark"
#    4. "daniel_miller"
# g. minimum price should be 5000. maximum price should be 290000.
# h. minimum manufacture_year should be 2010. maximum manufacture_year should be 2024.

# You should create 100 entries. Output with less than 100 entries will not accepted.
