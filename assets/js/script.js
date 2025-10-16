// Video Configuration
const videoConfig = [
    {
        id: 'tutorial-1',
        title: 'Tutorial Masuk Bevy GDGOC UNPAS',
        embedUrl: 'https://www.youtube.com/embed/4jDlzx3ZYN0',
        description: 'Panduan lengkap cara mendaftar GDGOC'
    },

    {
        id: 'tutorial-2',
        title: 'Tutorial Masuk Discord GDGOC UNPAS',
        embedUrl: 'https://www.youtube.com/embed/F8p77Ps2G_k',
        description: 'Tutorial tambahan untuk pendaftaran'
    }
];

// Initialize Particles.js with Google colors
function initParticles() {
  if (typeof particlesJS !== "undefined") {
    try {
      particlesJS("particles-js", {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: ["#4285f4", "#34a853", "#fbbc05", "#ea4335"] },
          shape: { type: "circle" },
          opacity: { value: 0.4, random: true },
          size: { value: 4, random: true },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
        },
        retina_detect: true,
      });
    } catch (err) {
      console.log("Particles error:", err);
    }
  }
}

// Data Program Studi per Fakultas
const prodiData = {
  "Fakultas Teknik": [
    "Teknik Informatika",
    "Teknik Mesin",
    "Teknik Industri",
    "Teknik Lingkungan",
    "Teknologi Pangan",
    "Perencanaan Wilayah dan Kota",
  ],
  "Fakultas Ekonomi dan Bisnis": [
    "Akuntansi",
    "Manajemen",
    "Ekonomi Pembangunan",
  ],
  "Fakultas Hukum": ["Ilmu Hukum"],
  "Fakultas Keguruan dan Ilmu Pendidikan": [
    "Pendidikan Pancasila & Kewarganegaraan",
    "Pendidikan Ekonomi",
    "Pendidikan Bahasa dan Sastra Indonesia",
    "Pendidikan Matematika",
    "Pendidikan Biologi",
    "Pendidikan Guru Sekolah Dasar",
  ],
  "Fakultas Ilmu Sosial dan Ilmu Politik": [
    "Administrasi Publik",
    "Ilmu Kesejahteraan Sosial",
    "Ilmu Hubungan Internasional",
    "Ilmu Administrasi Bisnis",
    "Ilmu Komunikasi",
  ],
  "Fakultas Kedokteran": ["Kedokteran"],
  "Fakultas Ilmu Seni dan Sastra": [
    "Sastra Inggris",
    "Desain Komunikasi Visual",
    "Fotografi",
    "Seni Musik",
  ],
};

// Department Manager Class
class DepartmentManager {
  constructor() {
    this.selected = [];
    this.maxSelect = 2;
    this.cards = document.querySelectorAll(".dept-card");
    this.hiddenInput = document.getElementById("department");
    this.counter = document.querySelector(".selection-counter");
    this.counterNum = document.querySelector(".counter-number");
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener("click", () => this.toggle(card));
    });
  }

  toggle(card) {
    const dept = card.getAttribute("data-dept");
    const isSelected = this.selected.includes(dept);

    if (isSelected) {
      this.selected = this.selected.filter((d) => d !== dept);
      card.classList.remove("selected");
    } else {
      if (this.selected.length >= this.maxSelect) {
        this.showAlert();
        this.shakeCard(card);
        return;
      }
      this.selected.push(dept);
      card.classList.add("selected");
    }

    this.updateUI();
  }

  updateUI() {
    this.counterNum.textContent = this.selected.length;
    this.hiddenInput.value = this.selected.join(", ");

    if (this.selected.length > 0) {
      this.counter.classList.add("active");
      const errorEl = document.getElementById("department-error");
      if (errorEl) errorEl.style.display = "none";
    } else {
      this.counter.classList.remove("active");
    }

    this.cards.forEach((card) => {
      const dept = card.getAttribute("data-dept");
      if (
        !this.selected.includes(dept) &&
        this.selected.length >= this.maxSelect
      ) {
        card.classList.add("disabled");
      } else {
        card.classList.remove("disabled");
      }
    });
  }

  shakeCard(card) {
    card.style.animation = "shake 0.5s";
    setTimeout(() => (card.style.animation = ""), 500);
  }

  showAlert() {
    const alert = document.createElement("div");
    alert.className = "custom-alert";
    alert.innerHTML = `
      <div class="alert-box">
        <span class="alert-icon">⚠️</span>
        <span class="alert-msg">Maksimal ${this.maxSelect} departemen dapat dipilih!</span>
      </div>
    `;
    document.body.appendChild(alert);

    setTimeout(() => alert.classList.add("show"), 10);
    setTimeout(() => {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 300);
    }, 2000);
  }

  reset() {
    this.selected = [];
    this.cards.forEach((c) => c.classList.remove("selected", "disabled"));
    this.updateUI();
  }
}

