from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")  # This loads the SECRET_KEY

    # Initialize extensions
    db.init_app(app)
    Session(app)

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app

