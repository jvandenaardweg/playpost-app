import isEqual from 'react-fast-compare';
import { createSelectorCreator, defaultMemoize } from 'reselect';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)