// Custom Select Handler Class
class SelectHandler {
  constructor() {
    this.selects = document.querySelectorAll(".select-modern");
    this.init();
  }

  init() {
    this.selects.forEach((select) => {
      const trigger = select.querySelector(".select-trigger-modern");
      const items = select.querySelectorAll(".select-item");
      const selectName = select.getAttribute("data-select");
      const hidden = document.getElementById(selectName);

      trigger.addEventListener("click", () => {
        if (!select.classList.contains("disabled")) {
          this.closeAll();
          select.classList.add("active");
        }
      });

      items.forEach((item) => {
        item.addEventListener("click", () => {
          const value = item.getAttribute("data-value");
          const text = item.textContent;

          if (hidden) hidden.value = value;
          select.querySelector(".select-text").textContent = text;

          items.forEach((i) => i.classList.remove("selected"));
          item.classList.add("selected");

          select.classList.remove("active");

          if (value) {
            const errorEl = document.getElementById(`${selectName}-error`);
            if (errorEl) errorEl.style.display = "none";
          }

          if (selectName === "fakultas") {
            prodiHandler.update(value);
          }
        });
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".select-modern")) {
        this.closeAll();
      }
    });
  }

  closeAll() {
    this.selects.forEach((s) => s.classList.remove("active"));
  }
}

// Prodi Handler Class
class ProdiHandler {
  constructor() {
    this.select = document.querySelector('[data-select="prodi"]');
    this.menu = this.select?.querySelector(".select-menu");
    this.text = this.select?.querySelector(".select-text");
    this.hidden = document.getElementById("prodi");
  }

  update(fakultas) {
    if (!this.menu) return;

    this.menu.innerHTML = "";

    if (fakultas && prodiData[fakultas]) {
      this.select.classList.remove("disabled");
      this.text.textContent = "Pilih Program Studi";

      const empty = document.createElement("div");
      empty.className = "select-item";
      empty.setAttribute("data-value", "");
      empty.textContent = "Pilih Program Studi";
      this.menu.appendChild(empty);

      prodiData[fakultas].forEach((prodi) => {
        const item = document.createElement("div");
        item.className = "select-item";
        item.setAttribute("data-value", prodi);
        item.textContent = prodi;

        item.addEventListener("click", () => {
          this.hidden.value = prodi;
          this.text.textContent = prodi;
          this.menu
            .querySelectorAll(".select-item")
            .forEach((i) => i.classList.remove("selected"));
          item.classList.add("selected");
          this.select.classList.remove("active");

          const errorEl = document.getElementById("prodi-error");
          if (errorEl) errorEl.style.display = "none";
        });

        this.menu.appendChild(item);
      });
    } else {
      this.select.classList.add("disabled");
      this.text.textContent = "Pilih Fakultas terlebih dahulu";
      this.hidden.value = "";
    }
  }
}

// File Input Handler Class with Preview
class FileHandler {
  constructor() {
    this.inputs = document.querySelectorAll(".file-hidden");
    this.init();
  }

