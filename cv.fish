#!/usr/bin/env fish

# Read clipboard content and write to file

set jobProfile (xclip -selection clipboard -o)

echo "$jobProfile" > ~/projects/ResumeDoc/context/jobs/profile.txt

echo "Profile: $jobProfile"

bun run ./_main.ts
#bun run ./main.ts > run.log 2>&1
# Directory paths
set html_root "./src/html/"
set pdf_root "./src/pdfs/"

# Sub directories
set sub_dirs "cover_letters" "resumes"

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
        echo -e "\nConverting $html_file to $pdf_dir$pdf_file"
        cat $html_file
        # Convert the HTML to PDF
        python3 html2pdf.py $html_file $pdf_dir$pdf_file > /dev/null

        # Remove the original HTML file
        rm $html_file
    end
  end

for file in ./src/pdfs/resumes/*.pdf
    echo -e "\nRelocating resume: $file"
    #cat $file
    mv $file /home/c43/Documents/Resumes/Polished/Tailored/
end

for file in ./src/pdfs/cover_letters/*.pdf
    echo -e "\nRelocating letter: $file"
    #cat $file
    mv $file /home/c43/Documents/Coverletters/Tailored/
  end
