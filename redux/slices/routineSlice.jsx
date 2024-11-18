import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routines: [], // 루틴 목록
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
  },
});

export const { setRoutines, addRoutine, setLoading, setError } = routineSlice.actions;

// Async action creators
export const loadRoutines = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { user } = getState().auth;
    const routines = JSON.parse(await AsyncStorage.getItem(`routines_${user.email}`)) || [];
    dispatch(setRoutines(routines));
  } catch (error) {
    dispatch(setError('루틴 불러오기에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveRoutine = (routine) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { user } = getState().auth;
    const routines = [...getState().routine.routines];
    const newRoutine = {
      ...routine,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    routines.push(newRoutine);
    await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify(routines));
    dispatch(addRoutine(newRoutine));
  } catch (error) {
    dispatch(setError('루틴 저장에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default routineSlice.reducer;
