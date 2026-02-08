const header = {
    init(){
        this.fixed();
        $('.mobile-menu').click(function(){
            $('html,body').toggleClass('hidden');
            $('#header').toggleClass('menu-open');
            $('#aside, .aside-mask').toggleClass('show');
        });

        $('.depth-1 li>a').click(function(e){
            if($(this).siblings('.depth-2').length > 0){
                e.preventDefault();
                if($(window).width() >= 1200){
                    $(this).parent().toggleClass('active');
                    $(this).siblings('.depth-2').toggleClass('show');
                }else{
                    $(this).siblings('.depth-2').slideToggle();
                    $(this).parent().toggleClass('active');
                }
            }
        });

        $('.btn-lang').click(function(){
            $(this).siblings('.lang-list').fadeToggle('show');
        });

        // 다른 곳 클릭시 lang-list 닫기
        $(document).click(function(e){
            if (!$(e.target).closest('.lang').length) {
                $('.lang-list').fadeOut();
            }
        });

        // 1200px 이상에서 다른 곳 클릭시 서브메뉴 닫기
        $(document).click(function(e){
            if ($(window).width() >= 1200) {
                if (!$(e.target).closest('.depth-1').length) {
                    $('.depth-2').removeClass('show');
                    $('.depth-1 li').removeClass('active');
                }
            }
        });

        // 서브메뉴 내부 클릭시 버블링 방지
        $('.depth-2').click(function(e){
            e.stopPropagation();
        });

        // lang-list 내부 클릭시 버블링 방지
        $('.lang-list').click(function(e){
            e.stopPropagation();
        });
      
    },
    fixed(){
        $(window).scroll(function(){
            if($(window).scrollTop() > 100){
                $('#header').addClass('fixed');
            }else{
                $('#header').removeClass('fixed');
            }
        });
    }
}
$(function(){
    header.init();


});