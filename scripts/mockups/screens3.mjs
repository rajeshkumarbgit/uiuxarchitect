// Concept work: prototypes, UX flows and websites.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, win, shell, phone, ic, chip, bg } from './kit.mjs';

const assets = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets');
const asset = (name) => {
  const file = path.join(assets, `${name}.webp`);
  return fs.existsSync(file) ? `data:image/webp;base64,${fs.readFileSync(file).toString('base64')}` : '';
};

/* ---------- A. Alarm triage copilot (prototype) ---------- */

function triageBody() {
  const alarms = [
    ['err', 'Link down', 'TRN-0412 · Guindy', '02:14', true],
    ['err', 'Loss of signal', 'CHN-N-0158 · Kilpauk', '02:14'],
    ['warn', 'High BER', 'TRN-0409 · Adyar', '02:13'],
    ['warn', 'Cell unavailable', 'CHN-N-0163 · Egmore', '02:15'],
    ['warn', 'Cell unavailable', 'CHN-N-0171 · Adyar', '02:15'],
    ['info', 'Threshold crossed', 'CORE-DC2 · Latency', '02:16'],
    ['warn', 'Cell unavailable', 'CHN-N-0177 · T. Nagar', '02:16'],
    ['info', 'Power alarm cleared', 'CHN-N-0190 · Porur', '02:11'],
  ];
  return `<div class="row" style="flex:1;min-height:0">
    <div class="card" style="width:300px;flex:none;padding:10px">
      <div class="row" style="align-items:center;padding:6px 6px 10px"><h3 style="font-size:14px;font-weight:600">Active alarms</h3><span class="chip err" style="margin-left:auto;height:20px">47</span></div>
      <div class="row" style="gap:6px;padding:0 6px 10px">${chip('Critical 12', 'err', false)}${chip('Major 21', 'warn', false)}</div>
      ${alarms.map(([k, t, s, time, on]) => `<div class="row" style="gap:10px;align-items:center;padding:10px;border-radius:12px;${on ? 'background:var(--p-c)' : ''}"><span style="width:8px;height:8px;border-radius:50%;background:var(--${k})"></span><div style="flex:1;min-width:0"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:11.5px">${s}</div></div><span class="muted" style="font-size:11px">${time}</span></div>`).join('')}
    </div>
    <div class="col" style="flex:1;min-width:0">
      <div class="card"><div class="row" style="align-items:center;gap:12px"><div class="pill-ic chip err" style="height:42px;width:42px;padding:0">${ic('link_off')}</div><div><div style="font-size:16px;font-weight:600">Link down · TRN-0412</div><div class="muted">Guindy ↔ Adyar ring B · raised 02:14 · 46 related alarms</div></div><div class="btn o s" style="margin-left:auto">${ic('person_add')}Assign</div></div></div>
      <div class="g" style="grid-template-columns:repeat(3,1fr)">${[['cell_tower', 'Cells affected', '12'], ['groups', 'Subscribers impacted', '~18k'], ['schedule', 'Time since first alarm', '6 min']].map(([i, l, v]) => `<div class="card kpi"><div class="l">${ic(i)}${l}</div><div class="v">${v}</div></div>`).join('')}</div>
      <div class="card" style="flex:1"><div class="ch"><h3>Correlated events</h3><span class="sub">Last 10 minutes</span></div>
        ${[['02:13:52', 'warn', 'BER rising on TRN-0409'], ['02:14:05', 'err', 'TRN-0412 loss of light'], ['02:14:07', 'err', '12 cells lost backhaul'], ['02:14:30', 'info', 'Traffic rerouted to ring A (partial)'], ['02:15:10', 'warn', '4 cells still unavailable'], ['02:15:42', 'info', 'Copilot grouped 46 alarms'], ['02:16:05', 'warn', 'Enterprise SLA at risk: 2 customers']].map(([t, k, s]) => `<div class="row" style="gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)"><span class="mono muted" style="font-size:11.5px;width:64px">${t}</span><span style="width:8px;height:8px;border-radius:50%;background:var(--${k})"></span><span>${s}</span></div>`).join('')}
      </div>
    </div>
    <div class="card" style="width:340px;flex:none;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,var(--vio-c),var(--surf) 40%)">
      <div class="row" style="align-items:center;gap:8px"><span class="ms f" style="color:var(--vio)">auto_awesome</span><div style="font-weight:600">Triage copilot</div><span class="chip out" style="margin-left:auto;height:22px">Suggestion</span></div>
      <div class="card" style="padding:12px"><div class="muted" style="font-size:11.5px;margin-bottom:4px">Likely root cause</div><div style="font-weight:600;font-size:14px">Fibre cut between Guindy and Adyar</div><div class="row" style="align-items:center;gap:8px;margin-top:8px"><div class="bar" style="flex:1"><b style="width:87%;background:var(--vio)"></b></div><span style="font-weight:600">87%</span></div></div>
      <div><div class="lbl">Evidence</div>${['Loss of light on both ends at 02:14:05', '46 alarms share one physical path', 'Same pattern as INC-8812 (resolved)'].map((e) => `<div class="row" style="gap:8px;padding:4px 0"><span class="ms" style="color:var(--ok);font-size:18px">check</span><span>${e}</span></div>`).join('')}</div>
      <div><div class="lbl">Suggested next steps</div>${[['Reroute remaining traffic to ring A', 'Needs approval'], ['Dispatch field crew to splice point', 'Needs approval'], ['Group 46 alarms under one incident', 'Safe · automatic']].map(([t, s], n) => `<div class="row" style="gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line)"><span class="chip ${n === 2 ? 'vio' : 'warn'}" style="height:22px;padding:0 8px">${n + 1}</span><div style="flex:1"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:11.5px">${s}</div></div></div>`).join('')}</div>
      <div class="row" style="gap:8px;margin-top:auto"><div class="btn f" style="flex:1">${ic('check')}Approve steps 1–2</div><div class="btn o">Edit</div></div>
      <div class="row muted" style="gap:10px;font-size:11.5px;align-items:center">Was this helpful? <span class="ms">thumb_up</span><span class="ms">thumb_down</span><span style="margin-left:auto;color:var(--p)">Why this?</span></div>
    </div></div>`;
}
const pt_cover = page(bg.violet, win({ x: 90, y: 60, w: 1420, h: 880, url: 'noc.example.net/alarms/TRN-0412' }, shell({
  brand: 'NOC Console', brandIcon: 'radar', crumb: 'Assurance', title: 'Alarm triage',
  nav: [{ i: 'notifications_active', t: 'Alarms', on: true, n: '47' }, { i: 'report', t: 'Incidents' }, { i: 'hub', t: 'Topology' }, { i: 'monitoring', t: 'KPIs' }, { sec: 'Team' }, { i: 'groups', t: 'On-call' }],
  body: triageBody(),
}).replace('<div class="search">', '<div class="search" style="width:220px">')));

// Figma-style prototype canvas
const frame = (x, y, w, h, title, inner, sel = false) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px">
  <div style="color:#b3b3b3;font-size:11.5px;margin-bottom:6px">${title}</div>
  <div style="height:${h}px;border-radius:6px;overflow:hidden;background:#fff;color:#1f1f1f;${sel ? 'outline:2px solid #0d99ff;outline-offset:2px' : ''}">${inner}</div></div>`;
const miniScreen = (title, rows, accent = '#1a73e8', extra = '') => `<div style="padding:12px;font-size:9px;display:flex;flex-direction:column;gap:6px;height:100%">
  <div style="display:flex;align-items:center;gap:6px"><div style="width:14px;height:14px;border-radius:4px;background:${accent}"></div><b style="font-size:10px">${title}</b></div>
  ${rows.map((r) => `<div style="display:flex;gap:6px;align-items:center;padding:5px;border:1px solid #eee;border-radius:5px"><span style="width:6px;height:6px;border-radius:50%;background:${r[1]}"></span>${r[0]}</div>`).join('')}${extra}</div>`;
const arrow = (d) => `<path d="${d}" stroke="#0d99ff" stroke-width="2" fill="none" marker-end="url(#ah)"/>`;
const pt_proto = page('#2c2c2c', `
  <div style="position:absolute;top:0;left:0;right:0;height:48px;background:#1e1e1e;border-bottom:1px solid #383838;display:flex;align-items:center;gap:14px;padding:0 18px;color:#e5e5e5;font-size:13px">
    <span class="ms" style="color:#a259ff">widgets</span><b>Alarm triage — prototype</b><span style="color:#8c8c8c">/ Flow: triage to approval</span>
    <div style="margin-left:auto;display:flex;gap:8px"><span style="padding:6px 12px;border-radius:6px;background:#383838">Design</span><span style="padding:6px 12px;border-radius:6px;background:#0d99ff;color:#fff">Prototype</span><span style="padding:6px 12px;border-radius:6px;background:#383838">${ic('play_arrow')}</span></div></div>
  <div style="position:absolute;top:48px;right:0;bottom:0;width:290px;background:#1e1e1e;border-left:1px solid #383838;color:#e5e5e5;padding:18px;font-size:12.5px;display:flex;flex-direction:column;gap:14px">
    <b>Interaction</b>
    ${[['Trigger', 'On click'], ['Action', 'Navigate to'], ['Destination', '03 · Approve steps'], ['Animation', 'Smart animate'], ['Easing', 'Ease out · 300 ms']].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 10px;border-radius:6px;background:#2c2c2c"><span style="color:#8c8c8c">${k}</span><span>${v}</span></div>`).join('')}
    <b style="margin-top:10px">Flow starting point</b><div style="padding:8px 10px;border-radius:6px;background:#2c2c2c">01 · Alarm list</div>
    <b style="margin-top:10px">Test notes</b><div style="color:#b3b3b3;line-height:1.6">5 NOC engineers · task: find root cause and act. Watch for: trust in suggestion, time to approve.</div></div>
  <div class="dotbg" style="position:absolute;top:48px;left:0;right:290px;bottom:0;--line:#3d3d3d">
    <svg style="position:absolute;inset:0;width:100%;height:100%"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#0d99ff"/></marker></defs>
      ${arrow('M300 250 H414')}${arrow('M690 300 H814')}${arrow('M955 482 C955 600 760 650 646 650')}</svg>
    ${frame(60, 90, 240, 300, '01 · Alarm list', miniScreen('Active alarms', [['Link down · TRN-0412', '#c5221f'], ['Loss of signal · 0158', '#c5221f'], ['High BER · 0409', '#a85f00'], ['Cell unavailable · 0163', '#a85f00'], ['Cell unavailable · 0171', '#a85f00']], '#c5221f', '<div style="margin-top:auto;padding:6px;border-radius:5px;background:#e8f0fe;color:#174ea6">46 alarms look related →</div>'))}
    <div style="position:absolute;left:120px;top:142px;width:170px;height:28px;border:2px solid #0d99ff;border-radius:5px;background:rgba(13,153,255,.12)"></div>
    ${frame(420, 90, 270, 330, '02 · Root cause', miniScreen('Triage copilot', [['Fibre cut Guindy–Adyar · 87%', '#7b3fe4'], ['Loss of light both ends', '#188038'], ['46 alarms share one path', '#188038'], ['Matches INC-8812', '#188038']], '#7b3fe4', '<div style="margin-top:auto;padding:8px;border-radius:14px;background:#1a73e8;color:#fff;text-align:center">Review next steps</div>'), true)}
    ${frame(820, 160, 270, 300, '03 · Approve steps', miniScreen('Next steps', [['Reroute to ring A · needs approval', '#a85f00'], ['Dispatch field crew · needs approval', '#a85f00'], ['Group alarms · automatic', '#7b3fe4']], '#188038', '<div style="margin-top:auto;display:flex;gap:6px"><div style="flex:1;padding:8px;border-radius:14px;background:#1a73e8;color:#fff;text-align:center">Approve 1–2</div><div style="padding:8px 10px;border-radius:14px;border:1px solid #ddd">Edit</div></div>'))}
    ${frame(380, 560, 260, 170, '04 · Done', miniScreen('Incident INC-9031 created', [['Traffic rerouted', '#188038'], ['Crew B dispatched · ETA 40 min', '#1a73e8']], '#188038'))}
  </div>`);

/* ---------- B. Offline site survey (mobile prototype) ---------- */

const surveyNav = (on) => `<div class="pnav">${[['assignment', 'Jobs'], ['photo_camera', 'Capture'], ['sync', 'Sync'], ['person', 'Me']].map(([i, t]) => `<div class="${t === on ? 'on' : ''}">${ic(i, t === on ? 'f' : '')}${t}</div>`).join('')}</div>`;
const offline = `<div class="row" style="align-items:center;gap:8px;margin:0 14px;padding:8px 12px;border-radius:12px;background:var(--warn-c);color:var(--warn);font-size:12px;font-weight:500">${ic('cloud_off')}Offline · changes saved on this phone</div>`;
const surveyJobs = () => `<div class="ptop"><div><div class="muted" style="font-size:12px">Today · 4 sites</div><h2>Site surveys</h2></div></div>${offline}
  <div class="pbody" style="padding-top:10px">${[['CHN-N-0201', 'Velachery', 'In progress', 'info', 60], ['CHN-N-0205', 'Avadi', 'Not started', '', 0], ['CHN-N-0190', 'Porur', 'Done · waiting to sync', 'ok', 100], ['TRN-0388', 'Tambaram', 'Not started', '', 0]]
    .map(([id, s, st, k, p]) => `<div class="card" style="padding:12px 14px;border-radius:18px"><div class="row" style="align-items:center"><div style="font-weight:600">${id}</div><span class="muted" style="margin-left:6px">· ${s}</span></div><div class="row" style="align-items:center;gap:8px;margin-top:8px">${chip(st, k)}<div class="bar" style="flex:1"><b style="width:${p}%;background:var(--${k || 'line'})"></b></div></div></div>`).join('')}</div>${surveyNav('Jobs')}`;
const surveyChecklist = () => `<div class="ptop">${ic('arrow_back')}<div><div class="muted" style="font-size:12px">CHN-N-0201 · Velachery</div><h2 style="font-size:18px">Cabinet & power</h2></div></div>
  <div class="pbody">
    <div class="bar" style="height:6px"><b style="width:60%"></b></div><div class="muted" style="font-size:12px">6 of 10 checks</div>
    ${[['Cabinet door seal intact', 1], ['Battery voltage ≥ 48 V', 1], ['Earthing cable secured', 0]].map(([t, d]) => `<div class="card" style="padding:12px 14px;border-radius:16px;display:flex;align-items:center;gap:10px"><span class="ms f" style="color:var(--${d ? 'ok' : 'tx3'})">${d ? 'check_circle' : 'radio_button_unchecked'}</span><span style="flex:1">${t}</span>${d ? '' : `<span class="chip warn" style="height:22px">Photo</span>`}</div>`).join('')}
    <div class="lbl" style="margin-top:4px">Photos (3)</div>
    <div class="row" style="gap:8px">${['#c9d6df', '#d8cfc4', '#cdd9c5'].map((c) => `<div style="flex:1;height:78px;border-radius:12px;background:${c};display:grid;place-items:end start;padding:6px"><span class="chip" style="height:20px;font-size:10px;background:rgba(255,255,255,.85);color:#333">GPS ✓</span></div>`).join('')}<div style="flex:1;height:78px;border-radius:12px;border:1.5px dashed var(--line);display:grid;place-items:center;color:var(--tx3)">${ic('add_a_photo')}</div></div>
    <div class="btn f" style="height:46px;border-radius:23px;margin-top:auto;margin-bottom:10px">Next section</div>
  </div>`;
const surveySync = () => `<div class="ptop"><h2>Sync</h2></div>
  <div class="pbody" style="gap:12px">
    <div class="card" style="border-radius:20px;text-align:center;padding:22px"><div style="width:64px;height:64px;margin:0 auto 10px;border-radius:50%;background:var(--ok-c);display:grid;place-items:center;color:var(--ok)">${ic('cloud_done', 'f')}</div><div style="font-weight:600;font-size:16px">Back online</div><div class="muted" style="margin-top:4px">23 items uploaded · 0 conflicts</div></div>
    ${[['Checklists', '12'], ['Photos', '9'], ['Notes', '2']].map(([t, n]) => `<div class="row" style="align-items:center;padding:10px 4px;border-bottom:1px solid var(--line)"><span style="flex:1">${t}</span><span class="chip ok">${n} synced</span></div>`).join('')}
    <div class="muted" style="font-size:12px;line-height:1.5">Photos are compressed on the phone and uploaded in the background when signal is good.</div>
  </div>${surveyNav('Sync')}`;
const ss_cover = page(bg.mint, `${phone({ x: 190, y: 160 }, surveyJobs())}${phone({ x: 630, y: 110, z: 2 }, surveyChecklist())}${phone({ x: 1070, y: 160 }, surveySync())}`);
const ss_dark = page(bg.night, `${phone({ x: 430, y: 140, dark: true }, surveyJobs())}${phone({ x: 850, y: 140, dark: true }, surveyChecklist())}
  <div class="float dark" style="left:1230px;top:300px;width:300px;background:#2a2b2e;z-index:3"><div style="font-weight:600;margin-bottom:8px">Design decisions</div>${['Offline first: every action saves locally', 'Big touch targets for gloved hands', 'Photos tagged with GPS and time automatically', 'Dark mode for night shifts'].map((t) => `<div class="row" style="gap:8px;padding:5px 0;font-size:12.5px"><span class="ms" style="color:var(--ok);font-size:18px">check</span>${t}</div>`).join('')}</div>`);

/* ---------- C. Change approval UX flow (FigJam-style) ---------- */

const node = (x, y, w, text, kind = 'box', color = '#e8f0fe', border = '#1a73e8') => kind === 'diamond'
  ? `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w}px;display:grid;place-items:center"><div style="position:absolute;inset:14%;transform:rotate(45deg);background:${color};border:2px solid ${border};border-radius:8px"></div><span style="position:relative;font-size:11.5px;font-weight:600;text-align:center;width:80%">${text}</span></div>`
  : `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;padding:12px 10px;border-radius:${kind === 'pill' ? '24px' : '10px'};background:${color};border:2px solid ${border};font-size:12px;font-weight:600;text-align:center">${text}</div>`;
