from extensiones import db
import uuid
from .respuestaEncuesta import RespuestaEncuesta

class Encuesta(db.Model):
    __tablename__ = 'encuestas'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False) 
    # Campo para identificar el enlace único de la encuesta
    id_unico = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(250), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    # Campo para definir el límite máximo de respuestas
    limite_respuestas = db.Column(db.Integer, nullable=True)
    preguntas = db.relationship('Pregunta', backref='encuesta', cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<Encuesta {self.titulo}>'
    
    def serialize(self):
        # Contador/número de respuestas para esta encuesta
        total_respuestas = RespuestaEncuesta.query.filter_by(encuesta_id=self.id).count()
        # Estado basado en el límite de respuestas
        estado = "Cerrada" if self.limite_respuestas and total_respuestas >= self.limite_respuestas else "Abierta"
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
            'usuario_id': self.usuario_id,
            'id_unico': self.id_unico,
            'limite_respuestas': self.limite_respuestas,
            'estado': estado  # Estado calculado
        }