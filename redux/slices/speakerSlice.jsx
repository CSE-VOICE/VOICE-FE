// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// // 초기 상태
// const initialState = {
//   speaker: null,
//   loading: false,
//   error: null,
// };

// // AsyncThunk: 스피커 검색
// export const searchSpeaker = createAsyncThunk(
//   'speaker/search',
//   async (_, { rejectWithValue }) => {
//     try {
//       // 스피커 검색 API 호출 예시
//       const response = await fetch('https://api.example.com/speaker/search');
//       if (!response.ok) throw new Error('스피커를 검색할 수 없습니다.');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // AsyncThunk: 스피커 연결
// export const connectSpeaker = createAsyncThunk(
//   'speaker/connect',
//   async ({ speakerId }, { rejectWithValue }) => {
//     try {
//       // 스피커 연결 API 호출 예시
//       const response = await fetch(`https://api.example.com/speaker/connect/${speakerId}`, {
//         method: 'POST',
//       });
//       if (!response.ok) throw new Error('스피커 연결에 실패했습니다.');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // SpeakerSlice
// const speakerSlice = createSlice({
//   name: 'speaker',
//   initialState,
//   reducers: {
//     clearSpeakerState: (state) => {
//       state.speaker = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // 검색 로딩 중
//     builder.addCase(searchSpeaker.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     // 검색 성공
//     builder.addCase(searchSpeaker.fulfilled, (state, action) => {
//       state.loading = false;
//       state.speaker = action.payload;
//     });
//     // 검색 실패
//     builder.addCase(searchSpeaker.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });
//     // 연결 로딩 중
//     builder.addCase(connectSpeaker.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     // 연결 성공
//     builder.addCase(connectSpeaker.fulfilled, (state, action) => {
//       state.loading = false;
//       state.speaker = action.payload;
//     });
//     // 연결 실패
//     builder.addCase(connectSpeaker.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });
//   },
// });

// export const { clearSpeakerState } = speakerSlice.actions;

// export default speakerSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NativeModules } from 'react-native';

const { NuguBridge } = NativeModules;

const initialState = {
  speaker: {
    id: "trial.common.sdk",  // NuguConfiguration.pocId 값
    name: "NUGU 스피커",
    connected: false
  },
  loading: false,
  error: null,
};

export const initializeNugu = createAsyncThunk(
  'speaker/initialize',
  async (_, { rejectWithValue }) => {
    try {
      await NuguBridge.initialize();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const connectSpeaker = createAsyncThunk(
  'speaker/connect',
  async (_, { rejectWithValue }) => {
    try {
      await NuguBridge.initialize(); // 스피커 연결을 포함한 초기화
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const speakerSlice = createSlice({
  name: 'speaker',
  initialState,
  reducers: {
    clearSpeakerState: (state) => {
      state.speaker.connected = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 초기화
    builder.addCase(initializeNugu.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initializeNugu.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(initializeNugu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // 연결
    builder.addCase(connectSpeaker.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(connectSpeaker.fulfilled, (state) => {
      state.loading = false;
      state.speaker.connected = true;
    });
    builder.addCase(connectSpeaker.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.speaker.connected = false;
    });
  },
});

export const { clearSpeakerState } = speakerSlice.actions;
export default speakerSlice.reducer;