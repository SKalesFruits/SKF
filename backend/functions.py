from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from config import *
from flask import jsonify

# Auth Functions
def create_user(data):
    userscollection = mongo_db["users"]
    if userscollection.find_one({'user_email': data['user_email']}):
        raise Exception('Email already registered')
    is_admin_check = False
    dev = '' 
    name = ''
    if " - " in data['user_name']:
        parts = data['user_name'].split(" - ", 1)
        dev = parts[0]  
        name = parts[1] 
    else:
        dev = None 
        name = data['user_name']
    if data['user_type'] != "user" and dev == 'DEV':
        is_admin_check = True
    else:
        is_admin_check = False
    user = {
        'user_email': data['user_email'],
        'user_name': name,
        'user_city': data['user_city'],
        'user_contact': data['user_contact'],
        'user_address': data['user_address'],
        'user_pincode': data['user_pincode'],
        'user_password_hashed': generate_password_hash(data['user_password']),
        'is_admin': is_admin_check,
        'created_at': datetime.utcnow()
    }
    result = userscollection.insert_one(user)
    user['_id'] = str(result.inserted_id)
    del user['user_password_hashed']
    return user

def authenticate_user(email, password):
    user = mongo_db.users.find_one({'user_email': email})
    if not user or not check_password_hash(user['user_password_hashed'], password):
        raise Exception('Invalid email or password')

    # Convert ObjectId to string
    user['_id'] = str(user['_id'])

    return user  # Now, the _id field is JSON serializable


# Product Functions
def get_products(category=None, seasonal=None, organic=None):
    query = {}
    
    if category and category != 'all':
        query['category'] = category
    
    if seasonal is not None:
        query['seasonal'] = seasonal.lower() == 'true'
    
    if organic is not None:
        query['organic'] = organic.lower() == 'true'

    collection = mongo_db["products"]
    products = list(collection.find({}))

    for product in products:
        product['_id'] = str(product['_id'])
    
    return products


def get_product_by_id(product_id):
    product = mongo_db.products.find_one({'_id': ObjectId(product_id)})
    if product:
        product['_id'] = str(product['_id'])
    return product

def create_product(data):
    result = mongo_db.products.insert_one(data)
    product = mongo_db.products.find_one({'_id': result.inserted_id})
    product['_id'] = str(product['_id'])
    return product

def update_product(product_id, data):
    result = mongo_db.products.update_one(
        {'_id': ObjectId(product_id)},
        {'$set': data}
    )
    if result.modified_count:
        product = mongo_db.products.find_one({'_id': ObjectId(product_id)})
        product['_id'] = str(product['_id'])
        return product
    return None

def delete_product(product_id):
    result = mongo_db.products.delete_one({'_id': ObjectId(product_id)})
    return result.deleted_count > 0

# Order Functions
def create_order(data):
    order = {
        'user_id': ObjectId(data['user_id']),
        'items': data['items'],
        'total': data['total'],
        'status': 'pending',
        'created_at': datetime.utcnow()
    }
    result = mongo_db.orders.insert_one(order)
    order['_id'] = str(result.inserted_id)
    order['user_id'] = str(order['user_id'])
    return order

def get_reviews():
    reviews_collection = mongo_db["reviews"]
    reviews = list(reviews_collection.find())
    for review in reviews:
        review['_id'] = str(review['_id'])
        review['review_id'] = str(review['review_id'])
    return reviews

def user_newsletter(data):
    email = data['email']
    newsletter_collection = mongo_db["newsletter"]
    obj = {
        "email_id": email
    }
    newsletter_collection.insert_one(obj)
    return {"message":"Successfully added to Newsletter"}

def get_cities():
    cities_collection = mongo_db["deliveryCities"]
    cities = list(cities_collection.find())
    for city in cities:
        city['_id'] = str(city['_id'])
    return cities

def get_config():
    config_collection = mongo_db["configParams"]
    configs = list(config_collection.find())
    for config in configs:
        config['_id'] = str(config['_id'])
    return configs

def admin_check(data):
    users_collection = mongo_db["users"]
    user = users_collection.find_one({"user_name": data["username"]})

    if user:  # Ensure user is not None
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return user
    else:
        return {"error": "User not found"}
    

def submit_enquiries(enquiry_data):
    enquiries_collection = mongo_db["enquiries"]
    enquiries_collection.insert_one(enquiry_data)
    return jsonify({"message": "Enquiry submitted successfully"}), 201

def get_orders():
    orders_collection = mongo_db["orders"]
    orders = list(orders_collection.find())
    for order in orders:
        order['_id'] = str(order['_id'])
        order['orderId'] = str(order['orderId'])
    return orders

def fetch_orders(data):
    orders_collection = mongo_db["orders"]
    orders = list(orders_collection.find({"userName": data["username"]})) # Filter based on username
    for order in orders:
        order['_id'] = str(order['_id'])
        order['orderId'] = str(order['orderId'])
    return orders

def get_order_by_id(order_id):
    order = mongo_db.orders.find_one({'_id': ObjectId(order_id)})
    if order:
        order['_id'] = str(order['_id'])
        order['user_id'] = str(order['user_id'])
    return order

