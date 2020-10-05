echo "📦 Committing files..."
git add .
git commit -m "$1"
echo "🚀 Pushing to Heroku"
echo "🐳 Shipping container to Heroku"
git push heroku master