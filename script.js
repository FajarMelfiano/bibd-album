/* Three.js dimuat dinamis agar UI tetap jalan saat CDN gagal/offline. */
let THREE = null, RoundedBoxGeometry = null, threeOK = false;
async function loadThree() {
  if (THREE || threeOK === false && THREE === false) return threeOK;
  try {
    THREE = await import("three");
    ({ RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js"));
    threeOK = true;
  } catch (err) {
    console.warn("[BIBD-3D] CDN three gagal, mode tanpa-3D:", err && err.message);
    THREE = false; threeOK = false;
  }
  return threeOK;
}

/* ============ DATA ============ */
const ARSIP = [
  { id: "BIBD-001", judul: "Rapat Perdana Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "12 Jan 2026", ts: Date.parse("2026-01-12"), bulan: "Jan", pola: "t1", tags: ["rapat", "perdana"], deskripsi: "Dokumentasi placeholder rapat perdana: pembahasan visi arsip, pembagian peran, dan foto bersama. Ganti dengan foto dan ringkasan asli kegiatan." },
  { id: "BIBD-002", judul: "Meme Rapat yang Tertib", kategori: "meme", catLabel: "Meme Bersih", tanggal: "19 Jan 2026", ts: Date.parse("2026-01-19"), bulan: "Jan", pola: "t2", tags: ["meme", "rapat"], deskripsi: "Placeholder meme bersih bertema rapat komunitas. Ganti dengan meme buatan anggota yang sopan dan layak dibagikan." },
  { id: "BIBD-003", judul: "Kerja Bakti Arsip", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Feb 2026", ts: Date.parse("2026-02-02"), bulan: "Feb", pola: "t3", tags: ["gotong-royong", "arsip"], deskripsi: "Placeholder dokumentasi kerja bakti merapikan ruang arsip komunitas. Ganti dengan foto kegiatan asli dan daftar peserta." },
  { id: "BIBD-004", judul: "Infografis Alur Katalog", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Feb 2026", ts: Date.parse("2026-02-09"), bulan: "Feb", pola: "t4", tags: ["katalog", "panduan"], deskripsi: "Placeholder infografis alur penomoran katalog BIBD-001 dan seterusnya. Ganti dengan dokumen atau gambar infografis asli." },
  { id: "BIBD-005", judul: "Meme Katalog Hilang", kategori: "meme", catLabel: "Meme Bersih", tanggal: "16 Feb 2026", ts: Date.parse("2026-02-16"), bulan: "Feb", pola: "t5", tags: ["meme", "katalog"], deskripsi: "Placeholder meme bersih tentang arsip yang nyaris hilang katalog. Ganti dengan meme anggota yang tetap sopan." },
  { id: "BIBD-006", judul: "Kunjungan Studi Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "23 Feb 2026", ts: Date.parse("2026-02-23"), bulan: "Feb", pola: "t6", tags: ["studi", "kunjungan"], deskripsi: "Placeholder dokumentasi kunjungan studi ke ruang arsip lain. Ganti dengan foto dan catatan hasil kunjungan asli." },
  { id: "BIBD-007", judul: "Nonton Bareng Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Mar 2026", ts: Date.parse("2026-03-02"), bulan: "Mar", pola: "t7", tags: ["nonton", "komunitas"], deskripsi: "Placeholder dokumentasi acara nonton bareng anggota komunitas. Ganti dengan foto suasana dan daftar hadir asli." },
  { id: "BIBD-008", judul: "Panduan Contributor Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Mar 2026", ts: Date.parse("2026-03-09"), bulan: "Mar", pola: "t8", tags: ["panduan", "kontributor"], deskripsi: "Placeholder panduan cara anggota mengirim arsip baru ke kurator. Ganti dengan dokumen panduan asli komunitas." }
];
const RAHASIA = { id: "BIBD-000", judul: "Arsip Rahasia", kategori: "dokumentasi", catLabel: "Rahasia", tanggal: "01 Jan 2026", ts: Date.parse("2026-01-01"), bulan: "Jan", pola: "t0", tags: ["rahasia", "misteri"], deskripsi: "Kotak kecil tanpa label di sudut ruang arsip. Di dalamnya hanya ada catatan: kerapian adalah bentuk penghargaan pada kenangan. Arsip contoh untuk yang tekun menjelajah." };
const SEMUA_ARSIP = [...ARSIP, RAHASIA];
const MILESTONES = [
  { id: "M1", judul: "Rapat Perdana", tanggal: "12 Jan 2026", desc: "Tonggak awal: visi arsip disepakati bersama." },
  { id: "M2", judul: "Kunjungan Studi", tanggal: "23 Feb 2026", desc: "Belajar penataan arsip dari komunitas lain." },
  { id: "M3", judul: "Panduan Contributor", tanggal: "09 Mar 2026", desc: "Alur kirim arsip resmi dibuka untuk anggota." }
];
const RUANG = [
  { id: "lobi", nama: "Lobi", target: "#ruang-lobi", ikon: "door-open" },
  { id: "galeri", nama: "Galeri Album", target: "#album", ikon: "images" },
  { id: "baca", nama: "Ruang Baca", target: "#ruangbaca-strip", ikon: "book-open" },
  { id: "kantor", nama: "Kantor Ketua", target: "#ketua", ikon: "briefcase" },
  { id: "aula", nama: "Aula Timeline", target: "#timeline", ikon: "history" }
];
const ANGGOTA = [
  { nama: "Arka", peran: "Kurator", arsip: 4 }, { nama: "Bima", peran: "Dokumentator", arsip: 3 },
  { nama: "Citra", peran: "Kontributor", arsip: 2 }, { nama: "Dara", peran: "Kurator", arsip: 5 },
  { nama: "Eka", peran: "Dokumentator", arsip: 2 }, { nama: "Fajar", peran: "Kontributor", arsip: 1 },
  { nama: "Gita", peran: "Kurator", arsip: 3 }, { nama: "Hadi", peran: "Dokumentator", arsip: 4 },
  { nama: "Irma", peran: "Kontributor", arsip: 2 }, { nama: "Joko", peran: "Dokumentator", arsip: 1 },
  { nama: "Kirana", peran: "Kontributor", arsip: 3 }, { nama: "Lukman", peran: "Kurator", arsip: 2 }
];
const MISI = [
  { id: "buka8", nama: "Penjelajah Arsip", desc: "Buka 8 arsip berbeda.", ikon: "book-open" },
  { id: "filter4", nama: "Kurator Coba Semua", desc: "Coba semua 4 filter kategori.", ikon: "filter" },
  { id: "cari3", nama: "Pencari Tekun", desc: "Lakukan pencarian 3 kali.", ikon: "search" },
  { id: "ruang5", nama: "Penakluk Gedung", desc: "Kunjungi 5 ruangan.", ikon: "map" },
  { id: "fav3", nama: "Kolektor Favorit", desc: "Favoritkan 3 arsip.", ikon: "star" },
  { id: "rahasia", nama: "Penemu Rahasia", desc: "Temukan arsip tersembunyi BIBD-000.", ikon: "key-round" }
];
const STATS = [
  { angka: "24", label: "Arsip" }, { angka: "12", label: "Anggota" },
  { angka: "6", label: "Kegiatan" }, { angka: "1", label: "Ketua" }
];
const KETUA = { nama: "Fairuz", jabatan: "Ketua BIBD", tugas: ["Kurasi Arsip — menyeleksi dan mengkatalog setiap arsip.", "Koordinasi Kegiatan — mengatur jadwal dan dokumentasi.", "Jaga Ketertiban — menegakkan standar konten bersih."], quote: "Arsip yang tertib membuat kenangan komunitas mudah ditemukan dan selalu layak dibagikan." };

/* ============ STATE TERPUSAT + localStorage ============ */
const LS_KEY = "bibd-v6-state";
const state = {
  zona: "lobi", filter: "semua", tag: "semua", sort: "terbaru", query: "",
  favorit: [], riwayat: [], dibuka: [], filterCoba: [], cariHitung: 0,
  visited: [], misiSelesai: [], secretOpen: false,
  settings: { theme: "terang", speed: "normal", minimap: true }
};
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    for (const k of Object.keys(state)) { if (s[k] !== undefined) state[k] = s[k]; }
    state.settings = { ...{ theme: "terang", speed: "normal", minimap: true }, ...(s.settings || {}) };
  } catch (e) { /* abaikan, pakai default */ }
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* mode privat: abaikan */ }
}
loadState();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;
let lastFocus = null;
let currentArsipId = null;
let logoClicks = 0, logoTimer = null;

/* ============ UTIL ============ */
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function icons() { if (window.lucide) window.lucide.createIcons(); }
function findArsip(id) { return SEMUA_ARSIP.find((a) => a.id === id); }
function speedFactor() { return state.settings.speed === "lambat" ? 0.4 : state.settings.speed === "cepat" ? 2.2 : 1; }

function visibleArsip() {
  const q = state.query.trim().toLowerCase();
  let h = ARSIP.filter((a) =>
    (state.filter === "semua" || a.kategori === state.filter) &&
    (state.tag === "semua" || a.tags.includes(state.tag)) &&
    (!q || a.judul.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)));
  if (state.sort === "terlama") h = [...h].sort((a, b) => a.ts - b.ts);
  else if (state.sort === "az") h = [...h].sort((a, b) => a.judul.localeCompare(b.judul, "id"));
  else h = [...h].sort((a, b) => b.ts - a.ts);
  return h;
}

/* ============ MISI ============ */
function misiDone(id) { return state.misiSelesai.includes(id); }
function checkMisi() {
  const grant = (id, ok) => {
    if (ok && !state.misiSelesai.includes(id)) { state.misiSelesai.push(id); }
  };
  grant("buka8", new Set(state.dibuka.filter((x) => x !== "BIBD-000")).size >= 8);
  grant("filter4", new Set(state.filterCoba).size >= 4);
  grant("cari3", state.cariHitung >= 3);
  grant("ruang5", new Set(state.visited).size >= 5);
  grant("fav3", state.favorit.length >= 3);
  grant("rahasia", state.secretOpen);
  saveState();
  renderMisi();
}
function misiProgress() { return Math.round((state.misiSelesai.length / MISI.length) * 100); }

/* ============ RENDER: STATS, DENAH, MINIMAP ============ */
function renderStats() {
  document.getElementById("statsGrid").innerHTML = STATS.map((s) =>
    '<div><p class="stat-num">' + esc(s.angka) + '</p><p class="stat-label">' + esc(s.label) + "</p></div>").join("");
}
function jelajahPct() { return Math.round((new Set(state.visited).size / RUANG.length) * 100); }
function renderDenah() {
  const box = document.getElementById("denahRooms");
  box.innerHTML = "";
  RUANG.forEach((r) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "denah-room";
    b.textContent = r.nama;
    b.setAttribute("aria-label", "Teleport ke " + r.nama);
    if (state.zona === r.id) b.classList.add("is-here");
    if (state.visited.includes(r.id)) b.classList.add("is-seen");
    b.addEventListener("click", () => teleport(r.id, true));
    box.appendChild(b);
  });
  document.getElementById("jelajahProgress").textContent = "Jelajah " + jelajahPct() + "%";
  const dots = document.getElementById("minimapDots");
  dots.innerHTML = "";
  RUANG.forEach((r) => {
    const d = document.createElement("button");
    d.type = "button"; d.className = "minimap-dot";
    d.textContent = r.nama.slice(0, 1);
    d.title = r.nama; d.setAttribute("aria-label", "Pindah ke " + r.nama);
    if (state.zona === r.id) d.classList.add("is-here");
    if (state.visited.includes(r.id)) d.classList.add("is-seen");
    d.addEventListener("click", () => teleport(r.id, true));
    dots.appendChild(d);
  });
  document.getElementById("minimapPct").textContent = jelajahPct() + "% dikunjungi";
  document.getElementById("minimap").hidden = !state.settings.minimap;
}
function teleport(ruangId, viaKlik) {
  const r = RUANG.find((x) => x.id === ruangId);
  if (!r) return;
  state.zona = ruangId;
  if (!state.visited.includes(ruangId)) state.visited.push(ruangId);
  saveState(); checkMisi(); renderDenah();
  flyCameraTo(ruangId);
  const el = document.querySelector(r.target);
  if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  if (viaKlik && location.hash !== "#/ruang/" + ruangId) history.pushState(null, "", "#/ruang/" + ruangId);
}

/* ============ RENDER: ALBUM + TAG + FAVORIT + RIWAYAT ============ */
function renderTagOptions() {
  const sel = document.getElementById("tagFilter");
  const tags = [...new Set(ARSIP.flatMap((a) => a.tags))].sort();
  const cur = state.tag;
  sel.innerHTML = '<option value="semua">Semua tag</option>' + tags.map((t) =>
    '<option value="' + esc(t) + '"' + (cur === t ? " selected" : "") + ">" + esc(t) + "</option>").join("");
}
function renderAlbum() {
  const grid = document.getElementById("albumGrid");
  const empty = document.getElementById("emptyState");
  const hasil = visibleArsip();
  const favOnly = location.hash === "#/favorit";
  const tampil = favOnly ? hasil.filter((a) => state.favorit.includes(a.id)) : hasil;
  document.getElementById("resultCount").textContent =
    (favOnly ? "Favorit: menampilkan " : "Menampilkan ") + tampil.length + " dari " + ARSIP.length + " arsip";
  empty.hidden = tampil.length !== 0;
  document.getElementById("favCount").textContent = state.favorit.length;
  grid.innerHTML = "";
  tampil.forEach((a) => {
    const card = document.createElement("article");
    card.className = "album-card reveal is-visible";
    const isFav = state.favorit.includes(a.id);
    card.innerHTML =
      '<span class="thumb ' + esc(a.pola) + '" aria-hidden="true"><span class="katalog">' + esc(a.id) + "</span></span>" +
      '<button class="fav-star' + (isFav ? " is-fav" : "") + '" aria-label="' + (isFav ? "Hapus dari favorit: " : "Tambah ke favorit: ") + esc(a.judul) + '" aria-pressed="' + isFav + '"><i data-lucide="star"></i></button>' +
      '<button class="album-body" style="background:none;border:none;text-align:left;cursor:pointer;font:inherit;color:inherit" aria-label="Buka detail ' + esc(a.judul) + '">' +
      '<span class="cat">' + esc(a.catLabel) + "</span><h3>" + esc(a.judul) + "</h3>" +
      '<span class="album-date">' + esc(a.tanggal) + "</span>" +
      '<span class="tag-row">' + a.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</span></button>";
    card.querySelector(".fav-star").addEventListener("click", (e) => { e.stopPropagation(); toggleFav(a.id); });
    card.querySelector(".album-body").addEventListener("click", () => openArsip(a.id, true));
    grid.appendChild(card);
  });
  icons();
  attachTilt(grid);
  renderLanjut();
}
function toggleFav(id) {
  const i = state.favorit.indexOf(id);
  if (i >= 0) state.favorit.splice(i, 1); else state.favorit.push(id);
  saveState(); checkMisi(); renderAlbum();
}
function pushRiwayat(id) {
  state.riwayat = [id, ...state.riwayat.filter((x) => x !== id)].slice(0, 5);
  if (!state.dibuka.includes(id)) state.dibuka.push(id);
  saveState();
}
function renderLanjut() {
  const lb = document.getElementById("lanjutBtn");
  const rc = document.getElementById("riwayatCard");
  const last = state.riwayat[0];
  if (last && findArsip(last)) {
    lb.hidden = false;
    document.getElementById("lanjutLabel").textContent = findArsip(last).judul;
  } else lb.hidden = true;
  if (state.riwayat.length) {
    rc.hidden = false;
    const list = document.getElementById("riwayatList");
    list.innerHTML = "";
    state.riwayat.forEach((id) => {
      const a = findArsip(id);
      if (!a) return;
      const c = document.createElement("button");
      c.type = "button"; c.className = "riwayat-chip"; c.textContent = a.id;
      c.setAttribute("aria-label", "Buka kembali " + a.judul);
      c.addEventListener("click", () => openArsip(id, true));
      list.appendChild(c);
    });
  } else rc.hidden = true;
}
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

/* ============ MODAL DETAIL KAYA ============ */
function trapFocus(boxId) {
  const box = document.getElementById(boxId);
  box.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = Array.from(box.querySelectorAll("button, input, select, a[href]")).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
function openBackdrop(id) {
  lastFocus = document.activeElement;
  document.getElementById(id).hidden = false;
  document.body.style.overflow = "hidden";
}
function closeBackdrop(id) {
  document.getElementById(id).hidden = true;
  if (document.querySelectorAll(".modal-backdrop:not([hidden])").length === 0) document.body.style.overflow = "";
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function relatedOf(a) {
  const pool = SEMUA_ARSIP.filter((x) => x.id !== a.id);
  const scored = pool.map((x) => ({ x, s: (x.kategori === a.kategori ? 2 : 0) + x.tags.filter((t) => a.tags.includes(t)).length }));
  scored.sort((p, q) => q.s - p.s);
  return scored.slice(0, 2).map((o) => o.x);
}
function openArsip(id, pushHash) {
  const a = findArsip(id);
  if (!a) return;
  if (id === "BIBD-000" && !state.secretOpen) { state.secretOpen = true; }
  pushRiwayat(id);
  currentArsipId = id;
  checkMisi();
  if (!state.visited.includes("baca")) { state.visited.push("baca"); state.zona = state.zona; saveState(); renderDenah(); }
  document.getElementById("modalKatalog").textContent = "KATALOG " + a.id + " / " + a.catLabel.toUpperCase();
  document.getElementById("modalTitle").textContent = a.judul;
  document.getElementById("modalMeta").textContent = a.tanggal + " — " + a.catLabel;
  document.getElementById("modalDesc").textContent = a.deskripsi;
  document.getElementById("modalThumb").className = "modal-thumb thumb " + a.pola;
  document.getElementById("modalTags").innerHTML = a.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("");
  const rel = document.getElementById("modalRelated");
  rel.innerHTML = "<p class='mini-label'>Arsip terkait</p>";
  relatedOf(a).forEach((r) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "related-btn";
    b.innerHTML = "<span>" + esc(r.id) + " — " + esc(r.judul) + "</span><span aria-hidden='true'>→</span>";
    b.setAttribute("aria-label", "Buka " + r.judul);
    b.addEventListener("click", () => openArsip(r.id, true));
    rel.appendChild(b);
  });
  syncModalFav();
  openBackdrop("modalBackdrop");
  document.getElementById("modalClose").focus();
  renderAlbum();
  if (pushHash && location.hash !== "#/arsip/" + id) history.pushState(null, "", "#/arsip/" + id);
  icons();
}
function syncModalFav() {
  const b = document.getElementById("modalFav");
  const on = state.favorit.includes(currentArsipId);
  b.classList.toggle("is-on", on);
  b.querySelector("span").textContent = on ? "Favorit · Aktif" : "Favorit";
  b.setAttribute("aria-pressed", String(on));
}
function stepArsip(dir) {
  const list = visibleArsip().length ? visibleArsip() : ARSIP;
  let i = list.findIndex((a) => a.id === currentArsipId);
  if (i < 0) i = 0;
  const n = list[(i + dir + list.length) % list.length];
  openArsip(n.id, true);
}
function openKetua() {
  currentArsipId = null;
  document.getElementById("modalKatalog").textContent = "PROFIL KETUA BIBD";
  document.getElementById("modalTitle").textContent = KETUA.nama + " — " + KETUA.jabatan;
  document.getElementById("modalMeta").textContent = "Penanggung jawab arsip dan kegiatan komunitas";
  document.getElementById("modalDesc").textContent = KETUA.tugas.join(" ") + " " + KETUA.quote;
  document.getElementById("modalThumb").className = "modal-thumb thumb t1";
  document.getElementById("modalTags").innerHTML = "";
  document.getElementById("modalRelated").innerHTML = "";
  document.getElementById("modalFav").style.display = "none";
  openBackdrop("modalBackdrop");
  document.getElementById("modalClose").focus();
  if (location.hash !== "#/ketua") history.pushState(null, "", "#/ketua");
}
function closeModal() {
  closeBackdrop("modalBackdrop");
  document.getElementById("modalFav").style.display = "";
}

/* ============ TIMELINE ============ */
function renderTimeline() {
  const rail = document.getElementById("timelineRail");
  rail.innerHTML = "";
  const items = [
    ...MILESTONES.map((m) => ({ t: m.tanggal, j: m.judul, d: m.desc, ms: true, id: m.id })),
    ...ARSIP.map((a) => ({ t: a.tanggal, j: a.judul, d: a.id + " — " + a.catLabel, ms: false, id: a.id }))
  ];
  items.forEach((it) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "timeline-node" + (it.ms ? " is-milestone" : "");
    b.setAttribute("role", "listitem");
    b.setAttribute("aria-label", (it.ms ? "Tonggak: " : "Arsip: ") + it.j + ", " + it.t);
    b.innerHTML = '<span class="timeline-dot" aria-hidden="true"></span><span class="tgl">' + esc(it.t) + "</span><h3>" + esc(it.j) + "</h3><p>" + esc(it.d) + "</p>";
    b.addEventListener("click", () => {
      if (it.ms) {
        currentArsipId = null;
        document.getElementById("modalKatalog").textContent = "TONGGAK 2026";
        document.getElementById("modalTitle").textContent = it.j;
        document.getElementById("modalMeta").textContent = it.t;
        document.getElementById("modalDesc").textContent = it.d;
        document.getElementById("modalThumb").className = "modal-thumb thumb t3";
        document.getElementById("modalTags").innerHTML = "";
        document.getElementById("modalRelated").innerHTML = "";
        document.getElementById("modalFav").style.display = "none";
        openBackdrop("modalBackdrop");
        document.getElementById("modalClose").focus();
      } else openArsip(it.id, true);
    });
    rail.appendChild(b);
  });
}

/* ============ ANGGOTA ============ */
let roleFilter = "semua";
function renderAnggota() {
  const grid = document.getElementById("anggotaGrid");
  grid.innerHTML = "";
  ANGGOTA.filter((a) => roleFilter === "semua" || a.peran === roleFilter).forEach((a) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "anggota-card";
    b.setAttribute("aria-label", "Lihat kontribusi contoh " + a.nama);
    b.innerHTML = '<span class="inisial" aria-hidden="true">' + esc(a.nama.slice(0, 1)) + "</span><span><strong>" + esc(a.nama) + "</strong><small>" + esc(a.peran) + " — " + a.arsip + " arsip (contoh)</small></span>";
    b.addEventListener("click", () => {
      document.getElementById("anggotaAvatar").textContent = a.nama.slice(0, 1);
      document.getElementById("anggotaName").textContent = a.nama;
      document.getElementById("anggotaRole").textContent = a.peran + " — " + a.arsip + " arsip (contoh)";
      document.getElementById("anggotaDesc").textContent = "Profil contoh: " + a.nama + " berperan sebagai " + a.peran.toLowerCase() + " dan berkontribusi pada " + a.arsip + " arsip contoh. Ganti dengan data anggota asli bila sudah tersedia.";
      openBackdrop("anggotaBackdrop");
      document.getElementById("anggotaClose").focus();
    });
    grid.appendChild(b);
  });
}

