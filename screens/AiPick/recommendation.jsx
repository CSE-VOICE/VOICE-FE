// // import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { GradientBackground } from '../../components/GradientBackground';
// // import { handleRecommendationResponse } from '../../redux/slices/routineSlice';
// // import { typography } from '../../styles/typography';

// // function Recommendation({ navigation, route }) {
// //     const { situation } = route.params;
// //     const { routines } = useSelector((state) => state.routine);
// //     const dispatch = useDispatch();

// //     const handleConfirm = async () => {
// //         await dispatch(handleRecommendationResponse(true));
// //         navigation.navigate('AiPick');
// //     };

// //     const handleCancel = async () => {
// //         await dispatch(handleRecommendationResponse(false));
// //         navigation.navigate('AiPick');
// //     };

// //     const handleRecommend = () => {
// //         // 재추천 로직 구현
// //     };

// //     return (
// //         <GradientBackground>
// //             <SafeAreaView style={styles.container}>
// //                 <View style={styles.container}>
// //                     <Text style={[styles.title, typography.title]}>추천 결과</Text>
                    
// //                     <View style={styles.contentContainer}>
// //                         <Text style={styles.situationText}>입력하신 상황: {situation}</Text>
// //                         <Text style={styles.situationText}>저장된 루틴 수: {routines.length}</Text>
// //                     </View>

// //                     <View style={styles.buttonGroupContainer}>
// //                         <View style={styles.buttonGroup}>
// //                             <TouchableOpacity 
// //                                 style={styles.segmentedButton} 
// //                                 onPress={handleConfirm}
// //                             >
// //                                 <Text style={styles.buttonText}>수락</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity 
// //                                 style={styles.segmentedButton} 
// //                                 onPress={handleCancel}
// //                             >
// //                                 <Text style={styles.buttonText}>거절</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity 
// //                                 style={styles.segmentedButton} 
// //                                 onPress={handleRecommend}
// //                             >
// //                                 <Text style={styles.buttonText}>재추천</Text>
// //                             </TouchableOpacity>
// //                         </View>
// //                     </View>
// //                 </View>
// //             </SafeAreaView>
// //         </GradientBackground>
// //     );
// // }

// // export default Recommendation;

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //     },
// //     title: {
// //         textAlign: 'center',
// //         marginTop: 100,
// //         fontSize: 40,
// //         fontWeight: 'bold',
// //         color: '#0F172A',
// //         marginBottom: 40,
// //     },
// //     contentContainer: {
// //         paddingHorizontal: 20,
// //         flex: 1,
// //     },
// //     situationText: {
// //         fontSize: 16,
// //         marginBottom: 20,
// //     },
// //     buttonGroupContainer: {
// //         paddingHorizontal: 20,
// //         paddingBottom: 20,
// //     },
// //     buttonGroup: {
// //         flexDirection: 'row',
// //         backgroundColor: 'white',
// //         borderRadius: 20,
// //         padding: 5,
// //         elevation: 3,
// //         shadowColor: '#000',
// //         shadowOffset: {
// //             width: 0,
// //             height: 2,
// //         },
// //         shadowOpacity: 0.5,
// //         shadowRadius: 3.84,
// //     },
// //     segmentedButton: {
// //         flex: 1,
// //         paddingVertical: 12,
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         borderRadius: 20,
// //         marginHorizontal: 2,
// //     },
// //     buttonText: {
// //         fontSize: 16,
// //         fontWeight: '600',
// //         color: '#666666',
// //     }
// // });


// // Recommendation.jsx
// import { useEffect } from 'react';
// import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { GradientBackground } from '../../components/GradientBackground';
// import { LoadingOverlay } from '../../components/ui/loading-overlay';
// // import { handleRecommendationResponse } from '../../redux/slices/routineSlice'; // 기존 import 제거
// import {
//     acceptRecommendation,
//     refreshRecommendation,
//     rejectRecommendation
// } from '../../redux/slices/routineSlice'; // 새로운 imports 추가
// import { typography } from '../../styles/typography';

// function Recommendation({ navigation, route }) {
//     const { situation } = route.params;
//     const dispatch = useDispatch();
//     // const { routines } = useSelector((state) => state.routine); // 기존 selector 제거
//     const { currentRecommendation, loading, error } = useSelector(state => state.routine); // 새로운 selector
    
//     useEffect(() => {
//         console.log('Current Recommendation:', currentRecommendation);
//     }, [currentRecommendation]);

