import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* Data arsip — sama seperti versi sebelumnya, placeholder bersih. */
const ARSIP = [
  { id: "BIBD-001", judul: "Rapat Perdana Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "12 Jan 2026", pola: "t1", c1: "#3B2F0B", c2: "#F5C518", deskripsi: "Dokumentasi placeholder rapat perdana: pembahasan visi arsip, pembagian peran, dan foto bersama. Ganti dengan foto dan ringkasan asli kegiatan." },
  { id: "BIBD-002", judul: "Meme Rapat yang Tertib", kategori: "meme", catLabel: "Meme Bersih", tanggal: "19 Jan 2026", pola: "t2", c1: "#0E3A3A", c2: "#2DD4BF", deskripsi: "Placeholder meme bersih bertema rapat komunitas. Ganti dengan meme buatan anggota yang sopan dan layak dibagikan." },
  { id: "BIBD-003", judul: "Kerja Bakti Arsip", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Feb 2026", pola: "t3", c1: "#3B1D5E", c2: "#A78BFA", deskripsi: "Placeholder dokumentasi kerja bakti merapikan ruang arsip komunitas. Ganti dengan foto kegiatan asli dan daftar peserta." },
  { id: "BIBD-004", judul: "Infografis Alur Katalog", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Feb 2026", pola: "t4", c1: "#5E1F24", c2: "#F87171", deskripsi: "Placeholder infografis alur penomoran katalog BIBD-001 dan seterusnya. Ganti dengan dokumen atau gambar infografis asli." },
  { id: "BIBD-005", judul: "Meme Katalog Hilang", kategori: "meme", catLabel: "Meme Bersih", tanggal: "16 Feb 2026", pola: "t5", c1: "#1E3A5E", c2: "#60A5FA", deskripsi: "Placeholder meme bersih tentang arsip yang nyaris hilang katalog. Ganti dengan meme anggota yang tetap sopan." },
  { id: "BIBD-006", judul: "Kunjungan Studi Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "23 Feb 2026", pola: "t6", c1: "#3A2A0E", c2: "#FB923C", deskripsi: "Placeholder dokumentasi kunjungan studi ke ruang arsip lain. Ganti dengan foto dan catatan hasil kunjungan asli." },
  { id: "BIBD-007", judul: "Nonton Bareng Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Mar 2026", pola: "t7", c1: "#23401F", c2: "#4ADE80", deskripsi: "Placeholder dokumentasi acara nonton bareng anggota komunitas. Ganti dengan foto suasana dan daftar hadir asli." },
  { id: "BIBD-008", judul: "Panduan Contributor Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Mar 2026", pola: "t8", c1: "#4A1533", c2: "#F472B6", deskripsi: "Placeholder panduan cara anggota mengirim arsip baru ke kurator. Ganti dengan dokumen panduan asli komunitas." }
];

const NILAI = [
  { judul: "Tertib", warna: "#F5C518", teks: "Setiap arsip melewati kurasi dan penomoran katalog sebelum tampil di album. Tanpa nomor katalog, arsip tidak dipajang." },
  { judul: "Terdokumentasi", warna: "#2DD4BF", teks: "Kegiatan, tanggal, dan kategori tercatat — tidak ada arsip yang tercecer. Semua bisa ditelusuri kembali lewat katalog." },
  { judul: "Komunitas", warna: "#A78BFA", teks: "Ruang yang sopan dan inklusif; semua konten bersih dan layak dibagikan ke siapa pun." }
];

const KETUA = {
  nama: "Fairuz", jabatan: "Ketua BIBD",
  bio: "Fairuz memimpin BIBD dengan fokus pada kerapian arsip dan kelancaran kegiatan komunitas. Ia mengkurasi setiap dokumentasi yang masuk, memastikan album tersusun rapi per katalog, dan menjaga suasana komunitas tetap sopan serta inklusif bagi semua anggota.",
  tugas: ["Kurasi Arsip — menyeleksi & mengkatalog setiap arsip.", "Koordinasi Kegiatan — mengatur jadwal dan dokumentasi.", "Jaga Ketertiban Arsip — menegakkan standar konten bersih."],
  quote: "Arsip yang tertib membuat kenangan komunitas mudah ditemukan dan selalu layak dibagikan."
};

let activeFilter = "semua";
let query = "";
let lastFocus = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ---------- util ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function icons() { if (window.lucide) window.lucide.createIcons(); }
function visibleArsip() {
  const q = query.trim().toLowerCase();
  return ARSIP.filter((a) => (activeFilter === "semua" || a.kategori === activeFilter) && (!q || a.judul.toLowerCase().includes(q)));
}

/* ---------- modal (DOM overlay) ---------- */
function openModalArsip(id) {
  const a = ARSIP.find((x) => x.id === id);
  if (!a) return;
  lastFocus = document.activeElement;
  document.getElementById("modalKatalog").textContent = "KATALOG " + a.id + " / " + a.catLabel.toUpperCase();
  document.getElementById("modalTitle").textContent = a.judul;
  document.getElementById("modalMeta").textContent = a.tanggal + " — " + a.catLabel;
  document.getElementById("modalDesc").textContent = a.deskripsi;
  document.getElementById("modalThumb").className = "modal-thumb thumb " + a.pola;
  document.getElementById("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}
function openModalKetua() {
  lastFocus = document.activeElement;
  document.getElementById("modalKatalog").textContent = "PROFIL KETUA BIBD";
  document.getElementById("modalTitle").textContent = KETUA.nama + " — " + KETUA.jabatan;
  document.getElementById("modalMeta").textContent = "Penanggung jawab arsip & kegiatan komunitas";
  document.getElementById("modalDesc").textContent = KETUA.bio + " " + KETUA.tugas.join(" ") + " \"" + KETUA.quote + "\"";
  document.getElementById("modalThumb").className = "modal-thumb thumb t1";
  document.getElementById("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}
function openModalNilai(i) {
  const n = NILAI[i];
  if (!n) return;
  lastFocus = document.activeElement;
  document.getElementById("modalKatalog").textContent = "NILAI BIBD";
  document.getElementById("modalTitle").textContent = n.judul;
  document.getElementById("modalMeta").textContent = "Tiga monolit nilai komunitas";
  document.getElementById("modalDesc").textContent = n.teks;
  document.getElementById("modalThumb").className = "modal-thumb thumb t3";
  document.getElementById("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}
function closeModal() {
  document.getElementById("modalBackdrop").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ---------- fallback grid 2D ---------- */
function catIcon(k) { return k === "kegiatan" ? "calendar-days" : k === "meme" ? "laugh" : "file-text"; }
function renderFallback() {
  const grid = document.getElementById("albumGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");
  const hasil = visibleArsip();
  count.textContent = "Menampilkan " + hasil.length + " dari " + ARSIP.length + " arsip";
  empty.hidden = hasil.length !== 0;
  grid.innerHTML = "";
  hasil.forEach((a) => {
    const card = document.createElement("article");
    card.className = "album-card";
    card.innerHTML =
      '<div class="thumb ' + esc(a.pola) + '" role="img" aria-label="Placeholder ' + esc(a.judul) + '">' +
      '<span class="katalog">' + esc(a.id) + '</span></div>' +
      '<div class="album-body">' +
      '<span class="cat"><i data-lucide="' + esc(catIcon(a.kategori)) + '"></i>' + esc(a.catLabel) + "</span>" +
      "<h3>" + esc(a.judul) + "</h3>" +
      '<p class="album-date"><i data-lucide="calendar"></i>' + esc(a.tanggal) + "</p>" +
      '<button class="detail-btn" data-id="' + esc(a.id) + '"><i data-lucide="eye"></i>Lihat Detail</button>' +
      "</div>";
    grid.appendChild(card);
  });
  icons();
}
function updateCountOnly() {
  const hasil = visibleArsip();
  document.getElementById("resultCount").textContent = "Menampilkan " + hasil.length + " dari " + ARSIP.length + " arsip";
  document.getElementById("emptyState").hidden = hasil.length !== 0;
}

/* ---------- tekstur kanvas ---------- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(" ");
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; }
    else line = t;
  }
  ctx.fillText(line, x, y);
  return y;
}
function polaDasar(ctx, W, H, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,.20)"; ctx.lineWidth = 2;
  for (let i = 0; i < W; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  for (let j = 0; j < H; j += 64) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }
  ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(0, 0, W, H);
}
function texKartu(a) {
  const W = 512, H = 720;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  polaDasar(ctx, W, H, a.c1, a.c2);
  ctx.fillStyle = "rgba(0,0,0,.55)";
  roundRect(ctx, 28, 28, 200, 52, 12); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "700 30px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText(a.id, 52, 63);
  ctx.fillStyle = "#F5C518";
  ctx.beginPath(); ctx.arc(W - 76, 76, 44, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1A1405"; ctx.font = "900 44px Georgia,serif";
  ctx.fillText(a.judul.trim()[0] || "B", W - 92, 92);
  ctx.fillStyle = "#F5C518"; ctx.font = "700 26px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText(a.catLabel.toUpperCase(), 40, H - 170);
  ctx.fillStyle = "#fff"; ctx.font = "900 44px Georgia,serif";
  wrapText(ctx, a.judul, 40, H - 120, W - 80, 50);
  ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.font = "500 26px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText(a.tanggal, 40, H - 40);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function texHero() {
  const W = 1024, H = 512;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#11161F"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#F5C518"; ctx.lineWidth = 6; ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.setLineDash([14, 10]); ctx.strokeStyle = "#2A3447"; ctx.lineWidth = 3; ctx.strokeRect(44, 44, W - 88, H - 88);
  ctx.setLineDash([]);
  ctx.fillStyle = "#6E7890"; ctx.font = "700 30px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText("DOSSIER No. BIBD-2026  ·  KLASIFIKASI: TERBUKA", 70, 110);
  ctx.fillStyle = "#F5C518"; ctx.font = "900 190px Georgia,serif";
  ctx.fillText("BIBD", 64, 320);
  ctx.fillStyle = "#F2EFE6"; ctx.font = "700 52px Georgia,serif";
  ctx.fillText("Ruang Arsip Komunitas", 70, 400);
  ctx.fillStyle = "#A7B0C0"; ctx.font = "500 30px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText("Seret untuk mengorbit · Klik kartu untuk membuka dossier", 70, 452);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function texKetua() {
  const W = 512, H = 640;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  polaDasar(ctx, W, H, "#3B2F0B", "#8a6d10");
  ctx.fillStyle = "#F5C518"; ctx.beginPath(); ctx.arc(W / 2, 190, 110, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1A1405"; ctx.font = "900 140px Georgia,serif"; ctx.textAlign = "center";
  ctx.fillText("F", W / 2, 240);
  ctx.fillStyle = "#fff"; ctx.font = "900 64px Georgia,serif";
  ctx.fillText("Fairuz", W / 2, 400);
  ctx.fillStyle = "#F5C518"; ctx.font = "700 32px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText("KETUA BIBD", W / 2, 448);
  ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.font = "500 28px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText("Klik untuk profil lengkap", W / 2, 560);
  ctx.textAlign = "left";
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function texPlakat(baris1, baris2) {
  const W = 512, H = 192;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#151B27"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#F5C518"; ctx.lineWidth = 5; ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.fillStyle = "#F5C518"; ctx.font = "700 34px 'Plus Jakarta Sans',sans-serif";
  ctx.fillText(baris1, 36, 80);
  ctx.fillStyle = "#A7B0C0"; ctx.font = "500 28px 'Plus Jakarta Sans',sans-serif";
  wrapText(ctx, baris2, 36, 128, W - 72, 36);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function texMonolit(n) {
  const W = 512, H = 768;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#151B27"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = n.warna; ctx.fillRect(0, 0, W, 26); ctx.fillRect(0, H - 26, W, 26);
  ctx.fillStyle = "#fff"; ctx.font = "900 72px Georgia,serif"; ctx.textAlign = "center";
  wrapText(ctx, n.judul, W / 2, 330, W - 80, 78);
  ctx.fillStyle = "#A7B0C0"; ctx.font = "500 30px 'Plus Jakarta Sans',sans-serif";
  ctx.textAlign = "left";
  wrapText(ctx, n.teks, 48, 430, W - 96, 42);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- scene 3D ---------- */
const ZONES = {
  beranda: { pos: [0, 2.8, 13], tgt: [0, 1.4, 0] },
  album: { pos: [0, 0.6, 10], tgt: [0, 0.3, 0] },
  ketua: { pos: [13, 2.6, 9], tgt: [13, 1.2, 0] },
  tentang: { pos: [-13, 2.4, 9], tgt: [-13, 1.0, 0] }
};
let renderer = null, scene = null, camera = null, controls = null;
let cardMeshes = [];
let klikTargets = [];
let camTween = null;
let autoRotateIdle = null;

function fail3D(pesan) {
  document.getElementById("loader").hidden = true;
  document.getElementById("webglFail").hidden = false;
  if (pesan) console.warn("[BIBD-3D]", pesan);
  document.getElementById("albumGrid").hidden = false;
  renderFallback();
}

function zoneTo(nama) {
  const z = ZONES[nama];
  if (!z) return;
  if (!camera || !controls) {
    document.getElementById(nama)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    return;
  }
  camTween = {
    t: 0,
    dur: reducedMotion ? 0.01 : 1.25,
    p0: camera.position.clone(), p1: new THREE.Vector3(...z.pos),
    t0: controls.target.clone(), t1: new THREE.Vector3(...z.tgt)
  };
}

function applyFilter3D() {
  updateCountOnly();
  const hasil = visibleArsip();
  const ids = new Set(hasil.map((a) => a.id));
  const gridX = [-4.05, -1.35, 1.35, 4.05];
  let vi = 0;
  cardMeshes.forEach((m) => {
    const on = ids.has(m.userData.arsipId);
    if (on) {
      const cx = gridX[vi % 4], cy = vi < 4 ? 2.0 : -1.6;
      m.userData.target = new THREE.Vector3(cx, cy, 0);
      m.userData.targetScale = m.userData.hovered ? 1.1 : 1.0;
      vi++;
    } else {
      m.userData.target = new THREE.Vector3(m.userData.home.x, m.userData.home.y, -7);
      m.userData.targetScale = 0.001;
    }
  });
}

function initScene() {
  const stage = document.getElementById("stage3d");
  renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0b0e14, 1);
  if (!isMobile) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  stage.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0e14, 0.028);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(...ZONES.beranda.pos);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...ZONES.beranda.tgt);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 4; controls.maxDistance = 26;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.55;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    if (autoRotateIdle) clearTimeout(autoRotateIdle);
  });
  controls.addEventListener("end", () => {
    if (autoRotateIdle) clearTimeout(autoRotateIdle);
    if (!reducedMotion) autoRotateIdle = setTimeout(() => { controls.autoRotate = true; }, 4000);
  });

  /* cahaya lentera dossier */
  scene.add(new THREE.HemisphereLight(0xf2efe6, 0x11161f, 0.55));
  const dir = new THREE.DirectionalLight(0xfff2cf, 1.1);
  dir.position.set(6, 12, 8);
  if (!isMobile) { dir.castShadow = true; dir.shadow.mapSize.set(1024, 1024); }
  scene.add(dir);
  const lentera = new THREE.PointLight(0xf5c518, 60, 40, 2);
  lentera.position.set(0, 5.5, 5);
  scene.add(lentera);
  const isiKetua = new THREE.PointLight(0xf5c518, 30, 20, 2);
  isiKetua.position.set(13, 4, 4);
  scene.add(isiKetua);

  /* lantai */
  const lantai = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 40),
    new THREE.ShadowMaterial({ opacity: 0.35 })
  );
  lantai.rotation.x = -Math.PI / 2;
  lantai.position.y = -3.4;
  lantai.receiveShadow = true;
  scene.add(lantai);
  const alas = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 40),
    new THREE.MeshStandardMaterial({ color: 0x0d1119, roughness: 1 })
  );
  alas.rotation.x = -Math.PI / 2;
  alas.position.y = -3.42;
  scene.add(alas);

  /* debu arsip */
  const N = isMobile ? 150 : 350;
  const pg = new THREE.BufferGeometry();
  const pp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pp[i * 3] = (Math.random() - 0.5) * 60;
    pp[i * 3 + 1] = Math.random() * 14 - 3;
    pp[i * 3 + 2] = (Math.random() - 0.5) * 26;
  }
  pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
  const debu = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xf5c518, size: 0.045, transparent: true, opacity: 0.55 }));
  debu.userData.debu = true;
  scene.add(debu);

  /* papan hero */
  const hero = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 4.4, 0.25),
    new THREE.MeshStandardMaterial({ map: texHero(), roughness: 0.7 })
  );
  hero.position.set(0, 5.6, -2.5);
  scene.add(hero);

  /* 8 kartu album */
  const gridX = [-4.05, -1.35, 1.35, 4.05];
  ARSIP.forEach((a, i) => {
    const tex = texKartu(a);
    const depan = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, transparent: true });
    const sisi = new THREE.MeshStandardMaterial({ color: 0x1b2333, roughness: 0.8, transparent: true });
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.0, 0.18), [sisi, sisi, sisi, sisi, depan, sisi]);
    const hx = gridX[i % 4], hy = i < 4 ? 2.0 : -1.6;
    m.position.set(hx, hy, 0);
    m.castShadow = !isMobile;
    m.userData = { type: "arsip", arsipId: a.id, judul: a.judul, home: new THREE.Vector3(hx, hy, 0), target: new THREE.Vector3(hx, hy, 0), targetScale: 1, hovered: false };
    scene.add(m);
    cardMeshes.push(m);
    klikTargets.push(m);
  });

  /* pedestal ketua */
  const gKetua = new THREE.Group();
  gKetua.position.set(13, 0, 0);
  const alasK = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.5, 28), new THREE.MeshStandardMaterial({ color: 0x1b2333, roughness: 0.8 }));
  alasK.position.y = -3.1; alasK.receiveShadow = true;
  gKetua.add(alasK);
  const tiang = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 1.6, 28), new THREE.MeshStandardMaterial({ color: 0x242e44, roughness: 0.75 }));
  tiang.position.y = -2.0; tiang.castShadow = !isMobile;
  gKetua.add(tiang);
  const kartuK = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.3, 0.2), new THREE.MeshStandardMaterial({ map: texKetua(), roughness: 0.65 }));
  kartuK.position.y = 1.2; kartuK.castShadow = !isMobile;
  kartuK.userData = { type: "ketua" };
  gKetua.add(kartuK);
  klikTargets.push(kartuK);
  const plakat = [
    ["Kurasi Arsip", "Menyeleksi & mengkatalog arsip."],
    ["Koordinasi", "Jadwal & dokumentasi kegiatan."],
    ["Ketertiban", "Standar konten bersih."]
  ];
  plakat.forEach((p, i) => {
    const pl = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 0.12), new THREE.MeshStandardMaterial({ map: texPlakat(p[0], p[1]), roughness: 0.7 }));
    const ang = (i - 1) * 0.62;
    pl.position.set(Math.sin(ang) * 3.4, -0.6 + (i === 1 ? 0.5 : 0), Math.cos(ang) * 3.2 - 0.6);
    pl.lookAt(13, -0.4, 8);
    pl.userData = { type: "ketua" };
    scene.add(pl);
    const w = new THREE.Group();
    void w;
    pl.position.x += 13;
    klikTargets.push(pl);
  });
  scene.add(gKetua);

  /* 3 monolit tentang */
  const dasarX = -13;
  NILAI.forEach((n, i) => {
    const mono = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.6, 2.3), new THREE.MeshStandardMaterial({ map: texMonolit(n), roughness: 0.7 }));
    mono.position.set(dasarX + (i - 1) * 3.1, 0.2, 0);
    mono.castShadow = !isMobile;
    mono.userData = { type: "nilai", index: i, judul: n.judul };
    scene.add(mono);
    klikTargets.push(mono);
    const fond = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.3, 2.7), new THREE.MeshStandardMaterial({ color: 0x1b2333 }));
    fond.position.set(dasarX + (i - 1) * 3.1, -1.75, 0);
    scene.add(fond);
  });

  /* raycaster klik + hover */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  const tip = document.getElementById("tip3d");
  let downAt = 0;
  function setPtr(e) {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  renderer.domElement.addEventListener("pointermove", (e) => {
    setPtr(e);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(klikTargets, false)[0];
    cardMeshes.forEach((m) => { m.userData.hovered = hit && hit.object === m; });
    if (hit) {
      const u = hit.object.userData;
      const label = u.type === "arsip" ? u.judul : u.type === "ketua" ? "Fairuz — Ketua BIBD" : NILAI[u.index]?.judul || "";
      tip.textContent = label;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
      tip.hidden = false;
      renderer.domElement.style.cursor = "pointer";
    } else {
      tip.hidden = true;
      renderer.domElement.style.cursor = "grab";
    }
  });
  renderer.domElement.addEventListener("pointerdown", () => { downAt = Date.now(); });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (Date.now() - downAt > 350) return; /* itu drag orbit, bukan klik */
    setPtr(e);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(klikTargets, false)[0];
    if (!hit) return;
    const u = hit.object.userData;
    if (u.type === "arsip") openModalArsip(u.arsipId);
    else if (u.type === "ketua") openModalKetua();
    else if (u.type === "nilai") openModalNilai(u.index);
  });

  /* resize */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* loop */
  const jam = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(jam.getDelta(), 0.05);
    const t = jam.elapsedTime;
    /* tween kamera sinematik */
    if (camTween) {
      camTween.t += dt / camTween.dur;
      const k = Math.min(camTween.t, 1);
      const e = 1 - Math.pow(1 - k, 3);
      camera.position.lerpVectors(camTween.p0, camTween.p1, e);
      controls.target.lerpVectors(camTween.t0, camTween.t1, e);
      if (k >= 1) camTween = null;
    }
    /* kartu: lerp posisi + skala + layang */
    cardMeshes.forEach((m, i) => {
      m.position.lerp(m.userData.target, 1 - Math.pow(0.001, dt));
      const sT = m.userData.hovered ? Math.max(m.userData.targetScale, 1.1) : m.userData.targetScale;
      const s = THREE.MathUtils.lerp(m.currentScale ?? 1, sT, 1 - Math.pow(0.002, dt));
      m.currentScale = s;
      m.scale.setScalar(Math.max(s, 0.001));
      m.visible = s > 0.02;
      if (!reducedMotion && m.visible) m.position.y += Math.sin(t * 1.2 + i * 0.9) * 0.0016;
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, (m.userData.hovered ? 0.18 : Math.sin(t * 0.4 + i) * 0.06), 0.08);
    });
    /* debu melayang */
    scene.traverse((o) => {
      if (o.userData.debu && !reducedMotion) { o.rotation.y += dt * 0.014; o.position.y = Math.sin(t * 0.18) * 0.35; }
    });
    controls.update();
    renderer.render(scene, camera);
  }
  loop();
  document.getElementById("loader").hidden = true;
  applyFilter3D();
}

