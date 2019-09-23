import React, { ReactNode } from 'react';
import * as ReactNative from 'react-native';
import colors from '../../constants/colors';

type FontFamilies = {
  [fontWeight in FontWeightOptions]: {
    fontFamily: string;
  };
}

type FontWeightOptions = 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';

type TextPresetOptions = 'largeTitleEmphasized' | 'title1' | 'title1Emphasized' | 'title2' | 'title2Emphasized' | 'title3Emphasized' | 'title3' | 'leadEmphasized' | 'lead' | 'bodyEmphasized' | 'body' | 'subheadEmphasized' | 'subhead' | 'subheadShort' | 'callout' | 'calloutEmphasized' | 'footnoteEmphasized' | 'footnote' | 'caption2Emphasized' | 'caption2';

type PresetMap = { [textTemplate in TextPresetOptions]: ReactNative.TextStyle }

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
export const textPresets: PresetMap = {
  largeTitleEmphasized: {
    ...fontFamilies['bold'],
    fontSize: 34,
    lineHeight: Math.ceil(34 * 1.2)
  },
  title1Emphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 28,
    lineHeight: Math.ceil(28 * 1.2)
  },
  title1: {
    ...fontFamilies['regular'],
    fontSize: 28,
    lineHeight: Math.ceil(28 * 1.2)
  },
  title2Emphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 24,
    lineHeight: Math.ceil(24 * 1.2)
  },
  title2: {
    ...fontFamilies['regular'],
    fontSize: 24,
    lineHeight: Math.ceil(24 * 1.2)
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
  leadEmphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 15,
    lineHeight: Math.ceil(15 * 1.5)
  },
  lead: {
    ...fontFamilies['regular'],
    fontSize: 15,
    lineHeight: Math.ceil(15 * 1.5)
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
    lineHeight: Math.ceil(16 * 1.3)
  },
  calloutEmphasized: {
    ...fontFamilies['semiBold'],
    fontSize: 16,
    lineHeight: Math.ceil(16 * 1.3)
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
  preset?: TextPresetOptions;
}

export const Text: React.FC<Props> = React.memo(({ children, fontWeight, preset, ...rest }) => {
  const fontFamily: ReactNative.TextStyle = fontWeight ? fontFamilies[fontWeight] : fontFamilies['regular'];
  const presetStyle = preset ? textPresets[preset] : undefined;
  const defaultColor: ReactNative.TextStyle = { color: colors.black };

  const customStyle: ReactNative.TextStyle = {
    ...fontFamily,
    ...presetStyle,
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
