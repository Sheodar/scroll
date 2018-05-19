// ==UserScript==
// @name         RedServerController
// @version      1.0
// @description  try to take over the world!
// @author       Sheodar
// @match        https://redserver.su/*
// @match        http://redserver.su/*
// @match        https://mods.factorio.com/*
// @grant        none
// ==/UserScript==

(function(root) {
    'use strict';
    //------------------------------------------------======CONFIG======--------------------------------------------------------------
    //Надпись для поднятия страницы вверх
    //const textUp = "▲ Наверх";
    const textUp = "<img src=\"https://i.imgur.com/bxJbci8.png\"> "+" Наверх";
    //Надпись для возвращения страницы в исходную точку вниз
    //const textButtom = "▼";
    const textButtom = "<img src=\"https://i.imgur.com/1Qg1pPz.png\">";
    //Скорость прокрутки страницы (меньше = быстрее) Минимум - 10.
    const duration = 10;
    //Высота, на которую необходимо опустить страницу для замены позиции вверх/вниз.
    //Условно, при 50 хватит 1 прокрутки колесика мышки для появления кнопки "Наверх",
    //при 100 - 2 прокрутки и т.д. по аналогии.
    const switchingHeight = 100;
    //Сколько необходимо скролов для изначального появлнения кнопки
    const initScrollValue = 2;
    //---------------------------------------------------------------------------------------------------------------------------------

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
                        scrollControllerBtn.innerHTML = "<div class='top'>"+textUp+"</div>";
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

        initScrollController() {
            this.mainContainer = document.body;
            let pageYLabel = 0;
            const resetAutoScroll = () => clearTimeout(this.scrollTimeout);
            this.scrollControllerWrapper = document.createElement('div');
            this.scrollControllerBtn = document.createElement('button');
            this.scrollControllerBtn.innerHTML = "<div class='top'>"+textUp+"</div>";
            this.scrollControllerBtn.className = 'rs-scroll-btn';
            this.scrollControllerWrapper.className = 'rs-scroll-controller';
            this.scrollControllerWrapper.appendChild(this.scrollControllerBtn);
            this.mainContainer.appendChild(this.scrollControllerWrapper);
            var z = 1;
            if (z === 1){
                this.scrollControllerBtn.dataset.scrollPosition = 'up';
            }else{
                this.scrollControllerBtn.dataset.scrollPosition = '';
            }
            window.addEventListener('scroll', () =>{
                RsScrollController.scrollHandlerForBtn(this.scrollControllerBtn);
                z++;
            }
                                   );
            this.scrollControllerBtn.addEventListener('click', () => {
                const pageY = window.pageYOffset || document.documentElement.scrollTop;
                window.onwheel = resetAutoScroll;
                switch (this.scrollControllerBtn.dataset.scrollPosition) {
                    case 'up':
                        pageYLabel = pageY;
                        resetAutoScroll();
                        this.scrollControllerBtn.dataset.scrollPosition = 'down';
                        this.scrollControllerBtn.innerHTML = "<div class='bot'>"+textButtom+"</div>";
                        this.scrollTo(0);
                        break;

                    case 'down':
                        resetAutoScroll();
                        this.scrollControllerBtn.dataset.scrollPosition = 'up';
                        this.scrollControllerBtn.innerHTML = "<div class='top'>"+textUp+"</div>";
                        this.scrollTo(
                            pageYLabel === 0 ?
                            document.documentElement.clientHeight :
                            pageYLabel
                        );
                }RsScrollController.scrollHandlerForBtn(this.scrollControllerBtn);
            });
        }
    };

var x = true; //Залочит повторное появление кнопки
    const rsScrollController = new root.RsScrollController();
    if ((window.pageYOffset || document.documentElement.scrollTop) > switchingHeight)
    {
        rsScrollController.initScrollController();
    }else{
        window.addEventListener('scroll', () =>{
            if ((window.pageYOffset || document.documentElement.scrollTop) > (initScrollValue*90) && x){
                rsScrollController.initScrollController();
                x = false; //Залочит повторное появление кнопки
            }
        }
                               );
    }
})(window);

