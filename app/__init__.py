from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

# Initialize the SQLAlchemy object (shared across the app)
db = SQLAlchemy()

def create_app(config_name="default"):
    """
    Application factory function to create and configure the Flask app.
    """
    app = Flask(__name__)

    # Load the configuration from the config file
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)

    # Register Blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app
