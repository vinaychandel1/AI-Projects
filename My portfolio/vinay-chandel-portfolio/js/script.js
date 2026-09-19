document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // 1. Preloader Animation
    const preloader = document.getElementById("preloader");
    const progress = document.getElementById("progress");

    let count = 0;
    const interval = setInterval(() => {
        count += 5;
        progress.style.width = count + "%";
        if (count >= 100) {
            clearInterval(interval);
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                ease: "power3.inOut",
                onComplete: () => {
                    preloader.style.display = "none";
                    animateHero();
                }
            });
        }
    }, 50);

    // 2. Custom Cursor
    const cursor = document.getElementById("cursor");
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX - 12,
            y: e.clientY - 12,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    document.querySelectorAll("a, button, .project-card").forEach((elem) => {
        elem.addEventListener("mouseenter", () => {
            cursor.classList.add("scale-150", "bg-cyan-400/20");
        });
        elem.addEventListener("mouseleave", () => {
            cursor.classList.remove("scale-150", "bg-cyan-400/20");
        });
    });

    // 3. Hero Animations
    function animateHero() {
        gsap.from("#hero-title", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });
        gsap.from("#hero-subtitle", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power4.out"
        });
        gsap.from("#home .btn, #home a", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            delay: 0.5,
            ease: "power4.out"
        });
    }

    // 4. Reveal Animations for Sections
    gsap.utils.toArray("section").forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // 5. Interactive Floating Network Nodes
    const paths = document.querySelectorAll(".network-path");
    paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    });
});
