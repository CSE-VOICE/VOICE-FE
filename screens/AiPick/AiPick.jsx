import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { typography } from '../../styles/typography';

function AiPick({ navigation }) {
    const [situation, setSituation] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setSituation('');
        }, [])
    );

    const handleSubmit = async () => {
        if (!situation.trim()) return;
        
        setLoading(true);
        try {
            // API 호출 또는 다음 단계로 진행하는 로직
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('제출된 상황:', situation);
            navigation.navigate('Recommendation', { situation });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button 
                            onPress={handleSubmit}
                            disabled={!situation.trim() || loading}
                        >
                            확인
                        </Button>
                    </View>

                    <LoadingOverlay visible={loading} />
                </View>
            </SafeAreaView>
        </GradientBackground>
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
    }
});


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback, useEffect, useState } from 'react';
// import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { LoadingOverlay } from '../../components/ui/loading-overlay';
// import { typography } from '../../styles/typography';

// function AiPick({ navigation }) {
//     const [situation, setSituation] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [userInfo, setUserInfo] = useState({
//         name: '',
//         email: '',
//         authProvider: 'local'
//     });

//     useEffect(() => {
//         const loadUserData = async () => {
//             try {
//                 const userString = await AsyncStorage.getItem('currentUser');
//                 if (userString) {
//                     const user = JSON.parse(userString);
//                     setUserInfo({
//                         name: user.name || '',
//                         email: user.email || '',
//                         authProvider: user.authProvider || 'local'
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error loading user data:', error);
//             }
//         };

//         loadUserData();
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             setSituation('');
//         }, [])
//     );

//     const handleSubmit = async () => {
//         if (!situation.trim()) return;
        
//         setLoading(true);
//         try {
//             // API 호출 데이터 준비
//             const requestData = {
//                 situation,
//                 userId: userInfo.email,
//                 authProvider: userInfo.authProvider,
//                 userName: userInfo.name
//             };

//             // API 호출 시뮬레이션
//             await new Promise(resolve => setTimeout(resolve, 2000));
//             console.log('제출된 데이터:', requestData);
            
//             navigation.navigate('Recommendation', { 
//                 situation,
//                 userInfo
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             Alert.alert('오류 발생', '다시 시도해주세요.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <View style={styles.header}>
//                         <Text style={[styles.title, typography.title]}>AI's Pick</Text>
//                         {userInfo.authProvider !== 'local' && (
//                             <View style={styles.providerBadge}>
//                                 <Text style={styles.providerText}>
//                                     {userInfo.authProvider} 계정
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
                    
//                     <View style={styles.inputContainer}>
//                         <Input 
//                             label="상황 입력"
//                             placeholder="상황을 입력해주세요"
//                             multiline
//                             numberOfLines={4}
//                             textAlignVertical="center"
//                             value={situation}
//                             onChangeText={setSituation}
//                             editable={!loading}
//                         />
//                     </View>

//                     <View style={styles.buttonContainer}>
//                         <Button 
//                             onPress={handleSubmit}
//                             disabled={!situation.trim() || loading}
//                         >
//                             확인
//                         </Button>
//                     </View>

//                     <LoadingOverlay visible={loading} />
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     header: {
//         alignItems: 'center',
//         marginTop: 100,
//         marginBottom: 40,
//     },
//     title: {
//         textAlign: 'center',
//     },
//     providerBadge: {
//         backgroundColor: '#e3e3e3',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         marginTop: 8,
//     },
//     providerText: {
//         fontSize: 12,
//         color: '#666666',
//     },
//     inputContainer: {
//         paddingHorizontal: 20,
//         marginTop: 20,
//         width: '90%',
//         alignSelf: 'center', 
//     },
//     buttonContainer: {
//         paddingHorizontal: 20,
//         marginTop: 20,
//         width: '90%',  
//         alignSelf: 'center', 
//     }
// });

// export default AiPick;