document.addEventListener("DOMContentLoaded", function () {
    // window.history.scrollRestoration = "manual";
    // window.scrollTo(0, 0);

    const langBtn = document.getElementById("langBtn");
    let currentLang = "en";

  
    function applyLanguage(lang) {
        document.querySelectorAll("[data-ar]").forEach(node => {
            if (!(node instanceof HTMLElement)) return;


            const val = node.getAttribute(`data-${lang}`);
            if (!val) return;

            if (node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
                node.placeholder = val;
            } else if (node.tagName === "SELECT") {
                node.setAttribute("aria-label", val);
                node.querySelectorAll("option").forEach(option => {
                    const optVal = option.getAttribute(`data-${lang}`);
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
            const nextLang = lang === "en" ? "ar" : "en";
            langBtn.innerHTML = `<i class="fas fa-language"></i> ${nextLang.toUpperCase()}`;
        }

        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    }

    applyLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "en" ? "ar" : "en";
            applyLanguage(currentLang);
        });
    }

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
