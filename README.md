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

## Releasing a new version of the App?
Run `npm version x.x.x` and push to git.


## Setting up build environment
Make sure the `.env.staging` and `.env.production` files are filled with the right environment variables. Use the correct `ENVIRONMENT` environment variable:
- Staging: `ENVIRONMENT=staging`
- Production: `ENVIRONMENT=production`

A correct `.env` file is created upon build. See `appcenter-pre-build.sh`

# Troubleshooting
First, try to build from XCode. Open the `Playpost.xcworkspace` file (not the `'.xcodeproject`).

Clean the cache: `cmd + shift + k`
Start a build: `cmd + b`

## Hot Reloading not working
Make sure you:
1. Don't use a `index.ts` with a `export * from './Component`. Hot reloading will not work.
2. Don't use `React.memo()` around a Functional Component. Hot reloading will not work.
3. Use A Functional HMR plugin: https://github.com/bvic23/babel-plugin-functional-hmr

## React Native Track Player Swift build errors when building for local device
Make sure you:
1. First, build the app for the iOS Simulator
2. The Build System is set to `New Build System (Default)` in `File > Workspace Settings`
3. Clean the build folder, run `./react-native-clear-cache.sh`, rebuild for Simulator. Then build using `npm run device`

## Undefined symbols for architecture arm64
When you get errors related to "Undefined symbols for architecture arm64 - JSClassCreate". Add the `JavaScriptCore.framework` on top of the `Linked Frameworks and Libraries` in the `PlaypostShareExtension` target.
Fix from: https://stackoverflow.com/a/54542903/3194288

## Several errors relating to React imports
When you get build errors about missing imports with React related files with the `.h` extension. Make sure `Parallelize Builds` is off for both schemes. In `Product` > `Scheme` > `Manage schemes` > Open the `Build` tab > Uncheck `Parallelize Builds`. Do this for both the `Playpost` and `PlaypostShareExtension`.
This will make sure React get's build first.

## iOS Deployment Target 11.0
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


## Apple auto-renewable subscriptions
https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StoreKitGuide/Chapters/Subscriptions.html#//apple_ref/doc/uid/TP40008267-CH7-SW13

The behavior of auto-renewable subscriptions differs between the testing environment and the production environment.

In the testing environment, subscription renewals happen at an accelerated rate, and auto-renewable subscriptions renew a maximum of six times per day. This enables you to test how your app handles a subscription renewal, a subscription lapse, and a subscription history that includes gaps.

Because of the accelerated expiration and renewal rates, a subscription can expire before the system tries to renew the subscription, leaving a small lapse in the subscription period. Such lapses are also possible in production for a variety of reasons—make sure your app handles them correctly.

### General Notes on auto-renewal testing
Subscription length has been significantly shortened for testing purposes. This allows users to quickly test multiple renewals and expirations via TestFlight or with sandbox users.

Actual subscription duration -> Test duration

1 week -> 3 minutes
1 month -> 5 minutes
2 months -> 10 minutes
3 months -> 15 minutes
6 months -> 30 minutes
1 year -> 1 hour

The subscription will automatically renew 6 times per account per 8 hour window, then the subscription will automatically expire at the end of each subscription period. These renewals happen automatically whether the app is open or not, just like renewals on the App Store. Unlike the App Store, there’s no option to cancel, so there’s no way to directly test cancelation. There’s also no way to test subscription management while using TestFlight or sandbox users.

Each automatic renewal sends a transaction to the app. The transaction, or transactions, depending on how much time has passed, is processed the next time the app is opened. Validating these transactions triggers yet another password prompt. When the app is live on the App Store it shouldn’t trigger these additional password prompts.


### Testing deep links on iOS
1. Run the App in a Simulator: `react-native run-ios --simulator "iPhone X"`
2. Close the App
3. Run `xcrun simctl openurl booted playpost://login/reset-password/123456`
4. App should now open on the correct route

To test universal links, use: `xcrun simctl openurl booted https://playpost.app/login/reset-password/123456`

## Generate App Screenshots
Use the Postman Mock Server to allow mocked responses to be send to the iPhone Simulator. We can change these mocked responses to edit titles, sources and authors from the articles in the App.

1. Open Postman with the playpost-api collection
2. Select the request you want to mock
3. Do the request to the local API
4. Save the response using the "Save" button on the right
5. The response will be saved for use in the mock server

To manually edit the mocked response:
1. Click the request
2. Open "Examples (1)" on the top right
3. Edit the response
4. Save the response

## Release a new version
1. Make changes in the `develop` branche
2. When the changes are fully tested and working, run `npm version patch` or `npm version minor` or `npm version major`
3. Push those changes to `develop`
4. Make sure the `develop` branche builds correctly
5. Go to GitHub and merge `develop` into `master`
6. A production build will now be created. Upon success, it's send to TestFlight.
7. Go to App Store Connect and find the production build based on the build number from AppCenter
8. Send that version to Apple for review
