import { StyleSheet } from 'react-native';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.articleBackground,
    padding: spacing.default,
    width: '100%'
  },
  isMoving: {
    backgroundColor: colors.appBackground
  },
  seperator: {
    backgroundColor: colors.articleBackground,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDefault,
  },
  sectionHeader: {

  },
  sectionBody: {
    flex: 1,
    flexDirection: 'row'
  },
  sectionMeta: {
    flex: 1
  },
  sectionControl: {
    width: 50,
    justifyContent: 'flex-end',
    marginLeft: spacing.default,
    paddingBottom: 4
  },
  title: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.titleDefault,
    lineHeight: 21,
    marginBottom: 6
  },
  description: {
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%'
  },
  descriptionText: {
    fontSize: fonts.fontSize.body,
    color: colors.paragraphGrayed,
    lineHeight: 24
  },
  author: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    lineHeight: 18
  },
  source: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'baseline'
  },
  sourceIcon: {
    marginRight: 4
  },
  sourceName: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    marginLeft: 2,
    paddingRight: 28,
    fontWeight: fonts.fontWeight.thin
  },
  authorName: {
    color: colors.paragraphGrayed
  },
  publicationName: {
    color: colors.paragraphGrayed
  },
  controlButton: {
    backgroundColor: colors.controlButtonDefault,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.controlButtonActive
  },
  duration: {
    color: colors.paragraphGrayed,
    textAlign: 'center',
    marginTop: 5,
    fontSize: fonts.fontSize.small
  },
  articleEmptyActivityIndicator: {
    marginBottom: spacing.small
  },
  articleEmpty: {
    flex: 1,
    backgroundColor: colors.articleBackground,
    padding: spacing.medium,
    width: '100%',
    justifyContent: 'center'
  },
  articleEmptyText: {
    color: colors.grayLight,
    alignSelf: 'center'
  }
});
