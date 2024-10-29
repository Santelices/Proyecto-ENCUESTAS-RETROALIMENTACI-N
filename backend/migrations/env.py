import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from models import db  # Asegúrate de ajustar el import según tu estructura
from config import DesarrolloConfig  # Importa tu configuración si la necesitas

# Esto establece la configuración de Alembic
config = context.config

# Cargar el archivo de configuración para logging, si existe
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Define el objeto de metadatos de los modelos como target_metadata
target_metadata = db.metadata  # Esto permite a Alembic detectar cambios automáticamente

# Toma la URL de la base de datos del entorno
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL", DesarrolloConfig.SQLALCHEMY_DATABASE_URI))

def run_migrations_offline() -> None:
    """Ejecutar migraciones en modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Ejecutar migraciones en modo 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# Selecciona entre modo offline y online
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
