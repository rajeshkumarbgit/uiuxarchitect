import { page, win, shell, phone, ic, chip, bg } from './kit.mjs';

/* ---------- 2. Field Operations Mobility App ---------- */

const pnav = (on) => `<div class="pnav">${[['dashboard', 'Cockpit'], ['swap_horiz', 'Changes'], ['map', 'Map'], ['person', 'Profile']]
  .map(([i, t]) => `<div class="${t === on ? 'on' : ''}">${ic(i, t === on ? 'f' : '')}${t}</div>`).join('')}</div>`;

const actionCard = (k, state, title, site, time, cta) => `<div class="card" style="padding:14px;border-radius:18px">
  <div class="row" style="align-items:center;gap:8px;margin-bottom:8px">${chip(state, k)}<span class="muted" style="margin-left:auto;font-size:11.5px">${time}</span></div>
  <div style="font-weight:600;font-size:14px">${title}</div><div class="muted" style="font-size:12px;margin:3px 0 10px">${site}</div>
  <div class="row" style="gap:8px"><div class="btn f s" style="flex:1">${cta}</div><div class="btn o s">${ic('more_horiz')}</div></div></div>`;

const phoneCockpit = () => `
  <div class="ptop"><div><div class="muted" style="font-size:12px">Thu 9 Oct · Chennai North</div><h2>Cockpit</h2></div><div class="av" style="margin-left:auto">RK</div></div>
  <div class="pbody">
    <div class="row" style="gap:6px">${chip('Needs action · 4', 'sel', false)}${chip('In progress', 'out', false)}${chip('Today', 'out', false)}</div>
    ${actionCard('warn', 'Approval needed', 'Swap radio unit · CHN-N-0142', 'Site 0142 · Anna Nagar', '01:00 – 03:00', 'Review')}
    ${actionCard('err', 'Blocked', 'Site access not confirmed', 'Site 0158 · Kilpauk', 'Starts in 25 min', 'Call site lead')}
    ${actionCard('info', 'Ready to start', 'Antenna tilt adjustment', 'Site 0163 · Egmore', '03:30 – 04:30', 'Start')}
  </div>${pnav('Cockpit')}`;

const mapSvg = (dark) => `<svg width="100%" height="150" viewBox="0 0 300 150" style="display:block;border-radius:16px;background:${dark ? '#24303a' : '#e6efe9'}">
  <path d="M0 40 C60 30 80 70 140 60 S240 20 300 35" stroke="${dark ? '#3a4a57' : '#fff'}" stroke-width="10" fill="none"/>
  <path d="M40 150 C70 100 120 110 160 80 S230 60 260 0" stroke="${dark ? '#3a4a57' : '#fff'}" stroke-width="8" fill="none"/>
  <path d="M0 110 L300 120" stroke="${dark ? '#33414d' : '#f7f7f2'}" stroke-width="6"/>
  <circle cx="160" cy="80" r="26" fill="${dark ? 'rgba(138,180,248,.18)' : 'rgba(26,115,232,.15)'}"/><circle cx="160" cy="80" r="9" fill="${dark ? '#8ab4f8' : '#1a73e8'}" stroke="#fff" stroke-width="3"/>
  <circle cx="230" cy="40" r="6" fill="#f9ab00" stroke="#fff" stroke-width="2"/><circle cx="70" cy="105" r="6" fill="#34a853" stroke="#fff" stroke-width="2"/></svg>`;

const phoneDetail = (dark = false) => `
  <div class="ptop">${ic('arrow_back')}<div><div class="muted" style="font-size:12px">CHG-24817</div><h2 style="font-size:18px">Swap radio unit</h2></div></div>
  <div class="pbody">
    ${mapSvg(dark)}
    <div class="row" style="gap:8px">${chip('Approval needed', 'warn')}${chip('Crew B · 2 people', 'out', false)}</div>
    <div class="card" style="padding:12px 14px;border-radius:18px">
      ${[['done', 'ok', 'Site access confirmed'], ['done', 'ok', 'Pre-checks passed'], ['radio_button_checked', 'info', 'Swap radio unit'], ['radio_button_unchecked', 'tx3', 'Post-checks & photos']]
        .map(([i, k, s], n) => `<div class="row" style="gap:10px;align-items:center;padding:7px 0;${n < 3 ? 'border-bottom:1px solid var(--line)' : ''}"><span class="ms f" style="color:var(--${k})">${i === 'done' ? 'check_circle' : i}</span><span style="${k === 'tx3' ? 'color:var(--tx3)' : ''}">${s}</span></div>`).join('')}
    </div>
    <div class="btn f" style="height:44px;border-radius:22px">${ic('play_arrow')}Start step 3</div>
  </div>${pnav('Changes')}`;

const phoneStep = () => `
  <div class="ptop">${ic('close')}<div class="muted" style="margin-left:auto">Step 3 of 4</div></div>
  <div class="pbody" style="gap:14px">
    <div class="bar" style="height:6px"><b style="width:66%"></b></div>
    <h2 style="font-size:22px;font-weight:600;line-height:1.25">Swap radio unit on sector B</h2>
    <div class="tx2" style="line-height:1.55">Confirm the cell is locked before removing power. The old unit's serial is captured automatically.</div>
    <div class="card" style="border-radius:18px;display:flex;gap:12px;align-items:center"><div class="pill-ic chip ok" style="height:40px;width:40px;padding:0">${ic('lock')}</div><div><div style="font-weight:600">Cell locked</div><div class="muted" style="font-size:12px">Verified 01:12 by automation</div></div></div>
    <div style="height:120px;border-radius:18px;border:1.5px dashed var(--line);display:grid;place-items:center;color:var(--tx3)"><div style="text-align:center">${ic('photo_camera')}<div style="font-size:12px;margin-top:4px">Add photo of installed unit</div></div></div>
    <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-bottom:12px"><div class="btn f" style="height:48px;border-radius:24px">${ic('check')}Mark step done</div><div class="btn o" style="height:44px;border-radius:22px">Raise an issue</div></div>
  </div>`;

const mob_cover = page(bg.teal, `
  ${phone({ x: 190, y: 160 }, phoneCockpit())}
  ${phone({ x: 630, y: 110, z: 2 }, phoneDetail())}
  ${phone({ x: 1070, y: 160, dark: true }, phoneStep())}
`);

