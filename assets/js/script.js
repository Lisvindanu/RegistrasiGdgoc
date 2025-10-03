// Initialize Particles.js with Google-themed colors
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#4285f4', '#34a853', '#fbbc05', '#ea4335']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.3,
                random: true
            },
            size: {
                value: 4,
                random: true
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Department Selection Handler - Updated for multiple selection (max 2)
class DepartmentSelector {
    constructor() {
        this.selectedDepartments = [];
        this.maxSelections = 2;
        this.departmentCards = document.querySelectorAll('.department-card');
        this.departmentInput = document.getElementById('department');
        this.init();
    }

    init() {
        this.departmentCards.forEach(card => {
            card.addEventListener('click', () => this.toggleDepartment(card));
        });
    }

    toggleDepartment(card) {
        const department = card.getAttribute('data-department');
        const isSelected = this.selectedDepartments.includes(department);

        if (isSelected) {
            // Deselect
            this.selectedDepartments = this.selectedDepartments.filter(d => d !== department);
            card.classList.remove('selected');
        } else {
            // Check max selections
            if (this.selectedDepartments.length >= this.maxSelections) {
                alert(`Maksimal ${this.maxSelections} departemen dapat dipilih`);
                return;
            }
            // Select
            this.selectedDepartments.push(department);
            card.classList.add('selected');
        }

        // Update hidden input value
        this.departmentInput.value = this.selectedDepartments.join(', ');

        // Hide error message if at least one is selected
        if (this.selectedDepartments.length > 0) {
            document.getElementById('department-error').style.display = 'none';
        }
    }

    getSelected() {
        return this.selectedDepartments.join(', ');
    }

    reset() {
        this.selectedDepartments = [];
        this.departmentCards.forEach(c => c.classList.remove('selected'));
        this.departmentInput.value = '';
    }
}

// Form Validator
class FormValidator {
    constructor(form) {
        this.form = form;
    }

    validate() {
        this.resetErrors();
        let isValid = true;

        // Nama
        const nama = document.getElementById('nama').value.trim();
        if (!nama) {
            this.showError('nama-error');
            isValid = false;
        }

        // NPM
        const npm = document.getElementById('npm').value.trim();
        if (!npm) {
            this.showError('npm-error');
            isValid = false;
        }

        // Fakultas
        const fakultas = document.getElementById('fakultas').value;
        if (!fakultas) {
            this.showError('fakultas-error');
            isValid = false;
        }

        // Prodi
        const prodi = document.getElementById('prodi').value.trim();
        if (!prodi) {
            this.showError('prodi-error');
            isValid = false;
        }

        // Department
        if (!departmentSelector.getSelected()) {
            this.showError('department-error');
            isValid = false;
        }

        // Reason (Alasan)
        const reason = document.getElementById('reason').value.trim();
        if (!reason) {
            this.showError('reason-error');
            isValid = false;
        }

        // CV
        const cv = document.getElementById('cv').files[0];
        if (!cv) {
            this.showError('cv-error');
            isValid = false;
        } else if (cv.type !== 'application/pdf') {
            this.showError('cv-error', 'CV harus berformat PDF');
            isValid = false;
        }

        // Instagram
        const instagram = document.getElementById('instagram').files[0];
        if (!instagram) {
            this.showError('instagram-error');
            isValid = false;
        } else if (!instagram.type.startsWith('image/')) {
            this.showError('instagram-error', 'Bukti follow Instagram harus berupa gambar');
            isValid = false;
        }

        // Discord
        const discord = document.getElementById('discord').files[0];
        if (!discord) {
            this.showError('discord-error');
            isValid = false;
        } else if (!discord.type.startsWith('image/')) {
            this.showError('discord-error', 'Bukti Discord harus berupa gambar');
            isValid = false;
        }

        // BV (Bevy)
        const bv = document.getElementById('bv').files[0];
        if (!bv) {
            this.showError('bv-error');
            isValid = false;
        } else if (!bv.type.startsWith('image/')) {
            this.showError('bv-error', 'Bukti join Bevy harus berupa gambar');
            isValid = false;
        }

        // WhatsApp
        const whatsapp = document.getElementById('whatsapp').value.trim();
        if (!whatsapp) {
            this.showError('whatsapp-error');
            isValid = false;
        } else if (!/^[0-9]{10,13}$/.test(whatsapp)) {
            this.showError('whatsapp-error', 'Nomor WhatsApp harus 10-13 digit angka');
            isValid = false;
        }

        return isValid;
    }

    resetErrors() {
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
    }

    showError(errorId, customMessage = null) {
        const errorElement = document.getElementById(errorId);
        if (customMessage) {
            errorElement.textContent = customMessage;
        }
        errorElement.style.display = 'block';
    }

    scrollToFirstError() {
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.previousElementSibling.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

// Form Handler
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registration-form');
        this.validator = new FormValidator(this.form);
        this.submitButton = document.querySelector('.submit-button');
        // URL Google Apps Script Web App
        this.scriptURL = 'https://script.google.com/macros/s/AKfycby2RbKwWav_o3k1ik-A6DR-IdglUy6LxFaX_TqY25I6f6ACnJq88bMqRteBmy50Jsp2/exec';
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validator.validate()) {
            this.validator.scrollToFirstError();
            return;
        }

        // Disable submit button
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Mengirim...';

        try {
            // Get form data
            const formData = await this.getFormData();

            // Log form data (for development)
            console.log('Form data:', formData);

            // Send to Google Apps Script
            const response = await this.sendToGoogleScript(formData);

            if (response.status === 'success') {
                // Show success popup
                successPopup.show();

                // Reset form
                this.reset();
            } else {
                throw new Error(response.message || 'Gagal mengirim data');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengirim data: ' + error.message);
        } finally {
            // Re-enable submit button
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Daftar Sekarang';
        }
    }

    async sendToGoogleScript(data) {
        // Jika URL belum diset, skip API call (development mode)
        if (this.scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.log('Development mode - skipping API call');
            return { status: 'success', message: 'Development mode' };
        }

        try {
            // Send data as form-encoded POST request
            const formData = new URLSearchParams();
            const payloadStr = JSON.stringify(data);
            formData.append('payload', payloadStr);

            console.log('Sending payload length:', payloadStr.length);
            console.log('FormData body:', formData.toString().substring(0, 200) + '...');

            const response = await fetch(this.scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                redirect: 'follow'
            });

            console.log('Response status:', response.status);
            console.log('Response:', response);

            // Try to read response text
            try {
                const responseText = await response.text();
                console.log('Response text:', responseText);
                const responseData = JSON.parse(responseText);

                if (responseData.status === 'success') {
                    return responseData;
                } else {
                    throw new Error(responseData.message || 'Unknown error');
                }
            } catch (parseError) {
                console.log('Could not parse response, assuming success');
                // If we can't parse, but got 200, assume success
                if (response.ok) {
                    return { status: 'success', message: 'Data terkirim' };
                }
                throw parseError;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getFormData() {
        // Convert files to base64 for Google Apps Script
        const cvFile = document.getElementById('cv').files[0];
        const portofolioFile = document.getElementById('portofolio').files[0];
        const instagramFile = document.getElementById('instagram').files[0];
        const discordFile = document.getElementById('discord').files[0];
        const bvFile = document.getElementById('bv').files[0];

        const data = {
            nama: document.getElementById('nama').value.trim(),
            npm: document.getElementById('npm').value.trim(),
            fakultas: document.getElementById('fakultas').value,
            prodi: document.getElementById('prodi').value.trim(),
            department: departmentSelector.getSelected(),
            reason: document.getElementById('reason').value.trim(),
            whatsapp: document.getElementById('whatsapp').value.trim(),
            cv: await this.fileToBase64(cvFile),
            portofolio: portofolioFile ? await this.fileToBase64(portofolioFile) : null,
            instagram: await this.fileToBase64(instagramFile),
            discord: await this.fileToBase64(discordFile),
            bv: await this.fileToBase64(bvFile)
        };

        return data;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve({
                    name: file.name,
                    mimeType: file.type,
                    data: base64
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    reset() {
        this.form.reset();
        departmentSelector.reset();
    }
}

// Success Popup Handler
class SuccessPopup {
    constructor() {
        this.popup = document.getElementById('success-popup');
        this.init();
    }

    init() {
        // Close on outside click
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.close();
            }
        });
    }

    show() {
        this.popup.classList.add('active');
        this.launchConfetti();
        this.animateContent();
    }

    close() {
        this.popup.classList.remove('active');
    }

    launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#4285f4', '#34a853', '#fbbc05', '#ea4335'],
            disableForReducedMotion: true
        });

        // Second burst
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#4285f4', '#34a853', '#fbbc05', '#ea4335'],
                disableForReducedMotion: true
            });
        }, 250);
    }

    animateContent() {
        gsap.fromTo('.success-content',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    }
}

