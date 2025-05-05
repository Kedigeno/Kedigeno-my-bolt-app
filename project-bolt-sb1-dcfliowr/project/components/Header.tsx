import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/Colors';
import { ReactNode } from 'react';

interface ButtonProps {
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftButton?: ButtonProps;
  rightButton?: ButtonProps;
}

export default function Header({ title, subtitle, leftButton, rightButton }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {leftButton && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={leftButton.onPress}
            disabled={leftButton.disabled}
          >
            {leftButton.icon}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.rightContainer}>
        {rightButton && (
          <TouchableOpacity 
            style={[
              styles.button, 
              rightButton.disabled ? styles.buttonDisabled : null
            ]} 
            onPress={rightButton.onPress}
            disabled={rightButton.disabled}
          >
            {rightButton.icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 110 : 80,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    elevation: 4,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.text,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.darkGrey,
  },
  button: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});