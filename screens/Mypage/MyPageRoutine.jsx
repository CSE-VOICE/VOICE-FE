import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { fetchRoutines } from '../../redux/slices/routineSlice';
import { typography } from '../../styles/typography';

function MyPageRoutine({ navigation }) {
   const dispatch = useDispatch();
   const { routines, loading } = useSelector((state) => state.routine);
   const [searchQuery, setSearchQuery] = useState('');
   const [debounceTimeout, setDebounceTimeout] = useState(null);

   useEffect(() => {
       dispatch(fetchRoutines());
   }, [dispatch]);

   const handleSearch = (text) => {
       setSearchQuery(text);
       
       if (debounceTimeout) {
           clearTimeout(debounceTimeout);
       }
       
       const newTimeout = setTimeout(() => {
           dispatch(fetchRoutines(text));
       }, 500);
       
       setDebounceTimeout(newTimeout);
   };

   const renderRoutine = ({ item }) => (
       <View style={styles.routineCard}>
           <View style={styles.routineInfo}>
               <Text style={styles.routineTitle}>상황 : {item.situation_txt}</Text>
               <Text style={styles.routineDate}>
                   생성일: {new Date(item.created_at).toLocaleDateString()}
               </Text>
           </View>
           <TouchableOpacity
               style={styles.detailButton}
               onPress={() => navigation.navigate('MyPageRoutineDetail', { 
                   routineId: item.routine_id 
               })}
           >
               <Text style={styles.detailButtonText}>자세히</Text>
               <MaterialIcons name="arrow-forward-ios" size={16} color="#5e5eb4" />
           </TouchableOpacity>
       </View>
   );

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
                                   value={searchQuery}
                                   onChangeText={handleSearch}
                               />
                               <MaterialIcons 
                                   name="search" 
                                   size={20} 
                                   color="#666666" 
                                   style={styles.searchIcon}
                               />
                           </View>
                       </View>

                       <FlatList
                           data={routines}
                           keyExtractor={(item) => item.routine_id.toString()}
                           renderItem={renderRoutine}
                           contentContainerStyle={styles.resultContainer}
                           ListEmptyComponent={
                               loading ? (
                                   <Text style={styles.emptyText}>로딩 중...</Text>
                               ) : (
                                   <Text style={styles.emptyText}>저장된 루틴이 없습니다.</Text>
                               )
                           }
                       />
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
       paddingRight: 40,
       fontSize: 16,
       color: '#333',
       backgroundColor: 'white',
   },
   searchIcon: {
       position: 'absolute',
       right: 12,
       top: '50%',
       transform: [{ translateY: -10 }],
       color: '#5e5eb4',
   },
   resultContainer: {
       marginTop: 20,
       paddingBottom: 20,
   },
   routineCard: {
       backgroundColor: 'white',
       borderRadius: 10,
       padding: 15,
       marginBottom: 10,
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.1,
       shadowRadius: 3,
       elevation: 2,
   },
   routineInfo: {
       flex: 1,
   },
   routineTitle: {
       fontSize: 16,
       fontWeight: 'bold',
       marginBottom: 5,
       color: '#333',
   },
   routineDate: {
       fontSize: 12,
       color: '#666',
   },
   detailButton: {
       flexDirection: 'row',
       alignItems: 'center',
       padding: 8,
   },
   detailButtonText: {
       color: '#5e5eb4',
       marginRight: 4,
       fontSize: 14,
   },
   emptyText: {
       textAlign: 'center',
       marginTop: 20,
       fontSize: 16,
       color: '#999',
   },
});

export default MyPageRoutine;