const sticky = (x, y, text, color = '#fff2a8', rot = -2) => `<div style="position:absolute;left:${x}px;top:${y}px;width:170px;padding:12px;background:${color};box-shadow:0 8px 16px -8px rgba(0,0,0,.3);transform:rotate(${rot}deg);font-size:12px;line-height:1.45;color:#3c3c3c">${text}</div>`;
function approvalBoard() {
  const lanes = ['Requester', 'Approver', 'Automation', 'Field engineer'];
  const L = (d) => `<path d="${d}" stroke="#5f6368" stroke-width="1.8" fill="none" marker-end="url(#a2)"/>`;
  return `<div style="position:absolute;inset:0;background:#f4f4f2" class="dotbg">
    <div style="position:absolute;top:22px;left:30px;font-size:22px;font-weight:600;color:#1f1f1f">Network change approval — future-state flow</div>
    <div style="position:absolute;top:56px;left:30px;color:#5f6368">Swimlanes by role · decisions in diamonds · sticky notes from interviews</div>
    ${lanes.map((l, i) => `<div style="position:absolute;left:30px;right:30px;top:${100 + i * 210}px;height:200px;border-radius:14px;background:${['#ffffffcc', '#f8f6ffcc', '#f3f8ffcc', '#f2fbf5cc'][i]};border:1px solid #e3e3e3"><div style="position:absolute;left:0;top:0;bottom:0;width:120px;border-right:1px solid #e3e3e3;display:grid;place-items:center;font-weight:600;color:#3c4043;writing-mode:vertical-rl;transform:rotate(180deg)">${l}</div></div>`).join('')}
    <svg style="position:absolute;inset:0;width:100%;height:100%"><defs><marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#5f6368"/></marker></defs>
      ${L('M330 200 H410 V592')}${L('M490 620 H572')}${L('M720 620 H796')}${L('M640 540 V410 H796')}${L('M940 410 H976')}${L('M1126 410 H1250 V592')}${L('M940 620 H1176')}${L('M1250 644 V802')}${L('M1180 830 H1124')}</svg>
    <div style="position:absolute;left:735px;top:596px;font-size:12px;font-weight:600;color:#188038">Yes</div>
    <div style="position:absolute;left:648px;top:470px;font-size:12px;font-weight:600;color:#c5221f">No</div>
    ${node(170, 178, 160, 'Raise change request', 'pill', '#fff', '#1f1f1f')}
    ${node(330, 598, 160, 'Auto risk score + impact')}
    ${node(560, 540, 160, 'Risk low?', 'diamond', '#fef3d6', '#a85f00')}
    ${node(800, 598, 140, 'Auto-approve', 'box', '#e6f4ea', '#188038')}
    ${node(800, 388, 140, 'Review plan', 'box', '#f1e8fd', '#7b3fe4')}
    ${node(980, 388, 146, 'Approve or ask changes', 'box', '#f1e8fd', '#7b3fe4')}
    ${node(1180, 598, 140, 'Schedule window', 'box', '#e8f0fe', '#1a73e8')}
    ${node(1180, 808, 140, 'Execute on site', 'box', '#e6f4ea', '#188038')}
    ${node(970, 808, 150, 'Verify & close', 'pill', '#fff', '#1f1f1f')}
    ${sticky(170, 360, 'Pain point: approvals live in email threads — 2 days average wait.', '#ffd6d6', -3)}
    ${sticky(1420, 150, 'Idea: approve from mobile with the risk summary up front.', '#fff2a8', 2)}
    ${sticky(420, 790, 'Field: “I only find out it’s approved when I arrive on site.”', '#d7f5df', -1)}
    ${sticky(1420, 380, 'Open question: who can override an auto-approval?', '#e3dcff', 3)}
  </div>`;
}
const fl_cover = page('#f4f4f2', approvalBoard());

