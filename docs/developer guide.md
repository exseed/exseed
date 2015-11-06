# Developer Guide

This guide provides information that helps you contribute to exseed project

## Git Workflow

### Fork Repo

First of all, fork the official [exseed](https://github.com/exseed/exseed) repo

### Getting Started

Clone forked version of exseed to local, add remote and create a `new feature` branch

```
$ git clone <your_forked_exseed_repo>
$ git remote add upstream https://github.com/exseed/exseed.git
$ git checkout -b <new_feature_branch>
```

### Develop with New Feature

Edit, stage and commit

```
$ git status
$ git add <some_file>
$ git commit
```

### Publish

```
$ git pull upstream
$ git push
```

### Open a Pull Request

Go to the exseed official repo and create a pull request

### After New Feature Merged

delete the feature branch

```
$ git branch -d <new_feature_branch>
```

## Developing Workflow

### Installation

Install gulp as automation tool, and then install dependencies

```
$ npm install -g gulp
$ npm install
```

### Link Package

```
$ npm link
```

### Usage

```
$ sd help
```

If you want to test your new feature with example project, please refer to [example/README](https://github.com/gocreating/exseed/example)