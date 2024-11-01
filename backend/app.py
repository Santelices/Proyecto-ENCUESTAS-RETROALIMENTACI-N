import os
from flask import Flask
from config import config
from extensiones import db, cors, jwt
from routes import auth_bp, usuarios_bp, encuestas_bp, respuestas_bp, opciones_bp, tipopregunta_bp, resultados_bp, visita_bp

app = Flask(__name__)
app.config.from_object(config['Desarrollo'])
db.init_app(app)

@app.route("/")
def home():
    return "Bienvenido al backend de la aplicación de encuestas"

cors.init_app(app, resources={r"/*": {"origins": "https://encretrofront.onrender.com"}},
              allow_headers=["Content-Type", "Authorization"],
              supports_credentials=True)

jwt.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(encuestas_bp)
app.register_blueprint(respuestas_bp)
app.register_blueprint(opciones_bp)
app.register_blueprint(tipopregunta_bp)
app.register_blueprint(resultados_bp)
app.register_blueprint(visita_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Base de datos y tablas creadas con éxito")
    
    app.run()