/* ============ MISI PANEL ============ */
function renderMisi() {
  const list = document.getElementById("misiList");
  if (!list) return;
  list.innerHTML = "";
  MISI.forEach((m) => {
    const done = misiDone(m.id);
    const li = document.createElement("li");
    li.className = "misi-item" + (done ? " is-done" : "");
    li.innerHTML = '<i data-lucide="' + m.ikon + '"></i><span><strong>' + esc(m.nama) + "</strong><small>" + esc(m.desc) + "</small></span><span class='stempel'>" + (done ? "Lunas" : "Misi") + "</span>";
    list.appendChild(li);
  });
  document.getElementById("misiBar").style.width = misiProgress() + "%";
  document.getElementById("misiCount").textContent = state.misiSelesai.length + " dari " + MISI.length + " misi selesai (" + misiProgress() + "%)";
  const badge = document.getElementById("misiBadge");
  const sisa = MISI.length - state.misiSelesai.length;
  badge.hidden = sisa === 0;
  badge.textContent = sisa;
  icons();
}

/* ============ DASBOR CHART (canvas murni) ============ */
function drawCharts() {
  const c1 = document.getElementById("chartKategori");
  if (!c1) return;
  const dark = state.settings.theme === "gelap";
  const ink = dark ? "#F5F5F7" : "#1D1D1F";
  const mut = dark ? "#A1A1A6" : "#6E6E73";
  const cats = [["kegiatan", "#0071E3"], ["meme", "#0E9F8A"], ["dokumentasi", "#7D5CFF"]];
  const counts = cats.map(([k]) => ARSIP.filter((a) => a.kategori === k).length);
  const max = Math.max(...counts);
  const ctx = c1.getContext("2d");
  const W = c1.width, H = c1.height;
  ctx.clearRect(0, 0, W, H);
  c1._bars = [];
  cats.forEach(([k, col], i) => {
    const bw = 70, gap = (W - bw * 3) / 4;
    const x = gap + i * (bw + gap);
    const h = (counts[i] / max) * (H - 70);
    const y = H - 40 - h;
    ctx.fillStyle = state.filter === k ? "#FFC800" : col;
    ctx.beginPath(); ctx.roundRect(x, y, bw, h, 10); ctx.fill();
    ctx.fillStyle = ink; ctx.font = "700 22px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(String(counts[i]), x + bw / 2, y - 10);
    ctx.fillStyle = mut; ctx.font = "600 12px Inter, sans-serif";
    ctx.fillText(k, x + bw / 2, H - 16);
    c1._bars.push({ x, w: bw, k });
  });
  const c2 = document.getElementById("chartBulan");
  const x2 = c2.getContext("2d");
  x2.clearRect(0, 0, c2.width, c2.height);
  const months = ["Jan", "Feb", "Mar"];
  const mc = months.map((m) => ARSIP.filter((a) => a.bulan === m).length);
  const mmax = Math.max(...mc);
  const px = (i) => 40 + i * ((c2.width - 80) / 2);
  const py = (v) => (c2.height - 50) - (v / mmax) * (c2.height - 90);
  x2.strokeStyle = dark ? "#2E2E35" : "#E5E5EA"; x2.lineWidth = 1;
  for (let g = 0; g <= mmax; g++) { x2.beginPath(); x2.moveTo(30, py(g)); x2.lineTo(c2.width - 20, py(g)); x2.stroke(); }
  x2.strokeStyle = "#0071E3"; x2.lineWidth = 3; x2.beginPath();
  mc.forEach((v, i) => { if (i === 0) x2.moveTo(px(i), py(v)); else x2.lineTo(px(i), py(v)); });
  x2.stroke();
  mc.forEach((v, i) => {
    x2.fillStyle = "#0071E3"; x2.beginPath(); x2.arc(px(i), py(v), 6, 0, Math.PI * 2); x2.fill();
    x2.fillStyle = ink; x2.font = "700 15px Inter, sans-serif"; x2.textAlign = "center";
    x2.fillText(String(v), px(i), py(v) - 12);
    x2.fillStyle = mut; x2.font = "600 12px Inter, sans-serif";
    x2.fillText(months[i], px(i), c2.height - 16);
  });
}

