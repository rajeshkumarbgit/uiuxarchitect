// Shared UI kit for portfolio mockups. Screens are illustrative recreations
// (no confidential product UI), rendered to WebP by build.mjs.

export const W = 1600;
export const H = 1000;

export const css = `
:root{--p:#1a73e8;--p-c:#e8f0fe;--on-p-c:#174ea6;--bg:#f8f9fb;--surf:#fff;--surf2:#f1f3f4;--line:#e3e6ea;--tx:#1f1f1f;--tx2:#5f6368;--tx3:#80868b;
--ok:#188038;--ok-c:#e6f4ea;--warn:#a85f00;--warn-c:#fef3d6;--err:#c5221f;--err-c:#fce8e6;--info:#1967d2;--info-c:#e8f0fe;--vio:#7b3fe4;--vio-c:#f1e8fd;--teal:#00796b;--teal-c:#e0f2f1}
.dark{--p:#8ab4f8;--p-c:#22385a;--on-p-c:#d2e3fc;--bg:#131314;--surf:#1e1f20;--surf2:#2a2b2e;--line:#3a3c40;--tx:#e8eaed;--tx2:#bdc1c6;--tx3:#9aa0a6;
--ok:#81c995;--ok-c:#1d3527;--warn:#fdd663;--warn-c:#3b3216;--err:#f28b82;--err-c:#472321;--info:#8ab4f8;--info-c:#22385a;--vio:#c58af9;--vio-c:#36284f;--teal:#80cbc4;--teal-c:#173a37}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:100vw;height:100vh;overflow:hidden}
body{font-family:'Google Sans Flex','Google Sans',Roboto,system-ui,sans-serif;font-size:13px;color:var(--tx);-webkit-font-smoothing:antialiased;position:relative}
.ms{font-family:'Material Symbols Rounded';font-weight:400;font-style:normal;font-size:20px;line-height:1;display:inline-block;letter-spacing:normal;text-transform:none;white-space:nowrap;-webkit-font-feature-settings:'liga';font-feature-settings:'liga';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}
.ms.f{font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24}
.mono{font-family:'Google Sans Code','Roboto Mono',ui-monospace,monospace}
.canvas{position:absolute;inset:0;overflow:hidden}
.abs{position:absolute}
/* browser window */
.win{position:absolute;border-radius:14px;overflow:hidden;background:var(--bg);color:var(--tx);box-shadow:0 50px 100px -30px rgba(15,23,42,.45),0 18px 36px -18px rgba(15,23,42,.35),0 0 0 1px rgba(15,23,42,.08);display:flex;flex-direction:column}
.dark.win{box-shadow:0 50px 100px -30px rgba(0,0,0,.7),0 18px 36px -18px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08)}
.chrome{height:38px;flex:none;display:flex;align-items:center;gap:14px;padding:0 14px;background:var(--surf2);border-bottom:1px solid var(--line)}
.dots{display:flex;gap:7px}.dots i{width:11px;height:11px;border-radius:50%;background:#ff5f57}.dots i:nth-child(2){background:#febc2e}.dots i:nth-child(3){background:#28c840}
.url{flex:1;max-width:520px;margin:0 auto;height:24px;border-radius:12px;background:var(--surf);color:var(--tx3);font-size:11.5px;display:flex;align-items:center;gap:6px;padding:0 12px}
.url .ms{font-size:14px}
/* app shell */
.app{flex:1;display:flex;min-height:0}
.side{width:224px;flex:none;background:var(--surf);border-right:1px solid var(--line);padding:14px 10px;display:flex;flex-direction:column;gap:2px}
.brand{display:flex;align-items:center;gap:10px;padding:4px 10px 16px;font-weight:600;font-size:14.5px}
.logo{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--p),var(--vio));display:grid;place-items:center;color:#fff}
.dark .logo{color:#111}
.logo .ms{font-size:17px}
.nav{display:flex;align-items:center;gap:12px;height:36px;padding:0 12px;border-radius:18px;color:var(--tx2);font-weight:500}
.nav .ms{font-size:19px}
.nav.on{background:var(--p-c);color:var(--on-p-c)}
.nav .n{margin-left:auto;font-size:11px;background:var(--err);color:#fff;border-radius:9px;padding:1px 7px}
.dark .nav .n{color:#111}
.sec{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);padding:14px 12px 6px;font-weight:600}
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.top{height:56px;flex:none;display:flex;align-items:center;gap:14px;padding:0 22px;border-bottom:1px solid var(--line);background:var(--surf)}
.top h1{font-size:17px;font-weight:600;letter-spacing:-.01em}
.crumb{color:var(--tx3);font-size:12px}
.search{margin-left:auto;width:300px;height:36px;border-radius:18px;background:var(--surf2);display:flex;align-items:center;gap:8px;padding:0 14px;color:var(--tx3)}
.search .ms{font-size:18px}
.ib{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:var(--tx2)}
.av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#34a853,#1a73e8);color:#fff;display:grid;place-items:center;font-weight:600;font-size:12px;flex:none}
.body{flex:1;min-height:0;padding:20px 22px;display:flex;flex-direction:column;gap:16px;overflow:hidden}
.row{display:flex;gap:16px}.col{display:flex;flex-direction:column;gap:16px}
.g{display:grid;gap:16px}
/* cards */
.card{background:var(--surf);border:1px solid var(--line);border-radius:16px;padding:16px}
.ch{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.ch h3{font-size:14px;font-weight:600}
.ch .sub{color:var(--tx3);font-size:12px}
.ch .r{margin-left:auto}
.kpi{display:flex;flex-direction:column;gap:6px}
.kpi .l{color:var(--tx2);font-size:12px;display:flex;align-items:center;gap:6px}
.kpi .l .ms{font-size:17px}
.kpi .v{font-size:26px;font-weight:600;letter-spacing:-.02em}
.kpi .d{font-size:11.5px;color:var(--tx3)}
.up{color:var(--ok)}.dn{color:var(--err)}
/* chips & buttons */
.chip{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px;border-radius:12px;font-size:11.5px;font-weight:500;white-space:nowrap;background:var(--surf2);color:var(--tx2)}
.chip i{width:7px;height:7px;border-radius:50%;background:currentColor}
.chip.ok{background:var(--ok-c);color:var(--ok)}.chip.warn{background:var(--warn-c);color:var(--warn)}.chip.err{background:var(--err-c);color:var(--err)}
.chip.info{background:var(--info-c);color:var(--info)}.chip.vio{background:var(--vio-c);color:var(--vio)}.chip.teal{background:var(--teal-c);color:var(--teal)}
.chip.out{background:transparent;border:1px solid var(--line);color:var(--tx2)}
.chip.sel{background:var(--p-c);color:var(--on-p-c)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 18px;border-radius:18px;font-weight:600;font-size:13px;white-space:nowrap}
.btn .ms{font-size:18px}
.btn.f{background:var(--p);color:#fff}.dark .btn.f{color:#0b1b33}
.btn.t{background:var(--p-c);color:var(--on-p-c)}
.btn.o{border:1px solid var(--line);color:var(--p)}
.btn.s{height:30px;padding:0 14px;font-size:12px}
/* table */
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:11.5px;font-weight:600;color:var(--tx3);padding:9px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:10px 10px;border-bottom:1px solid var(--line);white-space:nowrap;font-size:12.5px}
tr:last-child td{border-bottom:0}
td .t2{color:var(--tx3);font-size:11.5px}
.bar{height:6px;border-radius:3px;background:var(--surf2);overflow:hidden;min-width:70px}
.bar b{display:block;height:100%;border-radius:3px;background:var(--p)}
.pill-ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.pill-ic .ms{font-size:19px}
.muted{color:var(--tx3)}.tx2{color:var(--tx2)}
.sw{width:42px;height:22px;border-radius:11px;background:var(--p);position:relative;flex:none}
.sw:after{content:'';position:absolute;right:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff}
.sw.off{background:var(--line)}.sw.off:after{right:auto;left:3px}
.input{height:40px;border:1px solid var(--line);border-radius:10px;display:flex;align-items:center;padding:0 12px;gap:8px;color:var(--tx2);background:var(--surf)}
.lbl{font-size:11.5px;color:var(--tx3);margin-bottom:6px;font-weight:500}
/* phone */
.phone{position:absolute;width:340px;height:720px;border-radius:52px;background:#0f1012;padding:11px;box-shadow:0 50px 90px -30px rgba(15,23,42,.55),0 0 0 1.5px #2b2d31 inset}
.scr{width:100%;height:100%;border-radius:42px;overflow:hidden;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;position:relative}
.sbar{height:40px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0;font-size:13px;font-weight:600}
.sbar .ms{font-size:16px}
.notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:92px;height:26px;border-radius:14px;background:#0f1012}
.ptop{padding:6px 18px 10px;display:flex;align-items:center;gap:10px}
.ptop h2{font-size:21px;font-weight:600;letter-spacing:-.01em}
.pbody{flex:1;padding:4px 14px;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.pnav{height:64px;flex:none;display:flex;justify-content:space-around;align-items:center;border-top:1px solid var(--line);background:var(--surf)}
.pnav div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;color:var(--tx3);font-weight:500}
.pnav div.on{color:var(--on-p-c)}
.pnav div.on .ms{background:var(--p-c);border-radius:14px;padding:3px 16px}
.float{position:absolute;background:var(--surf);color:var(--tx);border-radius:18px;box-shadow:0 30px 60px -20px rgba(15,23,42,.4),0 0 0 1px rgba(15,23,42,.06);padding:16px}
.dark.float{box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)}
.dotbg{background-image:radial-gradient(circle,var(--line) 1.2px,transparent 1.3px);background-size:20px 20px}
`;

