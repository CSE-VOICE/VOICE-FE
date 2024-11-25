// import Foundation
// import NuguClientKit
// import NuguLoginKit
// import NuguCore
// import NuguAgents
// import AVFoundation

// @objc(NuguBridge)
// class NuguBridge: NSObject {
    
//     private var nuguClient: NuguClient?
//     private let audioSessionManager = AudioSessionManager()
//     private var currentRecordingPath: String?
    
//     @objc static func requiresMainQueueSetup() -> Bool {
//         return false
//     }
    
//     @objc func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
//                          rejecter reject: @escaping RCTPromiseRejectBlock) {
//         AVAudioSession.sharedInstance().requestRecordPermission { [weak self] granted in
//             guard let self = self else { return }
            
//             if granted {
//                 do {
//                     print("🎤 NUGU SDK 초기화 시작")
                    
//                     // NuguClient 설정
//                     let clientBuilder = NuguClient.Builder()
                    
//                     // NUGU 클라이언트 생성
//                     nuguClient = clientBuilder.build()
//                     print("✅ NUGU SDK 초기화 성공")
                    
//                     try audioSessionManager.setCategory(.playAndRecord, mode: .default)
//                     resolve(nil)
//                 } catch {
//                     print("❌ NUGU SDK 초기화 실패: \(error)")
//                     reject("INIT_ERROR", "Failed to initialize NUGU SDK: \(error)", error)
//                 }
//             } else {
//                 print("❌ 마이크 권한이 거부됨")
//                 reject("PERMISSION_ERROR", "Microphone permission denied", nil)
//             }
//         }
//     }

//     @objc func startRecording(_ resolve: @escaping RCTPromiseResolveBlock,
//                              rejecter reject: @escaping RCTPromiseRejectBlock) {
//         guard let client = nuguClient else {
//             reject("NO_CLIENT", "NUGU Client is not initialized", nil)
//             return
//         }
        
//         do {
//             print("🎤 녹음 시작")
//             try audioSessionManager.setActive(true)
            
//             let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
//             currentRecordingPath = (documentsPath as NSString).appendingPathComponent("recording_\(Date().timeIntervalSince1970).m4a")
            
//             client.asrAgent.startRecognition(
//                 initiator: .tap,
//                 completion: { state in
//                     switch state {
//                     case .prepared:
//                         print("✅ 음성인식 준비 완료")
//                         resolve(nil)
//                     case .error(let error):
//                         print("❌ 음성인식 시작 실패: \(error)")
//                         reject("RECORDING_ERROR", "Failed to start recording: \(error)", error)
//                     default:
//                         break
//                     }
//                 }
//             )
//         } catch {
//             print("❌ 오디오 세션 활성화 실패: \(error)")
//             reject("RECORDING_ERROR", "Failed to activate audio session: \(error)", error)
//         }
//     }
    
//     @objc func stopRecording(_ resolve: @escaping RCTPromiseResolveBlock,
//                             rejecter reject: @escaping RCTPromiseRejectBlock) {
//         guard let client = nuguClient else {
//             reject("NO_CLIENT", "NUGU Client is not initialized", nil)
//             return
//         }
        
//         client.asrAgent.stopRecognition()
        
//         let response: [String: Any] = [
//             "audioPath": currentRecordingPath ?? "",
//             "sttResult": ""
//         ]
//         resolve(response)
        
//         do {
//             try audioSessionManager.setActive(false)
//         } catch {
//             print("Warning: Failed to deactivate audio session: \(error)")
//         }
//     }
// }

// private class AudioSessionManager {
//     func setCategory(_ category: AVAudioSession.Category, mode: AVAudioSession.Mode) throws {
//         try AVAudioSession.sharedInstance().setCategory(category, mode: mode, options: [.defaultToSpeaker, .allowBluetooth])
//     }
    
//     func setActive(_ active: Bool) throws {
//         try AVAudioSession.sharedInstance().setActive(active)
//     }
// }


import Foundation
import NuguClientKit
import NuguLoginKit
import NuguCore
import NuguAgents
import AVFoundation

@objc(NuguBridge)
class NuguBridge: NSObject {
    
