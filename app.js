/**
 * Premium Cinematic Wedding Invite Logic
 * Includes: 
 *   1. Procedural Web Audio API Indian Ambient Tanpura Drone
 *   2. Dual-Layer Canvas HTML5 Particle Floating Lantern System
 *   3. GSAP + ScrollTrigger Premium Cinematic Staggered Entrance
 *   4. Slow Parallax Backdrop Scroll Dynamics
 */

document.addEventListener("DOMContentLoaded", () => {
  initEntranceAnimations();
  initLanterns();
  initAtmosphereAudio();
});

/* =========================================================================
   1. Entrance & Parallax Animations (GSAP)
   ========================================================================= */
function initEntranceAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Set initial states for elements to avoid layout flash
  gsap.set("#hero-palace-bg", { scale: 1.12, opacity: 0 });
  gsap.set("#hero-symbol", { opacity: 0, scale: 0.7 });
  gsap.set("#hero-welcome", { opacity: 0, y: 15 });
  gsap.set("#name-groom", { opacity: 0, y: 40 });
  gsap.set("#name-bride", { opacity: 0, y: 40 });
  gsap.set("#hero-weds .weds-line", { scaleX: 0 });
  gsap.set("#hero-weds .weds-text", { opacity: 0, scale: 0.8 });
  gsap.set("#hero-divider", { opacity: 0, scale: 0.5 });
  gsap.set("#hero-details", { opacity: 0, y: 20 });
  gsap.set("#hero-scroll", { opacity: 0, y: 10 });

  // Main Intro Timeline
  const introTimeline = gsap.timeline({
    defaults: { ease: "power3.out", duration: 1.8 }
  });

  introTimeline
    // 1. Slow camera zoom and fade in of the palace backdrop
    .to("#hero-palace-bg", { opacity: 1, scale: 1.05, duration: 2.8, ease: "power2.out" })
    
    // 2. Fade & drop of holy symbol
    .to("#hero-symbol", { opacity: 1, scale: 1, duration: 1.4, ease: "back.out(1.7)" }, "-=1.8")
    
    // 3. Welcome banner reveal
    .to("#hero-welcome", { opacity: 0.8, y: 0, duration: 1.2 }, "-=1.0")
    
    // 4. Groom name slow rise and track-out
    .to("#name-groom", { opacity: 1, y: 0, duration: 2.0 }, "-=1.0")
    
    // 5. Weds divider expansion
    .to("#hero-weds .weds-line", { scaleX: 1, duration: 1.4, stagger: 0.1 }, "-=1.5")
    .to("#hero-weds .weds-text", { opacity: 1, scale: 1, duration: 1.0 }, "-=1.2")
    
    // 6. Bride name slow rise
    .to("#name-bride", { opacity: 1, y: 0, duration: 2.0 }, "-=1.4")
    
    // 7. Golden Ornamental Divider reveal
    .to("#hero-divider", { opacity: 0.85, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=1.3")
    
    // 8. Ceremony details fade-up
    .to("#hero-details", { opacity: 1, y: 0, duration: 1.6 }, "-=1.0")
    
    // 9. Scroll indicator fade in
    .to("#hero-scroll", { opacity: 1, y: 0, duration: 1.2 }, "-=0.8");

  // Parallax Scroll Effect for the Background Canopy
  gsap.to("#hero-palace-bg", {
    y: "12%",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Parallax text shift upward slightly faster than scroll
  gsap.to("#hero-text-content", {
    y: "-8%",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

/* =========================================================================
   2. Floating Lantern Particles (Canvas + GSAP Ticker)
   ========================================================================= */
function initLanterns() {
  const bgCanvas = document.getElementById("bg-lanterns");
  const fgCanvas = document.getElementById("fg-lanterns");
  
  if (!bgCanvas || !fgCanvas) return;
  
  const bgCtx = bgCanvas.getContext("2d");
  const fgCtx = fgCanvas.getContext("2d");
  
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  bgCanvas.width = width;
  bgCanvas.height = height;
  fgCanvas.width = width;
  fgCanvas.height = height;
  
  const bgLanternsList = [];
  const fgLanternsList = [];
  
  // High-performance Particle settings
  const bgLanternCount = Math.min(25, Math.floor(width / 35));
  const fgLanternCount = Math.min(6, Math.floor(width / 180));

  class Lantern {
    constructor(isForeground = false) {
      this.isForeground = isForeground;
      this.reset(true); // Initial spawn spread across screen
    }

    reset(initial = false) {
      this.width = this.isForeground ? gsap.utils.random(35, 55) : gsap.utils.random(12, 24);
      this.height = this.width * 1.35;
      
      this.x = gsap.utils.random(50, width - 50);
      // Spawn at bottom if not initial spawn, otherwise spread vertically
      this.y = initial ? gsap.utils.random(100, height + 100) : height + gsap.utils.random(20, 150);
      
      this.speedY = this.isForeground ? gsap.utils.random(0.5, 0.9) : gsap.utils.random(0.2, 0.45);
      this.swayAmount = this.isForeground ? gsap.utils.random(1.2, 2.5) : gsap.utils.random(0.4, 1.2);
      this.swaySpeed = gsap.utils.random(0.005, 0.015);
      this.phase = gsap.utils.random(0, Math.PI * 2);
      
      // Floating warm glow details
      this.opacity = this.isForeground ? gsap.utils.random(0.65, 0.85) : gsap.utils.random(0.4, 0.75);
      this.pulseSpeed = gsap.utils.random(0.01, 0.03);
      this.pulsePhase = gsap.utils.random(0, Math.PI * 2);
    }

    update() {
      this.y -= this.speedY;
      this.phase += this.swaySpeed;
      this.pulsePhase += this.pulseSpeed;
      this.x += Math.sin(this.phase) * this.swayAmount;
      
      // Reset when floating off screen
      if (this.y < -this.height - 20) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      
      // Calculate pulsating intensity for cinematic flame glow
      const pulseOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.15;
      ctx.globalAlpha = Math.max(0.1, Math.min(pulseOpacity, 1));
      
      // Shadow glow effect
      ctx.shadowColor = "rgba(230, 110, 30, 0.8)";
      ctx.shadowBlur = this.isForeground ? 25 : 12;

      // Draw lantern body (Rounded trapezoid/pill shape)
      const x = this.x;
      const y = this.y;
      const w = this.width;
      const h = this.height;
      const r = w * 0.25; // corner radius

      ctx.beginPath();
      ctx.moveTo(x - w/2 + r, y);
      ctx.lineTo(x + w/2 - r, y);
      ctx.quadraticCurveTo(x + w/2, y, x + w/2, y + r);
      ctx.lineTo(x + w/3, y + h - r);
      ctx.quadraticCurveTo(x + w/3, y + h, x + w/3 - r, y + h);
      ctx.lineTo(x - w/3 + r, y + h);
      ctx.quadraticCurveTo(x - w/3, y + h, x - w/3, y + h - r);
      ctx.lineTo(x - w/2, y + r);
      ctx.quadraticCurveTo(x - w/2, y, x - w/2 + r, y);
      ctx.closePath();

      // Main glowing radial gradient representing floating hot oil candles
      const grad = ctx.createRadialGradient(x, y + h * 0.6, 1, x, y + h * 0.5, w * 0.8);
      grad.addColorStop(0, "rgba(255, 245, 200, 1)");   // Inner hot flame
      grad.addColorStop(0.2, "rgba(255, 180, 50, 0.9)"); // Warm gold
      grad.addColorStop(0.7, "rgba(200, 60, 20, 0.75)");  // Deep ember border
      grad.addColorStop(1, "rgba(110, 20, 10, 0.2)");     // Fading outer halo
      
      ctx.fillStyle = grad;
      ctx.fill();

      // Top decorative collar (Traditional wooden bar)
      ctx.shadowBlur = 0; // Disable blur for details
      ctx.beginPath();
      ctx.rect(x - w/2 - 2, y - 2, w + 4, 3);
      ctx.fillStyle = "rgba(45, 10, 5, 0.85)";
      ctx.fill();

      // Bottom tassel/fringe string
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + h + w * 0.4);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.65)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tassel bead
      ctx.beginPath();
      ctx.arc(x, y + h + w * 0.4, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
      ctx.fill();

      ctx.restore();
    }
  }

  // Populate lists
  for (let i = 0; i < bgLanternCount; i++) {
    bgLanternsList.push(new Lantern(false));
  }
  for (let i = 0; i < fgLanternCount; i++) {
    fgLanternsList.push(new Lantern(true));
  }

  // Optimize Rendering loop using GSAP Ticker for buttery smooth performance
  gsap.ticker.add(tick);

  function tick() {
    // Clear canvasses
    bgCtx.clearRect(0, 0, width, height);
    fgCtx.clearRect(0, 0, width, height);

    // Update and draw Background layer
    for (let i = 0; i < bgLanternsList.length; i++) {
      const lantern = bgLanternsList[i];
      lantern.update();
      lantern.draw(bgCtx);
    }

    // Update and draw Foreground layer
    for (let i = 0; i < fgLanternsList.length; i++) {
      const lantern = fgLanternsList[i];
      lantern.update();
      lantern.draw(fgCtx);
    }
  }

  // Handle resizing gracefully
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    
    bgCanvas.width = width;
    bgCanvas.height = height;
    fgCanvas.width = width;
    fgCanvas.height = height;
    
    // adjust count
    const newBgCount = Math.min(25, Math.floor(width / 35));
    const newFgCount = Math.min(6, Math.floor(width / 180));
    
    bgLanternsList.length = 0;
    fgLanternsList.length = 0;
    
    for (let i = 0; i < newBgCount; i++) {
      bgLanternsList.push(new Lantern(false));
    }
    for (let i = 0; i < newFgCount; i++) {
      fgLanternsList.push(new Lantern(true));
    }
  });
}

/* =========================================================================
   3. Procedural Atmospheric Sound Generator (Web Audio API)
   ========================================================================= */
function initAtmosphereAudio() {
  const audioBtn = document.getElementById("audio-btn");
  const playIcon = document.getElementById("audio-icon-play");
  const pauseIcon = document.getElementById("audio-icon-pause");
  
  if (!audioBtn) return;
  
  let audioCtx = null;
  let isPlaying = false;
  
  // Synthesis nodes
  let masterGain = null;
  let oscillators = [];

  function playAtmosphere() {
    try {
      // 1. Initialize Audio Context on user click
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume context if suspended (browser security)
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      masterGain = audioCtx.createGain();
      
      // Let's create an atmospheric Indian tanpura drone synthesis!
      // A fundamental deep frequency around C#3 (138.59 Hz) and harmonics to sound mystical and handcrafted.
      const baseFreq = 138.59;
      const stringHarmonics = [
        { freq: baseFreq * 0.5, type: "sine", vol: 0.5, pan: -0.4 },  // deep low drone C#2 (69.3 Hz)
        { freq: baseFreq, type: "triangle", vol: 0.35, pan: 0 },      // fundamental C#3
        { freq: baseFreq * 1.5, type: "sine", vol: 0.25, pan: 0.4 },  // perfect fifth G#3 (207.9 Hz)
        { freq: baseFreq * 2.0, type: "triangle", vol: 0.15, pan: -0.2 } // octave C#4 (277.28 Hz)
      ];

      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      // Soft luxury fade-in
      masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 3.0);

      // Lowpass filter to keep it extremely warm, smooth, and analog-sounding
      const warmFilter = audioCtx.createBiquadFilter();
      warmFilter.type = "lowpass";
      warmFilter.frequency.setValueAtTime(600, audioCtx.currentTime);
      warmFilter.Q.setValueAtTime(1, audioCtx.currentTime);

      warmFilter.connect(audioCtx.destination);
      masterGain.connect(warmFilter);

      oscillators = stringHarmonics.map(harmonic => {
        const osc = audioCtx.createOscillator();
        const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
        const gainNode = audioCtx.createGain();

        osc.type = harmonic.type;
        osc.frequency.setValueAtTime(harmonic.freq, audioCtx.currentTime);
        
        // Slightly detune to simulate organic handcrafted wooden instruments
        osc.detune.setValueAtTime(gsap.utils.random(-8, 8), audioCtx.currentTime);

        // Slow luxurious organic LFO (low frequency oscillator) to wave/vibrate drone volumes
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(gsap.utils.random(0.05, 0.15), audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(harmonic.vol * 0.25, audioCtx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();

        gainNode.gain.setValueAtTime(harmonic.vol * 0.75, audioCtx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime(harmonic.pan, audioCtx.currentTime);
          osc.connect(gainNode).connect(panner).connect(masterGain);
        } else {
          osc.connect(gainNode).connect(masterGain);
        }

        osc.start();
        
        // Keep reference to LFO as well to shut down
        return { osc, lfo };
      });

      isPlaying = true;
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
      
    } catch (e) {
      console.warn("Procedural sound could not start, browser audio security settings active.", e);
    }
  }

  function stopAtmosphere() {
    if (masterGain && audioCtx) {
      // Soft luxury fade-out
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        oscillators.forEach(ref => {
          try {
            ref.osc.stop();
            ref.lfo.stop();
          } catch (err) {}
        });
        oscillators = [];
        isPlaying = false;
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      }, 1300);
    }
  }

  audioBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAtmosphere();
    } else {
      playAtmosphere();
    }
  });
}
