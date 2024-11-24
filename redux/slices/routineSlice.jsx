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
    const response = await api(`/ai-pick/recommend?userId=${userId}`, 'GET');
    console.log('Fetch recommendation response:', response);

    if (response && response.routine) {
      // response 전체를 저장
      dispatch(setCurrentRecommendation(response));
      return response;
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
      userId: '6',
      routine: currentRecommendation.routine,
      updates: currentRecommendation.updates
    });

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
    console.error('Accept error:', error);
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