function journeyMap() {
  const stages = ['Request', 'Review', 'Schedule', 'Execute', 'Verify'];
  const rows = [
    ['Actions', ['Fills change form', 'Checks plan & risk', 'Books window', 'Runs MOP on site', 'Compares KPIs']],
    ['Thinking', ['“Which template?”', '“Is this safe tonight?”', '“Any conflicts?”', '“Am I cleared?”', '“Did it work?”']],
    ['Pain points', ['Form has 40 fields', 'Risk unclear', 'Clashes found late', 'Approval not visible', 'Manual KPI check']],
    ['Opportunities', ['Templates prefill 80%', 'Risk score up front', 'Conflict check on save', 'Approval on mobile', 'Auto KPI compare']],
  ];
  const color = { Actions: '#e8f0fe', Thinking: '#f1e8fd', 'Pain points': '#fce8e6', Opportunities: '#e6f4ea' };
  const mood = [62, 40, 48, 26, 70];
  return `<div style="position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);background:#fff;border-radius:20px;box-shadow:0 40px 80px -30px rgba(15,23,42,.35);padding:30px;color:#1f1f1f">
    <div style="font-size:20px;font-weight:600">Journey map — field engineer, planned change</div><div style="color:#5f6368;margin:4px 0 20px">From 6 interviews and 2 night-shift observations</div>
    <div style="display:grid;grid-template-columns:140px repeat(5,1fr);gap:8px">
      <div></div>${stages.map((s, i) => `<div style="padding:10px;border-radius:10px;background:#202124;color:#fff;font-weight:600;text-align:center">${i + 1}. ${s}</div>`).join('')}
      ${rows.map(([r, cells]) => `<div style="padding:12px 4px;font-weight:600;color:#3c4043">${r}</div>${cells.map((c) => `<div style="padding:12px;border-radius:10px;background:${color[r]};font-size:12.5px;line-height:1.45">${c}</div>`).join('')}`).join('')}
      <div style="padding:12px 4px;font-weight:600;color:#3c4043">Feeling</div>
      <div style="grid-column:span 5;height:110px;position:relative;border-radius:10px;background:#f8f9fa">
        <svg viewBox="0 0 1000 110" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><polyline fill="none" stroke="#1a73e8" stroke-width="3" points="${mood.map((m, i) => `${100 + i * 200},${110 - m}`).join(' ')}"/>${mood.map((m, i) => `<circle cx="${100 + i * 200}" cy="${110 - m}" r="6" fill="#1a73e8"/>`).join('')}</svg>
      </div>
    </div></div>`;
}
const fl_journey = page(bg.blue, journeyMap());

