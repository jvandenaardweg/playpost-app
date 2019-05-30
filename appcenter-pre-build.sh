#!/usr/bin/env bash

# Creates an .env from ENV variables for use with react-native-config
# Taken from: https://github.com/luggit/react-native-config/issues/282#issuecomment-441615641
if [ $ENVIRONMENT = "production" ]; then
   cp .env.prod .env
elif [ $ENVIRONMENT = "staging" ]; then
   cp .env.staging .env
fi

printf "\n.env created with contents:\n"
cat .env

# Change bundle name of an iOS app for non-production
# Becomes: "Playpost Beta"
if [ "$APPCENTER_BRANCH" != "master" ];
then
    plutil -replace CFBundleName -string "\$(PRODUCT_NAME) Beta" $APPCENTER_SOURCE_DIRECTORY/Playpost/Info.plist
fi

# Run tslint before running the build
npm run lint

# Run the Typescript compiler before running the build
npm run typescript
