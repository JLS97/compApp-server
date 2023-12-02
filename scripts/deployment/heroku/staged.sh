npm run build

git push --force-with-lease heroku-staged $(git rev-parse --abbrev-ref HEAD):master