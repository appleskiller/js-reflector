#!/bin/bash
echo "--- Ready for release ---"
echo ""
set -e
read -p "Enter release version: " VERSION

read -p "Releasing $VERSION - are you sure? (y/N) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "> Releasing $VERSION ..."
    VERSION=$VERSION
    # update version
    npm version $VERSION --message "[release] $VERSION"
    # commit
    echo "> Commit all change ..."
    git add -A
    git commit -m "[build] $VERSION"

    # tag
    echo "> Make tag v$VERSION ..."
    git tag -a v$VERSION -m "[tag] $VERSION"
    git push origin v$VERSION
    git push
    
    # publish
    echo "> Publish v$VERSION to NPM ..."
    npm publish
    echo "> Done"
fi