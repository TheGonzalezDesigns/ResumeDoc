#!/usr/bin/env fish

# Read clipboard content and write to file
xclip -selection clipboard -o > resume.txt

echo "Content has been copied to resume.txt"
