/**
 * 공통 헤더 - 모든 페이지에서 사용
 * 사용법: <div id="header-container"></div> 요소에 헤더가 삽입됩니다.
 */
(function() {
    var basePath = './';
    
    var headerHTML = 
        '<!-- header -->' +
        '<header id="header">' +
            '<div class="bg"></div>' +
            '<div class="inner">' +
                '<h1><a href="' + basePath + 'index.html">KME</a></h1>' +
                '<div class="header-right">' +
                    '<nav id="nav">' +
                        '<ul class="depth-1">' +
                            '<li><a href="' + basePath + 'about.html">ABOUT</a></li>' +
                            '<li>' +
                                '<a href="' + basePath + 'conference.html">CONFERENCE</a>' +
                                '<ul class="depth-2">' +
                                    '<li><a href="' + basePath + 'conference.html">컨퍼런스 개요</a></li>' +
                                    '<li><a href="' + basePath + 'conference.html">연사소개</a></li>' +
                                '</ul>' +
                            '</li>' +
                            '<li><a href="' + basePath + 'exhibition.html">EXHIBITION</a></li>' +
                            '<li><a href="' + basePath + 'program.html">PROGRAM</a></li>' +
                            '<li><a href="' + basePath + 'visitor.html">VISITOR</a></li>' +
                            '<li><a href="' + basePath + 'exhibitor1.html">EXHIBITOR</a></li>' +
                            '<li><a href="' + basePath + 'media.html">MEDIA</a></li>' +
                            '<li>' +
                                '<a href="' + basePath + 'community_notice.html">COMMUNITY</a>' +
                                '<ul class="depth-2">' +
                                    '<li><a href="' + basePath + 'community_notice.html">공지사항</a></li>' +
                                    '<li><a href="' + basePath + 'community_library.html">자료실</a></li>' +
                                    '<li><a href="' + basePath + 'community_qna.html">Q&A</a></li>' +
                                '</ul>' +
                            '</li>' +
                        '</ul>' +
                    '</nav>' +
                    '<div class="lang">' +
                        '<button type="button" class="btn-lang">' +
                            '<img src="' + basePath + 'assets/images/icon_lang.svg" alt="">' +
                        '</button>' +
                        '<ul class="lang-list">' +
                            '<li><a href="" class="cur">한국어</a></li>' +
                            '<li><a href="">English</a></li>' +
                            '<li><a href="">中文</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="header-util">' +
                        '<a href="' + basePath + 'login.html">Login</a>' +
                        '<a href="' + basePath + 'visitor.html">Join</a>' +
                    '</div>' +
                    '<button type="button" class="mobile-menu">' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</header>' +
        '<!-- //header -->' +
        '<!-- aside -->' +
        '<aside id="aside">' +
            '<div class="aside-menu">' +
                '<ul class="depth-1">' +
                    '<li><a href="' + basePath + 'about.html">ABOUT</a></li>' +
                    '<li>' +
                        '<a href="' + basePath + 'conference.html">CONFERENCE</a>' +
                        '<ul class="depth-2">' +
                            '<li><a href="' + basePath + 'conference.html">컨퍼런스 개요</a></li>' +
                            '<li><a href="' + basePath + 'conference.html">연사소개</a></li>' +
                        '</ul>' +
                    '</li>' +
                    '<li><a href="' + basePath + 'exhibition.html">EXHIBITION</a></li>' +
                    '<li><a href="' + basePath + 'program.html">PROGRAM</a></li>' +
                    '<li><a href="' + basePath + 'visitor.html">VISITOR</a></li>' +
                    '<li><a href="' + basePath + 'exhibitor1.html">EXHIBITOR</a></li>' +
                    '<li><a href="' + basePath + 'media.html">MEDIA</a></li>' +
                    '<li>' +
                        '<a href="' + basePath + 'community_notice.html">COMMUNITY</a>' +
                        '<ul class="depth-2">' +
                            '<li><a href="' + basePath + 'community_notice.html">공지사항</a></li>' +
                            '<li><a href="' + basePath + 'community_library.html">자료실</a></li>' +
                            '<li><a href="' + basePath + 'community_qna.html">Q&A</a></li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
            '<div class="aside-btm">' +
                '<div class="util-menu">' +
                    '<a href="' + basePath + 'login.html">Login</a>' +
                    '<a href="' + basePath + 'visitor.html">Join</a>' +
                '</div>' +
                '<div class="lang">' +
                    '<button type="button" class="btn-lang">' +
                        '<img src="' + basePath + 'assets/images/icon_lang_black.svg" alt="">' +
                    '</button>' +
                    '<ul class="lang-list">' +
                        '<li><a href="" class="cur">한국어</a></li>' +
                        '<li><a href="">English</a></li>' +
                        '<li><a href="">中文</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</aside>' +
        '<div class="aside-mask"></div>' +
        '<!-- //aside -->';

    function init() {
        var container = document.getElementById('header-container');
        if (container) {
            container.innerHTML = headerHTML;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
