window.addEventListener("load", function () {
    const gallery = document.getElementById("gallery");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    // Seleccionar la primera imagen
    const img = document.querySelector("#gallery img");

    if (!img) { console.log("No img"); return; }// Si no hay imagen, salir

    // Obtener márgenes convertidos a píxeles
    const style = getComputedStyle(img);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    // Calcular ancho total (imagen + márgenes)
    const totalWidth = img.offsetWidth + margin;

    prevButton.addEventListener("click", () => {
        gallery.scrollBy({
            left: -totalWidth,
            behavior: "smooth"
        });
    });

    nextButton.addEventListener("click", () => {
        gallery.scrollBy({
            left: totalWidth,
            behavior: "smooth"
        });
    });
});