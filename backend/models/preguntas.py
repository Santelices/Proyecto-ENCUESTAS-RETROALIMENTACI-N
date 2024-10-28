from extensiones import db

class Pregunta(db.Model):
    __tablename__ = 'preguntas'
    
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(200), nullable=False)
    obligatorio = db.Column(db.Boolean, default=False, nullable=False)  
    tipo_id = db.Column(db.Integer, db.ForeignKey('tipopregunta.id'), nullable=False)      
    encuesta_id = db.Column(db.Integer, db.ForeignKey('encuestas.id'), nullable=False)

    respuestas = db.relationship('Respuesta', backref='pregunta', cascade="all, delete-orphan", lazy=True)
    opciones = db.relationship('Opcion', backref='pregunta', cascade='all, delete-orphan', lazy=True)

    def __repr__(self):
        return f'<Pregunta {self.texto}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'tipo_id': self.tipo_id,
            'obligatorio': self.obligatorio,
            'encuesta_id': self.encuesta_id,
            'opciones': [opcion.serialize() for opcion in self.opciones]  
        }
