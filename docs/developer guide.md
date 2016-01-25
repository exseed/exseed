# Developer Guide

This guide provides information that helps you contribute to exseed project

## Developing Workflow

### Installation

1. Fork and install exseed related projects

  ```
  ~/projects $ git clone https://github.com/<your_username>/exseed.git
  ~/projects $ git clone https://github.com/<your_username>/exseed-cli.git
  ~/projects $ git clone https://github.com/<your_username>/exseed-boilerplate.git
  ```

2. Install dependencies

  ```
  ~/projects/exseed $ sudo npm install
  ~/projects/exseed-cli $ sudo npm install
  ~/projects/exseed-boilerplate $ sudo npm install
  ```

3. Install gulp as automation tool

  ```
  ~/projects $ npm install -g gulp
  ```

### Build Library & CLI

```
~/exseed $ gulp                         # Terminal 1
~/exseed-cli $ gulp                     # Terminal 2
```

The two processes will stop logging anything after `Finished 'watch'`, which is default behavior. You can leave the two processes run in the background, and they will monitor source file changing.

### Link Package

```
~/exseed $ npm link
~/exseed-cli $ npm link
~/exseed-boilerplate $ npm link exseed
```

The first and the last commands link the library and boilerplate together.
The command in the middle exposes `sd` execution binary for you to run exseed cli commands. 

### Build & Run Boilerplate Project

```
~/exseed-boilerplate $ sd build --watch # Terminal 3
~/exseed-boilerplate $ sd init          # Terminal 4
~/exseed-boilerplate $ sd serve         # Terminal 4
```

Then open `localhost:3000`

### Test

TBD