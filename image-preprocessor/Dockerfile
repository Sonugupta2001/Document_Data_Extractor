# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install Python dependencies, including flask-cors
RUN pip install --no-cache-dir flask flask-cors opencv-python pillow numpy pytesseract

# Expose port 5000
EXPOSE 5001

# Run the service
CMD ["python", "image_preprocessor.py"]
