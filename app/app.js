// 화면 ① 오늘 할 일. 다 한 표시는 이 브라우저(localStorage)에만 저장하고 어디로도 보내지 않는다.
(function () {
  'use strict';

  const DAYS = [1, 2, 3, 4, 5];
  const KEY_DONE = 'firstweek.done'; // 표 3: { 할일아이디: '2026-11-10 09:12' }
  const KEY_DAY = 'firstweek.day';   // 마지막으로 본 일차

  const tasks = ((window.CONTENT && window.CONTENT.tasks) || []);

  // 저장이 막힌 브라우저(사생활 보호 창 등)에서도 화면은 나오게 한다.
  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 저장 못 해도 계속 */ }
  }
  function stamp(d) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  let done = load(KEY_DONE, {});
  if (typeof done !== 'object' || Array.isArray(done)) done = {};
  let day = Number(load(KEY_DAY, 1));
  if (!DAYS.includes(day)) day = 1;

  const $days = document.getElementById('days');
  const $title = document.getElementById('title');
  const $dots = document.getElementById('dots');
  const $cards = document.getElementById('cards');

  function el(tag, props, children) {
    const n = document.createElement(tag);
    Object.assign(n, props || {});
    (children || []).forEach(c => n.append(c));
    return n;
  }

  function renderDays() {
    $days.replaceChildren(...DAYS.map(d => {
      const b = el('button', { type: 'button', textContent: `${d}일차` });
      b.dataset.day = d;
      b.setAttribute('aria-pressed', String(d === day));
      return b;
    }));
  }

  function renderList() {
    const items = tasks.filter(t => Number(t.day) === day)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const n = items.filter(t => done[t.id]).length;

    $title.textContent = `${day}일차`;

    if (items.length) {
      const dots = items.map(t => el('i', { className: done[t.id] ? 'on' : '' }));
      dots.forEach(i => i.setAttribute('aria-hidden', 'true'));
      $dots.replaceChildren(...dots, el('span', { textContent: `${items.length}개 중 ${n}개 했어요` }));
    } else {
      $dots.replaceChildren();
    }

    if (!items.length) {
      $cards.replaceChildren(el('p', { className: 'empty' }, [
        '아직 적힌 할 일이 없어요.', el('br'), '무엇을 하면 될지 내 사수에게 물어보세요.',
      ]));
      return;
    }

    // 표시하기와 되돌리기를 다른 자리에 둔다. 한 단추였을 때 두 번 눌러 표시를 지운 사람이 있었다(05_사용자시험 사람 3).
    $cards.replaceChildren(...items.map((t, i) => {
      const isDone = Boolean(done[t.id]);
      let action;
      if (isDone) {
        const undo = el('button', { type: 'button', className: 'undoBtn', textContent: '되돌리기' });
        undo.dataset.undo = t.id;
        undo.setAttribute('aria-label', `${t.text}: 다 한 표시 되돌리기`);
        action = el('div', { className: 'doneRow' }, [
          el('p', { className: 'doneMark', textContent: '✓ 다 했어요' }),
          undo,
        ]);
      } else {
        action = el('button', { type: 'button', className: 'doneBtn', textContent: '다 했어요' });
        action.dataset.done = t.id;
        action.setAttribute('aria-label', `${t.text}: 다 했어요 표시하기`);
      }
      return el('article', { className: 'card' + (isDone ? ' done' : '') }, [
        el('div', { className: 'num', textContent: `할 일 ${t.order || i + 1}` }),
        el('p', { className: 'text', textContent: t.text }),
        action,
      ]);
    }));
  }

  function render() { renderDays(); renderList(); }

  $days.addEventListener('click', e => {
    const b = e.target.closest('[data-day]');
    if (!b) return;
    day = Number(b.dataset.day);
    save(KEY_DAY, day);
    render();
    const again = $days.querySelector(`[data-day="${day}"]`);
    if (again) again.focus();
  });

  // 표시한 직후에는 되돌리기가 먹지 않는다 (빠르게 두 번 눌러도 표시가 남게).
  const UNDO_WAIT_MS = 1500;
  const markedAt = {};

  $cards.addEventListener('click', e => {
    const mark = e.target.closest('[data-done]');
    const undo = e.target.closest('[data-undo]');
    let id;
    let focusSel;
    if (mark) {
      id = mark.dataset.done;
      done[id] = stamp(new Date());
      markedAt[id] = Date.now();
      focusSel = `[data-undo="${CSS.escape(id)}"]`;
    } else if (undo) {
      id = undo.dataset.undo;
      if (Date.now() - (markedAt[id] || 0) < UNDO_WAIT_MS) return;
      delete done[id];
      focusSel = `[data-done="${CSS.escape(id)}"]`;
    } else {
      return;
    }
    save(KEY_DONE, done);
    renderList();
    const again = $cards.querySelector(focusSel);
    if (again) again.focus();
  });

  render();

  // 화면 ③의 '이 주제를 쓰는 할 일'에서 그날로 가려고 연다. 화면 ①의 동작은 그대로.
  window.FirstWeek = {
    showDay(d) {
      d = Number(d);
      if (!DAYS.includes(d)) return;
      day = d;
      save(KEY_DAY, day);
      render();
    },
  };
})();

