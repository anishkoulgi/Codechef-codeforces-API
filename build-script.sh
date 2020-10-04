git add .
git commit -m "$1"
heroku container:push web
heroku container:release web
heroku open