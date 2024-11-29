import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { clearSpeakerState, connectSpeaker, initializeNugu } from '../../redux/slices/speakerSlice';
import { typography } from '../../styles/typography';

function MyPageAI() {
  const dispatch = useDispatch();
  const { speaker, loading, error } = useSelector((state) => state.speaker);

  useEffect(() => {
    // NUGU SDK 초기화만 하고 스피커 연결은 하지 않음
    dispatch(initializeNugu())
      .unwrap()
      .catch((error) => {
        Alert.alert('초기화 실패', error);
      });

    return () => {
      dispatch(clearSpeakerState());
    };
  }, [dispatch]);

  const handleConnectSpeaker = async () => {
    try {
      await dispatch(connectSpeaker()).unwrap();
      Alert.alert('연결 성공', '스피커가 성공적으로 연결되었습니다.');
    } catch (error) {
      Alert.alert('연결 실패', '스피커 연결에 실패했습니다.');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={[styles.title, typography.title]}>AI 스피커</Text>
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <View style={styles.speakerInfo}>
                <Text style={styles.speakerTitle}>등록된 스피커</Text>
                <Text style={styles.speakerName}>{speaker.name}</Text>
                <Text style={[
                  styles.speakerStatus, 
                  speaker.connected ? styles.statusConnected : styles.statusDisconnected
                ]}>
                  {speaker.connected ? '연결됨' : '연결 안됨'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.connectButton, 
                  loading && styles.buttonDisabled,
                  speaker.connected && styles.buttonConnected
                ]}
                onPress={handleConnectSpeaker}
                disabled={loading || speaker.connected}
              >
                <MaterialCommunityIcons 
                  name="wifi" 
                  size={24} 
                  color={speaker.connected ? "#4CAF50" : "white"} 
                />
                <Text style={[
                  styles.connectText, 
                  speaker.connected && styles.connectedText
                ]}>
                  {loading ? '연결 중...' : speaker.connected ? '연결됨' : '스피커 연결하기'}
                </Text>
              </TouchableOpacity>

              {error && (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={20} color="#DC3545" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="information" size={20} color="#666" />
                <Text style={styles.infoText}>
                  스피커가 연결되면 "아리야~" 명령어로 호출할 수 있습니다.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  title: { 
    textAlign: 'center', 
    marginTop: 60, 
    marginBottom: 20 
  },
  contentContainer: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speakerInfo: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  speakerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  speakerStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusConnected: {
    color: '#4CAF50',
  },
  statusDisconnected: {
    color: '#666',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonConnected: {
    backgroundColor: '#E8F5E9',
  },
  connectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  connectedText: {
    color: '#4CAF50',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3F3',
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: '#DC3545',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 6,
  },
  infoText: {
    color: '#666',
    flex: 1,
    fontSize: 14,
  },
});

export default MyPageAI;