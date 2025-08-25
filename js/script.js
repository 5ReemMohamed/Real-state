function initializeProjectDetail() {
   
    updateTranslations();
  
    initializeImageSlider();
    
}


function changeImage(clickedItem, newSrc) {
    const mainImage = document.getElementById('mainImage');
    const allSliderItems = document.querySelectorAll('.slider-item');

    allSliderItems.forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');

    mainImage.classList.add('changing');

    setTimeout(() => {
        if (newSrc.endsWith('.mp4')) {
            mainImage.outerHTML = `
                <video id="mainImage" class="main-media" src="${newSrc}" controls autoplay loop muted></video>
            `;
        } else {
            mainImage.outerHTML = `
                <img id="mainImage" class="main-media" src="${newSrc}" alt="Main View">
            `;
        }
    }, 250);
}


function initializeImageSlider() {
    const sliderItems = document.querySelectorAll('.slider-item');
    
    sliderItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
                this.style.opacity = '1';
                this.style.filter = 'grayscale(0%)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.opacity = '';
                this.style.filter = '';
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

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeFullscreen(overlay.querySelector('.fullscreen-close'));
        }
    });
    
    document.addEventListener('keydown', function(e) {
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

    let currentLang = localStorage.getItem("siteLang") || "en";

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
            let currentLang = localStorage.getItem("siteLang") || "en";

            currentLang = currentLang === "en" ? "ar" : "en";

            localStorage.setItem("siteLang", currentLang);

            updateTranslations();
        });
    }
}




document.addEventListener("DOMContentLoaded", function () {
    initializeProjectDetail();
    
    toggleLanguage();
    
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