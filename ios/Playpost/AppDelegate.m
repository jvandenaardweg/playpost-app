/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>
#import <AppCenterReactNativeAnalytics/AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNative/AppCenterReactNative.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

// Custom added
// iOS 9.x or newer
// https://facebook.github.io/react-native/docs/linking
#import <React/RCTLinkingManager.h>
// /Custom added

@implementation AppDelegate

// Custom added
// https://facebook.github.io/react-native/docs/linking
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
// /Custom added

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [AppCenterReactNative register];  // Initialize AppCenter
  // Custom added
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:false];
  [AppCenterReactNative register];
  // /Custom added

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Playpost"
                                            initialProperties:nil];

  // Custom added
  // Original:
  // rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  rootView.backgroundColor = [UIColor blackColor];
  // /Custom added

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // Custom added
  [RNSplashScreen show];
  // /Custom added

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG

  // Custom added
  // This prevents the logs from constantly showing websocket connection errors
  // https://github.com/facebook/react-native/issues/21030#issuecomment-493392051
  // original:
  // return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  NSURL *jsUrl = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [[RCTBundleURLProvider sharedSettings] setJsLocation:jsUrl.host];
  return jsUrl;
  // /Custom added
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
