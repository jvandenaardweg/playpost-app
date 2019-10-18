import React, { useRef } from 'react';
import isEqual from 'react-fast-compare';
import WebView from 'react-native-webview';
import urlParse from 'url-parse';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { TextDirection } from '../../typings';
import { CenterLoadingIndicator } from '../CenterLoadingIndicator';
import { textPresets } from '../Text';

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
  highlightedBackgroundColor: string;
}

export const ArticleReader: React.FC<Props> = React.memo(({
  theme,
  article
}) => {
  const webViewRef = useRef<WebView>(null);
  const themeStyles = getThemeStyles(theme);

  return (
    <WebView
      ref={webViewRef}
      startInLoadingState={true}
      renderLoading={() => <CenterLoadingIndicator backgroundColor={themeStyles.backgroundColor} />}
      allowFileAccess
      originWhitelist={['file://']}
      javaScriptEnabled={false}
      source={{ html: getHtmlDocument(article, themeStyles), baseUrl: '' }}
      bounces
      decelerationRate="normal"
      style={{ backgroundColor: themeStyles.backgroundColor, padding: 0, margin: 0 }}
    />
  );

  function getThemeStyles(themeProp?: string): ThemeStyles {

    // Light
    let backgroundColor = colors.white;
    let fontColor = colors.black;
    let paragraphColor = colors.black;
    let highlightColor = colors.black;
    let metaColor = colors.gray900;
    let titleColor = colors.black;
    let highlightedBackgroundColor = colors.grayLightest;

    if (themeProp === 'dark') {
      backgroundColor = colors.gray900;
      fontColor = colors.gray;
      paragraphColor = colors.gray;
      highlightColor = colors.gray;
      metaColor = colors.gray;
      titleColor = colors.white;
      highlightedBackgroundColor = colors.gray400;
    }

    return {
      backgroundColor,
      fontColor,
      paragraphColor,
      highlightColor,
      metaColor,
      titleColor,
      highlightedBackgroundColor
    };
  }

  function getHtmlHeader(themeStyle: ThemeStyles, textDirection: 'rtl' | 'ltr'): string {
    return `
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i|PT+Serif:400,400i,700,700i" rel="stylesheet">
        <style type="text/css">
          @import url('https://rsms.me/inter/inter.css');

          html {
            box-sizing: border-box;
          }
          *, *:before, *:after {
            box-sizing: inherit;
          }

          body {
            direction: ${textDirection};
            padding: 0 !important;
            margin: 0 !important;
            font-size: ${textPresets['body'].fontSize}px;
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
            font-family: 'Inter', 'Helvetica', Arial, sans-serif;
          }

          h1 {
            font-size: ${textPresets['title1'].fontSize}px;
            margin-bottom: ${spacing.default}px;
            text-align: center;
          }

          h2, h3, h4 {
            margin-top: ${spacing.large * 2}px;
            font-size: ${textPresets['title3'].fontSize}px;
          }

          h5, h6, h7, h8 {
            margin-top: ${spacing.large}px;
            font-size ${textPresets['body'].fontSize}px
          }

          p {
            font-size: ${textPresets['body'].fontSize}px;
            margin-top: 1.5;
            color: ${themeStyle.paragraphColor};
            line-height: 1.7;
            margin-bottom: 2;
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
            padding: ${spacing.large}px;
            font-family: 'Inter', 'Helvetica', Arial, sans-serif;
          }

          .meta-header strong {
            display: block;
            font-weight: normal;
            color: ${colors.gray100};
          }

          .meta-header a {
            color: ${colors.tintColor};
          }

          .image-header {
            margin-bottom: 0;
          }

          .image-header img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .content {
            padding: ${spacing.large}px;
            padding-top: 0;
          }

          .content img,
          .content figure {
            max-width: 100%;
            margin-bottom: ${spacing.default}px;
            margin-top: ${spacing.default}px;
            display: none;
          }

          pre {
            margin-left: -${spacing.default}px;
            margin-right: -${spacing.default}px;
            padding: ${spacing.default}px;
            background-color: ${themeStyle.highlightedBackgroundColor};
          }

          pre,
          pre p {
            white-space: pre-wrap;
            word-break: break-word;
            font-size: ${textPresets['footnote'].fontSize}px;
            font-family: monospace;
            color: ${themeStyle.highlightColor};
          }

          code {
            font-size: ${textPresets['footnote'].fontSize}px;
          }

          table {
            width: 100%;
          }

        </style>
      </head>`;
  }

  function getNoHtmlDocument(articleProp: Api.Article | undefined, themeStyle: ThemeStyles): string {
    const articleUrlLink = (articleProp && articleProp.url) ? `<a href="${articleProp.url}">View the original article</a>` : '';
    const textDirection = getTextDirection(articleProp);

    return `
      <!DOCTYPE html>
        ${getHtmlHeader(themeStyle, textDirection)}
        <body>
          <h1>Insufficient article data</h1>
          <p>The article did not return any sufficient content to show. This could happen when the article is behind a pay-wall or requires a login.</p>
          ${articleUrlLink}
        </body>
      </html>
    `;
  }

  function getHtmlDocument(articleProp: Api.Article | undefined, themeStyle: ThemeStyles): string {
    // When we have no article or no html, show the user we don't have enough data
    if (!articleProp || !articleProp.html) {
      return getNoHtmlDocument(articleProp, themeStyles);
    }

    const textDirection = getTextDirection(articleProp);

    const articleUrl = articleProp.canonicalUrl || articleProp.url;
    const authorElement = (articleProp.authorName) ? `<strong>${articleProp.authorName}</strong>` : '';
    const imageElement = (articleProp.imageUrl) ? `<div class="image-header"><img src="${articleProp.imageUrl}" /></div>` : '';

    let htmlDocument = `
      <!DOCTYPE html>
      ${getHtmlHeader(themeStyle, textDirection)}
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

  function getTextDirection(articleProp: Api.Article | undefined): TextDirection {
    return (articleProp && articleProp.language && articleProp.language.rightToLeft) ? 'rtl' : 'ltr';
  }
}, isEqual);
