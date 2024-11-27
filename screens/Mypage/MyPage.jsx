import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { loadUser, logout } from '../../redux/slices/authSlice';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function MyPage({ navigation }) {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const handleLogout = () => {
        Alert.alert(
            '로그아웃',
            '정말 로그아웃 하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    if (loading) {
        return <Text>로딩 중...</Text>;
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <MaterialIcons name="account-circle" size={60} color="#666666" />
                        <Text style={[styles.userName, typography.title]}>{user?.name || 'OO님'}</Text>
                        <Text style={styles.userEmail}>{user?.email || ''}</Text>
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