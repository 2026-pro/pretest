$(function(){
    // GSAP ScrollTrigger 등록
    gsap.registerPlugin(ScrollTrigger);
   
    gsap.utils.toArray(`
        .program-item`)
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

});