/* ---------- wiring DOM ---------- */
function wireDOM() {
  document.querySelectorAll("[data-zone]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const z = el.getAttribute("data-zone");
      if (el.tagName === "BUTTON" || el.getAttribute("href")?.startsWith("#")) e.preventDefault();
      zoneTo(z);
      const sec = document.getElementById(z === "beranda" ? "beranda" : z);
      sec?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      document.getElementById("navMenu").classList.remove("open");
      document.getElementById("navToggle").setAttribute("aria-expanded", "false");
    });
  });
  document.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      activeFilter = btn.getAttribute("data-filter");
      applyFilter3D();
      renderFallback();
    });
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); } });
  });
  document.getElementById("searchInput").addEventListener("input", (e) => {
    query = e.target.value;
    applyFilter3D();
    renderFallback();
  });
  document.getElementById("albumGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".detail-btn");
    if (btn) openModalArsip(btn.getAttribute("data-id"));
  });
  document.getElementById("openKetuaBtn").addEventListener("click", openModalKetua);
  document.querySelectorAll(".nilai-card").forEach((el) => {
    const buka = () => openModalNilai(Number(el.getAttribute("data-nilai")));
    el.addEventListener("click", buka);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buka(); } });
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
  document.getElementById("modalBackdrop").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = Array.from(document.querySelectorAll('#modalBackdrop button, #modalBackdrop [href], #modalBackdrop input')).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("modalBackdrop").hidden) closeModal();
  });
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  /* Mode 2D */
  const m2 = document.getElementById("mode2dBtn");
  m2.addEventListener("click", () => {
    const aktif = m2.getAttribute("aria-pressed") === "true";
    m2.setAttribute("aria-pressed", String(!aktif));
    m2.querySelector("span").textContent = !aktif ? "Mode 3D" : "Mode 2D";
    document.getElementById("stage3d").classList.toggle("hidden2d", !aktif);
    document.getElementById("albumGrid").hidden = aktif && document.getElementById("webglFail").hidden;
    if (!aktif) renderFallback();
    else if (document.getElementById("webglFail").hidden) document.getElementById("albumGrid").hidden = true;
  });
}

/* ---------- boot ---------- */
wireDOM();
updateCountOnly();
icons();
try {
  if (!window.WebGLRenderingContext) throw new Error("WebGL tidak didukung");
  initScene();
} catch (err) {
  fail3D(err && err.message);
}

/* API untuk QA otomatis */
window.__BIBD = {
  ARSIP, NILAI,
  visibleCount: () => visibleArsip().length,
  visibleIds: () => visibleArsip().map((a) => a.id),
  applyFilter: (kat, q) => { activeFilter = kat; query = q || ""; applyFilter3D(); renderFallback(); },
  openArsip: openModalArsip, openKetua: openModalKetua, openNilai: openModalNilai,
  zoneTo, cardCount: () => cardMeshes.length,
  webglOK: () => !!renderer
};
