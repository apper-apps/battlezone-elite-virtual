class AudioService {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.volume = 1.0;
    this.enabled = true;
    this.initializeAudio();
  }

  async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.enabled = false;
    }
  }

  async loadSounds() {
    const soundFiles = {
      footstep: this.generateFootstepSound(),
      gunshot: this.generateGunshotSound(),
      reload: this.generateReloadSound(),
      weaponSwitch: this.generateWeaponSwitchSound(),
      hit: this.generateHitSound(),
      pickup: this.generatePickupSound()
    };

    for (const [name, generator] of Object.entries(soundFiles)) {
      this.sounds.set(name, generator);
    }
  }

  generateFootstepSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'brown';
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(300, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    };
  }

  generateGunshotSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      // Main gunshot bang
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();
      
      oscillator1.connect(filterNode);
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator1.type = 'square';
      oscillator1.frequency.setValueAtTime(120, this.audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.1);
      
      oscillator2.type = 'sawtooth';
      oscillator2.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.08);
      
      filterNode.type = 'highpass';
      filterNode.frequency.setValueAtTime(100, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.8 * this.volume, this.audioContext.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator1.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.3);
      oscillator2.start(this.audioContext.currentTime);
      oscillator2.stop(this.audioContext.currentTime + 0.3);
    };
  }

  generateReloadSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
      oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.4);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2 * this.volume, this.audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, this.audioContext.currentTime + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.2 * this.volume, this.audioContext.currentTime + 0.35);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  generateWeaponSwitchSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * this.volume, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    };
  }

  generateHitSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4 * this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }

  generatePickupSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(784, this.audioContext.currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(1047, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * this.volume, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  playSound(soundName, volume = 1.0, pitch = 1.0) {
    if (!this.enabled || !this.sounds.has(soundName)) return;
    
    const soundGenerator = this.sounds.get(soundName);
    if (typeof soundGenerator === 'function') {
      soundGenerator();
    }
  }

  playPositionalSound(soundName, listenerPos, sourcePos, maxDistance = 100, volume = 1.0) {
    if (!this.enabled) return;
    
    const distance = Math.sqrt(
      Math.pow(listenerPos.x - sourcePos.x, 2) +
      Math.pow(listenerPos.y - sourcePos.y, 2) +
      Math.pow((listenerPos.z || 0) - (sourcePos.z || 0), 2)
    );
    
    const distanceVolume = Math.max(0, 1 - (distance / maxDistance));
    this.playSound(soundName, volume * distanceVolume);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export default new AudioService();