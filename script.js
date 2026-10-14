/* BIBD v7 — Game FPP di Apartemen Arsip. Three.js 0.186.1 via importmap. */
import * as THREE from 'three';

/* ---------- DATA (semua placeholder berlabel Contoh) ---------- */
const ARCHIVES = [
  { id:'BIBD-001', title:'Rapat Perdana Komunitas', cat:'Rapat', date:'12 Jan 2026', desc:'Rapat pertama komunitas: pembentukan struktur, pembagian tugas, dan kesepakatan tata tertib arsip. Semua keputusan dicatat dan disimpan di katalog.', tags:['rapat','perdana'] },
  { id:'BIBD-002', title:'Meme Rapat yang Tertib', cat:'Meme', date:'19 Jan 2026', desc:'Kumpulan meme ringan bertema rapat yang tertib. Humor komunitas, tetap sopan, tanpa menyinggung siapa pun.', tags:['meme','humor'] },
  { id:'BIBD-003', title:'Kerja Bakti Arsip', cat:'Kegiatan', date:'26 Jan 2026', desc:'Kerja bakti merapikan arsip: memilah dokumen, memberi nomor katalog, dan membersihkan rak.', tags:['kegiatan','rapi'] },
  { id:'BIBD-004', title:'Infografis Alur Katalog', cat:'Panduan', date:'02 Feb 2026', desc:'Infografis alur katalog: dari dokumen masuk, penomoran, penyimpanan, sampai pencarian kembali.', tags:['panduan','infografis'] },
  { id:'BIBD-005', title:'Meme Katalog Hilang', cat:'Meme', date:'09 Feb 2026', desc:'Meme tentang drama katalog yang sempat hilang lalu ketemu lagi di rak paling bawah. Pelajaran: catat nomor katalog.', tags:['meme','katalog'] },
  { id:'BIBD-006', title:'Kunjungan Studi Arsip', cat:'Kegiatan', date:'16 Feb 2026', desc:'Kunjungan studi: melihat langsung cara arsip dikelola, sistem penomoran, dan ruang baca.', tags:['kegiatan','studi'] },
  { id:'BIBD-007', title:'Nonton Bareng Komunitas', cat:'Kegiatan', date:'23 Feb 2026', desc:'Nonton bareng santai antar anggota. Momen kebersamaan di luar urusan arsip.', tags:['kegiatan','santai'] },
  { id:'BIBD-008', title:'Panduan Contributor Arsip', cat:'Panduan', date:'02 Mar 2026', desc:'Panduan berkontribusi: cara mengirim arsip, format judul, dan etika berkomentar.', tags:['panduan','kontribusi'] },
];
const SECRET = { id:'BIBD-000', title:'Arsip Rahasia', cat:'Rahasia', date:'—', desc:'Kamu menemukan Ruang Rahasia! Isinya catatan kecil: arsip yang paling berharga bukan yang paling lama, tapi yang paling rapi dicatat dan paling mudah ditemukan kembali.', tags:['rahasia'] };
const BOOKS = [
  { id:'buku-1', title:'Panduan Contributor', body:'<p>1. Kirim arsip dengan judul jelas dan tanggal kegiatan.</p><p>2. Tulis deskripsi singkat: apa, kapan, siapa yang terlibat.</p><p>3. Beri tag agar mudah dicari.</p><p>4. Hormati privasi: jangan unggah foto wajah tanpa izin.</p>' },
  { id:'buku-2', title:'Aturan Arsip', body:'<p>1. Setiap arsip punya nomor katalog unik (BIBD-xxx).</p><p>2. Arsip tidak dihapus, hanya diarsipkan ulang.</p><p>3. Komentar sopan, tanpa perundungan.</p><p>4. Konten selalu bersih.</p>' },
  { id:'buku-3', title:'FAQ Arsip', body:'<p><b>Siapa boleh berkontribusi?</b> Semua anggota.</p><p><b>Bagaimana cara cari arsip?</b> Lewat nomor katalog, kategori, atau tag.</p><p><b>Arsip hilang?</b> Cek rak paling bawah, lalu tanya kurator.</p>' },
];
const MEMBERS = [
  ['Andi','Kurator'],['Budi','Dokumentasi'],['Citra','Acara'],['Dedi','Desain'],['Eka','Kurator'],['Fani','Dokumentasi'],
  ['Gita','Acara'],['Hadi','Desain'],['Indah','Kurator'],['Joko','Dokumentasi'],['Kiki','Acara'],['Lina','Desain'],
];
const LOBBY_BOARDS = [
  { id:'papan-tentang', title:'Tentang BIBD', body:'<p>BIBD adalah komunitas arsip: tempat anggota menyimpan, merapikan, dan menemukan kembali cerita kegiatan bersama.</p><p><b>3 nilai:</b> Tertib (semua tercatat), Terdokumentasi (semua tersimpan rapi), Komunitas (semua ikut menjaga).</p><p class="meta">Konten bersih, tanpa konten eksplisit.</p>' },
  { id:'papan-statistik', title:'Statistik (Contoh)', body:'<p><b>24</b> Arsip &nbsp;·&nbsp; <b>12</b> Anggota &nbsp;·&nbsp; <b>6</b> Kegiatan &nbsp;·&nbsp; <b>1</b> Ketua</p><p class="meta">Angka contoh — ganti dengan data asli.</p>' },
  { id:'papan-ketua', title:'Ketua — Fairuz', body:'<p><b>Fairuz</b> — Ketua BIBD.</p><p>Tanggung jawab: Kurasi Arsip, Koordinasi Kegiatan, Jaga Ketertiban Arsip.</p><p><i>"Arsip yang rapi adalah arsip yang mudah ditemukan kembali."</i></p>' },
  { id:'papan-pengumuman', title:'Pengumuman', body:'<p>1. Kerja bakti arsip tiap Jumat sore (Contoh).</p><p>2. Kirim arsip terbaru sebelum akhir bulan (Contoh).</p><p>3. Ruang Baca buka untuk semua anggota (Contoh).</p>' },
  { id:'papan-jadwal', title:'Jadwal Kegiatan (Contoh)', body:'<p>Jumat — Kerja bakti arsip.</p><p>Sabtu — Diskusi &amp; kurasi arsip baru.</p><p>Minggu — Nonton bareng / santai.</p>' },
  { id:'papan-cara', title:'Cara Bermain', body:'<p>WASD jalan, mouse melihat, Shift lari, E interaksi.</p><p>Tujuan: baca 8 arsip di Galeri + temukan Ruang Rahasia.</p><p>Petunjuk rahasia: ketuk rak buku di Ruang Baca 3 kali.</p>' },
];
const POSTERS = [
  { id:'poster-1', title:'Poster: Tertib', body:'<p>TERTIB — Semua tercatat, semua punya nomor katalog.</p>' },
  { id:'poster-2', title:'Poster: Terdokumentasi', body:'<p>TERDOKUMENTASI — Cerita kegiatan tidak hilang, tersimpan rapi.</p>' },
  { id:'poster-3', title:'Poster: Komunitas', body:'<p>KOMUNITAS — Arsip dijaga bersama, bukan sendiri-sendiri.</p>' },
];

