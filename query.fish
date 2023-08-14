#!/usr/bin/env fish

# Read clipboard content and write to file

set query (xclip -selection clipboard -o)

echo "$query" > ~/projects/ResumeDoc/context/query/profile.txt

bun run ./query.ts


