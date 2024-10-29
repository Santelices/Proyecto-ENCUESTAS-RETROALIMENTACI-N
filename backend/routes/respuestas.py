from flask import Blueprint, request, jsonify
from models.respuestas import Respuesta
from models.respuestaEncuesta import RespuestaEncuesta
from models.encuestas import Encuesta  
from extensiones import db
from datetime import datetime

respuestas_bp = Blueprint('respuestas_bp', __name__)
@respuestas_bp.route('/encuestas/<string:id_unico>/responder', methods=['GET', 'POST'])
def responder_encuesta(id_unico):
    # Obtener la encuesta por su ID único
    encuesta = Encuesta.query.filter_by(id_unico=id_unico).first_or_404()

    if request.method == 'GET':
        # Obtener las preguntas de la encuesta (asumiendo que la relación de preguntas está definida)
        preguntas = encuesta.preguntas  # Suponiendo que `preguntas` es la relación en el modelo `Encuesta`
        preguntas_serializadas = [
            {
                'id': pregunta.id,
                'texto': pregunta.texto,
                'tipo': pregunta.tipo  # Aquí puedes añadir más detalles según tu modelo de pregunta
            }
            for pregunta in preguntas
        ]
        return jsonify({
            'encuesta': {
                'id': encuesta.id,
                'titulo': encuesta.titulo,
                'descripcion': encuesta.descripcion,
                'preguntas': preguntas_serializadas
            }
        }), 200

    elif request.method == 'POST':
        # Guardar las respuestas a la encuesta
        ip_usuario = request.remote_addr
        total_respuestas = RespuestaEncuesta.query.filter_by(encuesta_id=encuesta.id).count()  

        if encuesta.limite_respuestas and total_respuestas >= encuesta.limite_respuestas:
            return jsonify({'error': 'La encuesta ya ha alcanzado el límite de respuestas y está cerrada.'}), 403

        # Verifica si la IP ya ha respondido a esta encuesta
        respuesta_existente = RespuestaEncuesta.query.filter_by(encuesta_id=encuesta.id, ip_usuario=ip_usuario).first()
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

