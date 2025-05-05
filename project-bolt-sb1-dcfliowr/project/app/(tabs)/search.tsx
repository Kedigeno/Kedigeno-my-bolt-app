import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useBuildings } from '@/context/BuildingContext';
import BuildingCard from '@/components/BuildingCard';
import Header from '@/components/Header';
import { Building } from '@/types/building';
import { colors } from '@/constants/Colors';
import { Search, Circle as XCircle } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';

export default function SearchScreen() {
  const { buildings } = useBuildings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBuildings([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    const filtered = buildings.filter((building) => (
      building.name.toLowerCase().includes(lowerCaseQuery) ||
      building.address.toLowerCase().includes(lowerCaseQuery) ||
      building.neighborhood?.toLowerCase().includes(lowerCaseQuery) ||
      building.notes?.toLowerCase().includes(lowerCaseQuery)
    ));
    
    setFilteredBuildings(filtered);
  }, [searchQuery, buildings]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderBuilding = ({ item }: { item: Building }) => (
    <BuildingCard building={item} />
  );

  return (
    <View style={styles.container}>
      <Header title="Bina Ara" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.darkGrey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Bina adı, adres veya notlar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.darkGrey}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <XCircle size={20} color={colors.darkGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {searchQuery.length > 0 ? (
        filteredBuildings.length > 0 ? (
          <FlatList
            data={filteredBuildings}
            renderItem={renderBuilding}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.buildingsList}
          />
        ) : (
          <EmptyState
            icon={<Search size={40} color={colors.primary} />}
            title="Sonuç Bulunamadı"
            message={`"${searchQuery}" ile eşleşen bina bulunamadı.`}
          />
        )
      ) : (
        <View style={styles.initialStateContainer}>
          <Search size={60} color={colors.lightGrey} />
          <Text style={styles.initialStateText}>Bina adı, adres veya notlara göre arama yapın</Text>
        </View>
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
  },
  buildingsList: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 100,
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  initialStateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
    marginTop: 16,
  },
});