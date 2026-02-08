const ui = {
    init(){
        this.gallery();
        this.accordion();
    },
    accordion(){
        $('.accordion-list>li button').click(function(){
            $('.accordion-list>li button').not(this).parent().removeClass('active');
            $('.accordion-list>li button').not(this).parent().find('.accordion-content').removeClass('show');
            $('.accordion-list>li button').not(this).parent().find('.accordion-content').slideUp();
            $(this).parent().toggleClass('active');
            if($(this).parent().hasClass('active')){
                $(this).parent().find('.accordion-content').slideDown(function(){
                    $(this).addClass('show');
                });
            }else{
                const $this = $(this);
                $(this).parent().find('.accordion-content').removeClass('show');
                setTimeout(function(){
                    $this.parent().find('.accordion-content').slideUp();
                }, 200);
            }
        });
    },
    gallery(){
     
    }
}
$(function(){
     // GSAP ScrollTrigger 등록
     gsap.registerPlugin(ScrollTrigger);

     // 섹션 타이틀 애니메이션
     gsap.utils.toArray('.section-header').forEach(title => {
         gsap.fromTo(title, 
             {
                 y: 80,
                 opacity: 0
             },
             {
                 y: 0,
                 opacity: 1,
                 duration: 1.2,
                 ease: "power3.out",
                 scrollTrigger: {
                     trigger: title,
                     start: "top 80%",
                     end: "bottom 20%",
                     toggleActions: "play none none reverse"
                 }
             }
         );
     });

       
    gsap.utils.toArray(`
        .accordion-list>li, 
        .media-wrap .faq .faq-box h4,
        .media-wrap .gallery .gallery-list .gallery-item`)
    .forEach(summary => {
        gsap.fromTo(summary, 
            {
                y: 40,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                delay: 0.2,
                scrollTrigger: {
                    trigger: summary,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });


    ui.init();
});