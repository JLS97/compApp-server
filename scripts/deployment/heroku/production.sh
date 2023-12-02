npm run build

git push --force-with-lease heroku-production $(git rev-parse --abbrev-ref HEAD):master