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
  
  const dynamicMargin = (screenHeight - headerHeight - imageHeight) / 3;
  const headerHeight = RFValue(56);
  const imageHeight = RFValue(200); // Change this to the desired height of your image
  const screenHeight = Dimensions.get('window').height;
  const isIOS = Platform.OS === 'ios';
  const onboardingImageTop = -imageHeight * 1.4;
  const colors = [primary, secondary, tertiary, quaternary, primary, secondary];
  const activeScreenIndex = 5; // Change this index based on the current active screen

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
        <Text style={[styles.headerText, headline.large]}>Try premium for an unforgettable experience</Text>
      </View>

       {/* Parent container for image and description */}
       <View style={styles.imageContainer}>
        {/* Onboarding Image */}
        <View style={styles.onboardingImage}>
          {/* Platform-specific semicircles */}
          {isIOS ? (
            <View style={styles.iOSHalfCircle}>
              {/* Updated positioning of half circles */}
              <View style={styles.halfCircleTop} />
              <View style={styles.halfCircleBottom} />
            </View>
          ) : (
            <View style={styles.androidHalfCircle} />
          )}

          {/* Container for centering the onboarding image */}
          <View style={styles.onboardingImageContainer}>
            {/* The Image component */}
            <Image
              source={require('../../assets/graphics/onboarding/onboarding6.png')}
              style={[
                styles.onboardingImageFile,
                { top: onboardingImageTop } // Set the calculated top position
              ]}
            />
          </View>
        </View>

        {/* Additional Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.bodyText, bodyTextFontSize]}>
          <Text style={styles.boldText}>Start a free, 1-week trial</Text> of premium to unlock advanced 
          data insights, planners, reminders, + more for $6.99/yr.
          <Text style={styles.boldText}> However, you’ll be able to purchase it for $4.99 through 
          5/31!</Text>
          </Text>
        </View>
      </View>

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
                    ? color.secondary
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
    backgroundColor: secondary.background, // Change to your preferred background color
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
    color: secondary, // Change to your preferred text color
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
  // Modify the existing styles for imageContainer
imageContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center', // Space evenly between header and bodyText
  paddingBottom: RFValue(16),
},

  onboardingImage: {
    flex: 1, 
  },
  onboardingImageFile: {
    position: 'absolute',
    left: '0%', // Center the image horizontally
    transform: [{ translateX: -Dimensions.get('window').width * 0.5 }], // Centering transformation
    width: Dimensions.get('window').width,
    height: RFValue(800),
    resizeMode: 'contain',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RFValue(18),
  },
  labelText: {
    color: secondary.secondary,
  },
  headlineText: {
    color: secondary.secondary,
    marginTop: RFValue(8),
  },
  bodyText: {
    color: secondary.secondary,
    margin: RFValue(8),
    textAlign: 'center',
    marginTop: RFValue(24),
  },
  italicText: {
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: 'bold',
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
    top: '-8%', // Adjust the top position as needed (percentage of the imageContainer height)
    left: '72%', // Adjust the left position as needed (percentage of the imageContainer width)
    width: RFValue(72),
    height: RFValue(72),
    borderRadius: RFValue(100),
    backgroundColor: secondary.secondary, // Replace 'red' with your desired color for the circle
  },
  iOSHalfCircle: {
    position: 'absolute',
  top: -(RFValue(200) + 200 + RFValue(16)) / 2, 
  right: '-50%', // Adjust the right position as needed (percentage of the imageContainer width)
  width: Dimensions.get('window').width,
  height: RFValue(400),
  transform: [{ rotate: '0deg' }],
  zIndex: -1,
  },
  halfCircleTop: {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: RFValue(999),
    borderBottomRightRadius: RFValue(999),
    overflow: 'hidden',
  },
  halfCircleBottom: {
    flex: 1,
    backgroundColor: secondary.secondary, // Replace 'blue' with your desired color for the half circle
    borderTopLeftRadius: RFValue(999),
    borderTopRightRadius: RFValue(999),
    overflow: 'hidden',
  },

  // Add Android specific styles
  androidHalfCircle: {
    position: 'absolute',
    top: '-32%', // Adjust the top position as needed (percentage of the imageContainer height)
    right: '-24%', // Adjust the right position as needed (percentage of the imageContainer width)
    width: RFValue(200),
    height: RFValue(400),
    zIndex: -1,
    borderTopLeftRadius: RFValue(999),
    borderBottomLeftRadius: RFValue(999),
    backgroundColor: secondary.secondary, // Replace 'blue' with your desired color for the half circle
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