/* ---------- D. Low-code onboarding flow ---------- */

const obScreen = (step, title, body) => `<div style="height:100%;display:flex;flex-direction:column;padding:16px;gap:10px;font-size:11.5px">
  <div class="row" style="align-items:center;gap:6px"><div class="logo" style="width:20px;height:20px;border-radius:6px"><span class="ms f" style="font-size:12px">account_tree</span></div><b>Integration Studio</b><span class="muted" style="margin-left:auto">${step}</span></div>
  <div style="font-size:16px;font-weight:600;line-height:1.25;margin-top:6px">${title}</div>${body}</div>`;
const obFrame = (x, y, title, inner) => `<div style="position:absolute;left:${x}px;top:${y}px;width:300px"><div class="muted" style="font-size:12px;margin-bottom:8px;font-weight:500">${title}</div><div class="card" style="height:400px;padding:0;overflow:hidden;box-shadow:0 20px 40px -20px rgba(15,23,42,.35)">${inner}</div></div>`;
const onboarding = page(bg.violet, `
  <div style="position:absolute;top:50px;left:70px"><div style="font-size:24px;font-weight:600;color:#1f1f1f">First-run onboarding · low-code builder</div><div style="color:#5f6368;margin-top:4px">Goal: a first working flow in under 5 minutes, without reading docs</div></div>
  <svg style="position:absolute;inset:0;width:100%;height:100%">${[400, 760, 1120].map((x) => `<path d="M${x} 480 H${x + 46}" stroke="#7b3fe4" stroke-width="2.5" marker-end="url(#a3)"/>`).join('')}<defs><marker id="a3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#7b3fe4"/></marker></defs></svg>
  ${obFrame(90, 260, '1 · Welcome', obScreen('1 / 4', 'What do you want to automate first?', `${['Respond to alarms', 'Schedule maintenance', 'Sync inventory', 'Start from blank'].map((t, i) => `<div class="card" style="padding:10px;border-radius:10px;${i === 0 ? 'border:2px solid var(--p);background:var(--p-c)' : ''}">${t}</div>`).join('')}<div class="btn f s" style="margin-top:auto">Continue</div>`))}
  ${obFrame(450, 260, '2 · Pick a template', obScreen('2 / 4', 'Start from a proven template', `${[['Auto-remediate link degradation', 'Most used'], ['Notify on critical alarms', ''], ['Escalate unacknowledged alarms', '']].map(([t, b]) => `<div class="card" style="padding:10px;border-radius:10px"><div style="font-weight:600">${t}</div>${b ? `<span class="chip vio" style="height:18px;font-size:10px;margin-top:6px">${b}</span>` : ''}</div>`).join('')}<div class="muted">You can change every step later.</div><div class="btn f s" style="margin-top:auto">Use template</div>`))}
  ${obFrame(810, 260, '3 · Connect a source', obScreen('3 / 4', 'Connect where alarms come from', `<div class="card" style="padding:10px;border-radius:10px;display:flex;gap:8px;align-items:center">${ic('dns')}<span style="flex:1">Assurance system</span>${chip('Connected', 'ok')}</div><div class="card" style="padding:10px;border-radius:10px;display:flex;gap:8px;align-items:center">${ic('inventory_2')}<span style="flex:1">Inventory</span>${chip('Test…', 'info')}</div><div class="muted">We only read data until you publish.</div><div class="btn f s" style="margin-top:auto">Test connection</div>`))}
  ${obFrame(1170, 260, '4 · First run', obScreen('4 / 4', 'Your first flow ran safely', `<div style="text-align:center;padding:12px 0"><div style="width:56px;height:56px;margin:0 auto;border-radius:50%;background:var(--ok-c);color:var(--ok);display:grid;place-items:center">${ic('check_circle', 'f')}</div></div><div class="card" style="padding:10px;border-radius:10px">Test run on sample alarm · 6 steps · 0 errors</div><div class="card" style="padding:10px;border-radius:10px">AI step stayed <b>In review</b> — nothing changed on the network</div><div class="btn f s" style="margin-top:auto">Open flow</div>`))}
`);

