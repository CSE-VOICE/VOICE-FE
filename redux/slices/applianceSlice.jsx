import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appliances: [],
  loading: false,
  error: null,
};

const applianceSlice = createSlice({
  name: 'appliance',
  initialState,
  reducers: {
    setAppliances: (state, action) => {
      state.appliances = action.payload;
    },
    addAppliance: (state, action) => {
      state.appliances.push(action.payload);
    },
    deleteAppliance: (state, action) => {
      state.appliances = state.appliances.filter(appliance => appliance.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateAppliance: (state, action) => {
      const index = state.appliances.findIndex((appliance) => appliance.id === action.payload.id);
      if (index !== -1) {
        state.appliances[index] = { ...state.appliances[index], ...action.payload };
      }
    },
  },
});

export const {
  setAppliances,
  addAppliance,
  deleteAppliance,
  setLoading,
  setError,
  updateAppliance,
} = applianceSlice.actions;

// Async action creators
export const loadAppliances = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const appliances = JSON.parse(await AsyncStorage.getItem('@appliances')) || [];
    dispatch(setAppliances(appliances));
  } catch (error) {
    dispatch(setError('기기 목록을 불러오는데 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveAppliance = (appliance) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { appliances } = getState().appliance;
    const updatedAppliances = [...appliances, appliance];
    await AsyncStorage.setItem('@appliances', JSON.stringify(updatedAppliances));
    dispatch(addAppliance(appliance));
  } catch (error) {
    dispatch(setError('기기 저장에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeAppliance = (id) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { appliances } = getState().appliance;
    const updatedAppliances = appliances.filter(appliance => appliance.id !== id);
    await AsyncStorage.setItem('@appliances', JSON.stringify(updatedAppliances));
    dispatch(deleteAppliance(id));
  } catch (error) {
    dispatch(setError('기기 삭제에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default applianceSlice.reducer;
