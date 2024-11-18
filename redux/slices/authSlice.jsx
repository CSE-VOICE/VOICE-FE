import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // 현재 로그인한 사용자 정보
  isAuthenticated: false, // 인증 여부
  loading: false, // 로딩 상태
  error: null, // 오류 메시지
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserInfo: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setLoading, setError, loginSuccess, logoutSuccess, updateUserInfo } = authSlice.actions;

// 비동기 액션 생성자
export const loadUser = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userString = await AsyncStorage.getItem('currentUser');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(logoutSuccess());
    }
  } catch (error) {
    dispatch(setError('사용자 데이터를 불러오는 데 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', user.email); // 간단한 토큰 저장
      dispatch(loginSuccess(user));
      return true;
    } else {
      dispatch(setError('이메일 또는 비밀번호가 일치하지 않습니다.'));
      return false;
    }
  } catch (error) {
    dispatch(setError('로그인 중 오류가 발생했습니다.'));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const googleLogin = (googleUser) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
    let user = users.find((u) => u.email === googleUser.email);
    if (!user) {
      user = {
        email: googleUser.email,
        name: googleUser.name,
        profileImage: googleUser.picture,
        authProvider: 'google',
        socialId: googleUser.id,
      };
      users.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }

    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    await AsyncStorage.setItem('userToken', user.email);
    dispatch(loginSuccess(user));
    return true;
  } catch (error) {
    dispatch(setError('Google 로그인 중 오류가 발생했습니다.'));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('currentUser');
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(setError('로그아웃 중 오류가 발생했습니다.'));
  }
};

export const updatePassword = (currentPassword, newPassword) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { user } = getState().auth;
    const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (users[userIndex].password !== currentPassword) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }

    users[userIndex].password = newPassword;
    await AsyncStorage.setItem('users', JSON.stringify(users));

    const updatedUser = { ...user, password: newPassword };
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));

    dispatch(updateUserInfo({ password: newPassword }));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
