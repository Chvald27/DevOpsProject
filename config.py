import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # SQLAlchemy Database URI
    SQLALCHEMY_DATABASE_URI = (
        
"postgresql://postgres:DevOps2024*@terraform-20241208071959927900000001.cl2gqc6scvwd.ca-central-1.rds.amazonaws.com:5432/webappdb"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Session configuration (if used)
    SESSION_TYPE = "filesystem"






