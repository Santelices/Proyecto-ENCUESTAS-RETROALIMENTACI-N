from datetime import datetime
from extensiones import db

class Visita(db.Model):
    __tablename__ = 'visitas'
    
    id = db.Column(db.Integer, primary_key=True)
    ip_usuario = db.Column(db.String(45), unique=True)  
    fecha_ultima_visita = db.Column(db.DateTime, default=datetime.utcnow)

