#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: sh deploy.sh [--new] [--install]"
    echo "Options:"
    echo "  --new         Perform a fresh deployment."
    echo "  --install     Install dependencies."
    exit 1
}

# Parse parameters
npm_install=false
fresh_deployment=false

while [ "$#" -gt 0 ]; do
    case $1 in
        --new) 
            fresh_deployment=true
            npm_install=true  # Set npm_install to true if fresh_deployment is true
            shift 
            ;;
        --install) 
            npm_install=true
            shift 
            ;;
        *) 
            echo "Unknown parameter: $1"
            usage 
            ;;
    esac
done

# Update version dynamically
npm version "$(node -p "const v=require('./package.json').version.split('.'); v[2] = parseInt(v[2]) + 1; v.join('.')")" --no-git-tag-version

# Set script constants (settings)
server=raygun-ubuntu

# Get the current version and name from package.json (removing quotes)
version=$(npm pkg get version | tr -d '"') 
name=$(npm pkg get name | tr -d '"') 
service=voyzu-$name.service # name of the linux service running on the remote server

# Push to git
git add .
git commit -m "auto commit of $version"
git push

# Execute the SSH command with commands to run on the remote server
ssh $server << ENDSSH

    if [ "$fresh_deployment" = true ]; then
        echo "Performing fresh deployment: Cloning repository..."
        git clone git@github.com:voyzu-app/$name.git
        cd $name || exit 1 
    else
        cd $name || exit 1 
        git pull
    fi

    if [ "$npm_install" = true ]; then
        cd src || exit 1
        npm install
        cd .. # into app dir
    fi

    serverVersion=\$(npm pkg get version | tr -d '"')

    echo "deployed new component $name \$serverVersion"

ENDSSH

echo "deployment of $name $version to $server completes"