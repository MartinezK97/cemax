document.addEventListener('DOMContentLoaded', () => {
    // Configuración por dispositivo
    const config = {
        desktop: {
            maxTilt: 20,
            sensitivity: 0.25,
            scale: 1.1,
            smoothFactor: 0.1,
            freezeThreshold: 0.02
        },
        mobile: {
            maxTilt: 25,
            sensitivity: 0.8,
            scale: 1.2,
            invert: true,
            smoothFactor: 0.12
        }
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isDesktop = !isIOS && !isAndroid && matchMedia('(pointer:fine)').matches;
    const currentConfig = isDesktop ? config.desktop : config.mobile;

    const portada = document.getElementById('background3d');
    if (!portada) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let animationFrameId = null;
    let isAnimating = false;

    const applyTransform = () => {
        if (Math.abs(targetX - currentX) > currentConfig.freezeThreshold || Math.abs(targetY - currentY) > currentConfig.freezeThreshold) {
            currentX += (targetX - currentX) * currentConfig.smoothFactor;
            currentY += (targetY - currentY) * currentConfig.smoothFactor;
            portada.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) scale(${currentConfig.scale})`;
            isAnimating = true;
            animationFrameId = requestAnimationFrame(applyTransform);
        } else {
            isAnimating = false;
        }
    };

    const startAnimation = () => {
        if (!isAnimating) {
            isAnimating = true;
            animationFrameId = requestAnimationFrame(applyTransform);
        }
    };

    if (isDesktop) {
        portada.style.backgroundImage = '../img/portada_h.webp';
        document.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

            targetX = xPos * currentConfig.maxTilt * currentConfig.sensitivity;
            targetY = yPos * currentConfig.maxTilt * currentConfig.sensitivity * -1;
            startAnimation();
        });
    } else {
        const handleOrientation = (e) => {
            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            let beta = clamp(e.beta, -currentConfig.maxTilt, currentConfig.maxTilt);
            let gamma = clamp(e.gamma, -currentConfig.maxTilt, currentConfig.maxTilt);
            if (currentConfig.invert) {
                beta = -beta;
                gamma = -gamma;
            }

            targetX = gamma * currentConfig.sensitivity;
            targetY = beta * currentConfig.sensitivity;
            startAnimation();
        };

        const initMobile = () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                }).catch(() => {
                    document.addEventListener('click', initMobile, { once: true });
                });
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        initMobile();
        document.addEventListener('click', initMobile, { once: true });
        document.addEventListener('touchstart', initMobile, { once: true });
    }

    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrameId);
    });
});