/* ---------- ROOMS ---------- */
const ROOMS = [
  { id:'lobi', name:'Lobi', x0:-8, z0:-6, x1:8, z1:6, cx:0, cz:0, color:'#f5f1e6' },
  { id:'galeri', name:'Galeri Album', x0:8, z0:-6, x1:20, z1:6, cx:14, cz:0, color:'#eaf2fb' },
  { id:'baca', name:'Ruang Baca', x0:-20, z0:-6, x1:-8, z1:6, cx:-14, cz:0, color:'#f3ecdf' },
  { id:'kantor', name:'Kantor Ketua', x0:-8, z0:6, x1:8, z1:13, cx:0, cz:9.5, color:'#eef3e8' },
  { id:'timeline', name:'Aula Timeline', x0:8, z0:6, x1:20, z1:13, cx:14, cz:9.5, color:'#f6ecec' },
  { id:'anggota', name:'Ruang Anggota', x0:-20, z0:6, x1:-8, z1:13, cx:-14, cz:9.5, color:'#eceef6' },
  { id:'rahasia', name:'Ruang Rahasia', x0:-20, z0:-13, x1:-12, z1:-6, cx:-16, cz:-9.5, color:'#2b2b33' },
];
const roomOf = (x, z) => ROOMS.find(r => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) || null;

/* ---------- STATE ---------- */
const SAVE_KEY = 'bibd-fpp-v1';
let save = { collected: [], visited: [], secret: false, shelfTaps: 0 };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s) save = { ...save, ...s }; } catch (e) {}
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} };
let started = false, locked = false, paused = false, detailOpen = false, clickMode = false, suppressPauseUntil = 0;
let startTime = Date.now(), interactionCount = 0, completedShown = false;
let yaw = Math.PI, pitch = 0;
const player = { pos: new THREE.Vector3(0, 1.6, 3.5), vel: new THREE.Vector3() };
const keys = {};
const isTouch = matchMedia('(pointer:coarse)').matches;

/* ---------- DOM ---------- */
const $ = id => document.getElementById(id);
const toastEl = $('toast');
let toastTimer = null;
function toast(msg) { toastEl.textContent = msg; toastEl.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 2600); }

/* ---------- THREE SETUP ---------- */
const canvas = $('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  $('startScreen').innerHTML = '<div class="card"><h2>WebGL tidak tersedia</h2><p class="sub">Perangkat ini tidak mendukung 3D. Gunakan Jelajah Klik.</p><button class="cta" onclick="document.getElementById(\'clickExplore\').classList.remove(\'hidden\');this.parentElement.parentElement.style.display=\'none\'">Buka Jelajah Klik</button></div>';
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8e8);
scene.fog = new THREE.Fog(0xbfd8e8, 45, 90);
const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 200);
camera.position.copy(player.pos);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a5f, 0.95));
const sun = new THREE.DirectionalLight(0xfff2d9, 1.6);
sun.position.set(10, 22, 6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30; sun.shadow.camera.right = 30; sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

/* ---------- MATERIALS / HELPERS ---------- */
const M = {
  floor: new THREE.MeshStandardMaterial({ color: 0xd9b98c, roughness: 0.9 }),
  floorDark: new THREE.MeshStandardMaterial({ color: 0x8f7a5e, roughness: 0.95 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 0.95 }),
  wallAccent: new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.95 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x9a6b43, roughness: 0.8 }),
  woodDark: new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.8 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
  black: new THREE.MeshStandardMaterial({ color: 0x2b2b33, roughness: 0.6 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x0071e3, roughness: 0.6 }),
  green: new THREE.MeshStandardMaterial({ color: 0x2e7d4f, roughness: 0.7 }),
  red: new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.7 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.7 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x3a2e22, roughness: 0.6 }),
};
function box(w, h, d, mat, x, y, z, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
}
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' '); let line = '', yy = y;
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = wd; yy += lineH; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy + lineH;
}
function boardTexture(title, lines, opts = {}) {
  return canvasTexture(1024, opts.h || 640, (ctx, w, h) => {
    ctx.fillStyle = opts.bg || '#ffffff'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 10; ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.fillStyle = '#0071e3'; ctx.fillRect(60, 60, 120, 14);
    ctx.fillStyle = '#1d1d1f'; ctx.font = '800 64px Inter, sans-serif'; ctx.fillText(title, 60, 150);
    ctx.font = '400 38px Inter, sans-serif'; ctx.fillStyle = '#333';
    let y = 230; for (const ln of lines) { y = wrapText(ctx, ln, 60, y, w - 120, 52) + 14; }
  });
}
function frameTexture(a) {
  return canvasTexture(640, 800, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h); grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(1, '#ffb8a8');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(520, 140, 150, 0, 7); ctx.fill();
    ctx.fillStyle = '#1d1d1f'; ctx.font = '800 56px Inter, sans-serif';
    ctx.fillText(a.id, 40, 90);
    ctx.font = '700 44px Inter, sans-serif'; wrapText(ctx, a.title, 40, 620, w - 80, 54);
    ctx.font = '400 30px Inter, sans-serif'; ctx.fillStyle = '#555'; ctx.fillText(a.cat + ' · ' + a.date, 40, 750);
  });
}
function labelTexture(text, sub = '') {
  return canvasTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#1d1d1f'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffd60a'; ctx.font = '800 44px Inter, sans-serif'; ctx.fillText(text, 28, 62);
    if (sub) { ctx.fillStyle = '#fff'; ctx.font = '400 28px Inter, sans-serif'; ctx.fillText(sub, 28, 102); }
  });
}

