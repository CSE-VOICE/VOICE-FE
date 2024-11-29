import Foundation
import NuguClientKit
import NuguLoginKit
import NuguCore
import NuguAgents
import AVFoundation
import NuguServiceKit

@objc(NuguBridge)
class NuguBridge: NSObject {
    
    // MARK: - Properties
    private var nuguClient: NuguClient?
    private let audioSessionManager = AudioSessionManager()
    private var currentRecordingPath: String?
    
    // NUGU 관련 속성
    private var keywordDetector: KeywordDetector?
    private var keywordDetectorState: KeywordDetectorState = .inactive
    
    // 오디오 레벨 측정을 위한 속성들
    private let audioEngine = AVAudioEngine()
    private var audioLevel: Float = 0
    private var silenceTimer: Timer?
    private var silenceStartTime: Date?
    private let silenceThreshold: Float = 0.03
    private let maxSilenceDuration: TimeInterval = 3.0
    private var isRecording: Bool = false
    
    // MARK: - React Native Bridge Setup
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    // MARK: - Public Methods
    @objc func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
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
                    
                    // KeywordDetector 설정
                    self.keywordDetector = clientBuilder.keywordDetector
                    self.keywordDetector?.delegate = self
                    
                    // NUGU 클라이언트 생성
                    self.nuguClient = clientBuilder.build()
                    
                    // 오디오 세션 설정
                    try self.audioSessionManager.setCategory(.playAndRecord, mode: .default)
                    
                    print("✅ NUGU SDK 초기화 성공")
                    resolve(nil)
                    
                    // 키워드 감지 시작
                    self.startKeywordDetection()
                    
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
        
        guard !self.isRecording else {
            reject("ALREADY_RECORDING", "Recording is already in progress", nil)
            return
        }
        
        // 키워드 감지 중지
        stopKeywordDetection()
        
        do {
            try self.audioSessionManager.setActive(true)
            print("🎤 녹음 시작")
            
            // 오디오 엔진 설정
            try self.setupAudioEngine()
            
            // 파일 경로 설정
            let fileManager = FileManager.default
            let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
            
            // 현재 날짜 기반 파일명 생성
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyyMMdd_HHmmss"
            let timestamp = dateFormatter.string(from: Date())
            let fileName = "recording.m4a"
            let fullFileName = "\(timestamp)_\(fileName)"
            
            let fileURL = documentsDirectory.appendingPathComponent(fullFileName)
            self.currentRecordingPath = fileURL.path
            
            // 디렉토리 확인 및 생성
            do {
                try fileManager.createDirectory(at: documentsDirectory, withIntermediateDirectories: true, attributes: nil)
                
                // 이미 파일이 존재한다면 삭제
                if fileManager.fileExists(atPath: fileURL.path) {
                    try fileManager.removeItem(at: fileURL)
                }
                print("📁 녹음 파일 경로 준비 완료: \(fileURL.path)")
            } catch {
                print("❌ 녹음 파일 경로 설정 실패: \(error)")
                reject("FILE_SETUP_ERROR", "Failed to setup recording file path: \(error.localizedDescription)", error)
                return
            }
            
            var stateObserved = false
            let timeout = DispatchTime.now() + 5.0
            
            client.asrAgent.startRecognition(
                initiator: .tap,
                completion: { [weak self] state in
                    guard let self = self else { return }
                    
                    switch state {
                    case .prepared:
                        if !stateObserved {
                            stateObserved = true
                            self.isRecording = true
                            self.startSilenceDetection()
                            print("✅ 음성인식 준비 완료")
                            resolve(nil)
                        }
                    case .sent:
                        print("🎤 음성 인식 데이터 전송됨")
                    case .received(let directive):
                        print("✅ 응답 수신됨: \(directive)")
                    case .finished:
                        print("✅ 음성 인식 완료")
                    case .error(let error):
                        if !stateObserved {
                            stateObserved = true
                            self.isRecording = false
                            print("❌ 음성인식 시작 실패: \(error)")
                            reject("RECORDING_ERROR", "Failed to start recording: \(error.localizedDescription)", error)
                        }
                    }
                }
            )
            
            DispatchQueue.main.asyncAfter(deadline: timeout) {
                if !stateObserved {
                    self.isRecording = false
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
            
            guard self.isRecording else {
                reject("NOT_RECORDING", "No active recording session", nil)
                return
            }
            
            // 오디오 엔진 정리
            self.audioEngine.inputNode.removeTap(onBus: 0)
            self.audioEngine.stop()
            
            // 타이머 정리
            self.silenceTimer?.invalidate()
            self.silenceTimer = nil
            
            // 녹음 중지
            client.asrAgent.stopRecognition()
            self.isRecording = false
            
            // 파일 존재 여부 확인
            let fileManager = FileManager.default
            let response: [String: Any] = [
                "audioPath": self.currentRecordingPath ?? "",
                "sttResult": "",
                "exists": fileManager.fileExists(atPath: self.currentRecordingPath ?? "")
            ]
            
            do {
                try self.audioSessionManager.setActive(false)
                print("✅ 녹음 중지 완료")
                print("📁 녹음 파일 경로: \(self.currentRecordingPath ?? "없음")")
                
                // 키워드 감지 다시 시작
                self.startKeywordDetection()
                
                resolve(response)
            } catch {
                print("⚠️ 오디오 세션 비활성화 실패: \(error)")
                resolve(response)
            }
        }
    }
    
    private func setupAudioEngine() throws {
    let inputNode = audioEngine.inputNode
    let recordingFormat = inputNode.outputFormat(forBus: 0)
    
    // AudioFile 생성
    let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyyMMdd_HHmmss"
    let timestamp = dateFormatter.string(from: Date())
    let fileName = "\(timestamp)_recording.m4a"
    let audioURL = documentsPath.appendingPathComponent(fileName)
    
    // 이미 파일이 존재한다면 삭제
    try? FileManager.default.removeItem(at: audioURL)
    
    let audioFile = try AVAudioFile(forWriting: audioURL, settings: recordingFormat.settings)
    self.currentRecordingPath = audioURL.path
    
    // 오디오 탭 설정
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { [weak self] buffer, _ in
        guard let self = self else { return }
        
        // 버퍼를 파일에 기록
        try? audioFile.write(from: buffer)
        
        // 오디오 레벨 계산
        let channelData = buffer.floatChannelData?[0]
        let frameLength = UInt32(buffer.frameLength)
        
        var sum: Float = 0
        for i in 0..<Int(frameLength) {
            sum += fabsf(channelData?[i] ?? 0)
        }
        
        self.audioLevel = sum / Float(frameLength)
    }
    
    try audioEngine.start()
}
    
    // MARK: - Private Methods - Silence Detection
    private func startSilenceDetection() {
        silenceStartTime = nil
        silenceTimer?.invalidate()
        
        silenceTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self, self.isRecording else { return }
            self.handleAudioLevel(self.audioLevel)
        }
    }
    
