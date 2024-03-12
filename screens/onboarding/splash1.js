import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { primary, secondary, tertiary, quaternary } from '../../assets/colors/colors.js';
import { headline, title } from '../../assets/fonts/fonts.js';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

const images = [
  require('../../assets/graphics/onboarding/splash1.gif'),
  require('../../assets/graphics/onboarding/splash2.gif'),
  require('../../assets/graphics/onboarding/splash3.gif'),
  require('../../assets/graphics/onboarding/splash4.gif'),
];

export default function SplashApp() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const [automaticScrolling, setAutomaticScrolling] = useState(true);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  
  // This state variable keeps track of the currently active screen in the carousel (0, 1, 2, or 3).
  const [activeScreen, setActiveScreen] = useState(0); 

  // A boolean state that indicates if the user is currently manually scrolling the carousel.
  const [manualScrolling, setManualScrolling] = useState(false);

  // It holds the reference to the timer used for automatic scrolling.
  const [timer, setTimer] = useState(null);

  //This state variable determines the color of the inactive buttons in the carousel.
  const [inactiveButtonColor, setInactiveButtonColor] = useState(primary.background);

  useEffect(() => {
    // Update the inactive button color based on the active screen
    switch (activeScreen) {
      case 0:
        setInactiveButtonColor(primary.background);
        break;
      case 1:
        setInactiveButtonColor(secondary.background);
        break;
      case 2:
        setInactiveButtonColor(tertiary.background);
        break;
      case 3:
        setInactiveButtonColor(quaternary.background);
        break;
      default:
        setInactiveButtonColor(primary.background);
    }
  }, [activeScreen]);

  useEffect(() => {
    setActiveScreen(0);
    setAutomaticScrolling(true);
  }, []);
  


  useEffect(() => {
    if (automaticScrolling) {
      const newTimer = setTimeout(() => {
        scrollToNextScreen();
      }, 5000);
      setTimer(newTimer); // Save the new timer in the state
      return () => clearTimeout(newTimer); // Clear the timer when the component unmounts
    }
  }, [activeScreen, automaticScrolling]);


  const handleScrollBeginDrag = () => {
    setManualScrolling(true);
    setAutomaticScrolling(false);
    if (timer) {
      clearTimeout(timer);
    }
  };


  const handleNextScreen = () => {
    const nextScreenNumber = (activeScreen + 1) % 4;

  // Animate the selected button's position
  Animated.spring(selectedButtonX, {
    toValue: nextScreenNumber * (circleSize + RFValue(4)),
    useNativeDriver: false,
  }).start();

  // Animate the semicircle's background color
  Animated.timing(semiCircleColor, {
    toValue: nextScreenNumber, // Use nextScreenNumber as the color index
    duration: 300, // Adjust the duration as needed
    useNativeDriver: false,
  }).start();

    setActiveScreen(nextScreenNumber);
  };

  const handleScrollEndDrag = () => {
    setManualScrolling(false);
    if (!manualScrolling && activeScreen === 3) {
      const newTimer = setTimeout(() => {
        scrollToNextScreen();
      }, 5000);
      setTimer(newTimer);
    }
  };  


  const scrollToNextScreen = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const nextScreenNumber = (activeScreen + 1) % 4;
    const offsetX = nextScreenNumber * Dimensions.get('window').width;
    setActiveScreen(nextScreenNumber);
    carouselRef.current.scrollTo({ x: offsetX });
    setAutomaticScrolling(true);
  };  
  
  

  // Define Animated value for the selected button's position
  const selectedButtonX = useRef(new Animated.Value(0)).current;

  const handleCirclePress = (screenNumber) => {
    setActiveScreen(screenNumber);
    carouselRef.current.scrollTo({ x: screenNumber * Dimensions.get('window').width });
  
    // Animate the selected button's position when the user clicks on a new image
    Animated.spring(selectedButtonX, {
      toValue: screenNumber * (circleSize + RFValue(4)), // Adjust RFValue(4) as needed for spacing between buttons
      useNativeDriver: false,
    }).start();
  };
  

  useEffect(() => {
    if (automaticScrolling) {
      const newTimer = setTimeout(() => {
        scrollToNextScreen();
      }, 5000);
      setTimer(newTimer);
      return () => clearTimeout(newTimer); // Clear the timer when the component unmounts
    }
  }, [activeScreen, automaticScrolling]);

  if (!fontsLoaded) {
    return null; // You can show a loading indicator here if you prefer
  } else {
    SplashScreen.hideAsync();
  }

  const selectedButtonBackgroundColor = selectedButtonX.interpolate({
    inputRange: [0, circleSize + RFValue(4), circleSize * 2 + RFValue(8), circleSize * 3 + RFValue(12)],
    outputRange: [
      primary.complement,
      secondary.complement,
      tertiary.complement,
      quaternary.complement,
    ],
  });
  
  // ...
  
  <Animated.View
  style={[
    styles.animatedCircle,
    {
      transform: [{ translateX: selectedButtonX }],
      backgroundColor: selectedButtonBackgroundColor,
    },
  ]}
