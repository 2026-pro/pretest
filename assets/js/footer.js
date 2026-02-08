/**
 * 공통 푸터 - footer-container가 있는 페이지에 푸터 삽입
 */
(function() {
    var basePath = './';
    
    var footerHTML = 
        '<footer id="footer">' +
            '<div class="inner">' +
                '<ul class="footer-info">' +
                    '<li>' +
                        '<div class="img"><img src="' + basePath + 'assets/images/icon_ecomice.svg" alt="에코마이스(운영사무국)"></div>' +
                        '<div class="info-box">' +
                            '<strong class="sub-title">에코마이스(운영사무국)</strong>' +
                            '<table class="p-1"><tbody>' +
                                '<tr><th>Tel.</th><td><a href="tel:02-6956-6834">02-6956-6834</a></td></tr>' +
                                '<tr><th>E-mail.</th><td><a href="mailto:abcdx@ecomice.com">abcdx@ecomice.com</a></td></tr>' +
                                '<tr><th>web.</th><td><a href="https://www.ecomice.com" target="_blank">www.ecomice.com</a></td></tr>' +
                            '</tbody></table>' +
                        '</div>' +
                    '</li>' +
                    '<li>' +
                        '<div class="img"><img src="' + basePath + 'assets/images/icon_kbiox.svg" alt="K-BioX 운영위원회"></div>' +
                        '<div class="info-box">' +
                            '<strong class="sub-title">K-BioX 운영위원회</strong>' +
                            '<table class="p-1"><tbody>' +
                                '<tr><th>Tel.</th><td><a href="tel:1-413-687-4171">1-413-687-4171</a></td></tr>' +
                                '<tr><th>E-mail.</th><td><a href="mailto:globalkbiox@gmail.com">globalkbiox@gmail.com</a></td></tr>' +
                                '<tr><th>web.</th><td><a href="https://www.kbiox.net" target="_blank">www.kbiox.net</a></td></tr>' +
                            '</tbody></table>' +
                        '</div>' +
                    '</li>' +
                    '<li>' +
                        '<div class="img"><img src="' + basePath + 'assets/images/icon_kodwa.svg" alt="한국디지털웰니스협회"></div>' +
                        '<div class="info-box">' +
                            '<strong class="sub-title">한국디지털웰니스협회</strong>' +
                            '<table class="p-1"><tbody>' +
                                '<tr><th>Tel.</th><td><a href="tel:02-497-2933">02-497-2933</a></td></tr>' +
                                '<tr><th>E-mail.</th><td><a href="mailto:kodwa@kodwa.org">kodwa@kodwa.org</a></td></tr>' +
                                '<tr><th>web.</th><td><a href="https://www.kodwa.org" target="_blank">www.kodwa.org</a></td></tr>' +
                            '</tbody></table>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
                '<div class="footer-bottom">' +
                    '<p class="copyright p-1">© 2025 ECOMICE. All rights reserved.</p>' +
                    '<a href="' + basePath + 'admin_login.html" class="admin-link">관리자</a>' +
                '</div>' +
            '</div>' +
        '</footer>';

    function init() {
        var container = document.getElementById('footer-container');
        if (container) {
            container.innerHTML = footerHTML;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
