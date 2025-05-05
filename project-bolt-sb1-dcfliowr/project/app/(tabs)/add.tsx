import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useBuildings } from '@/context/BuildingContext';
import Header from '@/components/Header';
import { colors } from '@/constants/Colors';
import { Building } from '@/types/building';
import { Save, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AddBuildingScreen() {
  const { addBuilding } = useBuildings();
  const [building, setBuilding] = useState<Partial<Building>>({
    id: '',
    name: '',
    address: '',
    neighborhood: '',
    innerDoorCode: '',
    outerDoorCode: '',
    notes: '',
  });
  
  const handleChange = (field: keyof Building, value: string) => {
    setBuilding(prev => ({ ...prev, [field]: value }));
  };
  
  const isValid = () => {
    return building.name && building.name.trim() !== '';
  };
  
  const saveBuilding = () => {
    if (!isValid()) {
      Alert.alert('Hata', 'Lütfen en az bina adını giriniz');
      return;
    }
    
    addBuilding({
      id: Date.now().toString(),
      name: building.name || '',
      address: building.address || '',
      neighborhood: building.neighborhood || '',
      innerDoorCode: building.innerDoorCode || '',
      outerDoorCode: building.outerDoorCode || '',
      notes: building.notes || '',
      createdAt: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
    });
    
    router.push('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Yeni Bina Ekle" 
        rightButton={{
          icon: <Save size={24} color={colors.primary} />,
          onPress: saveBuilding,
          disabled: !isValid(),
        }}
      />
      
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bina Adı*</Text>
          <TextInput
            style={styles.input}
            value={building.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Bina adını girin"
            placeholderTextColor={colors.grey}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mahalle / Semt</Text>
          <TextInput
            style={styles.input}
            value={building.neighborhood}
            onChangeText={(text) => handleChange('neighborhood', text)}
            placeholder="Mahalle veya semt adı"
            placeholderTextColor={colors.grey}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adres</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={building.address}
            onChangeText={(text) => handleChange('address', text)}
            placeholder="Sokak, cadde, vb."
            placeholderTextColor={colors.grey}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.codeContainer}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dış Kapı Şifresi</Text>
            <TextInput
              style={styles.input}
              value={building.outerDoorCode}
              onChangeText={(text) => handleChange('outerDoorCode', text)}
              placeholder="Dış kapı şifresi"
              placeholderTextColor={colors.grey}
            />
          </View>
          
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>İç Kapı Şifresi</Text>
            <TextInput
              style={styles.input}
              value={building.innerDoorCode}
              onChangeText={(text) => handleChange('innerDoorCode', text)}
              placeholder="İç kapı şifresi"
              placeholderTextColor={colors.grey}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notlar</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={building.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Ek bilgiler veya notlar..."
            placeholderTextColor={colors.grey}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 140 : 100,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
});