import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBuildings } from '@/context/BuildingContext';
import Header from '@/components/Header';
import { colors } from '@/constants/Colors';
import { CreditCard as Edit, Save, Trash2, Copy, ArrowLeft } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export default function BuildingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getBuildingById, updateBuilding, deleteBuilding, updateLastViewed } = useBuildings();
  const [building, setBuilding] = useState(getBuildingById(id as string));
  const [isEditing, setIsEditing] = useState(false);
  const [editedBuilding, setEditedBuilding] = useState(building);
  
  useEffect(() => {
    if (building) {
      updateLastViewed(building.id);
    }
  }, []);
  
  if (!building) {
    return (
      <View style={styles.container}>
        <Header 
          title="Bina Bulunamadı" 
          leftButton={{
            icon: <ArrowLeft size={24} color={colors.text} />,
            onPress: () => router.back(),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Bina bulunamadı veya silinmiş olabilir.</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      updateBuilding(editedBuilding);
      setBuilding(editedBuilding);
    } else {
      // Enter edit mode
      setEditedBuilding({...building});
    }
    setIsEditing(!isEditing);
  };
  
  const handleChange = (field: string, value: string) => {
    setEditedBuilding(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Binayı Sil',
      `"${building.name}" binasını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            deleteBuilding(building.id);
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };
  
  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    
    await Clipboard.setStringAsync(text);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert('Kopyalandı', `${label} panoya kopyalandı`);
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title={isEditing ? 'Binayı Düzenle' : building.name}
        leftButton={{
          icon: <ArrowLeft size={24} color={colors.text} />,
          onPress: () => router.back(),
        }}
        rightButton={{
          icon: isEditing ? 
            <Save size={24} color={colors.primary} /> : 
            <Edit size={24} color={colors.primary} />,
          onPress: toggleEditMode,
        }}
      />
      
      <ScrollView style={styles.content}>
        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bina Adı*</Text>
              <TextInput
                style={styles.input}
                value={editedBuilding.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Bina adını girin"
                placeholderTextColor={colors.grey}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mahalle / Semt</Text>
              <TextInput
                style={styles.input}
                value={editedBuilding.neighborhood}
                onChangeText={(text) => handleChange('neighborhood', text)}
                placeholder="Mahalle veya semt adı"
                placeholderTextColor={colors.grey}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Adres</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedBuilding.address}
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
                  value={editedBuilding.outerDoorCode}
                  onChangeText={(text) => handleChange('outerDoorCode', text)}
                  placeholder="Dış kapı şifresi"
                  placeholderTextColor={colors.grey}
                />
              </View>
              
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>İç Kapı Şifresi</Text>
                <TextInput
                  style={styles.input}
                  value={editedBuilding.innerDoorCode}
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
                value={editedBuilding.notes}
                onChangeText={(text) => handleChange('notes', text)}
                placeholder="Ek bilgiler veya notlar..."
                placeholderTextColor={colors.grey}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={colors.white} />
              <Text style={styles.deleteButtonText}>Binayı Sil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            {building.neighborhood && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mahalle / Semt:</Text>
                <Text style={styles.infoValue}>{building.neighborhood}</Text>
              </View>
            )}
            
            {building.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Adres:</Text>
                <Text style={styles.infoValue}>{building.address}</Text>
              </View>
            )}
            
            <View style={styles.codeCardsContainer}>
              <TouchableOpacity 
                style={[styles.codeCard, building.outerDoorCode ? styles.codeCardActive : styles.codeCardEmpty]}
                onPress={() => copyToClipboard(building.outerDoorCode, 'Dış kapı şifresi')}
                disabled={!building.outerDoorCode}
              >
                <Text style={styles.codeCardTitle}>Dış Kapı Şifresi</Text>
                {building.outerDoorCode ? (
                  <>
                    <Text style={styles.codeCardValue}>{building.outerDoorCode}</Text>
                    <View style={styles.copyButton}>
                      <Copy size={16} color={colors.primary} />
                      <Text style={styles.copyText}>Kopyala</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.codeCardEmpty}>Şifre girilmemiş</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.codeCard, building.innerDoorCode ? styles.codeCardActive : styles.codeCardEmpty]}
                onPress={() => copyToClipboard(building.innerDoorCode, 'İç kapı şifresi')}
                disabled={!building.innerDoorCode}
              >
                <Text style={styles.codeCardTitle}>İç Kapı Şifresi</Text>
                {building.innerDoorCode ? (
                  <>
                    <Text style={styles.codeCardValue}>{building.innerDoorCode}</Text>
                    <View style={styles.copyButton}>
                      <Copy size={16} color={colors.primary} />
                      <Text style={styles.copyText}>Kopyala</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.codeCardEmpty}>Şifre girilmemiş</Text>
                )}
              </TouchableOpacity>
            </View>
            
            {building.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Notlar</Text>
                <View style={styles.notesContent}>
                  <Text style={styles.notesText}>{building.notes}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.white,
  },
  editForm: {
    flex: 1,
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
  deleteButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  deleteButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
  },
  codeCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  codeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  codeCardActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  codeCardEmpty: {
    backgroundColor: colors.lightGrey,
    color: colors.grey,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  codeCardTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeCardValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  copyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  notesContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
  },
});