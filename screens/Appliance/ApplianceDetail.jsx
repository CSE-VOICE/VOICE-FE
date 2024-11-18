// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useEffect, useState } from 'react';
// import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { GradientBackground } from '../../components/GradientBackground';
// import { typography } from '../../styles/typography';

// const windowWidth = Dimensions.get('window').width;

// function ApplianceDetail({ route, navigation }) {
//     const { appliance } = route.params;
//     const [isOn, setIsOn] = useState(appliance.status === 'on');
//     const [temperature, setTemperature] = useState(23); // 초기 온도값

//     useEffect(() => {
//         navigation.setOptions({
//             title: appliance.name,
//             headerShown: true,
//             headerTransparent: true,
//             headerTintColor: '#666666',
//             headerTitleStyle: {
//                 ...typography.title,
//                 fontSize: 18,
//             },
//         });
//     }, [navigation, appliance.name]);

//     const togglePower = () => {
//         setIsOn(!isOn);
//     };

//     const adjustTemperature = (amount) => {
//         setTemperature(prev => prev + amount);
//     };

//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.content}>
//                     <View style={styles.mainCard}>
//                         <MaterialCommunityIcons 
//                             name="air-conditioner" 
//                             size={48} 
//                             color={isOn ? '#4CAF50' : '#666666'}
//                         />
//                         <Text style={styles.deviceName}>{appliance.name}</Text>
//                         <Text style={[styles.statusText, { color: isOn ? '#4CAF50' : '#666666' }]}>
//                             {isOn ? '작동중' : '꺼짐'}
//                         </Text>
//                         {isOn && (
//                             <Text style={styles.temperatureText}>
//                                 온도: {temperature}도
//                             </Text>
//                         )}
//                     </View>

//                     <View style={styles.controlsContainer}>
//                         <TouchableOpacity 
//                             style={[styles.controlButton, styles.powerButton]} 
//                             onPress={togglePower}
//                         >
//                             <MaterialCommunityIcons 
//                                 name="power" 
//                                 size={32} 
//                                 color={isOn ? '#4CAF50' : '#666666'}
//                             />
//                         </TouchableOpacity>

//                         {isOn && (
//                             <View style={styles.temperatureControls}>
//                                 <TouchableOpacity 
//                                     style={styles.controlButton}
//                                     onPress={() => adjustTemperature(-1)}
//                                 >
//                                     <MaterialCommunityIcons name="minus" size={32} color="#666666" />
//                                 </TouchableOpacity>
//                                 <TouchableOpacity 
//                                     style={styles.controlButton}
//                                     onPress={() => adjustTemperature(1)}
//                                 >
//                                     <MaterialCommunityIcons name="plus" size={32} color="#666666" />
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// export default ApplianceDetail;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 20,
//         paddingTop: 100,
//     },
//     mainCard: {
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 30,
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
//     deviceName: {
//         fontSize: 24,
//         color: '#333333',
//         marginTop: 15,
//         marginBottom: 10,
//         fontWeight: '600',
//     },
//     statusText: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     temperatureText: {
//         fontSize: 16,
//         color: '#666666',
//     },
//     controlsContainer: {
//         marginTop: 30,
//         alignItems: 'center',
//     },
//     controlButton: {
//         backgroundColor: 'white',
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginHorizontal: 10,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     powerButton: {
//         marginBottom: 20,
//     },
//     temperatureControls: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { updateAppliance } from '../../redux/slices/applianceSlice';
import { typography } from '../../styles/typography';

const windowWidth = Dimensions.get('window').width;

function ApplianceDetail({ route, navigation }) {
  const { appliance } = route.params; // 라우트로 전달받은 기기 정보
  const dispatch = useDispatch();
  const appliances = useSelector((state) => state.appliance.appliances);
  const currentAppliance = appliances.find((a) => a.id === appliance.id); // Redux에서 최신 데이터 가져오기

  const [isOn, setIsOn] = useState(currentAppliance?.status === 'on');
  const [temperature, setTemperature] = useState(currentAppliance?.temperature || 23); // 초기 온도값

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

  const togglePower = () => {
    const newStatus = isOn ? 'off' : 'on';
    setIsOn(!isOn);
    dispatch(updateAppliance({ id: appliance.id, status: newStatus }));
  };

  const adjustTemperature = (amount) => {
    const newTemperature = temperature + amount;
    setTemperature(newTemperature);
    dispatch(updateAppliance({ id: appliance.id, temperature: newTemperature }));
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
            <Text style={styles.deviceName}>{currentAppliance?.name || '알 수 없는 기기'}</Text>
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
