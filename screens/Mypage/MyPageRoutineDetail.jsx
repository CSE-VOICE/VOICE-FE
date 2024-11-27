import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { deleteRoutine, executeRoutine, fetchRoutineDetail } from '../../redux/slices/routineSlice';
import { typography } from '../../styles/typography';

function MyPageRoutineDetail({ route, navigation }) {
    const dispatch = useDispatch();
    const { currentRoutine, loading } = useSelector((state) => state.routine);
    const [isExecuting, setIsExecuting] = useState(false);

    const routineId = route.params?.routineId;

    useEffect(() => {
        if (routineId) {
            dispatch(fetchRoutineDetail(routineId));
        }
    }, [dispatch, routineId]);
    
    // MyPageRoutineDetail.jsx의 실행 처리 부분 수정
const handleExecute = async () => {
    if (isExecuting) return;
  
    setIsExecuting(true);
    try {
      const result = await dispatch(executeRoutine(routineId));
      if (result && result.success) {
        // 실행 성공 시 기기 상태도 함께 업데이트
        await dispatch(loadAppliances()); // applianceSlice의 액션
        
        Alert.alert('성공', '루틴이 성공적으로 실행되었습니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('ApplianceMain')
          }
        ]);
      }
    } catch (error) {
      Alert.alert('오류', '루틴 실행에 실패했습니다.');
    } finally {
      setIsExecuting(false);
    }
  };

    const handleDelete = () => {
        Alert.alert(
            '루틴 삭제',
            '정말로 이 루틴을 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await dispatch(deleteRoutine(routineId));
                            if (result) {
                                Alert.alert('성공', '루틴이 성공적으로 삭제되었습니다.', [
                                    {
                                        text: '확인',
                                        onPress: () => navigation.goBack()
                                    }
                                ]);
                            }
                        } catch (error) {
                            Alert.alert('오류', '루틴 삭제에 실패했습니다.');
                        }
                    }
                }
            ]
        );
    };

    if (loading || !currentRoutine) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.loadingText}>로딩 중...</Text>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>루틴 상세</Text>
                    
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <View style={styles.section}>
                                <Text style={styles.label}>상황</Text>
                                <Text style={styles.content}>{currentRoutine.situation_txt}</Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>루틴 설명</Text>
                                <Text style={styles.content}>{currentRoutine.routine_txt}</Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>기기 변동사항</Text>
                                {currentRoutine.app_updates.map((update, index) => (
                                    <Text key={index} style={styles.deviceUpdate}>
                                        {update.name}: {update.state} ({update.onoff})
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.executeButton]}
                                    onPress={handleExecute}
                                    disabled={isExecuting}
                                >
                                    <MaterialIcons name="play-arrow" size={24} color="white" />
                                    <Text style={styles.buttonText}>실행</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={handleDelete}
                                >
                                    <MaterialIcons name="delete" size={24} color="white" />
                                    <Text style={styles.buttonText}>삭제</Text>
                                </TouchableOpacity>
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
        flex: 1,
    },
    title: {
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    content: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    deviceUpdate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    executeButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    backButton: {
        backgroundColor: '#5e5eb4',
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 16,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 100,
        fontSize: 16,
        color: '#666',
    },
});

export default MyPageRoutineDetail;