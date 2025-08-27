function getCurrentLang() {
    return localStorage.getItem("siteLang") || "en";
}

function initializeProjectDetail() {
    updateTranslations();
    initializeImageSlider();
}

function changeImage(newSrc, altText = "Main View", isVideo = false) {
    const mainImageContainer = document.querySelector('.main-image-container');
    const currentMedia = mainImageContainer.querySelector('#mainImage');

    if (currentMedia) currentMedia.remove();

    let newMedia;
    if (isVideo) {
        newMedia = document.createElement('video');
        newMedia.id = 'mainImage';
        newMedia.className = 'main-image';
        newMedia.src = newSrc;
        newMedia.controls = true;
        newMedia.autoplay = true;
        newMedia.loop = true;
        newMedia.muted = true;
    } else {
        newMedia = document.createElement('img');
        newMedia.id = 'mainImage';
        newMedia.className = 'main-image';
        newMedia.src = newSrc;
        newMedia.alt = altText;
    }

    newMedia.style.opacity = '0';
    mainImageContainer.appendChild(newMedia);
    setTimeout(() => {
        newMedia.style.opacity = '1';
    }, 10);
}

function initializeImageSlider() {
    const sliderItems = document.querySelectorAll('.swiper-slide');

    sliderItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                changeImage(img.src, img.alt);
            }
        });

        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
}

function openFullscreen() {
    const mainImage = document.getElementById('mainImage');
    const isVideo = mainImage.tagName.toLowerCase() === 'video';
    const src = mainImage.src;

    const overlay = createFullscreenOverlay(src, isVideo);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

function createFullscreenOverlay(src, isVideo = false) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';

    if (isVideo) {
        overlay.innerHTML = `
            <video src="${src}" controls autoplay loop muted class="fullscreen-media"></video>
            <button class="fullscreen-close" onclick="closeFullscreen(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
    } else {
        overlay.innerHTML = `
            <img src="${src}" alt="Fullscreen Image" class="fullscreen-media">
            <button class="fullscreen-close" onclick="closeFullscreen(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeFullscreen(overlay.querySelector('.fullscreen-close'));
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeFullscreen(overlay.querySelector('.fullscreen-close'));
        }
    });

    return overlay;
}

function closeFullscreen(button) {
    const overlay = button.closest('.fullscreen-overlay');
    overlay.classList.remove('active');

    setTimeout(() => {
        overlay.remove();
    }, 300);
}

function updateTranslations() {
    const langBtn = document.getElementById("langBtn");
    let currentLang = getCurrentLang();

    document.querySelectorAll("[data-ar]").forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        const val = node.getAttribute(`data-${currentLang}`);
        if (!val) return;

        if (node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
            node.placeholder = val;
        } else if (node.tagName === "SELECT") {
            node.setAttribute("aria-label", val);
            node.querySelectorAll("option").forEach(option => {
                const optVal = option.getAttribute(`data-${currentLang}`);
                if (optVal) option.textContent = optVal;
            });
        } else if (node.tagName === "OPTION") {
            node.textContent = val;
        } else {
            const icon = node.querySelector("i");
            if (icon) node.innerHTML = `${icon.outerHTML} ${val}`;
            else node.textContent = val;
        }
    });

    if (langBtn) {
        const nextLang = currentLang === "en" ? "ar" : "en";
        langBtn.innerHTML = `<i class="fas fa-language"></i> ${nextLang.toUpperCase()}`;
    }

    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
}

function toggleLanguage() {
    const langBtn = document.getElementById("langBtn");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            let currentLang = getCurrentLang();
            currentLang = currentLang === "en" ? "ar" : "en";
            localStorage.setItem("siteLang", currentLang);
            updateTranslations();

            initializeSwiper();
        });
    }
}

function initializeSwiper() {
    const currentLang = getCurrentLang();
    const isRTL = currentLang === "ar";

    if (window.mySwiper) {
        window.mySwiper.destroy(true, true);
    }

    window.mySwiper = new Swiper(".mySwiper", {
        slidesPerView: 5,
        spaceBetween: 12,
        rtl: isRTL, 
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 2, spaceBetween: 8 },
            576: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 12 },
            1200: { slidesPerView: 6, spaceBetween: 15 }
        }
    });

    initializeImageSlider();
}

document.addEventListener("DOMContentLoaded", function () {
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#navbar",
        offset: 80
    });

    window.addEventListener("load", () => {
        scrollSpy.refresh();
    });

    const navLinks = document.querySelectorAll("#navbar .nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
    initializeProjectDetail();
    toggleLanguage();
    initializeSwiper(); 

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarToggler = document.querySelector('.navbar-collapse');
            if (navbarToggler.classList.contains('show')) {
                new bootstrap.Collapse(navbarToggler).hide();
            }
        });
    });

    AOS.init({
        duration: 1000,
        once: false
    });
});

document.getElementById('whatsappForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.querySelector('[name="name"]').value;
  const email = document.querySelector('[name="email"]').value;
  const phone = document.querySelector('[name="phone"]').value;
  const project = document.querySelector('[name="project"]').value;
  const message = document.querySelector('[name="message"]').value;

  const whatsappNumber = "201094920727"; 

  const text = `Hello, I would like to contact you:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject: ${project}\nMessage: ${message}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');

  this.reset();
});