/* ---------- COLLIDERS ---------- */
const colliders = []; // {x0,z0,x1,z1}
function addCollider(x0, z0, x1, z1) { colliders.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) }); }
function collide(pos, r = 0.35) {
  for (const c of colliders) {
    const nx = Math.max(c.x0, Math.min(pos.x, c.x1));
    const nz = Math.max(c.z0, Math.min(pos.z, c.z1));
    const dx = pos.x - nx, dz = pos.z - nz;
    const d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      if (d2 > 1e-6) { const d = Math.sqrt(d2); pos.x = nx + dx / d * r; pos.z = nz + dz / d * r; }
      else pos.x = c.x1 + r;
    }
  }
}

/* ---------- BUILD APARTMENT ---------- */
const interactables = []; // {mesh, data}
function registerInteract(mesh, data) { mesh.userData.interact = data; interactables.push({ mesh, data }); }
function plane(w, h, tex, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; scene.add(m); return m;
}
// Floor + ceiling
box(44, 0.2, 28, M.floor, 0, -0.1, 0, false);
box(44, 0.2, 28, M.ceiling, 0, 3.4, 0, false);
box(8.4, 0.06, 7.4, M.floorDark, -16, 0.03, -9.5, false); // secret room carpet
// Walls: [x0,z0,x1,z1] with thickness via collider + mesh
const WALLS = [
  [-22, -14, 22, -14], [-22, 14, 22, 14], [-22, -14, -22, 14], [22, -14, 22, 14],
  [-8, -6, 8, -6], // lobi north
  [8, -6, 20, -6], // galeri north
  [-20, -6, -17, -6], [-15, -6, -8, -6], // baca north (gap = secret door -17..-15)
  [-22, -13, -22, -6], [-12, -13, -12, -6], [-20, -13, -12, -13], // secret room
  [-8, 6, -1, 6], [1, 6, 8, 6], // lobi-kantor (gap -1..1)
  [-20, 6, -14, 6], [-12, 6, -8, 6], // baca-anggota (gap -14..-12)
  [8, 6, 12, 6], [14, 6, 20, 6], // galeri-timeline (gap 12..14)
  [-8, -6, -8, -1], [-8, 1, -8, 6], // lobi-baca (gap -1..1)
  [8, -6, 8, -1], [8, 1, 8, 6], // lobi-galeri (gap -1..1)
  [-8, 6, -8, 13], [8, 6, 8, 13], // kantor sides
  [-20, -6, -20, 13], [20, -6, 20, 13], // outer west/east mid (already covered by outer, kept for mesh)
  [-20, 13, -8, 13], [8, 13, 20, 13], // south rooms
  [-8, 13, 8, 13],
];
for (const [x0, z0, x1, z1] of WALLS) {
  const dx = x1 - x0, dz = z1 - z0;
  const len = Math.max(Math.abs(dx), Math.abs(dz));
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const horizontal = Math.abs(dz) < 0.01;
  box(horizontal ? len : 0.3, 3.4, horizontal ? 0.3 : len, M.wall, cx, 1.7, cz, false);
  addCollider(cx - (horizontal ? len / 2 : 0.15), cz - (horizontal ? 0.15 : len / 2), cx + (horizontal ? len / 2 : 0.15), cz + (horizontal ? 0.15 : len / 2));
}
// Door frames + labels
function doorLabel(text, x, z, ry) {
  const p = plane(2.2, 0.45, labelTexture(text), x, 3.12, z, ry);
  p.material.transparent = false;
}
doorLabel('LOBI', 0, -5.8, 0);
doorLabel('GALERI ALBUM', 7.8, 0, Math.PI / 2);
doorLabel('RUANG BACA', -7.8, 0, -Math.PI / 2);
doorLabel('KANTOR KETUA', 0, 6.2, Math.PI);
doorLabel('AULA TIMELINE', 13, 6.2, Math.PI);
doorLabel('RUANG ANGGOTA', -13, 6.2, Math.PI);
doorLabel('GALERI ALBUM', 14, -5.8, 0);
doorLabel('RUANG BACA', -14, -5.8, 0);
// Windows (bright planes) on north + south outer walls
for (const wx of [-4, 4, 12, 18]) { const w = plane(2.4, 1.6, canvasTexture(256, 170, (c, ww, hh) => { c.fillStyle = '#bfe3ff'; c.fillRect(0, 0, ww, hh); c.fillStyle = '#fff7cc'; c.beginPath(); c.arc(190, 40, 26, 0, 7); c.fill(); c.fillStyle = '#7dbb5a'; c.fillRect(0, 130, ww, 40); }), wx, 1.9, -13.8, 0); }
for (const wx of [-14, -4, 4, 14]) { plane(2.4, 1.6, canvasTexture(256, 170, (c, ww, hh) => { c.fillStyle = '#bfe3ff'; c.fillRect(0, 0, ww, hh); c.fillStyle = '#fff7cc'; c.beginPath(); c.arc(60, 40, 26, 0, 7); c.fill(); c.fillStyle = '#7dbb5a'; c.fillRect(0, 130, ww, 40); }), wx, 1.9, 13.8, Math.PI); }

