from pydantic import BaseModel
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignUp(BaseModel):
    user_name: str
    user_email: str
    user_contact: int
    user_password: str
    user_address: str
    user_type:str


class Login(BaseModel):
    user_email: str
    user_password: str

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)