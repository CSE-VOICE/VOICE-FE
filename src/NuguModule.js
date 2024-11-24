// import { NativeModules, Platform } from 'react-native';

// // NUGU SDK와의 인터페이스를 제공하는 모듈
// const NuguModule = {
//   async initialize() {
//     // iOS 플랫폼 체크
//     if (Platform.OS !== 'ios') {
//       throw new Error('NUGU SDK is only supported on iOS platform');
//     }

//     return new Promise((resolve, reject) => {
//       try {
//         // iOS Native Module 호출
//         NativeModules.NuguBridge.initialize()
//           .then(() => {
//             console.log('NUGU SDK initialized successfully');
//             resolve();
//           })
//           .catch(error => {
//             console.error('NUGU SDK initialization failed:', error);
//             reject(error);
//           });
//       } catch (error) {
//         console.error('Failed to call NUGU SDK initialize:', error);
//         reject(error);
//       }
//     });
//   },

//   async startRecording() {
//     if (Platform.OS !== 'ios') {
//       throw new Error('NUGU SDK is only supported on iOS platform');
//     }

//     return new Promise((resolve, reject) => {
//       try {
//         // iOS Native Module 호출
//         NativeModules.NuguBridge.startRecording()
//           .then(() => {
//             console.log('Recording started successfully');
//             resolve();
//           })
//           .catch(error => {
//             console.error('Failed to start recording:', error);
//             reject(error);
//           });
//       } catch (error) {
//         console.error('Failed to call start recording:', error);
//         reject(error);
//       }
//     });
//   },

//   async stopRecording() {
//     if (Platform.OS !== 'ios') {
//       throw new Error('NUGU SDK is only supported on iOS platform');
//     }

//     return new Promise((resolve, reject) => {
//       try {
//         // iOS Native Module 호출
//         NativeModules.NuguBridge.stopRecording()
//           .then(result => {
//             console.log('Recording stopped successfully');
//             resolve({
//               audioPath: result?.audioPath || '',
//               sttResult: result?.sttResult || ''
//             });
//           })
//           .catch(error => {
//             console.error('Failed to stop recording:', error);
//             reject(error);
//           });
//       } catch (error) {
//         console.error('Failed to call stop recording:', error);
//         reject(error);
//       }
//     });
//   }
// };

// export default NuguModule;


import { NativeModules, Platform } from 'react-native';

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
            console.log('NUGU SDK initialized successfully');
            resolve();
          })
          .catch(error => {
            console.error('NUGU SDK initialization failed:', error);
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
            console.log('Recording started successfully');
            resolve();
          })
          .catch(error => {
            console.error('Failed to start recording:', error);
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
          .then(result => {
            console.log('Recording stopped successfully');
            resolve({
              audioPath: result?.audioPath || '',
              sttResult: result?.sttResult || ''
            });
          })
          .catch(error => {
            console.error('Failed to stop recording:', error);
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