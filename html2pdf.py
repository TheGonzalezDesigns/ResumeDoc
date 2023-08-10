import pdfkit
import sys

def html_to_pdf(input_html_path, output_path):
    """
    Convert the given HTML file to a PDF file.

    Parameters:
    - input_html_path (str): The path to the HTML file to convert.
    - output_path (str): The path where the PDF file should be saved.
    """
    try:
        pdfkit.from_file(input_html_path, output_path)
        print(f"PDF saved to {output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}")


# The script expects input_html_path and output_path as command line arguments
html_to_pdf(sys.argv[1], sys.argv[2])
