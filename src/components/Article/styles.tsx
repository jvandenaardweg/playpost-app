import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.articleBackground,
    padding: 14,
    width: '100%'
  },
  seperated: {
    borderBottomColor: Colors.borderDefault,
    borderBottomWidth: 1,
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
    lineHeight: 21,
    marginBottom: 10
  },
  description: {
    alignSelf: 'flex-start',
    width: '100%',
    height: '100%'
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.paragraphGrayed,
    lineHeight: 21,
    opacity: 0.8,
  },
  author: {
    fontSize: 13,
    color: Colors.paragraphGrayed,
    lineHeight: 19
  },
  source: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    opacity: 0.8
  },
  sourceIcon: {
    color: Colors.paragraphGrayed
  },
  sourceName: {
    fontSize: 12,
    color: Colors.paragraphGrayed,
    marginBottom: 8,
    marginLeft: 6
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
  }
});