const emptyState = (icon, title, text, cta, k) => `<div class="card" style="flex:1;text-align:center;padding:36px 26px;border-radius:24px"><div style="width:96px;height:96px;margin:0 auto 18px;border-radius:28px;background:var(--${k}-c);color:var(--${k});display:grid;place-items:center;transform:rotate(-6deg)"><span class="ms" style="font-size:44px">${icon}</span></div><div style="font-size:17px;font-weight:600;margin-bottom:6px">${title}</div><div class="tx2" style="line-height:1.55;margin-bottom:18px">${text}</div><div class="btn t">${cta}</div></div>`;
const ob_empty = page(bg.blue, `<div style="position:absolute;top:60px;left:90px"><div style="font-size:24px;font-weight:600;color:#1f1f1f">Empty states</div><div style="color:#5f6368;margin-top:4px">Every empty screen explains what goes here and offers the next step</div></div>
  <div style="position:absolute;left:90px;right:90px;top:190px;display:flex;gap:28px;color:var(--tx)">${emptyState('account_tree', 'No flows yet', 'Flows connect your tools so routine work runs on its own.', 'Start from a template', 'vio')}${emptyState('history', 'No runs to show', 'Runs appear here after you test or publish a flow.', 'Test a flow', 'info')}${emptyState('fact_check', 'Nothing waiting for you', 'When an AI step needs a person, it shows up here.', 'Review approval rules', 'ok')}</div>
  <div class="dark" style="position:absolute;left:90px;right:90px;top:620px;display:flex;gap:28px;color:var(--tx)">${emptyState('account_tree', 'No flows yet', 'Same pattern in the dark theme.', 'Start from a template', 'vio')}${emptyState('history', 'No runs to show', 'Tokens keep both themes in sync.', 'Test a flow', 'info')}${emptyState('fact_check', 'Nothing waiting for you', 'Icons and copy stay identical.', 'Review approval rules', 'ok')}</div>`);

