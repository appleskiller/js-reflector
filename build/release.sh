#!/bin/bash
set -e
echo "> Check Git status: "
echo ""
git status
read -p "Commit all change before release? (y/n) " COMMIT
if [[ "$COMMIT" = "y" || "$COMMIT" = "" ]];then
    # commit
    git add -A
    git commit -m "[build] $VERSION"
fi
echo "--- Ready for release ---"
echo ""
read -p "Enter release version: " VERSION
# tag
echo "> Make tag v$VERSION ..."
npm version $VERSION
git push origin --tags
git push
# publish
echo "> Publish v$VERSION to NPM ..."
npm publish
echo "> Done"