(function(root) {
    'use strict';

    root.RsScrollController = class RsScrollController {
        /**
		 * @param {number} to
		 */
        scrollTo(to) {
            const duration = 80;

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
            }, isSlowScroll ? 10 : 0);
        }

        static scrollHandlerForBtn(scrollControllerBtn) {
            const pageY = window.pageYOffset || document.documentElement.scrollTop;
            const innerHeight = document.documentElement.clientHeight;
            switch (scrollControllerBtn.dataset.scrollPosition) {
                case '':
                    if (pageY > innerHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'up';
                        scrollControllerBtn.innerHTML = 'Наверх <i class="fa fa-angle-up"></i>';
                    }

                    break;

                case 'up':
                    if (pageY < innerHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'down';
                        scrollControllerBtn.innerHTML = '<i class="fa fa-angle-down"></i>';
                    }
                    break;

                case 'down':
                    if (pageY > innerHeight) {
                        scrollControllerBtn.dataset.scrollPosition = 'up';
                        scrollControllerBtn.innerHTML = 'Наверх <i class="fa fa-angle-up"></i>';
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
            this.scrollControllerBtn.innerHTML = 'Наверх <i class="fa fa-angle-up"></i>';
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
                }
            });
        }
    };
})(window);

(function() {
    'use strict';
    const rsScrollController = new RsScrollController();
    rsScrollController.init();
})();