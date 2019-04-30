const headline = {
  extraSmall: 17,
  small: 18,
  medium: 19,
  large: 20,
  extraLarge: 22,
  extraExtraLarge: 28
};

const subhead = {
  extraSmall: headline.extraSmall - 2,
  small: headline.small - 2,
  medium: headline.medium - 2,
  large: headline.large - 2,
  extraLarge: headline.extraLarge - 2
};

const body = {
  extraSmall: headline.extraSmall - 5,
  small: headline.small - 5,
  medium: headline.medium - 5,
  large: headline.large - 5,
  extraLarge: headline.extraLarge - 5
};

const caption = {
  extraSmall: headline.extraSmall - 6,
  small: headline.small - 6,
  medium: headline.medium - 6,
  large: headline.large - 6,
  extraLarge: headline.extraLarge - 6
};

export default {
  fontSize: {
    headline,
    subhead,
    body,
    caption
  }
};
