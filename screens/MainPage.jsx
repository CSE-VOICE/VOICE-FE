import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { typography } from '../styles/typography';

function MainPage() {
  const [userName, setUserName] = useState('OO');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          const user = JSON.parse(userString);
          if (user.name) {
            const nameWithoutFirst = user.name.slice(1) || 'OO'; // 성을 제외한 이름
            setUserName(nameWithoutFirst);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={[styles.title, typography.title]}>{userName}의 홈</Text>
          
          <View style={styles.contentContainer}>
            <View style={styles.statusCard}>
            <View style={styles.textRow}>
              <Text style={styles.cardTitle1}>
                스마트에어
              </Text>
              <Text style={styles.cardTitle2}>
                로 우리집 공기를 관리하세요.
              </Text>
            </View>

              <View style={styles.statusGrid}>
                <View style={styles.statusItem}>
                  <Feather name="thermometer" size={20} color="#666666" />
                  <Text style={styles.statusLabel}>온도</Text>
                
                </View>
                <View style={styles.statusItem}>
                  <Feather name="droplet" size={20} color="#666666" />
                  <Text style={styles.statusLabel}>습도</Text>
    
                </View>
                <View style={styles.statusItem}>
                  <Feather name="help-circle" size={20} color="#666666" />
                  <Text style={styles.statusLabel}>미세먼지</Text>
               
                </View>
              </View>

              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>실내공기 측정기기</Text>
                <Text style={styles.messageText}>추가 후에 정보가 표시됩니다.</Text>
              </View>

              <TouchableOpacity style={styles.registerButton}>
                <View style={styles.buttonContent}>
                  <Feather name="cpu" size={20} color="#666666" />
                  <Text style={styles.buttonText}>기기등록하기</Text>
                  <Feather name="chevron-right" size={20} color="#666666" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.illustrationContainer}>
              <Image 
                source={require('../assets/backgroundimg.png')} 
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle1: {
    fontSize: 15,
    color: '#800020',
    marginBottom: 25,
  },
  cardTitle2: {
    fontSize: 15,
    color: '#333',
    marginBottom: 25,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 13,
    color: '#666666',
    marginTop: 8,
    marginBottom: 5,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  messageText: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    textAlign: 'center',
  },
  illustrationContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 230,
  },
});

export default MainPage;