/* ============ COMMAND PALETTE ============ */
let palIdx = 0;
function paletteItems(q) {
  const items = [];
  SEMUA_ARSIP.forEach((a) => { if (a.id === "BIBD-000" && !state.secretOpen) return; items.push({ label: a.id + " — " + a.judul, kind: "arsip", ikon: "file-text", run: () => openArsip(a.id, true) }); });
  RUANG.forEach((r) => items.push({ label: "Ruangan: " + r.nama, kind: "ruang", ikon: "map", run: () => teleport(r.id, true) }));
  MISI.forEach((m) => items.push({ label: "Misi: " + m.nama, kind: "misi", ikon: m.ikon, run: () => { openBackdrop("misiBackdrop"); document.getElementById("misiClose").focus(); } }));
  items.push(
    { label: "Lihat Favorit Saya", kind: "fitur", ikon: "star", run: () => { location.hash = "#/favorit"; } },
    { label: "Buka Dasbor", kind: "fitur", ikon: "bar-chart-3", run: () => document.getElementById("dasbor").scrollIntoView() },
    { label: "Buka Pengaturan", kind: "fitur", ikon: "settings", run: () => { openBackdrop("settingsBackdrop"); } },
    { label: "Mulai Tur Otomatis", kind: "fitur", ikon: "play", run: () => startTour() },
    { label: "Profil Ketua", kind: "fitur", ikon: "user", run: () => openKetua() }
  );
  const s = q.trim().toLowerCase();
  if (s === "buka rahasia") return [{ label: "Buka Arsip Rahasia BIBD-000", kind: "rahasia", ikon: "key-round", run: () => openSecret() }];
  if (!s) return items.slice(0, 9);
  return items.filter((i) => i.label.toLowerCase().includes(s)).slice(0, 9);
}
function renderPalette() {
  const q = document.getElementById("paletteInput").value;
  const list = document.getElementById("paletteList");
  const items = paletteItems(q);
  palIdx = Math.min(palIdx, Math.max(items.length - 1, 0));
  list.innerHTML = "";
  items.forEach((it, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.innerHTML = '<button class="' + (i === palIdx ? "is-active" : "") + '"><i data-lucide="' + it.ikon + '"></i><span>' + esc(it.label) + '</span><span class="palette-kind">' + esc(it.kind) + "</span></button>";
    li.querySelector("button").addEventListener("click", () => { closeBackdrop("paletteBackdrop"); it.run(); });
    list.appendChild(li);
  });
  if (!items.length) list.innerHTML = '<li><button disabled><span>Tidak ada hasil. Coba kata lain — atau ketik "buka rahasia".</span></button></li>';
  list._items = items;
  icons();
}
function openPalette() { palIdx = 0; document.getElementById("paletteInput").value = ""; renderPalette(); openBackdrop("paletteBackdrop"); setTimeout(() => document.getElementById("paletteInput").focus(), 30); }

