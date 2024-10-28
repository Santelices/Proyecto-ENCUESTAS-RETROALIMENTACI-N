from flask import Blueprint, request, jsonify
from models.usuarios import Usuario
from extensiones import db

usuarios_bp = Blueprint('usuarios_bp', __name__)

# Obtener todos los usuarios
@usuarios_bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([usuario.serialize() for usuario in usuarios])

# Obtener un usuario por ID
@usuarios_bp.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify(usuario.serialize())

#Crear Usuaio
@usuarios_bp.route('/usuarios', methods=['POST'])
def crear_usuario():
    data = request.json
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        email=data['email']
    )
    
    # Aquí llamamos a 'set_password' que hashea la contraseña
    nuevo_usuario.set_password(data['password'])  

    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify(nuevo_usuario.serialize()), 201

# Actualizar un usuario
@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    data = request.json
    usuario.nombre = data['nombre']
    usuario.email = data['email']
    
    if 'password' in data:
        usuario.set_password(data['password'])  # NO hash directo en la ruta

    db.session.commit()
    return jsonify(usuario.serialize()), 200


# Eliminar un usuario
@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado con éxito"}), 200
