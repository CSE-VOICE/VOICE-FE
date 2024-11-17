import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authStyles from '../../styles/authStyle';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth 설정
const CLIENT_ID = '945998147413-m5h18ocr60msn0dqeeuc11k5c39rgj01.apps.googleusercontent.com';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'com.hyungrak.front'
});

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google 로그인 설정
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      iosClientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['profile', 'email']
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    }
  );

  // 기존 이메일 로그인 처리
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        await handleLoginSuccess(user);
        navigation.navigate('LoadPage');
      } else {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      Alert.alert('오류 발생', '다시 시도해주세요.');
    }
  };

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { authentication } = result;
        
        // Google 사용자 정보 가져오기
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );
        
        const googleUser = await userInfoResponse.json();
        
        // 기존 사용자 확인 또는 새 사용자 생성
        const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
        let user = users.find(u => u.email === googleUser.email);
        
        if (!user) {
          // 새 사용자 생성
          user = {
            email: googleUser.email,
            name: googleUser.name,
            profileImage: googleUser.picture, // Google 프로필 이미지
            authProvider: 'google',
            socialId: googleUser.id
          };
          users.push(user);
          await AsyncStorage.setItem('users', JSON.stringify(users));
        }

        await handleLoginSuccess(user);
        navigation.navigate('LoadPage');
      }
    } catch (error) {
      Alert.alert('로그인 실패', '다시 시도해주세요.');
      console.error(error);
    }
  };

  // 로그인 성공 후 공통 처리
  const handleLoginSuccess = async (user) => {
    await AsyncStorage.setItem('userToken', user.email);
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    
    // 사용자별 초기 데이터 생성
    const existingAppliances = await AsyncStorage.getItem(`appliances_${user.email}`);
    if (!existingAppliances) {
      await AsyncStorage.setItem(`appliances_${user.email}`, JSON.stringify([]));
    }

    const existingRoutines = await AsyncStorage.getItem(`routines_${user.email}`);
    if (!existingRoutines) {
      await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify([]));
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Login</Text>
      
      {/* 이메일 로그인 폼 */}
      <TextInput
        style={authStyles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={authStyles.button} onPress={handleEmailLogin}>
        <Text style={authStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* 구글 로그인 버튼 */}
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleLogin}
      >
        <Image 
          source={require('../../assets/google-icon.png')} 
          style={styles.socialIcon}
        />
        <Text style={styles.googleButtonText}>Google로 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={authStyles.linkText}>회원이 아니신가요? 회원 가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});

export default Login;