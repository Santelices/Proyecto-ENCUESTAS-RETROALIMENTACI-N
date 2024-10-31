from flask import Blueprint, request, jsonify
from models.encuestas import Encuesta
from models.preguntas import Pregunta
from models.opciones import Opcion
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensiones import db

encuestas_bp = Blueprint('encuestas_bp', __name__)

# Obtener encuesta con preguntas usando id_unico para compartir
@encuestas_bp.route('/encuestas/compartir/<string:id_unico>', methods=['GET'])
def obtener_encuesta_por_id_unico(id_unico):
    encuesta = Encuesta.query.filter_by(id_unico=id_unico).first_or_404()
    preguntas = Pregunta.query.filter_by(encuesta_id=encuesta.id).all()
    
    return jsonify({
        'encuesta': encuesta.serialize(),
        'preguntas': [pregunta.serialize() for pregunta in preguntas]
    })

# Obtener encuesta con las preguntas
@encuestas_bp.route('/encuestas/<int:id>', methods=['GET'])
@jwt_required()
def obtener_encuesta(id):
    encuesta = Encuesta.query.get_or_404(id)
    preguntas = Pregunta.query.filter_by(encuesta_id=encuesta.id).all()
    
    return jsonify({
        'encuesta': encuesta.serialize(),
        'preguntas': [pregunta.serialize() for pregunta in preguntas]
    })

# Obtener todas las encuestas
@encuestas_bp.route('/encuestas', methods=['GET'])
@jwt_required()
def obtener_encuestas():
    current_user_id = get_jwt_identity()
    # Filtro / las encuestas del usuario autenticado
    encuestas = Encuesta.query.filter_by(usuario_id=current_user_id).all()    
    encuestas_serializadas = [encuesta.serialize() for encuesta in encuestas]
    return jsonify(encuestas_serializadas), 200

# Crear una nueva encuesta 
@encuestas_bp.route('/encuestas', methods=['POST'])
@jwt_required()
def crear_encuesta():
    current_user_id = get_jwt_identity()
    print(f"Usuario autenticado: {current_user_id}")
    
    data = request.json
    print("Datos recibidos:", data)

    # Crea una nueva encuesta
    nueva_encuesta = Encuesta(
        titulo=data['titulo'],
        descripcion=data['descripcion'],
        usuario_id=current_user_id,
        limite_respuestas=data.get('limite_respuestas') 
    )
    db.session.add(nueva_encuesta)
    db.session.commit()

    # Crea preguntas asociadas a la encuesta
    preguntas_data = data.get('preguntas', [])  
    for pregunta_data in preguntas_data:
        nueva_pregunta = Pregunta(
            texto=pregunta_data['texto'],
            tipo_id=pregunta_data['tipo_id'],  
            obligatorio=pregunta_data['obligatorio'],
            encuesta_id=nueva_encuesta.id  
        )
        db.session.add(nueva_pregunta)
        db.session.commit()  
        # Guarda las opciones si el tipo de pregunta es "Opción Múltiple"  o sea "tipo_id == 2)"
        if nueva_pregunta.tipo_id == 2:
            opciones_data = pregunta_data.get('opciones', [])  
            for opcion_texto in opciones_data:
                nueva_opcion = Opcion(
                    texto=opcion_texto,
                    pregunta_id=nueva_pregunta.id  
                )
                db.session.add(nueva_opcion)

    db.session.commit() 
    return jsonify(nueva_encuesta.serialize()), 201

#Actualizaicon de encuesta
@encuestas_bp.route('/encuestas/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_encuesta(id):
    data = request.json
    print(f"Datos recibidos para actualizar encuesta: {data}") 
    encuesta = Encuesta.query.get_or_404(id)
    
    encuesta.titulo = data['titulo']
    encuesta.descripcion = data['descripcion']
    encuesta.limite_respuestas = data.get('limite_respuestas', encuesta.limite_respuestas)
    
    ids_preguntas_enviadas = [pregunta_data['id'] for pregunta_data in data.get('preguntas', []) if 'id' in pregunta_data]
    
    # Elimina preguntas que no están en la nueva data
    for pregunta in encuesta.preguntas:
        if pregunta.id not in ids_preguntas_enviadas:
            db.session.delete(pregunta)

    db.session.commit()  
    
    for pregunta_data in data.get('preguntas', []):
        if 'id' in pregunta_data:
            # Actualizar pregunta existente
            pregunta = Pregunta.query.get(pregunta_data['id'])
            if pregunta:
                pregunta.texto = pregunta_data['texto']
                pregunta.tipo_id = int(pregunta_data['tipo_id'])  
                pregunta.obligatorio = pregunta_data['obligatorio']

                # Procesar opciones para pregntas de tipo "Opción múltiple"
                if pregunta.tipo_id == 2:
                    opciones_data = pregunta_data.get('opciones', [])
                    
                    # Actualizar o agregar opciones
                    ids_opciones_enviadas = []
                    for opcion_data in opciones_data:
                        if 'id' in opcion_data:
                            opcion = Opcion.query.get(opcion_data['id'])
                            if opcion:
                                opcion.texto = opcion_data['texto']
                                ids_opciones_enviadas.append(opcion.id)
                        else:
                            nueva_opcion = Opcion(
                                texto=opcion_data['texto'],
                                pregunta_id=pregunta.id
                            )
                            db.session.add(nueva_opcion)
                            db.session.flush()  
                            ids_opciones_enviadas.append(nueva_opcion.id)

        else:
            # Insert nueva pregunta
            nueva_pregunta = Pregunta(
                texto=pregunta_data['texto'],
                tipo_id=int(pregunta_data['tipo_id']), 
                obligatorio=pregunta_data['obligatorio'],
                encuesta_id=encuesta.id
            )
            db.session.add(nueva_pregunta)
            db.session.flush()  

            # Agrega opciones si es "Opción múltiple"
            if nueva_pregunta.tipo_id == 2:
                opciones_data = pregunta_data.get('opciones', [])
                for opcion_data in opciones_data:
                    nueva_opcion = Opcion(
                        texto=opcion_data['texto'],
                        pregunta_id=nueva_pregunta.id
                    )
                    db.session.add(nueva_opcion)

    db.session.commit()  
    return jsonify(encuesta.serialize()), 200

# Eliminar encuesta
@encuestas_bp.route('/encuestas/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_encuesta(id):
    encuesta = Encuesta.query.get_or_404(id)
    db.session.delete(encuesta)
    db.session.commit()
    return jsonify({"message": "Encuesta eliminada con éxito"}), 200