def update_order_status(order_id, status):
    result = mongo_db.orders.update_one(
        {'_id': ObjectId(order_id)},
        {'$set': {'status': status}}
    )
    if result.modified_count:
        order = mongo_db.orders.find_one({'_id': ObjectId(order_id)})
        order['_id'] = str(order['_id'])
        order['user_id'] = str(order['user_id'])
        return order
    return None

# Delivery Agent Functions
def create_delivery_agent(data):
    agent = {
        'name': data['name'],
        'email': data['email'],
        'phone': data['phone'],
        'status': 'available',
        'is_active': True,
        'created_at': datetime.utcnow()
    }
    result = mongo_db.delivery_agents.insert_one(agent)
    agent['_id'] = str(result.inserted_id)
    return agent

def get_delivery_agents():
    agents = list(mongo_db.delivery_agents.find())
    for agent in agents:
        agent['_id'] = str(agent['_id'])
    return agents

def get_newsletters():
    newsletters = list(mongo_db["newsletter"].find())
    arr = []
    for agent in newsletters:
        arr.append(agent["email_id"])
    return arr

def update_delivery_agent(agent_id, data):
    result = mongo_db.delivery_agents.update_one(
        {'_id': ObjectId(agent_id)},
        {'$set': data}
    )
    if result.modified_count:
        agent = mongo_db.delivery_agents.find_one({'_id': ObjectId(agent_id)})
        agent['_id'] = str(agent['_id'])
        return agent
    return None

def update_status(data):
    try:
        order_collection = mongo_db["orders"]
        product = order_collection.find_one({"orderId": data["order_id"]})
        order_collection.update_one(
            {"orderId": product["orderId"]},
            {"$set":{"currentStatus": data["status"]}}
        )
        return jsonify("Successfully Updated the Order Status")
    except Exception as e:
        return None

def update_config(data):
    try:
        order_collection = mongo_db["configParams"]
        product = order_collection.find_one({"config_name": data["config_name"]})
        order_collection.update_one(
            {"config_name": product["config_name"]},
            {"$set":{"config_value": data["config_value"]}}
        )
        return jsonify("Successfully Updated the Order Status")
    except Exception as e:
        return None

def get_previous_stats():
    """Fetches previous and current month statistics from MongoDB"""

    orders_collection = mongo_db["orders"]
    products_collection = mongo_db["products"]

    # Get current month and previous month date range
    now = datetime.utcnow()
    first_day_this_month = datetime(now.year, now.month, 1)
    first_day_last_month = first_day_this_month - timedelta(days=1)
    first_day_last_month = datetime(first_day_last_month.year, first_day_last_month.month, 1)

    # Fetch data for this month
    this_month_orders = orders_collection.find({"dateOfOrderPlaced": {"$gte": first_day_this_month}})
    this_month_revenue = sum(order.get("totalOrderAmount", 0) for order in this_month_orders)

    this_month_active_orders = orders_collection.count_documents(
        {"currentStatus": "pending", "dateOfOrderPlaced": {"$gte": first_day_this_month}}
    )

    this_month_total_products = products_collection.count_documents({})

    this_month_profit = 0
    for order in orders_collection.find({"dateOfOrderPlaced": {"$gte": first_day_this_month}}):
        for item in order.get("items", []):
            product_name = item.split(" (")[0]  # Extract product name
            product = products_collection.find_one({"name": product_name})
            if product:
                buying_price = product.get("buying_price", 0)
                selling_price = product.get("price", 0)
                this_month_profit += (selling_price - buying_price)

    # Fetch data for last month
    last_month_orders = orders_collection.find(
        {"dateOfOrderPlaced": {"$gte": first_day_last_month, "$lt": first_day_this_month}}
    )
    last_month_revenue = sum(order.get("totalOrderAmount", 0) for order in last_month_orders)

    last_month_active_orders = orders_collection.count_documents(
        {"currentStatus": "pending", "dateOfOrderPlaced": {"$gte": first_day_last_month, "$lt": first_day_this_month}}
    )

    last_month_total_products = products_collection.count_documents({})  # Products don't change per month

    last_month_profit = 0
    for order in orders_collection.find(
        {"dateOfOrderPlaced": {"$gte": first_day_last_month, "$lt": first_day_this_month}}
    ):
        for item in order.get("items", []):
            product_name = item.split(" (")[0]  # Extract product name
            product = products_collection.find_one({"name": product_name})
            if product:
                buying_price = product.get("buying_price", 0)
                selling_price = product.get("price", 0)
                last_month_profit += (selling_price - buying_price)

    # Function to calculate percentage increase
    def calculate_percentage_change(current, previous):
        if previous == 0:
            return "N/A" if current == 0 else "+100%"
        change = ((current - previous) / abs(previous)) * 100
        return f"{change:+.1f}%"

    return jsonify({
        "totalRevenue": round(this_month_revenue, 2),
        "activeOrders": this_month_active_orders,
        "totalProducts": this_month_total_products,
        "totalProfit": round(this_month_profit, 2),

        # Percentage change
        "totalRevenueChange": calculate_percentage_change(this_month_revenue, last_month_revenue),
        "activeOrdersChange": calculate_percentage_change(this_month_active_orders, last_month_active_orders),
        "totalProductsChange": calculate_percentage_change(this_month_total_products, last_month_total_products),
        "totalProfitChange": calculate_percentage_change(this_month_profit, last_month_profit),
    })