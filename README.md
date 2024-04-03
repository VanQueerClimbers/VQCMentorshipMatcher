# Development

npm run dev

npm run test

# Deployment
npm run build
rm -rf deploy/*
cp -r out/* deploy/
cd deploy
git add .
git commit -m "update"
git push
cd ..
git add deploy
git commit -m "Bump deploy"
git push
