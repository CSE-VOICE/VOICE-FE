// import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from 'react';
// import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { typography } from '../../styles/typography';

// const STORAGE_KEY = '@appliances';
// const windowWidth = Dimensions.get('window').width;

// function Appliance( {navigation} ) {
//     const [appliances, setAppliances] = useState([]);

//     const loadAppliances = async () => {
//         try {
//             console.log('Loading appliances...');
//             const storedAppliances = await AsyncStorage.getItem(STORAGE_KEY);
//             console.log('Stored appliances:', storedAppliances);
//             if (storedAppliances !== null) {
//                 setAppliances(JSON.parse(storedAppliances));
//             }
//         } catch (error) {
//             console.error('Error loading appliances:', error);
//             Alert.alert('오류', '기기 목록을 불러오는데 실패했습니다.');
//         }
//     };

//     const saveAppliances = async (newAppliances) => {
//         try {
//             await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppliances));
//             setAppliances(newAppliances);
//         } catch (error) {
//             console.error('Error saving appliances:', error);
//             Alert.alert('오류', '기기 정보 저장에 실패했습니다.');
//         }
//     };

//     useEffect(() => {
//         loadAppliances();
//     }, []);

//     const handleAddAppliance = async () => {
//         console.log('Adding new appliance...');
//         const newAppliance = {
//             id: Date.now().toString(),
//             name: `기기 ${appliances.length + 1}`,
//             type: 'default',
//             status: 'off'
//         };
//         console.log('New appliance:', newAppliance);

//         const newAppliances = [...appliances, newAppliance];
//         await saveAppliances(newAppliances);
//         console.log('Appliances after adding:', newAppliances);
//     };

//     const handleDeleteAppliance = async (id) => {
//         Alert.alert(
//             '기기 삭제',
//             '정말 이 기기를 삭제하시겠습니까?',
//             [
//                 {
//                     text: '취소',
//                     style: 'cancel'
//                 },
//                 {
//                     text: '삭제',
//                     style: 'destructive',
//                     onPress: async () => {
//                         const newAppliances = appliances.filter(appliance => appliance.id !== id);
//                         saveAppliances(newAppliances);
//                     }
//                 }
//             ]
//         );
//     };

//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <Text style={[styles.title, typography.title]}>가전기기 관리</Text>
                    
//                     <View style={styles.contentContainer}>
//                         <View style={styles.addCard}>
//                             <Text style={styles.addCardText}>
//                                 기기를 추가해서 나만의 스마트홈을 만들어 보세요.
//                             </Text>
//                             <TouchableOpacity 
//                                 style={styles.addButton}
//                                 onPress={handleAddAppliance}
//                             >
//                                 <View style={styles.buttonContent}>
//                                     <MaterialCommunityIcons name="cpu-64-bit" size={24} color="#666666" />
//                                     <Text style={styles.buttonText}>기기 추가</Text>
//                                     <AntDesign name="plus" size={24} color="#666666" />
//                                 </View>
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView 
//                             style={styles.applianceList}
//                             showsVerticalScrollIndicator={true}
//                             contentContainerStyle={styles.scrollContent}
//                         >
//                             <View style={styles.gridContainer}>
//                                 {appliances.map((appliance) => (
//                                     <TouchableOpacity 
//                                         key={appliance.id} 
//                                         style={styles.applianceCard}
//                                         onLongPress={() => handleDeleteAppliance(appliance.id)}
//                                         onPress={() => navigation.navigate('ApplianceDetail', { appliance })}
//                                     >
//                                         <MaterialCommunityIcons 
//                                             name="power" 
//                                             size={24} 
//                                             color={appliance.status === 'on' ? '#4CAF50' : '#666666'}
//                                         />
//                                         <Text style={styles.applianceName}>{appliance.name}</Text>
//                                         <Text style={[
//                                             styles.applianceStatus,
//                                             {color: appliance.status === 'on' ? '#4CAF50' : '#666666'}
//                                         ]}>
//                                             {appliance.status === 'on' ? '켜짐' : '꺼짐'}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// export default Appliance;

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
//     addCard: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         padding: 20,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     addCardText: {
//         fontSize: 16,
//         color: '#666666',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     addButton: {
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//         borderRadius: 10,
//         padding: 15,
//     },
//     buttonContent: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 10,
//     },
//     buttonText: {
//         fontSize: 16,
//         color: '#666666',
//         marginHorizontal: 10,
//     },
//     applianceList: {
//         flex: 1,
//     },
//     scrollContent: {
//         paddingBottom: 20,
//     },
//     gridContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     applianceCard: {
//         backgroundColor: 'white',
//         borderRadius: 15,
//         padding: 15,
//         width: (windowWidth - 60) / 2, // 양쪽 패딩 20씩, 카드 사이 간격 10
//         height: 120,
//         marginBottom: 10,
//         justifyContent: 'center',
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
//     applianceName: {
//         fontSize: 16,
//         color: '#333333',
//         textAlign: 'center',
//         marginVertical: 8,
//     },
//     applianceStatus: {
//         fontSize: 14,
//     },
// });