  init() {
    this.inputs.forEach((input) => {
      const box = input.closest(".file-upload-box");
      const display = box?.querySelector(".file-display");
      const fileInfo = display?.querySelector(".file-info");

      if (display) {
        display.addEventListener("click", (e) => {
          if (!e.target.closest(".file-cancel-btn")) {
            input.click();
          }
        });
      }

      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          this.showPreview(input, file, display, fileInfo);

          const errorId = input.id + "-error";
          const errorEl = document.getElementById(errorId);
          if (errorEl) errorEl.style.display = "none";
        }
      });
    });
  }

  showPreview(input, file, display, fileInfo) {
    display.classList.add("has-file");

    const existingPreview = display.querySelector(".file-preview");
    if (existingPreview) {
      existingPreview.remove();
    }

    const preview = document.createElement("div");
    preview.className = "file-preview show";

    // Truncate filename if too long
    const truncatedName = this.truncateFileName(file.name, 25);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `
          <img src="${e.target.result}" alt="Preview">
          <div class="file-preview-info">
            <div class="file-preview-name" title="${
              file.name
            }">${truncatedName}</div>
            <div class="file-preview-size">${this.formatFileSize(
              file.size
            )}</div>
          </div>
          <button type="button" class="file-cancel-btn">
            <i data-lucide="x"></i>
            Hapus
          </button>
        `;

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }

        this.attachCancelHandler(input, display, fileInfo, preview);
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = `
        <div class="file-preview-icon">
          <i data-lucide="file-text"></i>
        </div>
        <div class="file-preview-info">
          <div class="file-preview-name" title="${
            file.name
          }">${truncatedName}</div>
          <div class="file-preview-size">${this.formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="file-cancel-btn">
          <i data-lucide="x"></i>
          Hapus
        </button>
      `;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }

      this.attachCancelHandler(input, display, fileInfo, preview);
    }

    display.appendChild(preview);
  }

  attachCancelHandler(input, display, fileInfo, preview) {
    const cancelBtn = preview.querySelector(".file-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.value = "";
        preview.remove();
        display.classList.remove("has-file");
      });
    }
  }

  truncateFileName(filename, maxLength) {
    if (filename.length <= maxLength) return filename;

    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );

    return `${truncatedName}...${extension}`;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}

// Form Validator Class
class FormValidator {
  validate() {
    this.hideAllErrors();
    let valid = true;

    // Nama
    if (!document.getElementById("nama").value.trim()) {
      this.showError("nama-error", "Nama harus diisi");
      valid = false;
    }

    // NPM - only numbers
    const npm = document.getElementById("npm").value.trim();
    if (!npm) {
      this.showError("npm-error", "NPM harus diisi");
      valid = false;
    } else if (!/^\d+$/.test(npm)) {
      this.showError("npm-error", "NPM hanya boleh angka");
      valid = false;
    }

    // Email
    const email = document.getElementById("email").value.trim();
    if (!email) {
      this.showError("email-error", "Email harus diisi");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError("email-error", "Format email tidak valid");
      valid = false;
    }

    // WhatsApp - only numbers
    const wa = document.getElementById("whatsapp").value.trim();
    if (!wa) {
      this.showError("whatsapp-error", "Nomor WhatsApp harus diisi");
      valid = false;
    } else if (!/^[0-9]{10,13}$/.test(wa)) {
      this.showError("whatsapp-error", "Nomor WhatsApp harus 10-13 digit");
      valid = false;
    }

    // Fakultas
    if (!document.getElementById("fakultas").value) {
      this.showError("fakultas-error", "Fakultas harus dipilih");
      valid = false;
    }

    // Prodi
    if (!document.getElementById("prodi").value) {
      this.showError("prodi-error", "Program Studi harus dipilih");
      valid = false;
    }

    // Department
    if (!deptManager.selected.length) {
      this.showError("department-error", "Minimal 1 departemen harus dipilih");
      valid = false;
    }

    // Reason
    if (!document.getElementById("reason").value.trim()) {
      this.showError("reason-error", "Alasan harus diisi");
      valid = false;
    }

    // CV
    if (!document.getElementById("cv").files[0]) {
      this.showError("cv-error", "CV harus diupload (format PDF)");
      valid = false;
    }

    // Instagram
    if (!document.getElementById("instagram").files[0]) {
      this.showError("instagram-error", "Wajib upload");
      valid = false;
    }

    // Discord
    if (!document.getElementById("discord").files[0]) {
      this.showError("discord-error", "Wajib upload");
      valid = false;
    }

    // Bevy
    if (!document.getElementById("bv").files[0]) {
      this.showError("bv-error", "Wajib upload");
      valid = false;
    }

    return valid;
  }

  showError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.style.display = "block";
    }
  }

  hideAllErrors() {
    document
      .querySelectorAll(".error-msg")
      .forEach((e) => (e.style.display = "none"));
  }
}

