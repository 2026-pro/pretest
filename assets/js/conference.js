function checkTabCenter(selector){
    const wrapper = document.querySelector(`${selector} .swiper-wrapper`);
    const slides = document.querySelectorAll(`${selector} .swiper-slide`);
    if (!wrapper || !slides.length) return;

    // 현재 breakpoint의 spaceBetween 고려(모바일 8 / 데스크톱 6)
    const winW = window.innerWidth;
    const spaceBetween = winW >= 800 ? 6 : 8;

    let total = 0;
    slides.forEach((slide, i) => {
      total += slide.offsetWidth;
      if (i < slides.length - 1) total += spaceBetween;
    });

    wrapper.classList = (winW > total) ? 'swiper-wrapper center' : 'swiper-wrapper start';
  }


// ===== Timetable Tab Filter =====
  function initTimetableFilter() {
    const tabButtons = document.querySelectorAll('.timetable-tab button');
    const contentItems = document.querySelectorAll('.timetable-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // 모든 버튼에서 active 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 active 클래스 추가
        this.classList.add('active');
        
        // 모든 콘텐츠에서 active 클래스 제거
        contentItems.forEach(item => item.classList.remove('active'));
        
        // 필터에 맞는 콘텐츠에 active 클래스 추가
        if (filter === '') {
          // Overview (빈 필터)
          contentItems.forEach(item => {
            if (item.getAttribute('data-filter') === '') {
              item.classList.add('active');
              // table-scroll을 맨 왼쪽으로 이동
              const tableScroll = item.querySelector('.table-scroll');
              if (tableScroll) {
                tableScroll.scrollLeft = 0;
              }
            }
          });
        } else {
          // 특정 DAY 필터
          contentItems.forEach(item => {
            if (item.getAttribute('data-filter') === filter) {
              item.classList.add('active');
              // table-scroll을 맨 왼쪽으로 이동
              const tableScroll = item.querySelector('.table-scroll');
              if (tableScroll) {
                tableScroll.scrollLeft = 0;
              }
            }
          });
        }
      });
    });
  }

  // ===== Speaker Tab Filter =====
  function initSpeakerFilter() {
    const tabButtons = document.querySelectorAll('.speaker-tab button');
    const contentItems = document.querySelectorAll('.speaker-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // 모든 버튼에서 active 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 active 클래스 추가
        this.classList.add('active');
        
        // 모든 콘텐츠에서 active 클래스 제거
        contentItems.forEach(item => item.classList.remove('active'));
        
        // 필터에 맞는 콘텐츠에 active 클래스 추가
        if (filter === '') {
          // Overview (빈 필터)
          contentItems.forEach(item => {
            if (item.getAttribute('data-filter') === '') {
              item.classList.add('active');
            }
          });
        } else {
          // 특정 DAY 필터
          contentItems.forEach(item => {
            if (item.getAttribute('data-filter') === filter) {
              item.classList.add('active');
            }
          });
        }
      });
    });
  }

  const speaker_modal = {
    init(){
      $('.speaker-item').click(function(){
        const dataInfo = $(this).attr('data-info');
        const data = JSON.parse(dataInfo);
        speaker_modal.open(data);
      });

      $('.speaker-modal .btn-close, .modal-mask').click(function(){
        speaker_modal.close();
      });
    },
    open(data){
      this.set(data);
      $('.speaker-modal, .modal-mask').fadeIn();
    },
    close(){
      $('.speaker-modal, .modal-mask').fadeOut();
    },
    set(data){
        // 이미지 설정
        $('.speaker-modal .modal-content .img img').attr('src', data.image);
        
        // 테이블 데이터 동적 생성
        const $tbody = $('.speaker-modal .modal-content .info tbody');
        $tbody.empty(); // 기존 내용 제거
        
        // data 객체를 순회하면서 image가 아닌 항목들을 테이블로 생성
        Object.keys(data).forEach(key => {
            if (key !== 'image') {
                const $row = $('<tr>');
                $row.append(`<th class="sub-title font-bold">${key}</th>`);
                $row.append(`<td class="sub-title">${data[key]}</td>`);
                $tbody.append($row);
            }
        });
    },
  }
$(function(){
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.utils.toArray('.section-header').forEach((el) => {
      gsap.fromTo(el, { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
      });
    });
  
    gsap.utils.toArray(`
        .intro-item .img,
        .intro-item .text,
        .reg-btn,
      .timetable-tab,
      .timetable-contents,
      .speaker-tab,
      .speaker-contents
    `).forEach((el) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
      });
    });
  
    const timetable_tab_swiper = new Swiper('.timetable-tab', {
        loop: false,
        speed: 800,
        breakpoints: {
            0:   { slidesPerView: 'auto', spaceBetween: 8 },
            800: { slidesPerView: 'auto', spaceBetween: 6 }
        },
        on: {
            init() { checkTabCenter('.timetable-tab'); },
            resize() { checkTabCenter('.timetable-tab'); }
        }
    });

    const speaker_tab_swiper = new Swiper('.speaker-tab', {
        loop: false,
        speed: 800,
        breakpoints: {
            0:   { slidesPerView: 'auto', spaceBetween: 8 },
            800: { slidesPerView: 'auto', spaceBetween: 6 }
        },
        on: {
            init() { checkTabCenter('.speaker-tab'); },
            resize() { checkTabCenter('.speaker-tab'); }
        }
    });

    const speaker_slide_swiper = new Swiper('.speaker-slide', {
      loop: true,
      speed: 800,
      slidesPerView:5,
      spaceBetween: 20,
      observer:true,
      observeParents: true,
      breakpoints: {
        0:   {
            slidesPerView:'auto',
            spaceBetween: 20,
        },
        1200: { slidesPerView:5, spaceBetween: 20 }
      },
    });
  
  
    // 폰트 로딩 후 재정렬
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => checkTabCenter('.timetable-tab'), 100);
        setTimeout(() => checkTabCenter('.speaker-tab'), 100);
      });
    }
    window.addEventListener('resize', () => {
      checkTabCenter('.timetable-tab');
      checkTabCenter('.speaker-tab');
    });

  

    // 초기화
    initTimetableFilter();
    initSpeakerFilter();
    speaker_modal.init();
  });
  