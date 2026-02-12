document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Sticky Local Nav handling
    const localNav = document.getElementById('local-nav');
    const hero = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) { // Small threshold to trigger stuck style
            localNav.classList.add('stuck');
        } else {
            localNav.classList.remove('stuck');
        }
    });

    // Refined Demo Player Logic
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress');
    const currentStageText = document.getElementById('current-stage');
    const labelPills = document.querySelectorAll('.label-pill');
    const audio = document.getElementById('demo-audio');

    let isPlaying = false;
    let animationFrame;

    const stages = [
        { name: 'Original Source', time: 0 },
        { name: 'Field Recording', time: 10 },
        { name: 'Processed Output', time: 20 },
        { name: 'Original Source', time: 30 }
    ];

    function updatePlayerLayout() {
        if (!isPlaying) return;

        const duration = 40; // Assuming 40s total audio
        const progressPercent = (audio.currentTime / duration) * 100;

        if (audio.ended || progressPercent >= 100) {
            resetPlayer();
            playBtn.textContent = 'もう一度聴く';
            return;
        }

        progressBar.style.width = `${progressPercent}%`;

        // Update stage text and labels
        const currentStageIndex = Math.min(
            Math.floor(audio.currentTime / 10),
            stages.length - 1
        );

        if (currentStageText.textContent !== stages[currentStageIndex].name) {
            currentStageText.textContent = stages[currentStageIndex].name;
            updatePills(currentStageIndex % 3);
        }

        animationFrame = requestAnimationFrame(updatePlayerLayout);
    }

    function updatePills(index) {
        labelPills.forEach((pill, i) => {
            if (i === index) pill.classList.add('active');
            else pill.classList.remove('active');
        });
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '再開する';
            cancelAnimationFrame(animationFrame);
        } else {
            audio.play().catch(console.error);
            isPlaying = true;
            playBtn.textContent = '停止';
            updatePlayerLayout();
        }
    }

    function resetPlayer() {
        isPlaying = false;
        audio.pause();
        audio.currentTime = 0;
        progressBar.style.width = '0%';
        playBtn.textContent = '体験を再生';
        currentStageText.textContent = stages[0].name;
        updatePills(0);
        cancelAnimationFrame(animationFrame);
    }

    playBtn.addEventListener('click', togglePlay);

    // Pill interaction
    labelPills.forEach((pill, index) => {
        pill.addEventListener('click', () => {
            audio.currentTime = index * 10;
            if (!isPlaying) {
                togglePlay();
            } else {
                updatePills(index);
                currentStageText.textContent = stages[index].name;
            }
        });
    });

    // Smooth anchor scrolling for Local Nav
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = localNav.offsetHeight;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