/* ---------- FURNITURE ---------- */
function furniture(x0, z0, x1, z1, fn) { addCollider(x0, z0, x1, z1); fn(); }
// Reception desk (lobi north)
furniture(-2, -4.6, 2, -3.6, () => { box(4, 1.05, 1, M.wood, 0, 0.52, -4.1); box(4.2, 0.1, 1.2, M.woodDark, 0, 1.1, -4.1); });
const receptionist = new THREE.Group();
const rBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.7, 4, 12), new THREE.MeshStandardMaterial({ color: 0x2e7d4f, roughness: 0.7 }));
rBody.position.set(0, 1.15, -3.4); rBody.castShadow = true;
const rHead = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe8b98a, roughness: 0.7 }));
rHead.position.set(0, 1.95, -3.4); rHead.castShadow = true;
receptionist.add(rBody, rHead); scene.add(receptionist);
registerInteract(rHead, { kind: 'reception', title: 'Resepsionis', kicker: 'LOBI', body: '<p>Selamat datang di Apartemen Arsip BIBD!</p><p>Mulai dari papan informasi di sekeliling lobi, lalu masuk ke Galeri Album untuk membaca 8 arsip.</p><p>Katanya ada Ruang Rahasia di balik rak buku Ruang Baca… ketuk raknya 3 kali.</p>' });
// TV lobi
furniture(-5.6, -5.8, -3.4, -5.4, () => { box(2.2, 1.3, 0.12, M.black, -4.5, 1.9, -5.8, false); });
const tv = plane(2, 1.1, canvasTexture(512, 280, (c, w, h) => { c.fillStyle = '#0b1c2c'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd60a'; c.font = '800 44px Inter'; c.fillText('BIBD TV', 30, 80); c.fillStyle = '#fff'; c.font = '400 30px Inter'; c.fillText('Arsip terbaru: BIBD-008', 30, 140); c.fillText('Panduan Contributor', 30, 180); }), -4.5, 1.9, -5.7, 0);
registerInteract(tv, { kind: 'tv', title: 'BIBD TV — Cuplikan Arsip', kicker: 'LOBI', body: '<p><b>Arsip terbaru:</b> BIBD-008 Panduan Contributor Arsip.</p><p><b>Pengumuman:</b> Kerja bakti arsip tiap Jumat sore (Contoh).</p><p>Gunakan Galeri Album untuk membaca semua arsip selengkapnya.</p>' });
// Lobby tables + plants
furniture(4.5, -2.5, 6.5, -0.5, () => { box(2, 0.08, 2, M.white, 5.5, 0.7, -1.5); box(0.15, 0.7, 0.15, M.woodDark, 4.8, 0.35, -2.2); box(0.15, 0.7, 0.15, M.woodDark, 6.2, 0.35, -0.8); });
box(0.5, 0.9, 0.5, M.green, 7, 0.45, 5, true); box(0.5, 0.9, 0.5, M.green, -7, 0.45, 5, true);
// Reading room: shelves + table
furniture(-19, -5.5, -17, 5.5, () => { for (let i = 0; i < 3; i++) box(0.6, 2.4, 2.2, M.wood, -18.2, 1.2, -3.5 + i * 3.2); });
furniture(-13, 2.5, -11, 4.5, () => { box(2.2, 0.08, 2, M.white, -12, 0.72, 3.5); });
// Secretary desk in Kantor
furniture(-2, 8, 2, 10, () => { box(3.4, 0.08, 1.4, M.wood, 0, 0.75, 9); box(1.2, 0.9, 0.9, M.woodDark, 0, 0.45, 9); });
box(0.9, 1.1, 0.9, M.black, 0, 0.55, 11.2, true);
// Timeline rail
box(10, 0.08, 0.3, M.woodDark, 14, 0.9, 9.5, false);

/* ---------- INTERACTABLES ---------- */
// Helper: board on wall (plane + backing)
function wallBoard(tex, w, h, x, y, z, ry, data) {
  const backing = box(w + 0.15, h + 0.15, 0.06, M.frame, x, y, z, false);
  backing.rotation.y = ry;
  const p = plane(w, h, tex, x, y, z, ry);
  // nudge plane slightly off wall toward room
  const off = 0.06;
  p.position.x += Math.sin(ry) * off; p.position.z += Math.cos(ry) * off;
  registerInteract(p, data);
  return p;
}
// LOBI boards: north wall (z=-5.8 facing +z, ry=0) + west/east
LOBBY_BOARDS.forEach((b, i) => {
  const tex = boardTexture(b.title, b.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').match(/.{1,42}(\s|$)/g).map(s => s.trim()).filter(Boolean), { h: 560 });
  const x = -5.6 + i * 2.8;
  if (i < 4) wallBoard(tex, 2.4, 1.35, x, 1.85, -5.8, 0, { kind: 'board', title: b.title, kicker: 'LOBI · PAPAN INFORMASI', body: b.body });
  else if (i === 4) wallBoard(tex, 2.4, 1.35, -7.8, 1.85, -2, -Math.PI / 2, { kind: 'board', title: b.title, kicker: 'LOBI · PAPAN INFORMASI', body: b.body });
  else wallBoard(tex, 2.4, 1.35, 7.8, 1.85, -2, Math.PI / 2, { kind: 'board', title: b.title, kicker: 'LOBI · PAPAN INFORMASI', body: b.body });
});
// Denah dinding lobi
wallBoard(boardTexture('Denah Apartemen', ['Lobi: tengah.', 'Galeri: timur.', 'Ruang Baca: barat.', 'Kantor Ketua: selatan tengah.', 'Aula Timeline: tenggara.', 'Ruang Anggota: barat daya.', 'Ruang Rahasia: ???']), 2.4, 1.35, 7.8, 1.85, 2, Math.PI / 2, { kind: 'board', title: 'Denah Apartemen', kicker: 'LOBI · PETA', body: '<p>Lobi di tengah. Galeri di timur, Ruang Baca di barat, Kantor Ketua di selatan tengah, Aula Timeline di tenggara, Ruang Anggota di barat daya.</p><p>Ruang Rahasia? Cari di balik rak buku Ruang Baca.</p>' });
// Posters
POSTERS.forEach((p, i) => {
  const tex = boardTexture(p.title.replace('Poster: ', ''), [p.body.replace(/<[^>]+>/g, '')], { bg: '#fff7cc', h: 480 });
  wallBoard(tex, 1.5, 0.95, -7.8, 1.8, 2 + i * 1.6, -Math.PI / 2, { kind: 'poster', title: p.title, kicker: 'LOBI · POSTER', body: p.body });
});
// GALERI: 8 frames on north + south walls
ARCHIVES.forEach((a, i) => {
  const tex = frameTexture(a);
  const north = i < 4;
  const x = 10 + (i % 4) * 2.9;
  const z = north ? -5.8 : 5.8;
  const ry = north ? 0 : Math.PI;
  const p = wallBoard(tex, 1.9, 2.2, x, 1.8, z, ry, { kind: 'arsip', title: a.title, kicker: a.id + ' · ' + a.cat + ' · ' + a.date, body: '<p>' + a.desc + '</p><p>' + a.tags.map(t => '<span class="tag">' + t + '</span>').join('') + '</p>', archiveId: a.id });
  p.userData.archiveId = a.id;
});
// RUANG BACA: 3 books on shelf (colored boxes)
const BOOK_COLORS = [0xc0392b, 0x2e7d4f, 0x0071e3];
BOOKS.forEach((b, i) => {
  const m = box(0.35, 0.5, 0.28, new THREE.MeshStandardMaterial({ color: BOOK_COLORS[i], roughness: 0.7 }), -18.2, 1.85, -3.5 + i * 0.6);
  registerInteract(m, { kind: 'buku', title: b.title, kicker: 'RUANG BACA · BUKU', body: b.body });
});
// Secret shelf (bookshelf in front of secret door) — tap 3x to open
const secretShelf = box(2.4, 2.6, 0.5, M.woodDark, -16, 1.3, -5.9);
// Secret shelf blocks the hidden gap until opened (3 taps)
const SHELF_COL = { x0: -17.2, z0: -6.2, x1: -14.8, z1: -5.6 };
addCollider(SHELF_COL.x0, SHELF_COL.z0, SHELF_COL.x1, SHELF_COL.z1);
registerInteract(secretShelf, { kind: 'rak-rahasia', title: 'Rak Buku Tua', kicker: 'RUANG BACA · RAK', body: '<p>Rak ini terasa agak goyang. Ketuk 3 kali untuk melihat apa yang ada di baliknya.</p>' });
// KANTOR: Surat Ketua on desk
const letter = box(0.7, 0.05, 0.5, M.white, 0.8, 0.82, 9);
registerInteract(letter, { kind: 'surat', title: 'Surat Ketua', kicker: 'KANTOR KETUA · FAIRUZ', body: '<p>Halo, anggota BIBD.</p><p>Terima kasih sudah menjaga arsip kita tetap rapi. Satu arsip yang tercatat baik lebih berguna daripada sepuluh arsip yang tercecer.</p><p>Kalau menemukan arsip baru, catat nomor katalognya, lalu simpan di tempat yang mudah ditemukan.</p><p>— Fairuz, Ketua</p>' });
const chairTex = boardTexture('Fairuz — Ketua', ['Kurasi Arsip.', 'Koordinasi Kegiatan.', 'Jaga Ketertiban Arsip.'], { h: 480 });
wallBoard(chairTex, 2.2, 1.25, 0, 1.9, 12.8, Math.PI, { kind: 'board', title: 'Fairuz — Ketua BIBD', kicker: 'KANTOR KETUA', body: '<p><b>Fairuz</b> — Ketua BIBD.</p><p>Tanggung jawab: Kurasi Arsip, Koordinasi Kegiatan, Jaga Ketertiban Arsip.</p><p><i>"Arsip yang rapi adalah arsip yang mudah ditemukan kembali."</i></p>' });
// AULA TIMELINE: 11 nodes (8 arsip + 3 tonggak)
const TIMELINE = [
  { t: 'Jan · Rapat Perdana', body: '<p>Tonggak: Rapat Perdana Komunitas (12 Jan 2026). Struktur dibentuk, tata tertib disepakati.</p>' },
  { t: 'Jan · BIBD-001', arch: 0 }, { t: 'Jan · BIBD-002', arch: 1 }, { t: 'Jan · BIBD-003', arch: 2 },
  { t: 'Feb · BIBD-004', arch: 3 }, { t: 'Feb · BIBD-005', arch: 4 },
  { t: 'Feb · Kunjungan Studi', body: '<p>Tonggak: Kunjungan Studi Arsip (16 Feb 2026). Belajar pengelolaan arsip langsung di lokasi.</p>' },
  { t: 'Feb · BIBD-006', arch: 5 }, { t: 'Feb · BIBD-007', arch: 6 },
  { t: 'Mar · Panduan Contributor', body: '<p>Tonggak: Panduan Contributor Arsip (02 Mar 2026). Aturan berkontribusi ditulis dan dibagikan.</p>' },
  { t: 'Mar · BIBD-008', arch: 7 },
];
TIMELINE.forEach((n, i) => {
  const x = 10.2 + i * 0.72;
  const s = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshStandardMaterial({ color: n.arch !== undefined ? 0x0071e3 : 0xf5c518, roughness: 0.5 }));
  s.position.set(x, 1.05, 9.5); s.castShadow = true; scene.add(s);
  const label = plane(1.15, 0.3, labelTexture(n.t.split(' · ')[1] || n.t, ''), x, 1.55, 9.5, Math.PI);
  let data;
  if (n.arch !== undefined) { const a = ARCHIVES[n.arch]; data = { kind: 'arsip', title: a.title, kicker: a.id + ' · TIMELINE', body: '<p>' + a.desc + '</p>', archiveId: a.id }; }
  else data = { kind: 'tonggak', title: n.t, kicker: 'AULA TIMELINE · TONGGAK', body: n.body };
  registerInteract(s, data);
  registerInteract(label, data);
});
// RUANG ANGGOTA: 12 plates
MEMBERS.forEach(([name, role], i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = -18 + col * 2.6, z = row < 2 ? 6.2 : 12.8;
  const ry = row < 2 ? Math.PI : 0;
  const y = 1.9;
  const tex = boardTexture(name, ['Peran: ' + role + ' (Contoh).', 'Arsip: ikut merapikan arsip komunitas.'], { h: 420 });
  wallBoard(tex, 1.8, 1.0, x, y, z, ry, { kind: 'anggota', title: name + ' — ' + role, kicker: 'RUANG ANGGOTA · CONTOH', body: '<p><b>' + name + '</b> — ' + role + ' (Contoh).</p><p>Profil placeholder: foto asli menyusul. Anggota ikut merapikan dan menjaga arsip komunitas.</p>' });
});
// RUANG RAHASIA: secret archive frame + note
const secretFrame = wallBoard(frameTexture(SECRET), 1.9, 2.2, -16, 1.8, -12.8, Math.PI, { kind: 'arsip', title: SECRET.title, kicker: SECRET.id + ' · Rahasia', body: '<p>' + SECRET.desc + '</p>', archiveId: SECRET.id });
secretFrame.userData.archiveId = SECRET.id;
wallBoard(boardTexture('Kamu Menemukannya!', ['Ruang ini tersembunyi.', 'Hanya penjelajah teliti yang sampai.']), 2.2, 1.25, -19.8, 1.9, -9.5, -Math.PI / 2, { kind: 'board', title: 'Kamu Menemukannya!', kicker: 'RUANG RAHASIA', body: '<p>Ruang ini tersembunyi di balik rak buku Ruang Baca.</p><p>Hanya penjelajah teliti yang sampai di sini. Arsip rahasia sudah terbuka.</p>' });

/* ---------- INTERACTION ---------- */
const raycaster = new THREE.Raycaster();
raycaster.far = 4;
let hovered = null;
function findHover() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(interactables.map(i => i.mesh), false);
  return hits.length ? hits[0].object.userData.interact : null;
}
function setHover(data) {
  hovered = data;
  const ch = $('crosshair');
  if (data) { ch.classList.add('hot'); $('prompt').classList.remove('hidden'); $('promptText').textContent = data.title; $('btnInteract').classList.remove('hidden'); }
  else { ch.classList.remove('hot'); $('prompt').classList.add('hidden'); if (!isTouch) $('btnInteract').classList.add('hidden'); }
}
function openDetail(data) {
  interactionCount++;
  if (data.kind === 'rak-rahasia') {
    save.shelfTaps++;
    if (save.shelfTaps >= 3) { openSecretDoor(); $('detailTitle').textContent = 'Rak Terbuka!'; }
    else { toast('Rak bergoyang… ketuk ' + (3 - save.shelfTaps) + ' kali lagi'); }
    persist();
    if (save.shelfTaps < 3) { showDetail({ ...data, body: '<p>Rak bergoyang… ketukan ke-' + save.shelfTaps + ' dari 3.</p>' }); return; }
    showDetail({ kind: 'rak-rahasia', title: 'Rak Terbuka!', kicker: 'JALAN RAHASIA', body: '<p>Di balik rak ada lorong kecil menuju Ruang Rahasia di utara Ruang Baca. Masuklah!</p>' });
    return;
  }
  if (data.archiveId) {
    if (!save.collected.includes(data.archiveId)) { save.collected.push(data.archiveId); persist(); toast('Arsip terkumpul: ' + data.archiveId + ' (' + save.collected.filter(c => c !== SECRET.id).length + '/8)'); }
    if (data.archiveId === SECRET.id) save.secret = true;
    updateProgress(); checkComplete();
  }
  showDetail(data);
}
function showDetail(data) {
  detailOpen = true;
  $('detailKicker').textContent = data.kicker || '';
  $('detailTitle').textContent = data.title;
  $('detailBody').innerHTML = data.body || '';
  const acts = $('detailActions'); acts.innerHTML = '';
  if (data.archiveId && data.archiveId !== SECRET.id) {
    const b = document.createElement('button'); b.textContent = save.collected.includes(data.archiveId) ? 'Terkumpul' : 'Tandai Terkumpul';
    b.className = 'primary'; b.onclick = () => { if (!save.collected.includes(data.archiveId)) { save.collected.push(data.archiveId); persist(); updateProgress(); checkComplete(); } b.textContent = 'Terkumpul'; };
    acts.appendChild(b);
  }
  $('detail').classList.remove('hidden');
  if (locked) document.exitPointerLock?.();
}
function closeDetail(relock = true) { detailOpen = false; $('detail').classList.add('hidden'); suppressPauseUntil = Date.now() + 600; if (relock && started && !isTouch && !paused) canvas.requestPointerLock?.(); }
$('btnCloseDetail').onclick = closeDetail;
function openSecretDoor() {
  for (let i = colliders.length - 1; i >= 0; i--) { const c = colliders[i]; if (c.x0 === SHELF_COL.x0 && c.z0 === SHELF_COL.z0) colliders.splice(i, 1); }
  secretShelf.position.x = -13.8;
  save.secretDoor = true; persist();
  toast('Jalan rahasia terbuka!');
}
if (save.secretDoor) { secretShelf.position.x = -13.8; for (let i = colliders.length - 1; i >= 0; i--) { const c = colliders[i]; if (c.x0 === SHELF_COL.x0 && c.z0 === SHELF_COL.z0) colliders.splice(i, 1); } }

/* ---------- HUD / MINIMAP ---------- */
function updateProgress() {
  const n = save.collected.filter(c => c !== SECRET.id).length;
  $('progLabel').textContent = 'Arsip ' + n + '/8' + (save.secret ? ' · Rahasia terbuka' : '');
}
function currentRoomName() { const r = roomOf(player.pos.x, player.pos.z); return r ? r.name : 'Koridor'; }
function drawMinimap() {
  const ctx = $('minimap').getContext('2d');
  ctx.clearRect(0, 0, 150, 110);
  const sx = v => (v + 22) / 44 * 150, sz = v => (v + 14) / 28 * 110;
  for (const r of ROOMS) { ctx.fillStyle = r.id === 'rahasia' && !save.secretDoor ? '#9a9aa2' : r.color; ctx.fillRect(sx(r.x0), sz(r.z0), sx(r.x1) - sx(r.x0), sz(r.z1) - sz(r.z0)); ctx.strokeStyle = '#888'; ctx.strokeRect(sx(r.x0), sz(r.z0), sx(r.x1) - sx(r.x0), sz(r.z1) - sz(r.z0)); }
  const px = sx(player.pos.x), pz = sz(player.pos.z);
  ctx.save(); ctx.translate(px, pz); ctx.rotate(Math.atan2(-Math.cos(yaw), -Math.sin(yaw)) + Math.PI / 2);
  ctx.fillStyle = '#0071e3'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4, 5); ctx.lineTo(-4, 5); ctx.closePath(); ctx.fill(); ctx.restore();
}
function checkComplete() {
  const n = save.collected.filter(c => c !== SECRET.id).length;
  if (n >= 8 && save.secret && !completedShown) {
    completedShown = true;
    const mins = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    $('completeStats').textContent = '8 arsip + arsip rahasia terkumpul dalam ±' + mins + ' menit. ' + save.visited.length + ' ruangan dikunjungi, ' + interactionCount + ' interaksi.';
    $('completeScreen').classList.remove('hidden');
  }
}
$('btnCompleteClose').onclick = () => { $('completeScreen').classList.add('hidden'); suppressPauseUntil = Date.now() + 600; if (started && !isTouch && !paused) canvas.requestPointerLock?.(); };

/* ---------- CLICK EXPLORE ---------- */
function buildClickExplore() {
  const tabs = $('roomTabs'); tabs.innerHTML = '';
  let active = 'lobi';
  const render = () => {
    tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.room === active));
    const list = $('clickList'); list.innerHTML = '';
    const items = interactables.filter(i => {
      const p = i.mesh.getWorldPosition(new THREE.Vector3());
      const r = roomOf(p.x, p.z);
      return r && r.id === active;
    });
    const seen = new Set();
    for (const it of items) { if (seen.has(it.data.title)) continue; seen.add(it.data.title); const d = it.data;
      const row = document.createElement('div'); row.className = 'clickItem';
      row.innerHTML = '<div><b>' + d.title + '</b><br><span>' + (d.kicker || '') + '</span></div>';
      const b = document.createElement('button'); b.textContent = 'Buka';
      b.onclick = () => openDetail(d);
      row.appendChild(b); list.appendChild(row);
    }
    if (!list.children.length) list.innerHTML = '<p class="sub">Belum ada objek tercatat di ruangan ini.</p>';
  };
  for (const r of ROOMS) { const b = document.createElement('button'); b.textContent = r.name; b.dataset.room = r.id; b.onclick = () => { active = r.id; render(); }; tabs.appendChild(b); }
  render();
}
buildClickExplore();

