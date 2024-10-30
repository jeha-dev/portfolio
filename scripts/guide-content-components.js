if (document.querySelector('.banner-swiper')) {
    const option = {
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 3000,
        }
    };
    createSwiper(document.querySelector('.banner-swiper'), option)
}

// [btn-toggle]
function guide_btn_toggle() {
    gsap.utils.toArray('.btn-toggle').forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('on')) {
                button.classList.remove('on')
                button.classList.add('off')
            } else {
                button.classList.add('on')
                button.classList.remove('off')
            }
            // toggleClass(toggleContents, button.getAttribute('data-index'))
        })
    })
}
// [btn-toggle-text]
function guide_btn_toggle_text() {
    gsap.utils.toArray('.btn-toggle-text').forEach(button => {
        button.addEventListener('click', () => {
            button.setAttribute('data-index', button.getAttribute('data-index') == 0 ? 1 : 0)
        })
    })
}

// [popup-bottom-event]
function guide_popup_bottom_event() {
    gsap.utils.toArray('.swiper').forEach(s => {
        if (s.classList.contains('banner-payment')) {
            initBannerPayment()
        } else {
            initImgBannerSwiper(s)
        }
    })
}

function guide_slider() {
    let rangeMin = 1;
    const range = document.querySelector('.range-selected');
    const rangeInput = document.querySelectorAll('.range-input input');
    const rangePrice = document.querySelectorAll('.range-price input');
    rangeInput.forEach((input) => {
        input.addEventListener('input', (e) => {
            let minRange = parseInt(rangeInput[0].value);
            let maxRange = parseInt(rangeInput[1].value);
            if (maxRange - minRange < rangeMin) {
                if (e.target.className === 'min') {
                    rangeInput[0].value = maxRange - rangeMin;
                } else {
                    rangeInput[1].value = minRange + rangeMin;
                }
            } else {
                range.style.left = (minRange / rangeInput[0].max) * 100 + '%';
                range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + '%';
            }
        });
    });
}

function guide_tab_swipe_btn_med() {
    gsap.utils.toArray('.tab-swipe-btn-med').forEach((tabs) => {
        const tabButtons = gsap.utils.toArray('.tab', tabs);
        tabButtons.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                gsap.to(tabs, { scrollTo: { x: tab, offsetX: 24 }, duration: 0.6, ease: 'power2.out' });
                toggleClass(tabButtons, index)
            });
        });
    });
}

function guide_tab_swipe_header() {

    gsap.utils.toArray('.tab-swipe-header').forEach((tabs) => {
        defaultEventTabWithLine(tabs)
    })
    
}

function guide_tab_fixed() {
    gsap.utils.toArray('.tab-fixed').forEach((tabs) => {
        const _tab = gsap.utils.toArray('.tab',tabs);
        _tab.forEach((t, i) => {
            t.addEventListener('click', () => {
                toggleClass(_tab, i)
            })
        })
        
    })
}

guide_btn_toggle()
guide_btn_toggle_text()
guide_popup_bottom_event()
guide_slider()
guide_tab_swipe_btn_med()
guide_tab_swipe_header()
guide_tab_fixed()