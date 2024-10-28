from flask import Blueprint, request, jsonify
from models.opciones import Opcion  
from extensiones import db

opciones_bp = Blueprint('opciones_bp', __name__)

# Ruta para obtener todas las opciones de una pregunta especifica
@opciones_bp.route('/preguntas/<int:pregunta_id>/opciones', methods=['GET'])
def obtener_opciones_por_pregunta(pregunta_id):
    opciones = Opcion.query.filter_by(pregunta_id=pregunta_id).all()
    return jsonify([opcion.serialize() for opcion in opciones])

# Ruta para crear una nueva opcion
@opciones_bp.route('/preguntas/<int:pregunta_id>/opciones', methods=['POST'])
def crear_opcion(pregunta_id):
    data = request.json
    nueva_opcion = Opcion(
        texto=data['texto'],
        pregunta_id=pregunta_id
    )
    db.session.add(nueva_opcion)
    db.session.commit()
    return jsonify(nueva_opcion.serialize()), 201

# Ruta para eliminar una opcin especifica
@opciones_bp.route('/opciones/<int:id>', methods=['DELETE'])
def eliminar_opcion(id):
    opcion = Opcion.query.get_or_404(id)
    db.session.delete(opcion)
    db.session.commit()
    return jsonify({"message": "Opción eliminada con éxito"}), 200
