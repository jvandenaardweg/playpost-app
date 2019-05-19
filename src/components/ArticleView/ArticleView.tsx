import React from 'react';
import WebView from 'react-native-webview';
import urlParse from 'url-parse';

import spacing from '../../constants/spacing';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';

interface Props {
  article: Api.Article | undefined;
  backgroundColor?: string;
}

export class ArticleView extends React.PureComponent<Props> {

  private webViewRef: React.RefObject<WebView> = React.createRef();

  renderHtmlDocument = () => {
    const { article } = this.props;

    // TODO: show message when there's no html
    if (!article || !article.html) return '';

    const articleUrl = article.canonicalUrl || article.url;
    const backgroundColor = this.props.backgroundColor || colors.white;

    let htmlDocument = `
      <!DOCTYPE html>
        <head>
          <title>${article.title}</title>
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
              padding: ${spacing.default}px;
              font-size: ${Math.ceil(fonts.fontSize.body * 1.1)}px;
              font-family: 'PT Serif', serif;
              line-height: 1.5;
              color: ${colors.grayDarker};
              font-weight: normal;
              word-break: break-word;
              background-color: ${backgroundColor};
            }

            h1, h2, h3, h4, h5, h6, h7, h8 {
              line-height: 1.2;
              margin-top: 0;
              margin-bottom: ${spacing.tiny}px;
              color: ${colors.black};
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
              color: ${colors.black};
            }

            img, figure {
              max-width: 100%;
              margin-bottom: ${spacing.default}px;
              margin-top: ${spacing.default}px;
              display: block;
            }

            blockquote {
              font-style: italic;
              color: ${colors.black};
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
              color: ${colors.paragraphGrayed};
              font-weight: normal;
            }

          </style>
        </head>
        <body>
          <h1>${article.title}</h1>
          <div class="meta-header">
            <strong>${article.authorName}</strong>
            <strong><a href="${articleUrl}">${urlParse(articleUrl).hostname}</a></strong>
          </div>
          [ARTICLE_HTML_PLACEHOLDER]
        </body>
      </html>
    `;

    htmlDocument = htmlDocument.replace('[ARTICLE_HTML_PLACEHOLDER]', article.html);

    return htmlDocument;
  }

  render() {
    // const { article } = this.props;

    return (
      <WebView
        ref={this.webViewRef}
        startInLoadingState={true}
        renderLoading={() => <CenterLoadingIndicator />}
        useWebKit
        originWhitelist={['*']}
        javaScriptEnabled={false}
        source={{ html: this.renderHtmlDocument(), baseUrl: '' }}
      />
    );
  }
}