// Form Handler Class
class FormHandler {
  constructor() {
    this.form = document.getElementById("registration-form");
    this.validator = new FormValidator();
    this.btn = document.querySelector(".btn-submit");
    this.scriptURL =
      "https://script.google.com/macros/s/AKfycbwjlBobeHpTGDwxRqgg0rG4VU54QqgT2FZT8DFQequrPV7bo--dWFBjtGM26j291WtL/exec";
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.submit(e));

    // NPM input - numbers only
    const npmInput = document.getElementById("npm");
    if (npmInput) {
      npmInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });
    }

    // WhatsApp input - numbers only
    const waInput = document.getElementById("whatsapp");
    if (waInput) {
      waInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });
    }
  }

  async submit(e) {
    e.preventDefault();

    if (!this.validator.validate()) {
      this.scrollToFirstError();
      return;
    }

    this.btn.disabled = true;
    this.btn.querySelector(".btn-text").textContent = "Mengirim...";

    // Show loading overlay
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("active");
    }

    try {
      const data = await this.getData();
      const res = await this.send(data);

      if (res.status === "success") {
        this.showSuccess();
        this.reset();
      } else {
        throw new Error("Gagal mengirim data");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      this.btn.disabled = false;
      this.btn.querySelector(".btn-text").textContent = "Daftar Sekarang";

      // Hide loading overlay
      if (loadingOverlay) {
        loadingOverlay.classList.remove("active");
      }
    }
  }

  async getData() {
    const cv = document.getElementById("cv").files[0];
    const porto = document.getElementById("portofolio").files[0];
    const ig = document.getElementById("instagram").files[0];
    const dc = document.getElementById("discord").files[0];
    const bv = document.getElementById("bv").files[0];

    // Parallel base64 encoding for better performance
    const [cvData, portoData, igData, dcData, bvData] = await Promise.all([
      this.toBase64(cv),
      porto ? this.toBase64(porto) : Promise.resolve(null),
      this.toBase64(ig),
      this.toBase64(dc),
      this.toBase64(bv)
    ]);

    return {
      nama: document.getElementById("nama").value.trim(),
      npm: document.getElementById("npm").value.trim(),
      email: document.getElementById("email").value.trim(),
      whatsapp: document.getElementById("whatsapp").value.trim(),
      fakultas: document.getElementById("fakultas").value,
      prodi: document.getElementById("prodi").value,
      department: deptManager.selected.join(", "),
      reason: document.getElementById("reason").value.trim(),
      cv: cvData,
      portofolio: portoData,
      instagram: igData,
      discord: dcData,
      bv: bvData,
    };
  }

  async send(data) {
    const formData = new URLSearchParams();
    formData.append("payload", JSON.stringify(data));

    const res = await fetch(this.scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (res.ok) return { status: "success" };
    throw new Error("Network error");
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          mimeType: file.type,
          data: reader.result.split(",")[1],
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  scrollToFirstError() {
    const firstError = document.querySelector('.error-msg[style*="block"]');
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  showSuccess() {
    const popup = document.getElementById("success-popup");
    if (!popup) return;

    popup.classList.add("active");

    // First confetti burst - with error handling
    if (typeof confetti !== "undefined") {
      try {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#4285f4", "#34a853", "#fbbc05", "#ea4335"],
        });

        // Second confetti burst
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#4285f4", "#34a853", "#fbbc05", "#ea4335"],
          });
        }, 250);
      } catch (err) {
        console.log("Confetti error:", err);
      }
    }

    // GSAP animation for popup - with error handling
    if (typeof gsap !== "undefined") {
      try {
        gsap.fromTo(
          ".success-box",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
      } catch (err) {
        console.log("GSAP error:", err);
      }
    }

    // Countdown and redirect to WhatsApp group
    const countdownEl = document.getElementById("redirect-countdown");
    let countdown = 3;

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdownEl) {
        countdownEl.textContent = countdown;
      }
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    setTimeout(() => {
      window.location.href = "https://chat.whatsapp.com/FZzHcntqTut64kUxaJIZ6I";
    }, 3000);
  }

  reset() {
    this.form.reset();
    deptManager.reset();

    // Reset all file uploads
    document.querySelectorAll(".file-display").forEach((display) => {
      display.classList.remove("has-file");

      // Remove preview
      const preview = display.querySelector(".file-preview");
      if (preview) {
        preview.remove();
      }
    });

    // Reset file inputs
    document.querySelectorAll(".file-hidden").forEach((input) => {
      input.value = "";
    });
  }
}

