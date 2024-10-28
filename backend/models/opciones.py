from extensiones import db

class Opcion(db.Model):
    __tablename__ = 'opciones'
    
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(200), nullable=False)  
    pregunta_id = db.Column(db.Integer, db.ForeignKey('preguntas.id'), nullable=False)  
    
    def __repr__(self):
        return f'<Opcion {self.texto}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'pregunta_id': self.pregunta_id
        }
