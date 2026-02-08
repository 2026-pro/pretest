const exhibitor_modal = {
    init(){
        const $this = this;
        $('.exhibitor-item button').click(function(){
            const dataInfo = $(this).attr('data-info');
            const data = JSON.parse(dataInfo);
            $this.open(data);
        });
        
        $('.exhibitor-modal .btn-close').click(function(){
            $this.close();
        });
    },
    set(data){
        // 이미지 설정
        $('.exhibitor-modal .modal-content .img img').attr('src', data.image);
        
        // 테이블 데이터 동적 생성
        const $tbody = $('.exhibitor-modal .modal-content .info tbody');
        $tbody.empty(); // 기존 내용 제거
        
        // data 객체를 순회하면서 image가 아닌 항목들을 테이블로 생성
        Object.keys(data).forEach(key => {
            if (key !== 'image') {
                const $row = $('<tr>');
                $row.append(`<th class="sub-title">${key}</th>`);
                $row.append(`<td class="sub-title">${data[key]}</td>`);
                $tbody.append($row);
            }
        });
    },
    open(data){
        this.set(data);
        $('.exhibitor-modal').fadeIn();
    },
    close(){
        const $this = this;
        $('.exhibitor-modal').fadeOut(function(){
            $this.reset();
        });
    },
    reset(){
        $('.exhibitor-modal table td').text('');
    }
}

$(function(){
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
        .exhibition-items .item-list>li .title, 
        .exhibition-items .item-list>li li,
        .exhibition-items .item-list>li li,
        .exhibitor-tab,
        .exhibitor-item`)
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


    // tab slide
    const tabSwiper = new Swiper('.tab-slide', {
        loop: false,
        speed:800,
        slidesPerView:'auto',
        spaceBetween: 8,
        on: {
            init: function() {
                checkTabCenter();
            },
            resize: function() {
                checkTabCenter();
            }
        }
    });

    function checkTabCenter() {
        const windowWidth = window.innerWidth;
        const swiperContainer = document.querySelector('.exhibitor-tab .swiper-wrapper');
        const swiperSlides = document.querySelectorAll('.exhibitor-tab .swiper-slide');
        
        if (swiperContainer && swiperSlides.length > 0) {
            let totalContentWidth = 0;
            let spaceBetween = 8; 
            
            swiperSlides.forEach((slide, index) => {
                totalContentWidth += slide.offsetWidth;
                if (index < swiperSlides.length - 1) {
                    totalContentWidth += spaceBetween;
                }
            });
            
            if (windowWidth > totalContentWidth) {
                swiperContainer.style.justifyContent = 'center';
            } else {
                swiperContainer.style.justifyContent = 'flex-start';
            }
        }
    }

    window.addEventListener('resize', checkTabCenter);

    $('.exhibitor-tab .swiper-slide button').click(function(){
        $('.exhibitor-tab .swiper-slide button').not(this).removeClass('active');
        $(this).addClass('active');
        const filter = $(this).data('filter');
        if(!filter){
            $('.exhibitor-item').show();
        }else{
            $('.exhibitor-item').hide();
            $(`.exhibitor-item[data-filter=${filter}]`).show();
        }
    });

    exhibitor_modal.init();

    
});