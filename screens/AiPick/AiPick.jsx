// 이거 키보드 안내려가는 문제 해결하기!!!!!!!!!!!!1
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { loginSuccess } from '../../redux/slices/authSlice';
// import { saveRoutine } from '../../redux/slices/routineSlice'; // 기존 import 제거
import { requestRecommendation } from '../../redux/slices/routineSlice'; // 새로운 import 추가
import { typography } from '../../styles/typography';

function AiPick({ navigation }) {
    const [situation, setSituation] = useState('');
    const dispatch = useDispatch();
    // const { loading: globalLoading, error } = useSelector((state) => state.routine); // 기존 selector 수정
    const { loading, error } = useSelector((state) => state.routine); // 새로운 selector
    const auth = useSelector((state) => state.auth);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await AsyncStorage.getItem('currentUser');
                if (currentUser) {
                    dispatch(loginSuccess(JSON.parse(currentUser)));
                }
            } catch (error) {
                console.error('Auth check error:', error);
            }
        };
        checkAuth();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setSituation('');
            // loading 상태도 초기화
            dispatch({ type: 'routine/setLoading', payload: false });
            // 에러 상태도 초기화
            dispatch({ type: 'routine/clearError' });

            
        }, [dispatch])
    );

    const handleSubmit = async () => {
        if (!situation.trim()) return;

        try {
            const response = await dispatch(requestRecommendation(situation));
            console.log('Got response:', response);

            if (response) {
                navigation.navigate('Recommendation', { situation });
            }
        } catch (error) {
            console.error('Error in submission:', error);
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>AI's Pick</Text>

                    <View style={styles.inputContainer}>
                        <Input 
                            label="상황 입력"
                            placeholder="상황을 입력해주세요"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="center"
                            value={situation}
                            onChangeText={setSituation}
                            editable={true}
                            autoFocus={false}  // 자동 포커스 방지
                            blurOnSubmit={true}  // 제출 시 블러 처리
                        />
                    </View>

                    {error && <Text style={styles.error}>{error}</Text>}

                    <View style={styles.buttonContainer}>
                        <Button 
                            onPress={handleSubmit}
                            disabled={!situation.trim() || loading || !auth.user}
                        >
                            확인
                        </Button>
                    </View>

                    <LoadingOverlay visible={loading} />
                </View>
            </SafeAreaView>
        </GradientBackground>
        </TouchableWithoutFeedback>
    );
}

export default AiPick;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 40,
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center', 
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        width: '90%',  
        alignSelf: 'center', 
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    userInfo: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#666',
    }
});