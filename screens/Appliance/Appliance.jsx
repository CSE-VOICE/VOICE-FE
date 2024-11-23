import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { loadAppliances } from '../../redux/slices/applianceSlice';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function Appliance({ navigation }) {
    const dispatch = useDispatch();
    const { appliances, loading, error } = useSelector(state => state.appliance);

    useEffect(() => {
        dispatch(loadAppliances());
    }, [dispatch]);
    
    useFocusEffect(
        useCallback(() => {
            dispatch(loadAppliances());
        }, [dispatch])
    );

    const handleAddAppliance = () => {
        console.log("추후 기기 추가 기능이 구현될 예정입니다.");
    };

    if (loading) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#5e5eb4" />
                        <Text style={styles.loadingText}>기기를 불러오는 중...</Text>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    if (error) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    const getApplianceIcon = (name) => {
        switch (name.toLowerCase()) {
            case '에어컨': return 'air-conditioner';
            case '공기청정기': return 'air-purifier';
            case '로봇청소기': return 'robot-vacuum';
            case 'tv': return 'television';
            case '조명': return 'lamp';
            case '정수기': return 'water-pump';
            case '세탁기': return 'washing-machine';
            case '건조기': return 'tumble-dryer';
            case '식기세척기': return 'dishwasher';
            case '스타일러': return 'hanger';
            default: return 'power';
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>가전기기 관리</Text>
                    
                    <View style={styles.contentContainer}>
                        <View style={styles.addCard}>
                            <Text style={styles.addCardText}>
                                기기를 추가해서 나만의 스마트홈을 만들어 보세요.
                            </Text>
                            <TouchableOpacity 
                                style={styles.addButton}
                                onPress={handleAddAppliance}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="cpu-64-bit" size={24} color="#666666" />
                                    <Text style={styles.buttonText}>기기 추가</Text>
                                    <AntDesign name="plus" size={24} color="#666666" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            style={styles.applianceList}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.gridContainer}>
                                {appliances.map((appliance) => (
                                    <TouchableOpacity 
                                        key={appliance.id} 
                                        style={styles.applianceCard}
                                        onPress={() => navigation.navigate('ApplianceDetail', { appliance })}
                                    >
                                        <View style={styles.imageContainer}>
                                            <MaterialCommunityIcons 
                                                name={getApplianceIcon(appliance.name)}
                                                size={32} 
                                                color={appliance.onoff === 'on' ? '#4CAF50' : '#666666'}
                                            />
                                        </View>
                                        <Text style={styles.applianceName}>{appliance.name}</Text>
                                        <View style={styles.statusContainer}>
                                            <MaterialCommunityIcons 
                                                name="power" 
                                                size={18} 
                                                color={appliance.onoff === 'on' ? '#4CAF50' : '#666666'}
                                            />
                                            <Text style={[
                                                styles.applianceStatus,
                                                {color: appliance.onoff === 'on' ? '#4CAF50' : '#666666'}
                                            ]}>
                                                {appliance.state}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
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
    addCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addCardText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 15,
        textAlign: 'center',
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 15,
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#666666',
    },
    applianceList: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    applianceCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        width: (windowWidth - 60) / 2,
        height: 120,
        marginBottom: 10,
        justifyContent: 'center',
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
    imageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    applianceName: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
        marginVertical: 4,
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    applianceStatus: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        textAlign: 'center',
    },
});

export default Appliance;