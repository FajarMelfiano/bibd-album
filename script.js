"use strict";

var ARSIP = [
  { id: "BIBD-001", judul: "Rapat Perdana Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "12 Jan 2026", pola: "t1", ikon: "calendar-days", deskripsi: "Dokumentasi placeholder rapat perdana: pembahasan visi arsip, pembagian peran, dan foto bersama. Ganti dengan foto dan ringkasan asli kegiatan." },
  { id: "BIBD-002", judul: "Meme Rapat yang Tertib", kategori: "meme", catLabel: "Meme Bersih", tanggal: "19 Jan 2026", pola: "t2", ikon: "laugh", deskripsi: "Placeholder meme bersih bertema rapat komunitas. Ganti dengan meme buatan anggota yang sopan dan layak dibagikan." },
  { id: "BIBD-003", judul: "Kerja Bakti Arsip", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Feb 2026", pola: "t3", ikon: "calendar-days", deskripsi: "Placeholder dokumentasi kerja bakti merapikan ruang arsip komunitas. Ganti dengan foto kegiatan asli dan daftar peserta." },
  { id: "BIBD-004", judul: "Infografis Alur Katalog", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Feb 2026", pola: "t4", ikon: "file-text", deskripsi: "Placeholder infografis alur penomoran katalog BIBD-001 dan seterusnya. Ganti dengan dokumen atau gambar infografis asli." },
  { id: "BIBD-005", judul: "Meme Katalog Hilang", kategori: "meme", catLabel: "Meme Bersih", tanggal: "16 Feb 2026", pola: "t5", ikon: "laugh", deskripsi: "Placeholder meme bersih tentang arsip yang nyaris hilang katalog. Ganti dengan meme anggota yang tetap sopan." },
  { id: "BIBD-006", judul: "Kunjungan Studi Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "23 Feb 2026", pola: "t6", ikon: "file-text", deskripsi: "Placeholder dokumentasi kunjungan studi ke ruang arsip lain. Ganti dengan foto dan catatan hasil kunjungan asli." },
  { id: "BIBD-007", judul: "Nonton Bareng Komunitas", kategori: "kegiatan", catLabel: "Kegiatan", tanggal: "02 Mar 2026", pola: "t7", ikon: "calendar-days", deskripsi: "Placeholder dokumentasi acara nonton bareng anggota komunitas. Ganti dengan foto suasana dan daftar hadir asli." },
  { id: "BIBD-008", judul: "Panduan Contributor Arsip", kategori: "dokumentasi", catLabel: "Dokumentasi", tanggal: "09 Mar 2026", pola: "t8", ikon: "file-text", deskripsi: "Placeholder panduan cara anggota mengirim arsip baru ke kurator. Ganti dengan dokumen panduan asli komunitas." }
];

var activeFilter = "semua";
var query = "";
var lastFocus = null;

function catIcon(k) {
  if (k === "kegiatan") return "calendar-days";
  if (k === "meme") return "laugh";
  return "file-text";
}

// Escape teks sebelum disisipkan ke HTML (hindari injeksi via data arsip).
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function renderGrid() {
  var grid = document.getElementById("albumGrid");
  var empty = document.getElementById("emptyState");
  var count = document.getElementById("resultCount");
  grid.innerHTML = "";
  var q = query.trim().toLowerCase();
  var hasil = ARSIP.filter(function (a) {
    var okCat = activeFilter === "semua" || a.kategori === activeFilter;
    var okQ = !q || a.judul.toLowerCase().indexOf(q) !== -1;
    return okCat && okQ;
  });
  count.textContent = "Menampilkan " + hasil.length + " dari " + ARSIP.length + " arsip";
  empty.hidden = hasil.length !== 0;
  hasil.forEach(function (a) {
    var card = document.createElement("article");
    card.className = "album-card";
    card.innerHTML =
      '<div class="thumb ' + esc(a.pola) + '" role="img" aria-label="Placeholder ' + esc(a.judul) + '">' +
      '<span class="katalog">' + esc(a.id) + '</span>' +
      '<span class="thumb-icon"><i data-lucide="' + esc(a.ikon) + '"></i></span></div>' +
      '<div class="album-body">' +
      '<span class="cat"><i data-lucide="' + esc(catIcon(a.kategori)) + '"></i>' + esc(a.catLabel) + '</span>' +
      "<h3>" + esc(a.judul) + "</h3>" +
      '<p class="album-date"><i data-lucide="calendar"></i>' + esc(a.tanggal) + "</p>" +
      '<button class="detail-btn" data-id="' + esc(a.id) + '"><i data-lucide="eye"></i>Lihat Detail</button>' +
      "</div>";
    grid.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

function openModal(id) {
  var a = ARSIP.find(function (x) { return x.id === id; });
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

function closeModal() {
  document.getElementById("modalBackdrop").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

document.addEventListener("DOMContentLoaded", function () {
  renderGrid();
  if (window.lucide) window.lucide.createIcons();

  document.querySelectorAll(".chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      activeFilter = btn.getAttribute("data-filter");
      renderGrid();
    });
  });

  document.getElementById("searchInput").addEventListener("input", function (e) {
    query = e.target.value;
    renderGrid();
  });

  document.getElementById("albumGrid").addEventListener("click", function (e) {
    var btn = e.target.closest(".detail-btn");
    if (btn) openModal(btn.getAttribute("data-id"));
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
  // Focus trap: putar Tab di dalam modal; Esc menutup.
  document.getElementById("modalBackdrop").addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var focusables = Array.prototype.slice.call(
      document.querySelectorAll('#modalBackdrop button, #modalBackdrop [href], #modalBackdrop input, #modalBackdrop [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!focusables.length) { e.preventDefault(); return; }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !document.getElementById("modalBackdrop").hidden) closeModal();
  });

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
