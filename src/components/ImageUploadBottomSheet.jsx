import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import {CAMERA_ICON, GALLERY_ICON, REMOVE_ICON} from '../constants/imagepath';
import {HEIGHT, WIDTH} from '../constants/config';
import {WHITE} from '../constants/color';
import {MEDIUM} from '../constants/fontfamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {isIOS} from '../utils/Platform';
import {SafeAreaView} from 'react-native-safe-area-context';

const ImageUploadBottomSheet = ({
  ref,
  onPressRemove = undefined,
  onPressCamera = undefined,
  onPressGallery = undefined,
}) => {
  const paddingBottom = isIOS ? 0 : HEIGHT * 0.04;
  return (
    <SafeAreaView edges={['left', 'right', 'top']}>
      <ActionSheet
        animated
        ref={ref}
        isModal={true}
        gestureEnabled
        zIndex={1}
        containerStyle={[styles.containerStyle, {paddingBottom: paddingBottom}]}
        closeOnPressBack
        keyboardHandlerEnabled={true}>
        <View style={styles.contentContainer}>
          {onPressRemove && (
            <TouchableOpacity style={styles.cards} onPress={onPressRemove}>
              <Text style={styles.text}>Remove Profile Picture</Text>
              <Image
                source={REMOVE_ICON}
                style={styles.icons}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {onPressCamera && (
            <TouchableOpacity style={styles.cards} onPress={onPressCamera}>
              <Text style={styles.text}>Open Camera</Text>
              <Image
                source={CAMERA_ICON}
                style={styles.icons}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {onPressGallery && (
            <TouchableOpacity style={styles.cards} onPress={onPressGallery}>
              <Text style={styles.text}>Upload from Gallery</Text>
              <Image
                source={GALLERY_ICON}
                style={styles.icons}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
};

export default ImageUploadBottomSheet;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bar: {
    width: WIDTH * 0.2,
    height: HEIGHT * 0.004,
    backgroundColor: '#ADADAD',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: HEIGHT * 0.01,
  },
  contentContainer: {
    width: '100%',
    paddingVertical: HEIGHT * 0.025,
    paddingHorizontal: WIDTH * 0.05,
    gap: isIOS ? HEIGHT * 0.008 : HEIGHT * 0.012,
  },
  cards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icons: {
    width: WIDTH * 0.13,
    height: WIDTH * 0.13,
  },
  text: {
    color: '#333333',
    fontSize: RFValue(13),
    fontFamily: MEDIUM,
    fontWeight: '500',
  },
});