/* ============ RAHASIA ============ */
function openSecret() {
  state.secretOpen = true;
  saveState(); checkMisi();
  openArsip("BIBD-000", true);
}

/* ============ PENGATURAN ============ */
function applySettings() {
  document.documentElement.setAttribute("data-theme", state.settings.theme);
  document.getElementById("setTheme").value = state.settings.theme;
  document.getElementById("setSpeed").value = state.settings.speed;
  document.getElementById("setMinimap").checked = state.settings.minimap;
  document.getElementById("minimap").hidden = !state.settings.minimap;
  drawCharts();
}

/* ============ HASH ROUTING ============ */
function handleHash() {
  const h = location.hash;
  if (h.startsWith("#/arsip/")) {
    const id = h.slice(8);
    if (findArsip(id) && document.getElementById("modalBackdrop").hidden) openArsip(id, false);
    else if (findArsip(id)) { currentArsipId = id; }
  } else if (h.startsWith("#/ruang/")) {
    const r = h.slice(8);
    if (RUANG.find((x) => x.id === r)) teleport(r, false);
  } else if (h === "#/ketua") {
    if (document.getElementById("modalBackdrop").hidden) openKetua();
  } else if (h === "#/favorit") {
    renderAlbum();
    document.getElementById("album").scrollIntoView();
  } else if (!h.startsWith("#/")) {
    // anchor biasa (#album dsb): tandai ruangan terdekat
    const map = { "#album": "galeri", "#timeline": "aula", "#ketua": "kantor", "#ruangbaca-strip": "baca", "#atas": "lobi" };
    if (map[h]) { state.zona = map[h]; if (!state.visited.includes(map[h])) state.visited.push(map[h]); saveState(); checkMisi(); renderDenah(); }
  }
}

