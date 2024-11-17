import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function ChangePassword({ navigation }) {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChangePassword = async () => {
        try {
            if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
                Alert.alert('오류', '모든 필드를 입력해주세요.');
                return;
            }

            // 새 비밀번호 확인
            if (passwords.newPassword !== passwords.confirmPassword) {
                Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
                return;
            }

            // 현재 로그인한 사용자 정보 가져오기
            const currentUserString = await AsyncStorage.getItem('currentUser');
            const currentUser = JSON.parse(currentUserString);

            // 모든 사용자 정보 가져오기
            const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (userIndex === -1) {
                Alert.alert('오류', '사용자를 찾을 수 없습니다.');
                return;
            }

            if (users[userIndex].password !== passwords.currentPassword) {
                Alert.alert('오류', '현재 비밀번호가 일치하지 않습니다.');
                return;
            }

            // 비밀번호 업데이트
            users[userIndex].password = passwords.newPassword;
            await AsyncStorage.setItem('users', JSON.stringify(users));
            
            // 현재 사용자 정보도 업데이트
            currentUser.password = passwords.newPassword;
            await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));

            Alert.alert('성공', '비밀번호가 변경되었습니다.', [
                {
                    text: '확인',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('오류', '비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>비밀번호 변경</Text>
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>현재 비밀번호</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwords.currentPassword}
                                    onChangeText={(text) => setPasswords({...passwords, currentPassword: text})}
                                    placeholder="현재 비밀번호 입력"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>새 비밀번호</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwords.newPassword}
                                    onChangeText={(text) => setPasswords({...passwords, newPassword: text})}
                                    placeholder="새 비밀번호 입력"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>새 비밀번호 확인</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwords.confirmPassword}
                                    onChangeText={(text) => setPasswords({...passwords, confirmPassword: text})}
                                    placeholder="새 비밀번호 다시 입력"
                                />
                            </View>

                            <TouchableOpacity 
                                style={styles.confirmButton}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.confirmButtonText}>비밀번호 변경</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: '#5e5eb4',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoSection: {
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#333333',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    changePasswordButton: {
        backgroundColor: '#5e5eb4',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    changePasswordButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ChangePassword;