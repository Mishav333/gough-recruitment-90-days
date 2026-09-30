
(function () {
  'use strict';
  var BASE = 'assets/video-examples/';
  var MAX_PER_BUCKET = 3;
  var wrap = document.getElementById('videoExamples');
  if (!wrap) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG_OFF = '<svg class="off" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var SVG_ON = '<svg class="on" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor"/><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function waiting(slot, client) {
    slot.classList.remove('is-filled');
    var v = slot.querySelector('video'); if (v && v.parentNode) v.parentNode.removeChild(v);
    var s = slot.querySelector('.v12-vid-sound'); if (s && s.parentNode) s.parentNode.removeChild(s);
    slot.setAttribute('data-state', 'waiting');
    count();
  }

  function slotFor(item) {
    var fig = el('figure', 'v12-vid');
    var frame = el('div', 'v12-vid-frame');
    var empty = el('div', 'v12-vid-empty');
    empty.appendChild(el('span', '', 'Video to come'));
    frame.appendChild(empty);
    fig.appendChild(frame);
    var cap = el('figcaption');
    var k = el('span', 'v12-vid-k', 'Example from our production partner, ');
    k.appendChild(el('b', '', item.client));
    cap.appendChild(k);
    cap.appendChild(el('span', 'v12-vid-cap', item.caption || ''));
    fig.appendChild(cap);
    fig.setAttribute('data-client', item.client);
    fig.setAttribute('data-state', 'waiting');
    if (!item.file) return fig;

    var v = document.createElement('video');
    v.loop = false; v.playsInline = true; v.muted = false;
    v.setAttribute('playsinline', ''); v.setAttribute('preload', 'metadata');
    if (item.poster) v.poster = BASE + item.poster;
    v.setAttribute('aria-label', 'Example video from our production partner, made for ' + item.client);
    v.addEventListener('error', function () { waiting(fig, item.client); });
    v.src = BASE + item.file + '?v=s12p';
    frame.appendChild(v);
    fig.classList.add('is-filled');
    fig.setAttribute('data-state', 'filled');

    var b = el('button', 'v16-play');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', 'Play the ' + item.client + ' example');
    b.innerHTML = '<span class="v16-play-i" aria-hidden="true"><svg class="pl" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg><svg class="pa" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg></span>';
    frame.appendChild(b);
    var bar = el('div', 'v16-prog'); var fill = el('i'); bar.appendChild(fill); frame.appendChild(bar);
    bar.setAttribute('aria-hidden', 'true');

    function sync() {
      var playing = !v.paused && !v.ended;
      fig.classList.toggle('is-playing', playing);
      b.setAttribute('aria-pressed', String(playing));
      b.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' the ' + item.client + ' example');
    }
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    v.addEventListener('ended', function () { try { v.currentTime = 0; } catch (e) {} v.load(); sync(); });
    v.addEventListener('timeupdate', function () { if (v.duration) fill.style.width = (100 * v.currentTime / v.duration) + '%'; });
    b.addEventListener('click', function () {
      if (v.paused || v.ended) {
        Array.prototype.forEach.call(document.querySelectorAll('#videoExamples video'), function (o) { if (o !== v && !o.paused) o.pause(); });
        v.muted = false; v.removeAttribute('muted');
        var p = v.play();
        if (p && p.catch) p.catch(function () {
          v.muted = true; var q = v.play(); if (q && q.catch) q.catch(function () {});
        });
      } else {
        v.pause();
      }
    });
    return fig;
  }

  function cue(bucket) {
    var vids = bucket.querySelectorAll('.v12-vid');
    if (vids.length < 2) return;
    var c = el('div', 'v151-cue');
    c.setAttribute('aria-hidden', 'true');
    c.setAttribute('data-for', bucket.getAttribute('data-bucket') || '');
    Array.prototype.forEach.call(vids, function () { c.appendChild(el('i')); });
    bucket.appendChild(c);
    function update() {
      var live = bucket.scrollWidth > bucket.clientWidth + 1;
      c.classList.toggle('is-live', live);
      if (!live) return;
      var b = bucket.getBoundingClientRect(), L = b.left, R = b.left + bucket.clientWidth;
      Array.prototype.forEach.call(vids, function (v, i) {
        var r = v.getBoundingClientRect();
        c.children[i].classList.toggle('on', Math.min(r.right, R) - Math.max(r.left, L) >= r.width * 0.9);
      });
    }
    bucket.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }

  function count() {
    wrap.setAttribute('data-filled', String(wrap.querySelectorAll('.v12-vid.is-filled').length));
    wrap.setAttribute('data-waiting', String(wrap.querySelectorAll('.v12-vid[data-state="waiting"]').length));
  }

  function watch() {
    var vids = Array.prototype.slice.call(wrap.querySelectorAll('video'));
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (!e.isIntersecting && !v.paused) v.pause();
      });
    }, { threshold: [0] });
    vids.forEach(function (v) { io.observe(v); });
  }

  function build(list) {
    if (!Array.isArray(list)) list = (list && list.videos) || [];
    Array.prototype.forEach.call(wrap.querySelectorAll('.v12-bucket'), function (bucket) {
      var id = bucket.getAttribute('data-bucket');
      var items = list.filter(function (it) {
        return it && it.bucket === id && typeof it.client === 'string' && it.client.trim();
      }).slice(0, MAX_PER_BUCKET);
      items.forEach(function (it) {
        var fig = slotFor(it);
        var same = items.filter(function (o) { return o.client === it.client; }).length;
        if (same === 1) fig.classList.add('is-solo');
        bucket.appendChild(fig);
      });
      bucket.setAttribute('data-n', String(items.length));
      bucket.style.setProperty('--n', String(Math.max(items.length, 1)));
      cue(bucket);
    });
    wrap.style.setProperty('--t', String(Math.max(wrap.querySelectorAll('.v12-vid').length, 2)));
    count();
    watch();
  }

  fetch(BASE + 'video-examples.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(build)
    .catch(function () { build([]); });
})();
