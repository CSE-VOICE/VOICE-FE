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