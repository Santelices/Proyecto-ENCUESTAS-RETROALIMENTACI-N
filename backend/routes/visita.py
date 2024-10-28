from flask import Blueprint, request, jsonify
from datetime import datetime
from models import Visita
from extensiones import db

visita_bp = Blueprint('visita_bp', __name__)

@visita_bp.route('/registrar-visita', methods=['POST'])
def registrar_visita():
    ip_usuario = request.remote_addr  # Obtener la IP del usuario
    visita = Visita.query.filter_by(ip_usuario=ip_usuario).first()
    
    if not visita:
        # Si es una visita nueva se registra
        nueva_visita = Visita(ip_usuario=ip_usuario, fecha_ultima_visita=datetime.utcnow())
        db.session.add(nueva_visita)
    else:
        # Si ya existe se actualiza la fecha de última visita
        visita.fecha_ultima_visita = datetime.utcnow()
    
    db.session.commit()
    
    total_visitas = Visita.query.count()  # Contador de visitas únicas
    return jsonify({"total_visitas": total_visitas})
