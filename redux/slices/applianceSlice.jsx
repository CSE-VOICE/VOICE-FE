import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../src/api/config';

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
            console.log('Setting appliances in reducer:', action.payload);
            if (Array.isArray(action.payload)) {
                state.appliances = action.payload;
                state.error = null;
            } else {
                console.error('Invalid payload for setAppliances:', action.payload);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.appliances = []; // 에러 발생 시 appliances 초기화
            state.loading = false;
        },
        updateApplianceState: (state, action) => {
            const updatedAppliance = action.payload;
            const index = state.appliances.findIndex(app => app.id === updatedAppliance.id);
            if (index !== -1) {
                state.appliances[index] = {
                    ...state.appliances[index],
                    ...updatedAppliance
                };
            }
        },
    },
});

export const {
    setAppliances,
    setLoading,
    setError,
    updateApplianceState,
} = applianceSlice.actions;


// // Async action creators
// export const loadAppliances = () => async (dispatch, getState) => {
//   dispatch(setLoading(true));
//   try {
//     const userId = getState().auth.user?.id;
//     if (!userId) throw new Error('사용자 정보가 없습니다.');
    
//     const response = await api(`/appliances?userId=${userId}`, 'GET');
//     dispatch(setAppliances(response.data.appliances));
//   } catch (error) {
//     dispatch(setError('기기 목록을 불러오는데 실패했습니다.'));
//     console.error('Load appliances error:', error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const getApplianceStatus = (applianceId) => async (dispatch, getState) => {
//   dispatch(setLoading(true));
//   try {
//     const userId = getState().auth.user?.id;
//     if (!userId) throw new Error('사용자 정보가 없습니다.');

//     const response = await api(`/appliances/${applianceId}?userId=${userId}`, 'GET');
//     dispatch(updateApplianceState(response.data));
//     return response.data;
//   } catch (error) {
//     dispatch(setError('기기 상태 조회에 실패했습니다.'));
//     console.error('Get appliance status error:', error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const updateAppliances = (updates) => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const response = await api('/appliances', 'PATCH', { updates });
//     response.data.forEach(updatedAppliance => {
//       dispatch(updateApplianceState(updatedAppliance));
//     });
//     return response.data;
//   } catch (error) {
//     dispatch(setError('기기 상태 변경에 실패했습니다.'));
//     console.error('Update appliances error:', error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };


export const loadAppliances = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
      const response = await api(`/appliances?userId=6`, 'GET');
      
      // response가 이미 data 객체이거나 배열일 수 있으므로
      if (response) {
          dispatch(setAppliances(Array.isArray(response) ? response : response.data));
      } else {
          console.error('Invalid response:', response);
          dispatch(setError('데이터를 불러올 수 없습니다.'));
      }
  } catch (error) {
      console.error('Load appliances error:', error);
      dispatch(setError('기기 목록을 불러오는데 실패했습니다.'));
  } finally {
      dispatch(setLoading(false));
  }
};

// 개별 기기 상태 조회도 수정
export const getApplianceStatus = (applianceId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userId = 6; // 임시로 하드코딩
    const response = await api(`/appliances/${applianceId}?userId=${userId}`, 'GET');
    if (response.data) {
      dispatch(updateApplianceState(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Get appliance status error:', error);
    dispatch(setError('기기 상태 조회에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// 상태 업데이트도 수정
export const updateAppliances = (updates) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userId = 6; // 임시로 하드코딩
    const response = await api('/appliances', 'PATCH', {
      updates,
      userId
    });

    if (response.data) {
      response.data.forEach(updatedAppliance => {
        dispatch(updateApplianceState(updatedAppliance));
      });
    }
    return response.data;
  } catch (error) {
    console.error('Update appliances error:', error);
    dispatch(setError('기기 상태 변경에 실패했습니다.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default applianceSlice.reducer;