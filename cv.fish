#!/usr/bin/env fish

# Read clipboard content and write to file

set jobProfile (xclip -selection clipboard -o)

echo "$jobProfile" > ~/projects/ResumeDoc/context/jobs/profile.txt

bun run ./main.ts