/* ---------- CONTROLS ---------- */
function enterFPP() {
  started = true; clickMode = false;
  $('startScreen').style.display = 'none';
  $('clickExplore').classList.add('hidden');
  $('hud').classList.remove('hidden');
  if (isTouch) $('mobile').classList.remove('hidden');
  if (!isTouch) canvas.requestPointerLock?.();
  updateProgress();
}
function exitToMenu() {
  paused = true; $('pauseMenu').classList.remove('hidden');
  const n = save.collected.filter(c => c !== SECRET.id).length;
  $('pauseStats').textContent = 'Arsip ' + n + '/8 · ' + save.visited.length + ' ruangan · ' + interactionCount + ' interaksi';
}
$('btnEnter').onclick = enterFPP;
$('btnClickExplore').onclick = () => { clickMode = true; $('startScreen').style.display = 'none'; $('clickExplore').classList.remove('hidden'); };
$('btnBackFPP').onclick = () => { $('clickExplore').classList.add('hidden'); $('startScreen').style.display = 'flex'; };
$('btnResume').onclick = () => { $('pauseMenu').classList.add('hidden'); paused = false; if (!isTouch) canvas.requestPointerLock?.(); };
$('btnRestart').onclick = () => { $('pauseMenu').classList.add('hidden'); paused = false; player.pos.set(0, 1.6, 3.5); yaw = Math.PI; pitch = 0; if (!isTouch) canvas.requestPointerLock?.(); };
$('btnLobbyInfo').onclick = () => { $('pauseMenu').classList.add('hidden'); showDetail(LOBBY_BOARDS[0] ? { title: 'Info Lobi Lengkap', kicker: 'LOBI · SEMUA PAPAN', body: LOBBY_BOARDS.map(b => '<h3>' + b.title + '</h3>' + b.body).join('') } : {}); };
$('btnHelp').onclick = () => { $('helpPanel').classList.remove('hidden'); if (locked) document.exitPointerLock?.(); };
$('btnCloseHelp').onclick = () => { $('helpPanel').classList.add('hidden'); suppressPauseUntil = Date.now() + 600; if (started && !isTouch && !detailOpen) canvas.requestPointerLock?.(); };
$('btnPause').onclick = exitToMenu;
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  if (!locked && started && !detailOpen && $('helpPanel').classList.contains('hidden') && $('detail').classList.contains('hidden') && $('completeScreen').classList.contains('hidden') && !paused && Date.now() > suppressPauseUntil) exitToMenu();
});
document.addEventListener('mousemove', e => {
  if (!locked || paused || detailOpen) return;
  yaw -= e.movementX * 0.0023;
  pitch -= e.movementY * 0.0023;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
});
addEventListener('keydown', e => {
  keys[e.code] = true;
  if ((e.code === 'KeyE' || e.code === 'Enter') && started && !paused && !detailOpen && hovered) openDetail(hovered);
  if (e.code === 'Escape' && detailOpen) closeDetail(false);
  if (e.code === 'KeyM') drawMinimap();
});
addEventListener('keyup', e => keys[e.code] = false);
canvas.addEventListener('click', () => {
  if (!started) return;
  if (locked && !paused && !detailOpen && hovered) openDetail(hovered);
  else if (!locked && !isTouch && !paused && !detailOpen && $('helpPanel').classList.contains('hidden') && $('completeScreen').classList.contains('hidden') && $('detail').classList.contains('hidden')) canvas.requestPointerLock?.();
});
// Mobile: joystick + look drag + interact
let joyActive = false, joyId = null, joyDX = 0, joyDZ = 0, lookId = null, lookLX = 0, lookLY = 0;
const joyEl = $('joy'), knob = $('joyKnob');
joyEl.addEventListener('touchstart', e => { e.preventDefault(); const t = e.changedTouches[0]; joyActive = true; joyId = t.identifier; }, { passive: false });
joyEl.addEventListener('touchmove', e => { e.preventDefault(); for (const t of e.changedTouches) { if (t.identifier !== joyId) continue; const r = joyEl.getBoundingClientRect(); let dx = (t.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (t.clientY - (r.top + r.height / 2)) / (r.height / 2); const l = Math.hypot(dx, dy) || 1; if (l > 1) { dx /= l; dy /= l; } joyDX = dx; joyDZ = dy; knob.style.transform = 'translate(' + (dx * 28) + 'px,' + (dy * 28) + 'px)'; } }, { passive: false });
const joyEnd = e => { for (const t of e.changedTouches) { if (t.identifier === joyId) { joyActive = false; joyDX = 0; joyDZ = 0; knob.style.transform = ''; } } };
joyEl.addEventListener('touchend', joyEnd); joyEl.addEventListener('touchcancel', joyEnd);
canvas.addEventListener('touchstart', e => { for (const t of e.changedTouches) { if (t.clientX > innerWidth / 2) { lookId = t.identifier; lookLX = t.clientX; lookLY = t.clientY; } } }, { passive: true });
canvas.addEventListener('touchmove', e => { for (const t of e.changedTouches) { if (t.identifier !== lookId) continue; yaw -= (t.clientX - lookLX) * 0.005; pitch = Math.max(-1.2, Math.min(1.2, pitch - (t.clientY - lookLY) * 0.005)); lookLX = t.clientX; lookLY = t.clientY; } }, { passive: true });
canvas.addEventListener('touchend', e => { for (const t of e.changedTouches) if (t.identifier === lookId) lookId = null; });
$('btnInteract').addEventListener('click', () => { if (hovered) openDetail(hovered); });

/* ---------- GAME LOOP ---------- */
const clock = new THREE.Clock();
let lastRoom = '';
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (started && !paused && !detailOpen && !clickMode) {
    const speed = (keys['ShiftLeft'] || keys['ShiftRight']) ? 7 : 4;
    let f = 0, s = 0;
    if (keys['KeyW'] || keys['ArrowUp']) f += 1;
    if (keys['KeyS'] || keys['ArrowDown']) f -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) s += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) s -= 1;
    if (joyActive) { f -= joyDZ; s += joyDX; }
    const len = Math.hypot(f, s) || 1;
    if (f || s) {
      f /= len; s /= len;
      const sin = Math.sin(yaw), cos = Math.cos(yaw);
      player.pos.x += (-sin * f + cos * s) * speed * dt;
      player.pos.z += (-cos * f - sin * s) * speed * dt;
    }
    player.pos.x = Math.max(-21.5, Math.min(21.5, player.pos.x));
    player.pos.z = Math.max(-13.5, Math.min(13.5, player.pos.z));
    collide(player.pos);
    const r = roomOf(player.pos.x, player.pos.z);
    if (r && !save.visited.includes(r.id)) { save.visited.push(r.id); persist(); if (r.id === 'rahasia') { save.secret = true; persist(); } }
    const rn = currentRoomName();
    if (rn !== lastRoom) { lastRoom = rn; $('roomLabel').textContent = rn; }
    // hover
    camera.position.copy(player.pos);
    camera.rotation.set(0, 0, 0);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw; camera.rotation.x = pitch;
    const h = findHover();
    if ((h?.title) !== (hovered?.title)) setHover(h);
    drawMinimap();
  }
  renderer.render(scene, camera);
}
animate();
updateProgress();

