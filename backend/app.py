from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import *
from config import *
from bson import ObjectId

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = JWT_SECRET_KEY

@app.route('/api/health',methods=['GET'])
def health():
    return jsonify({"message":"SERVER IS RUNNING"})

# Auth Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        user = create_user(data)
        return jsonify(user), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.form
    try:
        token = authenticate_user(data.get('username'), data.get('password'))
        return jsonify({'access_token': token, 'token_type': 'bearer'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@app.route("/api/products", methods=["GET"])
def get_all_products():
    product_collection = mongo_db["products"]
    products = list(product_collection.find())
    for product in products:
        product["_id"] = str(product["_id"])  # Convert ObjectId to string
    return jsonify(products), 200


@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = get_product_by_id(product_id)
    if product:
        return jsonify(product), 200
    return jsonify({'error': 'Product not found'}), 404

# Order Routes
@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders = get_orders()
    return jsonify(orders), 200

@app.route('/api/fetchordersbyusername', methods=['POST'])
def fetch_orders_using_username():
    data = request.json
    orders = fetch_orders(data)
    return jsonify(orders), 200

@app.route('/api/reviews', methods=['GET'])
def get_all_reviews():
    reviews = get_reviews()
    return jsonify(reviews), 200

@app.route('/api/cities', methods=['GET'])
def get_all_cities():
    cities = get_cities()
    return jsonify(cities), 200

@app.route('/api/config', methods=['GET'])
def get_config_details():
    config = get_config()
    return jsonify(config), 200

@app.route('/api/admincheck', methods=['POST'])
def get_admin_details():
    try:
        data = request.json
        admin = admin_check(data)
        return jsonify(admin), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/newsletter', methods=['POST'])
def add_to_newsletter():
    try:
        data = request.json
        newss = user_newsletter(data)
        return jsonify(newss), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/enquiries", methods=["POST"])
def submit_enquiry():
    try:
        data = request.json
        if not all(k in data for k in ["product", "name", "email", "mobile", "enquiry"]):
            return jsonify({"error": "Missing fields"}), 400
        enquiry_data = {
            "product": data["product"],
            "name": data["name"],
            "email": data["email"],
            "mobile": data["mobile"],
            "enquiry": data["enquiry"],
        }
        result = submit_enquiries(enquiry_data)
        return result
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = get_order_by_id(order_id)
    if order:
        return jsonify(order), 200
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders', methods=['POST'])
def create_new_order():
    data = request.json
    order = create_order(data)
    return jsonify(order), 201

@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    order = update_order_status(order_id, data.get('status'))
    if order:
        return jsonify(order), 200
    return jsonify({'error': 'Order not found'}), 404

# Delivery Routes
@app.route('/api/delivery/agents', methods=['GET'])
def get_all_agents():
    agents = get_delivery_agents()
    return jsonify(agents), 200

@app.route('/api/delivery/agents', methods=['POST'])
def add_delivery_agent():
    data = request.json
    agent = create_delivery_agent(data)
    return jsonify(agent), 201

@app.route('/api/delivery/agents/<agent_id>', methods=['PUT'])
def update_agent(agent_id):
    data = request.json
    agent = update_delivery_agent(agent_id, data)
    if agent:
        return jsonify(agent), 200
    return jsonify({'error': 'Agent not found'}), 404\

@app.route("/create-order", methods=["POST"])
def create_order():
    try:
        data = request.json
        amount = data.get("amount", 5000)  # Default 50 INR in paise
        currency = data.get("currency", "INR")

        order = razorclient.order.create({
            "amount": amount,
            "currency": currency,
            "payment_capture": 1,  # Auto capture payment
        })

        return jsonify({
            "orderId": order["id"],
            "amount": order["amount"],
            "currency": order["currency"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/verify-payment", methods=["POST"])
def verify_payment():
    data = request.json

    required_fields = ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "userName", "orderLocation", "orderAddress", "items", "totalOrderAmount"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Verify payment signature
        params_dict = {
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"],
        }
        razorclient.utility.verify_payment_signature(params_dict)

        # Create order details
        order_data = {
            "orderId": data["razorpay_order_id"],
            "userName": data["userName"],
            "dateOfOrderPlaced": datetime.utcnow().isoformat(),
            "currentStatus": "pending",
            "orderLocation": data["orderLocation"],
            "orderAddress": data["orderAddress"],
            "totalOrderAmount": data["totalOrderAmount"],
            "items": data["items"],
            "fleetAssignedId": None,  # Assign later
            "fleetAssignedName": None,  # Assign later
        }

        # Insert order into MongoDB
        orders_collection = mongo_db["orders"]
        orders_collection.insert_one(order_data)

        return jsonify({"message": "Order successfully placed", "orderId": data["razorpay_order_id"]}), 200
    except razorpay.errors.SignatureVerificationError:
        return jsonify({"error": "Payment verification failed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.get_json()
    product_collection = mongo_db["products"]
    new_product = {
        "name": data["name"],
        "price": data["price"],
        "image": data["image"],
        "category": data["category"],
        "description": data["description"],
        "stock": data["stock"],
        "seasonal": data["seasonal"],
        "organic": data["organic"]
    }
    inserted_product = product_collection.insert_one(new_product)
    return jsonify({"message": "Product added successfully!", "id": str(inserted_product.inserted_id)}), 201


# 🔹 Update a product
@app.route("/api/products/<string:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()
    product_collection = mongo_db["products"]
    updated_product = {
        "name": data["name"],
        "price": data["price"],
        "image": data["image"],
        "category": data["category"],
        "description": data["description"],
        "stock": data["stock"],
        "seasonal": data["seasonal"],
        "organic": data["organic"]
    }
    result = product_collection.update_one({"_id": ObjectId(product_id)}, {"$set": updated_product})
    
    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404
    
    return jsonify({"message": "Product updated successfully!"}), 200


# 🔹 Delete a product
@app.route("/api/products/<string:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product_collection = mongo_db["products"]
    result = product_collection.delete_one({"_id": ObjectId(product_id)})
    
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    
    return jsonify({"message": "Product deleted successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8000)