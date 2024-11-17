import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function Recommendation({ navigation, route }) {
    const { situation } = route.params;

    const handleConfirm = () => {
        // 확인 로직 구현
        navigation.navigate('AiPick');
    };

    const handleCancel = () => {
        navigation.navigate('AiPick');
    };

    const handleRecommend = () => {
        // 재추천 로직 구현
        // API 호출 등을 여기서 수행
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>추천 결과</Text>
                    
                    <View style={styles.contentContainer}>
                        <Text style={styles.situationText}>입력하신 상황: {situation}</Text>
                        {/* 여기에 추천 결과 표시 */}
                    </View>

                    <View style={styles.buttonGroupContainer}>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={styles.segmentedButton} 
                                onPress={handleConfirm}
                            >
                                <Text style={styles.buttonText}>수락</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.segmentedButton} 
                                onPress={handleCancel}
                            >
                                <Text style={styles.buttonText}>거절</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.segmentedButton} 
                                onPress={handleRecommend}
                            >
                                <Text style={styles.buttonText}>재추천</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

export default Recommendation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        marginTop: 100,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 40,
    },
    contentContainer: {
        paddingHorizontal: 20,
        flex: 1,
    },
    situationText: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttonGroupContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    segmentedButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginHorizontal: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    }
});