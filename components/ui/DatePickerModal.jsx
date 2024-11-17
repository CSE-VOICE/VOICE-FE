// src/components/ui/DatePickerModal.jsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Button, Modal, View } from 'react-native';

function DatePickerModal({ visible, onConfirm, onCancel, date }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <DateTimePicker
          mode="date"
          display="calendar"
          value={date || new Date()} // 초기값으로 현재 날짜를 설정
          onChange={(event, selectedDate) => {
            if (event.type === 'set') {
              onConfirm(selectedDate || new Date());
            } else {
              onCancel();
            }
          }}
        />
        <Button title="취소" onPress={onCancel} />
      </View>
    </Modal>
  );
}

export default DatePickerModal;
