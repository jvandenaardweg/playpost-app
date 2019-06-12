import React from 'react';
import WebView from 'react-native-webview';
import urlParse from 'url-parse';

import spacing from '../../constants/spacing';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';
import { Linking } from 'react-native';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

interface Props {
  article: Api.Article | undefined;
  theme: string;
}

export class ArticleReader extends React.PureComponent<Props> {

  private webViewRef = React.createRef<WebView>();

  static defaultProps = {
    theme: 'light'
  };

  get themeStyles() {
    const { theme } = this.props;

    // Light
    let backgroundColor = colors.white;
    let fontColor = colors.black;
    let highlightColor = colors.black;
    let metaColor = colors.paragraphGrayed;

    if (theme === 'dark') {
      backgroundColor = colors.grayDarkest;
      fontColor = colors.gray;
      highlightColor = colors.white;
      metaColor = colors.gray;
    }

    return {
      backgroundColor,
      fontColor,
      highlightColor,
      metaColor
    };
  }

  get htmlHeader() {
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
            padding: ${Math.ceil(spacing.default / 2)}px;
            font-size: ${Math.ceil(fonts.fontSize.body * 1.1)}px;
            font-family: 'PT Serif', serif;
            line-height: 1.5;
            color: ${this.themeStyles.fontColor};
            font-weight: normal;
            word-break: break-word;
            background-color: ${this.themeStyles.backgroundColor};
          }

          h1, h2, h3, h4, h5, h6, h7, h8 {
            line-height: 1.2;
            margin-top: 0;
            margin-bottom: ${spacing.tiny}px;
            color: ${this.themeStyles.highlightColor};
            font-family: 'PT Sans', sans-serif;
          }

          h1 {
            font-size: ${fonts.fontSize.headline}px;
            margin-bottom: ${spacing.default}px;
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
            margin-top: 0;
            text-align: justify;
          }

          a, strong {
            color: ${this.themeStyles.highlightColor};
          }

          img, figure {
            max-width: 100%;
            margin-bottom: ${spacing.default}px;
            margin-top: ${spacing.default}px;
            display: block;
          }

          blockquote {
            font-style: italic;
            color: ${this.themeStyles.highlightColor};
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
            margin-bottom: ${spacing.large}px;
          }

          .meta-header strong {
            display: block;
            color: ${this.themeStyles.metaColor};
            font-weight: normal;
          }

        </style>
      </head>`;
  }

  get noHtmlDocument() {
    const { article } = this.props;
    const articleUrlLink = (article && article.url) ? `<a href="${article.url}">View the original article</a>` : '';

    return `
      <!DOCTYPE html>
        ${this.htmlHeader}
        <body>
          <h1>Insufficient article data</h1>
          <p>The article did not return any sufficient content to show. This could happen when the article is behind a pay-wall or requires a login.</p>
          ${articleUrlLink}
        </body>
      </html>
    `;
  }

  get htmlDocument() {
    const { article } = this.props;

    // When we have no article or no html, show the user we don't have enough data
    if (!article || !article.html) return this.noHtmlDocument;

    const articleUrl = article.canonicalUrl || article.url;
    const authorElement = (article.authorName) ? `<strong>${article.authorName}</strong>` : '';

    let htmlDocument = `
      <!DOCTYPE html>
      ${this.htmlHeader}
        <body>
          <h1>${article.title}</h1>
          <div class="meta-header">
            ${authorElement}
            <strong><a href="${articleUrl}">${urlParse(articleUrl).hostname}</a></strong>
          </div>
          [ARTICLE_HTML_PLACEHOLDER]
        </body>
      </html>
    `;

    htmlDocument = htmlDocument.replace('[ARTICLE_HTML_PLACEHOLDER]', article.html);

    return htmlDocument;
  }

  handleWebViewNavigationStateChange = (request: WebViewNavigation) => {
    const { url } = request;
    if (!url || url.includes('file://')) return;
    this.webViewRef.current && this.webViewRef.current.stopLoading();
    return Linking.openURL(url);
  }

  render() {
    return (
      <WebView
        ref={this.webViewRef}
        startInLoadingState={true}
        renderLoading={() => <CenterLoadingIndicator backgroundColor={this.themeStyles.backgroundColor} />}
        useWebKit
        originWhitelist={['*']}
        javaScriptEnabled={false}
        source={{ html: this.htmlDocument, baseUrl: '' }}
        bounces
        decelerationRate="normal"
        style={{ backgroundColor: this.themeStyles.backgroundColor }}
        onNavigationStateChange={this.handleWebViewNavigationStateChange}
      />
    );
  }
}
