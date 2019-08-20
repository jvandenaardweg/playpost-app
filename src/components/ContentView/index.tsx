import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button } from 'react-native-elements';
import WebView from 'react-native-webview';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

import styles from './styles';

interface Props {
  onPressSupport(): void;
}

export class ContentView extends React.PureComponent<Props> {
  getHtmlHeader(): string {
    return `
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <style type="text/css">
          html {
            box-sizing: border-box;
          }
          *, *:before, *:after {
            box-sizing: inherit;
          }

          body {
            padding: 0 !important;
            margin: 0 !important;
            font-size: ${fonts.fontSize.body}px;
            font-family: 'SF Pro Text', 'Roboto', 'Helvetica', serif;
            line-height: 1.5;
            color: ${colors.black};
            font-weight: normal;
            word-break: break-word;
            background-color: ${colors.white};
          }

          h1, h2, h3, h4, h5, h6, h7, h8 {
            line-height: 1.2;
            margin-top: 0;
            margin-bottom: ${spacing.tiny}px;
            color: ${colors.black};
            font-family: 'SF Pro Display', 'Roboto', 'Helvetica', serif;
          }

          h1 {
            font-size: ${fonts.fontSize.headline}px;
            margin-bottom: 0;
            text-align: center;
          }

          h2 {
            margin-top: 46px;
            font-size: ${fonts.fontSize.headline}px;
          }

          h3, h4 {
            margin-top: ${spacing.large}px;
            font-size: ${fonts.fontSize.titleMedium}px;
            font-weight: bold;
          }

          h5, h6, h7, h8 {
            margin-top: ${spacing.large}px;
            font-size ${fonts.fontSize.titleMedium}px
          }

          p {
            font-size: ${fonts.fontSize.title}px;
            margin-top: 1.5;
            color: ${colors.paragraphDefault};
            line-height: 1.58;
            margin-bottom: 1.5;
          }

          a, strong {
            color: ${colors.black};
          }

          blockquote {
            font-style: italic;
            color: ${colors.grayDark};
            margin-left: ${spacing.large}px;
            margin-right: ${spacing.large}px;
          }
          blockquote p {
            font-style: italic;
          }

          figcaption {
            display: none;
          }

          .meta-header {
            text-align: center;
            padding: ${spacing.default}px;
          }

          .meta-header strong {
            display: block;
            font-weight: normal;
          }

          .meta-header a {
            color: ${colors.tintColor};
          }

          .image-header {
            margin-bottom: ${spacing.tiny}px
          }

          .image-header img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .content {
            padding: ${spacing.default}px;
          }

          .content img,
          .content figure {
            max-width: 100%;
            margin-bottom: ${spacing.default}px;
            margin-top: ${spacing.default}px;
            display: none;
          }

          p {
            margin-top: 0;
          }

        </style>
      </head>`;
  }

  getHtmlDocument(): string {
    return `
      <!DOCTYPE html>
      ${this.getHtmlHeader()}
        <body>
          <div class="meta-header">
            <h1>Article might not be compatible for listening</h1>
          </div>
          <div class="content">
            <p>If you are seeing this message it means we <strong>probably</strong> could not process the article correctly.</p>
            <p>To verify if that's really is the case, tap on the article's title in your playlist to see if Playpost extracted the correct article.</p>
            <p>If the article is complete and correct, you can ignore the warning. If the article is incorrect you'll find possible reasons below.</p>

            <h2>Possible reasons</h2>

            <h3>1. Article could be for subscribers only</h3>
            <p>A "subscriber-only" article is an article behind a paywall or a login. We call these "subscriber-only" articles.</p>

            <p>Our App uses an external crawler to extract articles from a website. Our crawler is not logged in any website. It's not subscribed. It's not paying websites to gain access to certain articles. So, if a website requires a login, try using <a href="#what-to-do">one of the methods listed below</a>.</p>

            <h3>2. Article's website could be too complex</h3>
            <p>It could also happen the website of the article is too complex to automatically extract the article from. If that's the case with your article, we would like to know more so we can improve the article extraction.</p>
            <p>Contact our support chat and we'll do our best to support articles from your favorite websites.</p>

            <h3>3. There might be a hiccup in our service</h3>
            <p>You should try again. Remove the article from your playlist and try again.</p>

            <h2 id="what-to-do">What to do now?</h2>
            <h3>1. Verify if the article is really incompatible</h3>
            <p>You can verify this by just opening the article from your playlist by pressing on the title. You can then read the article Playpost has extracted. If you notice the article is correct, then you can just ignore the incompatibility warning. We were wrong then!</p>

            <h3>2. Use Safari on your iPhone to share the article</h3>
            <p>If the website from the article is known to have subscriber-only articles, make sure you are logged in the website in Safari. Then just press Share from Safari and select the Playpost App. We can then extract the correct article from the webpage.</p>

            <h3>3. Re-add the article</h3>
            <p>First, remove the article from your playlist and then add it again as you did before. This will allow Playpost to retry.</p>

            <h3>4. Contact our support</h3>
            <p>If none of the above worked out for you feel free to contact our support. We are happy to help!</p>

            <!--<h3>3. Use our browser extension</h3>
            <p>Which will be available later. With that browser extension you can share those articles to the Playpost App.</p>-->
          </div>
        </body>
      </html>
    `;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          source={{ html: this.getHtmlDocument() }}
          useWebKit
          originWhitelist={['*']}
          javaScriptEnabled={false}
          bounces
          decelerationRate="normal"
        />
        <View style={styles.footer}>
          <Button title="Contact support" onPress={this.props.onPressSupport} />
        </View>
      </SafeAreaView>
    );
  }
}
