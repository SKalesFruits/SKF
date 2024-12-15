from pydantic import BaseModel


class Products(BaseModel):
    product_name: str
    product_cost_per_kg: str
    product_description: str
    product_stock: int
    product_rating: int
    product_img_url:str
