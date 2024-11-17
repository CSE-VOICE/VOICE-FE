import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function MyPageRoutine() {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>루틴 모음</Text>
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <Text style={styles.label}>상황 검색</Text>
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="상황을 검색하시오."
                                    placeholderTextColor="#999"
                                />
                                <MaterialIcons 
                                    name="search" 
                                    size={20} 
                                    color="#666666" 
                                    style={styles.searchIcon}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

export default MyPageRoutine;

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
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    searchContainer: {
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        paddingRight: 40, // 아이콘을 위한 여백
        fontSize: 16,
        color: '#333',
        backgroundColor: 'white',
    },
    searchIcon: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -10 }], // 아이콘 크기의 절반
        color: '#5e5eb4',
    },
});