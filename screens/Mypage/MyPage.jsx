// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { typography } from '../../styles/typography';

// const windowWidth = Dimensions.get('window').width;

// function MyPage({ navigation }) {
//     const userEmail = 'useremail@naver.com';
//     const userName = 'OO님';

//     // MyPage.jsx
// const handleLogout = () => {
//     Alert.alert(
//         '로그아웃',
//         '정말 로그아웃 하시겠습니까?',
//         [
//             {
//                 text: '취소',
//                 style: 'cancel',
//             },
//             {
//                 text: '확인',
//                 onPress: async () => {
//                     try {
//                         // 모든 인증 관련 데이터 제거
//                         await AsyncStorage.removeItem('userToken');
//                         await AsyncStorage.removeItem('currentUser');
                        
//                         // Auth 스택으로 리셋
//                         navigation.reset({
//                             index: 0,
//                             routes: [{ name: 'Auth' }],
//                         });
//                     } catch (error) {
//                         Alert.alert('오류 발생', '로그아웃 중 문제가 발생했습니다.');
//                     }
//                 },
//                 style: 'destructive',
//             },
//         ],
//         { cancelable: false }
//     );
// };
    
//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <View style={styles.profileContainer}>
//                         <MaterialIcons name="account-circle" size={60} color="#666666" />
//                         <Text style={[styles.userName, typography.title]}>{userName}</Text>
//                         <Text style={styles.userEmail}>{userEmail}</Text>
//                     </View>

//                     <View style={styles.menuContainer}>
//                         <View style={styles.menuRow}>
//                             <TouchableOpacity 
//                                 style={styles.menuCard}
//                                 onPress={() => navigation.navigate('MyPageInfo')}
//                             >
//                                 <MaterialIcons name="person" size={24} color="#666666" />
//                                 <Text style={styles.menuText}>개인 정보</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity 
//                                 style={styles.menuCard}
//                                 onPress={() => navigation.navigate('MyPageRoutine')}
//                             >
//                                 <MaterialCommunityIcons name="clock-time-four" size={24} color="#666666" />
//                                 <Text style={styles.menuText}>루틴 모음</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.menuRow}>
//                             <TouchableOpacity 
//                                 style={styles.menuCard}
//                                 onPress={() => navigation.navigate('MyPageAI')}
//                             >
//                                 <MaterialCommunityIcons name="robot" size={24} color="#666666" />
//                                 <Text style={styles.menuText}>AI 스피커</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity 
//                                 style={styles.menuCard}
//                                 onPress={handleLogout}
//                             >
//                                 <MaterialIcons name="settings" size={24} color="#666666" />
//                                 <Text style={styles.menuText}>로그아웃</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// export default MyPage;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     profileContainer: {
//         alignItems: 'center',
//         marginTop: 60,
//         marginBottom: 40,
//     },
//     userName: {
//         fontSize: 24,
//         color: '#333333',
//         marginTop: 10,
//     },
//     userEmail: {
//         fontSize: 16,
//         color: '#666666',
//         marginTop: 5,
//     },
//     menuContainer: {
//         paddingHorizontal: 20,
//     },
//     menuRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     menuCard: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         padding: 20,
//         width: (windowWidth - 60) / 2,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     menuText: {
//         fontSize: 16,
//         color: '#666666',
//         marginTop: 10,
//     },
// });


// MyPage.jsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function MyPage({ navigation }) {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userString = await AsyncStorage.getItem('currentUser');
                if (userString) {
                    const user = JSON.parse(userString);
                    setUserEmail(user.email);
                    
                    if (user.name) {
                        const nameWithoutFirst = user.name.slice(1) || 'OO';
                        setUserName(`${nameWithoutFirst}님`);
                    } else {
                        setUserName('OO님');
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            '로그아웃',
            '정말 로그아웃 하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '확인',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userToken');
                            await AsyncStorage.removeItem('currentUser');
                            
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                            });
                        } catch (error) {
                            Alert.alert('오류 발생', '로그아웃 중 문제가 발생했습니다.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };
    
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <MaterialIcons name="account-circle" size={60} color="#666666" />
                        <Text style={[styles.userName, typography.title]}>{userName}</Text>
                        <Text style={styles.userEmail}>{userEmail}</Text>
                    </View>

                    <View style={styles.menuContainer}>
                        <View style={styles.menuRow}>
                            <TouchableOpacity 
                                style={styles.menuCard}
                                onPress={() => navigation.navigate('MyPageInfo')}
                            >
                                <MaterialIcons name="person" size={24} color="#666666" />
                                <Text style={styles.menuText}>개인 정보</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.menuCard}
                                onPress={() => navigation.navigate('MyPageRoutine')}
                            >
                                <MaterialCommunityIcons name="clock-time-four" size={24} color="#666666" />
                                <Text style={styles.menuText}>루틴 모음</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuRow}>
                            <TouchableOpacity 
                                style={styles.menuCard}
                                onPress={() => navigation.navigate('MyPageAI')}
                            >
                                <MaterialCommunityIcons name="robot" size={24} color="#666666" />
                                <Text style={styles.menuText}>AI 스피커</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.menuCard}
                                onPress={handleLogout}
                            >
                                <MaterialIcons name="settings" size={24} color="#666666" />
                                <Text style={styles.menuText}>로그아웃</Text>
                            </TouchableOpacity>
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
    profileContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    userName: {
        fontSize: 24,
        color: '#333333',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    menuCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: (windowWidth - 60) / 2,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 10,
    },
});

export default MyPage;