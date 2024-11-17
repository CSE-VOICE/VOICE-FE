import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

export const LoadingOverlay = ({ visible }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>분석 중...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    minWidth: 150,
  },
  spinner: {
    transform: [{ scale: 3.0 }],
  },
  loadingText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
});