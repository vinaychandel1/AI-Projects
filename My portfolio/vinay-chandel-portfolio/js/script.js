// Cinematic Experience
document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const progress = document.getElementById('progress');
    setTimeout(() => { progress.style.width = '100%'; }, 100);
    setTimeout(() => { document.getElementById('preloader').style.opacity = '0'; }, 1500);
    setTimeout(() => { document.getElementById('preloader').style.display = 'none'; }, 2500);

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 16 + 'px';
        cursor.style.top = e.clientY - 16 + 'px';
    });

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
