from app import db

class User(db.Model):
    __tablename__ = "users"  # Matches the existing table name in the database

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # For hashed passwords

    def __repr__(self):
        return f"<User {self.username}>"

