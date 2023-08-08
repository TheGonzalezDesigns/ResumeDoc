#!/usr/bin/env fish

# Read clipboard content and write to file
xclip -selection clipboard -o > ./context/jobs/profile.txt

# echo "Content has been copied to resume.txt"

bun run ./main.ts 0

echo "ProfessionalSummary.txt: \n"
cat ~/Documents/Resumes/Tests/ProfessionalSummary.txt
echo -e "\n"
echo "Coverletter.txt: \n"
cat ~/Documents/Coverletters/Tests/Letter.txt
echo -e "\n"
echo "SkillList.txt: \n"
cat ~/Documents/Resumes/Tests/SkillList.txt
