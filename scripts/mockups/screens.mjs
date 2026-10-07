import { page, win, shell, phone, ic, chip, bg } from './kit.mjs';

const platformNav = (on) => [
  { i: 'dashboard', t: 'Overview' },
  { i: 'account_tree', t: 'Workflow Manager' },
  { i: 'calendar_month', t: 'Scheduler' },
  { i: 'rocket_launch', t: 'MOP Launcher' },
  { i: 'monitor_heart', t: 'MOP Monitor', n: '2' },
  { sec: 'Platform' },
  { i: 'shield', t: 'Security' },
  { i: 'speed', t: 'Performance' },
  { i: 'settings', t: 'Settings' },
].map((n) => (n.t === on ? { ...n, on: true } : n));

/* ---------- 1. Network Automation Platform — UI standardisation ---------- */

function workflowDashboard() {
  const rows = [
    ['5G RAN parameter rollout', 'RAN · Chennai North', chip('Running', 'info'), 68, 'A. Virtanen', '2 min ago'],
    ['Core firewall policy update', 'Core · Helsinki DC2', chip('Awaiting approval', 'warn'), 40, 'M. Laurent', '12 min ago'],
    ['Transport link migration', 'Transport · Sydney', chip('Completed', 'ok'), 100, 'J. Carter', '28 min ago'],
    ['Cell site software upgrade', 'RAN · Dallas West', chip('Running', 'info'), 22, 'R. Kumar', '41 min ago'],
    ['Backhaul QoS profile change', 'Transport · Lyon', chip('Failed · rolled back', 'err'), 55, 'C. Dubois', '1 h ago'],
    ['Licence capacity expansion', 'Core · Espoo', chip('Scheduled', ''), 0, 'S. Mäkinen', 'Tonight 01:00'],
    ['Alarm correlation rule update', 'Assurance · Sydney', chip('Automated', 'vio'), 84, 'Auto', '1 h ago'],
    ['VLAN provisioning batch', 'Transport · Austin', chip('Completed', 'ok'), 100, 'D. Moore', '2 h ago'],
  ];
  return `
  <div class="g" style="grid-template-columns:repeat(4,1fr)">
    ${[
      ['account_tree', 'Active workflows', '128', '<span class="up">▲ 12</span> vs last week'],
      ['pending_actions', 'Awaiting approval', '6', '2 due within 1 hour'],
      ['error', 'Failed today', '2', 'Both auto rolled back'],
      ['verified', 'Success rate (30d)', '98.4%', '<span class="up">▲ 0.6%</span>'],
    ].map(([i, l, v, d]) => `<div class="card kpi"><div class="l">${ic(i)}${l}</div><div class="v">${v}</div><div class="d">${d}</div></div>`).join('')}
  </div>
  <div class="row" style="flex:1;min-height:0">
    <div class="card" style="flex:1;min-width:0">
      <div class="ch"><h3>Workflows</h3><span class="sub">Last 24 hours</span>
        <div class="r row" style="gap:8px">${chip('All domains', 'sel', false)}${chip('RAN', 'out', false)}${chip('Core', 'out', false)}${chip('Transport', 'out', false)}</div></div>
      <table><tr><th>Workflow</th><th>Status</th><th>Progress</th><th>Updated</th></tr>
      ${rows.map(([n, s, c, p, o, u]) => `<tr><td><div style="font-weight:500">${n}</div><div class="t2">${s}</div></td><td>${c}</td><td><div class="bar"><b style="width:${p}%"></b></div></td><td class="muted">${u}</td></tr>`).join('')}
      </table>
    </div>
    <div class="card" style="width:300px;flex:none">
      <div class="ch"><h3>Needs your action</h3><span class="r chip err" style="height:20px">3</span></div>
      ${[
        ['warn', 'gavel', 'Approve firewall policy', 'Core · Helsinki DC2'],
        ['err', 'replay', 'Review rollback report', 'Transport · Lyon'],
        ['info', 'smart_toy', 'AI suggests retry window', 'RAN · Dallas West'],
      ].map(([k, i, t, s]) => `<div class="row" style="gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)"><div class="pill-ic chip ${k}" style="height:34px;padding:0">${ic(i)}</div><div style="min-width:0"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:11.5px">${s}</div></div></div>`).join('')}
      <div class="btn t s" style="margin-top:14px;width:100%">View all</div>
    </div>
  </div>`;
}

const wfShell = () => shell({
  brand: 'Network Automation', nav: platformNav('Workflow Manager'), crumb: 'Operations', title: 'Workflow Manager',
  actions: `<div class="btn f s" style="margin-left:18px">${ic('add')}New workflow</div>`, body: workflowDashboard(),
});

const ds_cover = page(bg.blue, `
  ${win({ x: 70, y: 60, w: 1180, h: 760, url: 'automation.example.net/workflows', dark: true }, wfShell())}
  ${win({ x: 350, y: 200, w: 1180, h: 760, url: 'automation.example.net/workflows', z: 2 }, wfShell())}
`);

function tokensPage() {
  const sw = (name, l, d) => `<div style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;height:56px;border-radius:12px;overflow:hidden;border:1px solid var(--line)"><div style="flex:1;background:${l}"></div><div style="flex:1;background:${d}"></div></div><div style="font-weight:500;font-size:12px">${name}</div><div class="muted mono" style="font-size:10.5px">${l} · ${d}</div></div>`;
  return shell({
    brand: 'Design System', brandIcon: 'palette', crumb: 'Foundations', title: 'Design tokens',
    nav: [{ i: 'home', t: 'Overview' }, { sec: 'Foundations' }, { i: 'palette', t: 'Color', on: true }, { i: 'text_fields', t: 'Typography' }, { i: 'space_bar', t: 'Spacing' }, { i: 'rounded_corner', t: 'Shape' }, { i: 'contrast', t: 'Themes' }, { sec: 'Components' }, { i: 'smart_button', t: 'Buttons' }, { i: 'label', t: 'Chips & status' }, { i: 'table', t: 'Data table' }, { i: 'web_asset', t: 'Dialogs' }],
    actions: `<div class="row" style="gap:8px;margin-left:18px">${chip('Light', 'sel', false)}${chip('Dark', 'out', false)}</div>`,
    body: `
    <div class="card"><div class="ch"><h3>Color roles</h3><span class="sub">Each token resolves to a light and a dark value</span></div>
      <div class="g" style="grid-template-columns:repeat(6,1fr)">
        ${sw('color.primary', '#1a73e8', '#8ab4f8')}${sw('color.on-primary', '#ffffff', '#0b1b33')}${sw('color.surface', '#ffffff', '#1e1f20')}${sw('color.surface-variant', '#f1f3f4', '#2a2b2e')}${sw('color.on-surface', '#1f1f1f', '#e8eaed')}${sw('color.outline', '#e3e6ea', '#3a3c40')}
      </div></div>
    <div class="card"><div class="ch"><h3>Status</h3><span class="sub">Shared across all five operations apps</span></div>
      <div class="g" style="grid-template-columns:repeat(6,1fr)">
        ${sw('status.success', '#188038', '#81c995')}${sw('status.warning', '#a85f00', '#fdd663')}${sw('status.error', '#c5221f', '#f28b82')}${sw('status.info', '#1967d2', '#8ab4f8')}${sw('status.automated', '#7b3fe4', '#c58af9')}${sw('status.neutral', '#5f6368', '#bdc1c6')}
      </div></div>
    <div class="row" style="flex:1;min-height:0">
      <div class="card" style="flex:1.3"><div class="ch"><h3>Type scale</h3></div>
        ${[['display.small', 30, 600, 'Network change 4,812'], ['title.large', 20, 600, 'Workflow Manager'], ['title.medium', 15, 600, 'Awaiting approval'], ['body.medium', 13, 400, 'Rollback completed in 42 seconds'], ['label.small', 11, 600, 'LAST UPDATED']]
          .map(([n, s, w, t]) => `<div class="row" style="align-items:baseline;padding:7px 0;border-bottom:1px solid var(--line)"><span class="mono muted" style="width:120px;font-size:11px">${n}</span><span style="font-size:${s}px;font-weight:${w}">${t}</span><span class="muted mono" style="margin-left:auto;font-size:11px">${s}px</span></div>`).join('')}
      </div>
      <div class="card" style="flex:1"><div class="ch"><h3>Spacing & shape</h3></div>
        ${[4, 8, 12, 16, 24, 32].map((s) => `<div class="row" style="align-items:center;gap:12px;padding:4px 0"><span class="mono muted" style="width:90px;font-size:11px">space.${s}</span><div style="height:12px;width:${s * 5}px;border-radius:3px;background:var(--p)"></div><span class="muted" style="font-size:11px">${s}px</span></div>`).join('')}
        <div class="row" style="gap:12px;margin-top:12px">${[4, 8, 12, 16, 999].map((r) => `<div style="width:44px;height:44px;border:2px solid var(--p);background:var(--p-c);border-radius:${r === 999 ? '50%' : r + 'px'}"></div>`).join('')}</div>
      </div>
    </div>`,
  });
}
const ds_tokens = page(bg.blue, win({ x: 160, y: 70, w: 1280, h: 860, url: 'design.example.net/foundations/color' }, tokensPage()));

