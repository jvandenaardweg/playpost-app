// define your share project, if your main project is com.sample1, then com.sample1.share makes sense....
package com.aardwegmedia.playpost.shareextension;


// import ReactActivity
import com.facebook.react.ReactActivity;


public class ShareActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
      // this is the name AppRegistry will use to launch the Share View
      return "PlaypostShareExtension";
    }

    // Possible fix for "android.view.WindowLeaked"
    @Override
    protected void onPause() {
      super.onPause();
    }

}
