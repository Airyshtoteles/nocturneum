// Setup file for Vitest test environment
// Polyfill AudioContext or other Web Audio APIs if needed in jsdom

if (typeof window !== 'undefined' && !window.AudioContext) {
  // Simple AudioContext mock for node/jsdom test environments
  class MockAudioNode {
    connect() { return this; }
    disconnect() {}
  }

  class MockGainNode extends MockAudioNode {
    gain = {
      value: 1,
      setValueAtTime: () => {},
      linearRampToValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
    };
  }

  class MockAudioBufferSourceNode extends MockAudioNode {
    buffer: unknown = null;
    loop = false;
    start() {}
    stop() {}
  }

  class MockBiquadFilterNode extends MockAudioNode {
    frequency = { setValueAtTime: () => {} };
    Q = { setValueAtTime: () => {} };
    type = 'lowpass';
  }

  class MockOscillatorNode extends MockAudioNode {
    frequency = {
      setValueAtTime: () => {},
      linearRampToValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
    };
    type = 'sine';
    start() {}
    stop() {}
  }

  class MockAudioContext {
    currentTime = 0;
    sampleRate = 44100;
    state = 'running';
    createGain() { return new MockGainNode(); }
    createBufferSource() { return new MockAudioBufferSourceNode(); }
    createBiquadFilter() { return new MockBiquadFilterNode(); }
    createOscillator() { return new MockOscillatorNode(); }
    createBuffer(channels: number, length: number, sampleRate: number) {
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => new Float32Array(length),
      };
    }
    resume() { return Promise.resolve(); }
    close() { return Promise.resolve(); }
  }

  // @ts-expect-error Mock AudioContext
  window.AudioContext = MockAudioContext;
  // @ts-expect-error Mock webkitAudioContext
  window.webkitAudioContext = MockAudioContext;
}