function componentPanel(dark) {
  return `<div class="${dark ? 'dark' : ''}" style="flex:1;background:var(--bg);color:var(--tx);border-radius:20px;padding:26px;display:flex;flex-direction:column;gap:18px;box-shadow:0 40px 80px -30px rgba(15,23,42,.45),0 0 0 1px rgba(15,23,42,.08)">
    <div class="row" style="align-items:center"><div style="font-size:17px;font-weight:600">Components</div><span class="chip ${dark ? 'out' : 'sel'}" style="margin-left:auto">${ic(dark ? 'dark_mode' : 'light_mode')}${dark ? 'Dark' : 'Light'} theme</span></div>
    <div class="row" style="gap:10px;flex-wrap:wrap"><div class="btn f">${ic('play_arrow')}Run workflow</div><div class="btn t">Schedule</div><div class="btn o">Cancel</div></div>
    <div class="row" style="gap:8px;flex-wrap:wrap">${chip('Automated', 'vio')}${chip('In review', 'warn')}${chip('Approved', 'ok')}${chip('Running', 'info')}${chip('Failed', 'err')}</div>
    <div class="row" style="gap:12px"><div style="flex:1"><div class="lbl">Target site</div><div class="input">${ic('cell_tower')}Chennai North · 42 cells</div></div><div style="flex:1"><div class="lbl">Maintenance window</div><div class="input">${ic('schedule')}Tonight, 01:00 – 04:00</div></div></div>
    <div class="card" style="padding:6px 6px">
      <table><tr><th>Step</th><th>Status</th><th>Duration</th></tr>
        <tr><td>Pre-checks</td><td>${chip('Passed', 'ok')}</td><td class="muted">00:42</td></tr>
        <tr><td>Apply configuration</td><td>${chip('Running', 'info')}</td><td class="muted">02:10</td></tr>
        <tr><td>Post-checks</td><td>${chip('Pending', '')}</td><td class="muted">—</td></tr></table></div>
    <div class="card" style="display:flex;gap:14px;align-items:flex-start">
      <div class="pill-ic chip warn" style="height:40px;width:40px;padding:0">${ic('front_hand')}</div>
      <div style="flex:1"><div style="font-weight:600;margin-bottom:4px">Human override</div><div class="tx2" style="font-size:12.5px;line-height:1.5">Pause automation before configuration is applied to live cells.</div></div><div class="sw"></div></div>
    <div class="row" style="gap:12px;align-items:center;padding:12px 16px;border-radius:12px;background:${dark ? "#e8eaed" : "#303134"};color:${dark ? "#202124" : "#e8eaed"}"><span class="ms">check_circle</span><span style="flex:1">Workflow approved by M. Laurent</span><span style="font-weight:600;color:${dark ? "#1a73e8" : "#8ab4f8"}">Undo</span></div>
  </div>`;
}
const ds_components = page(bg.blue, `<div style="position:absolute;inset:70px 90px;display:flex;gap:36px;align-items:center">${componentPanel(false)}${componentPanel(true)}</div>`);

