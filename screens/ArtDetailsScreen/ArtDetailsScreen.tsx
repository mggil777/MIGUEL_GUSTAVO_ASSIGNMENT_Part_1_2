import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useCurrentModeContext} from '../../contexts/PresentModeContext';
import {useDisplayedArtworkIdContext} from '../../contexts/DisplayedArtworkIdContext';
import ScreenViews from '../../constants/FooterPressableModes';
import Colors from '../../constants/GlobalColors';
import GlobalStyles from '../../constants/GlobalStyles';
import ImageViewer from 'react-native-image-zoom-viewer';
import FavouriteButton from '../../components/FavouriteButton';
import InfiniteScrollingFlatList from '../../components/InfiniteScrollingFlatList';

type ArtPositionProps = {
  id: number;
  title: string | null;
  imageId: string | null;
  thumbnail?: {
    width: number | null;
    height: number | null;
  };
  description: string | null;
  author: string | null;
  placeOfOrigin: string | null;
  date: number | null;
  artworkType: string | null;
  dimensions: string | null;
  artistId: number | null;
  publicDomain: boolean | null;
  onView: boolean | null;
};

type AuthorPositionProps = {
  id: number;
  authorTitle: string | null;
  description: string | null;
  dateOfBirth: string | null;
  dateOfDeath: number | null;
};

const removeTagsFromString = (text: string) => {
  if (!text) return null;

  const regex = /(<([^>]+)>)/gi;
  return text.replace(regex, '');
};

const getAuthorDataById = (authorId: number) => {
  const [artistData, setArtistData] = useState({} as AuthorPositionProps);
  const requestUrl = `https://api.artic.edu/api/v1/agents/${authorId}`;

  useEffect(() => {
    fetch(requestUrl)
      .then(res => res.json())
      .then(res => {
        let item = res.data;

        setArtistData({
          id: item['id'],
          authorTitle: item['title'],
          description: removeTagsFromString(item['description']),
          dateOfBirth: item['birth_date'],
          dateOfDeath: item['death_date'],
        } as AuthorPositionProps);
      });
  }, [authorId]);

  return artistData;
};

const ArtistInfoComponent = ({authorId}: {authorId: number}) => {
  const requestUrl = `https://api.artic.edu/api/v1/agents/${authorId}`;
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const artistData: AuthorPositionProps = getAuthorDataById(authorId);

  useEffect(() => {
    if (artistData == ({} as AuthorPositionProps)) setIsDataLoaded(false);
    else setIsDataLoaded(true);
  }, [artistData]);

  return (
    <ScrollView style={[styles.artRoot, {padding: 6, alignContent: 'center'}]}>
      <Text style={[styles.headerTitle, {textAlign: 'center'}]}>
        {artistData.authorTitle}
      </Text>
      <View>
        {artistData.description ? (
          <Text
            style={{
              fontSize: 16,
              textAlign: 'justify',
              borderRadius: 4,
              padding: 4,
              paddingBottom: 0,
            }}>
            {artistData.description}
          </Text>
        ) : (
          <Text style={{textAlign: 'center', margin: 12}}>
            No description available for this artist
          </Text>
        )}
      </View>
      <View style={[styles.infoTextContainer, GlobalStyles.lightBorders]}>
        {[
          ['Author', artistData.authorTitle],
          ['Date of birth', artistData.dateOfBirth],
          ['Date of death', artistData.dateOfDeath],
        ].map((entry, index) =>
          entry[1] ? (
            <View style={[{padding: 4}, styles.lightSeparator]} key={index}>
              <Text style={{fontWeight: '600'}}>{entry[0]}</Text>
              <Text>{entry[1]}</Text>
            </View>
          ) : (
            <View key={index} />
          ),
        )}
      </View>
      <InfiniteScrollingFlatList
        searchTerm={artistData.authorTitle ?? ''}
        style={{width: '99.5%'}}
      />
      <View style={{height: 20}} />
    </ScrollView>
  );
};

const getDataById = (artId: number): ArtPositionProps => {
  const [artData, setArtData] = useState({} as ArtPositionProps);
  const requestUrl = `https://api.artic.edu/api/v1/artworks/${artId}`;

  useEffect(() => {
    fetch(requestUrl)
      .then(res => res.json())
      .then(res => {
        let item = res.data;
        let itemThumbnail = item['thumbnail'];
        setArtData({
          id: item['id'],
          imageId: item['image_id'],
          title: item['title'],
          thumbnail: {
            height: item['thumbnail'] ? item['thumbnail']['height'] : null,
            width: item['thumbnail'] ? item['thumbnail']['width'] : null,
          },
          description:
            removeTagsFromString(item['description']) ??
            removeTagsFromString(itemThumbnail['alt_text']) ??
            null,
          author:
            item['artist_title'] ?? item['artist_display'] ?? 'unknown artist',
          placeOfOrigin: item['place_of_origin'] ?? 'unknown place of origin',
          date: item['date_display'] ?? 'unknown year of creation',
          artworkType: item['medium_display'],
          dimensions: item['dimensions'],
          publicDomain: item['is_public_domain'],
          onView: item['is_on_view'],
          artistId: item['artist_id'],
        } as ArtPositionProps);
      });
  }, [artId]);

  return artData;
};

