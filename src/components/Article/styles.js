import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default StyleSheet.create({
  article: {
    backgroundColor: Colors.articleBackground,
    padding: 14,
    borderBottomColor: Colors.borderDefault,
    borderBottomWidth: 1
  },
  sectionHeader: {

  },
  sectionBody: {
    flex: 1,
    flexDirection: 'row'
  },
  sectionMeta: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  sectionControl: {
    width: 50,
    justifyContent: 'center',
    marginLeft: 24
  },
  title: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.titleDefault,
    lineHeight: 24,
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    color: Colors.paragraphGrayed,
    lineHeight: 21
  },
  author: {
    fontSize: 13,
    color: Colors.paragraphGrayed,
    lineHeight: 19
  },
  source: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline'
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
    color: Colors.controlButtonDefault,
    textAlign: 'center',
    marginTop: 14,
    fontSize: 12
  }
});
