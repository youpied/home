document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Demo Player Logic
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress');
    const currentStageText = document.getElementById('current-stage');
    const pills = document.querySelectorAll('.pill');
    const visualizer = document.getElementById('visualizer');

    // Create visualizer bars
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '10px';
        visualizer.appendChild(bar);
    }

    const bars = document.querySelectorAll('.visualizer-bar');
    let isPlaying = false;
    let progress = 0;
    let animationFrame;

    const stages = [
        { name: '1. 音源 (Original Source)', duration: 10 },
        { name: '2. 録音 (Field Recording)', duration: 20 },
        { name: '3. 加工済み (Processed Output)', duration: 30 },
        { name: '4. 音源 (Original Source)', duration: 40 }
    ];

    const audio = document.getElementById('demo-audio');

    function updateVisualizer() {
        if (!isPlaying) return;

        bars.forEach(bar => {
            const height = Math.random() * 80 + 10;
            bar.style.height = `${height}%`;
        });

        requestAnimationFrame(updateVisualizer);
    }

    function animate() {
        if (!isPlaying) return;

        // Sync visual progress with audio time
        const duration = 40; // Total duration in seconds
        progress = (audio.currentTime / duration) * 100;

        if (audio.ended || progress >= 100) {
            progress = 100;
            progressBar.style.width = '100%';
            isPlaying = false;
            playBtn.textContent = 'Replay';
            bars.forEach(bar => bar.style.height = '10px');
            currentStageText.textContent = "体験終了";
            return;
        }

        progressBar.style.width = `${progress}%`;

        // Update stage text and pills based on audio time
        const currentStageIndex = Math.min(
            Math.floor(audio.currentTime / 10),
            stages.length - 1
        );

        currentStageText.textContent = stages[currentStageIndex].name;
        updatePills(currentStageIndex);

        animationFrame = requestAnimationFrame(animate);
    }

    function playExperience() {
        if (isPlaying) {
            resetPlayer();
            return;
        }

        isPlaying = true;
        playBtn.textContent = 'Reset Experience';
        audio.play().catch(e => console.log("Audio play failed: ", e));
        updateVisualizer();
        animate();
    }

    function resetPlayer() {
        isPlaying = false;
        cancelAnimationFrame(animationFrame);
        audio.pause();
        audio.currentTime = 0;
        progress = 0;
        progressBar.style.width = '0%';
        playBtn.textContent = 'Play Experience';
        currentStageText.textContent = stages[0].name;
        updatePills(0);
        bars.forEach(bar => bar.style.height = '10px');
    }

    function updatePills(index) {
        pills.forEach((pill, i) => {
            if (i === index) pill.classList.add('active');
            else pill.classList.remove('active');
        });
    }

    // Add click listeners to pills
    pills.forEach((pill, index) => {
        pill.addEventListener('click', () => {
            const stageTime = index * 10; // 10s per stage
            audio.currentTime = stageTime;

            if (!isPlaying) {
                // If not playing, start it
                playExperience();
            } else {
                // Update text and highlight immediately if already playing
                currentStageText.textContent = stages[index].name;
                updatePills(index);
            }
        });
    });

    playBtn.addEventListener('click', playExperience);
});
