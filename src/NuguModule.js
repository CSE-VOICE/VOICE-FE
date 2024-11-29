import { NativeModules, Platform } from 'react-native';
import { API_BASE_URL } from './api/config';

const LINKING_ERROR =
  `The package 'NuguBridge' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NuguBridge = NativeModules.NuguBridge
  ? NativeModules.NuguBridge
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

const NuguModule = {
  async initialize() {
    if (Platform.OS !== 'ios') {
      throw new Error('NUGU SDK is only supported on iOS platform');
    }

    console.log('NuguBridge available:', !!NativeModules.NuguBridge);
    console.log('Available Native Modules:', Object.keys(NativeModules));

    return new Promise((resolve, reject) => {
      try {
        if (!NuguBridge?.initialize) {
          throw new Error('NuguBridge.initialize is not available');
        }

        NuguBridge.initialize()
          .then(() => {
            console.log('✅ NUGU SDK initialized successfully');
            resolve();
          })
          .catch(error => {
            console.error('❌ NUGU SDK initialization failed:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Failed to call NUGU SDK initialize:', error);
        reject(error);
      }
    });
  },

  async startRecording() {
    if (Platform.OS !== 'ios') {
      throw new Error('NUGU SDK is only supported on iOS platform');
    }

    return new Promise((resolve, reject) => {
      try {
        if (!NuguBridge?.startRecording) {
          throw new Error('NuguBridge.startRecording is not available');
        }

        NuguBridge.startRecording()
          .then(() => {
            console.log('✅ Recording started successfully');
            resolve();
          })
          .catch(error => {
            console.error('❌ Failed to start recording:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Failed to call start recording:', error);
        reject(error);
      }
    });
  },

  async stopRecording() {
    if (Platform.OS !== 'ios') {
      throw new Error('NUGU SDK is only supported on iOS platform');
    }

    return new Promise((resolve, reject) => {
      try {
        if (!NuguBridge?.stopRecording) {
          throw new Error('NuguBridge.stopRecording is not available');
        }

        NuguBridge.stopRecording()
          .then(async result => {
            console.log('✅ Recording stopped successfully');
            
            if (result?.audioPath) {
              try {
                // FormData 객체 생성
                const formData = new FormData();
                const fileName = result.audioPath.split('/').pop(); // 파일명만 추출
                
                formData.append('audio', {
                  uri: `file://${result.audioPath}`,
                  type: 'audio/m4a',
                  name: fileName  // YYYYMMDD_HHMMSS_recording.m4a 형식의 파일명
                });

                // 음성 파일 업로드
                const response = await fetch(`${API_BASE_URL}/voice/upload`, {
                  method: 'POST',
                  body: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });

                const uploadResult = await response.json();
                
                if (!uploadResult.success) {
                  throw new Error(uploadResult.error?.message || 'Failed to upload voice file');
                }

                resolve({
                  audioPath: result.audioPath,
                  sttResult: result.sttResult,
                  wavFile: uploadResult.data.wavFile
                });
              } catch (error) {
                console.error('❌ Failed to upload voice file:', error);
                reject(error);
              }
            } else {
              reject(new Error('No audio path received'));
            }
          })
          .catch(error => {
            console.error('❌ Failed to stop recording:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Failed to call stop recording:', error);
        reject(error);
      }
    });
  }
};

export default NuguModule;