/* ============ 3D ============ */
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
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function fTexture() {
  const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#E8E8ED"; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#0071E3"; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(128, 128, 92, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#1D1D1F"; ctx.font = "800 130px Inter, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("F", 128, 178);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const heroState = { progress: 0, ok: false, still: false, orbitX: 0, orbitY: 0, zoom: 8.2, tour: false, tourT: 0 };
let heroGroup = null, heroCam = null, heroRenderer = null;
const ROOM_CAM = { lobi: [0, 2.4, 8.2], galeri: [4.5, 2.0, 5.5], baca: [-4.5, 2.6, 5.5], kantor: [0, 3.4, 6.0], aula: [0, 1.4, 9.5] };
function flyCameraTo(ruangId) {
  const p = ROOM_CAM[ruangId] || ROOM_CAM.lobi;
  heroState._fly = { from: heroCam ? [heroCam.position.x, heroCam.position.y, heroCam.position.z] : p, to: p, t: 0 };
}
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
function startTour() {
  if (reducedMotion) { document.getElementById("tourStatus").textContent = "Tur dimatikan karena preferensi reduced-motion."; return; }
  heroState.tour = true; heroState.tourT = 0;
  document.getElementById("tourBtn").querySelector("span").textContent = "Hentikan Tur";
  document.getElementById("tourStatus").textContent = "Tur otomatis: keliling 5 ruangan… klik atau seret untuk berhenti.";
  document.getElementById("heroViewer").scrollIntoView({ behavior: "smooth" });
}
function stopTour(msg) {
  if (!heroState.tour) return;
  heroState.tour = false;
  document.getElementById("tourBtn").querySelector("span").textContent = "Mulai Tur Otomatis";
  document.getElementById("tourStatus").textContent = msg || "Tur dihentikan.";
}
function initHero3D() {
  if (!threeOK) return false;
  const mount = document.getElementById("viewerCanvas");
  const loading = document.getElementById("viewerLoading");
  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  mount.appendChild(renderer.domElement);
  heroRenderer = renderer;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 60);
  camera.position.set(0, 2.4, 8.2);
  camera.lookAt(0, 0.1, 0);
  heroCam = camera;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8de, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdceBff, 0.4);
  fill.position.set(-5, 3, -3); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.14 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.15; ground.receiveShadow = true;
  scene.add(ground);
  const group = new THREE.Group(); scene.add(group); heroGroup = group;
  const matBody = new THREE.MeshStandardMaterial({ color: 0xdcdce0, roughness: 0.55, metalness: 0.05 });
  const matPage = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.55, 2.5, 4, 0.1), matBody);
  body.castShadow = true; body.receiveShadow = true; group.add(body);
  const pages = [];
  for (let i = 0; i < 3; i++) {
    const pg = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.09, 2.1), matPage);
    pg.position.y = 0.32 + i * 0.11; pg.castShadow = true; group.add(pg); pages.push(pg);
  }
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.32, -1.25); group.add(lidPivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.16, 2.5, 4, 0.07), matBody.clone());
  lid.position.set(0, 0.06, 1.25); lid.castShadow = true; lidPivot.add(lid);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.42), new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.6 }));
  label.rotation.x = -Math.PI / 2; label.position.set(0, 0.145, 1.25); lidPivot.add(label);
  const band = new THREE.Mesh(new THREE.BoxGeometry(3.44, 0.5, 0.4), new THREE.MeshStandardMaterial({ color: 0x0071e3, roughness: 0.5 }));
  group.add(band);
  // Orbit bebas: drag + zoom
  let dragging = false, lx = 0, ly = 0;
  mount.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; mount.setPointerCapture(e.pointerId); stopTour("Tur dihentikan oleh interaksi."); });
  mount.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    heroState.orbitX += (e.clientX - lx) * 0.008;
    heroState.orbitY = THREE.MathUtils.clamp(heroState.orbitY + (e.clientY - ly) * 0.005, -0.5, 0.6);
    lx = e.clientX; ly = e.clientY;
  });
  mount.addEventListener("pointerup", () => { dragging = false; });
  mount.addEventListener("wheel", (e) => { e.preventDefault(); heroState.zoom = THREE.MathUtils.clamp(heroState.zoom + e.deltaY * 0.005, 4.5, 14); stopTour("Tur dihentikan oleh zoom."); }, { passive: false });
  mount.addEventListener("click", () => { if (heroState.tour) stopTour("Tur dihentikan oleh klik."); });
  let mx = 0, my = 0, cx = 0, cy = 0;
  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }
  let visible = true, tabVisible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(mount);
  document.addEventListener("visibilitychange", () => { tabVisible = !document.hidden; });
  const clock = new THREE.Clock();
  let firstFrame = true;
  const ease = (p) => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const tourRooms = ["lobi", "galeri", "baca", "kantor", "aula"];
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || !tabVisible || heroState.still) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const p = ease(THREE.MathUtils.clamp(heroProgress(), 0, 1));
    heroState.progress = p;
    updateSteps(p);
    cx += (mx - cx) * 0.04; cy += (my - cy) * 0.04;
    const sf = reducedMotion ? 0 : speedFactor();
    const sway = reducedMotion ? 0 : Math.sin(t * 0.5 * sf) * 0.05;
    group.rotation.y = -0.55 + p * Math.PI * 0.75 + sway + cx * 0.12 + heroState.orbitX;
    group.rotation.x = cy * 0.06 + heroState.orbitY * 0.4;
    lidPivot.rotation.x = -p * 1.85;
    pages.forEach((pg, i) => { pg.rotation.y = p * (i - 1) * 0.1; });
    // fly-to ruangan
    if (heroState._fly) {
      const f = heroState._fly;
      f.t = Math.min(f.t + dt * 1.4, 1);
      const e = 1 - Math.pow(1 - f.t, 3);
      camera.position.set(
        f.from[0] + (f.to[0] - f.from[0]) * e,
        f.from[1] + (f.to[1] - f.from[1]) * e,
        f.from[2] + (f.to[2] - f.from[2]) * e);
      if (f.t >= 1) heroState._fly = null;
    } else if (heroState.tour && !reducedMotion) {
      heroState.tourT += dt;
      const seg = 3, total = seg * tourRooms.length;
      const tt = heroState.tourT % total;
      const idx = Math.floor(tt / seg);
      const ft = (tt % seg) / seg;
      const a = ROOM_CAM[tourRooms[idx]], b = ROOM_CAM[tourRooms[(idx + 1) % tourRooms.length]];
      const e = ft < 0.7 ? (1 - Math.pow(1 - ft / 0.7, 3)) : 1;
      camera.position.set(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e);
      const done = Math.floor(heroState.tourT / total);
      if (done >= 1 && heroState.tourT >= total) {
        stopTour("Tur selesai — 5 ruangan sudah dikelilingi.");
        if (!state.visited.includes("aula")) { RUANG.forEach((r) => { if (!state.visited.includes(r.id)) state.visited.push(r.id); }); saveState(); checkMisi(); renderDenah(); }
      }
      document.getElementById("tourStatus").textContent = "Tur: " + tourRooms[idx] + " → " + tourRooms[(idx + 1) % tourRooms.length] + "…";
    } else {
      camera.position.y += ((2.4 + p * 0.8) - camera.position.y) * 0.05;
      camera.position.x += (cx * 0.3 - camera.position.x) * 0.02;
      const zT = heroState.zoom;
      camera.position.z += (zT - camera.position.z) * 0.08;
    }
    camera.lookAt(0, 0.1, 0);
    const w = mount.clientWidth, h = mount.clientHeight;
    if (renderer.domElement.width !== Math.floor(w * renderer.getPixelRatio())) {
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
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
  window.addEventListener("scroll", () => { heroState.progress = heroProgress(); updateSteps(heroState.progress); }, { passive: true });
}
function initKetua3D() {
  if (!threeOK) return false;
  const mount = document.getElementById("ketuaCanvas");
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.1, 40);
    camera.position.set(0, 0.6, 6.4); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x333338, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0x2997ff, 0.5);
    rim.position.set(-4, 2, -3); scene.add(rim);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.3 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -1.35; ground.receiveShadow = true;
    scene.add(ground);
    const cube = new THREE.Mesh(new RoundedBoxGeometry(1.9, 1.9, 1.9, 4, 0.35), new THREE.MeshStandardMaterial({ color: 0xe8e8ed, roughness: 0.5 }));
    cube.castShadow = true; scene.add(cube);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshStandardMaterial({ map: fTexture(), roughness: 0.55 }));
    face.position.z = 0.96; scene.add(face);
    const avatar = new THREE.Group(); avatar.add(cube); avatar.add(face); scene.add(avatar);
    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(mount);
    const clock = new THREE.Clock();
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        const sf = speedFactor();
        avatar.rotation.y = t * 0.4 * sf;
        avatar.rotation.x = Math.sin(t * 0.5) * 0.08;
        avatar.position.y = Math.sin(t * 0.9) * 0.08;
      }
      renderer.render(scene, camera);
    })();
  } catch (err) { console.warn("[BIBD-3D] avatar ketua gagal:", err && err.message); }
}

