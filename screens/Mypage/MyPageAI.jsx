// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { typography } from '../../styles/typography';

// function MyPageAI() {
//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <Text style={[styles.title, typography.title]}>AI 스피커</Text>
//                     <View style={styles.contentContainer}>
//                         <View style={styles.card}>
//                             <TouchableOpacity style={styles.speakerButton}>
//                                 <Text style={styles.buttonTitle}>AI 스피커 찾기</Text>
//                                 <Text style={styles.buttonDesc}>스피커를 검색중입니다...</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.wifiButton}>
//                                 <View style={styles.wifiContent}>
//                                     <MaterialCommunityIcons name="wifi" size={24} color="#333" />
//                                     <Text style={styles.wifiText}>Wi-Fi 연결</Text>
//                                 </View>
//                                 <TouchableOpacity style={styles.connectButton}>
//                                     <Text style={styles.connectText}>연결하기</Text>
//                                 </TouchableOpacity>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// export default MyPageAI;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     title: {
//         textAlign: 'center',
//         marginTop: 60,
//         marginBottom: 20,
//     },
//     contentContainer: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },
//     card: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         gap: 15,
//     },
//     speakerButton: {
//         backgroundColor: '#0F172A',
//         padding: 15,
//         borderRadius: 8,
//     },
//     buttonTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: 'white',
//         marginBottom: 5,
//     },
//     buttonDesc: {
//         fontSize: 14,
//         color: '#E0E0E0',
//     },
//     wifiButton: {
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//         borderRadius: 8,
//         padding: 15,
//     },
//     wifiContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 10,
//     },
//     wifiText: {
//         fontSize: 16,
//         color: '#333',
//     },
//     connectButton: {
//         backgroundColor: '#E8E8E8',
//         padding: 8,
//         borderRadius: 4,
//         alignSelf: 'flex-start',
//     },
//     connectText: {
//         fontSize: 14,
//         color: '#333',
//     },
// });
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { clearSpeakerState, connectSpeaker, searchSpeaker } from '../../redux/slices/speakerSlice';
import { typography } from '../../styles/typography';

function MyPageAI() {
  const dispatch = useDispatch();
  const { speaker, loading, error } = useSelector((state) => state.speaker);

  useEffect(() => {
    // 초기 상태 정리
    dispatch(clearSpeakerState());
  }, [dispatch]);

  const handleSearchSpeaker = () => {
    dispatch(searchSpeaker());
  };

  const handleConnectSpeaker = () => {
    if (!speaker) {
      Alert.alert('스피커가 없습니다.', '먼저 스피커를 검색해주세요.');
      return;
    }
    dispatch(connectSpeaker({ speakerId: speaker.id }));
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={[styles.title, typography.title]}>AI 스피커</Text>
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.speakerButton}
                onPress={handleSearchSpeaker}
                disabled={loading}
              >
                <Text style={styles.buttonTitle}>
                  {loading ? '스피커를 검색 중...' : 'AI 스피커 찾기'}
                </Text>
                <Text style={styles.buttonDesc}>
                  {speaker ? `스피커: ${speaker.name}` : '스피커를 검색하세요.'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.wifiButton}
                onPress={handleConnectSpeaker}
                disabled={loading || !speaker}
              >
                <View style={styles.wifiContent}>
                  <MaterialCommunityIcons name="wifi" size={24} color="#333" />
                  <Text style={styles.wifiText}>
                    {loading ? '연결 중...' : 'Wi-Fi 연결'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.connectButton}>
                  <Text style={styles.connectText}>연결하기</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

export default MyPageAI;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'center', marginTop: 60, marginBottom: 20 },
  contentContainer: { flex: 1, paddingHorizontal: 20 },
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
  speakerButton: { backgroundColor: '#0F172A', padding: 15, borderRadius: 8 },
  buttonTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  buttonDesc: { fontSize: 14, color: '#E0E0E0' },
  wifiButton: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 15 },
  wifiContent: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  wifiText: { fontSize: 16, color: '#333' },
  connectButton: { backgroundColor: '#E8E8E8', padding: 8, borderRadius: 4, alignSelf: 'flex-start' },
  connectText: { fontSize: 14, color: '#333' },
  errorText: { color: 'red', marginTop: 10 },
});
