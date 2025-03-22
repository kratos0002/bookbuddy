#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}BookBuddy GitHub Push Script${NC}"
echo "This script will help you push your code to GitHub"
echo "------------------------------------------------"

# Check if git is installed
if ! [ -x "$(command -v git)" ]; then
  echo -e "${RED}Error: git is not installed.${NC}" >&2
  exit 1
fi

# Initialize git if not already done
if [ ! -d .git ]; then
  echo -e "${YELLOW}Initializing git repository...${NC}"
  git init
  echo -e "${GREEN}Git repository initialized!${NC}"
else
  echo -e "${GREEN}Git repository already initialized.${NC}"
fi

# Check if remote already exists
if git remote | grep -q "origin"; then
  echo -e "${YELLOW}Remote 'origin' already exists. Do you want to update it? (y/n)${NC}"
  read -r answer
  if [ "$answer" = "y" ]; then
    git remote set-url origin https://github.com/kratos0002/bookbuddy.git
    echo -e "${GREEN}Remote 'origin' updated!${NC}"
  fi
else
  # Add remote
  echo -e "${YELLOW}Adding remote 'origin'...${NC}"
  git remote add origin https://github.com/kratos0002/bookbuddy.git
  echo -e "${GREEN}Remote 'origin' added!${NC}"
fi

# Stage all files
echo -e "${YELLOW}Staging all files...${NC}"
git add .
echo -e "${GREEN}Files staged!${NC}"

# Commit changes
echo -e "${YELLOW}Enter a commit message (default: 'Initial commit of BookBuddy application'):${NC}"
read -r commit_message
if [ -z "$commit_message" ]; then
  commit_message="Initial commit of BookBuddy application"
fi

git commit -m "$commit_message"
echo -e "${GREEN}Changes committed!${NC}"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
echo "You may be prompted for your GitHub credentials."
echo "If you have 2FA enabled, use a personal access token instead of your password."

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
  echo -e "Your code is now available at: ${YELLOW}https://github.com/kratos0002/bookbuddy${NC}"
else
  echo -e "${RED}Failed to push to GitHub. Please check your credentials and try again.${NC}"
  echo "You can manually push using: git push -u origin $current_branch"
fi