function schedulerBody() {
  const hours = ['18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'];
  const lanes = [
    ['RAN · Chennai', [[8, 30, 'info', 'Parameter rollout · 42 cells'], [62, 22, 'vio', 'Auto health check']]],
    ['RAN · Dallas', [[30, 40, 'info', 'Cell site software upgrade']]],
    ['Core · Helsinki', [[44, 26, 'warn', 'Firewall policy · approval needed']]],
    ['Core · Espoo', [[52, 34, 'teal', 'Licence capacity expansion']]],
    ['Transport · Sydney', [[4, 18, 'ok', 'Link migration ✓'], [70, 22, 'info', 'Fibre route test']]],
    ['Transport · Lyon', [[20, 24, 'err', 'QoS change · rolled back'], [58, 20, 'info', 'Retry (AI suggested)']]],
    ['Assurance · Global', [[0, 100, 'vio', 'Continuous alarm correlation (automated)']]],
    ['RAN · Austin', [[36, 20, 'info', 'Antenna tilt batch'], [76, 18, 'ok', 'KPI check']]],
  ];
  return `
  <div class="row" style="align-items:center;gap:10px">${chip('Week 41', 'sel', false)}${chip('All regions', 'out', false)}${chip('Conflicts only', 'out', false)}<div style="margin-left:auto" class="row">${chip('Change', 'info')}${chip('Automated', 'vio')}${chip('Needs approval', 'warn')}</div></div>
  <div class="card" style="flex:1;padding:0;overflow:hidden;position:relative">
    <div style="display:grid;grid-template-columns:170px 1fr;border-bottom:1px solid var(--line)"><div style="padding:12px 16px;font-weight:600">Tonight · Thu 9 Oct</div><div style="display:flex">${hours.map((h) => `<div style="flex:1;padding:12px 0 12px 8px;color:var(--tx3);font-size:11.5px;border-left:1px solid var(--line)">${h}</div>`).join('')}</div></div>
    ${lanes.map(([n, bars]) => `<div style="display:grid;grid-template-columns:170px 1fr;border-bottom:1px solid var(--line);height:72px"><div style="padding:0 16px;display:flex;align-items:center;font-weight:500">${n}</div><div style="position:relative;background-image:linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:calc(100%/7) 100%">${bars.map(([l, w, k, t]) => `<div class="chip ${k}" style="position:absolute;left:${l}%;width:${w}%;top:18px;height:36px;border-radius:10px;padding:0 12px;font-weight:500;overflow:hidden">${t}</div>`).join('')}</div></div>`).join('')}
    <div style="position:absolute;top:44px;bottom:0;left:calc(170px + (100% - 170px)*0.47);width:2px;background:var(--err)"><div style="position:absolute;top:-4px;left:-4px;width:10px;height:10px;border-radius:50%;background:var(--err)"></div></div>
  </div>`;
}
const ds_scheduler = page(bg.night, win({ x: 160, y: 70, w: 1280, h: 860, url: 'automation.example.net/scheduler', dark: true },
  shell({ brand: 'Network Automation', nav: platformNav('Scheduler'), crumb: 'Operations', title: 'Scheduler', actions: `<div class="btn f s" style="margin-left:18px">${ic('add')}Book window</div>`, body: schedulerBody() })));

