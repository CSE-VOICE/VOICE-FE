// // src/screens/Auth/Login.jsx
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useState } from 'react';
// import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import authStyles from '../../styles/authStyle';

// function Login({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('이메일과 비밀번호를 입력해주세요.');
//       return;
//     }

//     try {
//       const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
//       const user = users.find(user => user.email === email && user.password === password);

//       if (user) {
//         await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
//         // Alert.alert('로그인 성공');
//         navigation.navigate('LoadPage'); // 로그인 성공 시 LoadPage로 이동
//       } else {
//         Alert.alert('로그인 실패', '이메일 또는 비밀번호가 일치하지 않습니다.');
//       }
//     } catch (error) {
//       Alert.alert('오류 발생', '다시 시도해주세요.');
//     }
//   };

//   return (
//     <View style={authStyles.container}>
//       <Text style={authStyles.title}>Login</Text>
//       <TextInput
//         style={authStyles.input}
//         placeholder="E-mail"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         onChangeText={(value) => setEmail(value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="password"
//         secureTextEntry
//         onChangeText={(value) => setPassword(value)}
//       />
//       <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
//         <Text style={authStyles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//         <Text style={authStyles.linkText}>회원이 아니신가요? 회원 가입</Text>
//       </TouchableOpacity>
//       <TouchableOpacity>
//         <Text style={authStyles.linkText}>아이디 / 비밀번호 찾기</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default Login;


import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import authStyles from '../../styles/authStyle';

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        await AsyncStorage.setItem('userToken', user.email);
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        
        // 최초 로그인시 사용자별 초기 데이터 생성
        const existingAppliances = await AsyncStorage.getItem(`appliances_${user.email}`);
        if (!existingAppliances) {
          await AsyncStorage.setItem(`appliances_${user.email}`, JSON.stringify([]));
        }

        const existingRoutines = await AsyncStorage.getItem(`routines_${user.email}`);
        if (!existingRoutines) {
          await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify([]));
        }

        navigation.navigate('LoadPage');
      } else {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      Alert.alert('오류 발생', '다시 시도해주세요.');
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
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
        <Text style={authStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={authStyles.linkText}>회원이 아니신가요? 회원 가입</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;