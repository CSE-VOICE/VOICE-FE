// // // MyPageInfo.jsx
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from 'react';
// import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { typography } from '../../styles/typography';

// function MyPageInfo({ navigation }) {
//     const [userInfo, setUserInfo] = useState({
//         name: '',
//         email: '',
//         phone: '',
//     });

//     useEffect(() => {
//         loadUserInfo();
//     }, []);

//     const loadUserInfo = async () => {
//         try {
//             const userString = await AsyncStorage.getItem('currentUser');
//             if (userString) {
//                 const user = JSON.parse(userString);
//                 setUserInfo({
//                     name: user.name || '',
//                     email: user.email || '',
//                     phone: user.phone || '',
//                 });
//             }
//         } catch (error) {
//             console.error('Error loading user info:', error);
//             Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
//         }
//     };

//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <Text style={[styles.title, typography.title]}>개인 정보</Text>
//                     <View style={styles.contentContainer}>
//                         <View style={styles.card}>
//                             <View style={styles.infoSection}>
//                                 <Text style={styles.label}>이름</Text>
//                                 <Text style={styles.infoText}>{userInfo.name}</Text>
//                             </View>
//                             <View style={styles.infoSection}>
//                                 <Text style={styles.label}>이메일</Text>
//                                 <Text style={styles.infoText}>{userInfo.email}</Text>
//                             </View>
//                             <View style={styles.infoSection}>
//                                 <Text style={styles.label}>전화번호</Text>
//                                 <Text style={styles.infoText}>{userInfo.phone}</Text>
//                             </View>

//                             <TouchableOpacity 
//                                 style={styles.changePasswordButton}
//                                 onPress={() => navigation.navigate('ChangePassword')}
//                             >
//                                 <Text style={styles.changePasswordButtonText}>
//                                     비밀번호 변경
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

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
//     },
//     infoSection: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 14,
//         color: '#666666',
//         marginBottom: 8,
//     },
//     infoText: {
//         fontSize: 16,
//         color: '#333333',
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#E0E0E0',
//     },
//     changePasswordButton: {
//         backgroundColor: '#5e5eb4',
//         borderRadius: 8,
//         padding: 12,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     changePasswordButtonText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600',
//     },
// });

// export default MyPageInfo;

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function MyPageInfo({ navigation }) {
    const { user } = useSelector((state) => state.auth);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>개인 정보</Text>
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <View style={styles.infoSection}>
                                <Text style={styles.label}>이름</Text>
                                <Text style={styles.infoText}>{user?.name || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoSection}>
                                <Text style={styles.label}>이메일</Text>
                                <Text style={styles.infoText}>{user?.email || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoSection}>
                                <Text style={styles.label}>전화번호</Text>
                                <Text style={styles.infoText}>{user?.phone || 'N/A'}</Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.changePasswordButton}
                                onPress={() => navigation.navigate('ChangePassword')}
                            >
                                <Text style={styles.changePasswordButtonText}>비밀번호 변경</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

export default MyPageInfo;

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { textAlign: 'center', marginTop: 60, marginBottom: 20 },
    contentContainer: { flex: 1, paddingHorizontal: 20 },
    card: { backgroundColor: 'white', borderRadius: 15, padding: 20, shadowColor: '#000' },
    infoSection: { marginBottom: 20 },
    label: { fontSize: 14, color: '#666666', marginBottom: 8 },
    infoText: { fontSize: 16, color: '#333333', paddingVertical: 8 },
    changePasswordButton: { backgroundColor: '#5e5eb4', borderRadius: 8, padding: 12 },
    changePasswordButtonText: { color: 'white', fontSize: 14 },
});
