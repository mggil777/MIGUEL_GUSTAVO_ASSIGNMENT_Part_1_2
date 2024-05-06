import {StyleSheet} from 'react-native';
import Colors from './GlobalColors';

const GlobalStyles = StyleSheet.create({
  mediumBorders: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.ascender,
  },
  lightBorders: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  noBorders: {
    borderColor: Colors.primaryElement,
  },
  headerFont: {
    fontFamily: 'Freeman-Regular',
  },
  popoutBorders: {
    borderColor: Colors.primaryAccent,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
  },
});

export default GlobalStyles;