// Appliance.jsx
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function Appliance({ navigation }) {
    const [appliances, setAppliances] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const loadAppliances = async () => {
        try {
            const userString = await AsyncStorage.getItem('currentUser');
            if (userString) {
                const user = JSON.parse(userString);
                setCurrentUser(user);
                
                // 사용자별 가전기기 데이터 로드
                const userAppliances = await AsyncStorage.getItem(`appliances_${user.email}`);
                if (userAppliances !== null) {
                    setAppliances(JSON.parse(userAppliances));
                }
            }
        } catch (error) {
            console.error('Error loading appliances:', error);
            Alert.alert('오류', '기기 목록을 불러오는데 실패했습니다.');
        }
    };

    const saveAppliances = async (newAppliances) => {
        try {
            if (currentUser) {
                await AsyncStorage.setItem(`appliances_${currentUser.email}`, JSON.stringify(newAppliances));
                setAppliances(newAppliances);
            }
        } catch (error) {
            console.error('Error saving appliances:', error);
            Alert.alert('오류', '기기 정보 저장에 실패했습니다.');
        }
    };

    useEffect(() => {
        loadAppliances();
    }, []);

    const handleAddAppliance = async () => {
        console.log('Adding new appliance...');
        const newAppliance = {
            id: Date.now().toString(),
            name: `기기 ${appliances.length + 1}`,
            type: 'default',
            status: 'off'
        };
        console.log('New appliance:', newAppliance);

        const newAppliances = [...appliances, newAppliance];
        await saveAppliances(newAppliances);
        console.log('Appliances after adding:', newAppliances);
    };

    const handleDeleteAppliance = async (id) => {
        Alert.alert(
            '기기 삭제',
            '정말 이 기기를 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        const newAppliances = appliances.filter(appliance => appliance.id !== id);
                        await saveAppliances(newAppliances);
                    }
                }
            ]
        );
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
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <View style={styles.gridContainer}>
                                {appliances.map((appliance) => (
                                    <TouchableOpacity 
                                        key={appliance.id} 
                                        style={styles.applianceCard}
                                        onLongPress={() => handleDeleteAppliance(appliance.id)}
                                        onPress={() => navigation.navigate('ApplianceDetail', { appliance })}
                                    >
                                        <MaterialCommunityIcons 
                                            name="power" 
                                            size={24} 
                                            color={appliance.status === 'on' ? '#4CAF50' : '#666666'}
                                        />
                                        <Text style={styles.applianceName}>{appliance.name}</Text>
                                        <Text style={[
                                            styles.applianceStatus,
                                            {color: appliance.status === 'on' ? '#4CAF50' : '#666666'}
                                        ]}>
                                            {appliance.status === 'on' ? '켜짐' : '꺼짐'}
                                        </Text>
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
        marginHorizontal: 10,
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
    applianceName: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
        marginVertical: 8,
    },
    applianceStatus: {
        fontSize: 14,
    },
});

export default Appliance;