function cockpitDesktop() {
  const col = (title, k, n, cards) => `<div class="card" style="flex:1;background:var(--surf2);border:0;display:flex;flex-direction:column;gap:10px">
    <div class="row" style="align-items:center;gap:8px"><span class="chip ${k}" style="height:22px"><i></i>${title}</span><span class="muted">${n}</span><span class="ms muted" style="margin-left:auto">more_horiz</span></div>
    ${cards.map(([t, s, w, extra]) => `<div class="card" style="padding:12px 14px"><div style="font-weight:600">${t}</div><div class="muted" style="font-size:12px;margin:3px 0 8px">${s}</div><div class="row" style="align-items:center;gap:6px">${chip(w, 'out', false)}${extra || ''}<div class="av" style="width:24px;height:24px;font-size:10px;margin-left:auto">RK</div></div></div>`).join('')}</div>`;
  return shell({
    brand: 'Field Operations', brandIcon: 'cell_tower', crumb: 'Change coordination', title: 'Cockpit',
    nav: [{ i: 'dashboard', t: 'Cockpit', on: true }, { i: 'swap_horiz', t: 'Changes', n: '4' }, { i: 'groups', t: 'Crews' }, { i: 'cell_tower', t: 'Sites' }, { i: 'map', t: 'Map' }, { sec: 'Insights' }, { i: 'bar_chart', t: 'Reports' }],
    actions: `<div class="row" style="gap:8px;margin-left:18px">${chip('Tonight', 'sel', false)}${chip('Chennai region', 'out', false)}</div>`,
    body: `
    <div class="g" style="grid-template-columns:repeat(4,1fr)">
      <div class="card kpi" style="background:var(--warn-c);border-color:transparent"><div class="l" style="color:var(--warn)">${ic('priority_high')}Needs action</div><div class="v">4</div><div class="d">1 blocked · 3 approvals</div></div>
      <div class="card kpi"><div class="l">${ic('autorenew')}In progress</div><div class="v">7</div><div class="d">All within window</div></div>
      <div class="card kpi"><div class="l">${ic('event')}Scheduled tonight</div><div class="v">18</div><div class="d">Next starts 01:00</div></div>
      <div class="card kpi"><div class="l">${ic('groups')}Crews on site</div><div class="v">5 / 6</div><div class="d">Crew D en route</div></div>
    </div>
    <div class="row" style="flex:1;min-height:0">
      ${col('Needs action', 'warn', 4, [['Swap radio unit', 'CHN-N-0142 · Anna Nagar', '01:00 – 03:00', chip('Approval', 'warn')], ['Site access not confirmed', 'CHN-N-0158 · Kilpauk', 'in 25 min', chip('Blocked', 'err')], ['Firewall rule change', 'Core · DC2', '02:00 – 02:30', chip('Approval', 'warn')], ['Crew D delayed', 'CHN-N-0201 · Velachery', 'ETA 01:40', chip('At risk', 'err')]])}
      ${col('In progress', 'info', 7, [['Antenna tilt adjustment', 'CHN-N-0163 · Egmore', 'Step 2 of 4'], ['Fibre splice repair', 'TRN-0412 · Guindy', 'Step 3 of 5'], ['Battery replacement', 'CHN-N-0171 · Adyar', 'Step 1 of 3'], ['Cabinet inspection', 'CHN-N-0177 · T. Nagar', 'Step 2 of 2']])}
      ${col('Scheduled', '', 18, [['Software upgrade batch', '12 sites · Chennai North', '03:30'], ['Power audit', 'CHN-N-0190 · Porur', '04:00'], ['Microwave link swap', 'TRN-0388 · Tambaram', '05:00'], ['Generator test', 'CHN-N-0205 · Avadi', '05:30']])}
    </div>`,
  });
}
const mob_cockpit = page(bg.teal, win({ x: 160, y: 70, w: 1280, h: 860, url: 'fieldops.example.net/cockpit' }, cockpitDesktop()));

const mob_dark = page(bg.night, `
  ${phone({ x: 470, y: 140, dark: true }, phoneCockpit())}
  ${phone({ x: 900, y: 140, dark: true }, phoneDetail(true))}
  <div class="float dark" style="left:120px;top:330px;width:310px;z-index:3;background:#2a2b2e">
    <div class="row" style="gap:12px;align-items:flex-start"><div class="pill-ic chip warn" style="height:38px;width:38px;padding:0">${ic('schedule')}</div><div><div style="font-weight:600">Window starts in 15 min</div><div class="muted" style="font-size:12px;margin-top:3px;line-height:1.45">CHG-24817 is still waiting for approval.</div><div class="row" style="gap:8px;margin-top:10px"><div class="btn f s">Review</div><div class="btn o s">Snooze</div></div></div></div></div>
  <div class="float dark" style="left:1290px;top:560px;width:270px;z-index:3;background:#2a2b2e">
    <div style="font-weight:600;margin-bottom:10px">Tonight</div>
    ${[['Completed', 'ok', 11], ['In progress', 'info', 7], ['Needs action', 'warn', 4]].map(([t, k, n]) => `<div class="row" style="align-items:center;gap:10px;padding:5px 0">${chip(t, k)}<div class="bar" style="flex:1"><b style="width:${n * 7}%;background:var(--${k})"></b></div><span class="muted">${n}</span></div>`).join('')}</div>
`);

/* ---------- 3. Low-Code Integration Platform ---------- */

const node = (x, y, k, icon, title, sub, state, sel = false) => `<div class="card" style="position:absolute;left:${x}px;top:${y}px;width:250px;padding:12px 14px;border-radius:14px;${sel ? 'border:2px solid var(--p);box-shadow:0 0 0 4px var(--p-c)' : 'box-shadow:0 2px 6px rgba(0,0,0,.06)'}">
  <div class="row" style="gap:10px;align-items:center"><div class="pill-ic chip ${k}" style="height:34px;padding:0">${ic(icon)}</div><div style="min-width:0;flex:1"><div style="font-weight:600">${title}</div><div class="muted" style="font-size:11.5px">${sub}</div></div></div>
  ${state ? `<div style="margin-top:10px">${state}</div>` : ''}</div>`;

function flowCanvas() {
  const L = 'stroke="var(--tx3)" stroke-width="1.6" fill="none"';
  return `<div class="card dotbg" style="flex:1;min-width:0;position:relative;padding:0;overflow:hidden;background-color:var(--bg)">
    <div class="row" style="position:absolute;left:14px;top:14px;gap:6px;z-index:2">${['add', 'pan_tool', 'zoom_in', 'zoom_out', 'fit_screen'].map((i) => `<div class="ib" style="background:var(--surf);border:1px solid var(--line);border-radius:10px">${ic(i)}</div>`).join('')}</div>
    <svg style="position:absolute;inset:0;width:100%;height:100%"><g ${L}>
      <g transform="translate(160 0)"><path d="M190 100 V140"/><path d="M190 234 V275"/><path d="M190 369 C190 400 145 400 145 430"/><path d="M190 369 C190 400 455 400 455 430"/><path d="M145 524 C145 555 190 550 190 580"/><path d="M455 512 C455 555 190 550 190 580"/></g></g></svg>
    ${node(225, 40, 'err', 'notifications_active', 'Alarm received', 'Assurance · link degradation', '')}
    ${node(225, 140, 'info', 'inventory_2', 'Fetch inventory', 'Topology + last config', chip('Automated', 'vio'))}
    ${node(225, 275, 'vio', 'auto_awesome', 'AI: suggest configuration', 'Ops assistant · confidence 91%', chip('In review', 'warn'), true)}
    ${node(180, 430, 'warn', 'front_hand', 'Human approval', 'Required below 95% confidence', chip('Waiting · M. Laurent', 'warn'))}
    ${node(490, 430, 'out', 'bolt', 'Auto-run', 'Only at ≥ 95% confidence', `<span class="muted" style="font-size:11.5px">Skipped for this run</span>`)}
    ${node(225, 580, 'teal', 'rocket_launch', 'Execute MOP', 'Apply + verify, auto rollback', '')}
  </div>`;
}

