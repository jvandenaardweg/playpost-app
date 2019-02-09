# Readto App
When your eyes are too busy to read, but your ears are free to listen. Listen to any article from the web. Make the experience you enjoy by using different voices.

[![Build status](https://build.appcenter.ms/v0.1/apps/be2d00ac-bfc6-43ce-ab5f-3c7c7a674048/branches/master/badge)](https://appcenter.ms)

# Added manually
https://reactnavigation.org/docs/en/getting-started.html


# Share extension
When adding the Share Extension package


# Troubleshooting

## Errors after installing the Share Extension
"Undefined symbols for architecture arm64 - JSClassCreate"
Add the `JavaScriptCore.framework`
https://stackoverflow.com/a/54542903/3194288

## Several errors relating to React imports
Make sure `Parallel builds` is off In `Product` > `Schema` > `Manage scheme` > `Build` tab > Uncheck `Parallelize Builds` for the App Extension.
