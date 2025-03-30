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
            maxTilt: 20,
            sensitivity: 0.8,
            scale: 1.2,
            invert: true,
            smoothness: 0.15
        }
    };

    // Detección de dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isDesktop = !isMobile && matchMedia('(pointer:fine)').matches;
    const currentConfig = isDesktop ? config.desktop : config.mobile;

    // Elemento principal
    const portada = document.getElementById('background3d');
    if (!portada) return;

    // Sistema común de animación
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

            if (Math.abs(xPos) < currentConfig.freezeThreshold) targetX = 0;
            else targetX = xPos * currentConfig.maxTilt * currentConfig.sensitivity;

            if (Math.abs(yPos) < currentConfig.freezeThreshold) targetY = 0;
            else targetY = yPos * currentConfig.maxTilt * currentConfig.sensitivity * -1;
        };

        document.addEventListener('mousemove', handleMouseMove);
        applyTransform();
        return;
    }

    // Lógica para Mobile
    const handleOrientation = (e) => {
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val || 0));

        let beta = clamp(e.beta, -currentConfig.maxTilt, currentConfig.maxTilt);
        let gamma = clamp(e.gamma, -currentConfig.maxTilt, currentConfig.maxTilt);

        if (currentConfig.invert) {
            beta = -beta;
            gamma = -gamma;
        }

        targetX = gamma * currentConfig.sensitivity;
        targetY = beta * currentConfig.sensitivity;
    };

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