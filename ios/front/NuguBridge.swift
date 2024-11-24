import Foundation
import NuguClientKit
import NuguLoginKit
import AVFoundation

@objc(NuguBridge)
class NuguBridge: NSObject {
    
    private var nuguClient: NuguClient?
    private let audioSessionManager = AudioSessionManager()
    private var currentRecordingPath: String?
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:withRejecter:)
    func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {
        // 마이크 권한 체크를 비동기로 수행
        AVAudioSession.sharedInstance().requestRecordPermission { [weak self] granted in
            guard let self = self else { return }
            
            if granted {
                do {
                    print("🎤 NUGU SDK 초기화 시작")
                    let capability = NuguCapability(category: .basicPlayer, version: "1.0")
                    let clientBuilder = NuguClient.Builder()
                        .audioConfiguration(AudioConfiguration())
                        .capability(capability)
                    
                    nuguClient = try clientBuilder.build()
                    print("✅ NUGU SDK 초기화 성공")
                    
                    try audioSessionManager.setCategory(.playAndRecord, mode: .default)
                    resolve(nil)
                } catch {
                    print("❌ NUGU SDK 초기화 실패: \(error.localizedDescription)")
                    reject("INIT_ERROR", "Failed to initialize NUGU SDK: \(error.localizedDescription)", error)
                }
            } else {
                print("❌ 마이크 권한이 거부됨")
                reject("PERMISSION_ERROR", "Microphone permission denied", nil)
            }
        }
    }

    @objc(startRecording:withRejecter:)
    func startRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let client = nuguClient else {
            print("❌ NUGU Client가 초기화되지 않음")
            reject("NO_CLIENT", "NUGU Client is not initialized", nil)
            return
        }
        
        do {
            print("🎤 녹음 시작")
            try audioSessionManager.setActive(true)
            
            // 녹음 파일 경로 설정
            let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
            currentRecordingPath = (documentsPath as NSString).appendingPathComponent("recording_\(Date().timeIntervalSince1970).m4a")
            
            client.asrAgent.startRecognition { result in
                switch result {
                case .success:
                    print("✅ 녹음 시작 성공: \(self.currentRecordingPath ?? "")")
                    resolve(nil)
                case .failure(let error):
                    print("❌ 녹음 시작 실패: \(error.localizedDescription)")
                    reject("RECORDING_ERROR", "Failed to start recording: \(error.localizedDescription)", error)
                }
            }
        } catch {
            print("❌ 오디오 세션 활성화 실패: \(error.localizedDescription)")
            reject("RECORDING_ERROR", "Failed to activate audio session: \(error.localizedDescription)", error)
        }
    }
    
    @objc(stopRecording:withRejecter:)
    func stopRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let client = nuguClient else {
            reject("NO_CLIENT", "NUGU Client is not initialized", nil)
            return
        }
        
        client.asrAgent.stopRecognition { result in
            switch result {
            case .success(let text):
                print("✅ 녹음 중지 성공")
                // 녹음 파일 경로와 STT 결과를 함께 반환
                let response: [String: Any] = [
                    "audioPath": self.currentRecordingPath ?? "",
                    "sttResult": text ?? ""
                ]
                resolve(response)
            case .failure(let error):
                print("❌ 녹음 중지 실패: \(error.localizedDescription)")
                reject("RECORDING_ERROR", "Failed to stop recording: \(error.localizedDescription)", error)
            }
        }
        
        do {
            try audioSessionManager.setActive(false)
        } catch {
            print("Warning: Failed to deactivate audio session: \(error.localizedDescription)")
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