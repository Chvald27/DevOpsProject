from flask import Blueprint, render_template

# Create a Blueprint for the main routes
main = Blueprint('main', __name__)

@main.route('/')
def home():
    """
    Home page route.
    """
    return render_template('index.html')

@main.route('/users')
def users():
    """
    Example route to display users (static or dynamic).
    """
    return render_template('users.html')