function inspector() {
  return `<div class="card" style="width:290px;flex:none;display:flex;flex-direction:column;gap:14px">
    <div class="row" style="align-items:center;gap:10px"><div class="pill-ic chip vio" style="height:34px;padding:0">${ic('auto_awesome')}</div><div><div style="font-weight:600">AI: suggest configuration</div><div class="muted" style="font-size:11.5px">Block settings</div></div></div>
    <div><div class="lbl">Assistant</div><div class="input">${ic('smart_toy')}Ops assistant</div></div>
    <div><div class="lbl">Auto-run when confidence ≥</div><div class="row" style="align-items:center;gap:10px"><div class="bar" style="flex:1;height:6px;overflow:visible;position:relative"><b style="width:95%"></b><span style="position:absolute;left:95%;top:-6px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:var(--p);box-shadow:0 0 0 4px var(--p-c)"></span></div><span style="font-weight:600">95%</span></div></div>
    <div style="border-top:1px solid var(--line)"></div>
    ${[['Require human review below threshold', true], ['Allow human override at any step', true], ['Notify approver on mobile', true], ['Log reasoning to audit trail', true]].map(([t, on]) => `<div class="row" style="align-items:center;gap:10px"><span style="flex:1">${t}</span><div class="sw ${on ? '' : 'off'}"></div></div>`).join('')}
    <div style="border-top:1px solid var(--line)"></div>
    <div><div class="lbl">Action states</div><div class="row" style="gap:6px;flex-wrap:wrap">${chip('Automated', 'vio')}${chip('In review', 'warn')}${chip('Approved', 'ok')}${chip('Overridden', 'info')}</div></div>
  </div>`;
}

const lcShell = (activeNav = 'Flows') => shell({
  brand: 'Integration Studio', brandIcon: 'account_tree', crumb: 'Flows / Link degradation', title: 'Auto-remediate link degradation',
  nav: [{ i: 'account_tree', t: 'Flows' }, { i: 'cable', t: 'Connectors' }, { i: 'history', t: 'Runs' }, { i: 'fact_check', t: 'Approvals', n: '3' }, { i: 'dashboard_customize', t: 'Templates' }, { sec: 'Admin' }, { i: 'key', t: 'Credentials' }].map((n) => (n.t === activeNav ? { ...n, on: true } : n)),
  actions: `<div class="row" style="gap:8px;margin-left:18px">${chip('Draft', 'out', false)}</div><div class="row" style="gap:8px;margin-left:auto;margin-right:-4px"><div class="btn o s">${ic('science')}Test run</div><div class="btn f s">${ic('publish')}Publish</div></div>`,
  body: `<div class="row" style="flex:1;min-height:0">${flowCanvas()}${inspector()}</div>`,
});

const lc_cover = page(bg.violet, win({ x: 140, y: 60, w: 1320, h: 880, url: 'integration.example.net/flows/link-degradation' }, lcShell().replace('<div class="search">', '<div class="search" style="display:none">')));
const lc_dark = page(bg.night, win({ x: 140, y: 60, w: 1320, h: 880, url: 'integration.example.net/flows/link-degradation', dark: true }, lcShell().replace('<div class="search">', '<div class="search" style="display:none">')));

