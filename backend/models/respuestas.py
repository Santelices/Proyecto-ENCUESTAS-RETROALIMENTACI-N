from extensiones import db
from datetime import datetime

class Respuesta(db.Model):
    __tablename__ = 'respuestas'
    
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(500), nullable=False)
    fecha_respuesta = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)    
    pregunta_id = db.Column(db.Integer, db.ForeignKey('preguntas.id'), nullable=False)

    def __repr__(self):
        return f'<Respuesta {self.texto}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'pregunta_id': self.pregunta_id,
            'fecha_respuesta': self.fecha_respuesta.strftime("%Y-%m-%d %H:%M:%S")
        } 
