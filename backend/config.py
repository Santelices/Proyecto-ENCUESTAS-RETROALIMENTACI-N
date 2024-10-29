import os

class DesarrolloConfig():
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///EncuestasBD.db")    
    #postgresql://encubd_user:85iD46uCoxCXJGdkvaPjDnhZrS6uLSFu@dpg-csg1gid6l47c739lksrg-a.oregon-postgres.render.com/encubd
    SQLALCHEMY_TRACK_MODIFICATIONS= False 
    DEBUG=False
    JSON_SORT_KEYS = False
    SECRET_KEY='280a818e6b63d88ee0c2d618'
    JWT_SECRET_KEY='107c0b17bcff75d5a3653549'

config={
    'Desarrollo': DesarrolloConfig
}