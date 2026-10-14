import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* Data arsip — placeholder bersih, konten tetap. Hanya akronim BIBD. */
const ARSIP = [
  { id: "BIBD-001", judul: "Rapat Perdana Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "12 Jan 2026", pola: "t1", deskripsi: "Dokumentasi placeholder rapat perdana: pembahasan visi arsip, pembagian peran, dan foto bersama. Ganti dengan foto dan ringkasan asli kegiatan." },
  { id: "BIBD-002", judul: "Meme Rapat yang Tertib", kategori: "meme", catLabel: "Meme Bersih", tanggal: "19 Jan 2026", pola: "t2", deskripsi: "Placeholder meme bersih bertema rapat komunitas. Ganti dengan meme buatan anggota yang sopan dan layak dibagikan." },
  { id: "BIBD-003", judul: "Kerja Bakti Arsip", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Feb 2026", pola: "t3", deskripsi: "Placeholder dokumentasi kerja bakti merapikan ruang arsip komunitas. Ganti dengan foto kegiatan asli dan daftar peserta." },
  { id: "BIBD-004", judul: "Infografis Alur Katalog", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Feb 2026", pola: "t4", deskripsi: "Placeholder infografis alur penomoran katalog BIBD-001 dan seterusnya. Ganti dengan dokumen atau gambar infografis asli." },
  { id: "BIBD-005", judul: "Meme Katalog Hilang", kategori: "meme", catLabel: "Meme Bersih", tanggal: "16 Feb 2026", pola: "t5", deskripsi: "Placeholder meme bersih tentang arsip yang nyaris hilang katalog. Ganti dengan meme anggota yang tetap sopan." },
  { id: "BIBD-006", judul: "Kunjungan Studi Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "23 Feb 2026", pola: "t6", deskripsi: "Placeholder dokumentasi kunjungan studi ke ruang arsip lain. Ganti dengan foto dan catatan hasil kunjungan asli." },
  { id: "BIBD-007", judul: "Nonton Bareng Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Mar 2026", pola: "t7", deskripsi: "Placeholder dokumentasi acara nonton bareng anggota komunitas. Ganti dengan foto suasana dan daftar hadir asli." },
  { id: "BIBD-008", judul: "Panduan Contributor Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Mar 2026", pola: "t8", deskripsi: "Placeholder panduan cara anggota mengirim arsip baru ke kurator. Ganti dengan dokumen panduan asli komunitas." }
];

const STATS = [
  { angka: "24", label: "Arsip" },
  { angka: "12", label: "Anggota" },
  { angka: "6", label: "Kegiatan" },
  { angka: "1", label: "Ketua" }
];

const KETUA = {
  nama: "Fairuz", jabatan: "Ketua BIBD",
  tugas: ["Kurasi Arsip — menyeleksi dan mengkatalog setiap arsip.", "Koordinasi Kegiatan — mengatur jadwal dan dokumentasi.", "Jaga Ketertiban — menegakkan standar konten bersih."],
  quote: "Arsip yang tertib membuat kenangan komunitas mudah ditemukan dan selalu layak dibagikan."
};

let activeFilter = "semua";
let query = "";
let lastFocus = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
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

/* ---------- statistik ---------- */
function renderStats() {
  const grid = document.getElementById("statsGrid");
  grid.innerHTML = STATS.map((s) =>
    '<div><p class="stat-num">' + esc(s.angka) + '</p><p class="stat-label">' + esc(s.label) + "</p></div>"
  ).join("");
}

/* ---------- album ---------- */
function renderAlbum() {
  const grid = document.getElementById("albumGrid");
  const empty = document.getElementById("emptyState");
  const hasil = visibleArsip();
  document.getElementById("resultCount").textContent = "Menampilkan " + hasil.length + " dari " + ARSIP.length + " arsip";
  empty.hidden = hasil.length !== 0;
  grid.innerHTML = "";
  hasil.forEach((a) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "album-card reveal is-visible";
    card.setAttribute("data-id", a.id);
    card.setAttribute("aria-label", "Buka detail " + a.judul);
    card.innerHTML =
      '<span class="thumb ' + esc(a.pola) + '" aria-hidden="true"><span class="katalog">' + esc(a.id) + "</span></span>" +
      '<span class="album-body"><span class="cat">' + esc(a.catLabel) + "</span>" +
      "<h3>" + esc(a.judul) + "</h3>" +
      '<span class="album-date">' + esc(a.tanggal) + "</span></span>";
    card.addEventListener("click", () => openArsip(a.id));
    grid.appendChild(card);
  });
  attachTilt(grid);
}

/* Tilt 3D halus pada kartu (maks 6 derajat, pointer halus saja). */
function attachTilt(grid) {
  if (!finePointer || reducedMotion) return;
  grid.querySelectorAll(".album-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateZ(6px)";
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

/* ---------- modal ---------- */
function openModal(katalog, judul, meta, deskripsi, pola) {
  lastFocus = document.activeElement;
  document.getElementById("modalKatalog").textContent = katalog;
  document.getElementById("modalTitle").textContent = judul;
  document.getElementById("modalMeta").textContent = meta;
  document.getElementById("modalDesc").textContent = deskripsi;
  document.getElementById("modalThumb").className = "modal-thumb thumb " + pola;
  document.getElementById("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}
function openArsip(id) {
  const a = ARSIP.find((x) => x.id === id);
  if (!a) return;
  openModal("KATALOG " + a.id + " / " + a.catLabel.toUpperCase(), a.judul, a.tanggal + " — " + a.catLabel, a.deskripsi, a.pola);
}
function openKetua() {
  openModal("PROFIL KETUA BIBD", KETUA.nama + " — " + KETUA.jabatan,
    "Penanggung jawab arsip dan kegiatan komunitas",
    KETUA.tugas.join(" ") + " " + KETUA.quote, "t1");
}
function closeModal() {
  document.getElementById("modalBackdrop").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ---------- reveal saat scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".feature-card.reveal").forEach((el) => io.observe(el));
}

/* ---------- TEKSTUR ---------- */
function labelTexture() {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 384;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#E8E8ED"; ctx.fillRect(0, 0, 512, 384);
  ctx.strokeStyle = "#C7C7CC"; ctx.lineWidth = 6; ctx.strokeRect(24, 24, 464, 336);
  ctx.fillStyle = "#1D1D1F"; ctx.font = "800 120px Inter, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("BIBD", 256, 200);
  ctx.fillStyle = "#6E6E73"; ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText("ARSIP KOMUNITAS", 256, 262);
  ctx.fillStyle = "#0071E3"; ctx.beginPath(); ctx.arc(256, 310, 14, 0, Math.PI * 2); ctx.fill();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function fTexture() {
  const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#E8E8ED"; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#0071E3"; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(128, 128, 92, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#1D1D1F"; ctx.font = "800 130px Inter, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("F", 128, 178);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- HERO 3D: product viewer studio ---------- */
let heroState = { progress: 0, renderer: null, ok: false, still: false };
let ketuaState = { renderer: null, ok: false };

function heroProgress() {
  const viewer = document.getElementById("heroViewer");
  const stickyH = window.innerHeight - 60;
  const total = viewer.offsetHeight - stickyH;
  if (total <= 0) return 0;
  const scrolled = Math.min(Math.max(-viewer.getBoundingClientRect().top, 0), total);
  return scrolled / total;
}
function updateSteps(p) {
  const idx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
  document.querySelectorAll("#viewerSteps li").forEach((li) => {
    li.classList.toggle("is-active", Number(li.getAttribute("data-step")) === idx);
  });
}

function initHero3D() {
  const mount = document.getElementById("viewerCanvas");
  const loading = document.getElementById("viewerLoading");
  const fallback = document.getElementById("viewerFallback");
  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  mount.appendChild(renderer.domElement);
  heroState.renderer = renderer;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 60);
  camera.position.set(0, 2.4, 8.2);
  camera.lookAt(0, 0.1, 0);

  /* Pencahayaan studio lembut — tanpa fog, tanpa partikel. */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8de, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdceBff, 0.4);
  fill.position.set(-5, 3, -3);
  scene.add(fill);

  /* Bayangan lembut di bawah objek. */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.ShadowMaterial({ opacity: 0.14 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.15;
  ground.receiveShadow = true;
  scene.add(ground);

  /* Kotak dossier premium: badan + tutup berengsel + halaman + label. */
  const group = new THREE.Group();
  scene.add(group);
  const matBody = new THREE.MeshStandardMaterial({ color: 0xdcdce0, roughness: 0.55, metalness: 0.05 });
  const matPage = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

  const body = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.55, 2.5, 4, 0.1), matBody);
  body.castShadow = true; body.receiveShadow = true;
  group.add(body);

  const pages = [];
  for (let i = 0; i < 3; i++) {
    const pg = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.09, 2.1), matPage);
    pg.position.y = 0.32 + i * 0.11;
    pg.castShadow = true;
    group.add(pg);
    pages.push(pg);
  }

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.32, -1.25);
  group.add(lidPivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.16, 2.5, 4, 0.07), matBody.clone());
  lid.position.set(0, 0.06, 1.25);
  lid.castShadow = true;
  lidPivot.add(lid);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.42),
    new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.6 })
  );
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, 0.145, 1.25);
  lidPivot.add(label);
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(3.44, 0.5, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x0071e3, roughness: 0.5 })
  );
  band.position.set(0, 0, 0);
  group.add(band);

  /* Parallax mouse halus. */
  let mx = 0, my = 0, cx = 0, cy = 0;
  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let visible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(mount);

  const clock = new THREE.Clock();
  let firstFrame = true;
  function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || heroState.still) return;
    const t = clock.getElapsedTime();
    const p = ease(THREE.MathUtils.clamp(heroProgress(), 0, 1));
    heroState.progress = p;
    updateSteps(p);

    cx += (mx - cx) * 0.04;
    cy += (my - cy) * 0.04;
    const sway = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.05;
    group.rotation.y = -0.55 + p * Math.PI * 0.75 + sway + cx * 0.12;
    group.rotation.x = cy * 0.06;
    lidPivot.rotation.x = -p * 1.85;
    pages.forEach((pg, i) => { pg.rotation.y = p * (i - 1) * 0.1; });
    camera.position.y = 2.4 + p * 0.8;
    camera.position.x = cx * 0.3;
    camera.lookAt(0, 0.1, 0);

    const w = mount.clientWidth, h = mount.clientHeight;
    if (renderer.domElement.width !== Math.floor(w * renderer.getPixelRatio())) {
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; loading.hidden = true; heroState.ok = true; }
  }
  frame();

  window.addEventListener("resize", () => {
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
  });
  window.addEventListener("scroll", () => {
    heroState.progress = heroProgress();
    updateSteps(heroState.progress);
  }, { passive: true });

  return { scene, camera, renderer, group };
}

