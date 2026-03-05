---
description: Fetch and prune remote branches, and delete local branches that no longer exist on the remote
---

# Git Prune Branches Workflow

This workflow automates the cleanup of dead branches. It will first prune the remote-tracking branches, and then forcefully delete any local branches whose remote counterparts are marked as "gone".

1. Fetch updates and prune any remote-tracking branches that no longer exist on the remote.
// turbo
```powershell
git fetch --prune
```

2. Identify and delete any local branches whose remote upstreams are "gone".
// turbo
```powershell
$goneBranches = git branch -vv | Select-String ": gone\]" | ForEach-Object { ($_.Line.Trim() -split '\s+')[0] }; if ($goneBranches) { $goneBranches | ForEach-Object { Write-Host "Deleting branch $_"; git branch -D $_ } } else { Write-Host "No local branches to prune." }
```
