import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Platform } from 'react-native';
import { useBuildings } from '@/context/BuildingContext';
import Header from '@/components/Header';
import { colors } from '@/constants/Colors';
import { Save, Download, Trash2, Upload, Info } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const { buildings, importBuildings, clearAllBuildings } = useBuildings();
  const [darkMode, setDarkMode] = useState(false);
  
  const handleExport = async () => {
    if (buildings.length === 0) {
      Alert.alert('Uyarı', 'Dışa aktarılacak bina bulunmamaktadır.');
      return;
    }
    
    try {
      const fileName = `zilmatik_export_${new Date().toISOString().slice(0, 10)}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(buildings),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      if (Platform.OS === 'web') {
        // Web handling - create a download link
        const jsonString = JSON.stringify(buildings, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        
        Alert.alert('Başarılı', 'Veriler dışa aktarıldı.');
      } else {
        // Mobile handling - share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Hata', 'Paylaşım bu cihazda desteklenmiyor.');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Hata', 'Dışa aktarma sırasında bir hata oluştu.');
    }
  };
  
  const handleImport = async () => {
    Alert.alert(
      'Veri İçe Aktar',
      'Bu işlem mevcut verilerin üzerine yazacaktır. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Devam Et',
          onPress: () => {
            // This would normally trigger a file picker, but for simplicity in this demo,
            // we'll just show a placeholder alert
            Alert.alert(
              'Bilgi',
              'Gerçek bir uygulamada, buraya dosya seçici entegre edilir.',
              [{ text: 'Tamam' }]
            );
          }
        }
      ]
    );
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Bu işlem tüm binaları kalıcı olarak silecektir. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil',
          style: 'destructive',
          onPress: clearAllBuildings
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header title="Ayarlar" />
      
      <ScrollView style={styles.settingsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExport}>
            <View style={styles.settingInfo}>
              <Download size={22} color={colors.text} />
              <Text style={styles.settingText}>Verileri Dışa Aktar</Text>
            </View>
            <Text style={styles.settingCount}>{buildings.length} bina</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleImport}>
            <View style={styles.settingInfo}>
              <Upload size={22} color={colors.text} />
              <Text style={styles.settingText}>Verileri İçe Aktar</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearAll}>
            <View style={styles.settingInfo}>
              <Trash2 size={22} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>Tüm Verileri Sil</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Karanlık Mod</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.lightGrey, true: colors.primaryLight }}
              thumbColor={darkMode ? colors.primary : colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          
          <View style={styles.aboutContainer}>
            <Info size={20} color={colors.primary} />
            <View style={styles.aboutTextContainer}>
              <Text style={styles.appName}>Zilmatik</Text>
              <Text style={styles.appVersion}>Versiyon 1.0.0</Text>
              <Text style={styles.appDescription}>
                Kuryeler için bina adı ve kapı şifrelerini kaydetme ve yönetme uygulaması.
              </Text>
            </View>
          </View>
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
  settingsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  settingCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.grey,
  },
  aboutContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutTextContainer: {
    marginLeft: 12,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.text,
  },
  appVersion: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
  },
  appDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});