

// GOOGLE SHEET FATECH FUNCTION START/////////--------------------------
// GOOGLE SHEET FETCH FUNCTION START
// ================================

const API = "https://script.google.com/macros/s/AKfycbxA_XgSev7jBJ92xd-TZV-573nrOJ8or3L_CkX3TAvPYb10BLnD9cRPlIJKvoCAFPjpTQ/exec";

let currentLinks = {};

// Load iframe links
async function loadLinks() {
    try {
        const res = await fetch(API + "?action=links");
        const data = await res.json();

        currentLinks = data;

        for (const page in data) {
            const frame = document.getElementById(page + "Frame");

            if (frame) {
                frame.src = data[page];
            }
        }

    } catch (err) {
        console.error("Load Links Error:", err);
    }
}

// Save Visitor Log


async function logUserActivity() {

    try {

        let payload = {
            ip: "",
            city: "",
            state: "",
            country: "",
            isp: "",
            locationSource: "IP",

            latitude: "",
            longitude: "",





            accuracy: "",



            device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            browser: navigator.userAgent,
            os: navigator.platform,
            screen: screen.width + " x " + screen.height,
            page: location.href,
            referrer: document.referrer


        };

        // IP Info (Fallback)
        const geo = await fetch("https://ipapi.co/json/")
            .then(res => res.json());

        payload.ip = geo.ip || "";
        payload.city = geo.city || "";
        payload.state = geo.region || "";
        payload.country = geo.country_name || "";
        payload.isp = geo.org || "";

        // GPS Location
        // GPS Location with Permission Check
if ("permissions" in navigator) {

    const permission = await navigator.permissions.query({
        name: "geolocation"
    });

    if (permission.state === "granted" || permission.state === "prompt") {

        try {

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false,
                        timeout: 6000,
                        maximumAge: 300000
                    }
                );
            });

            payload.latitude = position.coords.latitude;
            payload.longitude = position.coords.longitude;
            payload.accuracy = position.coords.accuracy;

            const loc = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${payload.latitude}&lon=${payload.longitude}`
            ).then(r => r.json());

            const addr = loc.address || {};

            payload.city =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.hamlet ||
                payload.city;

            payload.state = addr.state || payload.state;
            payload.country = addr.country || payload.country;

            payload.locationSource = "GPS";

        } catch (e) {

            console.log("GPS unavailable. Using IP.");

        }

    } else {

        console.log("Location permission denied. Using IP.");

    }

}

        const form = new FormData();
        form.append("data", JSON.stringify(payload));

        await fetch(API, {
            method: "POST",
            body: form
        });

        console.log("Visitor Saved");

    } catch (err) {

        console.error("Log Error:", err);

    }

}









window.addEventListener("load", () => {
    loadLinks();
    logUserActivity();
});

// GOOGLE SHEET FETCH FUNCTION END
// GOOGLE SHEET FATECH FUNCTION ------CLOSE --------------------------






async function loadPage(id, file) {
    const html = await fetch(file).then(r => r.text());
    document.getElementById(id).innerHTML = html;
}
async function loadAllPages() {
    await loadPage("home", "home.html");
    initCarousel();
    initAdsSlider();
    initTeamSlider();
    await loadPage("samajbook", "samajbook.html");
    initAccordion();
    await loadPage("darpan", "darpan.html");
    await loadPage("sangam", "sangam.html");
    await loadPage("PhotoGallery", "PhotoGallery.html");
    await loadPage("student", "student.html");
    await loadPage("PIDCard", "PIDCard.html");
    await loadPage("SIDCard", "SIDCard.html");
    await loadPage("account", "account.html");
    await loadPage("editaccount", "editaccount.html");
    await loadPage("sevasamiti", "sevasamiti.html");
    await loadPage("downloadpdf", "downloadpdf.html");
}

// loadAllPages();



// header 
function initCarousel() {

    const slides = document.querySelectorAll('#myCarousel .carousel-slide img');
    const prevBtn = document.querySelector('#myCarousel .prev');
    const nextBtn = document.querySelector('#myCarousel .next');
    const dotsContainer = document.querySelector('#myCarousel .carousel-dots');

    let index = 0;

    function showSlide() {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            dots[i].classList.remove("active");
        });
        slides[index].classList.add("active");
        dots[index].classList.add("active");
    }



    function nextSlide() {
        index = (index + 1) % slides.length;
        showSlide();
    }

    function prevSlide() {
        index = (index - 1 + slides.length) % slides.length;
        showSlide();
    }

    let interval = setInterval(nextSlide, 3000);

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");

        dot.onclick = () => {
            index = i;
            showSlide();
            resetInterval();
        };

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("button");



    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 3000);
    }

    prevBtn.onclick = () => {
        prevSlide();
        resetInterval();
    };

    nextBtn.onclick = () => {
        nextSlide();
        resetInterval();
    };

    document.getElementById("myCarousel")
        .addEventListener("mouseenter", () => clearInterval(interval));

    document.getElementById("myCarousel")
        .addEventListener("mouseleave", resetInterval);
}





function initAdsSlider() {
    $("#adSlider").owlCarousel({
        loop: true,
        margin: 5,
        stagePadding: 2,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            }
        }
    });

}







function readMoreFun(className, buttonId) {

    const elements = document.getElementsByClassName(className);
    const button = document.getElementById(buttonId);

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.toggle("hidden-content");
    }

    button.classList.toggle("hidden-readmore");

    if (!button.classList.contains("hidden-readmore")) {
        button.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}




function initTeamSlider() {

    const owl = $('#teem .owl-carousel');

    if (!owl.length) return;

    owl.owlCarousel({
        items: 10,
        loop: true,
        margin: 10,
        stagePadding: 10,
        dotsEach: true,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,

        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

    $('.play').off('click').on('click', function () {
        owl.trigger('play.owl.autoplay', [3000]);
    });

    $('.stop').off('click').on('click', function () {
        owl.trigger('stop.owl.autoplay');
    });

}








function initAccordion() {

    const accordions = document.querySelectorAll("#pageA .accordion");

    accordions.forEach(acc => {

        acc.onclick = function () {

            const panel = this.nextElementSibling;

            // सभी accordion बंद करो
            accordions.forEach(item => {

                if (item !== this) {
                    item.classList.remove("open");
                    item.nextElementSibling.style.display = "none";
                }

            });

            // अगर यही खुला है तो बंद कर दो
            if (this.classList.contains("open")) {

                this.classList.remove("open");
                panel.style.display = "none";
                return;
            }

            // इसे खोलो
            this.classList.add("open");
            panel.style.display = "block";

        };

    });

}


const PageA = {

    // currentAccordion: null,

    showContent: function (btn, page, openAccordion = true) {

        // सभी button inactive
        document.querySelectorAll("#pageA .panel button").forEach(b => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        const panel = btn.closest(".panel");
        const accordion = panel.previousElementSibling;

        // पहले active accordion हो तो उसे बंद करो
        // पहले वाले active accordion को पूरी तरह हटाओ
        document.querySelectorAll("#pageA .accordion").forEach(acc => {
            if (acc !== accordion) {
                acc.classList.remove("active");
                acc.classList.remove("open");
                acc.nextElementSibling.style.display = "none";
            }
        });
        // नया accordion active

        accordion.classList.add("active");

        if (openAccordion) {
            accordion.classList.add("open");
            panel.style.display = "block";
        } else {
            accordion.classList.remove("open");
            panel.style.display = "none";
        }

        // केवल तभी currentAccordion बनाओ जब accordion खुला हो
        // this.currentAccordion = openAccordion ? accordion : null;
        fetch(page + ".html")
            .then(r => r.text())
            .then(html => {
                document.getElementById("contentBoxA").innerHTML = html;
            });

    }

};





//  <!-- Fancy box close -->

Fancybox.bind('[data-fancybox="gallery-a"]', {
    Toolbar: {
        display: [
            { id: "counter", position: "left" },
            "zoom",
            "slideshow",
            "fullscreen",
            "download",
            "thumbs",
            "close",
        ]
    },
    Thumbs: { autoStart: true }
});






// download 

const PageB = {

    // currentAccordion: null,

    showContent: function (btn, page, openAccordion = true) {

        // सभी button inactive
        document.querySelectorAll("#pageB .panel button").forEach(b => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        const panel = btn.closest(".panel");
        const accordion = panel.previousElementSibling;

        // पहले active accordion बंद
        // पहले वाले active accordion को पूरी तरह हटाओ
        document.querySelectorAll("#pageB .accordion").forEach(acc => {
            if (acc !== accordion) {
                acc.classList.remove("active");
                acc.classList.remove("open");
                acc.nextElementSibling.style.display = "none";
            }
        });

        // नया accordion active
        accordion.classList.add("active");

        if (openAccordion) {
            accordion.classList.add("open");
            panel.style.display = "block";
        } else {
            accordion.classList.remove("open");
            panel.style.display = "none";
        }

        // this.currentAccordion = openAccordion ? accordion : null;

        const box = document.getElementById("contentBoxB");
        box.innerHTML = '<div class="loader"></div>';

        fetch(page + ".html")
            .then(r => r.text())
            .then(html => {
                box.innerHTML = html;
            });

    }

};


// Accordion Click

function initAccordionB() {
    const accordions = document.querySelectorAll("#pageB .accordion");
    accordions.forEach(acc => {
        acc.onclick = function () {
            const panel = this.nextElementSibling;
            // बाकी accordion बंद
            accordions.forEach(item => {
                if (item !== this) {
                    item.classList.remove("open");
                    item.classList.remove("active");
                    item.nextElementSibling.style.display = "none";
                }

            });

            // Toggle
            if (this.classList.contains("open")) {

                this.classList.remove("open");
                panel.style.display = "none";

            } else {

                this.classList.add("open");
                this.classList.add("active");
                panel.style.display = "block";
            }
        };
    });
}









function showPage(page) {

    const allLinks = document.querySelectorAll("[data-page]");
    const sections = document.querySelectorAll(".content");

    // Active हटाओ
    allLinks.forEach(l => l.classList.remove("active"));
    document.querySelectorAll(".dropdown .nav-link")
        .forEach(dd => dd.classList.remove("active"));

    // Active लगाओ
    document.querySelectorAll('[data-page="' + page + '"]')
        .forEach(l => l.classList.add("active"));

    // Parent dropdown active
    document.querySelectorAll('[data-page="' + page + '"]').forEach(link => {
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
            const parentToggle = parentDropdown.querySelector(".nav-link");
            if (parentToggle) parentToggle.classList.add("active");
        }
    });

    // Content दिखाओ
    sections.forEach(c => c.classList.remove("active"));

    const section = document.getElementById(page);
    if (section) section.classList.add("active");

    // Samajbook
    if (page === "samajbook") {

        setTimeout(() => {

            const acc = document.querySelector("#pageA .accordion");

            if (!acc) return;

            const panel = acc.nextElementSibling;
            const btn = panel.querySelector("button");

            if (btn) {
                PageA.showContent(btn, "a1", false);

                acc.classList.remove("open");
                acc.classList.add("active");
                panel.style.display = "none";
            }

        }, 100);

    }

    // Download PDF
    if (page === "downloadpdf") {

        setTimeout(() => {

            initAccordionB();

            const firstBtn = document.querySelector("#pageB .panel button");

            if (firstBtn) {

                PageB.showContent(firstBtn, "b1", false);

                const panel = firstBtn.closest(".panel");
                const acc = panel.previousElementSibling;

                acc.classList.remove("open");
                acc.classList.add("active");
                panel.style.display = "none";
            }

        }, 100);

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const offcanvasEl = document.querySelector(".offcanvas.show");

    if (offcanvasEl) {
        bootstrap.Offcanvas.getInstance(offcanvasEl)?.hide();
    }

    localStorage.setItem("activePage", page);
}








document.addEventListener("DOMContentLoaded", async function () {

    // पहले सभी Pages Load होंगे
    await loadAllPages();

    // Click Events
    document.addEventListener("click", function (e) {

        const link = e.target.closest("[data-page]");

        if (!link) return;

        e.preventDefault();

        showPage(link.dataset.page);

    });

    // आखिर में Home दिखाओ
    showPage("home");

});