export const ic = (n, cls = '') => `<span class="ms ${cls}">${n}</span>`;
export const chip = (t, k = '', dot = true) => `<span class="chip ${k}">${dot ? '<i></i>' : ''}${t}</span>`;

export function win({ x, y, w, h, url, dark = false, style = '', z = 1 }, inner) {
  return `<div class="win ${dark ? 'dark' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};${style}">
  <div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url">${ic('lock')}${url}</div><div style="width:47px"></div></div>
  ${inner}</div>`;
}

export function shell({ brand, brandIcon = 'hub', nav, title, crumb = '', actions = '', body, sideExtra = '' }) {
  const navHtml = nav
    .map((n) => (n.sec ? `<div class="sec">${n.sec}</div>` : `<div class="nav ${n.on ? 'on' : ''}">${ic(n.i, n.on ? 'f' : '')}${n.t}${n.n ? `<span class="n">${n.n}</span>` : ''}</div>`))
    .join('');
  return `<div class="app"><aside class="side"><div class="brand"><div class="logo">${ic(brandIcon, 'f')}</div>${brand}</div>${navHtml}${sideExtra}</aside>
  <div class="main"><div class="top"><div><div class="crumb">${crumb}</div><h1>${title}</h1></div>${actions}
  <div class="search">${ic('search')}Search</div><div class="ib">${ic('notifications')}</div><div class="ib">${ic('help')}</div><div class="av">RK</div></div>
  <div class="body">${body}</div></div></div>`;
}

