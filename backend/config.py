import os

class ConfigBase:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")  # Añade una clave predeterminada solo para desarrollo local
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret-key")

class DesarrolloConfig(ConfigBase):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///EncuestasBD.db")
    DEBUG = False

config = {
    'Desarrollo': DesarrolloConfig
}
