import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { toggleAppliancePower, updateAppliances } from '../../redux/slices/applianceSlice';
import { typography } from '../../styles/typography';

function ApplianceDetail({ route, navigation }) {
    const { appliance: initialAppliance } = route.params;
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.appliance);
    
    // 현재 기기의 최신 상태 가져오기
    const currentAppliance = useSelector(state => 
        state.appliance.appliances.find(a => a.id === initialAppliance.id)
    );

    const [isOn, setIsOn] = useState(currentAppliance?.onoff === 'on');

    useEffect(() => {
        navigation.setOptions({
            title: currentAppliance?.name || '기기 상세',
            headerShown: true,
            headerTransparent: true,
            headerTintColor: '#666666',
            headerTitleStyle: {
                ...typography.title,
                fontSize: 18,
            },
        });
    }, [navigation, currentAppliance]);

    // 전원 상태 토글
    const togglePower = () => {
        const newStatus = !isOn;
        setIsOn(newStatus);
        
        dispatch(toggleAppliancePower(currentAppliance.id, newStatus ? 'on' : 'off'));
    };

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

    // 기기별 상태 변경 함수
    const adjustState = (newState) => {
        dispatch(updateAppliances({
            updates: [{
                applianceId: currentAppliance.id,
                onoff: isOn ? 'on' : 'off',
                state: newState,
                isActive: true,
                userId: 6
            }]
        }));
    };

    // 온도 조절 함수
    const adjustTemperature = (amount) => {
        const currentTemp = parseInt(currentAppliance.state) || 24;
        const newTemp = currentTemp + amount;
        if (newTemp >= 18 && newTemp <= 30) {
            adjustState(`${newTemp}°C`);
        }
    };

    if (loading) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#5e5eb4" />
                        <Text style={styles.loadingText}>상태 변경 중...</Text>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.mainCard}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons 
                                name={getApplianceIcon(currentAppliance?.name)}
                                size={48} 
                                color={isOn ? '#4CAF50' : '#666666'}
                            />
                        </View>
                        <Text style={styles.deviceName}>
                            {currentAppliance?.name}
                        </Text>
                        <Text style={[styles.statusText, { color: isOn ? '#4CAF50' : '#666666' }]}>
                            {isOn ? '작동중' : '대기'}
                        </Text>
                        {isOn && currentAppliance?.state && (
                            <Text style={styles.stateText}>
                                {currentAppliance.state}
                            </Text>
                        )}
                    </View>

                    <View style={styles.controlsContainer}>
                        <TouchableOpacity 
                            style={[styles.controlButton, styles.powerButton]} 
                            onPress={togglePower}
                        >
                            <MaterialCommunityIcons 
                                name="power" 
                                size={32} 
                                color={isOn ? '#4CAF50' : '#666666'}
                            />
                        </TouchableOpacity>

                        {isOn && (
                            <View style={styles.stateControls}>
                                {currentAppliance?.name === '에어컨' && (
                                    <>
                                        <TouchableOpacity 
                                            style={styles.controlButton}
                                            onPress={() => adjustTemperature(-1)}
                                        >
                                            <MaterialCommunityIcons 
                                                name="minus" 
                                                size={32} 
                                                color="#666666" 
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.controlButton}
                                            onPress={() => adjustTemperature(1)}
                                        >
                                            <MaterialCommunityIcons 
                                                name="plus" 
                                                size={32} 
                                                color="#666666" 
                                            />
                                        </TouchableOpacity>
                                    </>
                                )}
                                
                                {currentAppliance?.name === 'TV' && (
                                    <View style={styles.modeContainer}>
                                        <TouchableOpacity 
                                            style={[styles.controlButton, styles.modeButton]}
                                            onPress={() => adjustState('영화 모드')}
                                        >
                                            <Text style={styles.modeButtonText}>영화</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.controlButton, styles.modeButton]}
                                            onPress={() => adjustState('스포츠 모드')}
                                        >
                                            <Text style={styles.modeButtonText}>스포츠</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    deviceName: {
        fontSize: 24,
        color: '#333333',
        marginTop: 15,
        marginBottom: 10,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 18,
        marginBottom: 10,
    },
    stateText: {
        fontSize: 16,
        color: '#666666',
    },
    controlsContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    controlButton: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    powerButton: {
        marginBottom: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    stateControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    modeButton: {
        width: 100,
        height: 50,
        borderRadius: 25,
    },
    modeButtonText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
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
});

export default ApplianceDetail;