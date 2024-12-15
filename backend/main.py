from fastapi import FastAPI,HTTPException
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_model import *
from shop.shop_model import *
from admin.admin_model import *
from other.misc_model import *
from auth.auth import *
from config.config import *


app = FastAPI()

# MongoDB Connection
def get_db_connection():
    client = MongoClient(db_connection_url)  # MongoDB URI
    db = client["skales"]  # Database name
    return db

origins = [
    "http://localhost:3000/",  # React dev server
    "http://127.0.0.1:3000/",  # Add production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def document_to_dict(doc):
    return {**doc, "_id": str(doc["_id"])}


@app.get("/api/health_check")
async def health():
    return {"status":"OK"}

@app.post("/api/auth/signup")
async def signup(item: SignUp):
    db = get_db_connection()
    # Check if user already exists
    existing_user = db["users"].find_one({"user_email": item.user_email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password before saving
    hashed_password = hash_password(item.user_password)

    # Insert new user into the database
    new_user = {
        "user_name": item.user_name,
        "user_email": item.user_email,
        "user_contact": item.user_contact,
        "user_password": hashed_password,
        "user_address": item.user_address,
        "user_type": item.user_type
    }
    print(new_user)
    print(db["users"])
    result = db["users"].insert_one(new_user)
    print(result)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@app.post("/api/auth/login")
async def login(item: Login):
    db = get_db_connection()
    # Find the user by email
    user = db["users"].find_one({"user_email": item.user_email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify the password
    if not verify_password(item.user_password, user["user_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user_email": item.user_email}


@app.post("/api/shop/products")
async def shop_products(item: Products):
    return item

@app.get("/api/shop/products")
async def shop_get_products():
    db = get_db_connection();
    products = db["products"].find();
    if not products:
        raise HTTPException(status_code=401, detail="Unable to fetch products")
    return document_to_dict(products)


@app.post("/api/admin/sources")
async def admin_sources(item: Sources):
    return item

@app.post("/api/admin/dashboard")
async def admin_dashboard(item: Dashboard):
    return item


@app.post("/api/other/newsletter")
async def other_newsletter(item: NewsLetter):
    return item

@app.post("/api/other/servicereviews")
async def other_servicereviews(item: ServiceReviews):
    return item

@app.post("/api/other/seasonaloffers")
async def other_seasonaloffers(item: SeasonalOffers):
    return item

@app.post("/api/other/socialvideosbanners")
async def other_socialvideosbanners(item: SocialVideoBanner):
    return item
