// src/screens/Auth/SignUp.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authStyles from '../../styles/authStyle';

function SignUp({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const userExists = users.some(user => user.email === form.email);

      if (userExists) {
        Alert.alert('이미 가입된 이메일입니다.');
        return;
      }

      users.push(form);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('회원가입이 완료되었습니다.', '로그인 페이지로 이동합니다.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('오류 발생', '다시 시도해주세요.');
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Sign Up</Text>
      <TextInput
        style={authStyles.input}
        placeholder="이름"
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="password"
        secureTextEntry
        onChangeText={(value) => handleInputChange('password', value)}
      />
      <TextInput
        style={authStyles.input}
        placeholder="전화번호"
        keyboardType="phone-pad"
        onChangeText={(value) => handleInputChange('phone', value)}
      />

      <TouchableOpacity style={authStyles.button} onPress={handleSignUp}>
        <Text style={authStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={authStyles.linkText}>이미 회원이신가요? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignUp;

