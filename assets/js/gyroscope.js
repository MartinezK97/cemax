document.addEventListener('DOMContentLoaded', () => {
    // Configuración por dispositivo
    const config = {
        desktop: {
            maxTilt: 15,
            sensitivity: 0.25,
            scale: 1.1,
            smoothFactor: 0.12,
            freezeThreshold: 0.03
        },
        mobile: {
            maxTilt: 25,
            sensitivity: 0.8,
            scale: 1.2,
            invert: true,
            smoothFactor: 0.15
        }
    };

    // Detección mejorada de dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isDesktop = !isMobile && matchMedia('(pointer:fine)').matches;
    const currentConfig = isDesktop ? config.desktop : config.mobile;

    // Elemento principal
    const portada = document.getElementById('background3d');
    if (!portada) return;

    // Sistema de animación común
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

    // Lógica para Desktop
    if (isDesktop) {
        const handleMouseMove = (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

            targetX = xPos * currentConfig.maxTilt * currentConfig.sensitivity;
            targetY = yPos * currentConfig.maxTilt * currentConfig.sensitivity * -1;

            // Suavizado adicional para micro-movimientos
            if (Math.abs(targetX) < currentConfig.freezeThreshold) targetX = 0;
            if (Math.abs(targetY) < currentConfig.freezeThreshold) targetY = 0;
        };

        document.addEventListener('mousemove', handleMouseMove);
        applyTransform();
    }
    // Lógica para Mobile
    else {
        const handleOrientation = (e) => {
            if (!e.beta || !e.gamma) return;

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

        const initMobile = () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permission => {
                        if (permission === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                            applyTransform();
                        }
                    })
                    .catch(console.error);
            } else if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', handleOrientation);
                applyTransform();
            }
        };

        // Iniciar con interacción del usuario
        document.addEventListener('click', initMobile, { once: true });
        document.addEventListener('touchstart', initMobile, { once: true });
    }

    // Limpieza
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(rafId);
        if (isDesktop) {
            document.removeEventListener('mousemove', handleMouseMove);
        } else {
            window.removeEventListener('deviceorientation', handleOrientation);
        }
    });
});