# Base image with Python
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["python", "run.py"]
