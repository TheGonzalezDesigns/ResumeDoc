#!/usr/bin/env fish

clear

# Read clipboard content and write to file
set job_profile (xclip -selection clipboard -o)
echo "$job_profile" > ./context/jobs/profile.txt

# Execute main script and log the output
time bun run ./_main.ts > run.log 2>&1

# Define directory paths
set html_root "./src/html/"
set pdf_root "./src/pdfs/"
set sub_dirs "cover_letters" "resumes"

# Process HTML files in specified subdirectories and convert them to PDF
for dir in $sub_dirs
    set html_dir $html_root$dir/
    set pdf_dir $pdf_root$dir/

    if not test -d $pdf_dir
        mkdir -p $pdf_dir
    end

    for html_file in $html_dir*.html
        set pdf_file (basename $html_file .html).pdf
        python3 html2pdf.py $html_file $pdf_dir$pdf_file > /dev/null
        rm $html_file
    end
end

# Relocate the generated PDFs to the respective directories
mkdir -p ~/Documents/Resumes > /dev/null
for file in ./src/pdfs/resumes/*.pdf
    mv $file ~/Documents/Resumes/
end

mkdir -p ~/Documents/Coverletters > /dev/null
for file in ./src/pdfs/cover_letters/*.pdf
    mv $file ~/Documents/Coverletters
end
