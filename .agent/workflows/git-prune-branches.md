---
description: Fetch and prune remote branches, and delete local branches that no longer exist on the remote
---

# Git Prune Branches Workflow

This workflow automates the cleanup of dead branches. It will first prune the remote-tracking branches, and then forcefully delete any local branches whose remote counterparts are marked as "gone".

> **Important:** Before running any commands, first detect the host operating system (e.g., Windows, macOS, Linux) and use the appropriate shell (PowerShell for Windows, Bash/Zsh for macOS/Linux).

1. Fetch updates and prune any remote-tracking branches that no longer exist on the remote.
// turbo
```sh
# Example for Bash/Zsh or PowerShell
git fetch --prune
```

2. Identify and delete any local branches whose remote upstreams are "gone".
// turbo
```sh
# Example for Bash/Zsh:
# git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -D

# Example for PowerShell:
# $goneBranches = git branch -vv | Select-String ": gone\]" | ForEach-Object { ($_.Line.Trim() -split '\s+')[0] }; if ($goneBranches) { $goneBranches | ForEach-Object { Write-Host "Deleting branch $_"; git branch -D $_ } } else { Write-Host "No local branches to prune." }
```

Run the appropriate command based on the detected shell.
