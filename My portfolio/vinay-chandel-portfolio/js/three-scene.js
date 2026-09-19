class ThreeHeroConstellation {
    constructor() {
        this.canvas = document.getElementById("three-hero-canvas");
        if (!this.canvas) return;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 400;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.particlesCount = 150;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particlesCount * 3);
        this.velocities = [];

        // Lines for neural network effect
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array(this.particlesCount * 2 * 3);

        for (let i = 0; i < this.particlesCount; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * 800;
            this.positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

            this.velocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            });
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        const material = new THREE.PointsMaterial({
            size: 3,
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, material);
        this.scene.add(this.points);

        // Line material for neural connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.2
        });
        this.lines = new THREE.LineSegments(this.lineGeometry, lineMaterial);
        this.scene.add(this.lines);

        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener("resize", () => this.onWindowResize());
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));

        this.animate();
        this.setupIntersectionObserver();
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        this.mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (this.isPaused) return;
        requestAnimationFrame(() => this.animate());

        this.points.rotation.y += 0.001;
        this.points.rotation.x += (this.mouseY * 0.005 - this.points.rotation.x) * 0.05;
        this.points.rotation.y += (this.mouseX * 0.005 - this.points.rotation.y) * 0.05;

        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < this.particlesCount; i++) {
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;
            positions[i * 3 + 2] += this.velocities[i].z;

            if (Math.abs(positions[i * 3]) > 400) this.velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 400) this.velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 400) this.velocities[i].z *= -1;
        }
        this.geometry.attributes.position.needsUpdate = true;

        // Neural network connections
        let lineIdx = 0;
        for (let i = 0; i < this.particlesCount; i++) {
            for (let j = i + 1; j < this.particlesCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 100) {
                    this.linePositions[lineIdx++] = positions[i * 3];
                    this.linePositions[lineIdx++] = positions[i * 3 + 1];
                    this.linePositions[lineIdx++] = positions[i * 3 + 2];
                    this.linePositions[lineIdx++] = positions[j * 3];
                    this.linePositions[lineIdx++] = positions[j * 3 + 1];
                    this.linePositions[lineIdx++] = positions[j * 3 + 2];
                }
            }
        }
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions.slice(0, lineIdx), 3));
        this.lineGeometry.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }

    setupIntersectionObserver() {
        this.isPaused = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isPaused = !entry.isIntersecting;
                if (entry.isIntersecting) {
                    this.animate();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(document.getElementById("home"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ThreeHeroConstellation();
});
