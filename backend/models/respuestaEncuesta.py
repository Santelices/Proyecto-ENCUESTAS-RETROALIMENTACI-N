from extensiones import db
from datetime import datetime

class RespuestaEncuesta(db.Model):
    __tablename__ = 'respuestas_encuesta'
    
    id = db.Column(db.Integer, primary_key=True)
    encuesta_id = db.Column(db.Integer, db.ForeignKey('encuestas.id'), nullable=False)  
    ip_usuario = db.Column(db.String(45), nullable=False)  
    fecha_respuesta = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    encuesta = db.relationship('Encuesta', backref=db.backref('respuestas_encuesta', cascade='all, delete-orphan'))
    
    def __repr__(self):
        return f'<RespuestaEncuesta {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'encuesta_id': self.encuesta_id,
            'ip_usuario': self.ip_usuario,
            'fecha_respuesta': self.fecha_respuesta.strftime("%Y-%m-%d %H:%M:%S")
        }

