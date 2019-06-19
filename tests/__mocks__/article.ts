// Just get an article from the API
export default {
  id: '7db7e805-61b9-4b01-a841-2909f465dddd',
  title: 'Incorporating Apple Maps with Autocomplete in a React Native Application',
  description: 'THE HOW TO TO FIND WHERE YOU ARE AND WHERE YOU’RE GOING Maps do a wonderful job of giving users a feel for where they are and where they want to go next in a visual way. More often than not,...',
  url: 'https://link.medium.com/3atUMQ6eBX',
  canonicalUrl: 'https://medium.com/better-programming/incorporating-apple-maps-with-autocomplete-in-a-react-native-application-31b56befef3',
  status: 'crawling',
  languageCode: null,
  sourceName: 'Medium',
  imageUrl: 'https://cdn-images-1.medium.com/max/1200/1*8NUFmYFAPYYxIAcnDvb_VA.png',
  readingTime: 216.3,
  authorName: 'Manny Shapir',
  isPublic: null,
  html: '<div id="readability-page-1" class="page"><div><div><h2>The How To to find where you are and where you’re going</h2><div><p><a href="https://medium.com/@mshapir95?source=post_header_lockup"><img src="https://cdn-images-1.medium.com/fit/c/100/100/1*nDKsNhsMdqqzDekEuJQDEA.jpeg"></a></p></div><figure><div><p><img src="https://cdn-images-1.medium.com/freeze/max/60/1*8NUFmYFAPYYxIAcnDvb_VA.png?q=20"><img src="https://cdn-images-1.medium.com/max/1600/1*8NUFmYFAPYYxIAcnDvb_VA.png"></p></div></figure><p>Maps do a wonderful job of giving users a feel for where they are and where they want to go next in a visual way. More often than not, applications that offer a service that revolves around location display a map on the screen to allow users a more interactive experience. To offer your own users the same experience in an iOS application developed in React Native, follow these steps!</p></div></div><div><div><h3>Step 1: Install Tools</h3><p>This tutorial will use the CocoaPods package manager for Xcode projects. To install CocoaPods, run:</p><p><code>sudo gem install cocoapods</code></p><h3>Step 2: Install Map Library</h3><p>In your terminal, navigate to your project directory and run the following command:</p><p><code>npm install react-native-maps --save</code></p><p>This will allow you to make use of React Native maps, with support for Google Maps, if desired, in your application.</p><h3>Step 3: Create Podfile and Install Pods</h3><p>A Podfile allows you to easily list and install the different dependencies you’d like to utilize in your project, similar to a Gemfile in Ruby. Create a Podfile in the <code>ios/</code> folder of your React Native project and use the following sample to get you started:</p><figure></figure><p>Once your Podfile is created with the correct dependencies, replace <code>_YOUR_PROJECT_TARGET_</code> with your project name and head back to your terminal and navigate to the iOS directory of your project (where you had created your Podfile) and run the command<code>pod install</code>.</p><p>This command will install all pods and create a new <code>.xcworkspace</code> file that you can use to build your project in Xcode. Alternatively, kick off a build by moving back to your root directory and running<code>cd ..</code> to navigate back to your root directory and <code>react-native run-ios</code> to run your application.</p><h3>Step 4: Add Map</h3><p>Once your dependencies are all added, we are ready to add a map to your application! Add the following import statement to the top of the map component:</p><pre>import MapView from \'react-native-maps\';</pre><p>Add the following snippet to your render method to display a map with a fixed initial position:</p><figure></figure><p>You might notice that your map is nowhere to be found. This has to do with styling, so go ahead and add these static styles to be used in the view you are wrapping your container with:</p><figure></figure><p>These styles will set you up to incorporate the autocomplete component on the top of the screen. If it is not needed in your use case, feel free to stop here and simplify your style component to:</p><pre>const styles = StyleSheet.create({<br>  map: {<br>    ...StyleSheet.absoluteFillObject,<br>  },<br>});</pre><p>You might want to allow the displayed location to change. Maintaining map coordinates in state would allow you the flexibility of doing this:</p><figure></figure><p>After incorporating these bits and pieces, your component will look a lot like this:</p><figure></figure><p>Hopefully, your map loads successfully and navigates to an area in San Francisco!</p><h3>Step 5: Add Marker</h3><p>Markers allow users to visually pinpoint exactly where they are on the map. You may have noticed that our current map does not include such functionality, so let us go ahead and add one.</p><figure></figure><h3>Step 6: Install Places Autocomplete</h3><p>To allow users to interact more closely with the map, we want to use an autocomplete feature that takes an address and converts it to the coordinates needed to render the address on the map. Installing <code>react-native-google-places-autocomplete</code> will make this integration much easier.</p><p>To install, navigate back to your terminal and run in the root directory of your project: <code>npm install react-native-google-places-autocomplete --save</code>.</p><h3>Step 7: Add Autocomplete Component</h3><p>Now that we have React Native Places Autocomplete installed, let us add it to our map.</p><p>Add the following to your component:</p><figure></figure><p>Be sure to grab your <a href="https://developers.google.com/places/web-service/get-api-key">Google Places API key</a> and add it to the <code>query</code> parameter of the component.</p><p>You will notice an input field at the top of your simulator screen — go ahead and begin typing an address and watch as suggestions will generate based on your input! The implementation above does not handle the address selection, but adding an onPress method would allow you to grab the selected address and pass it along as a parameter to the MapView rendering your map. This tweak will allow you to see the selected address rendered on the map.</p><p>That’s all it takes to incorporate Apple Maps into your application!</p></div></div></div>',
  ssml: '<speak><p>Incorporating Apple Maps with Autocomplete in a React Native Application.</p><break time="500ms" /><p>The How To to find where you are and where you’re going<break time="1s" />.</p><p>Maps do a wonderful job of giving users a feel for where they are and where they want to go next in a visual way. More often than not, applications that offer a service that revolves around location display a map on the screen to allow users a more interactive experience. To offer your own users the same experience in an iOS application developed in React Native, follow these steps!</p><p>Step 1: Install Tools<break time="1s" />.</p><p>This tutorial will use the CocoaPods package manager for Xcode projects. To install CocoaPods, run:</p><p>sudo gem install cocoapods</p><p>Step 2: Install Map Library<break time="1s" />.</p><p>In your terminal, navigate to your project directory and run the following command:</p><p>npm install react-native-maps --save</p><p>This will allow you to make use of React Native maps, with support for Google Maps, if desired, in your application.</p><p>Step 3: Create Podfile and Install Pods<break time="1s" />.</p><p>A Podfile allows you to easily list and install the different dependencies you’d like to utilize in your project, similar to a Gemfile in Ruby. Create a Podfile in the ios/ folder of your React Native project and use the following sample to get you started:</p><p>Once your Podfile is created with the correct dependencies, replace _YOUR_PROJECT_TARGET_ with your project name and head back to your terminal and navigate to the iOS directory of your project (where you had created your Podfile) and run the commandpod install.</p><p>This command will install all pods and create a new.xcworkspace file that you can use to build your project in Xcode. Alternatively, kick off a build by moving back to your root directory and runningcd .. to navigate back to your root directory and react-native run-ios to run your application.</p><p>Step 4: Add Map<break time="1s" />.</p><p>Once your dependencies are all added, we are ready to add a map to your application! Add the following import statement to the top of the map component:</p><p>import MapView from \'react-native-maps\';</p><p>Add the following snippet to your render method to display a map with a fixed initial position:</p><p>You might notice that your map is nowhere to be found. This has to do with styling, so go ahead and add these static styles to be used in the view you are wrapping your container with:</p><p>These styles will set you up to incorporate the autocomplete component on the top of the screen. If it is not needed in your use case, feel free to stop here and simplify your style component to:</p><p>const styles = StyleSheet.create({</p><p>  map: {</p><p>    ...StyleSheet.absoluteFillObject,</p><p>  },</p><p>});</p><p>You might want to allow the displayed location to change. Maintaining map coordinates in state would allow you the flexibility of doing this:</p><p>After incorporating these bits and pieces, your component will look a lot like this:</p><p>Hopefully, your map loads successfully and navigates to an area in San Francisco!</p><p>Step 5: Add Marker<break time="1s" />.</p><p>Markers allow users to visually pinpoint exactly where they are on the map. You may have noticed that our current map does not include such functionality, so let us go ahead and add one.</p><p>Step 6: Install Places Autocomplete<break time="1s" />.</p><p>To allow users to interact more closely with the map, we want to use an autocomplete feature that takes an address and converts it to the coordinates needed to render the address on the map. Installing react-native-google-places-autocomplete will make this integration much easier.</p><p>To install, navigate back to your terminal and run in the root directory of your project: npm install react-native-google-places-autocomplete --save.</p><p>Step 7: Add Autocomplete Component<break time="1s" />.</p><p>Now that we have React Native Places Autocomplete installed, let us add it to our map.</p><p>Add the following to your component:</p><p>Be sure to grab your Google Places API key and add it to the query parameter of the component.</p><p>You will notice an input field at the top of your simulator screen — go ahead and begin typing an address and watch as suggestions will generate based on your input! The implementation above does not handle the address selection, but adding an onPress method would allow you to grab the selected address and pass it along as a parameter to the MapView rendering your map. This tweak will allow you to see the selected address rendered on the map.</p><p>That’s all it takes to incorporate Apple Maps into your application!</p></speak>',
  text: 'THE HOW TO TO FIND WHERE YOU ARE AND WHERE YOU’RE GOING\n\n\nMaps do a wonderful job of giving users a feel for where they are and where they want to go next in a visual way. More often than not, applications that offer a service that revolves around location display a map on the screen to allow users a more interactive experience. To offer your own users the same experience in an iOS application developed in React Native, follow these steps!\n\nSTEP 1: INSTALL TOOLS\nThis tutorial will use the CocoaPods package manager for Xcode projects. To install CocoaPods, run:\n\nsudo gem install cocoapods\n\nSTEP 2: INSTALL MAP LIBRARY\nIn your terminal, navigate to your project directory and run the following command:\n\nnpm install react-native-maps --save\n\nThis will allow you to make use of React Native maps, with support for Google Maps, if desired, in your application.\n\nSTEP 3: CREATE PODFILE AND INSTALL PODS\nA Podfile allows you to easily list and install the different dependencies you’d like to utilize in your project, similar to a Gemfile in Ruby. Create a Podfile in the ios/ folder of your React Native project and use the following sample to get you started:\n\nOnce your Podfile is created with the correct dependencies, replace _YOUR_PROJECT_TARGET_ with your project name and head back to your terminal and navigate to the iOS directory of your project (where you had created your Podfile) and run the commandpod install.\n\nThis command will install all pods and create a new.xcworkspace file that you can use to build your project in Xcode. Alternatively, kick off a build by moving back to your root directory and runningcd .. to navigate back to your root directory and react-native run-ios to run your application.\n\nSTEP 4: ADD MAP\nOnce your dependencies are all added, we are ready to add a map to your application! Add the following import statement to the top of the map component:\n\nimport MapView from \'react-native-maps\';\n\nAdd the following snippet to your render method to display a map with a fixed initial position:\n\nYou might notice that your map is nowhere to be found. This has to do with styling, so go ahead and add these static styles to be used in the view you are wrapping your container with:\n\nThese styles will set you up to incorporate the autocomplete component on the top of the screen. If it is not needed in your use case, feel free to stop here and simplify your style component to:\n\nconst styles = StyleSheet.create({\n  map: {\n    ...StyleSheet.absoluteFillObject,\n  },\n});\n\nYou might want to allow the displayed location to change. Maintaining map coordinates in state would allow you the flexibility of doing this:\n\nAfter incorporating these bits and pieces, your component will look a lot like this:\n\nHopefully, your map loads successfully and navigates to an area in San Francisco!\n\nSTEP 5: ADD MARKER\nMarkers allow users to visually pinpoint exactly where they are on the map. You may have noticed that our current map does not include such functionality, so let us go ahead and add one.\n\nSTEP 6: INSTALL PLACES AUTOCOMPLETE\nTo allow users to interact more closely with the map, we want to use an autocomplete feature that takes an address and converts it to the coordinates needed to render the address on the map. Installing react-native-google-places-autocomplete will make this integration much easier.\n\nTo install, navigate back to your terminal and run in the root directory of your project: npm install react-native-google-places-autocomplete --save.\n\nSTEP 7: ADD AUTOCOMPLETE COMPONENT\nNow that we have React Native Places Autocomplete installed, let us add it to our map.\n\nAdd the following to your component:\n\nBe sure to grab your Google Places API key  and add it to the query parameter of the component.\n\nYou will notice an input field at the top of your simulator screen — go ahead and begin typing an address and watch as suggestions will generate based on your input! The implementation above does not handle the address selection, but adding an onPress method would allow you to grab the selected address and pass it along as a parameter to the MapView rendering your map. This tweak will allow you to see the selected address rendered on the map.\n\nThat’s all it takes to incorporate Apple Maps into your application!',
  createdAt: '2019-06-17T16:11:01.330Z',
  updatedAt: '2019-06-17T16:11:07.236Z',
  language: {
    id: '95f01039-fe8e-412d-a542-7089303b84c8',
    name: 'English',
    nativeName: 'English',
    languageCode: 'en',
    isActive: true,
    createdAt: '2019-05-16T12:51:57.546Z',
    updatedAt: '2019-05-16T12:51:57.546Z'
  },
  audiofiles: [
    {
      id: '565177ba-775a-4786-bde7-089fbdcf9d95',
      url: 'https://storage-development.playpost.app/articles/7db7e805-61b9-4b01-a841-2909f465dddd/audiofiles/565177ba-775a-4786-bde7-089fbdcf9d95.mp3',
      bucket: 'storage-development.playpost.app',
      filename: 'articles/7db7e805-61b9-4b01-a841-2909f465dddd/audiofiles/565177ba-775a-4786-bde7-089fbdcf9d95.mp3',
      length: 283.704,
      languageCode: 'en-GB',
      mimeType: 'audio/mpeg',
      createdAt: '2019-06-17T16:11:40.363Z',
      updatedAt: '2019-06-17T16:11:40.363Z',
      voice: {
        id: '2534d51a-11c4-446f-a4da-a3f946305c44',
        languageCode: 'en-GB',
        countryCode: 'GB',
        name: 'en-GB-Wavenet-C',
        label: null,
        gender: 'FEMALE',
        synthesizer: 'Google',
        audioProfile: 'default',
        speakingRate: 1,
        pitch: 0,
        naturalSampleRateHertz: 24000,
        isActive: true,
        isPremium: true,
        isHighestQuality: true,
        isLanguageDefault: null,
        exampleAudioUrl: null,
        createdAt: '2019-04-25T07:27:13.114Z',
        updatedAt: '2019-05-16T15:01:14.900Z',
        language: {
          id: '95f01039-fe8e-412d-a542-7089303b84c8',
          name: 'English',
          nativeName: 'English',
          languageCode: 'en',
          isActive: true,
          createdAt: '2019-05-16T12:51:57.546Z',
          updatedAt: '2019-05-16T12:51:57.546Z'
        }
      }
    }
  ]
};
