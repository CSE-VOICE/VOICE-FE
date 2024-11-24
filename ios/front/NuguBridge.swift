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
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        AVAudioSession.sharedInstance().requestRecordPermission { [weak self] granted in
            guard let self = self else { return }
            
            if granted {
                do {
                    print("🎤 NUGU SDK 초기화 시작")
                    
                    // NuguClient 설정
                    let clientBuilder = NuguClient.Builder()
                    
                    // NUGU 클라이언트 생성
                    nuguClient = clientBuilder.build()
                    print("✅ NUGU SDK 초기화 성공")
                    
                    try audioSessionManager.setCategory(.playAndRecord, mode: .default)
                    resolve(nil)
                } catch {
                    print("❌ NUGU SDK 초기화 실패: \(error)")
                    reject("INIT_ERROR", "Failed to initialize NUGU SDK: \(error)", error)
                }
            } else {
                print("❌ 마이크 권한이 거부됨")
                reject("PERMISSION_ERROR", "Microphone permission denied", nil)
            }
        }
    }
    
    @objc func startRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let client = nuguClient else {
            reject("NO_CLIENT", "NUGU Client is not initialized", nil)
            return
        }
        
        do {
            print("🎤 녹음 시작")
            try audioSessionManager.setActive(true)
            
            let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
            currentRecordingPath = (documentsPath as NSString).appendingPathComponent("recording_\(Date().timeIntervalSince1970).m4a")
            
            client.asrAgent.startRecognition(
                initiator: .tap,
                completion: { state in
                    switch state {
                    case .prepared:
                        print("✅ 음성인식 준비 완료")
                        resolve(nil)
                    case .error(let error):
                        print("❌ 음성인식 시작 실패: \(error)")
                        reject("RECORDING_ERROR", "Failed to start recording: \(error)", error)
                    default:
                        break
                    }
                }
            )
        } catch {
            print("❌ 오디오 세션 활성화 실패: \(error)")
            reject("RECORDING_ERROR", "Failed to activate audio session: \(error)", error)
        }
    }
    
    @objc func stopRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let client = nuguClient else {
            reject("NO_CLIENT", "NUGU Client is not initialized", nil)
            return
        }
        
        client.asrAgent.stopRecognition()
        
        let response: [String: Any] = [
            "audioPath": currentRecordingPath ?? "",
            "sttResult": ""
        ]
        resolve(response)
        
        do {
            try audioSessionManager.setActive(false)
        } catch {
            print("Warning: Failed to deactivate audio session: \(error)")
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