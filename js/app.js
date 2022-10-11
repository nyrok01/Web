// Данные корзины
var basket;  
get_basket();
// Данные пользователя
var user;
get_user();
// Куки на месяц
const COOKIE_EXPIRES = 30;
// Минимальная длина пароля
const MIN_PASSWORD_LENGTH = 5;
// Минимальная длина логина
const MIN_LOGIN_LENGTH = 5;
var carousel;

$(function() {
    
    $(window).on('resize', function() {
        winResize();
//        console.log(device)
    });
    
    carousel =  $('#j-top-carousel');
    carousel.carousel();
    
    winResize();
    
    $('.go-to-top').on('click', function(ev) {
        ev.preventDefault();
        $("html,body").stop().animate({scrollTop: 0}, 800);
        return false;
    });
    
    $('[data-toggle="collapse"]').on('click', function() {
        let btn = $(this),
                target = btn.data('target');
        if ($(target).hasClass('show')) {
            btn.removeClass('active');
            btn.blur();
        } else {
            if (target !== "#j-nav") {
                $('[data-toggle="collapse"]').removeClass('active');
                btn.addClass('active');
            }
        }
    });
    
    $("#alone-search").on('click', function(e) {
        let icon = $('#alone-search i.fa');
        if ($('#searchPanel').hasClass('show')) {
            icon.removeClass('fa-search-minus');
            icon.addClass('fa-search');
        } else {
            icon.removeClass('fa-search');
            icon.addClass('fa-search-minus');
        }
        if ($('#j-nav').hasClass('show')) {
            if ($('#searchPanel').hasClass('show') == false) {
                $("#j-nav").collapse('hide');
            }
        }
    });
    // hand-resize non-quad image!!!
//    $('.card-img-top').each(function() {
//        let im = $(this);
//        if (im.width() !== im.height()) {
//            im.height(im.width());
//        }
//    });
    $('[aria-controls="desc-plus"], [aria-controls="info-plus"], [aria-controls="back-plus"]').on('click', function() {
        let th = $(this);
        let ta = th.attr('href');
        if ($(ta).hasClass('show')) {
            th.text('Читать дальше');
        } else {
            th.text('Свернуть');
        }
    });
    
    var cName = 'police';
    let cook = Cookies.get(cName);
    if (cook) {
        $('.police').addClass('d-none');
    } else {
        $('.police').removeClass('d-none');
        $("#acc-cookie").on('click', function() {
            Cookies.set(cName, 'accepted', {expires: COOKIE_EXPIRES, path: '/'});
        });
    }
    
    // Очистка тостиков
    $(document).on('hidden.bs.toast',function (){
        let toasts = $(this).find('.toast');
        $(toasts[0]).detach();
    });   
    
    /*
     * Скрытие полезного текста в блоке подписки
     */
    $("#subsc").on('focus',function (){
         $('.info_sub').removeClass('d-none');
     }).on('blur',function(){
         setTimeout(function(){
             $('.info_sub').addClass('d-none');
         },1200);
     });
     
    // Подписка
    $('#subsc-btn').click(function(){
        var email = $('#subsc').val();
        if(!validate_email(email)){
            showToast('Ошибка', 'Укажите правильный email.');
            return false;
        }
        var postdata = {email: email, csrf: $('input[name=scrf]').val()};
        
        $.post('/auth/first_register', postdata)
                .done(function(response){
                    $('#j-subscribe').hide(200);
                    showToast('Успешно', response);
                    // Редирект в профиль
                    setTimeout(function(){
                        window.location.href = '/account';
                    }, 2000);
                })
                .fail(function(response){
                    showToast('Ошибка', response.responseText);
                });
    });
     
});

$(document).ready(function (){
    hcorrect();
});


function hcorrect(){
    let body_height = $('body').height();
    let doc_height = $(document).height();
    if((doc_height - body_height) > 10){
        $('body').addClass('h-100');
    }
}
function winResize() {
    let pw = $(document).width();
    if (pw < 990 || $('html').hasClass('portrait')) {        
        carousel.carousel('dispose');
        $('.only-mobile').show();
        $('.only-desktop').hide();
    } else if ($('html').hasClass('desktop')) {
        $('.only-mobile').hide();
        $('.only-desktop').show();
    } else {
        carousel.carousel(0);
        carousel.carousel({'ride': false, 'touch': false, 'keyboard': false});
        carousel.carousel('dispose');
        $('.only-mobile').show();
        $('.only-desktop').hide();
    }
    card_text_ellipse("#j-top-cards");
}
;

