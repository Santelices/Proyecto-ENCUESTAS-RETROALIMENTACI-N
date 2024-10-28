from flask import Blueprint, request, jsonify
from extensiones import db
from models.tipo_pregunta import TipoPregunta
from flask_jwt_extended import jwt_required

tipopregunta_bp = Blueprint('tipopregunta_bp', __name__)

# Obtener todos los tipos de preguntas
@tipopregunta_bp.route('/tipos-pregunta', methods=['GET'])
def obtener_tipos_pregunta():
    tipos = TipoPregunta.query.all()
    return jsonify([tipo.serialize() for tipo in tipos]), 200

# Obtener un tipo de pregunta por ID
@tipopregunta_bp.route('/tipos-pregunta/<int:id>', methods=['GET'])
def obtener_tipo_pregunta(id):
    tipo = TipoPregunta.query.get_or_404(id)
    return jsonify(tipo.serialize()), 200

# Crear un nuevo tipo de pregunta
@tipopregunta_bp.route('/tipos-pregunta', methods=['POST'])
@jwt_required()  
def crear_tipo_pregunta():
    data = request.json
    nuevo_tipo = TipoPregunta(nombre=data['nombre'])

    db.session.add(nuevo_tipo)
    db.session.commit()

    return jsonify(nuevo_tipo.serialize()), 201

# Actualizar un tipo de pregunta existente
@tipopregunta_bp.route('/tipos-pregunta/<int:id>', methods=['PUT'])
@jwt_required()  
def actualizar_tipo_pregunta(id):
    tipo = TipoPregunta.query.get_or_404(id)
    data = request.json

    tipo.nombre = data.get('nombre', tipo.nombre)

    db.session.commit()
    return jsonify(tipo.serialize()), 200

# Eliminar un tipo de pregunta
@tipopregunta_bp.route('/tipos-pregunta/<int:id>', methods=['DELETE'])
@jwt_required()  
def eliminar_tipo_pregunta(id):
    tipo = TipoPregunta.query.get_or_404(id)

    db.session.delete(tipo)
    db.session.commit()

    return jsonify({"message": "Tipo de pregunta eliminado con éxito"}), 200
