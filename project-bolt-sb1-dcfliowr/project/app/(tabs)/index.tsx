import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useBuildings } from '@/context/BuildingContext';
import BuildingCard from '@/components/BuildingCard';
import Header from '@/components/Header';
import { Building } from '@/types/building';
import { colors } from '@/constants/Colors';
import { Search, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import EmptyState from '@/components/EmptyState';

export default function BuildingsScreen() {
  const { buildings, getRecentBuildings } = useBuildings();
  const [recentBuildings, setRecentBuildings] = useState<Building[]>([]);
  
  useEffect(() => {
    const loadRecentBuildings = async () => {
      const recent = await getRecentBuildings();
      setRecentBuildings(recent);
    };
    
    loadRecentBuildings();
  }, [buildings]);

  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const renderBuilding = ({ item }: { item: Building }) => (
    <BuildingCard building={item} />
  );

  return (
    <View style={styles.container}>
      <Header title="Zilmatik" />
      
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearchPress}
        >
          <Search size={20} color={colors.darkGrey} />
          <Text style={styles.searchText}>Bina ara...</Text>
        </TouchableOpacity>
      </View>
      
      {buildings.length > 0 ? (
        <>
          {recentBuildings.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Son Görüntülenenler</Text>
              <FlatList
                data={recentBuildings}
                renderItem={renderBuilding}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
              />
            </View>
          )}
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tüm Binalar</Text>
            <FlatList
              data={buildings}
              renderItem={renderBuilding}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.buildingsList}
            />
          </View>
        </>
      ) : (
        <EmptyState
          icon={<AlertCircle size={40} color={colors.primary} />}
          title="Henüz Bina Eklenmemiş"
          message="Kuryeler için bina ve kapı şifresi ekleyerek başlayın."
          actionLabel="Bina Ekle"
          onAction={() => router.push('/(tabs)/add')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    padding: 12,
  },
  searchText: {
    color: colors.darkGrey,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 16,
    marginBottom: 12,
    color: colors.text,
  },
  recentList: {
    paddingLeft: 16,
  },
  buildingsList: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 100,
  },
});