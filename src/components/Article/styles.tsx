import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.articleBackground,
    padding: 14,
    width: '100%',
    // height: '100%'
  },
  seperator: {
    height: 1,
    backgroundColor: Colors.borderDefault
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
    justifyContent: 'center',
    marginLeft: 24,
    paddingTop: 6
  },
  title: {
    // fontFamily: 'Merriweather-Regular',
    fontSize: 17,
    fontWeight: '600',
    color: Colors.titleDefault,
    lineHeight: 22,
    marginBottom: 8
  },
  description: {
    alignSelf: 'flex-start',
    width: '100%',
    height: '100%'
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.paragraphGrayed,
    lineHeight: 21
  },
  author: {
    fontSize: 12,
    color: Colors.paragraphGrayed,
    lineHeight: 18
  },
  source: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sourceIcon: {
    color: Colors.grayLight,
    position: 'relative',
    top: 1
  },
  downloadIcon: {
    position: 'relative',
    top: 2,
    marginRight: 4
  },
  sourceName: {
    fontSize: 12,
    color: Colors.paragraphGrayed,
    marginBottom: 8,
    marginLeft: 2
  },
  authorName: {
    color: Colors.paragraphGrayed
  },
  publicationName: {
    color: Colors.paragraphGrayed
  },
  controlButton: {
    backgroundColor: Colors.controlButtonDefault,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlButtonActive: {
    backgroundColor: Colors.controlButtonActive
  },
  controlIcon: {
    // marginLeft: 2
  },
  duration: {
    color: Colors.paragraphGrayed,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 12
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
