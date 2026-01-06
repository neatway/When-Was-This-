import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors } from '../constants/colors';

export const LegalInfo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.iconText}>i</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Legal & Privacy</Text>

              <Text style={styles.sectionTitle}>Privacy</Text>
              <Text style={styles.text}>
                We don't collect, store, or share any personal data. Your scores are saved locally on your device only.
              </Text>

              <Text style={styles.sectionTitle}>Photo Attribution</Text>
              <Text style={styles.text}>
                Historical photos are sourced from Wikimedia Commons and are in the public domain or used under Creative Commons licenses.
              </Text>

              <Text style={styles.sectionTitle}>Copyright</Text>
              <Text style={styles.text}>
                © 2025 When Was This? All rights reserved.
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  closeButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
});
