import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import NuguModule from '../src/NuguModule';
import { typography } from '../styles/typography';

// // 녹음 버튼 컴포넌트
// const RecordButton = ({ isRecording, onPress }) => (
//   <TouchableOpacity 
//     style={[styles.recordButton, isRecording && styles.recordingActive]}
//     onPress={onPress}
//   >
//     <View style={styles.buttonContent}>
//       <Feather 
//         name={isRecording ? "mic-off" : "mic"} 
//         size={24} 
//         color={isRecording ? "#ff4444" : "#666666"} 
//       />
//       <Text style={[styles.buttonText, isRecording && styles.recordingText]}>
//         {isRecording ? "녹음 중지" : "음성 인식 테스트"}
//       </Text>
//     </View>
//   </TouchableOpacity>
// );

// 상태 카드 컴포넌트
const StatusCard = () => (
  <View style={styles.statusCard}>
    <View style={styles.textRow}>
      <Text style={styles.cardTitle1}>스마트에어</Text>
      <Text style={styles.cardTitle2}>로 우리집 공기를 관리하세요.</Text>
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
);

function MainPage() {
  const [userName, setUserName] = useState('OO');
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          const user = JSON.parse(userString);
          if (user.name) {
            const nameWithoutFirst = user.name.slice(1) || 'OO';
            setUserName(nameWithoutFirst);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    const initializeNugu = async () => {
      if (Platform.OS === 'ios') {
        try {
          await NuguModule.initialize();
          setIsInitialized(true);
          console.log('NUGU SDK initialized successfully');
        } catch (error) {
          console.error('Failed to initialize NUGU:', error);
          Alert.alert('초기화 실패', 'NUGU SDK 초기화에 실패했습니다.');
        }
      }
    };

    loadUserData();
    initializeNugu();

    return () => {
      if (isRecording) {
        handleRecordingStop();
      }
    };
  }, []);

  const handleRecordingStart = async () => {
    if (!isInitialized) {
      Alert.alert('알림', 'NUGU SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      await NuguModule.startRecording();
      setIsRecording(true);
      Alert.alert('알림', '녹음이 시작되었습니다.');
    } catch (error) {
      console.error('Recording failed to start:', error);
      Alert.alert('오류', '녹음 시작에 실패했습니다.');
    }
  };

  const handleRecordingStop = async () => {
    try {
      const result = await NuguModule.stopRecording();
      setIsRecording(false);
      Alert.alert(
        '녹음 완료', 
        `녹음 파일이 저장되었습니다.\n경로: ${result.audioPath}\nSTT 결과: ${result.sttResult || '텍스트 변환 실패'}`
      );
    } catch (error) {
      console.error('Recording failed to stop:', error);
      Alert.alert('오류', '녹음 중지에 실패했습니다.');
    }
  };

  const handleRecordingPress = () => {
    if (isRecording) {
      handleRecordingStop();
    } else {
      handleRecordingStart();
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={[styles.title, typography.title]}>{userName}의 홈</Text>
          
          {/* <RecordButton 
            isRecording={isRecording} 
            onPress={handleRecordingPress}
          /> */}

          <View style={styles.contentContainer}>
            <StatusCard />

            <View style={styles.illustrationContainer}>
              <Image 
                source={require('../assets/backgroundimg2.png')} 
                style={[styles.illustration, {transform: [{scale: 1.4}]}]}
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
  recordButton: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recordingActive: {
    backgroundColor: '#ffe0e0',
  },
  recordingText: {
    color: '#ff4444',
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
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
  illustrationContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 270,
  },
});

export default MainPage;