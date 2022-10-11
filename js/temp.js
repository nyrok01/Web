$(function (){
    $(document).on('hidden.bs.toast',function (){
        let toasts = $(this).find('.toast');
        $(toasts[0]).detach();
    });
    $('.accordion-header').on('click', function(e) {
        e.preventDefault();
        let target = $(this).next('.accordion-body.collapse'),
                ic = $(this).children('i.fas');
        if (target.hasClass('show')) {
            target.collapse('hide');
            ic.removeClass('fa-chevron-down');
            ic.addClass('fa-chevron-up');
        } else {
            target.collapse('show');
            ic.removeClass('fa-chevron-up');
            ic.addClass('fa-chevron-down');
        }
    });
});
$(document).ready(function (){
    $('.j-moar').on('click',function (e){
        e.preventDefault;
        showToast("Обновление корзины","Товар добавлен в корзину.")
        return false
    });
    $('.j-like').on('click',function (e){
        showToast("Обновление избранного","Добавлено в избранные товары.");
    });
    $('.jb-del').on('click',function (e){
        e.preventDefault;
        showToast("Удаление товара", "Товар удален из корзины.")
        let p = $(e.target).closest('.b-item');
        if(p)
            p.slideUp( "easy", function() {
                p.detach();
            });
//        $(this).parent('.b-item').hide();
        return false
    });
    //корректировка отступа статик-топ меню
    $(window).scroll(function(){
        if ($(this).scrollTop() > 200) {
            $('.scroll-margin').addClass('pt-5');
        } 
        else {
            $('.scroll-margin').removeClass('pt-5');
        }
    });
})
function showToast(h,t,d,s){
    if(!h){
        h="Уведомление";
    }
    if(!t){
        t="";
    }
    if(!d){
        d=4500;
    }
    if(!s){
        s=true;
    }
    let toast = '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="min-width: 250px;" data-animation="' + s + '" data-delay="' + d + '">'
            +'<div class="toast-header">'
                +'<strong class="mr-auto">'+h+'</strong>'
                +'<small>только что</small>'
                +'<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">'
                    +'<span aria-hidden="true">&times;</span>'
                +'</button>'
            +'</div>'
            +'<div class="toast-body">'
            +t
            +'</div>'
        +'</div>'
        +'';
    $('#j-toaster').append(toast);
    $('.toast').toast('show');
}