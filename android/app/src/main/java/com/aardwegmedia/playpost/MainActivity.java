package com.aardwegmedia.playpost;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.oblador.vectoricons.VectorIconsPackage;
import com.guichaguri.trackplayer.TrackPlayer;
import com.alinz.parkerdan.shareextension.SharePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
      * Returns the name of the main component registered from JavaScript. This is used to schedule
      * rendering of the component.
      */
    @Override
    protected String getMainComponentName() {
      return "Playpost";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here

      // Use null instead of savedInstanceState as suggested here: https://github.com/keybase/client/commit/ea82cfcc8a2969a8def2a2443467c3e42f79cf5d
      // Should fix this crash: https://github.com/kmagiera/react-native-screens/issues/17
      super.onCreate(null);
    }

    // Fix for build not working:
    // https://github.com/crazycodeboy/react-native-splash-screen/issues/32#issuecomment-362186109
    @Override
    protected void onPause() {
      SplashScreen.hide(this);
      super.onPause();
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
         return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }
}
