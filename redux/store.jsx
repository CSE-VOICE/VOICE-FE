import { configureStore } from '@reduxjs/toolkit';
import applianceReducer from './slices/applianceSlice';
import authReducer from './slices/authSlice';
import routineReducer from './slices/routineSlice';
import speakerReducer from './slices/speakerSlice'; // 추가

const store = configureStore({
  reducer: {
    auth: authReducer,
    routine: routineReducer,
    appliance: applianceReducer,
    speaker: speakerReducer, // 추가
  },
});

export default store;