/* ---------- E. Design system documentation site ---------- */

function docsSite(dark = false) {
  return `<div style="display:flex;flex-direction:column;flex:1;min-height:0;background:var(--bg)">
    <div style="height:58px;flex:none;display:flex;align-items:center;gap:22px;padding:0 24px;background:var(--surf);border-bottom:1px solid var(--line)">
      <div class="brand" style="padding:0"><div class="logo">${ic('palette', 'f')}</div>Ops Design System</div>
      ${['Get started', 'Foundations', 'Components', 'Patterns', 'Resources'].map((t) => `<span style="font-weight:500;color:${t === 'Components' ? 'var(--p)' : 'var(--tx2)'}">${t}</span>`).join('')}
      <div class="search" style="width:240px">${ic('search')}Search  <span class="chip out" style="height:20px;margin-left:auto">⌘K</span></div><span class="ms" style="color:var(--tx2)">${dark ? 'light_mode' : 'dark_mode'}</span></div>
    <div class="app">
      <aside class="side" style="width:220px">${['Overview', 'Button', 'Chip', 'Data table', 'Dialog', 'Input', 'Status', 'Tabs', 'Toast'].map((t) => `<div class="nav ${t === 'Chip' ? 'on' : ''}" style="height:32px">${t}</div>`).join('')}</aside>
      <div class="body" style="padding:26px 34px;gap:18px">
        <div><div class="crumb">Components</div><div style="font-size:30px;font-weight:600;letter-spacing:-.02em">Chip</div><div class="tx2" style="margin-top:6px;max-width:620px;line-height:1.55">Chips show a short status or let people filter. Use status chips for action states such as Automated, In review and Approved.</div></div>
        <div class="row" style="gap:8px">${chip('Design', 'sel', false)}${chip('Code', 'out', false)}${chip('Accessibility', 'out', false)}</div>
        <div class="card dotbg" style="height:170px;display:flex;align-items:center;justify-content:center;gap:12px;background-color:var(--bg)">${chip('Automated', 'vio')}${chip('In review', 'warn')}${chip('Approved', 'ok')}${chip('Running', 'info')}${chip('Failed', 'err')}</div>
        <div class="row" style="flex:1;min-height:0">
          <div class="card mono" style="flex:1.2;background:#14161a;color:#c9d1d9;border-color:#14161a;font-size:12px;line-height:1.8">
            <div style="color:#8b949e">&lt;!-- Angular --&gt;</div>
            <div><span style="color:#7ee787">&lt;ds-status-chip</span> <span style="color:#79c0ff">state</span>=<span style="color:#a5d6ff">"in-review"</span> <span style="color:#7ee787">/&gt;</span></div>
            <div style="color:#8b949e;margin-top:8px">/* tokens */</div>
            <div><span style="color:#d2a8ff">--status-warning</span>: #a85f00;</div><div><span style="color:#d2a8ff">--status-warning-container</span>: #fef3d6;</div>
            <div style="color:#8b949e;margin-top:8px">// usage in a table cell</div>
            <div><span style="color:#ff7b72">@for</span> (row <span style="color:#ff7b72">of</span> rows; track row.id) {</div>
            <div>&nbsp;&nbsp;<span style="color:#7ee787">&lt;td&gt;&lt;ds-status-chip</span> [<span style="color:#79c0ff">state</span>]=<span style="color:#a5d6ff">"row.state"</span> <span style="color:#7ee787">/&gt;&lt;/td&gt;</span></div>
            <div>}</div>
            <div style="color:#8b949e;margin-top:8px">// accessibility: colour is never the only signal —</div>
            <div style="color:#8b949e">// every chip has a dot and a text label</div></div>
          <div class="card" style="flex:1"><div class="ch"><h3>Props</h3></div><table><tr><th>Name</th><th>Type</th><th>Default</th></tr>${[['state', 'ActionState', '—'], ['size', "'sm' | 'md'", "'md'"], ['icon', 'boolean', 'true'], ['label', 'string', 'from state'], ['tooltip', 'string', '—']].map(([a, b, c]) => `<tr><td class="mono">${a}</td><td class="mono muted">${b}</td><td class="mono muted">${c}</td></tr>`).join('')}</table></div>
        </div>
      </div></div></div>`;
}
const dd_cover = page(bg.blue, win({ x: 120, y: 60, w: 1360, h: 880, url: 'design.example.dev/components/chip' }, docsSite()));
const ddMobile = () => `<div class="ptop"><div class="logo">${ic('palette', 'f')}</div><span class="ms" style="margin-left:auto">menu</span></div>
  <div class="pbody" style="gap:14px"><div style="font-size:26px;font-weight:600;line-height:1.15;letter-spacing:-.02em">Build consistent operations UIs</div><div class="tx2" style="line-height:1.55">Tokens, components and patterns shared by five apps.</div><div class="btn f" style="height:44px;border-radius:22px">Get started</div>
  ${[['palette', 'Foundations', 'Colour, type, spacing'], ['widgets', 'Components', '32 components'], ['route', 'Patterns', 'Human-in-the-loop, tables']].map(([i, t, s]) => `<div class="card" style="display:flex;gap:12px;align-items:center;border-radius:18px"><div class="pill-ic chip info" style="height:38px;padding:0">${ic(i)}</div><div><div style="font-weight:600">${t}</div><div class="muted" style="font-size:12px">${s}</div></div></div>`).join('')}</div>`;
const dd_responsive = page(bg.night, `${win({ x: 80, y: 90, w: 1080, h: 800, url: 'design.example.dev/components/chip', dark: true }, docsSite(true))}${phone({ x: 1180, y: 170, z: 3 }, ddMobile())}`);

/* ---------- F. This portfolio site (real screenshots) ---------- */

