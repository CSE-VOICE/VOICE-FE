// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   routines: [],
//   loading: false,
//   error: null,
// };

// const routineSlice = createSlice({
//   name: 'routine',
//   initialState,
//   reducers: {
//     setRoutines: (state, action) => {
//       state.routines = action.payload;
//     },
//     addRoutine: (state, action) => {
//       state.routines.push(action.payload);
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     removeLastRoutine: (state) => {
//       state.routines.pop();
//     },
//   },
// });

// export const { setRoutines, addRoutine, setLoading, setError, clearError, removeLastRoutine } = routineSlice.actions;

// export const loadRoutines = () => async (dispatch, getState) => {
//   dispatch(setLoading(true));
//   dispatch(clearError());
//   try {
//     const { user } = getState().auth;
//     if (!user || !user.email) {
//       throw new Error('사용자 정보가 없습니다.');
//     }
    
//     const routinesStr = await AsyncStorage.getItem(`routines_${user.email}`);
//     if (!routinesStr) {
//       // 초기 데이터 설정
//       await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify([]));
//       dispatch(setRoutines([]));
//       return;
//     }
    
//     const routines = JSON.parse(routinesStr);
//     dispatch(setRoutines(routines));
//   } catch (error) {
//     console.error('Load routines error:', error);
//     dispatch(setError(error.message || '루틴 불러오기에 실패했습니다.'));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const handleRecommendationResponse = (accept) => async (dispatch, getState) => {
//   if (!accept) {
//     const { routines } = getState().routine;
//     const { user } = getState().auth;
    
//     // 마지막으로 추가된 루틴 제거
//     const updatedRoutines = routines.slice(0, -1);
//     await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify(updatedRoutines));
//     dispatch(removeLastRoutine());
//   }
// };

// export const saveRoutine = (routine) => async (dispatch, getState) => {
//   dispatch(setLoading(true));
//   dispatch(clearError());
//   try {
//     const { user } = getState().auth;
//     if (!user || !user.email) {
//       throw new Error('사용자 정보가 없습니다. 다시 로그인해주세요.');
//     }

//     const routinesStr = await AsyncStorage.getItem(`routines_${user.email}`);
//     let routines = routinesStr ? JSON.parse(routinesStr) : [];
    
//     const newRoutine = {
//       ...routine,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       userId: user.email,
//     };

//     updatedRoutines = [newRoutine, ...routines];
//     await AsyncStorage.setItem(`routines_${user.email}`, JSON.stringify(updatedRoutines));

//     dispatch(setRoutines(updatedRoutines));
//     return newRoutine;
//   } catch (error) {
//     console.error('Save routine error:', error);
//     dispatch(setError(error.message || '루틴 저장에 실패했습니다.'));
//     throw error;
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export default routineSlice.reducer;

// routineSlice.jsx
import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../src/api/config';

const initialState = {
  routines: [],
  currentRecommendation: null,
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
    setCurrentRecommendation: (state, action) => {
      state.currentRecommendation = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRecommendation: (state) => {
      state.currentRecommendation = null;
    }
  },
});

export const {
  setRoutines,
  setCurrentRecommendation,
  setLoading,
  setError,
  clearError,
  clearCurrentRecommendation
} = routineSlice.actions;

// Async actions
export const requestRecommendation = (situation) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
      console.log('Requesting with situation:', situation);

      const response = await api('/ai-pick/recommend?userId=6', 'POST', {
          situation,
      });
      
      console.log('API Response:', response);

      if (!response.success) {
          throw new Error('추천 요청에 실패했습니다.');
      }

      // 추천 요청이 성공하면 바로 추천 데이터를 가져오기
      const recommendationResponse = await dispatch(fetchRecommendation('6'));
      return recommendationResponse;

  } catch (error) {
      console.error('Request error:', error);
      dispatch(setError(error.message || '추천 요청에 실패했습니다.'));
      return null;
  } finally {
      dispatch(setLoading(false));
  }
};

export const fetchRecommendation = (userId) => async (dispatch) => {
  try {
      const response = await api(`/ai-pick/recommend?userId=6`, 'GET');
      console.log('Fetch recommendation response:', response);

      // response.data가 아닌 response 자체를 확인
      if (response && response.routine) {
          dispatch(setCurrentRecommendation(response));
          return response;
      } else if (response && response.data && response.data.routine) {
          // data 객체 안에 있는 경우도 처리
          dispatch(setCurrentRecommendation(response.data));
          return response.data;
      } else {
          throw new Error('추천 데이터가 없습니다.');
      }
  } catch (error) {
      console.error('Fetch error:', error);
      dispatch(setError(error.message || '추천 정보를 불러오는데 실패했습니다.'));
      return null;
  }
};

export const acceptRecommendation = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { currentRecommendation } = getState().routine;
    if (!currentRecommendation) {
      throw new Error('추천 정보가 없습니다.');
    }

    const response = await api('/ai-pick/recommend/accept?userId=6', 'POST', {
      userId: '6'
    });

    // 성공적으로 수락되면 currentRecommendation을 routines에 추가
    if (response.success) {
      const newRoutine = {
        ...currentRecommendation,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      dispatch(setRoutines([newRoutine, ...getState().routine.routines]));
      dispatch(clearCurrentRecommendation());
    }

    return response;
  } catch (error) {
    dispatch(setError('추천 수락에 실패했습니다.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const rejectRecommendation = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api('/ai-pick/recommend/reject?userId=6', 'POST', {
      userId: '6'
    });
    
    dispatch(clearCurrentRecommendation());
    return response;
  } catch (error) {
    dispatch(setError('추천 거절에 실패했습니다.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const refreshRecommendation = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api('/ai-pick/recommend/refresh?userId=6', 'POST', {});
    console.log('Refresh response:', response);
    
    // response.data가 있는 경우와 없는 경우 모두 처리
    if (response.data && response.data.routine) {
      dispatch(setCurrentRecommendation(response.data));
      return response.data;
    } else if (response.routine) {
      dispatch(setCurrentRecommendation(response));
      return response;
    } else {
      throw new Error('추천 데이터가 없습니다.');
    }
  } catch (error) {
    console.error('Refresh recommendation error:', error);
    dispatch(setError('새로운 추천 요청에 실패했습니다.'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export default routineSlice.reducer;