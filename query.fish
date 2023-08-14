#!/usr/bin/env fish

# Read clipboard content and write to file

set query (xclip -selection clipboard -o)

mkdir -p ./context/queries

echo "$query" > ~/projects/ResumeDoc/context/queries/profile.txt

bun run ./query.ts

echo "$(xclip -o)"