// Close success popup function (for inline onclick)
function closeSuccessPopup() {
    successPopup.close();
}

// Data Program Studi per Fakultas (S1 only)
const prodiData = {
    'Fakultas Teknik': [
        'Teknik Informatika',
        'Teknik Mesin',
        'Teknik Industri',
        'Teknik Lingkungan',
        'Teknologi Pangan',
        'Perencanaan Wilayah dan Kota'
    ],
    'Fakultas Ekonomi dan Bisnis': [
        'Akuntansi',
        'Manajemen',
        'Ekonomi Pembangunan'
    ],
    'Fakultas Hukum': [
        'Ilmu Hukum'
    ],
    'Fakultas Keguruan dan Ilmu Pendidikan': [
        'Pendidikan Pancasila & Kewarganegaraan',
        'Pendidikan Ekonomi',
        'Pendidikan Bahasa dan Sastra Indonesia',
        'Pendidikan Matematika',
        'Pendidikan Biologi',
        'Pendidikan Guru Sekolah Dasar'
    ],
    'Fakultas Ilmu Sosial dan Ilmu Politik': [
        'Administrasi Publik',
        'Ilmu Kesejahteraan Sosial',
        'Ilmu Hubungan Internasional',
        'Ilmu Administrasi Bisnis',
        'Ilmu Komunikasi'
    ],
    'Fakultas Kedokteran': [
        'Kedokteran'
    ],
    'Fakultas Ilmu Seni dan Sastra': [
        'Sastra Inggris',
        'Desain Komunikasi Visual',
        'Fotografi',
        'Seni Musik'
    ]
};