const ArtDetailsScreen = () => {
  const {artId, setArtId} = useDisplayedArtworkIdContext();
  const requestUrl = `https://api.artic.edu/api/v1/artworks/${artId}`;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [imageFullscreenMode, setImageFullscreenMode] = useState(false);
  const [showAuthorDetails, setShowAuthorDetails] = useState(false);

  const artData = getDataById(artId ?? 20684);

  useEffect(() => {
    if (artData == ({} as ArtPositionProps)) setIsDataLoaded(false);
    else setIsDataLoaded(true);
  }, [artData]);

  const imageUrl = `https://www.artic.edu/iiif/2/${artData.imageId}/full/1686,/0/default.jpg`;
  const hwRatio =
    artData?.thumbnail?.height && artData?.thumbnail?.width
      ? artData.thumbnail.height / artData.thumbnail.width
      : null;
  const finalHeight = hwRatio
    ? (Dimensions.get('window').width - 20) * hwRatio
    : null;

  const renderImageViewer = () => {
    // console.log(
    //   'isImagerFullscreen:',
    //   imageFullscreenMode,
    //   'imageUrl:',
    //   imageUrl,
    // );
    return (
      <Modal visible={true} transparent={true}>
        <ImageViewer
          enableSwipeDown={true}
          backgroundColor="rgba(0, 0, 0, 0.9)"
          imageUrls={[
            {
              url: imageUrl,
            },
          ]}
          onSwipeDown={() => setImageFullscreenMode(false)}
        />
      </Modal>
    );
  };

  if (artId == null) {
    return <View />;
  }

  if (imageFullscreenMode) {
    return renderImageViewer();
  }

  if (showAuthorDetails && artData.artistId) {
    return <ArtistInfoComponent authorId={artData.artistId} />;
  }
  return (
    <ScrollView style={styles.artRoot}>
      <Pressable onPress={() => setImageFullscreenMode(true)}>
        {isDataLoaded ? (
          <Image
            source={{uri: imageUrl}}
            style={[
              styles.mainImage,
              hwRatio != null ? {height: finalHeight} : {height: 400},
            ]}
          />
        ) : (
          <ActivityIndicator
            size="large"
            color={Colors.primaryElement}
            style={styles.mainImage}
          />
        )}
      </Pressable>
      <View style={styles.headerContainer}>
        <View style={styles.captionContainer}>
          <Text style={styles.headerTitle}>{artData.title}</Text>
          <Text style={styles.headerAuthor}>
            {artData.author}, {artData.date}
          </Text>
        </View>
        <FavouriteButton
          entryId={artData.id}
          style={styles.headerFavouriteButton}
        />
      </View>
      <View>
        {artData.description ? (
          <Text
            style={{
              fontSize: 16,
              textAlign: 'justify',
              borderRadius: 4,
              padding: 4,
              paddingBottom: 0,
              backgroundColor: Colors.primaryElement,
              color: Colors.primaryBackground,
            }}>
            {artData.description}
          </Text>
        ) : (
          <Text style={{textAlign: 'center'}}>
            No description available for this artwork
          </Text>
        )}
      </View>
      <View style={[styles.infoTextContainer, GlobalStyles.popoutBorders]}>
        <View style={[styles.infoTextElement, styles.lightSeparator]}>
          <View>
            <Text style={{fontWeight: '600', color: Colors.primaryAccent}}>
              Author
            </Text>
            <Text style={{color: Colors.primaryBackground}}>
              {artData.author}
            </Text>
          </View>
        </View>
        {[
          ['Title', artData.title],
          ['Place of origin', artData.placeOfOrigin],
          ['Date of creation', artData.date],
          ['Artwork type', artData.artworkType],
          ['Dimensions', artData.dimensions],
          ['Public Domain', artData.publicDomain ? 'Yes' : 'No'],
          ['On Display', artData.onView ? 'Yes' : 'No'],
        ].map((entry, index) =>
          entry[1] ? (
            <View style={[{padding: 4}, styles.lightSeparator]} key={index}>
              <Text style={{fontWeight: '600', color: Colors.primaryAccent}}>
                {entry[0]}
              </Text>
              <Text style={{color: Colors.primaryBackground}}>{entry[1]}</Text>
            </View>
          ) : (
            <View key={index} />
          ),
        )}
      </View>
      <View style={{height: 20}} />
    </ScrollView>
  );
};

const displayArtInfo = (newArtId: number) => {
  const {artId, setArtId} = useDisplayedArtworkIdContext();
  const {currentMode, setCurrentMode} = useCurrentModeContext();
  setArtId(newArtId);
  setCurrentMode(ScreenViews.details);
};

const styles = StyleSheet.create({
  lightSeparator: {
    borderColor: '#20B2AA', //'#ccc',
    borderBottomWidth: 1,
  },
  artRoot: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 'auto',
    padding: 15,
    marginTop: 35,
    marginBottom: 60,
    backgroundColor: Colors.primaryElement,
  },
  mainImage: {
    flex: 1,
    backgroundColor: Colors.minorAccent,
    width: '100%',
    height: 400,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryElement,
  },
  captionContainer: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.primaryAccent,
  },
  headerAuthor: {
    fontWeight: '500',
    fontStyle: 'italic',
    color: Colors.primaryAccent,
  },
  headerFavouriteButton: {
    marginLeft: 'auto',
    marginRight: 8,
  },
  infoTextContainer: {
    margin: 20,
    marginTop: 15,
    borderBottomWidth: 0,
    backgroundColor: Colors.primaryElement,
  },
  infoTextElement: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    color: Colors.primaryBackground,
  },
});

export default ArtDetailsScreen;
export type {ArtPositionProps};