function mopMonitorBody() {
  const steps = [
    ['ok', 'check_circle', 'Pre-checks passed', 'Alarms, KPIs and backups verified', '00:42'],
    ['ok', 'check_circle', 'Lock cells', '42 of 42 cells locked', '01:05'],
    ['info', 'progress_activity', 'Apply parameter set', '29 of 42 cells updated', '02:10'],
    ['', 'radio_button_unchecked', 'Unlock cells', 'Waiting', '—'],
    ['', 'radio_button_unchecked', 'Post-checks & KPI compare', 'Waiting', '—'],
  ];
  return `<div class="row" style="flex:1;min-height:0">
    <div class="card" style="width:300px;flex:none;padding:10px">
      <div class="ch" style="padding:6px 6px 0"><h3>Running procedures</h3></div>
      ${[['5G RAN parameter rollout', 'Chennai North', 'info', 68, true], ['Cell site software upgrade', 'Dallas West', 'info', 22], ['Firewall policy update', 'Helsinki DC2', 'warn', 40], ['QoS profile change', 'Lyon', 'err', 55], ['Licence capacity expansion', 'Espoo', 'info', 8], ['VLAN provisioning batch', 'Austin', 'ok', 100]]
        .map(([t, s, k, p, on]) => `<div style="padding:12px;border-radius:12px;${on ? 'background:var(--p-c)' : ''};margin-bottom:4px"><div class="row" style="justify-content:space-between;align-items:center"><div style="font-weight:500">${t}</div></div><div class="muted" style="font-size:11.5px;margin:4px 0 8px">${s}</div><div class="bar"><b style="width:${p}%;background:var(--${k === 'info' ? 'p' : k})"></b></div></div>`).join('')}
    </div>
    <div class="col" style="flex:1;min-width:0">
      <div class="card"><div class="row" style="align-items:center;gap:14px"><div class="pill-ic chip info" style="height:44px;width:44px;padding:0">${ic('rocket_launch')}</div><div><div style="font-size:16px;font-weight:600">5G RAN parameter rollout</div><div class="muted">MOP-2291 · Chennai North · started 01:02</div></div>
        <div class="row" style="margin-left:auto;gap:8px"><div class="btn o s">${ic('pause')}Pause</div><div class="btn o s" style="color:var(--err)">${ic('undo')}Roll back</div></div></div></div>
      <div class="row" style="flex:1;min-height:0">
        <div class="card" style="flex:1"><div class="ch"><h3>Steps</h3><span class="r chip info">Step 3 of 5</span></div>
          ${steps.map(([k, i, t, s, d], idx) => `<div class="row" style="gap:12px;position:relative;padding-bottom:16px">${idx < steps.length - 1 ? '<div style="position:absolute;left:11px;top:26px;bottom:2px;width:2px;background:var(--line)"></div>' : ''}<span class="ms f" style="color:var(--${k || 'tx3'});font-size:24px">${i}</span><div style="flex:1"><div style="font-weight:500">${t}</div><div class="muted" style="font-size:12px">${s}</div></div><span class="muted mono" style="font-size:11.5px">${d}</span></div>`).join('')}
          <div style="border-top:1px solid var(--line);margin-top:6px;padding-top:14px"><div style="font-weight:600;margin-bottom:10px">KPI compare · before vs now</div>
          ${[['Throughput', 92, 96, 'up', '+4%'], ['Call drop rate', 40, 31, 'up', '−0.2 pt'], ['Latency', 60, 58, 'up', '−2 ms']].map(([n, a, b2, k, d]) => `<div class="row" style="align-items:center;gap:10px;padding:5px 0"><span style="width:110px" class="tx2">${n}</span><div style="flex:1;display:flex;flex-direction:column;gap:3px"><div class="bar"><b style="width:${a}%;background:var(--line)"></b></div><div class="bar"><b style="width:${b2}%"></b></div></div><span class="${k}" style="width:56px;text-align:right;font-weight:600">${d}</span></div>`).join('')}</div>
        </div>
        <div class="card mono" style="flex:1;background:#14161a;color:#c9d1d9;border-color:#14161a;font-size:11.5px;line-height:1.75;overflow:hidden">
          <div style="color:#8b949e;margin-bottom:6px">execution log</div>
          <div><span style="color:#7ee787">01:02:11</span> pre-check alarms … OK (0 critical)</div>
          <div><span style="color:#7ee787">01:02:40</span> pre-check KPI baseline stored</div>
          <div><span style="color:#7ee787">01:03:05</span> lock 42/42 cells … OK</div>
          <div><span style="color:#79c0ff">01:04:12</span> apply paramSet v7 → CHN-N-0142</div>
          <div><span style="color:#79c0ff">01:04:15</span> apply paramSet v7 → CHN-N-0143</div>
          <div><span style="color:#79c0ff">01:04:19</span> apply paramSet v7 → CHN-N-0151</div>
          <div><span style="color:#e3b341">01:04:22</span> retry CHN-N-0158 (timeout 1/3)</div>
          <div><span style="color:#79c0ff">01:04:30</span> apply paramSet v7 → CHN-N-0158 … OK</div>
          <div><span style="color:#79c0ff">01:04:34</span> apply paramSet v7 → CHN-N-0160</div>
          <div><span style="color:#79c0ff">01:04:37</span> apply paramSet v7 → CHN-N-0161</div>
          <div><span style="color:#d2a8ff">01:04:40</span> ai.monitor: KPIs within baseline ±2%</div>
          <div><span style="color:#79c0ff">01:04:44</span> apply paramSet v7 → CHN-N-0163</div>
          <div><span style="color:#79c0ff">01:04:48</span> apply paramSet v7 → CHN-N-0170</div>
          <div><span style="color:#79c0ff">01:04:51</span> progress 29/42 cells</div>
          <div style="color:#8b949e">▍</div>
        </div>
      </div>
    </div></div>`;
}
const ds_monitor = page(bg.blue, win({ x: 160, y: 70, w: 1280, h: 860, url: 'automation.example.net/mop-monitor/MOP-2291' },
  shell({ brand: 'Network Automation', nav: platformNav('MOP Monitor'), crumb: 'Operations', title: 'MOP Monitor', body: mopMonitorBody() })));


import { more } from './screens2.mjs';
import { concepts } from './screens3.mjs';

export const screens = {
  'ds-cover': ds_cover,
  'ds-tokens': ds_tokens,
  'ds-components': ds_components,
  'ds-scheduler': ds_scheduler,
  'ds-monitor': ds_monitor,
  ...more,
  ...concepts,
};
