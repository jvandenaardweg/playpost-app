package com.aardwegmedia.playpost;

// import android.app.Application;
import androidx.multidex.MultiDexApplication;

import android.util.Log;
import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
// import com.facebook.react.BuildConfig; // Commenting this fixed a problem where the Metro bundler was not doing anything
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }
      // return Arrays.<ReactPackage>asList(
      //     new MainReactPackage(),
            new ReactNativeConfigPackage(),
      //       new RNScreensPackage(),
      //       new RNDeviceInfo(),
      //       new ReactNativeConfigPackage(),
      //       new RNIapPackage(),
      //       new ReanimatedPackage(),
      //       new AsyncStoragePackage(),
      //       new RNCWebViewPackage(),
      //       new ReactVideoPackage(),
      //       new RNFetchBlobPackage(),
      //       new RNFSPackage(),
      //       new NetInfoPackage(),
      //       new KeychainPackage(),
      //       new SplashScreenReactPackage(),
      //       new SharePackage(),
      //       new TrackPlayer(),
      //       new VectorIconsPackage(),
      //       new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
      //       new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
      //       new AppCenterReactNativePackage(MainApplication.this),
      //       new RNGestureHandlerPackage()
      // );
    // }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
