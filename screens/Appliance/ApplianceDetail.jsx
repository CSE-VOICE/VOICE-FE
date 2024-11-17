import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function ApplianceDetail({ route, navigation }) {
    const { appliance } = route.params;
    const [isOn, setIsOn] = useState(appliance.status === 'on');
    const [temperature, setTemperature] = useState(23); // 초기 온도값

    useEffect(() => {
        navigation.setOptions({
            title: appliance.name,
            headerShown: true,
            headerTransparent: true,
            headerTintColor: '#666666',
            headerTitleStyle: {
                ...typography.title,
                fontSize: 18,
            },
        });
    }, [navigation, appliance.name]);

    const togglePower = () => {
        setIsOn(!isOn);
    };

    const adjustTemperature = (amount) => {
        setTemperature(prev => prev + amount);
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.mainCard}>
                        <MaterialCommunityIcons 
                            name="air-conditioner" 
                            size={48} 
                            color={isOn ? '#4CAF50' : '#666666'}
                        />
                        <Text style={styles.deviceName}>{appliance.name}</Text>
                        <Text style={[styles.statusText, { color: isOn ? '#4CAF50' : '#666666' }]}>
                            {isOn ? '작동중' : '꺼짐'}
                        </Text>
                        {isOn && (
                            <Text style={styles.temperatureText}>
                                온도: {temperature}도
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
                            <View style={styles.temperatureControls}>
                                <TouchableOpacity 
                                    style={styles.controlButton}
                                    onPress={() => adjustTemperature(-1)}
                                >
                                    <MaterialCommunityIcons name="minus" size={32} color="#666666" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.controlButton}
                                    onPress={() => adjustTemperature(1)}
                                >
                                    <MaterialCommunityIcons name="plus" size={32} color="#666666" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

export default ApplianceDetail;

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
    temperatureText: {
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
    },
    temperatureControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});