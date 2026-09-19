document.addEventListener("DOMContentLoaded", () => {
    // 1. Hover Elastic-Spring effect on Technical Stack and Project Cards
    const cards = document.querySelectorAll(".glass");
    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            anime({
                targets: card,
                scale: 1.02,
                translateY: -4,
                borderColor: "rgba(34, 211, 238, 0.4)",
                duration: 600,
                easing: "easeOutElastic(1, .6)"
            });
        });

        card.addEventListener("mouseleave", () => {
            anime({
                targets: card,
                scale: 1.0,
                translateY: 0,
                borderColor: "rgba(255, 255, 255, 0.08)",
                duration: 400,
                easing: "easeOutQuad"
            });
        });
    });

    // 2. Numeric Stagger Counters with Intersecting Trigger
    const numericCards = document.querySelectorAll(".stat-value");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endVal = parseInt(target.getAttribute("data-target-value"), 10);

                anime({
                    targets: target,
                    innerHTML: [0, endVal],
                    round: 1,
                    easing: "easeOutExpo",
                    duration: 2000,
                    suffix: "%"
                });
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    numericCards.forEach(card => observer.observe(card));
});