/* ---------- QA API ---------- */
window.__BIBD = {
  version: 'v7-fpp',
  state: () => ({ pos: [player.pos.x, player.pos.z], room: currentRoomName(), collected: [...save.collected], visited: [...save.visited], secret: save.secret, interactables: interactables.length }),
  teleport: (roomId) => { const r = ROOMS.find(x => x.id === roomId); if (!r) return false; player.pos.set(r.cx, 1.6, r.cz); return true; },
  interactNearest: () => { const h = findHover(); if (h) { openDetail(h); return h.title; } return null; },
  openSecret: () => { openSecretDoor(); return true; },
  collectAll: () => { for (const a of ARCHIVES) if (!save.collected.includes(a.id)) save.collected.push(a.id); save.secret = true; if (!save.collected.includes(SECRET.id)) save.collected.push(SECRET.id); persist(); updateProgress(); checkComplete(); return save.collected; },
  moveForward: (d = 1) => { player.pos.x += -Math.sin(yaw) * d; player.pos.z += -Math.cos(yaw) * d; collide(player.pos); return [player.pos.x, player.pos.z]; },
  setYaw: (y) => { yaw = y; },
  setPos: (x, z) => { player.pos.set(x, 1.6, z); collide(player.pos); return [player.pos.x, player.pos.z]; },
};
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
console.log('[BIBD v7 FPP] interactables:', interactables.length, 'colliders:', colliders.length);
