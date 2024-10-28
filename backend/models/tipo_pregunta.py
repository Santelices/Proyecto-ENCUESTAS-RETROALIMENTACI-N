from extensiones import db

class TipoPregunta(db.Model):
    __tablename__ = 'tipopregunta'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)  
    
    preguntas = db.relationship('Pregunta', backref='tipo_pregunta', lazy=True)

    def __repr__(self):
        return f'<TipoPregunta {self.nombre}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre
        }
