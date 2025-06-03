from functools import wraps
from flask import session, redirect, url_for, flash
from flask_login import current_user

def roles_required(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not current_user.is_authenticated:
                flash("Login is required", "warning")
                return redirect(url_for('main.login'))

            if current_user.role not in roles:
                flash("You don't have permissions to access this website", "danger")
                return redirect(url_for('main.dashboard'))

            return f(*args, **kwargs)
        return wrapper
    return decorator
