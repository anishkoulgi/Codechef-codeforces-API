echo "📦 Committing files..."
git add .
git commit -m "$1"
echo "🚀 Pushing to Heroku"
git push heroku master
echo "🐳 Shipped container to Heroku!"