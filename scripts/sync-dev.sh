#!/bin/bash

# sync-dev.sh
# Syncs the current branch with the latest changes from the remote development branch.
# Usage: 
#   ./scripts/sync-dev.sh          (Default: Merge strategy - Recommended for Cloud Agents)
#   ./scripts/sync-dev.sh --rebase (Rebase strategy - Recommended for Local Devs)

# Exit immediately if a command exits with a non-zero status,
# unless it's part of a conditional check (like the merge below).
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color


# Parse arguments
USE_REBASE=false
for arg in "$@"; do
    if [ "$arg" == "--rebase" ]; then
        USE_REBASE=true
        shift
    fi
done

echo -e "${GREEN}Starting sync with origin/development...${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Warning: You have uncommitted changes. Please commit or stash them before syncing.${NC}"
fi

# Fetch latest changes
echo -e "Fetching origin..."
git fetch origin development

# Get current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "Current branch: ${GREEN}${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" == "development" ]; then
    echo -e "On development branch. Pulling latest changes..."
    git pull origin development
else
    if [ "$USE_REBASE" = true ]; then
        echo -e "Rebasing ${CURRENT_BRANCH} onto origin/development..."
        if git pull --rebase origin development; then
             echo -e "${GREEN}Successfully rebased onto origin/development.${NC}"
        else
             echo -e "${RED}Rebase conflict detected!${NC}"
             echo -e "${YELLOW}Please resolve conflicts manually (git rebase --continue) or abort (git rebase --abort).${NC}"
             exit 1
        fi
    else
        echo -e "Merging origin/development into ${CURRENT_BRANCH}..."
        if git merge origin/development; then
            echo -e "${GREEN}Successfully synced with origin/development.${NC}"
        else
            echo -e "${RED}Merge conflict detected!${NC}"
            echo -e "${YELLOW}Please resolve conflicts manually and commit the result.${NC}"
            exit 1
        fi
    fi
fi

echo -e "${GREEN}Sync complete.${NC}"
