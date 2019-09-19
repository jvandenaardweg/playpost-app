import React, { ReactNode } from 'react';
import * as ReactNative from 'react-native';
import colors from '../../constants/colors';

type FontFamilies = {
  [fontWeight in FontWeightOptions]: {
    fontFamily: string;
  };
}

type FontWeightOptions = 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';

type TextTemplateOptions = 'largeTitleEmphasized' | 'title3Emphasized' | 'title3' | 'bodyEmphasized' | 'body' | 'subheadEmphasized' | 'subhead' | 'subheadShort' | 'callout' | 'footnoteEmphasized' | 'footnote' | 'caption2Emphasized' | 'caption2';

type TemplateMap = { [textTemplate in TextTemplateOptions]: ReactNative.TextStyle }

export const fontFamilies: FontFamilies = {
  thin: {
    fontFamily: 'Inter-Thin-BETA'
  },
  extraLight: {
    fontFamily: 'Inter-ExtraLight-BETA'
  },
  light: {
    fontFamily: 'Inter-Light-BETA'
  },
  regular: {
    fontFamily: 'Inter-Regular'
  },
  medium: {
    fontFamily: 'Inter-Medium'
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold'
  },
  bold: {
    fontFamily: 'Inter-Bold'
  },
  extraBold: {
    fontFamily: 'Inter-ExtraBold'
  },
  black: {
    fontFamily: 'Inter-Black'
  }
}

// Taken from: https://github.com/hectahertz/react-native-typography#iosuikit
export const textTemplates: TemplateMap = {
  largeTitleEmphasized: {
    ...fontFamilies['bold'],
    fontSize: 34,
    lineHeight: Math.ceil(34 * 1.2)
  },
  title3Emphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 20,
    lineHeight: Math.ceil(20 * 1.2)
  },
  title3: {
    ...fontFamilies['regular'],
    fontSize: 20,
    lineHeight: Math.ceil(20 * 1.2)
  },
  bodyEmphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 17,
    lineHeight: Math.ceil(17 * 1.3)
  },
  body: {
    ...fontFamilies['regular'],
    fontSize: 17,
    lineHeight: Math.ceil(17 * 1.3)
  },
  subheadEmphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 15,
    lineHeight: Math.ceil(15 * 1.5)
  },
  subhead: {
    ...fontFamilies['regular'],
    fontSize: 15,
    lineHeight: Math.ceil(15 * 1.5)
  },
  subheadShort: {
    ...fontFamilies['regular'],
    fontSize: 15,
    lineHeight: Math.ceil(15 * 1.2)
  },
  callout: {
    ...fontFamilies['regular'],
    fontSize: 16,
    lineHeight: Math.ceil(16 * 1.2)
  },
  footnoteEmphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 13,
    lineHeight: Math.ceil(13 * 1.2)
  },
  footnote: {
    ...fontFamilies['regular'],
    fontSize: 13,
    lineHeight: Math.ceil(13 * 1.2)
  },
  caption2Emphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 12,
    lineHeight: Math.ceil(12 * 1.2)
  },
  caption2: {
    ...fontFamilies['regular'],
    fontSize: 12,
    lineHeight: Math.ceil(12 * 1.2)
  }
}
interface Props extends ReactNative.TextProps {
  children: ReactNode;
  fontWeight?: string;
  template?: TextTemplateOptions;
}

export const Text: React.FC<Props> = React.memo(({ children, fontWeight, template, ...rest }) => {
  const fontFamily: ReactNative.TextStyle = fontWeight ? fontFamilies[fontWeight] : fontFamilies['regular'];
  const templateStyle = template ? textTemplates[template] : undefined;
  const defaultColor: ReactNative.TextStyle = { color: colors.black };

  const customStyle: ReactNative.TextStyle = {
    ...fontFamily,
    ...templateStyle,
    ...defaultColor
  }

  return (
    <ReactNative.Text
      {...rest}
      style={[customStyle, rest.style]}
    >
      {children}
    </ReactNative.Text>
  )
})
