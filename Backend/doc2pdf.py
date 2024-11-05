from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import subprocess
import shutil
import platform

app = Flask(__name__)
CORS(app, resources={r"/convert": {"origins": "http://localhost:5173"}})  # Allow requests from localhost:5173

def get_downloads_folder():
    if platform.system() == "Windows":
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:
        return os.path.join(os.path.expanduser("~"), "Downloads")

def convert_one_file(filename):
    downloads_folder = get_downloads_folder()
    pdf_filename = os.path.join(downloads_folder, f"{os.path.basename(filename)[:-5]}.pdf")

    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', filename, '--outdir', 'tmp'], check=True)
    os.rename(f'tmp/{filename[:-5]}.pdf', pdf_filename)
    shutil.rmtree("tmp")

@app.route('/convert', methods=['POST'])
def convert():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file to a temporary location
    temp_file_path = os.path.join("tmp", file.filename)
    os.makedirs("tmp", exist_ok=True)  # Create tmp directory if it doesn't exist
    file.save(temp_file_path)

    try:
        convert_one_file(temp_file_path)  # Call the conversion function
        return jsonify({"message": "File converted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)  # Clean up temporary file

if __name__ == '__main__':
    app.run(debug=True)