import os

class ConfigBase:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    SECRET_KEY = os.getenv("SECRET_KEY", '280a818e6b63d88ee0c2d618')  
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", '107c0b17bcff75d5a3653549')

class DesarrolloConfig(ConfigBase):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///EncuestasBD.db")
    DEBUG = False

config = {
    'Desarrollo': DesarrolloConfig
}
