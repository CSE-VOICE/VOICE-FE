import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import authStyles from '../../styles/authStyle';

function SignUp({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }
  
    try {
      console.log('회원가입 시도:', form);
      const success = await dispatch(signup(form));
      console.log('회원가입 결과:', success);
      
      if (success) {
        Alert.alert(
          '회원가입 성공',
          '로그인 페이지로 이동합니다.',
          [
            {
              text: '확인',
              onPress: () => {
                setTimeout(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }, 100);
              }
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류:', error);
      Alert.alert('회원가입 실패', '잠시 후 다시 시도해주세요.');
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
        placeholder="Password"
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