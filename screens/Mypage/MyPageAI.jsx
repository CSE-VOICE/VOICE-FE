import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function MyPageAI() {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>AI 스피커</Text>
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.speakerButton}>
                                <Text style={styles.buttonTitle}>AI 스피커 찾기</Text>
                                <Text style={styles.buttonDesc}>스피커를 검색중입니다...</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.wifiButton}>
                                <View style={styles.wifiContent}>
                                    <MaterialCommunityIcons name="wifi" size={24} color="#333" />
                                    <Text style={styles.wifiText}>Wi-Fi 연결</Text>
                                </View>
                                <TouchableOpacity style={styles.connectButton}>
                                    <Text style={styles.connectText}>연결하기</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

export default MyPageAI;

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
        gap: 15,
    },
    speakerButton: {
        backgroundColor: '#0F172A',
        padding: 15,
        borderRadius: 8,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    buttonDesc: {
        fontSize: 14,
        color: '#E0E0E0',
    },
    wifiButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
    },
    wifiContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    wifiText: {
        fontSize: 16,
        color: '#333',
    },
    connectButton: {
        backgroundColor: '#E8E8E8',
        padding: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    connectText: {
        fontSize: 14,
        color: '#333',
    },
});