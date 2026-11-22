#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'graphify-out', 'assets', '.agent', '.gemini']);
const IGNORE_FILES = new Set(['mock_tests_data.js', 'package-lock.json']);
const CODE_EXTS = new Set(['.js', '.ts', '.jsx', '.tsx', '.py', '.html', '.md']);

function walkDir(dir, rootDir, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const ent of entries) {
    if (ent.isDirectory()) {
      if (!IGNORE_DIRS.has(ent.name)) walkDir(path.join(dir, ent.name), rootDir, out);
    } else if (ent.isFile()) {
      if (IGNORE_FILES.has(ent.name)) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (!CODE_EXTS.has(ext)) continue;
      const full = path.join(dir, ent.name);
      try {
        const st = fs.statSync(full);
        if (st.size > 800 * 1024) continue; // skip >800KB generated bundles
        out.push(full);
      } catch {}
    }
  }
  return out;
}

function extractSymbols(filePath, relPath) {
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const symbols = [];
  const imports = [];

  if (ext === '.js' || ext === '.ts' || ext === '.jsx' || ext === '.tsx') {
    const reserved = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof', 'delete', 'await', 'async']);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Require / import detection
      const reqMatch = line.match(/(?:require\(['"]([^'"]+)['"]\)|from\s+['"]([^'"]+)['"])/);
      if (reqMatch) imports.push(reqMatch[1] || reqMatch[2]);

      // Function or object method definitions
      let m =
        line.match(/^\s*(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(/) ||
        line.match(/^\s*([A-Za-z0-9_$]+)\s*:\s*(?:async\s+)?function\s*\(/) ||
        line.match(/^\s*(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>/) ||
        line.match(/^\s{2,6}(?:async\s+)?([A-Za-z0-9_$]+)\s*\([^;]*\)\s*\{/);

      if (m && !reserved.has(m[1])) {
        symbols.push({
          id: `${relPath}::${m[1]}`,
          name: m[1],
          kind: 'function',
          file: relPath,
          startLine: i + 1,
          endLine: i + 1
        });
      }
    }
    // Estimate endLine based on next symbol in the same file
    for (let i = 0; i < symbols.length; i++) {
      symbols[i].endLine = (i + 1 < symbols.length) ? symbols[i + 1].startLine - 1 : lines.length;
    }
  } else if (ext === '.html') {
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/<script[^>]+src=["']([^"']+)["']/i);
      if (m && !m[1].startsWith('http')) imports.push(m[1]);
    }
  }
  return { symbols, imports, lineCount: lines.length, content };
}

function buildGraph(rootDir) {
  const absRoot = path.resolve(rootDir);
  const files = walkDir(absRoot, absRoot);
  const nodes = [];
  const edges = [];
  const fileContents = new Map();
  const symbolByName = new Map();

  for (const f of files) {
    const rel = path.relative(absRoot, f).replace(/\\/g, '/');
    const { symbols, imports, lineCount, content } = extractSymbols(f, rel);
    fileContents.set(rel, content);
    nodes.push({ id: rel, name: rel, kind: path.extname(rel) === '.md' ? 'doc' : 'file', file: rel, startLine: 1, endLine: lineCount });

    for (const imp of imports) {
      edges.push({ source: rel, target: imp.replace(/^\.\//, ''), type: 'IMPORTS', kind: 'EXTRACTED' });
    }
    for (const sym of symbols) {
      nodes.push(sym);
      edges.push({ source: rel, target: sym.id, type: 'DEFINES', kind: 'EXTRACTED' });
      if (!symbolByName.has(sym.name)) symbolByName.set(sym.name, []);
      symbolByName.get(sym.name).push(sym);
    }
  }

  // Extract function-to-function call edges
  const funcNodes = nodes.filter(n => n.kind === 'function');
  for (const fn of funcNodes) {
    const content = fileContents.get(fn.file);
    if (!content) continue;
    const slice = content.split(/\r?\n/).slice(fn.startLine - 1, fn.endLine).join('\n');
    const callRegex = /(?:this\.|app\.)?([A-Za-z0-9_$]+)\s*\(/g;
    const seenTargets = new Set();
    let m;
    while ((m = callRegex.exec(slice)) !== null) {
      const calleeName = m[1];
      if (calleeName === fn.name) continue;
      const targets = symbolByName.get(calleeName);
      if (targets) {
        for (const t of targets) {
          if (!seenTargets.has(t.id)) {
            seenTargets.add(t.id);
            edges.push({ source: fn.id, target: t.id, type: 'CALLS', kind: 'EXTRACTED' });
          }
        }
      }
    }
  }

  const outDir = path.join(absRoot, 'graphify-out');
  fs.mkdirSync(outDir, { recursive: true });
  const graphData = { generatedAt: new Date().toISOString(), root: absRoot, nodes, edges };
  fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify(graphData, null, 2), 'utf8');

  // Compute degree for God Nodes
  const degree = new Map();
  for (const e of edges) {
    if (e.type === 'CALLS') {
      degree.set(e.source, (degree.get(e.source) || 0) + 1);
      degree.set(e.target, (degree.get(e.target) || 0) + 1);
    }
  }
  const topGodNodes = [...degree.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([id, deg]) => {
      const n = nodes.find(x => x.id === id);
      return `- \`${n ? n.name : id}\` (${n ? `${n.file}:${n.startLine}-${n.endLine}` : ''}) — **${deg} connections**`;
    });

  const reportMd = [
    `# Graphify Codebase Report`,
    ``,
    `- **Generated At**: ${graphData.generatedAt}`,
    `- **Total Nodes**: ${nodes.length} (${nodes.filter(n => n.kind === 'file' || n.kind === 'doc').length} files/docs, ${funcNodes.length} functions)`,
    `- **Total Edges**: ${edges.length} (\`EXTRACTED\`)`,
    ``,
    `## Top Connected Hub Functions (God Nodes)`,
    ...topGodNodes
  ].join('\n');
  fs.writeFileSync(path.join(outDir, 'GRAPH_REPORT.md'), reportMd, 'utf8');

  // Interactive Force-Directed Network Graph HTML viewer
  const html = `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"/><title>Graphify — Interactive Codebase Knowledge Graph</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,sans-serif;background:#090d16;color:#f8fafc;overflow:hidden;height:100vh;display:flex}
  #sidebar{width:340px;background:#111827;border-right:1px solid #1f2937;display:flex;flex-direction:column;z-index:10;padding:16px;gap:12px}
  h1{font-size:17px;font-weight:700;color:#38bdf8;display:flex;align-items:center;gap:8px}
  .stats{font-size:12px;color:#94a3b8;line-height:1.5}
  input,select{width:100%;padding:9px 12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;font-size:13px;outline:none}
  input:focus,select:focus{border-color:#38bdf8}
  .legend{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:#cbd5e1;padding:6px 0}
  .dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px}
  #details{flex:1;overflow-y:auto;background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:12px;font-size:13px}
  .chip{display:inline-block;background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:3px 8px;border-radius:6px;font-size:11.5px;margin:3px 4px 3px 0;cursor:pointer;transition:0.15s}
  .chip:hover{background:#0284c7;border-color:#38bdf8;color:#fff}
  .sec-title{font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin:12px 0 6px;font-weight:700}
  #canvas-wrap{flex:1;position:relative;overflow:hidden}
  canvas{display:block;width:100%;height:100%;cursor:grab}
  canvas:active{cursor:grabbing}
  .controls{position:absolute;bottom:16px;right:16px;display:flex;gap:8px}
  .btn{background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:7px 12px;border-radius:8px;font-size:12px;cursor:pointer}
  .btn:hover{background:#334155}
</style></head>
<body>
  <div id="sidebar">
    <h1>⚡ Graphify Knowledge Graph</h1>
    <div class="stats">${nodes.length} Nodes &bull; ${edges.length} Edges (EXTRACTED)</div>
    <input id="search" placeholder="🔍 Tìm hàm hoặc file (VD: renderExamRoom)..." />
    <select id="filterMode">
      <option value="all">Hiển thị: Toàn bộ đồ thị (${nodes.length} nodes)</option>
      <option value="hubs">Hiển thị: Files + Hàm trung tâm (God Nodes)</option>
      <option value="calls">Hiển thị: Chỉ sơ đồ gọi hàm (CALLS)</option>
    </select>
    <div class="legend">
      <span><i class="dot" style="background:#38bdf8"></i>File</span>
      <span><i class="dot" style="background:#f59e0b"></i>God Node (≥5 kết nối)</span>
      <span><i class="dot" style="background:#818cf8"></i>Function</span>
      <span><i class="dot" style="background:#10b981"></i>Doc (.md)</span>
    </div>
    <div id="details">
      <div style="color:#64748b;margin-top:20px;text-align:center">
        🖱️ <b>Click vào một nút (node)</b> trên sơ đồ để xem vị trí dòng code và các nhánh gọi hàm.<br/><br/>
        • Cuộn chuột để Phóng to / Thu nhỏ<br/>
        • Kéo thả nút hoặc nền để di chuyển
      </div>
    </div>
  </div>
  <div id="canvas-wrap">
    <canvas id="graph"></canvas>
    <div class="controls">
      <button class="btn" onclick="resetView()">Căn giữa (Reset Zoom)</button>
      <button class="btn" onclick="reheat()">Sắp xếp lại lực (Re-layout)</button>
    </div>
  </div>
<script>
const RAW = ${JSON.stringify({ nodes, edges })};
const degMap = {};
RAW.edges.forEach(e => {
  degMap[e.source] = (degMap[e.source] || 0) + 1;
  degMap[e.target] = (degMap[e.target] || 0) + 1;
});

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let W = 800, H = 600;
function resize() {
  W = canvas.parentElement.clientWidth;
  H = canvas.parentElement.clientHeight;
  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resize);
resize();

let camX = 0, camY = 0, scale = 0.75;
let alpha = 1;
let selectedNode = null, hoverNode = null, dragNode = null, isPanning = false, startX = 0, startY = 0;

const simNodes = RAW.nodes.map((n, i) => {
  const angle = (i / RAW.nodes.length) * Math.PI * 2;
  const r = n.kind === 'file' ? 140 : 260 + (i % 7) * 35;
  const deg = degMap[n.id] || 0;
  return {
    ...n,
    deg,
    x: W / 2 + Math.cos(angle) * r + (Math.random() - 0.5) * 40,
    y: H / 2 + Math.sin(angle) * r + (Math.random() - 0.5) * 40,
    vx: 0, vy: 0,
    radius: n.kind === 'file' ? 11 : (deg >= 6 ? 9.5 : 5.5)
  };
});
const nodeById = Object.fromEntries(simNodes.map(n => [n.id, n]));
const simEdges = RAW.edges.map(e => ({
  ...e,
  s: nodeById[e.source],
  t: nodeById[e.target]
})).filter(e => e.s && e.t);

let activeNodes = simNodes;
let activeEdges = simEdges;

function applyFilter() {
  const mode = document.getElementById('filterMode').value;
  const q = document.getElementById('search').value.trim().toLowerCase();
  activeNodes = simNodes.filter(n => {
    if (mode === 'hubs' && n.kind === 'function' && n.deg < 4) return false;
    if (mode === 'calls' && n.kind !== 'function') return false;
    return true;
  });
  const set = new Set(activeNodes.map(n => n.id));
  activeEdges = simEdges.filter(e => {
    if (mode === 'calls' && e.type !== 'CALLS') return false;
    return set.has(e.s.id) && set.has(e.t.id);
  });
  if (q) {
    const match = activeNodes.find(n => n.name.toLowerCase().includes(q));
    if (match) selectNode(match, false);
  }
  alpha = 0.6;
}
document.getElementById('filterMode').addEventListener('change', applyFilter);
document.getElementById('search').addEventListener('input', applyFilter);

function stepPhysics() {
  if (alpha < 0.005) return;
  alpha *= 0.985;
  const N = activeNodes.length;
  for (let i = 0; i < N; i++) {
    const a = activeNodes[i];
    a.vx += (W / 2 - a.x) * 0.0012 * alpha;
    a.vy += (H / 2 - a.y) * 0.0012 * alpha;
    for (let j = i + 1; j < N; j++) {
      const b = activeNodes[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      let d2 = dx * dx + dy * dy + 0.1;
      if (d2 < 18000) {
        let f = (420 / d2) * alpha;
        a.vx -= dx * f; a.vy -= dy * f;
        b.vx += dx * f; b.vy += dy * f;
      }
    }
  }
  for (const e of activeEdges) {
    const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetDist = e.type === 'DEFINES' ? 75 : 120;
    const f = (dist - targetDist) * 0.018 * alpha;
    const fx = (dx / dist) * f, fy = (dy / dist) * f;
    e.s.vx += fx; e.s.vy += fy;
    e.t.vx -= fx; e.t.vy -= fy;
  }
  for (const n of activeNodes) {
    if (n === dragNode) continue;
    n.vx *= 0.82; n.vy *= 0.82;
    n.x += n.vx; n.y += n.vy;
  }
}

function nodeColor(n) {
  if (n.kind === 'file') return '#38bdf8';
  if (n.kind === 'doc') return '#10b981';
  if (n.deg >= 6) return '#f59e0b';
  return '#818cf8';
}

function draw() {
  stepPhysics();
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2 + camX, H / 2 + camY);
  ctx.scale(scale, scale);
  ctx.translate(-W / 2, -H / 2);

  const q = document.getElementById('search').value.trim().toLowerCase();
  const focus = selectedNode || hoverNode;
  const connected = new Set();
  if (focus) {
    connected.add(focus.id);
    activeEdges.forEach(e => {
      if (e.s.id === focus.id) connected.add(e.t.id);
      if (e.t.id === focus.id) connected.add(e.s.id);
    });
  }

  for (const e of activeEdges) {
    const isHi = focus && (e.s.id === focus.id || e.t.id === focus.id);
    ctx.beginPath();
    ctx.moveTo(e.s.x, e.s.y);
    ctx.lineTo(e.t.x, e.t.y);
    ctx.strokeStyle = isHi ? (e.type === 'CALLS' ? '#f59e0b' : '#38bdf8') : (focus ? 'rgba(51,65,85,0.16)' : 'rgba(71,85,105,0.35)');
    ctx.lineWidth = isHi ? 2 : 0.8;
    ctx.stroke();
  }

  for (const n of activeNodes) {
    const isMatch = q && n.name.toLowerCase().includes(q);
    const dim = (focus && !connected.has(n.id)) || (q && !isMatch);
    ctx.globalAlpha = dim ? 0.18 : 1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = nodeColor(n);
    ctx.fill();
    if (n === selectedNode || isMatch) {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
    if (n.kind === 'file' || n.deg >= 5 || n === focus || isMatch || scale > 1.15) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = (n.kind === 'file' || n.deg >= 6 ? '600 ' : '') + '11px system-ui';
      ctx.fillText(n.name, n.x + n.radius + 4, n.y + 3);
    }
  }
  ctx.restore();
  requestAnimationFrame(draw);
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - W / 2 - camX) / scale + W / 2,
    y: (sy - H / 2 - camY) / scale + H / 2
  };
}

function findNodeAt(sx, sy) {
  const p = screenToWorld(sx, sy);
  for (let i = activeNodes.length - 1; i >= 0; i--) {
    const n = activeNodes[i];
    const dx = p.x - n.x, dy = p.y - n.y;
    if (dx * dx + dy * dy <= (n.radius + 5) * (n.radius + 5)) return n;
  }
  return null;
}

function selectNodeById(id) {
  const n = nodeById[id];
  if (n) selectNode(n, true);
}

function selectNode(n, centerIt) {
  selectedNode = n;
  if (!n) return;
  if (centerIt) {
    camX = (W / 2 - n.x) * scale;
    camY = (H / 2 - n.y) * scale;
  }
  const callers = RAW.edges.filter(e => e.target === n.id && e.type === 'CALLS').map(e => nodeById[e.source]).filter(Boolean);
  const callees = RAW.edges.filter(e => e.source === n.id && e.type === 'CALLS').map(e => nodeById[e.target]).filter(Boolean);
  const defined = RAW.edges.filter(e => e.source === n.id && e.type === 'DEFINES').map(e => nodeById[e.target]).filter(Boolean);

  document.getElementById('details').innerHTML = \`
    <div style="font-size:15px;font-weight:700;color:#38bdf8;word-break:break-all">\${n.name}</div>
    <div style="margin-top:4px;color:#94a3b8;font-size:12px">
      📄 File: <b>\${n.file}</b> &bull; Dòng: <b>\${n.startLine}–\${n.endLine}</b>
    </div>
    \${callers.length ? \`<div class="sec-title">Được gọi bởi (\${callers.length})</div>\` + callers.map(c => \`<span class="chip" onclick="selectNodeById('\${c.id}')">\${c.name}</span>\`).join('') : ''}
    \${callees.length ? \`<div class="sec-title">Gọi đến hàm (\${callees.length})</div>\` + callees.map(c => \`<span class="chip" onclick="selectNodeById('\${c.id}')">\${c.name}</span>\`).join('') : ''}
    \${defined.length ? \`<div class="sec-title">Hàm định nghĩa trong file (\${defined.length})</div>\` + defined.map(c => \`<span class="chip" onclick="selectNodeById('\${c.id}')">\${c.name} (\${c.startLine})</span>\`).join('') : ''}
  \`;
}

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const n = findNodeAt(e.clientX - rect.left, e.clientY - rect.top);
  if (n) {
    dragNode = n;
    selectNode(n, false);
    alpha = Math.max(alpha, 0.3);
  } else {
    isPanning = true;
    startX = e.clientX - camX;
    startY = e.clientY - camY;
  }
});
window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (dragNode) {
    const p = screenToWorld(mx, my);
    dragNode.x = p.x; dragNode.y = p.y;
  } else if (isPanning) {
    camX = e.clientX - startX;
    camY = e.clientY - startY;
  } else {
    hoverNode = findNodeAt(mx, my);
  }
});
window.addEventListener('mouseup', () => { dragNode = null; isPanning = false; });
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  scale = Math.min(3, Math.max(0.2, scale * (e.deltaY < 0 ? 1.12 : 0.89)));
}, { passive: false });

function resetView() { camX = 0; camY = 0; scale = 0.75; selectedNode = null; }
function reheat() { alpha = 1; }
draw();
</script></body></html>`;
  fs.writeFileSync(path.join(outDir, 'graph.html'), html, 'utf8');

  console.log(`Graphify built successfully in ./graphify-out/ (${nodes.length} nodes, ${edges.length} edges)`);
}

function isGraphStale(rootDir, graphPath) {
  if (!fs.existsSync(graphPath)) return true;
  try {
    const graphMtime = fs.statSync(graphPath).mtimeMs;
    const files = walkDir(path.resolve(rootDir), path.resolve(rootDir));
    const g = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    const indexedFiles = g.nodes.filter(n => n.kind === 'file' || n.kind === 'doc').length;
    if (files.length !== indexedFiles) return true;
    return files.some(f => fs.statSync(f).mtimeMs > graphMtime);
  } catch {
    return true;
  }
}

function loadGraph(rootDir) {
  const p = path.join(path.resolve(rootDir), 'graphify-out', 'graph.json');
  if (isGraphStale(rootDir, p)) {
    buildGraph(rootDir);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function queryGraph(rootDir, q) {
  const g = loadGraph(rootDir);
  const kw = (q || '').toLowerCase();
  const matches = g.nodes.filter(n => n.name.toLowerCase().includes(kw) || n.file.toLowerCase().includes(kw)).slice(0, 25);
  if (!matches.length) return console.log(`No nodes matching "${q}".`);
  for (const m of matches) {
    console.log(`[${m.kind.toUpperCase()}] ${m.name} -> ${m.file}:${m.startLine}-${m.endLine}`);
  }
}

function explainNode(rootDir, symName) {
  const g = loadGraph(rootDir);
  const kw = (symName || '').toLowerCase();
  const target = g.nodes.find(n => n.name.toLowerCase() === kw) || g.nodes.find(n => n.name.toLowerCase().includes(kw));
  if (!target) return console.log(`Symbol "${symName}" not found.`);
  console.log(`=== ${target.name} (${target.kind}) ===`);
  console.log(`Location: ${target.file} (Lines ${target.startLine}-${target.endLine})`);
  const callers = g.edges.filter(e => e.target === target.id && e.type === 'CALLS').map(e => e.source);
  const callees = g.edges.filter(e => e.source === target.id && e.type === 'CALLS').map(e => e.target);
  console.log(`Called by (${callers.length}): ${callers.slice(0, 15).join(', ') || 'None'}`);
  console.log(`Calls (${callees.length}): ${callees.slice(0, 15).join(', ') || 'None'}`);
}

function shortestPath(rootDir, a, b) {
  const g = loadGraph(rootDir);
  const start = g.nodes.find(n => n.name.toLowerCase().includes((a || '').toLowerCase()));
  const end = g.nodes.find(n => n.name.toLowerCase().includes((b || '').toLowerCase()));
  if (!start || !end) return console.log(`Could not find both endpoints (${a}, ${b}).`);
  const adj = new Map();
  for (const e of g.edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source).push(e.target);
    adj.get(e.target).push(e.source);
  }
  const queue = [[start.id]];
  const visited = new Set([start.id]);
  while (queue.length) {
    const curPath = queue.shift();
    const last = curPath[curPath.length - 1];
    if (last === end.id) {
      return console.log(`Path: ${curPath.join(' -> ')}`);
    }
    for (const nxt of (adj.get(last) || [])) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        queue.push([...curPath, nxt]);
      }
    }
  }
  console.log(`No direct path found between ${start.id} and ${end.id}.`);
}

const [, , cmd = 'build', arg1 = '.', arg2 = ''] = process.argv;
if (cmd === 'build') buildGraph(arg1);
else if (cmd === 'query') queryGraph('.', arg1);
else if (cmd === 'explain') explainNode('.', arg1);
else if (cmd === 'path') shortestPath('.', arg1, arg2);
else buildGraph('.');
