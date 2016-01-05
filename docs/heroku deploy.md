# Heroku Deployment

## Heroku Setup

Create new app `exseed`

## Local Setup

```
$ git remote add heroku git@heroku.com:<heroku project name>.git
$ heroku git:remote -a <heroku project name>
```

## Deploy

```
# cd exseed/example
git init
git add .
git commit -m "deploy"
git remote add heroku git@heroku.com:exseed.git
heroku git:remote -a exseed
git push heroku master
rm -fr .git
```