const shot = (name, style = '') => `<img src="${asset(name)}" style="display:block;width:100%;${style}">`;
const pf_cover = page(bg.blue, `
  ${win({ x: 70, y: 60, w: 1100, h: 700, url: 'rajesh-kumar portfolio · dark', dark: true }, `<div style="flex:1;overflow:hidden">${shot('site-home-dark')}</div>`)}
  ${win({ x: 380, y: 240, w: 1100, h: 700, url: 'rajesh-kumar portfolio', z: 2 }, `<div style="flex:1;overflow:hidden">${shot('site-home-light')}</div>`)}
  ${phone({ x: 1250, y: 300, z: 3, scale: 0.88 }, `<div style="flex:1;overflow:hidden;margin-top:-40px">${shot('site-home-mobile')}</div>`).replace('transform:', 'transform-origin:top left;transform:')}
`);
const pf_pages = page(bg.violet, `
  ${win({ x: 60, y: 80, w: 720, h: 470, url: 'portfolio' }, `<div style="flex:1;overflow:hidden">${shot('site-portfolio-light')}</div>`)}
  ${win({ x: 820, y: 80, w: 720, h: 470, url: 'case study · dark', dark: true }, `<div style="flex:1;overflow:hidden">${shot('site-case-dark')}</div>`)}
  ${win({ x: 440, y: 500, w: 720, h: 470, url: 'contact', z: 3 }, `<div style="flex:1;overflow:hidden">${shot('site-contact-light')}</div>`)}
`);

/* ---------- G. Web template gallery mini sites (2006–2007) ---------- */

const web2 = (name, c1, c2, tagline, badge) => `<div style="height:100%;font-family:Verdana,Tahoma,sans-serif;font-size:9px;color:#333;background:#fff;display:flex;flex-direction:column">
  <div style="height:44px;background:linear-gradient(${c1},${c2});display:flex;align-items:center;padding:0 10px;color:#fff;position:relative;overflow:hidden"><div style="position:absolute;inset:0 0 50% 0;background:rgba(255,255,255,.25)"></div><b style="font-family:Georgia,serif;font-size:14px;position:relative;text-shadow:0 1px 0 rgba(0,0,0,.3)">${name}</b><div style="margin-left:auto;display:flex;gap:3px;position:relative">${['Home', 'About', 'Services', 'Contact'].map((t, i) => `<span style="padding:3px 6px;border-radius:6px 6px 0 0;background:${i === 0 ? '#fff' : 'rgba(255,255,255,.25)'};color:${i === 0 ? c2 : '#fff'}">${t}</span>`).join('')}</div></div>
  <div style="flex:1;padding:10px;display:flex;gap:8px;background:linear-gradient(#f7f9fc,#fff)"><div style="flex:1.4"><div style="font-family:Georgia,serif;font-size:13px;color:${c2};margin-bottom:4px">${tagline}</div><div style="line-height:1.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero.</div><div style="margin-top:8px;display:inline-block;padding:4px 10px;border-radius:12px;background:linear-gradient(#ffb347,#ff7e00);color:#fff;font-weight:bold;box-shadow:0 2px 0 #c55e00">Learn more »</div></div>
  <div style="flex:1;border-radius:6px;background:linear-gradient(135deg,${c1}55,${c2}33);position:relative">${badge ? `<div style="position:absolute;right:-6px;top:-6px;width:42px;height:42px;border-radius:50%;background:radial-gradient(#ffe259,#ffa751);display:grid;place-items:center;font-weight:bold;color:#b33;transform:rotate(12deg);box-shadow:0 2px 4px rgba(0,0,0,.25)">${badge}</div>` : ''}</div></div>
  <div style="height:16px;background:#e9edf2;border-top:1px solid #d5dbe3;color:#888;font-size:7.5px;display:flex;align-items:center;padding:0 8px">© 2007 ${name} · Valid XHTML 1.0</div></div>`;