//     // 기존 handlers 제거
//     // const handleConfirm = async () => {
//     //     await dispatch(handleRecommendationResponse(true));
//     //     navigation.navigate('AiPick');
//     // };

//     // const handleCancel = async () => {
//     //     await dispatch(handleRecommendationResponse(false));
//     //     navigation.navigate('AiPick');
//     // };

//     // const handleRecommend = () => {
//     //     // 재추천 로직 구현
//     // };

//     // 새로운 handlers 추가
//     const handleConfirm = async () => {
//         try {
//             await dispatch(acceptRecommendation());
//             navigation.navigate('AiPick');
//         } catch (error) {
//             console.error('Confirmation error:', error);
//         }
//     };

//     const handleCancel = async () => {
//         try {
//             await dispatch(rejectRecommendation());
//             navigation.navigate('AiPick');
//         } catch (error) {
//             console.error('Rejection error:', error);
//         }
//     };

//     const handleRecommend = async () => {
//         try {
//             await dispatch(refreshRecommendation());
//         } catch (error) {
//             console.error('Refresh recommendation error:', error);
//         }
//     };

//     // 새로운 함수 추가
//     const renderAppliances = () => {
//         if (!currentRecommendation?.updates) return null;

//         return currentRecommendation.updates.map((appliance, index) => (
//             <View key={index} style={styles.applianceItem}>
//                 <Text style={styles.applianceName}>{appliance.name}</Text>
//                 <Text style={styles.applianceState}>
//                     {appliance.onoff === 'on' ? '켜짐' : '꺼짐'} - {appliance.state}
//                 </Text>
//             </View>
//         ));
//     };

//     return (
//         <GradientBackground>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.container}>
//                     <Text style={[styles.title, typography.title]}>추천 결과</Text>
                    
//                     <View style={styles.contentContainer}>
//                         <Text style={styles.situationText}>입력하신 상황: {situation}</Text>
                        
//                         {currentRecommendation ? (
//                             <>
//                                 <Text style={styles.routineText}>
//                                     추천 루틴: {currentRecommendation.routine}
//                                 </Text>
//                                 <View style={styles.appliancesContainer}>
//                                     <Text style={styles.appliancesTitle}>적용될 기기:</Text>
//                                     {renderAppliances()}
//                                 </View>
//                             </>
//                         ) : (
//                             <Text style={styles.error}>추천된 루틴이 없습니다.</Text>
//                         )}

//                         {error && <Text style={styles.error}>{error}</Text>}
//                     </View>

//                     <View style={styles.buttonGroupContainer}>
//                         <View style={styles.buttonGroup}>
//                             <TouchableOpacity 
//                                 style={styles.segmentedButton} 
//                                 onPress={handleConfirm}
//                                 disabled={loading || !currentRecommendation}
//                             >
//                                 <Text style={[
//                                     styles.buttonText,
//                                     (loading || !currentRecommendation) && styles.buttonTextDisabled
//                                 ]}>수락</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity 
//                                 style={styles.segmentedButton} 
//                                 onPress={handleCancel}
//                                 disabled={loading || !currentRecommendation}
//                             >
//                                 <Text style={[
//                                     styles.buttonText,
//                                     (loading || !currentRecommendation) && styles.buttonTextDisabled
//                                 ]}>거절</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity 
//                                 style={styles.segmentedButton} 
//                                 onPress={handleRecommend}
//                                 disabled={loading}
//                             >
//                                 <Text style={[
//                                     styles.buttonText,
//                                     loading && styles.buttonTextDisabled
//                                 ]}>재추천</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <LoadingOverlay visible={loading} />
//                 </View>
//             </SafeAreaView>
//         </GradientBackground>
//     );
// }

// export default Recommendation;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     title: {
//         textAlign: 'center',
//         marginTop: 100,
//         fontSize: 40,
//         fontWeight: 'bold',
//         color: '#0F172A',
//         marginBottom: 40,
//     },
//     contentContainer: {
//         paddingHorizontal: 20,
//         flex: 1,
//     },
//     situationText: {
//         fontSize: 16,
//         marginBottom: 20,
//     },
//     routineText: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginBottom: 20,
//         color: '#1F2937',
//     },
//     appliancesContainer: {
//         marginTop: 20,
//     },
//     appliancesTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginBottom: 10,
//         color: '#374151',
//     },
//     applianceItem: {
//         backgroundColor: '#F3F4F6',
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 8,
//     },
//     applianceName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1F2937',
//     },
//     applianceState: {
//         fontSize: 14,
//         color: '#4B5563',
//         marginTop: 4,
//     },
//     error: {
//         color: '#EF4444',
//         textAlign: 'center',
//         marginTop: 10,
//     },
//     buttonGroupContainer: {
//         paddingHorizontal: 20,
//         paddingBottom: 20,
//     },
//     buttonGroup: {
//         flexDirection: 'row',
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 5,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.5,
//         shadowRadius: 3.84,
//     },
//     segmentedButton: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 20,
//         marginHorizontal: 2,
//     },
//     buttonText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#666666',
//     },
//     buttonTextDisabled: {
//         color: '#D1D5DB',
//     }
// });

