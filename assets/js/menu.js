$(document).ready(() => {
    $(".btn-menu").click(() => {
        $("#menu").toggleClass('hide')
        $("#menu .btn-menu i").toggleClass('fa-bars fa-times')
    })

    // Cerrar menú al hacer clic fuera
    $(document).click(function (e) {
        if (!$(e.target).closest('#menu').length && !$(e.target).closest('.btn-menu').length) {
            if (!$("#menu").hasClass('hide')) {
                $("#menu").addClass('hide');
                $("#menu .btn-menu i").removeClass('fa-times').addClass('fa-bars');
            }
        }
        // Si el clic fue en un enlace del menú (opción)
        else if ($(e.target).closest('#menu a').length) {
            $("#menu").addClass('hide');
            $("#menu .btn-menu i").removeClass('fa-times').addClass('fa-bars');
        }
    });


    setTimeout(() => {
        $(".ButtonBase__Ellipsis-sc-11c179a3-5.haApKJ").text("Agregar reseña").css('color', '#ffffff')
        $(".EkQXg").css({
            'background': '#fff',
            'box-shadow': '0 0 5px #0003',
            'margin': '5px'
        })

        $(".dIBzjh").css({
            'background': '#fff !important'
        })
        $('.elfsight-app-c258c807-c999-48fa-acb4-990dd3b6d0b5.eapps-widget.eapps-widget-show-toolbar > a').css({ 'display': 'none !important', 'opacity': '0 !important' })
    }, 4000);

})