/* ============ REVEAL ============ */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".feature-card.reveal").forEach((el) => io.observe(el));
  // tandai ruangan saat section terlihat
  const rio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const r = en.target.getAttribute("data-room");
        if (r && state.zona !== r) { state.zona = r; }
        if (r && !state.visited.includes(r)) state.visited.push(r);
        saveState(); checkMisi(); renderDenah();
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("[data-room]").forEach((el) => rio.observe(el));
}

/* ============ WIRING ============ */
function wireDOM() {
  document.getElementById("catChips").querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#catChips .chip").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
      state.filter = btn.getAttribute("data-filter");
      if (!state.filterCoba.includes(state.filter)) state.filterCoba.push(state.filter);
      saveState(); checkMisi(); renderAlbum(); drawCharts();
    });
  });
  document.getElementById("roleChips").querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#roleChips .chip").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
      roleFilter = btn.getAttribute("data-role");
      renderAnggota();
    });
  });
  let searchT = null;
  document.getElementById("albumSearch").addEventListener("input", (e) => {
    state.query = e.target.value;
    clearTimeout(searchT);
    searchT = setTimeout(() => {
      if (state.query.trim()) { state.cariHitung += 1; saveState(); checkMisi(); }
      renderAlbum();
    }, 350);
  });
  document.getElementById("tagFilter").addEventListener("change", (e) => { state.tag = e.target.value; saveState(); renderAlbum(); });
  document.getElementById("sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; saveState(); renderAlbum(); });
  document.getElementById("sortSelect").value = state.sort;
  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    state.filter = "semua"; state.tag = "semua"; state.sort = "terbaru"; state.query = "";
    document.getElementById("albumSearch").value = "";
    document.querySelectorAll("#catChips .chip").forEach((b) => {
      const on = b.getAttribute("data-filter") === "semua";
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on));
    });
    renderTagOptions(); document.getElementById("tagFilter").value = "semua";
    document.getElementById("sortSelect").value = "terbaru";
    saveState(); renderAlbum(); drawCharts();
  });
  document.getElementById("ketuaDetailBtn").addEventListener("click", openKetua);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalPrev").addEventListener("click", () => stepArsip(-1));
  document.getElementById("modalNext").addEventListener("click", () => stepArsip(1));
  document.getElementById("modalFav").addEventListener("click", () => { if (currentArsipId) { toggleFav(currentArsipId); syncModalFav(); } });
  document.getElementById("modalCopy").addEventListener("click", async (e) => {
    const url = location.origin + location.pathname + "#/arsip/" + currentArsipId;
    try { await navigator.clipboard.writeText(url); }
    catch (err) {
      const ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* abaikan */ }
      ta.remove();
    }
    const b = e.currentTarget; b.querySelector("span").textContent = "Tersalin!";
    setTimeout(() => { b.querySelector("span").textContent = "Salin Tautan"; }, 1500);
  });
  document.getElementById("modalBackdrop").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
  document.getElementById("lanjutBtn").addEventListener("click", () => { if (state.riwayat[0]) openArsip(state.riwayat[0], true); });
  // palette
  document.getElementById("paletteBtn").addEventListener("click", openPalette);
  document.getElementById("paletteInput").addEventListener("input", () => { palIdx = 0; renderPalette(); });
  document.getElementById("paletteInput").addEventListener("keydown", (e) => {
    const list = document.getElementById("paletteList");
    const items = list._items || [];
    if (e.key === "ArrowDown") { e.preventDefault(); palIdx = Math.min(palIdx + 1, items.length - 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palIdx = Math.max(palIdx - 1, 0); renderPalette(); }
    else if (e.key === "Enter") { e.preventDefault(); if (items[palIdx]) { closeBackdrop("paletteBackdrop"); items[palIdx].run(); } }
  });
  document.getElementById("paletteBackdrop").addEventListener("click", function (e) { if (e.target === this) closeBackdrop("paletteBackdrop"); });
  // misi + settings + anggota
  document.getElementById("misiBtn").addEventListener("click", () => { renderMisi(); openBackdrop("misiBackdrop"); document.getElementById("misiClose").focus(); });
  document.getElementById("misiClose").addEventListener("click", () => closeBackdrop("misiBackdrop"));
  document.getElementById("misiBackdrop").addEventListener("click", function (e) { if (e.target === this) closeBackdrop("misiBackdrop"); });
  document.getElementById("settingsBtn").addEventListener("click", () => { openBackdrop("settingsBackdrop"); document.getElementById("settingsClose").focus(); });
  document.getElementById("settingsClose").addEventListener("click", () => closeBackdrop("settingsBackdrop"));
  document.getElementById("settingsBackdrop").addEventListener("click", function (e) { if (e.target === this) closeBackdrop("settingsBackdrop"); });
  document.getElementById("setTheme").addEventListener("change", (e) => { state.settings.theme = e.target.value; saveState(); applySettings(); });
  document.getElementById("setSpeed").addEventListener("change", (e) => { state.settings.speed = e.target.value; saveState(); });
  document.getElementById("setMinimap").addEventListener("change", (e) => { state.settings.minimap = e.target.checked; saveState(); applySettings(); renderDenah(); });
  document.getElementById("resetProgressBtn").addEventListener("click", () => {
    state.visited = []; state.dibuka = []; state.filterCoba = []; state.cariHitung = 0;
    state.favorit = []; state.riwayat = []; state.misiSelesai = []; state.secretOpen = false; state.zona = "lobi";
    saveState(); checkMisi(); renderDenah(); renderAlbum(); drawCharts();
  });
  document.getElementById("anggotaClose").addEventListener("click", () => closeBackdrop("anggotaBackdrop"));
  document.getElementById("anggotaBackdrop").addEventListener("click", function (e) { if (e.target === this) closeBackdrop("anggotaBackdrop"); });
  document.getElementById("tourBtn").addEventListener("click", () => { if (heroState.tour) stopTour("Tur dihentikan."); else startTour(); });
  // logo 3x = rahasia
  document.getElementById("brandLogo").addEventListener("click", () => {
    logoClicks += 1;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => { logoClicks = 0; }, 1500);
    if (logoClicks >= 3) { logoClicks = 0; openSecret(); }
  });
  // chart klik -> filter
  document.getElementById("chartKategori").addEventListener("click", (e) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) * (c.width / r.width);
    const bar = (c._bars || []).find((b) => x >= b.x && x <= b.x + b.w);
    if (bar) {
      state.filter = bar.k;
      document.querySelectorAll("#catChips .chip").forEach((b2) => {
        const on = b2.getAttribute("data-filter") === bar.k;
        b2.classList.toggle("is-active", on); b2.setAttribute("aria-pressed", String(on));
      });
      if (!state.filterCoba.includes(bar.k)) state.filterCoba.push(bar.k);
      saveState(); checkMisi(); renderAlbum(); drawCharts();
      document.getElementById("album").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  });
  // keyboard global
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
    if (e.key === "Escape") {
      for (const id of ["paletteBackdrop", "misiBackdrop", "settingsBackdrop", "anggotaBackdrop", "modalBackdrop"]) {
        if (!document.getElementById(id).hidden) {
          if (id === "modalBackdrop") closeModal(); else closeBackdrop(id);
          return;
        }
      }
    }
  });
  window.addEventListener("hashchange", handleHash);
  window.addEventListener("popstate", handleHash);
  ["modalBackdrop", "paletteBackdrop", "misiBackdrop", "settingsBackdrop", "anggotaBackdrop"].forEach(trapFocus);
}

