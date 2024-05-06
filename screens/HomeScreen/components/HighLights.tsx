import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Colors from '../../../constants/GlobalColors';
import GlobalStyles from '../../../constants/GlobalStyles';
import {PageView} from '../../../components/InfiniteScrollingFlatList';

const HighList = () => {
  const requiredFields = [
    'id',
    'title',
    'image_id',
    'dimensions_detail',
  ].toString();

  return (
    <View style={styles.highligthsRoot}>
      <Text style={[styles.highligthsHeader, GlobalStyles.headerFont]}>
        Welcome
      </Text>
      <View style={styles.highligthsPopout}>
        <PageView pageNumber={1} searchQuery={''} enablePopoutMode={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  highligthsRoot: {
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 42,
    backgroundColor: Colors.primaryElement,
  },
  highligthsPopout: {
    borderStyle: 'solid',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryAccent,
  },
  highligthsHeader: {
    textAlign: 'left',
    fontSize: 34,
    marginBottom: 0,
    marginLeft: 14,
    color: Colors.primaryAccent,
  },
});

export default HighList;
