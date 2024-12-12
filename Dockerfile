# Use the official Python image as a base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Ensure the config file is properly recognized
ENV PYTHONPATH "${PYTHONPATH}:/app"

# Expose port 8080 for the Flask app
EXPOSE 8080

# Set the environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Run the Flask application when the container starts
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]

