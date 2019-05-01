import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.articleBackground,
    padding: 16,
    width: '100%'
  },
  seperator: {
    backgroundColor: Colors.articleBackground,
    paddingLeft: 16,
    paddingRight: 16
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
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
    width: 45,
    justifyContent: 'flex-end',
    marginLeft: 16,
    paddingBottom: 3
  },
  title: {
    fontSize: fonts.fontSize.subheader,
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
    fontSize: fonts.fontSize.small,
    color: colors.paragraphGrayed,
    lineHeight: 20
  },
  author: {
    fontSize: fonts.fontSize.small,
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
    color: Colors.paragraphGrayed
  },
  controlButton: {
    backgroundColor: Colors.controlButtonDefault,
    width: 45,
    height: 45,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: Colors.controlButtonActive
  },
  duration: {
    color: Colors.paragraphGrayed,
    textAlign: 'center',
    marginTop: 4,
    fontSize: fonts.fontSize.tiny
  },
  articleEmptyActivityIndicator: {
    marginBottom: 12
  },
  articleEmpty: {
    flex: 1,
    backgroundColor: Colors.articleBackground,
    padding: 14,
    width: '100%',
    justifyContent: 'center'
  },
  articleEmptyText: {
    color: Colors.grayLight,
    alignSelf: 'center'
  }
});
