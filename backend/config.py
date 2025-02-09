import razorpay
import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME')
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

razorclient = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Initialize MongoDB connection with verification
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)  # Timeout after 5 seconds
    mongo_client.server_info()  # Test connection
    mongo_db = mongo_client[DB_NAME]
    print(f"Connected to MongoDB. Database: {DB_NAME}")
except ServerSelectionTimeoutError:
    print("Failed to connect to MongoDB: Server selection timeout.")
except Exception as e:
    print(f"An error occurred while connecting to MongoDB: {e}")