const templates = [
  ['CloudNine Hosting', '#4aa3df', '#1f6fb2', 'Reliable hosting from $4.99', 'NEW!'],
  ['GreenLeaf Organics', '#8cc63f', '#3c8d0d', 'Fresh from the farm', ''],
  ['Pixel Studio', '#9b59b6', '#5b2c83', 'Creative web design', 'HOT'],
  ['TravelWorld', '#f39c12', '#c0392b', 'Discover Kerala', ''],
  ['EduSmart Academy', '#16a085', '#0e6655', 'Learn anywhere', '50%'],
  ['AutoCare Garage', '#7f8c8d', '#2c3e50', 'Service you can trust', ''],
];
const tg_cover = page(bg.warm, win({ x: 140, y: 60, w: 1320, h: 880, url: 'templates.example.com/gallery' }, `<div style="flex:1;min-height:0;background:#eef2f6;display:flex;flex-direction:column">
  <div style="height:70px;flex:none;background:linear-gradient(#3b4a5c,#232d38);display:flex;align-items:center;padding:0 26px;color:#fff;font-family:Georgia,serif;font-size:22px;gap:12px"><span style="color:#ffb347">★</span>Template Gallery<span style="font-family:Verdana;font-size:12px;opacity:.7;margin-left:12px">500+ website templates · Flash & XHTML</span>
    <div style="margin-left:auto;font-family:Verdana;font-size:12px;display:flex;gap:6px">${['All', 'Business', 'Hosting', 'Travel', 'Education'].map((t, i) => `<span style="padding:6px 12px;border-radius:14px;background:${i === 0 ? '#ffb347' : 'rgba(255,255,255,.12)'};color:${i === 0 ? '#3b2a00' : '#fff'}">${t}</span>`).join('')}</div></div>
  <div style="flex:1;padding:24px 26px;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:min-content;align-content:center;gap:22px">${templates.map(([n, a, b, t, badge], i) => `<div style="background:#fff;border:1px solid #d5dbe3;border-radius:8px;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,.08);display:flex;flex-direction:column;gap:8px"><div style="height:250px;border:1px solid #e3e7ec;overflow:hidden">${web2(n, a, b, t, badge)}</div><div style="display:flex;align-items:center;font-family:Verdana;font-size:11.5px"><b>#${1040 + i * 7} ${n}</b><span style="margin-left:auto;color:#3c8d0d;font-weight:bold">$${[39, 49, 59, 39, 45, 35][i]}</span></div></div>`).join('')}</div></div>`));
const tg_landing = page(bg.blue, win({ x: 200, y: 50, w: 1200, h: 900, url: 'cloudnine-hosting.example.com' }, `<div style="flex:1;min-height:0;overflow:hidden;font-family:Verdana,Tahoma,sans-serif;font-size:12px;color:#333;background:#fff">
  <div style="height:86px;background:linear-gradient(#4aa3df,#1f6fb2);position:relative;display:flex;align-items:center;padding:0 34px;color:#fff"><div style="position:absolute;inset:0 0 50% 0;background:rgba(255,255,255,.22)"></div>
    <b style="font-family:Georgia,serif;font-size:30px;position:relative;text-shadow:0 2px 0 rgba(0,0,0,.25)">☁ CloudNine Hosting</b>
    <div style="margin-left:auto;display:flex;gap:6px;position:relative;align-self:flex-end">${['Home', 'Plans', 'Features', 'Support', 'Contact'].map((x, i) => `<span style="padding:10px 18px;border-radius:10px 10px 0 0;font-size:13px;background:${i === 0 ? '#fff' : 'rgba(255,255,255,.22)'};color:${i === 0 ? '#1f6fb2' : '#fff'};font-weight:bold">${x}</span>`).join('')}</div></div>
  <div style="padding:36px 34px;display:flex;gap:30px;background:linear-gradient(#eaf4fb,#fff);position:relative">
    <div style="flex:1.2"><div style="font-family:Georgia,serif;font-size:34px;color:#1f6fb2;line-height:1.2">Reliable web hosting<br>from just <span style="color:#ff7e00">$4.99</span>/month</div>
      <div style="margin:14px 0 20px;line-height:1.7;font-size:13px">Unlimited bandwidth, 24/7 support and a free domain name. Get your website online in minutes!</div>
      <span style="display:inline-block;padding:12px 26px;border-radius:24px;background:linear-gradient(#ffb347,#ff7e00);color:#fff;font-weight:bold;font-size:15px;box-shadow:0 3px 0 #c55e00">Sign up now »</span>
      <span style="margin-left:14px;color:#1f6fb2;text-decoration:underline">Compare plans</span></div>
    <div style="flex:1;position:relative;height:220px"><div style="position:absolute;left:40px;top:20px;width:260px;height:180px;border-radius:14px;background:linear-gradient(135deg,#d6ecfa,#9cc9ec);box-shadow:0 10px 0 -4px #7fb3dc"></div>
      ${[0, 1, 2].map((i) => `<div style="position:absolute;left:80px;top:${50 + i * 46}px;width:180px;height:34px;border-radius:6px;background:linear-gradient(#fdfdfd,#cfd8e0);border:1px solid #9fb1c2;display:flex;align-items:center;gap:6px;padding:0 10px"><span style="width:8px;height:8px;border-radius:50%;background:#3c8d0d;box-shadow:0 0 4px #7fdc4a"></span><span style="flex:1;height:4px;background:#b8c4cf;border-radius:2px"></span></div>`).join('')}
      <div style="position:absolute;right:0;top:-10px;width:96px;height:96px;border-radius:50%;background:radial-gradient(#ffe259,#ffa751);display:grid;place-items:center;font-weight:bold;color:#b33;transform:rotate(12deg);box-shadow:0 4px 8px rgba(0,0,0,.25);text-align:center;font-size:15px">50%<br>OFF!</div></div></div>
  <div style="padding:10px 34px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    ${[['#4aa3df', '⚡', 'Lightning fast', 'Servers in 3 data centres with 99.9% uptime.'], ['#8cc63f', '✉', 'Free email', '100 email accounts with webmail and spam filter.'], ['#ff7e00', '☎', '24/7 support', 'Real people on phone, chat and email.']].map(([c, i, h, p]) => `<div style="border:1px solid #d5e3ee;border-radius:10px;padding:18px;background:linear-gradient(#fff,#f3f8fc);display:flex;gap:14px"><div style="width:48px;height:48px;flex:none;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,${c} 60%);display:grid;place-items:center;font-size:22px;color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2)">${i}</div><div><b style="color:#1f6fb2;font-size:14px">${h}</b><div style="margin-top:6px;line-height:1.6">${p}</div></div></div>`).join('')}</div>
  <div style="padding:0 34px 26px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    ${[['Starter', '$4.99', ['1 website', '10 GB space', 'Free domain'], false], ['Business', '$9.99', ['10 websites', '100 GB space', 'Free SSL'], true], ['Pro', '$19.99', ['Unlimited sites', 'Unlimited space', 'Priority support'], false]].map(([n, p, f, hot]) => `<div style="border:${hot ? '3px solid #ff7e00' : '1px solid #d5e3ee'};border-radius:10px;overflow:hidden;text-align:center;position:relative"><div style="padding:10px;background:linear-gradient(${hot ? '#ffb347,#ff7e00' : '#6fb7e6,#2f82c3'});color:#fff;font-weight:bold;font-size:15px">${n}${hot ? ' ★ Most popular' : ''}</div><div style="font-family:Georgia,serif;font-size:30px;color:#1f6fb2;margin:12px 0 4px">${p}<span style="font-size:13px;color:#888">/mo</span></div>${f.map((x) => `<div style="padding:5px;border-top:1px dotted #d5e3ee">✔ ${x}</div>`).join('')}</div>`).join('')}</div>
  <div style="background:#2c3e50;color:#aab7c4;padding:14px 34px;font-size:11px;display:flex">© 2007 CloudNine Hosting · Privacy · Terms<span style="margin-left:auto">Valid XHTML 1.0 · CSS</span></div>
</div>`));

export const concepts = {
  'pt-cover': pt_cover,
  'pt-proto': pt_proto,
  'ss-cover': ss_cover,
  'ss-dark': ss_dark,
  'fl-cover': fl_cover,
  'fl-journey': fl_journey,
  'ob-cover': onboarding,
  'ob-empty': ob_empty,
  'dd-cover': dd_cover,
  'dd-responsive': dd_responsive,
  'pf-cover': pf_cover,
  'pf-pages': pf_pages,
  'tg-cover': tg_cover,
  'tg-landing': tg_landing,
};
