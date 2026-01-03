import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

interface PhotoCardProps {
  imageUri: string;
}

const { width: screenWidth } = Dimensions.get('window');
const ASPECT_RATIO = 4 / 3;
const photoHeight = screenWidth / ASPECT_RATIO;

export const PhotoCard: React.FC<PhotoCardProps> = ({ imageUri }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', colors.background]}
        locations={[0.6, 1]}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: photoHeight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
});