/>
  
  

  return (
    <View
  style={[
    styles.container,
    {
      backgroundColor:
        activeScreen === 0
          ? primary.complement
          : activeScreen === 1
          ? secondary.complement
          : activeScreen === 2
          ? tertiary.complement
          : quaternary.complement,
    },
  ]}
>
      {/* Header */}
      <View style={{ flex: 1, justifyContent: 'center', marginTop: RFValue(32) }}>
        <Text style={styles.headerText}>Imagine an app that</Text>
      </View>

      {/* Carousel */}
      <View style={{ flex: 4, maxHeight: carouselContainerMaxHeight, maxHeight: carouselContainerMaxHeight }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={carouselRef}
          onMomentumScrollEnd={(event) => {
            const screenWidth = Dimensions.get('window').width;
            const currentOffset = event.nativeEvent.contentOffset.x;
            const activeIndex = Math.floor(currentOffset / screenWidth);
            setActiveScreen(activeIndex);
            setAutomaticScrolling(false); // Disable automatic scrolling when manually scrolling
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={[
                styles.carouselImage,
                {
                  opacity: index === activeScreen ? 1 : 0.5,
                  width: imageSize,
                  aspectRatio: 1.5, // Set the aspect ratio to maintain the original image aspect ratio
                },
              ]}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>

      {/* Semicircle */}
    <View style={{ flex: 6, justifyContent: 'flex-end', marginBottom: RFValue(-windowHeight * 0.4) }}>
      <View
        style={[
          styles.semicircle,
          {
            backgroundColor:
              activeScreen === 0
                ? primary.primary
                : activeScreen === 1
                ? secondary.secondary
                : activeScreen === 2
                ? tertiary.tertiary
                : quaternary.quaternary,
          },
          { width: RFValue(semiCircleSize), height: RFValue(semiCircleSize) },
        ]}
      >
          {/* 4 Circles */}
<View style={styles.circleContainer}>
  {Array.from({ length: 4 }).map((_, index) => (
    <TouchableOpacity
    key={index}
    style={[
      styles.circle,
      {
        width: index === activeScreen ? RFValue(60) : RFValue(20),
        borderRadius: index === activeScreen ? RFValue(30) : RFValue(10), // Adjust the border radius
        backgroundColor:
          index === activeScreen
            ? index === 0
              ? primary.complement
              : index === 1
              ? secondary.complement
              : index === 2
              ? tertiary.complement
              : quaternary.complement
            : inactiveButtonColor,
      },
    ]}
    onPress={() => handleCirclePress(index)}
  />
  
  ))}

  {/* Animated Selected Button */}
  <Animated.View
    style={[
      styles.animatedCircle,
      {
        transform: [{ translateX: selectedButtonX }],
      },
    ]}
  />
</View>
          {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonsView}>
            {/* Sign Up Button */}
            <TouchableOpacity
  style={[
    styles.button,
    {
      backgroundColor:
        activeScreen === 0
          ? primary.complement
          : activeScreen === 1
          ? secondary.complement
          : activeScreen === 2
          ? tertiary.complement
          : quaternary.complement,
    },
  ]}
  onPress={() => navigation.navigate('Onboard1')}
>
  <Text style={styles.buttonText}>Sign up</Text>
</TouchableOpacity>

              {/* Log In Button */}
              <TouchableOpacity
                style={[
                  styles.outlinedButton,
                  {
                    borderColor:
                      activeScreen === 0
                        ? primary.complement
                        : activeScreen === 1
                        ? secondary.complement
                        : activeScreen === 2
                        ? tertiary.complement
                        : quaternary.complement,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonTextAlt,
                    {
                      color:
                        activeScreen === 0
                          ? primary.complement
                          : activeScreen === 1
                          ? secondary.complement
                          : activeScreen === 2
                          ? tertiary.complement
                          : quaternary.complement,
                    },
                  ]}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const deviceWidth = Dimensions.get('window').width;
const iPhone14ProMaxWidth = 480;
const desiredImageWidth = deviceWidth >= iPhone14ProMaxWidth ? deviceWidth * 0.88 : iPhone14ProMaxWidth * 0.8;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const imageSize = RFValue(desiredImageWidth * 1.2);
const semiCircleSize = RFValue(windowWidth * 1.3);

const buttonWidthPercentage = 0.9; // Adjust this value to set the desired width as a percentage of the screen width

// Calculate the button width based on the screen width
const buttonWidth = Dimensions.get('window').width * buttonWidthPercentage;


const circleSize = RFValue(20); // Updated circle size
const semiCircleMargin = RFValue(-1000); // Margin for the semicircle
const imageMargin = (windowWidth - imageSize) / 2;
const carouselContainerMaxHeight = windowHeight * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primary.complement,
    alignItems: 'center',
  },
  headerText: {
    ...headline.large,
    textAlign: 'center',
  },
  carouselImage: {
    width: imageSize,
    height: imageSize * 1.5, // Adjust the height as needed for proper aspect ratio
    marginHorizontal: imageMargin,
    alignSelf: 'center',
  },
  semicircle: {
    backgroundColor: primary.primary,
    borderRadius: RFValue(semiCircleSize * 0.5),
    alignItems: 'center',
    paddingTop: RFValue(32), // Adjust this value as needed for vertical centering of buttons
    marginBottom: semiCircleMargin, // Adjust this value to move the semicircle down
    flex: 1, // Expand to take available vertical space
    justifyContent: 'flex-end', // Align the semicircle at the bottom
  },
  circleContainer: {
    flexDirection: 'row',
    marginBottom: RFValue(16),
    justifyContent: 'center', // Center the circles horizontally
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize * 0.5,
    marginHorizontal: RFValue(4),
  },
  buttonsContainer: {
    flex: 1, // Expand to take available vertical space
    justifyContent: 'flex-start', // Align the buttons at the top
    alignItems: 'center',
    marginTop: RFValue(16), // Add vertical spacing between the buttons and the semicircle
  },
  buttonsView: {
    flexDirection: 'column', // Vertically stack the buttons
    alignItems: 'center',
    justifyContent: 'space-evenly', // Distribute margins evenly
    width: buttonWidth, // Use the calculated button width here
  },
  button: {
    backgroundColor: primary.complement,
    borderRadius: 100,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(24),
    width: buttonWidth,
    marginBottom: RFValue(16),
    alignItems: 'center', // Center the text inside the buttons horizontally
  },
  outlinedButton: {
    borderColor: primary.complement,
    borderWidth: RFValue(2),
    borderRadius: 100,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(24),
    width: buttonWidth,
    marginBottom: RFValue(16),
    alignItems: 'center', // Center the text inside the buttons horizontally
  },
  buttonText: {
    ...title.large,
    textAlign: 'center',
    fontSize: RFValue(18), // Use RFValue for responsive font sizes
  },
  buttonTextAlt: {
    ...title.large,
    textAlign: 'center',
    color: primary.complement,
    fontSize: RFValue(18), // Use RFValue for responsive font sizes
  },
  circleLink: {
    alignItems: 'center',
    justifyContent: 'center',
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize * 0.5,
    backgroundColor: primary.background,
    marginTop: RFValue(8),
  },
  circleLinkText: {
    ...title.small,
    color: primary.text, // Set the text color for the circle number
  },
});
