$(function(){
    // GSAP ScrollTrigger 등록
    gsap.registerPlugin(ScrollTrigger);

    // Hero 섹션 자식 요소들 순서대로 애니메이션
    gsap.fromTo('.hero-section .inner > *', 
        {
            y: 60,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.1
        }
    );

    // 섹션 타이틀 애니메이션
    gsap.utils.toArray('.section-title').forEach(title => {
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

    // 섹션 서브타이틀 애니메이션
    gsap.utils.toArray('.section-summary').forEach(summary => {
        gsap.fromTo(summary, 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                delay: 0.3,
                scrollTrigger: {
                    trigger: summary,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    gsap.utils.toArray('.intro-wrap .section-content p').forEach(summary => {
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


    // 1200px 이상일 때 theme-list li들이 순서대로 떠오르는 애니메이션
    if (window.innerWidth >= 1200) {
        gsap.fromTo('.theme .theme-list>li', 
            {
                y: 60,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.theme .theme-list',
                    start: "top 70%",
                    end: "bottom center",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }else{
        gsap.utils.toArray('.theme .theme-list>li').forEach(summary => {
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
                    delay: 0.1,
                    scrollTrigger: {
                        trigger: summary,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // .abcd-intro .intro-img 스크롤 기반 애니메이션
    gsap.fromTo('.abcd-intro .intro-img', 
        {
            y: 140,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            delay: 0.3,
            scrollTrigger: {
                trigger: '.intro-text',
                start: () => {
                    if (window.innerWidth <= 600) {
                        return "top 10%";
                    } else if (window.innerWidth <= 1024) {
                        return "bottom 80%";
                    } else {
                        return "top 50%";
                    }
                },
                end: "bottom center",
                scrub: 1
            }
        }
    );

     // .abcd-intro .intro-img 스크롤 기반 애니메이션
     gsap.fromTo('.theme-img', 
        {
            y: 120,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            delay: 0.3,
            scrollTrigger: {
                trigger: '.theme-list',
                start: () => {
                    if (window.innerWidth <= 600) {
                        return "bottom 80%";
                    } else if (window.innerWidth <= 1024) {
                        return "bottom 90%";
                    } else {
                        return "bottom 70%";
                    }
                },
                end: "bottom center",
                scrub: 1
            }
        }
    );

     // .abcd-intro .intro-img 스크롤 기반 애니메이션
     gsap.fromTo('.programs .section-content', 
        {
            y: 120,
            opacity: 0
        },
        {
            y: 0,
            delay:0.2,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.programs',
                start: () => {
                    if (window.innerWidth <= 600) {
                        return "top 30%";
                    } else if (window.innerWidth <= 1024) {
                        return "top 50%";
                    } else {
                        return "top 50%";
                    }
                },
                end: "bottom center",
                scrub: 1
            }
        }
    );


    // program slide
    const programSwiper = new Swiper('.program-slide', {
        loop: true,
        speed:800,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.program-slide-next',
            prevEl: '.program-slide-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2.3,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 28,
            }
        }
    });
});


(function(){
    const host = document.querySelector('.text-animation');
    if (!host) return;
  
    const svg  = host.querySelector('svg');
    const path = svg?.querySelector('path');
    if (!path) return;
  
    // 타이밍 옵션 (필요 시 수정)
    const baseDelay = 0.15;  // 시작 지연
    const drawDur   = 2.2;   // 선 그리는 시간
    const fillDur   = 0.35;  // 채우는 시간
  
    // 길이 계산해서 dash 세팅
    const len = path.getTotalLength();
    path.style.strokeDasharray  = `${len} ${len}`;
    path.style.strokeDashoffset = String(len);
  
    // CSS 커스텀 프로퍼티로 타이밍 전달
    svg.style.setProperty('--base-delay', `${baseDelay}s`);
    svg.style.setProperty('--draw-dur',   `${drawDur}s`);
    svg.style.setProperty('--fill-dur',   `${fillDur}s`);
  
    // 스크롤 인뷰 시 1회 재생
    const play = () => host.classList.add('is-animated');
  
    // 이미 화면 위쪽이라면 즉시 재생
    const immediateIfVisible = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.8 && r.bottom > 0) play();
    };
  
    // IntersectionObserver 사용 (1회 트리거)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play();
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(host);
      // 초기 가시성 체크 (로드 직후 이미 보이는 경우)
      window.addEventListener('load', immediateIfVisible);
    } else {
      // 폴백: 로드 시 바로 재생
      window.addEventListener('load', play);
    }
  
    // (선택) 클릭 시 리플레이
    host.addEventListener('click', () => {
      host.classList.remove('is-animated');
      // 강제 리플로우 후 다시 붙여 재생
      // eslint-disable-next-line no-unused-expressions
      host.offsetHeight;
      path.style.strokeDashoffset = String(len);
      host.classList.add('is-animated');
    });
  })();