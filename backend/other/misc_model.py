from pydantic import BaseModel


class NewsLetter(BaseModel):
    user_email: str

class SocialVideoBanner(BaseModel):
    user_type:str

class ServiceReviews(BaseModel):
    user_type:str

class SeasonalOffers(BaseModel):
    user_type:str