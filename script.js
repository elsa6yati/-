/* Grade 6 Moral & Civics — Chapter 4 Interactive Features */
(() => {
    "use strict";

    // 1. Shrink sticky navigation on scroll
    const header = document.getElementById("myHeader");
    const updateHeader = () => header?.classList.toggle("small", window.scrollY > 45);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // 2. Mobile navigation menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            });
        });

        document.addEventListener("click", event => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 3. Chapter 4 Quiz with visual feedback
    const quizForm = document.getElementById("quizForm");
    const quizResult = document.getElementById("quizResult");
    if (quizForm && quizResult) {
        const answers = { q1: "b", q2: "c", q3: "a", q4: "b" };

        quizForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = new FormData(quizForm);
            const keys = Object.keys(answers);
            const unanswered = keys.filter(key => !data.get(key));

            if (unanswered.length) {
                quizResult.style.color = "#c62828";
                quizResult.textContent = `ကျေးဇူးပြု၍ မေးခွန်း (${keys.length}) ခုလုံးကို ဖြေဆိုပြီးမှ အဖြေစစ်ဆေးပါ။`;
                return;
            }

            let score = 0;
            keys.forEach(key => {
                const card = quizForm.querySelector(`[data-question="${key}"]`);
                const isRight = data.get(key) === answers[key];
                if (isRight) score++;
                if (card) {
                    card.classList.remove("correct", "incorrect");
                    card.classList.add(isRight ? "correct" : "incorrect");
                }
            });

            quizResult.style.color = score >= 3 ? "#108c20" : "#b26a00";
            const message =
                score === 4 ? "အလွန်ကောင်းမွန်ပါသည်! အားလုံးမှန်ကန်ပါသည်။" :
                score >= 2 ? "ကောင်းမွန်ပါသည်! သင်ခန်းစာကို ပြန်လည်ဖတ်ရှုပြီး ထပ်မံကြိုးစားကြည့်ပါ။" :
                "သင်ခန်းစာကို သေချာပြန်ဖတ်ပြီး ထပ်မံဖြေဆိုကြည့်ပါ။";

            quizResult.textContent = `သင်၏ရမှတ်မှာ ၄ မှတ်တွင် ${score} မှတ် ဖြစ်ပါသည်။ ${message}`;
        });

        quizForm.addEventListener("reset", () => {
            quizResult.textContent = "";
            quizForm.querySelectorAll(".quiz-card").forEach(card => {
                card.classList.remove("correct", "incorrect");
            });
        });
    }

    // 4. Gentle floating leaves & peace particles in the hero banner
    const canvas = document.getElementById("peaceCanvas");
    if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        const particles = [];
        const PARTICLE_COUNT = 26;

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createParticle(randomY = true) {
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : -20,
                size: 5 + Math.random() * 7,
                speedY: 0.4 + Math.random() * 0.7,
                speedX: (Math.random() - 0.5) * 0.5,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.02,
                opacity: 0.18 + Math.random() * 0.35
            };
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle(true));
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.angle) * 0.3;
                p.angle += p.spin;

                if (p.y > height + 20) {
                    Object.assign(p, createParticle(false));
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = `rgba(155, 255, 168, ${p.opacity})`;
                // Draw a soft olive-leaf shape
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
})();