// 화면 ② 이건 누구에게, 화면 ③ 주제 안내, 그리고 화면 전환(주소의 # 뒤: #/today, #/who, #/topic/아이디 — 요소 id와 겹치면 브라우저가 그 자리로 스크롤해서 / 를 붙였다).
(function () {
  'use strict';

  const GROUPS = ['총무', 'IT', '인사', '기타'];
  const NEED = '확인 필요';
  const topics = ((window.CONTENT && window.CONTENT.topics) || []);
  const tasks = ((window.CONTENT && window.CONTENT.tasks) || []);
  const byId = Object.fromEntries(topics.map(t => [t.id, t]));

  const screens = {
    today: document.getElementById('today'),
    who: document.getElementById('who'),
    topic: document.getElementById('topic'),
  };
  const $menu = document.querySelectorAll('.menu a');
  const $filter = document.getElementById('filter');
  const $groups = document.getElementById('groups');
  const $whoCount = document.getElementById('whoCount');
  const $back = document.getElementById('back');

  function el(tag, props, children) {
    const n = document.createElement(tag);
    Object.assign(n, props || {});
    (children || []).forEach(c => n.append(c));
    return n;
  }

  // 띄어쓰기와 대소문자는 따지지 않는다 ('법인 카드', 'it' 도 찾게).
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, '');
  const hay = t => norm([t.name, t.group, t.role, t.wiki, ...(t.questions || []), ...(t.words || [])].join(' '));

  /* ---------- 화면 ② ---------- */
  function renderWho() {
    const q = norm($filter.value);
    const hits = topics.filter(t => !q || hay(t).includes(q));

    $whoCount.textContent = q ? `주제 ${hits.length}개` : '';

    if (!hits.length) {
      $groups.replaceChildren(el('p', { className: 'empty' }, [
        '맞는 주제가 없어요.', el('br'), '내 사수에게 물어보세요.',
      ]));
      return;
    }

    const parts = [];
    GROUPS.concat([...new Set(hits.map(t => t.group))].filter(g => !GROUPS.includes(g)))
      .forEach(g => {
        const inGroup = hits.filter(t => t.group === g);
        if (!inGroup.length) return;
        parts.push(el('h2', { className: 'group', textContent: g }));
        inGroup.forEach(t => {
          const a = el('a', { className: 'topicBtn', href: `#/topic/${encodeURIComponent(t.id)}` }, [
            el('b', { textContent: t.name }),
            el('span', { textContent: t.role || NEED }),
          ]);
          a.dataset.topic = t.id;
          parts.push(a);
        });
      });
    $groups.replaceChildren(...parts);
  }
  $filter.addEventListener('input', renderWho);

  /* ---------- 화면 ③ ---------- */
  function renderTopic(t) {
    document.getElementById('topicGroup').textContent = t.group;
    document.getElementById('topicTitle').textContent = t.name;

    const row = (name, value) => {
      const dd = el('dd', { textContent: value });
      if (value === NEED) dd.className = 'need';
      return [el('dt', { textContent: name }), dd];
    };
    document.getElementById('topicInfo').replaceChildren(
      ...row('담당', t.role || NEED),
      ...row('위키 위치', t.wiki || '위키에 없음'),
      ...row('짧은 답', t.answer || NEED),
    );

    const using = tasks.filter(k => k.topic === t.id)
      .sort((a, b) => (a.day - b.day) || ((a.order || 0) - (b.order || 0)));
    document.getElementById('topicTasksTitle').hidden = !using.length;
    document.getElementById('topicTasks').replaceChildren(...using.map(k => {
      const a = el('a', { className: 'taskLink', href: '#/today' }, [
        el('div', { className: 'num', textContent: `${k.day}일차` }),
        k.text,
      ]);
      a.dataset.day = k.day;
      return a;
    }));
  }

  document.getElementById('topicTasks').addEventListener('click', e => {
    const a = e.target.closest('[data-day]');
    if (a && window.FirstWeek) window.FirstWeek.showDay(a.dataset.day);
  });

  // '뒤로'는 들어온 화면(① 또는 ②)으로. 주소를 바로 열어 들어왔으면 ②로.
  let movedInside = false;
  $back.addEventListener('click', () => {
    if (movedInside) history.back(); else location.hash = '#/who';
  });

  /* ---------- 화면 전환 ---------- */
  let lastTopic = null;

  function route(first) {
    const h = decodeURIComponent(location.hash.slice(1));
    let name = 'today';
    let topic = null;
    if (h === '/who') name = 'who';
    else if (h.startsWith('/topic/')) {
      topic = byId[h.slice(7)];
      name = topic ? 'topic' : 'who';
    }

    Object.entries(screens).forEach(([k, n]) => { n.hidden = k !== name; });
    $menu.forEach(a => {
      const on = a.dataset.screen === name || (name === 'topic' && a.dataset.screen === 'who');
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (name === 'who') renderWho();
    if (name === 'topic') { renderTopic(topic); lastTopic = topic.id; }

    if (first) return;
    window.scrollTo(0, 0);
    // 화면이 바뀌면 그 화면 제목으로 포커스를 옮긴다. ②로 돌아오면 눌렀던 주제 버튼으로.
    let target = null;
    if (name === 'who' && lastTopic) target = $groups.querySelector(`[data-topic="${CSS.escape(lastTopic)}"]`);
    if (!target) {
      target = screens[name].querySelector('h1');
      target.setAttribute('tabindex', '-1');
    }
    target.focus();
    if (name === 'who') lastTopic = null;
  }

  window.addEventListener('hashchange', () => { movedInside = true; route(false); });
  route(true);
})();
