// ==UserScript==
// @name         RedServerController
// @version      1.0
// @description  try to take over the world!
// @author       Sheodar
// @match        https://redserver.su/*
// @match        http://redserver.su/*
// @grant        none
// ==/UserScript==

(function(root) {
    'use strict';
    const textUp = "▲ Наверх";      //Надпись для поднятия страницы вверх
    const textButtom = "▼";         //Надпись для возвращения страницы в исходнуб точку вниз
    const duration = 60;            //Скорость прокрутки страницы (меньше = быстрее)
    const switchingHeight = 100;    //Высота, на которую необходимо опустить страницу для замены позиции вверх/вниз.
    //Условно, при 50 хватит 1 прокрутки колесика мышки для появления кнопки "Наверх", при 100 - 2 прокрутки и т.д. по аналогии.

    root.RsScrollController = class RsScrollController {
        scrollTo(to) {
            if (duration <= 0) return;
            const isSlowScroll = document.scrollingElement.scrollTop <= Math.abs(to - 250);
            const difference = to - document.scrollingElement.scrollTop;
            const perTick = difference / duration * 10;

            this.scrollTimeout = setTimeout(() => {
                document.scrollingElement.scrollTop = document.scrollingElement.scrollTop + perTick;

                if (document.scrollingElement.scrollTop === to) {
                    return (window.onwheel = null);
                }

                this.scrollTo(to);
            }, isSlowScroll ? 1 : 0);
        }

        static scrollHandlerForBtn(scrollControllerBtn) {
            const pageY = window.pageYOffset || document.documentElement.scrollTop;
            switch (scrollControllerBtn.dataset.scrollPosition) {
                case '':
                    if (pageY > switchingHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'up';
                    }

                    break;

                case 'up':
                    if (pageY < switchingHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'down';
                        scrollControllerBtn.innerHTML = "<div class='bot'>"+textButtom+"</div>";
                    }
                    break;

                case 'down':
                    if (pageY > switchingHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'up';
                        scrollControllerBtn.innerHTML = "<div class='top'>"+textUp+"</div>";
                    }

                    break;
            }
        }

        init() {
            this.mainContainer = document.body;
            this.initScrollController();
        }

        initScrollController() {
            let pageYLabel = 0;
            const resetAutoScroll = () => clearTimeout(this.scrollTimeout);
            this.scrollControllerWrapper = document.createElement('div');
            this.scrollControllerBtn = document.createElement('button');

            this.scrollControllerBtn.className = 'rs-scroll-btn';
            this.scrollControllerWrapper.className = 'rs-scroll-controller';
            this.scrollControllerWrapper.appendChild(this.scrollControllerBtn);
            this.mainContainer.appendChild(this.scrollControllerWrapper);
            this.scrollControllerBtn.innerHTML = "<div class='top'>"+textUp+"</div>";
            this.scrollControllerBtn.dataset.scrollPosition = '';

            window.addEventListener('scroll', () =>
                                    RsScrollController.scrollHandlerForBtn(this.scrollControllerBtn)
                                   );

            this.scrollControllerBtn.addEventListener('click', () => {
                const pageY = window.pageYOffset || document.documentElement.scrollTop;
                window.onwheel = resetAutoScroll;
                switch (this.scrollControllerBtn.dataset.scrollPosition) {
                    case 'up':
                        pageYLabel = pageY;
                        resetAutoScroll();
                        this.scrollControllerBtn.dataset.scrollPosition = 'down';
                        this.scrollTo(0);
                        break;

                    case 'down':
                        resetAutoScroll();
                        this.scrollControllerBtn.dataset.scrollPosition = 'up';
                        this.scrollTo(
                            pageYLabel === 0 ?
                            document.documentElement.clientHeight :
                            pageYLabel
                        );
                }RsScrollController.scrollHandlerForBtn(this.scrollControllerBtn);
            });
        }
    };
})(window);

(function() {
    'use strict';
    var x = 1;
    const rsScrollController = new RsScrollController();
    window.addEventListener('scroll', () =>{
        if (x === 1){
            rsScrollController.init();
            x++;
        }

    }
                           );
})();