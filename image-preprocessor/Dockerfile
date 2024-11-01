FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir flask flask-cors opencv-python pillow numpy pytesseract

EXPOSE 5001

CMD ["python", "image_preprocessor.py"]