import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import {
    acceptRecommendation,
    fetchRecommendation,
    refreshRecommendation,
    rejectRecommendation
} from '../../redux/slices/routineSlice';
import { typography } from '../../styles/typography';

function Recommendation({ navigation, route }) {
    const { situation } = route.params;
    const dispatch = useDispatch();
    const { currentRecommendation, loading, error } = useSelector(state => state.routine);
    
    useEffect(() => {
        if (currentRecommendation) {
            console.log('Current Recommendation:', currentRecommendation);
        }
    }, [currentRecommendation]);

    useEffect(() => {
    const loadData = async () => {
        if (!currentRecommendation) {
            try {
                await dispatch(fetchRecommendation('6'));
            } catch (error) {
                console.error('Failed to load recommendation:', error);
            }
        }
    };
    
    loadData();
}, [dispatch]);

// 로딩 상태일 때 보여줄 화면 추가
if (loading) {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <LoadingOverlay visible={true} />
            </SafeAreaView>
        </GradientBackground>
    );
}

    const handleConfirm = async () => {
        try {
            await dispatch(acceptRecommendation());
            navigation.navigate('AiPick');
        } catch (error) {
            console.error('Confirmation error:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await dispatch(rejectRecommendation());
            navigation.navigate('AiPick');
        } catch (error) {
            console.error('Rejection error:', error);
        }
    };

    const handleRecommend = async () => {
        try {
            await dispatch(refreshRecommendation());
        } catch (error) {
            console.error('Refresh recommendation error:', error);
        }
    };

    const renderAppliances = () => {
        if (!currentRecommendation?.updates) return null;
    
        return currentRecommendation.updates.map((appliance, index) => (
            <View key={index} style={styles.applianceItem}>
                <Text style={styles.applianceName}>{appliance.name}</Text>
                <Text style={styles.applianceState}>
                    {appliance.onoff === 'on' ? '켜짐' : '꺼짐'} - {appliance.state}
                </Text>
            </View>
        ));
    };
    

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, typography.title]}>추천 결과</Text>
                    
                    <View style={styles.contentContainer}>
                        <Text style={styles.situationText}>입력하신 상황: {situation}</Text>
                        
                        {currentRecommendation ? (
                            <>
                                <Text style={styles.routineText}>
                                    추천 루틴: {currentRecommendation.routine}
                                </Text>
                                <View style={styles.appliancesContainer}>
                                    <Text style={styles.appliancesTitle}>적용될 기기:</Text>
                                    {renderAppliances()}
                                </View>
                            </>
                        ) : (
                            <Text style={styles.error}>추천된 루틴이 없습니다.</Text>
                        )}

                        {error && <Text style={styles.error}>{error}</Text>}
                    </View>

                    <View style={styles.buttonGroupContainer}>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={[styles.segmentedButton, loading && styles.buttonDisabled]} 
                                onPress={handleConfirm}
                                disabled={loading || !currentRecommendation?.data}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    (loading || !currentRecommendation?.data) && styles.buttonTextDisabled
                                ]}>수락</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.segmentedButton, loading && styles.buttonDisabled]} 
                                onPress={handleCancel}
                                disabled={loading || !currentRecommendation?.data}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    (loading || !currentRecommendation?.data) && styles.buttonTextDisabled
                                ]}>거절</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.segmentedButton, loading && styles.buttonDisabled]} 
                                onPress={handleRecommend}
                                disabled={loading}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    loading && styles.buttonTextDisabled
                                ]}>재추천</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <LoadingOverlay visible={loading} />
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
        color: '#374151',
    },
    routineText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#1F2937',
    },
    appliancesContainer: {
        marginTop: 20,
    },
    appliancesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#374151',
    },
    applianceItem: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    applianceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    applianceState: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 4,
    },
    error: {
        color: '#EF4444',
        textAlign: 'center',
        marginTop: 10,
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
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
    buttonTextDisabled: {
        color: '#D1D5DB',
    }
});