    private var nuguClient: NuguClient?
    private let audioSessionManager = AudioSessionManager()
    private var currentRecordingPath: String?
    
    // 메인 큐 설정을 true로 변경
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        // 메인 큐에서 실행
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                reject("NO_INSTANCE", "NuguBridge instance is nil", nil)
                return
            }
            
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                if granted {
                    do {
                        print("🎤 NUGU SDK 초기화 시작")
                        
                        // NuguClient 설정
                        let clientBuilder = NuguClient.Builder()
                        
                        // NUGU 클라이언트 생성
                        self.nuguClient = clientBuilder.build()
                        
                        // 오디오 세션 설정
                        try self.audioSessionManager.setCategory(.playAndRecord, mode: .default)
                        
                        print("✅ NUGU SDK 초기화 성공")
                        resolve(nil)
                    } catch {
                        print("❌ NUGU SDK 초기화 실패: \(error)")
                        reject("INIT_ERROR", "Failed to initialize NUGU SDK: \(error.localizedDescription)", error)
                    }
                } else {
                    print("❌ 마이크 권한이 거부됨")
                    reject("PERMISSION_ERROR", "Microphone permission denied", nil)
                }
            }
        }
    }

    @objc func startRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                reject("NO_INSTANCE", "NuguBridge instance is nil", nil)
                return
            }
            
            guard let client = self.nuguClient else {
                reject("NO_CLIENT", "NUGU Client is not initialized", nil)
                return
            }
            
            do {
                // 오디오 세션 활성화
                try self.audioSessionManager.setActive(true)
                
                print("🎤 녹음 시작")
                
                // 녹음 파일 경로 설정
                let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
                self.currentRecordingPath = (documentsPath as NSString).appendingPathComponent("recording_\(Date().timeIntervalSince1970).m4a")
                
                // ASR 에이전트 상태 관찰을 위한 타임아웃 설정
                var stateObserved = false
                let timeout = DispatchTime.now() + 5.0 // 5초 타임아웃
                
                client.asrAgent.startRecognition(
                    initiator: .tap,
                    completion: { state in
                        switch state {
                        case .prepared:
                            if !stateObserved {
                                stateObserved = true
                                print("✅ 음성인식 준비 완료")
                                resolve(nil)
                            }
                        case .error(let error):
                            if !stateObserved {
                                stateObserved = true
                                print("❌ 음성인식 시작 실패: \(error)")
                                reject("RECORDING_ERROR", "Failed to start recording: \(error.localizedDescription)", error)
                            }
                        default:
                            break
                        }
                    }
                )
                
                // 타임아웃 처리
                DispatchQueue.main.asyncAfter(deadline: timeout) {
                    if !stateObserved {
                        print("⚠️ 음성인식 상태 확인 타임아웃")
                        reject("TIMEOUT", "Recognition state observation timed out", nil)
                    }
                }
                
            } catch {
                print("❌ 오디오 세션 활성화 실패: \(error)")
                reject("RECORDING_ERROR", "Failed to activate audio session: \(error.localizedDescription)", error)
            }
        }
    }
    
    @objc func stopRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                reject("NO_INSTANCE", "NuguBridge instance is nil", nil)
                return
            }
            
            guard let client = self.nuguClient else {
                reject("NO_CLIENT", "NUGU Client is not initialized", nil)
                return
            }
            
            client.asrAgent.stopRecognition()
            
            let response: [String: Any] = [
                "audioPath": self.currentRecordingPath ?? "",
                "sttResult": ""
            ]
            
            do {
                try self.audioSessionManager.setActive(false)
            } catch {
                print("⚠️ 오디오 세션 비활성화 실패: \(error)")
                // 오디오 세션 비활성화 실패는 치명적이지 않으므로 경고만 출력
            }
            
            resolve(response)
        }
    }
}

private class AudioSessionManager {
    func setCategory(_ category: AVAudioSession.Category, mode: AVAudioSession.Mode) throws {
        try AVAudioSession.sharedInstance().setCategory(category, mode: mode, options: [.defaultToSpeaker, .allowBluetooth])
    }
    
    func setActive(_ active: Bool) throws {
        try AVAudioSession.sharedInstance().setActive(active)
    }
}