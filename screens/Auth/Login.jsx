import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { googleLogin, login } from '../../redux/slices/authSlice';
import authStyles from '../../styles/authStyle';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '945998147413-m5h18ocr60msn0dqeeuc11k5c39rgj01.apps.googleusercontent.com';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'com.hyungrak.front'
});

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

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

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const success = await dispatch(login(email, password));
      if (success) {
        navigation.navigate('LoadPage');
      }
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { authentication } = result;
        
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );
        
        const googleUser = await userInfoResponse.json();
        const success = await dispatch(googleLogin(googleUser));
        
        if (success) {
          navigation.navigate('LoadPage');
        }
      }
    } catch (error) {
      Alert.alert('로그인 실패', '다시 시도해주세요.');
      console.error(error);
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Login</Text>
      
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