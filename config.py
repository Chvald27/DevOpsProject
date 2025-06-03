import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # SQLAlchemy Database URI
    SQLALCHEMY_DATABASE_URI = (
        
"postgresql://postgres:DevOps2024*@localhost/webappdb"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Session configuration (if used)
    SESSION_TYPE = "filesystem"






