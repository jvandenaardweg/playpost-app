# Readto App
When your eyes are too busy to read, but your ears are free to listen. Listen to any article from the web. Make the experience you enjoy by using different voices.

[![Build status](https://build.appcenter.ms/v0.1/apps/be2d00ac-bfc6-43ce-ab5f-3c7c7a674048/branches/master/badge)](https://appcenter.ms)

# Upgrading to new React Native version?
Use `react-native-git-upgrade`.

# Added manually
Below packages where added manually using the installation instructions. This required manually editting files. This should be taken into account when we upgrade React Native.

- [React Navigation](https://reactnavigation.org/docs/en/getting-started.html)
- [React Native Share Extension](https://github.com/alinz/react-native-share-extension)


# Troubleshooting
First, try to build from XCode. Open the `Readto.xcworkspace` file (not the `'.xcodeproject`).

Clean the cache: `cmd + shift + k`
Start a build: `cmd + b`

## Undefined symbols for architecture arm64
When you get errors related to "Undefined symbols for architecture arm64 - JSClassCreate". Add the `JavaScriptCore.framework` on top of the `Linked Frameworks and Libraries` in the `ReadtoShareExtension` target.
Fix from: https://stackoverflow.com/a/54542903/3194288

## Several errors relating to React imports
When you get build errors about missing imports with React related files with the `.h` extension. Make sure `Parallelize Builds` is off for both schemes. In `Product` > `Scheme` > `Manage schemes` > Open the `Build` tab > Uncheck `Parallelize Builds`. Do this for both the `Readto` and `ReadtoShareExtension`.
This will make sure React get's build first.