function preloadActive() {
    let pre = $(".preloader");
    if (pre.hasClass('invisible')){
        pre.toggleClass('invisible');
    }
}

// Эллипс для readmore
function card_text_ellipse(cr) {
    let all = $(cr);
    $.each(all, function() {
        let $elem = $(this);
        let x = $elem.children('p').css('width', ($elem.width() - 15) + 'px');
    });
}
;

// Загрузка данных корзины
function get_basket() {
    $.getJSON('/basket/load_data', {_: new Date().getTime()}, function(response) {
        basket = response;
    });        
}
;

// Загрузка данных пользователя
function get_user() {
    $.getJSON('/auth/load_data', {_: new Date().getTime()}, function(response) {
        user = response;
        // Установка верхней иконки аккаунта
        set_user_menu();
    });        
}
;

function showToast(h,t,d,s){
    
    switch(h) {
        case 'success':
            h = 'Успешно';
            break;
        case 'error':
            h = 'Ошибка';
            break;
        default: 
            h = 'Уведомление';
    }
    
    t = t || '';
    d = d || 4500;
    s = s || true;
    
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
;

function set_user_menu() {
    let a = $('#top-menu-user');
    let i = a.find('i');    
    if (user) {
        // Пользователь залогинен
        a.prop({href: '/account', title: 'Мой аккаунт'});
        i.prop('class', 'fa fa-user');
        $('#logout-btn').show();
    }
    else {
        // Неизвестный пользователь
        a.prop({href: '/auth/login', title: 'Войти или зарегистрироваться'});
        i.prop('class', 'fas fa-sign-in-alt');
        $('#logout-btn').hide();
    }    
}
;

// Валидация мыла
function validate_email (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
;

// Добавление в Избранное 
function add_to_favorites(product_id, size_id){
    if (!size_id) {
        showToast('error', 'Не выбран размер');
        return false;
    }
    
    // Пользователь залогинился
    if (user) {
        let postdata = {product_id: product_id, size_id: size_id};
        $.post('/account/save/add_favorite', postdata)
                .done(function(){
                    showToast('success','Добавлено в избранные товары.');
        })
                .fail(function(response){
                    showToast('error', response.responseText);
        }); 
    }
    
    // Хрен с горы
    else {
        let data = {product_id: product_id, size_id: size_id};
        let favorites = Cookies.get('favorites');
        if (favorites && favorites.length) {
            favorites = JSON.parse(favorites);
        }            
        else {
            favorites = [];
        }            
        favorites = favorites.filter(function(row) {
            return row.product_id != product_id || row.size_id != size_id;
        });
        favorites.push(data);            
        Cookies.set('favorites', JSON.stringify(favorites), {expires: COOKIE_EXPIRES, path: '/'});            
        showToast('success','Добавлено в избранные товары.');
    }        
}
;

/**
 * Склонение окончания существительного
 * @param {Int} number
 * @param {Array} endingArray - массив окончаний с колвичествами 1,4,5
 * @returns {String} оекончание
 */
function getNumEnding (number, endingArray) {
  number = number % 100;
  var ending;
  if (number >= 11 && number <= 19) {
    ending = endingArray[2];
  } else {
    var i = number % 10;
    switch (i) {
      case (1): ending = endingArray[0]; break;
      case (2):
      case (3):
      case (4): ending = endingArray[1]; break;
      default: ending = endingArray[2];
    }
  }
  return ending;
}
;

  /**
  * Только цифры!
  */
$(document).on('keyup', 'input.digits-only', function() {
    var val = $(this).val();

    if(val.length && isNaN(val)) {
      val = val.replace(/,/, '.');
      val = val.replace(/[^0-9\.]/g, '');

      if(val.split(/[\.]/).length > 2) {
        val = val.replace(/[\.]+$/, '');
      }
    }
    $(this).val(val);
});
var desc_i = $('#j-fa-desc');
var dost_i = $('#j-fa-dost');
$('#desc_collapse').on('hidden.bs.collapse', function () {
    desc_i.removeClass('fa-minus');
    desc_i.addClass('fa-plus');
}).on('shown.bs.collapse', function () {
    desc_i.removeClass('fa-plus');
    desc_i.addClass('fa-minus');
})
$('#dost_collapse').on('hidden.bs.collapse', function () {
    dost_i.removeClass('fa-minus');
    dost_i.addClass('fa-plus');
}).on('shown.bs.collapse', function () {
    dost_i.removeClass('fa-plus');
    dost_i.addClass('fa-minus');
})