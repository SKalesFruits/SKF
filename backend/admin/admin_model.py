from pydantic import BaseModel


class Dashboard(BaseModel):
    totalShipments: int
    pendingOrders: int
    totalRevenue: int
    newCLientsThisWeek: int
    newCLientsThisMonth: int
    newCLientsThisYear: int

class Sources(BaseModel):
    source_name:str
    source_contact:str
    product_sourced_id:int
    product_sourced_stock:int
    source_address:str
    source_joining_date:str