from flask import Blueprint, request, jsonify
from models.usuarios import Usuario
from extensiones import db
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth_bp', __name__)

# Registrar un nuevo usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    password = data.get('password')
    
    if not nombre or not email or not password:
        return jsonify({"message": "Faltan datos obligatorios"}), 400
    # Verificación de si el email ya existe en la base de datos
    if Usuario.query.filter_by(email=email).first():
        return jsonify({"message": "El correo electrónico ya está registrado."}), 400

    # Crea un nuevo usuario
    nuevo_usuario = Usuario(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password_hash=generate_password_hash(password)
    )
    
    db.session.add(nuevo_usuario)
    db.session.commit()

    access_token = create_access_token(identity=nuevo_usuario.id, expires_delta=timedelta(hours=5))

    return jsonify({
        "message": "Usuario registrado exitosamente.",
        "access_token": access_token
    }), 201

#   Inicio de sesion
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    usuario = Usuario.query.filter_by(email=email).first()
    
    if usuario and usuario.check_password(password):
        # Si la contraseña es correcta se crea un token
        access_token = create_access_token(identity=usuario.id, expires_delta=timedelta(hours=1))
        return jsonify(
            access_token=access_token,
            usuario={"nombre": usuario.nombre, "apellido": usuario.apellido}
        ), 200
    else:
        return jsonify({"message": "Credenciales incorrectas"}), 401
