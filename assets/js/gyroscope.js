document.addEventListener('DOMContentLoaded', () => {
    // Configuración por dispositivo
    const config = {
        desktop: {
            maxTilt: 20,
            sensitivity: 0.25,
            scale: 1.1,
            smoothFactor: 0.12,
            freezeThreshold: 0.03
        },
        mobile: {
            maxTilt: 20,
            sensitivity: 0.75,
            scale: 1.25,
            invert: true,
            smoothFactor: 0.15
        }
    };

    // Detección mejorada
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isDesktop = !isIOS && !isAndroid && matchMedia('(pointer:fine)').matches;
    const currentConfig = isDesktop ? config.desktop : config.mobile;

    // Elemento principal
    const portada = document.getElementById('background3d');
    if (!portada) return;

    // Sistema de animación
    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const applyTransform = () => {
        currentX += (targetX - currentX) * currentConfig.smoothFactor;
        currentY += (targetY - currentY) * currentConfig.smoothFactor;

        portada.style.transform = `
            rotateX(${currentY}deg)
            rotateY(${currentX}deg)
            scale(${currentConfig.scale})
        `;

        rafId = requestAnimationFrame(applyTransform);
    };

    // Lógica Desktop
    if (isDesktop) {
        portada.style.backgroundImage = '../img/portada_h.webp';
        const handleMouseMove = (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

            targetX = xPos * currentConfig.maxTilt * currentConfig.sensitivity;
            targetY = yPos * currentConfig.maxTilt * currentConfig.sensitivity * -1;

            if (Math.abs(targetX) < currentConfig.freezeThreshold) targetX = 0;
            if (Math.abs(targetY) < currentConfig.freezeThreshold) targetY = 0;
        };

        document.addEventListener('mousemove', handleMouseMove);
        applyTransform();
    }
    // Lógica Mobile
    else {
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
        };

        // Intento de activación automática
        const initMobile = () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permission => {
                        if (permission === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                            applyTransform();
                        }
                    })
                    .catch(() => {
                        // En iOS fallará hasta que el usuario toque la pantalla
                        document.addEventListener('click', initMobile, { once: true });
                    });
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
                applyTransform();
            }
        };

        // Intento inicial (funcionará en Android)
        initMobile();

        // Respaldo para iOS (activación con primer toque)
        document.addEventListener('click', initMobile, { once: true });
        document.addEventListener('touchstart', initMobile, { once: true });
    }

    // Limpieza
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(rafId);
    });
});