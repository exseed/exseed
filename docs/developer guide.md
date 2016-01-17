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

3. Link Projects

  ```
  ~/projects/exseed $ sudo npm link
  ~/projects/exseed-cli $ sudo npm link
  ~/projects/exseed-boilerplate $ sudo npm link exseed
  ```

4. Install gulp as automation tool

  ```
  ~/projects $ npm install -g gulp
  ```

### Link Package

Every time after you install dependencies, you have to run these link commands.

```
~/exseed $ npm link
~/exseed-boilerplate $ npm link exseed
~/exseed-cli $ npm link
```

The first two commands link the library and boilerplate together.
The last command expose `sd` execution binary for you to run exseed cli commands. 

### Build

```
~/exseed $ gulp                         # Terminal 1
~/exseed-cli $ gulp                     # Terminal 2
~/exseed-boilerplate $ sd build --watch # Terminal 3
```

### Run Boilerplate Project

```
~/exseed-boilerplate $ sd init          # Terminal 4
~/exseed-boilerplate $ sd serve         # Terminal 4
```

Then open `localhost:3000`

### Test

TBD