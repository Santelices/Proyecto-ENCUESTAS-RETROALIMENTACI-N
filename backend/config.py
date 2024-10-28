class DesarrolloConfig():
    SQLALCHEMY_DATABASE_URI = 'sqlite:///EncuestasBD.db'
    SQLALCHEMY_TRACK_MODIFICATIONS= False 
    DEBUG=False
    JSON_SORT_KEYS = False
    SECRET_KEY='280a818e6b63d88ee0c2d618'
    JWT_SECRET_KEY='107c0b17bcff75d5a3653549'

config={
    'Desarrollo': DesarrolloConfig
}