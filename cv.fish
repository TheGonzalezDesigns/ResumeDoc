#!/usr/bin/env fish

# Read clipboard content and write to file

set jobProfile (xclip -selection clipboard -o)

echo "$jobProfile" > ~/projects/ResumeDoc/context/jobs/profile.txt

bun run ./main.ts

# Directory paths
set html_root "./src/html/"
set pdf_root "./src/pdfs/"

# Sub directories
set sub_dirs "coverletters" "resumes"

# Iterate over each sub-directory
for dir in $sub_dirs
    set html_dir $html_root$dir/
    set pdf_dir $pdf_root$dir/

    # Ensure pdf sub directory exists
    if not test -d $pdf_dir
        mkdir -p $pdf_dir
    end

    # Iterate over each HTML file in the sub-directory of html directory
    for html_file in $html_dir*.html
        # Derive the output PDF filename
        set pdf_file (basename $html_file .html).pdf

        # Convert the HTML to PDF
        python3 html2pdf.py $html_file $pdf_dir$pdf_file

        # Remove the original HTML file
        rm $html_file
    end
  end