export function phone({ x, y, dark = false, rot = 0, scale = 1, z = 1 }, inner) {
  return `<div class="phone" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg) scale(${scale});z-index:${z}">
  <div class="scr ${dark ? 'dark' : ''}"><div class="notch"></div><div class="sbar"><span>9:41</span><span>${ic('signal_cellular_alt', 'f')} ${ic('wifi', 'f')} ${ic('battery_full', 'f')}</span></div>${inner}</div></div>`;
}

export function page(bg, content) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700&family=Google+Sans+Code:wght@400;500&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..24,400,0..1,0&display=block" rel="stylesheet">
<style>${css}</style></head><body><div class="canvas" style="background:${bg}">${content}</div></body></html>`;
}

// Soft gradient canvases
export const bg = {
  blue: 'radial-gradient(900px 600px at 0% 0%,#d6e4ff 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#e4dcff 0%,transparent 60%),#eef2f9',
  teal: 'radial-gradient(900px 600px at 0% 0%,#c9f0ea 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#d3e6ff 0%,transparent 60%),#edf6f5',
  violet: 'radial-gradient(900px 600px at 0% 0%,#e8dcff 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#d6e4ff 0%,transparent 60%),#f1effa',
  night: 'radial-gradient(900px 600px at 0% 0%,#1d2b4a 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#2d1f4a 0%,transparent 60%),#0e1016',
  warm: 'radial-gradient(900px 600px at 0% 0%,#ffe7cc 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#dbe7ff 0%,transparent 60%),#f6f2ee',
  mint: 'radial-gradient(900px 600px at 0% 0%,#d7f5df 0%,transparent 60%),radial-gradient(900px 700px at 100% 100%,#d6e4ff 0%,transparent 60%),#eef6f1',
};
