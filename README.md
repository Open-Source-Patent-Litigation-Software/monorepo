# EasyIP Workflow

This document describes the workflow for creating a new branch from the `development` branch, making changes, and merging it back into the `development` branch.

## Workflow Steps

### 1. Ensure Your Local Repository is Up-to-Date

Before creating a new branch, ensure that your local `development` branch is up-to-date with the remote repository.

``` bash
git checkout development
git pull origin development
```

### 2. Create a New Branch from the Development Branch

Create a new branch from the `development` branch. Replace `feature/new-feature` with a descriptive name for your new branch.

```bash
git checkout -b feature/new-feature
```

### 3. Make Your Changes

Implement the feature / changes planned.

### 4. Stage and Commit Your Changes

Stage and commit your changes with a descriptive message.

```bash
git add .
git commit -m 'Description of your changes'
```

### 5. Push the New Branch to the Remote Repository

Push the new branch to the remote repository.

```bash
git push origin feature/new-feature
```

### 6. Create a Pull Request

Go to your repository on GitHub (or your chosen Git service) and create a pull request from `feature/new-feature` to `development`.

### 7. Review and Merge

Review the pull request and merge into development.

### 8. Update Your Local Development Branch

After merging, update your local `development` branch to incorporate the changes.

```bash
git checkout development
git pull origin development
```

### 9. Delete the Feature Branch (Optional)

After the changes have been merged, you can delete the feature branch locally and remotely.

```bash
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### 10. Staging Changes in the Backend Directory

For staging any changes in the backend directory since the .gitignore is inconsistent.

```bash
find . -type f ! -path "*.pyc" ! -path "*/__pycache__/*" ! -path "*.idea/*" ! -path "*/env/*" | xargs git add
```
