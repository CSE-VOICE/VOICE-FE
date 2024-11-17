import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { typography } from '../styles/typography';

function LoadPage({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('MainTabs'); // 1.5초 후 MainPage로 이동
    }, 1500);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigation]);


  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={[styles.title, typography.title]}>VOICE</Text>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logov1.png')}
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

export default LoadPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: 100,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
});