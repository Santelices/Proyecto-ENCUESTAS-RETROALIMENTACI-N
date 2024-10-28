from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify
from models.encuestas import Encuesta
from models.respuestas import Respuesta
from models.preguntas import Pregunta 

resultados_bp = Blueprint('resultados_bp', __name__)

@resultados_bp.route('/encuestas/<int:encuesta_id>/resultados', methods=['GET'])
@jwt_required()
def obtener_resultados(encuesta_id):
    encuesta = Encuesta.query.get_or_404(encuesta_id)

    # Obtenien preguntas de la encuesta con su serializacion de la ruta preguntas.py
    preguntas_serializadas = [pregunta.serialize() for pregunta in Pregunta.query.filter_by(encuesta_id=encuesta_id).all()]

    # Obtiene los resultados de preguntas de opción múltiple
    resultados_opciones = {}
    for pregunta in preguntas_serializadas:
        if pregunta['tipo_id'] == 2:  
            opciones_resultados = {}
            for opcion in pregunta['opciones']:
                conteo = Respuesta.query.filter_by(pregunta_id=pregunta['id'], texto=opcion['texto']).count()
                opciones_resultados[opcion['texto']] = conteo
            resultados_opciones[pregunta['id']] = opciones_resultados

    # Obtener las respuestas de texto
    resultados_texto = {}
    for pregunta in preguntas_serializadas:
        if pregunta['tipo_id'] == 1:  
            respuestas_texto = [respuesta.texto for respuesta in Respuesta.query.filter_by(pregunta_id=pregunta['id']).all()]
            resultados_texto[pregunta['id']] = respuestas_texto

    return jsonify({
        'encuesta': encuesta.serialize(),
        'preguntas': preguntas_serializadas,  
        'resultados_opciones': resultados_opciones,
        'resultados_texto': resultados_texto
    }), 200
