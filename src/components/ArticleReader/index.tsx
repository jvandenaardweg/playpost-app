import React, { useRef } from 'react';
import { Alert, Linking, StatusBar } from 'react-native';
import WebView from 'react-native-webview';
// tslint:disable-next-line: no-submodule-imports
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import urlParse from 'url-parse';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';

interface Props {
  article: Api.Article | undefined;
  theme?: string;
}

interface ThemeStyles {
  backgroundColor: string;
  fontColor: string;
  paragraphColor: string;
  highlightColor: string;
  metaColor: string;
  titleColor: string;
}

export const ArticleReader: React.FC<Props> = React.memo(({
  theme,
  article
}) => {
  const webViewRef = useRef<WebView>(null);
  const themeStyles = getThemeStyles(theme);

  const handleWebViewNavigationStateChange = async (request: WebViewNavigation, webViewRefObj: React.RefObject<WebView>) => {
    const { url } = request;

    if (!url || url.includes('file://') || url === 'about:blank') { return; }

    // It seems like when opening URL's from the WebView that the StatusBar turns white
    // We want to keep it the default style so we enforce that here.
    StatusBar.setBarStyle('default');

    try {
      await Linking.openURL(url);
      return webViewRefObj.current && webViewRefObj.current.stopLoading();
    } catch (err) {
      Alert.alert('Oops!', 'Could not open the URL.');
    }
  };

  return (
    <WebView
      ref={webViewRef}
      startInLoadingState={true}
      renderLoading={() => <CenterLoadingIndicator backgroundColor={themeStyles.backgroundColor} />}
      useWebKit
      originWhitelist={['*']}
      javaScriptEnabled={false}
      source={{ html: getHtmlDocument(article, themeStyles), baseUrl: '' }}
      bounces
      decelerationRate="normal"
      style={{ backgroundColor: themeStyles.backgroundColor, padding: 0, margin: 0 }}
      onNavigationStateChange={(request: WebViewNavigation) => handleWebViewNavigationStateChange(request, webViewRef)}
    />
  );

  function getThemeStyles(themeProp?: string): ThemeStyles {

    // Light
    let backgroundColor = colors.white;
    let fontColor = colors.black;
    let paragraphColor = colors.grayDarker;
    let highlightColor = colors.black;
    let metaColor = colors.paragraphGrayed;
    let titleColor = colors.black;

    if (themeProp === 'dark') {
      backgroundColor = colors.grayDarkest;
      fontColor = colors.gray;
      paragraphColor = colors.gray;
      highlightColor = colors.gray;
      metaColor = colors.gray;
      titleColor = colors.white;
    }

    return {
      backgroundColor,
      fontColor,
      paragraphColor,
      highlightColor,
      metaColor,
      titleColor
    };
  }

  function getHtmlHeader(themeStyle: ThemeStyles) {
    return `
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i|PT+Serif:400,400i,700,700i" rel="stylesheet">
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
            font-size: ${Math.ceil(fonts.fontSize.body * 1.1)}px;
            font-family: 'PT Serif', serif;
            line-height: 1.5;
            color: ${themeStyle.fontColor};
            font-weight: normal;
            word-break: break-word;
            background-color: ${themeStyle.backgroundColor};
          }

          h1, h2, h3, h4, h5, h6, h7, h8 {
            line-height: 1.2;
            margin-top: 0;
            margin-bottom: ${spacing.tiny}px;
            color: ${themeStyle.titleColor};
            font-family: 'PT Sans', sans-serif;
          }

          h1 {
            font-size: ${fonts.fontSize.headline}px;
            margin-bottom: ${spacing.default}px;
            text-align: center;
          }

          h2, h3, h4 {
            margin-top: ${spacing.large}px;
            font-size: ${fonts.fontSize.titleLarge}px;
          }

          h5, h6, h7, h8 {
            margin-top: ${spacing.large}px;
            font-size ${fonts.fontSize.titleMedium}px
          }

          p {
            font-size: ${fonts.fontSize.title}px;
            margin-top: 1.5;
            color: ${themeStyle.paragraphColor};
            line-height: 1.58;
            margin-bottom: 1.5;
          }

          a, strong {
            color: ${themeStyle.highlightColor};
          }

          blockquote {
            font-style: italic;
            color: ${themeStyle.highlightColor};
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

        </style>
      </head>`;
  }

  function getNoHtmlDocument(articleProp: Api.Article | undefined, themeStyle: ThemeStyles) {
    const articleUrlLink = (articleProp && articleProp.url) ? `<a href="${articleProp.url}">View the original article</a>` : '';

    return `
      <!DOCTYPE html>
        ${getHtmlHeader(themeStyle)}
        <body>
          <h1>Insufficient article data</h1>
          <p>The article did not return any sufficient content to show. This could happen when the article is behind a pay-wall or requires a login.</p>
          ${articleUrlLink}
        </body>
      </html>
    `;
  }

  function getHtmlDocument(articleProp: Api.Article | undefined, themeStyle: ThemeStyles) {

    // When we have no article or no html, show the user we don't have enough data
    if (!articleProp || !articleProp.html) { return getNoHtmlDocument(articleProp, themeStyles); }

    const articleUrl = articleProp.canonicalUrl || articleProp.url;
    const authorElement = (articleProp.authorName) ? `<strong>${articleProp.authorName}</strong>` : '';
    const imageElement = (articleProp.imageUrl) ? `<div class="image-header"><img src="${articleProp.imageUrl}" /></div>` : '';

    let htmlDocument = `
      <!DOCTYPE html>
      ${getHtmlHeader(themeStyle)}
        <body>
          ${imageElement}
          <div class="meta-header">
            <h1>${articleProp.title}</h1>
            ${authorElement}
            <strong><a href="${articleUrl}">View on ${urlParse(articleUrl).hostname}</a></strong>
          </div>
          <div class="content">
            [ARTICLE_HTML_PLACEHOLDER]
          </div>
        </body>
      </html>
    `;

    htmlDocument = htmlDocument.replace('[ARTICLE_HTML_PLACEHOLDER]', articleProp.html);

    return htmlDocument;
  }
});
