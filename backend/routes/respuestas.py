from flask import Blueprint, request, jsonify
from models.respuestas import Respuesta
from models.respuestaEncuesta import RespuestaEncuesta
from models.encuestas import Encuesta  
from extensiones import db
from datetime import datetime

respuestas_bp = Blueprint('respuestas_bp', __name__)

# Obtener todas las respuestas de una pregunta especifica
@respuestas_bp.route('/preguntas/<int:pregunta_id>/respuestas', methods=['GET'])
def obtener_respuestas_por_pregunta(pregunta_id):
    respuestas = Respuesta.query.filter_by(pregunta_id=pregunta_id).all()
    return jsonify([respuesta.serialize() for respuesta in respuestas])

# Endpoint para guardar una respuesta a una encuesta
@respuestas_bp.route('/encuestas/<string:id_unico>/responder', methods=['POST'])
def responder_encuesta(id_unico):
    # Obtener la encuesta por su ID unico
    encuesta = Encuesta.query.filter_by(id_unico=id_unico).first_or_404()
    ip_usuario = request.remote_addr

    # Limite de respuestas
    total_respuestas = RespuestaEncuesta.query.filter_by(encuesta_id=encuesta.id).count()  

    if encuesta.limite_respuestas and total_respuestas >= encuesta.limite_respuestas:
        return jsonify({'error': 'La encuesta ya ha alcanzado el límite de respuestas y está cerrada.'}), 403

    # Con esto se verifica si la IP ya ha respondido a esta encuesta
    respuesta_existente = Respuesta.query.filter_by(encuesta_id=encuesta.id, ip_usuario=ip_usuario).first()
    if respuesta_existente:
        return jsonify({'error': 'Ya has respondido a esta encuesta'}), 403

    # Crea una entrada en RespuestaEncuesta para registrar esta respuesta completa
    nueva_respuesta_encuesta = RespuestaEncuesta(
        encuesta_id=encuesta.id,
        ip_usuario=ip_usuario,
        fecha_respuesta=datetime.utcnow()
    )
    db.session.add(nueva_respuesta_encuesta)
    db.session.commit()

    datos = request.json
    respuestas = datos.get('respuestas')

    # Guardar cada respuesta en la base de datos
    for pregunta_id, texto_respuesta in respuestas.items():
        nueva_respuesta = Respuesta(
            pregunta_id=pregunta_id,
            texto=texto_respuesta,  
            fecha_respuesta=datetime.utcnow()
        )
        db.session.add(nueva_respuesta)

    db.session.commit()
    return jsonify({'message': 'Respuestas guardadas correctamente'}), 201


