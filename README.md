# Playpost App

When your eyes are too busy to read, but your ears are free to listen. Listen to any article from the web. Make the experience you enjoy by using different voices.

## Local development setup

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

5. Run `react-native start`
6. Then run `react-native run-ios` or `react-native run-android`

Done!

## AppCenter builds setup

Use the Distribution build Provisioning Profile's on all branches.

- Shared Scheme: Playpost
- Xcode version: 10.2
- Node.js version: 12.x
- Build scripts: Pre-build
- Build frequency: **See below, different for each environment**
- Use legacy build system: On
- Automatically increment build number: On
- Build number format: Build ID
- Run unit testse: On

### develop

Build frequency: Manually choose when to run builds

Environment variables:

```json
ENVIRONMENT="test"
RN_APPLE_IAP_SHARED_SECRET="FILL_IN"
RN_NODE_ENV="test"
RN_API_URL="https://playpost-api-test.herokuapp.com"
```

Distribute builds to: Store > App Store Connect Users

### master

Build frequency: Build this branch on every push

Environment variables:

```json
ENVIRONMENT="production"
RN_APPLE_IAP_SHARED_SECRET="FILL_IN"
RN_NODE_ENV="production"
RN_API_URL="https://api.playpost.app"
```

Distribute builds to: Store > Pre-Production

## The development workflow
- `master` is production. It's sacred. **Only** merge changes into `master` when a release is ready and fully tested.
- Always make sure `develop` has the latest `master` changes in it. Merge `master` into `develop`.
- When working on a feature, create `/feature/feature-name` branches off `master`. Merge them into `develop` when they are tested and done.
- Always write tests for the feature you are building.
- `develop` should always contain a working version.

## How to release a new version to the App Store

1. Make changes in the `develop` branche
2. Build a `develop` version for TestFlight. Test that version using TestFlight.
2. When the changes are fully tested and working, merge them into `master`
3. In the `master` branche, run `npm version patch` or `npm version minor` or `npm version major`. A changelog is now generated and the correct version is added to the required files.
4. When that's done, push those changes to `master`
5. Merge `master` back into `develop`, so the `develop` branche is up to date with the latest versioning and changelog
6. Go to AppCenter and run the `master` build. A production build will now be created in AppCenter. Upon success, it's send to TestFlight.
7. Go to App Store Connect and find the production build in the TestFlight tab based on the build number from AppCenter. Wait for the status to go from `Processing` to `Ready to Submit`
8. When the status is `Ready to Submit`, submit it to the TestFlight users.
9. Test the App changes in TestFlight. If all is good, then it's ready to send to Apple for review.
10. Send that version to Apple for review

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

E-mail: `sandbox2@playpost.app`
Password: `Sandboxdemo!1`

## Running local dev version on a device

1. Open XCode and add your device
2. Make sure you have created the `.env.local` from the Setup step with the IP address of your Computer in the `API_URL`
3. Make sure that `API_URL` in the `.env.local` is reachable from outside your Computer, for example; not blocked by firewall rules
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


# Android
Key store alias: `playpost-upload-key.keystore`, password: `testtest`

# Known Issues
## App Crashes when changing playback speed
This is a known issue and should not happen in the Release build. It's is fixed in newer versions of React Native Track Player: https://github.com/react-native-kit/react-native-track-player/issues/516
