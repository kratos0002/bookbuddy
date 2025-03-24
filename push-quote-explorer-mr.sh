#!/bin/bash

# Set up Git configuration if needed
if [ -z "$(git config --get user.name)" ]; then
  git config --global user.name "LitViz Developer"
  git config --global user.email "developer@litviz.example.com"
fi

# Create a new branch for the Quote Explorer feature
BRANCH_NAME="feature/quote-explorer"
echo "Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Add all modified files
echo "Adding files to Git staging area"
git add server/services/quote-explorer-service.ts
git add book_processing/extract_quotes.py
git add shared/schema.ts
git add server/routes.ts
git add server/storage.ts
git add MERGE_REQUEST.md

# Commit changes
echo "Committing changes"
git commit -m "Add Quote Explorer feature
- Added schema for quotes and related entities
- Implemented Quote Explorer service
- Added API endpoints for quote exploration
- Created Python script for quote extraction from PDF"

# Push changes to remote
echo "Pushing changes to remote repository"
git push -u origin $BRANCH_NAME

echo "Merge Request branch pushed successfully!"
echo "Now you can create an MR on your Git platform (GitHub/GitLab/etc.) from the '$BRANCH_NAME' branch"