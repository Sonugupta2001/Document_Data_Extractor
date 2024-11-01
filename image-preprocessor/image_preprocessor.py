from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        image = Image.open(file.stream)

        if image.mode != "RGB":
            image = image.convert("RGB")
        
        image_np = np.array(image)

        gray_image = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        _, binary_image = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        text = pytesseract.image_to_string(binary_image, lang='eng')
        return jsonify({'text': text})

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)