/* ---------- AVATAR 3D KETUA: kubus lembut studio ---------- */
function initKetua3D() {
  const mount = document.getElementById("ketuaCanvas");
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    ketuaState.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.1, 40);
    camera.position.set(0, 0.6, 6.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333338, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2997ff, 0.5);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.3 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.35;
    ground.receiveShadow = true;
    scene.add(ground);

    const cube = new THREE.Mesh(
      new RoundedBoxGeometry(1.9, 1.9, 1.9, 4, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xe8e8ed, roughness: 0.5 })
    );
    cube.castShadow = true;
    scene.add(cube);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshStandardMaterial({ map: fTexture(), roughness: 0.55 })
    );
    face.position.z = 0.96;
    scene.add(face);
    const avatar = new THREE.Group();
    avatar.add(cube); avatar.add(face);
    scene.add(avatar);

    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(mount);
    const clock = new THREE.Clock();
    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        avatar.rotation.y = t * 0.4;
        avatar.rotation.x = Math.sin(t * 0.5) * 0.08;
        avatar.position.y = Math.sin(t * 0.9) * 0.08;
      }
      renderer.render(scene, camera);
    }
    frame();
    ketuaState.ok = true;
  } catch (err) {
    console.warn("[BIBD-3D] avatar ketua gagal:", err && err.message);
  }
}

