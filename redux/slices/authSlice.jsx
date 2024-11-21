import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../src/api/config';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
    const data = await api('/auth/login', 'POST', {
      email,
      pwd: password,
      login_type: 'local'
    });
    
    await AsyncStorage.setItem('currentUser', JSON.stringify(data));
    await AsyncStorage.setItem('userToken', data.email);
    dispatch(loginSuccess(data));
    return true;
  } catch (error) {
    dispatch(setError(error.message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const signup = (userData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api('/auth/signup', 'POST', {
      email: userData.email,
      pwd: userData.password,
      phone: userData.phone,
      name: userData.name,
      login_type: 'local'
    });

    console.log('회원가입 응답:', response);
    
    // 응답이 있으면 성공으로 처리
    if (response) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('회원가입 에러:', error);
    dispatch(setError(error?.message || '회원가입 중 오류가 발생했습니다.'));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const googleLogin = (googleUser) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await api('/auth/login-sns', 'POST', {
      email: googleUser.email,
      name: googleUser.name,
      login_type: 'google',
    });

    await AsyncStorage.setItem('currentUser', JSON.stringify(data));
    await AsyncStorage.setItem('userToken', data.email);
    dispatch(loginSuccess(data));
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

export default authSlice.reducer;