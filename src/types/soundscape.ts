export type SoundEffectId = 'rain' | 'tick' | 'thunder' | 'flip';

export interface SoundEffectSetting {
  enabled: boolean;
  volume: number; // 0-100
}

export interface StoredSoundscapeSettings {
  rain: SoundEffectSetting;
  tick: SoundEffectSetting;
  thunder: SoundEffectSetting;
  flip: SoundEffectSetting;
}

export interface SoundscapeSettings {
  effects: StoredSoundscapeSettings;
}

export interface SoundEffectNodes {
  source?: AudioNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
}

export interface SoundEffect {
  id: SoundEffectId;
  enabled: boolean;
  volume: number; // 0-100
  audioNodes?: SoundEffectNodes;
}

export interface SoundscapeState {
  audioContext: AudioContext | null;
  effects: Map<SoundEffectId, SoundEffect>;
}

export interface SoundscapeEngineProps {
  judgeMode?: boolean;
}