function approvalsBody() {
  const rows = [
    ['Suggest QoS profile', 'Transport · Lyon', chip('AI', 'vio'), chip('In review', 'warn'), '—', '2 min'],
    ['Restart line card', 'Core · DC2', chip('Rule', 'info'), chip('Automated', 'vio'), 'System', '9 min'],
    ['Reroute traffic via ring B', 'Transport · Sydney', chip('AI', 'vio'), chip('Approved', 'ok'), 'J. Carter', '14 min'],
    ['Increase alarm threshold', 'Assurance · Global', chip('AI', 'vio'), chip('Overridden', 'info'), 'A. Virtanen', '31 min'],
    ['Rollback config v6', 'RAN · Dallas', chip('Rule', 'info'), chip('Automated', 'vio'), 'System', '48 min'],
    ['Open field ticket', 'RAN · Chennai', chip('Person', ''), chip('Approved', 'ok'), 'R. Kumar', '1 h'],
    ['Disable unused port', 'Core · Espoo', chip('AI', 'vio'), chip('Rejected', 'err'), 'S. Mäkinen', '2 h'],
    ['Scale alarm collectors', 'Assurance · Sydney', chip('Rule', 'info'), chip('Automated', 'vio'), 'System', '3 h'],
    ['Adjust handover margin', 'RAN · Austin', chip('AI', 'vio'), chip('Approved', 'ok'), 'D. Moore', '4 h'],
    ['Pause batch upgrade', 'RAN · Chennai', chip('Person', ''), chip('Overridden', 'info'), 'R. Kumar', '5 h'],
  ];
  return `<div class="row" style="flex:1;min-height:0">
    <div class="card" style="flex:1;min-width:0"><div class="ch"><h3>Action log</h3><span class="sub">Every action shows who or what did it</span><div class="r row" style="gap:6px">${chip('All', 'sel', false)}${chip('Needs review · 3', 'out', false)}</div></div>
      <table><tr><th>Action</th><th>Source</th><th>State</th><th>By</th><th>When</th></tr>
      ${rows.map(([a, s, src, st, by, w], n) => `<tr style="${n === 0 ? 'background:var(--p-c)' : ''}"><td><div style="font-weight:500">${a}</div><div class="t2">${s}</div></td><td>${src}</td><td>${st}</td><td class="tx2">${by}</td><td class="muted">${w}</td></tr>`).join('')}</table></div>
    <div class="card" style="width:400px;flex:none;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 40px -20px rgba(15,23,42,.3)">
      <div class="row" style="align-items:center;gap:10px"><div class="pill-ic chip vio" style="height:36px;padding:0">${ic('auto_awesome')}</div><div><div style="font-weight:600;font-size:15px">Review AI suggestion</div><div class="muted" style="font-size:12px">Suggest QoS profile · Transport · Lyon</div></div><span class="ms muted" style="margin-left:auto">close</span></div>
      <div class="row" style="gap:8px">${chip('Confidence 91%', 'warn')}${chip('Below auto-run threshold', 'out', false)}</div>
      <div><div class="lbl">Why</div><div class="tx2" style="line-height:1.55">Packet loss on link TRN-0412 rose above 2% for 10 min. A similar change resolved 14 of 15 past incidents on this ring.</div></div>
      <div class="mono" style="background:var(--surf2);border-radius:12px;padding:12px;font-size:11.5px;line-height:1.8">
        <div class="muted">qos-profile / TRN-0412</div>
        <div style="color:var(--err)">− priority-queue: best-effort</div><div style="color:var(--ok)">+ priority-queue: assured-forwarding</div>
        <div style="color:var(--err)">− buffer: 40ms</div><div style="color:var(--ok)">+ buffer: 25ms</div></div>
      <div><div class="lbl">Impact</div><div class="row" style="gap:8px">${[['Links', '1'], ['Services', '38'], ['Rollback', 'Auto']].map(([l, v]) => `<div style="flex:1;background:var(--surf2);border-radius:12px;padding:10px 12px"><div class="muted" style="font-size:11px">${l}</div><div style="font-weight:600;font-size:16px">${v}</div></div>`).join('')}</div></div>
      <div><div class="lbl">Similar past incidents</div>${[['INC-8812 · ring B', 'Resolved', 'ok'], ['INC-8640 · ring B', 'Resolved', 'ok'], ['INC-8433 · ring A', 'Partially', 'warn']].map(([n, s, k]) => `<div class="row" style="align-items:center;padding:7px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${n}</span>${chip(s, k)}</div>`).join('')}</div>
      <div class="row" style="gap:8px;margin-top:auto"><div class="btn f" style="flex:1">${ic('check')}Approve</div><div class="btn t">${ic('edit')}Override</div><div class="btn o" style="color:var(--err)">Reject</div></div>
    </div></div>`;
}
const lc_states = page(bg.violet, win({ x: 140, y: 60, w: 1320, h: 880, url: 'integration.example.net/approvals' }, shell({
  brand: 'Integration Studio', brandIcon: 'account_tree', crumb: 'Human-in-the-loop', title: 'Approvals',
  nav: [{ i: 'account_tree', t: 'Flows' }, { i: 'cable', t: 'Connectors' }, { i: 'history', t: 'Runs' }, { i: 'fact_check', t: 'Approvals', n: '3', on: true }, { i: 'dashboard_customize', t: 'Templates' }, { sec: 'Admin' }, { i: 'key', t: 'Credentials' }],
  body: approvalsBody(),
})));

/* ---------- 4. Operations Portal Framework Upgrade ---------- */

const portalNav = (on) => [{ i: 'home', t: 'Home' }, { i: 'apps', t: 'Applications' }, { i: 'campaign', t: 'Announcements' }, { sec: 'Admin' }, { i: 'health_and_safety', t: 'Platform health' }, { i: 'group', t: 'Users & roles' }, { i: 'settings', t: 'Settings' }].map((n) => (n.t === on ? { ...n, on: true } : n));

function healthBody() {
  const pkgs = [
    ['Angular framework', 'core, router, forms', 'Outdated', 'Current LTS', 'High'],
    ['RxJS', 'reactive streams', 'Outdated', 'Current', 'Medium'],
    ['NgRx', 'state management', 'Outdated', 'Current', 'Low'],
    ['Charting library', 'dashboards', 'Vulnerable', 'Patched', 'High'],
    ['Date utilities', 'scheduling', 'Vulnerable', 'Replaced', 'Medium'],
    ['HTTP client helpers', 'API layer', 'Vulnerable', 'Patched', 'Critical'],
    ['Build toolchain', 'CLI, bundler', 'Outdated', 'Current', '—'],
  ];
  const sev = { Critical: 'err', High: 'err', Medium: 'warn', Low: 'info', '—': '' };
  const step = (t, n) => `<div class="row" style="align-items:center;gap:8px;flex:1"><span class="ms f" style="color:var(--ok)">check_circle</span><span style="font-weight:500">${t}</span>${n < 4 ? '<div style="flex:1;height:2px;background:var(--ok);opacity:.5"></div>' : ''}</div>`;
  return `
  <div class="card"><div class="row" style="align-items:center">${['Audit', 'Framework upgrade', 'Dependencies', 'Regression tests', 'Release'].map(step).join('')}</div></div>
  <div class="g" style="grid-template-columns:repeat(4,1fr)">
    <div class="card kpi"><div class="l">${ic('deployed_code')}Framework</div><div class="v" style="font-size:22px">Current LTS</div><div class="d">${chip('Supported', 'ok')}</div></div>
    <div class="card kpi"><div class="l">${ic('gpp_good')}Critical / high advisories</div><div class="v">0</div><div class="d">Remediated during upgrade</div></div>
    <div class="card kpi"><div class="l">${ic('package_2')}Dependencies reviewed</div><div class="v">All</div><div class="d">Updated, patched or replaced</div></div>
    <div class="card kpi"><div class="l">${ic('fact_check')}User workflows</div><div class="v" style="font-size:22px">Regression-tested</div><div class="d">Before release</div></div>
  </div>
  <div class="card" style="flex:1;min-height:0"><div class="ch"><h3>Dependency remediation</h3><span class="sub">Illustrative</span></div>
    <table><tr><th>Package</th><th>Used for</th><th>Before</th><th></th><th>After</th><th>Advisory severity</th></tr>
    ${pkgs.map(([p, u, b, a, s]) => `<tr><td style="font-weight:500">${p}</td><td class="muted">${u}</td><td>${chip(b, b === 'Vulnerable' ? 'err' : 'warn')}</td><td class="muted">${ic('arrow_forward')}</td><td>${chip(a, 'ok')}</td><td>${s === '—' ? '<span class="muted">—</span>' : chip(s, sev[s], false)}</td></tr>`).join('')}</table></div>`;
}
const up_cover = page(bg.night, win({ x: 160, y: 70, w: 1280, h: 860, url: 'portal.example.net/admin/health', dark: true }, shell({
  brand: 'Operations Portal', brandIcon: 'grid_view', crumb: 'Admin', title: 'Framework & dependency health', nav: portalNav('Platform health'), body: healthBody(),
})));

function portalHome() {
  const apps = [['account_tree', 'info', 'Workflow Manager', 'Build and run network workflows'], ['calendar_month', 'teal', 'Scheduler', 'Plan maintenance windows'], ['rocket_launch', 'vio', 'MOP Launcher', 'Start approved procedures'], ['monitor_heart', 'err', 'MOP Monitor', 'Track running procedures'], ['cell_tower', 'ok', 'Field Operations', 'Cockpit for field changes'], ['bar_chart', 'warn', 'Reports', 'Performance and SLA reports']];
  return shell({
    brand: 'Operations Portal', brandIcon: 'grid_view', crumb: 'Good morning, Rajesh', title: 'Home', nav: portalNav('Home'),
    body: `<div class="row" style="flex:1;min-height:0">
      <div class="col" style="flex:1;min-width:0">
        <div class="card" style="background:linear-gradient(120deg,var(--p-c),var(--vio-c));border:0;display:flex;align-items:center;gap:16px;padding:20px"><div class="pill-ic" style="background:var(--surf);height:44px;width:44px">${ic('new_releases', 'f')}</div><div><div style="font-weight:600;font-size:15px">Portal updated to the latest framework</div><div class="tx2" style="margin-top:3px">Security patches applied. Your saved views and shortcuts are unchanged.</div></div><div class="btn t s" style="margin-left:auto;background:var(--surf)">What's new</div></div>
        <div class="ch" style="margin:4px 0 -4px"><h3>Applications</h3></div>
        <div class="g" style="grid-template-columns:repeat(3,1fr)">${apps.map(([i, k, t, d]) => `<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="pill-ic chip ${k}" style="height:40px;width:40px;padding:0">${ic(i)}</div><div style="font-weight:600;font-size:14px">${t}</div><div class="muted" style="font-size:12px">${d}</div></div>`).join('')}</div>
        <div class="card" style="flex:1"><div class="ch"><h3>Announcements</h3><span class="r muted">All</span></div>${[['campaign', 'info', 'Maintenance freeze over year-end', 'Operations · 2 days ago'], ['shield', 'ok', 'Security patches applied to the portal', 'Platform team · 3 days ago'], ['school', 'vio', 'New: design-system guidelines for app teams', 'UX · 1 week ago']].map(([i, k, tt, s]) => `<div class="row" style="gap:12px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><div class="pill-ic chip ${k}" style="height:34px;padding:0">${ic(i)}</div><div><div style="font-weight:500">${tt}</div><div class="muted" style="font-size:11.5px">${s}</div></div></div>`).join('')}</div>
      </div>
      <div class="col" style="width:300px;flex:none">
        <div class="card"><div class="ch"><h3>Platform status</h3></div>${[['Workflow engine', 'ok', 'Operational'], ['Scheduler', 'ok', 'Operational'], ['Inventory sync', 'warn', 'Delayed 5 min'], ['Notifications', 'ok', 'Operational']].map(([n, k, s]) => `<div class="row" style="align-items:center;padding:8px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${n}</span>${chip(s, k)}</div>`).join('')}</div>
        <div class="card" style="flex:1"><div class="ch"><h3>Recent</h3></div>${[['5G RAN parameter rollout', 'Workflow · 2 min ago'], ['Week 41 schedule', 'Scheduler · 1 h ago'], ['MOP-2291', 'Monitor · 1 h ago']].map(([t, s]) => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:11.5px">${s}</div></div>`).join('')}</div>
      </div></div>`,
  });
}
const up_portal = page(bg.blue, win({ x: 160, y: 70, w: 1280, h: 860, url: 'portal.example.net/home' }, portalHome()));

/* ---------- 5. AI-Assisted Development ---------- */

const code = (lines) => lines.map((l, n) => `<div style="display:flex;gap:18px"><span style="width:22px;text-align:right;color:#5c6370">${n + 1}</span><span style="white-space:pre">${l}</span></div>`).join('');
const K = (s) => `<span style="color:#c678dd">${s}</span>`, S = (s) => `<span style="color:#98c379">${s}</span>`, F = (s) => `<span style="color:#61afef">${s}</span>`, T = (s) => `<span style="color:#e5c07b">${s}</span>`, G = (s) => `<span style="color:#7f848e;font-style:italic">${s}</span>`;

function editor() {
  const lines = [
    `${K('import')} { Component, Input } ${K('from')} ${S("'@angular/core'")};`,
    ``,
    `${K('export type')} ${T('ActionState')} = ${S("'automated'")} | ${S("'in-review'")} | ${S("'approved'")} | ${S("'overridden'")};`,
    ``,
    `@${F('Component')}({`,
    `  selector: ${S("'ds-status-chip'")},`,
    `  standalone: ${K('true')},`,
    `  template: ${S('`&lt;span class="chip" [class]="state"&gt;')}`,
    `    ${S('&lt;ds-icon [name]="icon" /&gt; {{ label }}')}`,
    `  ${S('&lt;/span&gt;`')},`,
    `  styleUrl: ${S("'./status-chip.scss'")},`,
    `})`,
    `${K('export class')} ${T('StatusChipComponent')} {`,
    `  @${F('Input')}({ required: ${K('true')} }) state!: ${T('ActionState')};`,
    ``,
    `  ${K('get')} ${F('label')}() {`,
    G(`    return { automated: 'Automated', 'in-review': 'In review',`),
    G(`             approved: 'Approved', overridden: 'Overridden' }[this.state];`),
    G(`  }`),
    ``,
    `  ${K('get')} ${F('icon')}() {`,
    `    ${K('return')} ${T('STATE_ICONS')}[${K('this')}.state];`,
    `  }`,
    `}`,
  ];
  return `<div class="app" style="background:#1e2127;color:#abb2bf">
    <div style="width:230px;flex:none;background:#21252b;padding:12px 8px;font-size:12.5px;border-right:1px solid #181a1f">
      <div style="color:#7f848e;font-size:10.5px;letter-spacing:.06em;padding:4px 10px 10px">EXPLORER</div>
      ${[['folder_open', 'design-system', 0], ['folder_open', 'components', 1], ['folder', 'button', 2], ['folder', 'data-table', 2], ['folder_open', 'status-chip', 2], ['description', 'status-chip.component.ts', 3, 1], ['description', 'status-chip.scss', 3], ['description', 'status-chip.spec.ts', 3], ['folder', 'tokens', 1], ['description', 'color.tokens.json', 2], ['description', 'theme.scss', 2]]
        .map(([i, t, d, on]) => `<div style="display:flex;align-items:center;gap:6px;white-space:nowrap;font-size:12px;padding:4px 10px 4px ${8 + d * 12}px;border-radius:6px;${on ? 'background:#2c313a;color:#fff' : ''}"><span class="ms" style="font-size:16px;color:${i.startsWith('folder') ? '#e5c07b' : '#61afef'}">${i}</span>${t}</div>`).join('')}
    </div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column">
      <div style="display:flex;background:#21252b;font-size:12px"><div style="padding:10px 16px;background:#1e2127;color:#fff;border-top:2px solid #61afef">status-chip.component.ts</div><div style="padding:10px 16px">status-chip.scss</div></div>
      <div class="mono" style="flex:1;padding:16px 10px;font-size:13px;line-height:1.85">${code(lines)}</div>
      <div style="margin:0 16px 16px;padding:10px 14px;border-radius:10px;background:#2c313a;font-size:12px;display:flex;gap:10px;align-items:center"><span class="ms" style="color:#c678dd;font-size:18px">auto_awesome</span>Suggestion · press <b style="color:#fff">Tab</b> to accept, <b style="color:#fff">Esc</b> to dismiss<span style="margin-left:auto;color:#7f848e">Human review required before merge</span></div>
    </div>
    <div style="width:380px;flex:none;background:#21252b;border-left:1px solid #181a1f;display:flex;flex-direction:column;padding:14px;gap:12px;font-size:12.5px">
      <div style="display:flex;align-items:center;gap:8px;color:#fff;font-weight:600"><span class="ms" style="color:#c678dd">auto_awesome</span>AI assistant</div>
      <div style="align-self:flex-end;background:#3a3f4b;color:#fff;padding:10px 12px;border-radius:14px 14px 4px 14px;max-width:85%;line-height:1.5">Create a status chip for our four action states. Use the design tokens, not hard-coded colours.</div>
      <div style="line-height:1.6">Here's a standalone component. Colours come from <span class="mono" style="color:#e5c07b">status.*</span> tokens, so light and dark themes work automatically.</div>
      <div class="mono" style="background:#1e2127;border-radius:10px;padding:10px 12px;font-size:10.5px;line-height:1.7;white-space:nowrap;overflow:hidden">${S('.chip.automated')} { color: ${F('var')}(--status-automated); }<br>${S('.chip.in-review')} { color: ${F('var')}(--status-warning); }<br>${S('.chip.approved')} { color: ${F('var')}(--status-success); }</div>
      <div style="display:flex;gap:8px"><div class="btn s" style="background:#61afef;color:#1e2127">Insert</div><div class="btn s" style="border:1px solid #3a3f4b;color:#abb2bf">Explain</div></div>
      <div style="margin-top:auto;border:1px solid #3a3f4b;border-radius:12px;padding:10px 12px;color:#7f848e">Ask about this file…</div>
    </div></div>`;
}
const ai_cover = page(bg.night, win({ x: 120, y: 70, w: 1360, h: 860, url: 'ide · design-system', dark: true }, editor()).replace('<div class="url">', '<div class="url" style="background:#2c313a">'));

function promptToUi() {
  return `<div class="app">
    <div style="width:430px;flex:none;background:var(--surf);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:18px;gap:14px">
      <div class="row" style="align-items:center;gap:10px"><div class="logo">${ic('auto_awesome', 'f')}</div><div style="font-weight:600;font-size:15px">Prototype from a prompt</div></div>
      <div style="align-self:flex-end;background:var(--p-c);color:var(--on-p-c);padding:12px 14px;border-radius:16px 16px 4px 16px;line-height:1.55;max-width:90%">A card for field coordinators that lists only changes needing action tonight. Status chips, a primary action per row, our light theme.</div>
      <div class="tx2" style="line-height:1.6">Generated a first draft using the team's tokens and chip component. Next steps I'd suggest:</div>
      ${['Swap the mock data for the changes API', 'Run an accessibility check on chip contrast', 'Review with the field-ops product owner'].map((s) => `<div class="row" style="gap:10px;align-items:flex-start"><span class="ms" style="color:var(--p)">check_circle</span><span>${s}</span></div>`).join('')}
      <div class="row" style="gap:8px">${chip('v0-style draft', 'vio', false)}${chip('Needs review', 'warn')}</div>
      <div style="margin-top:auto" class="input">${ic('add')}Refine: "make blocked items stand out"…<span class="ms" style="margin-left:auto;color:var(--p)">send</span></div>
    </div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;background:var(--surf2)">
      <div class="row" style="align-items:center;gap:8px;padding:12px 18px;border-bottom:1px solid var(--line);background:var(--surf)">${chip('Preview', 'sel', false)}${chip('Code', 'out', false)}<div class="row" style="margin-left:auto;gap:8px">${['desktop_windows', 'tablet_mac', 'smartphone'].map((i) => `<div class="ib">${ic(i)}</div>`).join('')}<div class="btn t s">${ic('open_in_new')}Open in editor</div></div></div>
      <div style="flex:1;display:grid;place-items:center;padding:30px" class="dotbg">
        <div class="card" style="width:520px;padding:20px;border-radius:20px;box-shadow:0 20px 50px -20px rgba(15,23,42,.25)">
          <div class="row" style="align-items:center;margin-bottom:6px"><div style="font-weight:600;font-size:16px">Needs action tonight</div><span class="chip err" style="margin-left:auto">4</span></div>
          <div class="muted" style="margin-bottom:12px">Chennai region · updated just now</div>
          ${[['Swap radio unit', 'CHN-N-0142 · 01:00', 'warn', 'Approval', 'Review'], ['Site access not confirmed', 'CHN-N-0158 · in 25 min', 'err', 'Blocked', 'Call lead'], ['Firewall rule change', 'Core DC2 · 02:00', 'warn', 'Approval', 'Review'], ['Antenna tilt adjustment', 'CHN-N-0163 · 03:30', 'info', 'Ready', 'Start']]
            .map(([t, s, k, c, a]) => `<div class="row" style="align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line)"><div style="flex:1"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:12px">${s}</div></div>${chip(c, k)}<div class="btn ${k === 'info' ? 'f' : 't'} s">${a}</div></div>`).join('')}
        </div></div>
    </div></div>`;
}
const ai_prompt = page(bg.violet, win({ x: 140, y: 70, w: 1320, h: 860, url: 'prototype.example.app/draft/cockpit-card' }, promptToUi()));

/* ---------- 6. Enterprise Intranet Portal & In-house Tools ---------- */

const intraTop = (on) => `<div style="height:60px;flex:none;display:flex;align-items:center;gap:26px;padding:0 26px;background:var(--surf);border-bottom:1px solid var(--line)">
  <div class="brand" style="padding:0"><div class="logo" style="background:linear-gradient(135deg,#00897b,#1a73e8)">${ic('hub', 'f')}</div>Intranet</div>
  ${['Home', 'News', 'Tools', 'People', 'Policies'].map((t) => `<div style="font-weight:500;color:${t === on ? 'var(--p)' : 'var(--tx2)'};height:60px;display:flex;align-items:center;${t === on ? 'box-shadow:inset 0 -3px 0 var(--p)' : ''}">${t}</div>`).join('')}
  <div class="search" style="margin-left:auto">${ic('search')}Search people, tools, documents</div><div class="av">PS</div></div>`;

function intranetHome() {
  const apps = [['schedule', 'info', 'Time Tracking'], ['trending_up', 'ok', 'Performance'], ['ballot', 'vio', 'Surveys'], ['handyman', 'warn', 'Tools Gallery'], ['auto_stories', 'teal', 'Newsletter'], ['contacts', 'err', 'Directory']];
  return `${intraTop('Home')}<div class="body" style="padding:22px 26px">
    <div class="card" style="border:0;padding:26px;background:linear-gradient(120deg,#0b57d0,#00897b);color:#fff;display:flex;align-items:center;gap:24px">
      <div><div style="font-size:24px;font-weight:600">Good morning, Priya</div><div style="opacity:.85;margin-top:6px">Your timesheet for week 41 is due Friday. 2 surveys are waiting for you.</div></div>
      <div class="row" style="margin-left:auto;gap:10px"><div class="btn" style="background:#fff;color:#0b57d0">Fill timesheet</div><div class="btn" style="border:1px solid rgba(255,255,255,.6);color:#fff">Open surveys</div></div></div>
    <div class="row" style="flex:1;min-height:0">
      <div class="col" style="flex:1.5;min-width:0">
        <div class="ch" style="margin:0 0 -4px"><h3>Your tools</h3><span class="r muted">Customize</span></div>
        <div class="g" style="grid-template-columns:repeat(3,1fr)">${apps.map(([i, k, t]) => `<div class="card" style="display:flex;align-items:center;gap:12px"><div class="pill-ic chip ${k}" style="height:42px;width:42px;padding:0">${ic(i)}</div><div style="font-weight:600">${t}</div></div>`).join('')}</div>
        <div class="card" style="flex:1"><div class="ch"><h3>News</h3><span class="r muted">See all</span></div>
          ${[['#c2e7ff', 'GDC Chennai opens a new delivery floor', 'Facilities · 2 days ago'], ['#c4eed0', 'Quality week: share your improvement ideas', 'Quality office · 4 days ago'], ['#ffdbcb', 'Monthly newsletter — September edition', 'Communications · 1 week ago'], ['#e9ddff', 'New in Tools Gallery: report builder', 'Tools team · 2 weeks ago']]
            .map(([c, t, s]) => `<div class="row" style="gap:14px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><div style="width:64px;height:44px;border-radius:10px;background:${c}"></div><div><div style="font-weight:500">${t}</div><div class="muted" style="font-size:12px">${s}</div></div></div>`).join('')}</div>
      </div>
      <div class="col" style="flex:1;min-width:0">
        <div class="card"><div class="ch"><h3>This week</h3></div>
          <div class="row" style="align-items:flex-end;gap:10px;height:110px">${[[7.5, 'M'], [8, 'T'], [8, 'W'], [6.5, 'T'], [0, 'F']].map(([h, d]) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end"><div style="width:56%;height:${h * 11}px;border-radius:8px;background:${h ? 'var(--p)' : 'var(--surf2)'}"></div><span class="muted" style="font-size:11px">${d}</span></div>`).join('')}</div>
          <div class="row" style="margin-top:10px;align-items:center"><span class="tx2">30.0 of 40.0 h logged</span><span class="r" style="margin-left:auto">${chip('Due Fri', 'warn')}</span></div></div>
        <div class="card" style="flex:1"><div class="ch"><h3>Events</h3></div>
          ${[['14', 'OCT', 'Town hall — Global delivery'], ['17', 'OCT', 'UX clinic: accessible forms'], ['22', 'OCT', 'Performance review window opens'], ['29', 'OCT', 'Survey results: workplace 2013']].map(([d, m, t]) => `<div class="row" style="gap:12px;align-items:center;padding:8px 0"><div style="width:44px;text-align:center;border-radius:10px;background:var(--p-c);color:var(--on-p-c);padding:4px 0"><div style="font-weight:700;font-size:15px">${d}</div><div style="font-size:9.5px;font-weight:600">${m}</div></div><div style="font-weight:500">${t}</div></div>`).join('')}</div>
      </div></div></div>`;
}
const in_cover = page(bg.warm, win({ x: 160, y: 70, w: 1280, h: 860, url: 'intranet.example.com' }, intranetHome()));

function timesheet() {
  const rows = [['Network apps — UI build', 'CC-4102', [8, 8, 7.5, 6, 0]], ['Design system support', 'CC-4108', [0, 0, 0.5, 1, 0]], ['Intranet maintenance', 'CC-2201', [0, 0, 0, 1, 0]], ['Training', 'CC-9000', [0, 0, 0, 0, 0]]];
  const tot = [0, 1, 2, 3, 4].map((d) => rows.reduce((s, r) => s + r[2][d], 0));
  const cell = (v, today) => `<td><div class="input" style="height:34px;width:64px;justify-content:center;${today ? 'border-color:var(--p);box-shadow:0 0 0 3px var(--p-c)' : ''};color:${v ? 'var(--tx)' : 'var(--tx3)'}">${v ? v.toFixed(1) : '—'}</div></td>`;
  return `${intraTop('Tools')}<div class="body" style="padding:22px 26px">
    <div class="row" style="align-items:center;gap:12px"><div><div class="crumb">Time Tracking</div><div style="font-size:20px;font-weight:600">Week 41 · 6 – 10 Oct</div></div>
      <div class="row" style="gap:6px;margin-left:16px"><div class="ib" style="border:1px solid var(--line)">${ic('chevron_left')}</div><div class="ib" style="border:1px solid var(--line)">${ic('chevron_right')}</div></div>
      <div class="row" style="margin-left:auto;gap:8px"><div class="btn o s">${ic('content_copy')}Copy last week</div><div class="btn f s">${ic('send')}Submit</div></div></div>
    <div class="row" style="flex:1;min-height:0">
      <div class="card" style="flex:1;min-width:0"><table><tr><th>Project</th><th>Cost centre</th>${['Mon 6', 'Tue 7', 'Wed 8', 'Thu 9', 'Fri 10'].map((d) => `<th>${d}</th>`).join('')}<th>Total</th></tr>
        ${rows.map(([p, c, h]) => `<tr><td style="font-weight:500">${p}</td><td>${chip(c, 'out', false)}</td>${h.map((v, i) => cell(v, i === 3 && p.startsWith('Network'))).join('')}<td style="font-weight:600">${h.reduce((a, b) => a + b, 0).toFixed(1)}</td></tr>`).join('')}
        <tr><td style="font-weight:600">Daily total</td><td></td>${tot.map((v) => `<td style="font-weight:600;padding-left:22px">${v.toFixed(1)}</td>`).join('')}<td style="font-weight:700;color:var(--p)">${tot.reduce((a, b) => a + b, 0).toFixed(1)}</td></tr></table>
        <div class="btn t s" style="margin-top:12px">${ic('add')}Add project</div></div>
      <div class="col" style="width:300px;flex:none">
        <div class="card"><div class="ch"><h3>Cost recharge</h3><span class="sub">Auto-calculated</span></div>
          ${[['CC-4102', 29.5, 'p'], ['CC-4108', 1.5, 'vio'], ['CC-2201', 1, 'teal']].map(([c, h, k]) => `<div style="padding:7px 0"><div class="row" style="justify-content:space-between;margin-bottom:5px"><span>${c}</span><span class="muted">${h} h</span></div><div class="bar"><b style="width:${(h / 32) * 100}%;background:var(--${k})"></b></div></div>`).join('')}
          <div class="tx2" style="margin-top:10px;font-size:12px;line-height:1.5">Recharge entries are created from your timesheet — no separate form.</div></div>
        <div class="card" style="display:flex;gap:12px;align-items:flex-start;background:var(--ok-c);border:0"><span class="ms f" style="color:var(--ok)">verified</span><div><div style="font-weight:600">Manager approval is one click</div><div class="tx2" style="font-size:12px;margin-top:3px">Approvals happen in the same tool.</div></div></div>
      </div></div></div>`;
}
const in_time = page(bg.warm, win({ x: 160, y: 150, w: 1280, h: 700, url: 'intranet.example.com/tools/time-tracking' }, timesheet()));

function survey() {
  return `${intraTop('Tools')}<div class="body" style="padding:22px 26px;align-items:center">
    <div style="width:760px;display:flex;flex-direction:column;gap:16px">
      <div class="row" style="align-items:center;gap:10px">${['Workplace', 'Tools', 'Team', 'Comments'].map((s, i) => `<div class="row" style="align-items:center;gap:8px;flex:1"><span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:600;font-size:12px;background:${i < 1 ? 'var(--ok)' : i === 1 ? 'var(--p)' : 'var(--surf2)'};color:${i < 2 ? '#fff' : 'var(--tx3)'}">${i < 1 ? '✓' : i + 1}</span><span style="font-weight:500;color:${i <= 1 ? 'var(--tx)' : 'var(--tx3)'}">${s}</span>${i < 3 ? '<div style="flex:1;height:2px;background:var(--line)"></div>' : ''}</div>`).join('')}</div>
      <div class="card" style="padding:24px"><div class="muted" style="margin-bottom:6px">Question 4 of 12</div><div style="font-size:18px;font-weight:600;margin-bottom:18px">How easy is it to find the internal tool you need?</div>
        <div class="row" style="gap:10px">${['Very hard', 'Hard', 'Neutral', 'Easy', 'Very easy'].map((t, i) => `<div style="flex:1;border:1.5px solid ${i === 3 ? 'var(--p)' : 'var(--line)'};background:${i === 3 ? 'var(--p-c)' : 'var(--surf)'};border-radius:14px;padding:14px 8px;text-align:center"><div style="font-size:20px;font-weight:600;color:${i === 3 ? 'var(--on-p-c)' : 'var(--tx2)'}">${i + 1}</div><div style="font-size:11.5px;color:var(--tx3);margin-top:4px">${t}</div></div>`).join('')}</div></div>
      <div class="card" style="padding:24px"><div style="font-size:16px;font-weight:600;margin-bottom:14px">Which tools do you use every week?</div>
        <div class="row" style="gap:8px;flex-wrap:wrap">${[['Time Tracking', 1], ['Tools Gallery', 1], ['Directory', 0], ['Performance', 0], ['Newsletter', 1], ['Surveys', 0]].map(([t, on]) => `<span class="chip ${on ? 'sel' : 'out'}" style="height:32px;padding:0 14px;font-size:12.5px">${on ? ic('check') : ''}${t}</span>`).join('')}</div>
        <div class="lbl" style="margin-top:18px">Anything we should improve? (optional)</div><div class="input" style="height:80px;align-items:flex-start;padding-top:10px">A shortcut to my most-used tools on the home page…</div></div>
      <div class="row" style="justify-content:space-between"><div class="btn o">Back</div><div class="row" style="gap:10px;align-items:center"><span class="muted">Saved automatically</span><div class="btn f">Next</div></div></div>
    </div></div>`;
}
const in_survey = page(bg.mint, win({ x: 160, y: 110, w: 1280, h: 780, url: 'intranet.example.com/tools/surveys/workplace-2013' }, survey()));

/* ---------- Hero visual (home page) ---------- */

function heroVisual(dark) {
  const d = dark ? 'dark' : '';
  return {
    w: 1000, h: 1250,
    html: page(dark ? bg.night : bg.blue, `
      ${win({ x: 70, y: 80, w: 1150, h: 700, url: 'automation.example.net/workflows', dark }, shell({
        brand: 'Network Automation', nav: [{ i: 'dashboard', t: 'Overview' }, { i: 'account_tree', t: 'Workflow Manager', on: true }, { i: 'calendar_month', t: 'Scheduler' }, { i: 'rocket_launch', t: 'MOP Launcher' }, { i: 'monitor_heart', t: 'MOP Monitor', n: '2' }],
        crumb: 'Operations', title: 'Workflow Manager',
        body: `<div class="g" style="grid-template-columns:repeat(3,1fr)">${[['account_tree', 'Active workflows', '128'], ['pending_actions', 'Awaiting approval', '6'], ['verified', 'Success rate', '98.4%']].map(([i, l, v]) => `<div class="card kpi"><div class="l">${ic(i)}${l}</div><div class="v">${v}</div></div>`).join('')}</div>
          <div class="card" style="flex:1"><div class="ch"><h3>Workflows</h3></div><table>${[['5G RAN parameter rollout', chip('Running', 'info'), 68], ['Core firewall policy update', chip('Awaiting approval', 'warn'), 40], ['Transport link migration', chip('Completed', 'ok'), 100], ['Backhaul QoS profile change', chip('Rolled back', 'err'), 55], ['Alarm correlation rule', chip('Automated', 'vio'), 84]].map(([n, c, p]) => `<tr><td style="font-weight:500">${n}</td><td>${c}</td><td><div class="bar"><b style="width:${p}%"></b></div></td></tr>`).join('')}</table></div>`,
      }))}
      ${phone({ x: 60, y: 560, dark, scale: 0.86, z: 3 }, phoneCockpit()).replace('transform:', 'transform-origin:top left;transform:')}
      <div class="float ${d}" style="left:430px;top:930px;width:500px;z-index:4">
        <div class="row" style="align-items:center;margin-bottom:12px"><div style="font-weight:600">Human-in-the-loop</div><span class="muted" style="margin-left:auto;font-size:12px">AI action states</span></div>
        <div class="row" style="align-items:center;gap:8px">${chip('Automated', 'vio')}<span class="ms muted">arrow_forward</span>${chip('In review', 'warn')}<span class="ms muted">arrow_forward</span>${chip('Approved', 'ok')}</div>
        <div class="row" style="align-items:center;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)"><span class="ms" style="color:var(--warn)">front_hand</span><span style="flex:1">Human override</span><div class="sw"></div></div></div>
      <div class="float ${d}" style="left:590px;top:700px;width:340px;z-index:4">
        <div style="font-weight:600;margin-bottom:10px">Design tokens</div>
        <div class="row" style="gap:8px">${['#1a73e8', '#7b3fe4', '#188038', '#a85f00', '#c5221f'].map((c) => `<div style="flex:1;height:36px;border-radius:10px;background:${c}"></div>`).join('')}</div>
        <div class="row" style="gap:8px;margin-top:10px">${chip('Light', dark ? 'out' : 'sel', false)}${chip('Dark', dark ? 'sel' : 'out', false)}<span class="muted" style="margin-left:auto;font-size:12px">5 apps · 1 system</span></div></div>
    `),
  };
}

export const more = {
  'mob-cover': mob_cover,
  'mob-cockpit': mob_cockpit,
  'mob-dark': mob_dark,
  'lc-cover': lc_cover,
  'lc-states': lc_states,
  'lc-dark': lc_dark,
  'up-cover': up_cover,
  'up-portal': up_portal,
  'ai-cover': ai_cover,
  'ai-prompt': ai_prompt,
  'in-cover': in_cover,
  'in-time': in_time,
  'in-survey': in_survey,
  'hero-light': heroVisual(false),
  'hero-dark': heroVisual(true),
};
