import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Building } from '@/types/building';
import { colors } from '@/constants/Colors';
import { Building2, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';

interface BuildingCardProps {
  building: Building;
  horizontal?: boolean;
}

function BuildingCard({ building, horizontal = false }: BuildingCardProps) {
  const navigateToBuilding = () => {
    router.push(`/building/${building.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        horizontal ? styles.horizontalContainer : null
      ]}
      onPress={navigateToBuilding}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Building2 size={24} color={colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{building.name}</Text>
        
        {building.neighborhood ? (
          <Text style={styles.neighborhood} numberOfLines={1}>
            {building.neighborhood}
          </Text>
        ) : building.address ? (
          <Text style={styles.neighborhood} numberOfLines={1}>
            {building.address}
          </Text>
        ) : null}
        
        <View style={styles.codeContainer}>
          {building.outerDoorCode && (
            <View style={styles.codeTag}>
              <Text style={styles.codeLabel}>Dış:</Text>
              <Text style={styles.codeValue}>{building.outerDoorCode}</Text>
            </View>
          )}
          
          {building.innerDoorCode && (
            <View style={styles.codeTag}>
              <Text style={styles.codeLabel}>İç:</Text>
              <Text style={styles.codeValue}>{building.innerDoorCode}</Text>
            </View>
          )}
        </View>
      </View>
      
      <ExternalLink size={16} color={colors.grey} style={styles.arrowIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalContainer: {
    width: 280,
    marginRight: 12,
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  neighborhood: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  codeTag: {
    flexDirection: 'row',
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  codeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.darkGrey,
  },
  codeValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default memo(BuildingCard);