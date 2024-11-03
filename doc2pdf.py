import os
from docx2pdf import convert
import platform

def get_downloads_folder():
    if platform.system() == "Windows":
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:
        return os.path.join(os.path.expanduser("~"), "Downloads")

def convert_one_file(filename):
    downloads_folder = get_downloads_folder()
    pdf_filename = os.path.join(downloads_folder, f"{os.path.basename(filename)[:-5]}.pdf")
    
    convert(filename, pdf_filename)
    
    print(f"Converted {filename} to {pdf_filename}")
    
    if os.path.exists(filename):
        os.remove(filename)
        print(f"Deleted {filename}")
    else:
        print(f"Could not delete {filename}")

convert_one_file("abc.docx")