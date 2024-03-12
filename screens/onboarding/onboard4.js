import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Animated, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { primary, secondary, tertiary, quaternary } from '../../assets/colors/colors.js';
import { headline, title, body, label } from '../../assets/fonts/fonts.js';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const transitionValue = new Animated.Value(0);

  // Load fonts
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
    });
    SplashScreen.hideAsync();
  };

  const imageHeight = 200; // Change this to the desired height of your image
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = RFValue(56);
  const dynamicMargin = (screenHeight - headerHeight - imageHeight) / 3;
  const isIOS = Platform.OS === 'ios';

  const colors = [primary, secondary, tertiary, quaternary, primary, secondary];
  const activeScreenIndex = 3; // Change this index based on the current active screen

  const navigateToOnboardingScreen = (screenNumber) => {
    // Based on the screenNumber, navigate to the corresponding onboard file
    navigation.navigate(`Onboard${screenNumber}`);
  };

  const bodyTextFontSize = isIOS ? body.large : body.medium; // Choose the appropriate font size based on the platform

  const screenWidth = Dimensions.get('window').width;
  const circularButtonWidth = RFValue(32);
  const circularButtonMargin = (screenWidth - (colors.length * circularButtonWidth)) / (colors.length * 2);
  const nextButtonMargin = (screenWidth - RFValue(32) - circularButtonWidth) / 2; // Subtract the right padding and circular button width

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, headline.large]}>Automate your schoolwork</Text>
      </View>

      {/* Parent container for image and description */}
      <View style={styles.imageContainer}>
        {/* Onboarding Image */}
        <View
          style={[
            styles.onboardingImage,
            {
              backgroundColor: quaternary.complement,
              borderRadius: 999,
              paddingVertical: 40,
              width: Dimensions.get('window').width + 24, // Set the width of the image container
              transform: [{ rotate: '20deg' }],
            },
          ]}
        >
        </View>
        <Image
            source={require('../../assets/graphics/onboarding/onboarding4.png')}
            style={styles.onboardingImageFile}
          />

        {/* Additional Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.bodyText, bodyTextFontSize]}>
          What’s more annoying than switching between email and work?
          No more juggling—view announcements, assignment reminders, your 
          personal notes, + grades posted. Never miss a deadline 
          (and never procrastinate).</Text>
        </View>
      </View>

      {/* Absolute positioned circle */}
      <View style={styles.circle} />

   {/* Platform-specific semicircles */}
        {isIOS ? (
          <View style={styles.iOSHalfCircle}>
            <View style={styles.halfCircleTop} />
            <View style={styles.halfCircleBottom} />
          </View>
        ) : (
          <View style={styles.androidHalfCircle} />
        )}

        {/* Horizontal row of circular buttons */}
      <View style={styles.circularButtonsContainer}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.circularButton,
              {
                backgroundColor:
                  index === activeScreenIndex
                    ? color.quaternary
                    : colors[activeScreenIndex].complement,
                borderRadius: index === activeScreenIndex ? RFValue(40) : RFValue(20),
                marginLeft: circularButtonMargin,
                marginRight: circularButtonMargin,
                width: index === activeScreenIndex ? RFValue(60) : RFValue(20),
                height: RFValue(20),
              },
            ]}
            onPress={() => navigateToOnboardingScreen(index + 1)}
          />
        ))}
      </View>


      {/* Button */}
      <View style={styles.bottomButtonContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.nextButton}>
          <Text style={styles.skipButtonText}>Skip to login</Text>
          <Image source={require('../../assets/icons/arrow_forward_ios.png')} style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: quaternary.background, // Change to your preferred background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: RFValue(56), // Slightly lower the header
    paddingRight: RFValue(32),
  },
  headerText: {
    ...headline.large,
    textAlign: 'left',
    marginLeft: RFValue(16),
    color: quaternary.quaternary, // Change to your preferred text color
    paddingBottom: RFValue(24),
  },
  backButton: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
    bottom: RFValue(8),
  },
  backIcon: {
    width: RFValue(24),
    height: RFValue(24),
  },
  imageContainer: {
    flex: 1, // Allow the image to occupy the available space
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingImage: {
    flex: 1, // Allow the image to occupy the available space
    width: Dimensions.get('window').width,
    height: 'auto',
    resizeMode: 'contain',
    alignItems: 'center',
  },
  onboardingImageFile: {
    flex: 1, // Allow the image to occupy the available space
    position: 'absolute',
    top: '-2.5%', 
    width: RFValue(280),
    height: RFValue(280),
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(18),
    paddingTop: RFValue(18)
  },
  labelText: {
    color: quaternary.quaternary,
  },
  headlineText: {
    color: quaternary.quaternary,
    marginTop: RFValue(8),
  },
  bodyText: {
    color: quaternary.quaternary,
    marginTop: RFValue(8),
    textAlign: 'center',
  },
  italicText: {
    fontStyle: 'italic',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align the content to the right
    paddingHorizontal: RFValue(16),
    paddingBottom: RFValue(16),
    marginRight: RFValue(-16),
  },
  chevronIcon: {
    width: RFValue(24),
    height: RFValue(24),
  },
  nextButton: {
    flexDirection: 'row', // Stack the icon and text horizontally
    alignItems: 'center', // Center the content vertically
    paddingVertical: RFValue(8),
    marginRight: RFValue(24), // Increase the paddingHorizontal for more space
  },
  circle: {
    position: 'absolute',
    top: '50%', // Adjust the top position as needed (percentage of the imageContainer height)
    left: '2%', // Adjust the left position as needed (percentage of the imageContainer width)
    width: RFValue(72),
    height: RFValue(72),
    borderRadius: RFValue(100),
    backgroundColor: quaternary.quaternary, // Replace 'red' with your desired color for the circle
  },
  iOSHalfCircle: {
    position: 'absolute',
    top: '8%', // Adjust the top position as needed (percentage of the imageContainer height)
    right: '-8%', // Adjust the right position as needed (percentage of the imageContainer width)
    width: RFValue(100),
    height: RFValue(100),
    transform: [{ rotate: '0deg' }],
  },
  halfCircleTop: {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: RFValue(60),
    borderBottomRightRadius: RFValue(60),
    overflow: 'hidden',
  },
  halfCircleBottom: {
    flex: 1,
    backgroundColor: quaternary.quaternary, // Replace 'blue' with your desired color for the half circle
    borderTopLeftRadius: RFValue(60),
    borderTopRightRadius: RFValue(60),
    overflow: 'hidden',
  },

  // Add Android specific styles
  androidHalfCircle: {
    position: 'absolute',
    top: '10%', // Adjust the top position as needed (percentage of the imageContainer height)
    right: '5%', // Adjust the right position as needed (percentage of the imageContainer width)
    width: RFValue(60),
    height: RFValue(120),
    borderTopLeftRadius: RFValue(100),
    borderBottomLeftRadius: RFValue(100),
    backgroundColor: quaternary.quaternary, // Replace 'blue' with your desired color for the half circle
    transform: [{ rotate: '90deg' }],  // Rotate the half circle 90 degrees
  },
  circularButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: RFValue(16),
  },
  circularButton: {
    width: RFValue(20),
    height: RFValue(20),
  },
});

export default OnboardingScreen;