import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

interface LockInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const LockInButton: React.FC<LockInButtonProps> = ({ onPress, disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>LOCK IN</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 24,
  },
  buttonPressed: {
    backgroundColor: colors.accentMuted,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.background,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
