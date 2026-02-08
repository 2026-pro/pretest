$(function(){
    // ===== GSAP =====
    gsap.registerPlugin(ScrollTrigger);
  
    // 섹션 타이틀
    gsap.utils.toArray('.section-header, .exhibition-layout .img').forEach((el) => {
      gsap.fromTo(el, { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
      });
    });
  
    // 섹션 요약 요소들
    gsap.utils.toArray(`
      .why-abcd .benefit-list li,
      .iam-list>li,
      .abcd-2025 .contents-info .img,
      .abcd-2025 .contents-info .info,
      .keyword-tab,
      .keyword-slide
    `).forEach((el) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
      });
    });
  
    // ===== Swiper =====
  
     const tabSwiper = new Swiper('.keyword-tab', {
        loop: false,
        speed: 800,
        breakpoints: {
          0:   { slidesPerView: 'auto', spaceBetween: 8 },
          800: { slidesPerView: 'auto', spaceBetween: 6 }
        },
        on: {
          init() { checkTabCenter(); },
          resize() { checkTabCenter(); }
        }
      });

    const keywordSwiper = new Swiper('.keyword-slide', {
      loop: true,
      speed: 800,
      // v10~v11 어느 쪽이든 안전한 최소 옵션
      autoplay: { delay: 3000, disableOnInteraction: false },
  
      breakpoints: {
        0:   { slidesPerView: 1, spaceBetween: 14 },
        800: { slidesPerView: 1, spaceBetween: 24 }
      },
  
      // init 시점에도 동기화(아래 updateTabActive가 정의된 뒤에도 한 번 더 호출함)
      on: {
        init(sw) { updateTabActive(sw.realIndex); }
      }
    });
  
   
  
    // 탭 클릭 → keyword 슬라이드 이동(루프 대응)
    document.querySelectorAll('.keyword-tab .swiper-slide').forEach((tabSlide, index) => {
      tabSlide.addEventListener('click', function(){
        if (keywordSwiper && keywordSwiper.slideToLoop) {
          keywordSwiper.slideToLoop(index);
        }
        updateTabActive(index);
      });
    });
  
    // keyword 슬라이드 변경 시 탭 동기화
    keywordSwiper.on('slideChange', function(){
      updateTabActive(this.realIndex);
    });
  
    // 초기 강제 동기화 (두 스와이퍼 생성/이벤트 바인딩 이후 한 번 더)
    updateTabActive(keywordSwiper.realIndex);
    requestAnimationFrame(() => updateTabActive(keywordSwiper.realIndex));
  
    // ===== 유틸 =====
    function updateTabActive(activeIndex){
      const tabs = document.querySelectorAll('.keyword-tab .swiper-slide');
      tabs.forEach((el) => el.classList.remove('active'));
  
      const target = tabs[activeIndex];
      if (target) target.classList.add('active');
  
      // tabSwiper가 준비된 경우에만 이동
      if (tabSwiper && typeof tabSwiper.slideTo === 'function') {
        tabSwiper.slideTo(activeIndex, 0);
      }
    }
  
    function checkTabCenter(){
      const wrapper = document.querySelector('.keyword-tab .swiper-wrapper');
      const slides = document.querySelectorAll('.keyword-tab .swiper-slide');
      if (!wrapper || !slides.length) return;
  
      // 현재 breakpoint의 spaceBetween 고려(모바일 8 / 데스크톱 6)
      const winW = window.innerWidth;
      const spaceBetween = winW >= 800 ? 6 : 8;
  
      let total = 0;
      slides.forEach((slide, i) => {
        total += slide.offsetWidth;
        if (i < slides.length - 1) total += spaceBetween;
      });
  
      wrapper.style.justifyContent = (winW > total) ? 'center' : 'flex-start';
    }
  
    // 폰트 로딩 후 재정렬
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(checkTabCenter, 100));
    }
    window.addEventListener('resize', checkTabCenter);
  });
  