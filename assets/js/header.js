document.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    const servicios = document.querySelector("#servicios");
    const contact = document.querySelector("#contact_header_btn")
    const headerHeight = 8 * 16; // 4rem en píxeles
    const serviciosTop = servicios.getBoundingClientRect().top;
    const triggerPoint = headerHeight; // Cuando el borde superior de #servicios toca el borde inferior de header

    let progress = Math.min(1, Math.max(0, (triggerPoint - serviciosTop) / triggerPoint));

    header.style.transition = "background-color 0.3s ease, backdrop-filter 0.3s ease";
    header.style.backgroundColor = `rgba(251, 194, 107, ${progress * 0.99})`;
    if (progress >= 1) {
        contact.style.background = "#fffce5"
    } else {
        contact.style.background = "#fbc26b"

    }
    console.log(progress)
    // header.style.backdropFilter = `blur(${progress * 10}px)`;
});