// Prodi Selector Handler
class ProdiSelector {
    constructor() {
        this.fakultasSelect = document.getElementById('fakultas');
        this.prodiSelect = document.getElementById('prodi');
        this.init();
    }

    init() {
        this.fakultasSelect.addEventListener('change', () => this.updateProdiOptions());
    }

    updateProdiOptions() {
        const selectedFakultas = this.fakultasSelect.value;
        this.prodiSelect.innerHTML = '<option value="">Pilih Program Studi</option>';

        if (selectedFakultas && prodiData[selectedFakultas]) {
            this.prodiSelect.disabled = false;
            prodiData[selectedFakultas].forEach(prodi => {
                const option = document.createElement('option');
                option.value = prodi;
                option.textContent = prodi;
                this.prodiSelect.appendChild(option);
            });
        } else {
            this.prodiSelect.disabled = true;
            this.prodiSelect.innerHTML = '<option value="">Pilih Fakultas terlebih dahulu</option>';
        }
    }
}

// Initialize everything when DOM is ready
let departmentSelector;
let prodiSelector;
let registrationForm;
let successPopup;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles
    initParticles();

    // Initialize components
    departmentSelector = new DepartmentSelector();
    prodiSelector = new ProdiSelector();
    registrationForm = new RegistrationForm();
    successPopup = new SuccessPopup();

    console.log('GDGOC Registration Form initialized successfully!');
});
