import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { GradientBackground } from '../../components/GradientBackground';
import { typography } from '../../styles/typography';

function MyPageRoutine() {
    const { routines } = useSelector((state) => state.routine); // Redux에서 루틴 가져오기
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoutines, setFilteredRoutines] = useState(routines);

    // 검색 로직
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRoutines(routines);
        } else {
            const filtered = routines.filter((routine) =>
                routine.situation.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRoutines(filtered);
        }
    }, [searchQuery, routines]);

    const renderRoutine = ({ item }) => (
        <View style={styles.routineCard}>
            <Text style={styles.routineTitle}>{item.situation}</Text>
            <Text style={styles.routineDate}>생성일: {new Date(item.createdAt).toLocaleDateString()}</Text>
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
                                    onChangeText={setSearchQuery}
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
                            data={filteredRoutines}
                            keyExtractor={(item) => item.id}
                            renderItem={renderRoutine}
                            contentContainerStyle={styles.resultContainer}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                            }
                        />
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
        transform: [{ translateY: -10 }],
        color: '#5e5eb4',
    },
    resultContainer: {
        marginTop: 20,
    },
    routineCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    routineTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    routineDate: {
        fontSize: 12,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});
