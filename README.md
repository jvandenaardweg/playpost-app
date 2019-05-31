# Playpost App
When your eyes are too busy to read, but your ears are free to listen. Listen to any article from the web. Make the experience you enjoy by using different voices.

[![Build status](https://build.appcenter.ms/v0.1/apps/be2d00ac-bfc6-43ce-ab5f-3c7c7a674048/branches/master/badge)](https://appcenter.ms)

# Set up
1. Run `npm install`
2. Make sure you have accepted all Android SDK licenses, run: `sdkmanager --licenses`
3. Create a `.env` file in the root, containing:
```json
NODE_ENV="development"
API_URL="http://localhost:3000"
APPLE_IAP_SHARED_SECRET="FILL_IN"
```
Ask the repo maintainer for the `APPLE_IAP_SHARED_SECRET` contents.
4. Create a `.env.ocal` file in the root, containing:
```json
NODE_ENV="development"
API_URL="http://192.168.0.102:3000"
APPLE_IAP_SHARED_SECRET="FILL_IN"
```
Where `192.168.0.102` is your own local machine's IP address. This is used for on device developing.
5. Run `react-native run-ios` or `react-native run-android`

## Installing Detox (E2E Testing)
1. Run `brew update`
2. Run `brew tap wix/brew`
3. Run `brew install applesimutils`
4. Then you can run `npm run test:e2e`

## Upgrading to new React Native version?
Use `react-native-git-upgrade`.

## Upgrading NPM depedencies?
Run `npm run upgrade-interactive`


## Setting up build environment
Make sure the `.env.staging` and `.env.production` files are filled with the right environment variables. Use the correct `ENVIRONMENT` environment variable:
- Staging: `ENVIRONMENT=staging`
- Production: `ENVIRONMENT=production`

A correct `.env` file is created upon build. See `appcenter-pre-build.sh`

# Troubleshooting
First, try to build from XCode. Open the `Playpost.xcworkspace` file (not the `'.xcodeproject`).

Clean the cache: `cmd + shift + k`
Start a build: `cmd + b`

## Undefined symbols for architecture arm64
When you get errors related to "Undefined symbols for architecture arm64 - JSClassCreate". Add the `JavaScriptCore.framework` on top of the `Linked Frameworks and Libraries` in the `PlaypostShareExtension` target.
Fix from: https://stackoverflow.com/a/54542903/3194288

## Several errors relating to React imports
When you get build errors about missing imports with React related files with the `.h` extension. Make sure `Parallelize Builds` is off for both schemes. In `Product` > `Scheme` > `Manage schemes` > Open the `Build` tab > Uncheck `Parallelize Builds`. Do this for both the `Playpost` and `PlaypostShareExtension`.
This will make sure React get's build first.

## iOS Deployment Target 12.2
The Deployment Target is locked at `12.2` because of our In App Purchase package to allow promotion codes.

The other minimum deployment target is `10.0`, below that Share Extension will not work in Safari in iOS. Pretty important.

## Share Extension iOS Target Properties
Make sure the Share Extension has the properties below. This makes sure the Share Extension is visible in; Safari, other browsers like Chrome ánd other apps that share URL's from within the App. So our Share Extension shows in those apps.

```
<key>NSExtension</key>
<dict>
  <key>NSExtensionAttributes</key>
  <dict>
    <key>NSExtensionActivationRule</key>
    <dict>
      <key>NSExtensionActivationDictionaryVersion</key>
      <integer>2</integer>
      <key>NSExtensionActivationSupportsText</key>
      <true/>
      <key>NSExtensionActivationSupportsWebPageWithMaxCount</key>
      <integer>1</integer>
      <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
      <integer>1</integer>
    </dict>
  </dict>
  <key>NSExtensionMainStoryboard</key>
  <string>MainInterface</string>
  <key>NSExtensionPointIdentifier</key>
  <string>com.apple.share-services</string>
</dict>
  ```

## In App Purchase Test account
Use the account below to test the in app purchase features. This is a Sandbox user created through App Store Connect: https://itunesconnect.apple.com/access/testers

**Important**: Do NOT login to iCloud or iTunes, as this will invalidate the Sandbox account.

To use the Sandbox account: just purchase a subscription, you will be prompted to login. Use the credentials below:

E-mail: `tester@playpost.app`
Password: `m382qQLi^{Q^>nY692g>k8Z8Kq39rB`

## Running local dev version on a device
1. Open XCode and add your device
2. Create a `.env.local` file in the root of this project with the same contents as the `.env` file, but change the address of the `API_URL` from `localhost` to your computer's local IP address, for example: `API_URL="http://192.168.0.102:3000`
3. Make sure that `API_URL` is reachable
4. Make sure your iPhone and Computer is using the same WIFI/Network
5. Run `npm run device`. As this will use the environment vars used in `.env.local`. The App installed on your device will now use your local running API.
