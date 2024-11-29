import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../src/api/config';

const initialState = {
  routines: [],
  currentRoutine: null,
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
    setCurrentRoutine: (state, action) => {
      state.currentRoutine = action.payload;
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
    },
    removeRoutine: (state, action) => {
      state.routines = state.routines.filter(routine => routine.routine_id !== action.payload);
      if (state.currentRoutine?.id === action.payload) {
        state.currentRoutine = null;
      }
    }
  },
});

export const {
  setRoutines,
  setCurrentRoutine,
  setCurrentRecommendation,
  setLoading,
  setError,
  clearError,
  clearCurrentRecommendation,
  removeRoutine
} = routineSlice.actions;

// AI 루틴 추천 요청
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

// 현재 추천 조회
export const fetchRecommendation = (userId) => async (dispatch) => {
  try {
    const response = await api(`/ai-pick/recommend?userId=${userId}`, 'GET');
    console.log('Fetch recommendation response:', response);

    if (response && response.routine) {
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

// 추천 수락
// routineSlice.jsx의 acceptRecommendation 함수 수정
export const acceptRecommendation = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { currentRecommendation } = getState().routine;
    if (!currentRecommendation) {
      throw new Error('추천 정보가 없습니다.');
    }

    const response = await api('/ai-pick/recommend/accept?userId=6', 'POST', {
      routine: currentRecommendation.routine,
      updates: currentRecommendation.updates
    });

    if (response && response.success) {
      // 여기서 루틴 목록을 새로 불러오도록 수정
      await dispatch(fetchRoutines());
      dispatch(clearCurrentRecommendation());
      return response;
    }
  } catch (error) {
    console.error('Accept error:', error);
    dispatch(setError('추천 수락에 실패했습니다.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// 추천 거절
export const rejectRecommendation = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api('/ai-pick/recommend/reject?userId=6', 'POST');
    
    dispatch(clearCurrentRecommendation());
    return response;
  } catch (error) {
    dispatch(setError('추천 거절에 실패했습니다.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// 추천 새로고침
export const refreshRecommendation = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api('/ai-pick/recommend/refresh?userId=6', 'POST', {});
    console.log('Refresh response:', response);
    
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

export const fetchRoutines = (searchKeyword = '') => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const endpoint = searchKeyword
      ? `/mypage/histories?userId=6&keyword=${encodeURIComponent(searchKeyword)}`
      : '/mypage/histories?userId=6';
    
    const response = await api(endpoint, 'GET');
    console.log('Fetched routines response:', response); // 응답 확인용 로그

    // response가 직접 배열이거나 응답에 데이터가 있는 경우를 모두 처리
    const routinesData = Array.isArray(response) ? response : response.data;
    
    if (routinesData) {
      dispatch(setRoutines(routinesData));
      return routinesData;
    } else {
      // 빈 배열로 설정하여 "저장된 루틴이 없습니다" 메시지가 표시되도록 함
      dispatch(setRoutines([]));
      return [];
    }
  } catch (error) {
    console.error('Fetch routines error details:', error);
    dispatch(setError('루틴 목록을 불러오는데 실패했습니다.'));
    // 에러 발생 시에도 빈 배열 설정
    dispatch(setRoutines([]));
    return [];
  } finally {
    dispatch(setLoading(false));
  }
};

// 특정 루틴 상세 조회
export const fetchRoutineDetail = (routineId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    console.log('Fetching routine detail for ID:', routineId);
    const response = await api(`/mypage/histories/${routineId}?userId=6`, 'GET');
    console.log('Routine detail response:', response);

    if (response && (response.data || response)) {
      const routineData = response.data || response;
      dispatch(setCurrentRoutine(routineData));
      return routineData;
    } else {
      throw new Error('루틴 상세 정보가 없습니다.');
    }
  } catch (error) {
    console.error('Fetch routine detail error:', error);
    dispatch(setError('루틴 상세 정보를 불러오는데 실패했습니다.'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

// 특정 루틴 실행
export const executeRoutine = (routineId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api(`/mypage/histories/${routineId}/execute?userId=6`, 'POST');
    return response;
  } catch (error) {
    console.error('Execute routine error:', error);
    dispatch(setError('루틴 실행에 실패했습니다.'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

// 특정 루틴 삭제
export const deleteRoutine = (routineId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api(`/mypage/histories/${routineId}?userId=6`, 'DELETE');
    dispatch(removeRoutine(routineId));
    return response;
  } catch (error) {
    console.error('Delete routine error:', error);
    dispatch(setError('루틴 삭제에 실패했습니다.'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export default routineSlice.reducer;