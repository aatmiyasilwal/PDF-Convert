import os
import subprocess
import shutil
import platform

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

convert_one_file("WhatsApp Image 2024-10-05 at 23.06.02.jpeg")