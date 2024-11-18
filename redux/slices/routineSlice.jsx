import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routines: [],
  loading: false,
  error: null,
};

const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    setRoutines: (state, action) => {
      state.routines = action.payload;
    },
    addRoutine: (state, action) => {
      state.routines.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeLastRoutine: (state) => {
      state.routines.pop();
    },
  },
});

export const { setRoutines, addRoutine, setLoading, setError, clearError, removeLastRoutine } = routineSlice.actions;

export const loadRoutines = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  try {
    const { user } = getState().auth;
    if (!user || !user.email) {
      throw new Error('사용자 정보가 없습니다.');
    }
    
    const routinesStr = await AsyncStorage.getItem(`routines_${user.email}`);
    if (!routinesStr) {
      // 초기 데이터 설정
      await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify([]));
      dispatch(setRoutines([]));
      return;
    }
    
    const routines = JSON.parse(routinesStr);
    dispatch(setRoutines(routines));
  } catch (error) {
    console.error('Load routines error:', error);
    dispatch(setError(error.message || '루틴 불러오기에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const handleRecommendationResponse = (accept) => async (dispatch, getState) => {
  if (!accept) {
    const { routines } = getState().routine;
    const { user } = getState().auth;
    
    // 마지막으로 추가된 루틴 제거
    const updatedRoutines = routines.slice(0, -1);
    await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify(updatedRoutines));
    dispatch(removeLastRoutine());
  }
};

export const saveRoutine = (routine) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  try {
    const { user } = getState().auth;
    if (!user || !user.email) {
      throw new Error('사용자 정보가 없습니다. 다시 로그인해주세요.');
    }

    const routinesStr = await AsyncStorage.getItem(`routines_${user.email}`);
    let routines = routinesStr ? JSON.parse(routinesStr) : [];
    
    const newRoutine = {
      ...routine,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.email,
    };

    updatedRoutines = [newRoutine, ...routines];
    await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify(updatedRoutines));

    dispatch(setRoutines(updatedRoutines));
    return newRoutine;
  } catch (error) {
    console.error('Save routine error:', error);
    dispatch(setError(error.message || '루틴 저장에 실패했습니다.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default routineSlice.reducer;