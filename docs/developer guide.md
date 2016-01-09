# Developer Guide

> This guide is currently broken

This guide provides information that helps you contribute to exseed project

## Developing Workflow

### Installation

Install gulp as automation tool, and then install dependencies of exseed library and example project

```
~ $ npm install -g gulp
~ $ cd exseed
~/exseed $ npm install
~/exseed $ cd example
~/exseed/example $ npm install
```

### Link Package

To run the example project with your modified version of exseed, we must link the `example/node_modules/exseed` package to the exseed source code

> Remember that every time after you install dependencies, you have to run these link commands again

```
~/exseed $ npm link
~/exseed $ cd example
~/exseed/example $ npm link exseed
```

### Build Library

It's recommanded that specify the optional `-w` switch, which monitors the file changes and is helpful when developing

```
~/exseed $ gulp -w
```

### Build & Run Example Project

We have linked the library, so we can execute the bin file globally:

```
~/exseed/example $ sd serve --watch
```

or locally:

```
~/exseed/example $ ./node_modules/.bin/sd serve --watch
```

### Test

You can test both exseed library and example project:

```
~/exseed $ npm test
```

or test the example project only:

```
~/exseed/example $ sd test
```