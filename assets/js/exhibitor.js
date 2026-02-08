const form = {
    total_price:0,
    vat:0,
    init(){
        this.service_count();
    },
    service_count(){
        const $root = $('.service-form');
        $root.on('input change', '.service-count', function(){
            const count = parseInt($(this).val(), 10) || 0;
            const price = parseInt($(this).data('price'), 10) || 0;

            if(count > 0){
                $(this).addClass('has-value');
            }else{
                $(this).removeClass('has-value');
            }

            $(this).closest('.service-item').find('.service-price').val((count * price).toLocaleString());
            
            // 총합 갱신
            let totalCount = 0;
            let totalPrice = 0;
            $root.find('.service-count').each(function(){
                const c = parseInt($(this).val(), 10) || 0;
                const p = parseInt($(this).data('price'), 10) || 0;
                totalCount += c;
                totalPrice += c * p;
            });
            form.total_price = totalPrice;
            form.cal();
        });
        
    },
    cal(){
        const price = this.total_price;
        this.vat = (price > 0) ? price * 0.1 : 0;
        this.total_price = (price > 0) ? price + this.vat : 0;
        $('#service-total').text(this.total_price.toLocaleString());
    },
}

$(function(){
    form.init();

    // GSAP ScrollTrigger 등록
    gsap.registerPlugin(ScrollTrigger);

    // 섹션 타이틀 애니메이션
    gsap.utils.toArray('.section-header, .exhibition-layout .img').forEach(title => {
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
        .pre-register .pre-reg-step ol li,
        .booth-intro .booth-list .booth-item,
        .booth-intro .early-bird,
        .booth-detail-list>li,
        .support-info .table-scroll,
        .fee-info .fee-list>li,
        .facility-info .table-scroll, 
        .service-info .detail-header,
        .service-list li,
        .service-form`
        )
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

	if($('.booth-slide').length > 0){
		let boothSwiper = null;
		const initBoothSwiper = () => {
			if(boothSwiper) return;
			boothSwiper = new Swiper('.booth-slide', {
				loop: false,
				speed: 800,
				slidesPerView: 'auto',
				spaceBetween: 20
			});
		};

		const destroyBoothSwiper = () => {
			if(boothSwiper){
				boothSwiper.destroy(true, true);
				boothSwiper = null;
			}
		};

		const updateBoothSwiper = () => {
			const w = window.innerWidth || document.documentElement.clientWidth;
			if(w >= 800 && w < 1200){
				initBoothSwiper();
			}else{
				destroyBoothSwiper();
			}
		};

		updateBoothSwiper();
		$(window).on('resize orientationchange', function(){
			updateBoothSwiper();
		});
	}
    

});