/* ---------- wiring ---------- */
function wireDOM() {
  document.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      activeFilter = btn.getAttribute("data-filter");
      renderAlbum();
    });
  });
  document.getElementById("albumSearch").addEventListener("input", (e) => {
    query = e.target.value;
    renderAlbum();
  });
  document.getElementById("ketuaDetailBtn").addEventListener("click", openKetua);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
  document.getElementById("modalBackdrop").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = Array.from(document.querySelectorAll("#modalBackdrop button")).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("modalBackdrop").hidden) closeModal();
  });
}

/* ---------- boot ---------- */
renderStats();
renderAlbum();
wireDOM();
initReveal();
icons();
try {
  if (!window.WebGLRenderingContext) throw new Error("WebGL tidak didukung");
  initHero3D();
  initKetua3D();
} catch (err) {
  console.warn("[BIBD-3D]", err && err.message);
  document.getElementById("viewerLoading").hidden = true;
  document.getElementById("viewerFallback").hidden = false;
}

/* API untuk QA otomatis */
window.__BIBD = {
  ARSIP,
  visibleCount: () => visibleArsip().length,
  visibleIds: () => visibleArsip().map((a) => a.id),
  applyFilter: (kat, q) => { activeFilter = kat; query = q || ""; renderAlbum(); },
  openArsip, openKetua,
  heroProgress: () => heroState.progress,
  still: () => { heroState.still = true; },
  webglOK: () => heroState.ok
};