/* ============ BOOT ============ */
applySettings();
renderStats();
renderTagOptions();
renderAlbum();
renderTimeline();
renderAnggota();
renderDenah();
renderMisi();
drawCharts();
wireDOM();
initReveal();
icons();
handleHash();
try {
  if (!window.WebGLRenderingContext) throw new Error("WebGL tidak didukung");
  loadThree().then((ok) => {
    if (ok) { initHero3D(); initKetua3D(); }
    else { document.getElementById("viewerLoading").hidden = true; document.getElementById("viewerFallback").hidden = false; }
  });
} catch (err) {
  console.warn("[BIBD-3D]", err && err.message);
  document.getElementById("viewerLoading").hidden = true;
  document.getElementById("viewerFallback").hidden = false;
}
window.addEventListener("resize", drawCharts);

/* ============ API QA ============ */
window.__BIBD = {
  ARSIP: SEMUA_ARSIP, state,
  visibleCount: () => visibleArsip().length,
  visibleIds: () => visibleArsip().map((a) => a.id),
  applyFilter: (kat, q) => { state.filter = kat; state.query = q || ""; renderAlbum(); drawCharts(); },
  applyTagSort: (tag, sort) => { state.tag = tag; state.sort = sort; renderAlbum(); },
  openArsip, openKetua, openSecret, teleport, toggleFav,
  rooms: () => RUANG.map((r) => r.id),
  visited: () => [...state.visited],
  jelajahPct,
  misi: () => MISI.map((m) => ({ id: m.id, done: misiDone(m.id) })),
  misiProgress,
  simulateMisi: () => {
    state.dibuka = ARSIP.map((a) => a.id);
    state.filterCoba = ["semua", "kegiatan", "meme", "dokumentasi"];
    state.cariHitung = 3;
    state.visited = RUANG.map((r) => r.id);
    state.favorit = ["BIBD-001", "BIBD-002", "BIBD-003"];
    state.secretOpen = true;
    saveState(); checkMisi(); renderDenah(); renderAlbum();
    return MISI.map((m) => ({ id: m.id, done: misiDone(m.id) }));
  },
  openPalette, paletteItems,
  setTheme: (t) => { state.settings.theme = t; saveState(); applySettings(); },
  resetProgress: () => document.getElementById("resetProgressBtn").click(),
  startTour, stopTour, tourActive: () => heroState.tour,
  heroProgress: () => heroState.progress,
  orbit: (dx, dy) => { heroState.orbitX += dx; heroState.orbitY += dy; return [heroState.orbitX, heroState.orbitY]; },
  zoom: (z) => { heroState.zoom = z; return heroState.zoom; },
  still: () => { heroState.still = true; },
  webglOK: () => heroState.ok
};