    private func handleAudioLevel(_ level: Float) {
        if level < silenceThreshold {
            if silenceStartTime == nil {
                silenceStartTime = Date()
            } else if let startTime = silenceStartTime {
                let silenceDuration = Date().timeIntervalSince(startTime)
                if silenceDuration >= maxSilenceDuration {
                    stopRecordingDueToSilence()
                }
            }
        } else {
            silenceStartTime = nil
        }
    }
    
    private func stopRecordingDueToSilence() {
        guard isRecording else { return }
        
        print("🔇 3초 동안 묵음 감지됨 - 녹음 중지")
        stopRecording({ _ in
            print("✅ 녹음 자동 중지 완료")
        }, rejecter: { code, message, error in
            print("❌ 녹음 자동 중지 실패: \(message)")
        })
    }
    
    // MARK: - Private Methods - Keyword Detection
    private func startKeywordDetection() {
        keywordDetector?.start()
        print("✅ 키워드 감지 시작")
    }
    
    private func stopKeywordDetection() {
        keywordDetector?.stop()
        print("⏹ 키워드 감지 중지")
    }
    
    deinit {
        audioEngine.stop()
        silenceTimer?.invalidate()
        keywordDetector?.stop()
    }
}

// MARK: - KeywordDetectorDelegate
extension NuguBridge: KeywordDetectorDelegate {
    func keywordDetectorDidDetect(keyword: String?, data: Data, start: Int, end: Int, detection: Int) {
        print("🎯 키워드 감지됨: \(keyword ?? "unknown")")
        
        // 키워드 감지 후 ASR 시작
        nuguClient?.asrAgent.startRecognition(
            initiator: .wakeUpWord(keyword: keyword, data: data, start: start, end: end, detection: detection),
            completion: { [weak self] state in
                switch state {
                case .prepared:
                    print("👂 음성 인식 준비 중...")
                case .sent:
                    print("🎤 음성 인식 데이터 전송됨")
                case .received(let directive):
                    print("✅ 응답 수신됨: \(directive)")
                case .finished:
                    print("✅ 음성 인식 완료")
                case .error(let error):
                    print("❌ 음성 인식 실패: \(error)")
                }
            }
        )
    }
    
    func keywordDetectorDidError(_ error: Error) {
        print("❌ 키워드 감지 오류: \(error.localizedDescription)")
    }
    
    func keywordDetectorStateDidChange(_ state: KeywordDetectorState) {
        keywordDetectorState = state
        print("🔄 키워드 감지 상태 변경: \(state)")
    }
}

// MARK: - Audio Session Manager
private class AudioSessionManager {
    func setCategory(_ category: AVAudioSession.Category, mode: AVAudioSession.Mode) throws {
        try AVAudioSession.sharedInstance().setCategory(category, mode: mode, options: [.defaultToSpeaker, .allowBluetooth])
    }
    
    func setActive(_ active: Bool) throws {
        try AVAudioSession.sharedInstance().setActive(active)
    }
}
