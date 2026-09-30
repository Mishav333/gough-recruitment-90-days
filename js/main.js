

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  var BEATS = [
    'Cover',
    'Where you\'re found',
    'The website',
    'LinkedIn',
    'Instagram',
    'TikTok',
    'What you already own',
    'The hinge',
    'The sequence',
    '1 Brand',
    '2 Website',
    '3 Social',
    '4 Partnerships',
    '5 AI',
    'Investment',
    'Next step'
  ];

  
  var BEAT_TO_LABEL = {
    'Cover': 'Cover',
    'Why we looked': 'Where you\'re found',
    'The website': 'The website',
    'LinkedIn': 'LinkedIn',
    'Instagram': 'Instagram',
    'TikTok': 'TikTok',
    'What you already own': 'What you own',
    'The hinge': 'One Gough',
    'The sequence': 'The sequence',
    'Phase 1 — Brand': '1 Brand',
    'Phase 2 — Website': '2 Website',
    'Phase 3 — Social + TikTok': '3 Social',
    'Phase 4 — Partnerships': '4 Partnerships',
    'Phase 5 — AI': '5 AI',
    'Investment': 'Investment',
    'Next step': 'Next step'
  };

  var sections = Array.prototype.slice.call(document.querySelectorAll('section[data-beat]'));
  var railLabel = document.getElementById('railLabel');
  var railSegments = document.getElementById('railSegments');
  var railHint = document.getElementById('railHint');

  
  var railBeats = [];
  sections.forEach(function (s) {
    var label = BEAT_TO_LABEL[s.getAttribute('data-beat')];
    if (label && railBeats.indexOf(label) === -1) railBeats.push(label);
  });

  railBeats.forEach(function () {
    var seg = document.createElement('div');
    seg.className = 'rail-seg';
    railSegments.appendChild(seg);
  });
  var railSegs = Array.prototype.slice.call(railSegments.children);

  function setActiveRail(i) {
    railSegs.forEach(function (seg, idx) {
      if (idx < i) seg.className = 'rail-seg passed';
      else if (idx === i) seg.className = 'rail-seg active';
      else seg.className = 'rail-seg';
    });
    railLabel.textContent = railBeats[i] || 'Cover';
    var sec = sections[i];
    var reg = sec ? sec.getAttribute('data-register') : '1';
    railLabel.parentElement.setAttribute('data-register', reg);
  }

  
  var rvObserver;
  if ('IntersectionObserver' in window) {
    rvObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('rv-in');
          rvObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  }

  var rvEls = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  rvEls.forEach(function (el) {
    if (reduceMotion) { el.classList.add('rv-in'); return; }
    if (rvObserver) rvObserver.observe(el);
    else el.classList.add('rv-in');
  });

  
  var activeBeatIndex = 0;
  var beatObserver;
  if ('IntersectionObserver' in window) {
    beatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var idx = sections.indexOf(e.target);
          if (idx !== -1) {
            activeBeatIndex = idx;
            setActiveRail(idx);
            onBeatEnter(e.target);
          }
        }
      });
    }, { threshold: 0.15 });
    sections.forEach(function (s) { beatObserver.observe(s); });
  } else {
    window.addEventListener('scroll', function () {
      var vh = window.innerHeight;
      var mid = vh / 2;
      var best = 0;
      sections.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) best = i;
      });
      if (best !== activeBeatIndex) {
        activeBeatIndex = best;
        setActiveRail(best);
        onBeatEnter(sections[best]);
      }
    }, { passive: true });
  }

  function onBeatEnter(section) {
    var beat = section.getAttribute('data-beat');
    
    if (beat === 'The website') startM1();
    
    if (beat === 'Instagram') startM2();
    
    if (beat === 'Your own footer') startM3();
    
    if (beat === 'TikTok') startM4();
    
    var phase = section.getAttribute('data-phase');
    if (phase && (beat.indexOf('Phase') === 0)) dockChips(phase);
  }

  
  var m1Labels = [];
  var m1Started = false;
  function startM1() {
    if (m1Started) return;
    m1Started = true;
    var holder = document.getElementById('m1Labels');
    if (!holder) return;
    holder.innerHTML = '';
    m1Labels.forEach(function (label, i) {
      var el = document.createElement('span');
      el.className = 'm1-layer-label';
      el.textContent = label;
      el.style.position = 'static';
      el.style.transform = 'none';
      el.style.opacity = '0';
      el.style.transition = 'opacity 480ms cubic-bezier(0.32,0.72,0.24,1) ' + (i * 120) + 'ms';
      holder.appendChild(el);
    });
    if (reduceMotion) {
      Array.prototype.forEach.call(holder.children, function (c) { c.style.opacity = '1'; });
      return;
    }
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(holder.children, function (c, i) {
        setTimeout(function () { c.style.opacity = '1'; }, i * 120);
      });
    });
  }

  
  var m2Started = false;
  function startM2() {
    if (m2Started) return;
    m2Started = true;
    var typedEl = document.getElementById('igTypedText');
    if (!typedEl) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll('#igResults .ig-result-row'));
    var text = 'gough';

    function showRows() {
      rows.forEach(function (row, i) {
        setTimeout(function () { row.classList.add('visible'); }, i * 100);
      });
    }

    if (reduceMotion) {
      if (typedEl) typedEl.textContent = 'gough';
      rows.forEach(function (r) { r.classList.add('visible'); });
      return;
    }

    var i = 0;
    (function typeNext() {
      if (i <= text.length) {
        typedEl.textContent = text.slice(0, i);
        i++;
        setTimeout(typeNext, 90);
      } else {
        showRows();
      }
    })();
  }

  
  var m3Started = false;
  function startM3() {
    if (m3Started) return;
    m3Started = true;
    var hairline = document.getElementById('m3Hairline');
    var badge = document.getElementById('m3Badge');
    if (reduceMotion) {
      if (hairline) hairline.style.width = '100%';
      if (badge) badge.style.opacity = '1';
      return;
    }
    setTimeout(function () {
      if (hairline) hairline.style.width = '100%';
      setTimeout(function () {
        if (badge) badge.style.opacity = '1';
      }, 800);
    }, 400);
  }

  
  var m4Started = false;
  function startM4() {
    if (m4Started) return;
    m4Started = true;
    var counter = document.getElementById('m4Counter');
    if (!counter) return;
    if (reduceMotion) { counter.textContent = '4'; return; }
    var years = [0, 1, 2, 3, 4];
    var i = 0;
    (function roll() {
      if (i < years.length) {
        counter.textContent = years[i];
        i++;
        setTimeout(roll, 360);
      }
    })();
  }

  
  var PHASE_CHIPS = {
    '1': ['two logos', 'the G at two sizes', 'old footer handle'],
    '2': ['off-the-shelf template', 'addresses that error', '"2,500 placements in 2022"'],
    '3': ['TikTok: gone quiet', '7,566 followers', '3,971 likes', 'LinkedIn format repetition', 'Instagram: median 6 likes'],
    '4': ['Agency of the Year (national)', 'NSW/QLD/WA badges', 'Salary Report AU + Asia'],
    '5': ['GoughAI\u2019s first weeks', 'the new website', 'your team\u2019s own list']
  };
  var dockedPhases = {};
  function dockChips(phase) {
    if (dockedPhases[phase]) return;
    dockedPhases[phase] = true;
    var strip = document.querySelector('[data-dock="' + phase + '"]');
    if (!strip) return;
    if (strip.querySelector('.chip')) return;
    var labels = PHASE_CHIPS[phase] || [];
    strip.innerHTML = '';
    labels.forEach(function (label, i) {
      var chip = document.createElement('span');
      chip.className = 'chip chip-state-docked chip-docked';
      chip.textContent = label;
      if (reduceMotion) {
        strip.appendChild(chip);
        return;
      }
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(8px)';
      chip.style.transition = 'opacity 200ms cubic-bezier(0.32,0.72,0.24,1), transform 480ms cubic-bezier(0.32,0.72,0.24,1)';
      strip.appendChild(chip);
      setTimeout(function () {
        chip.style.opacity = '1';
        chip.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  
  var hingeSection = document.getElementById('hingeSection');
  var hingeSticky = document.getElementById('hingeSticky');
  var hingeCopy = document.getElementById('hingeCopy');
  var hingePlayfair = document.querySelector('.hinge-playfair');
  var hingeFraunces = document.querySelector('.hinge-fraunces');
  var m5Field = document.getElementById('m5ChipField');
  var m5Spine = document.getElementById('m5Spine');

  var M5_CHIPS = [
    '@goughrecruitment', '@goughrecruitment_qld', '@goughrecruitment_vic', '@goughperth',
    'old footer handle', 'off-the-shelf template', 'addresses that error',
    '"2,500 placements in 2022"', 'about 65,000 on LinkedIn', 'format repetition', '7,566 on TikTok', '3,971 likes',
    'gone quiet', 'award badges', 'client logos', 'Salary Report 2026', '2,970 reviews at 4.9'
  ];

  var m5ChipEls = [];
  function buildM5Field() {
    if (!m5Field) return;
    m5Field.innerHTML = '';
    M5_CHIPS.forEach(function (label, i) {
      var chip = document.createElement('span');
      var startX = 8 + Math.random() * 84;
      var startY = 8 + Math.random() * 84;
      var start = 0.20 + Math.random() * 0.25;
      chip.className = 'chip chip-state-fragment';
      chip.textContent = label;
      chip.dataset.m5StartX = String(startX);
      chip.dataset.m5StartY = String(startY);
      chip.dataset.m5Start = String(start);
      chip.dataset.m5End = String(start + 0.30);
      chip.style.position = 'absolute';
      chip.style.left = startX + '%';
      chip.style.top = startY + '%';
      chip.style.transform = 'translate(-50%,-50%)';
      chip.style.opacity = '0.55';
      m5Field.appendChild(chip);
      m5ChipEls.push(chip);
    });
  }
  buildM5Field();

  var PART1_TOKENS = {
    '--c1-bg': '#FFFFFF', '--c1-ink': '#051145'
  };
  var CROSSOVER = [
    { key: '--crossover-bg', from: [255, 255, 255], to: [0, 52, 89] },
    { key: '--crossover-ink', from: [5, 17, 69], to: [255, 255, 255] }
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpRGB(from, to, t) {
    return [Math.round(lerp(from[0], to[0], t)), Math.round(lerp(from[1], to[1], t)), Math.round(lerp(from[2], to[2], t))];
  }

  var hingeProgress = 0;
  function updateHinge() {
    if (!hingeSection || !hingeSticky) return;
    var rect = hingeSection.getBoundingClientRect();
    var total = hingeSection.offsetHeight - window.innerHeight;
    var scrolled = -rect.top;
    var p = Math.max(0, Math.min(1, scrolled / total));
    hingeProgress = p;

    m5ChipEls.forEach(function (chip, i) {
      var start = Number(chip.dataset.m5Start);
      var end = Number(chip.dataset.m5End);
      var startX = Number(chip.dataset.m5StartX);
      var startY = Number(chip.dataset.m5StartY);
      var targetX = 50;
      var targetY = 8 + i * 4.5;
      var t = (p - start) / (end - start);
      t = Math.max(0, Math.min(1, t));
      var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (t > 0) {
        chip.classList.remove('chip-state-fragment');
        chip.classList.add('chip-state-spine');
      }
      chip.style.left = (startX + (targetX - startX) * eased) + '%';
      chip.style.top = (startY + (targetY - startY) * eased) + '%';
      chip.style.opacity = 0.55 + 0.45 * t;
    });

    var c = (p - 0.20) / (0.85 - 0.20);
    c = Math.max(0, Math.min(1, c));
    var bg = lerpRGB(CROSSOVER[0].from, CROSSOVER[0].to, c);
    var ink = lerpRGB(CROSSOVER[1].from, CROSSOVER[1].to, c);
    hingeSticky.style.background = 'rgb(' + bg.join(',') + ')';
    hingeSticky.style.color = 'rgb(' + ink.join(',') + ')';

    if (hingePlayfair && hingeFraunces) {
      hingePlayfair.style.opacity = 1 - c;
      hingeFraunces.style.opacity = c;
      hingePlayfair.style.color = 'rgb(' + ink.join(',') + ')';
      hingeFraunces.style.color = 'rgb(' + ink.join(',') + ')';
    }

    if (m5Spine) {
      var sp = (p - 0.75) / 0.25;
      sp = Math.max(0, Math.min(1, sp));
      m5Spine.style.background = 'linear-gradient(to bottom, #ECF0F2 ' + (sp * 100) + '%, transparent ' + (sp * 100) + '%)';
    }
  }

  
  var m8Diagram = document.getElementById('m8Diagram');
  var m8Started = false;
  function buildM8() {
    if (!m8Diagram || m8Started) return;
    m8Started = true;
    var chips = [
      { label: 'Brand', left: '8%', top: '78%' },
      { label: 'Website', left: '8%', top: '58%' },
      { label: 'Social + TikTok', left: '12%', top: '30%' },
      { label: 'Partnerships', left: '72%', top: '30%' },
      { label: 'AI', left: '74%', top: '58%' }
    ];
    chips.forEach(function (c, i) {
      var el = document.createElement('span');
      el.className = 'chip chip-state-docked chip-docked m8-chip-pos';
      el.textContent = c.label;
      el.style.left = c.left;
      el.style.top = c.top;
      m8Diagram.appendChild(el);
      if (reduceMotion) { el.classList.add('visible'); return; }
      setTimeout(function () { el.classList.add('visible'); }, i * 60);
    });
  }

  var m8Section = document.querySelector('section[data-beat="One system"]');
  if (m8Section) {
    var m8Observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { buildM8(); m8Observer.disconnect(); }
      });
    }, { threshold: 0.3 });
    m8Observer.observe(m8Section);
  }

  
  var avatars = Array.prototype.slice.call(document.querySelectorAll('.cover-avatar'));
  var cover = document.querySelector('.cover');
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  function driftAvatars() {
    if (reduceMotion) return;
    var mobile = window.innerWidth < 768;
    var spreadX = mobile ? 0 : (isTouch ? 140 : 200);
    var spreadY = mobile ? 0 : 100;
    var offsets = [
      { x: -spreadX, y: -spreadY },
      { x: spreadX, y: spreadY },
      { x: -spreadX, y: spreadY },
      { x: spreadX, y: -spreadY }
    ];
    avatars.forEach(function (a, i) {
      a.style.transform = 'translate(' + offsets[i].x + 'px,' + offsets[i].y + 'px)';
    });
  }

  if (reduceMotion || isTouch) {
    var mob = window.innerWidth < 768;
    var spreadX = mob ? 0 : 140;
    var spreadY = mob ? 0 : 80;
    var offs = [
      { x: -spreadX, y: -spreadY }, { x: spreadX, y: spreadY },
      { x: -spreadX, y: spreadY }, { x: spreadX, y: -spreadY }
    ];
    avatars.forEach(function (a, i) {
      a.style.transform = 'translate(' + offs[i].x + 'px,' + offs[i].y + 'px)';
    });
  } else {
    setTimeout(driftAvatars, 600);
  }

  
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHinge();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { updateHinge(); }, { passive: true });
  updateHinge();

  
  document.addEventListener('keydown', function (e) {
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      else document.exitFullscreen && document.exitFullscreen();
    }
    if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      var next = sections[Math.min(activeBeatIndex + 1, sections.length - 1)];
      if (next) next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      var prev = sections[Math.max(activeBeatIndex - 1, 0)];
      if (prev) prev.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  
  setActiveRail(0);
})();


(function () {
  var cue = document.querySelector('.cover-v6 .v6c-cue');
  if (!cue) return;
  cue.addEventListener('click', function () {
    var band = document.getElementById('v6cBand');
    if (band) band.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();


(function () {
  var c = document.querySelector('.v16-title .v16-cue');
  if (!c) return;
  c.addEventListener('click', function () {
    var f = document.getElementById('v16Finding');
    if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
