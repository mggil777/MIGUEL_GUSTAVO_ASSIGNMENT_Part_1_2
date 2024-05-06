import React, {createRef, memo, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Keyboard,
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import GlobalColors from '../constants/GlobalColors';
import {useDisplayedArtworkIdContext} from '../contexts/DisplayedArtworkIdContext';
import {useSearchInfoContext} from '../contexts/SearchContext';
import {useCurrentModeContext} from '../contexts/PresentModeContext';
import ViewModes from '../constants/FooterPressableModes';
import SaveButton from './FavouriteButton';

// shape of props for ArtPosition component
type ArtPositionProps = {
  id: number;
  title: string;
  imageId: string;
  thumbnail: {
    width: number | null | undefined;
    height: number | null | undefined;
  };
  artistTitle?: string | null;
  is_public_domain?: boolean;
  is_on_view?: boolean;
};
// functionalcomponent to render an artwork position with an image, title, and a save button.
// works with memo to optimize performance by only re-rendering when props change.
const ArtPosition = memo((data: ArtPositionProps) => {
  const {artId, setArtId} = useDisplayedArtworkIdContext();
  const {currentMode, setCurrentMode} = useCurrentModeContext();

  const imageUrl = `https://www.artic.edu/iiif/2/${data.imageId}/full/843,/0/default.jpg`;

  //calculates the height-to-width ratio of the artwork thumbnail - keeps aspect ratio
  const hwRatio =
    data.thumbnail.height && data.thumbnail.width
      ? data.thumbnail.height / data.thumbnail.width
      : null;
  let finalHeight = hwRatio != null ? 200 * hwRatio : null;
  const isImageWide = !!(hwRatio && hwRatio < 0.7);
  if (hwRatio && isImageWide) finalHeight = 415 * hwRatio;

  //function to set the current mode to details and set the artId to the id of the artwork
  const displayArtInfo = () => {
    setArtId(data.id);
    setCurrentMode(ViewModes.details);
  };

  //if the imageId is null, undefined or empty, return an empty view
  if (!data.imageId) {
    return <View />;
  }
  // JSX - returns a pressable with an image, title, and save button
  return (
    <Pressable
      onPress={() => displayArtInfo()}
      style={[
        styles.artPosition,
        isImageWide ? styles.artPositionWide : {},
        GlobalStyles.lightBorders,
      ]}>
      <Image
        source={{uri: imageUrl}}
        style={[
          styles.artPositionImage,
          isImageWide ? styles.artPositionImageWide : {},
          hwRatio != null ? {height: finalHeight} : {height: '100%'},
        ]}
      />
      <Text style={styles.artPositionTitle}>{data.title}</Text>
      <SaveButton entryId={data.id} style={{margin: 2}} />
    </Pressable>
  );
});

// fetch artwork data from the API based on the page number, search term, is_public_domain, and is_on_view
const fetchDataByPage = (
  page: number,
  searchTerm: string,
  is_public_domain: boolean,
  is_on_view: boolean,
) => {
  const pageSize = 10; // number of artworks to fetch per page

  let requestUrl;
  // checks various conditions to determine the appropriate request URL based on parameters
  if (
    searchTerm.length > 0 &&
    is_public_domain === false &&
    is_on_view === false
  ) {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  } else if (
    searchTerm.length > 0 &&
    is_public_domain === true &&
    is_on_view === false
  ) {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&query[term][is_public_domain]=${is_public_domain}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  } else if (
    searchTerm.length > 0 &&
    is_public_domain === false &&
    is_on_view === true
  ) {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&query[term][is_on_view]=${is_on_view}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  } else if (
    searchTerm.length < 1 &&
    is_public_domain === true &&
    is_on_view === false
  ) {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&query[term][is_public_domain]=${is_public_domain}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  } else if (
    searchTerm.length < 1 &&
    is_public_domain === false &&
    is_on_view === true
  ) {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&query[term][is_on_view]=${is_on_view}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  } else {
    requestUrl = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${pageSize}&fields=id,image_id,title,thumbnail,artist_title,is_public_domain,is_on_view`;
  }
  // after determining the request URL, fetch the data and return it as a JSON object
  return fetch(requestUrl).then(res => res.json());
};
// fetch artwork data from the API based on the page number and search term
const getDataByPage = (
  page: number,
  searchTerm: string,
): ArtPositionProps[] => {
  const [pageData, setPageData] = useState([]); // state holds the data fetched for the current page
  const {isEnabledP_Public, isEnabledV_View} = useSearchInfoContext(); // context values : get the public domain and on view search filters - checks if they are enabled
  const is_public_domain = isEnabledP_Public;
  const is_on_view = isEnabledV_View;
  // useEffect hook to fetch data when the page number, search term, is_public_domain, or is_on_view change
  // updates the pageData state with the fetched data
  useEffect(() => {
    fetchDataByPage(page, searchTerm, is_public_domain, is_on_view).then(
      res => {
        setPageData(
          res.data.map(
            (item: any) =>
              ({
                id: item['id'],
                imageId: item['image_id'],
                title: item['title'],
                thumbnail: {
                  height: item['thumbnail']
                    ? item['thumbnail']['height']
                    : null,
                  width: item['thumbnail'] ? item['thumbnail']['width'] : null,
                },
                artistTitle: item['artist_title'],
              }) as ArtPositionProps,
          ),
        );
      },
    );
  }, [page, searchTerm, is_public_domain, is_on_view]);

  return pageData;
};
// fetch artwork based on a list of IDs and a specific page index
const fetchDataByIds = (pageIndex: number, idList: number[]) => {
  const startingIdx = pageIndex * 10 - 10; // appropriate slice of IDs based on the page index - to slice 0-9 starting index has to be 0
  const endingIdx = pageIndex * 10; // appropriate slice of IDs based on the page index- to slice 0-9 endingIdx has to be set to 10
  const queryData = idList.slice(startingIdx, endingIdx).toString();
  const queryUrl = `https://api.artic.edu/api/v1/artworks?ids=${queryData}&fields=id,title,image_id,thumbnail,artist_title`;
  return fetch(queryUrl).then(res => res.json());
};

// fetch and process data  on the provided list of artwork IDs and page index (number)
// then updates state - UI reflects the latest fetched data for the current page
const getDataByIdList = (page: number, dataList: number[]) => {
  const [pageData, setPageData] = useState([]);

  useEffect(() => {
    fetchDataByIds(page, dataList).then(res => {
      setPageData(
        res.data.map(
          (item: any) =>
            ({
              id: item['id'],
              imageId: item['image_id'],
              title: item['title'],
              thumbnail: {
                height: item['thumbnail'] ? item['thumbnail']['height'] : null,
                width: item['thumbnail'] ? item['thumbnail']['width'] : null,
              },
              artistTitle: item['artist_title'],
            }) as ArtPositionProps,
        ),
      );
    });
  }, [page, dataList]);

  return pageData;
};

type PageViewProps = {
  searchQuery: string;
  pageNumber: number;
  onEndReached?: () => any;
  enablePopoutMode?: boolean;
  overrideSourceIdList?: number[];
};

// works with FlatList renders a scrollable list
const PageView = memo(
  ({
    searchQuery,
    pageNumber,
    onEndReached,
    enablePopoutMode = true,
    overrideSourceIdList,
  }: PageViewProps) => {
    if (!onEndReached) onEndReached = () => null; //not provided, it is set to an empty function

    return (
      <FlatList
        style={[
          enablePopoutMode ? [GlobalStyles.popoutBorders] : {},
          styles.onePageList,
        ]}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={50}
        data={
          overrideSourceIdList
            ? getDataByIdList(pageNumber, overrideSourceIdList)
            : getDataByPage(pageNumber, searchQuery)
        }
        renderItem={({item}) => (
          <ArtPosition
            id={item.id}
            imageId={item.imageId}
            title={item.title}
            thumbnail={item.thumbnail}
          />
        )}
      />
    );
  },
);

type InfiniteScrollProps = {
  searchTerm?: string;
  startingPage?: number;
  style?: StyleProp<ViewStyle>;
  overrideStyle?: StyleProp<ViewStyle>;
  firstPageOverride?: React.JSX.Element;
  overrideSourceIdList?: number[];
  pageLimit?: number;
};

// provides infinite scrolling functionality with a flat list of artwork data based on
// the provided search term and page index. Handles scrolling events and updates the page index accordingly
const InfiniteScrollingFlatList = ({
  searchTerm = '',
  startingPage = 1,
  style = {},
  overrideStyle = null,
  firstPageOverride,
  overrideSourceIdList,
  pageLimit,
}: InfiniteScrollProps) => {
  const [pageIndex, setPageIndex] = useState(startingPage);
  const [progressionLock, setProgressionLock] = useState(false);

  let scrollViewRef = createRef<ScrollView>();

  const actOnScroll = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const triggerThreshold = 10;
    const closeToTop = contentOffset.y < triggerThreshold;
    const closeToBottom =
      layoutMeasurement.height + contentOffset.y >
      contentSize.height - triggerThreshold;
    Keyboard.dismiss();

    if (closeToTop) {
      if (pageIndex == startingPage) return;
      // scroll back just enough to not trigger this switch
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: triggerThreshold + 10,
        animated: false,
      });
      setPageIndex(pageIndex - 1);
    }
    if (closeToBottom) {
      if (pageIndex == 1000) return;
      if (pageLimit && pageIndex + 1 >= pageLimit) return;

      scrollViewRef.current?.scrollTo({
        x: 0,
        y:
          contentOffset.y / 2 - layoutMeasurement.height / 2 + triggerThreshold,
        animated: false,
      });
      setPageIndex(pageIndex + 1);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={({nativeEvent}) => {
        actOnScroll(nativeEvent);
      }}
      style={overrideStyle ?? [styles.searchScreenRoot, style]}>
      {pageIndex == startingPage && searchTerm != '' && (
        <View style={styles.resultsHeaderContainer}>
          <Text style={styles.resultsHeader}>
            Displaying results for: {searchTerm}
          </Text>
        </View>
      )}
      {pageIndex == startingPage && firstPageOverride}
      <PageView
        pageNumber={pageIndex}
        searchQuery={searchTerm}
        overrideSourceIdList={overrideSourceIdList}
      />
      {pageLimit && pageIndex < pageLimit && (
        <PageView
          pageNumber={pageIndex + 1}
          searchQuery={searchTerm}
          overrideSourceIdList={overrideSourceIdList}
        />
      )}
    </ScrollView>
  );
};

export default InfiniteScrollingFlatList;
export {PageView, InfiniteScrollProps};

const styles = StyleSheet.create({
  searchScreenRoot: {
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    marginTop: -8,
  },
  resultsHeaderContainer: {
    marginTop: -20,
    width: '100%',
    height: 70,
    backgroundColor: GlobalColors.primaryElement,
  },
  resultsHeader: {
    marginTop: 25,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: GlobalColors.primaryAccent,
    backgroundColor: GlobalColors.primaryElement,
  },
  onePageList: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 10,
    borderRadius: 4,
    borderColor: GlobalColors.primaryAccent,
  },
  artPosition: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 150,
    padding: 0,
    alignItems: 'center',
    borderBottomWidth: 0,
    borderWidth: 4,
    backgroundColor: '#000',
  },
  artPositionWide: {
    flexDirection: 'column',
  },
  artPositionImage: {
    width: 400,
    height: 100,
  },
  artPositionImageWide: {
    width: '100%',
  },
  artPositionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    margin: 8,
    marginBottom: 0,
    flexWrap: 'wrap',
  },
});