// Video Manager Class
class VideoManager {
    constructor() {
        this.desktopContainer = document.getElementById('video-section-desktop');
        this.mobileModalBody = document.getElementById('video-modal-body');
        this.modal = document.getElementById('video-modal');
        this.navbarBtn = document.getElementById('navbar-video-btn');
        this.modalCloseBtn = document.getElementById('video-modal-close');
        this.init();
    }

    init() {
        // Inject videos to desktop section
        if (this.desktopContainer) {
            this.injectVideos(this.desktopContainer);
        }

        // Inject videos to mobile modal
        if (this.mobileModalBody) {
            this.injectVideos(this.mobileModalBody);
        }

        // Setup mobile modal handlers
        if (this.navbarBtn) {
            this.navbarBtn.addEventListener('click', () => {
                this.modal.classList.add('active');
            });
        }

        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => {
                this.modal.classList.remove('active');
            });
        }

        // Close modal on overlay click
        if (this.modal) {
            this.modal.querySelector('.video-modal-overlay')?.addEventListener('click', () => {
                this.modal.classList.remove('active');
            });
        }
    }

    injectVideos(container) {
        videoConfig.forEach((video) => {
            const videoHTML = `
                <div class="video-player" data-video-id="${video.id}">
                    <div class="video-toggle">
                        <div class="video-toggle-header">
                            <span class="video-toggle-title">${video.title}</span>
                            <span class="video-toggle-icon">▼</span>
                        </div>
                    </div>
                    <div class="video-dropdown">
                        <div class="video-container">
                            <iframe
                                src="${video.embedUrl}"
                                title="${video.title}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', videoHTML);
        });

        // Add WhatsApp group info after videos
        const whatsappInfoHTML = `
            <div class="whatsapp-group-info">
                <h3 class="wa-info-title">📱 Grup WhatsApp</h3>
                <p class="wa-info-desc">Join grup WhatsApp untuk informasi open recruitment:</p>
                <a href="https://chat.whatsapp.com/FZzHcntqTut64kUxaJIZ6I"
                   target="_blank"
                   rel="noopener"
                   class="wa-group-btn wa-primary">
                    Join Grup Utama
                </a>
                <p class="wa-backup-label">Jika grup utama penuh:</p>
                <a href="https://chat.whatsapp.com/HvLgWizPNQRLDU0g0VSk79?mode=wwt"
                   target="_blank"
                   rel="noopener"
                   class="wa-group-btn wa-secondary">
                    Join Grup Backup
                </a>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', whatsappInfoHTML);

        // Add toggle functionality
        container.querySelectorAll('.video-toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const player = toggle.closest('.video-player');
                const dropdown = player.querySelector('.video-dropdown');

                toggle.classList.toggle('active');
                dropdown.classList.toggle('active');
            });
        });
    }
}

// Close Success Popup Function
function closeSuccessPopup() {
  const popup = document.getElementById("success-popup");
  popup.classList.remove("active");
}

// Global Variables
let deptManager, selectHandler, prodiHandler, fileHandler, formHandler, videoManager;

// Initialize Everything
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles background
  initParticles();

  // Initialize all components
  deptManager = new DepartmentManager();
  selectHandler = new SelectHandler();
  prodiHandler = new ProdiHandler();
  fileHandler = new FileHandler();
  formHandler = new FormHandler();
  videoManager = new VideoManager();

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Add custom CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .custom-alert {
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      z-index: 10000;
      opacity: 0;
      transition: all 0.3s;
    }

    .custom-alert.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .alert-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      border-left: 4px solid #fbbc05;
    }

    .alert-icon {
      font-size: 1.5rem;
    }

    .alert-msg {
      font-size: 0.95rem;
      font-weight: 600;
      color: #202124;
    }
  `;
  document.head.appendChild(style);

  console.log("✅ GDGOC Registration Form initialized successfully!");
});
