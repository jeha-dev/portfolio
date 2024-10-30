function init() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    if (window.innerHeight == 0) {
        gsap.delayedCall(0.1, () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
        })
    }
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            
            const previousHeight = entry.target.dataset.previousHeight;
            const currentHeight = entry.contentRect.height;
  

            if (!previousHeight || previousHeight !== currentHeight) {
                entry.target.dataset.previousHeight = currentHeight;
                // 100vh 높이값 바뀜 이슈 때문에 load시 innerheight를 체크합니다.
                refreshScrollTrigger();
            }
        }
    });
    if (document.querySelector('.wrap')) {
        resizeObserver.observe(document.querySelector('.wrap'));
    }
}
window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
})
const isIOS = navigator.userAgent.match(/like Mac OS X/i) ? true : false;
const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

function isSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('android') === -1);
}

function _initCheckDevice() {
    // PC
    if (!isMobile) {
        document.body.classList.add("is-pc");
    }else {
        if(!isIOS){
            // alert(isIOS);
            document.querySelector("body").classList.add("is-aos");
        }
    }
}
function refreshScrollTrigger() {
    ScrollTrigger.refresh();
    scrollTransitionSticky("show", true);
}
window.onload = () => {
    _initCheckDevice();
    gsap.to(window, { scrollTo: { y: 0 }, duration: 0.01 });
    gsap.config({
        nullTargetWarn: false,
        trialWarn: false,
    });
    if (ScrollTrigger) {
        ScrollTrigger.clearScrollMemory()
    }
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }
    init();
    
};
//////////////////// [z-index 설정] ////////////////////
function setZindex(container, num) {
    gsap.set(container, { zIndex: num });
}

//////////////////// [클릭 시 클래스 추가제거] ////////////////////
function toggleClass(arr, index, name) {
    const _name = name ? name : "selected";
    arr.forEach((a, j) => a.classList[index == j ? "add" : "remove"](_name));
}

//////////////////// [스와이퍼] ////////////////////
function createSwiper(swiper, option) {
    let _slides = swiper.querySelectorAll('.swiper-slide');

    if (option.slideClass) {
        _slides = swiper.querySelectorAll(`.${option.slideClass}`);
        _slides.forEach(s => {
            s.classList.add('swiper-slide')
        })
    }




    // _slides.map(s => {
    //     s.classList.add('swiper-slide')
    // })
    
    if (_slides.length > 1) {
        // 디폴트 옵션
        let defaultOption = {
            slidesPerView: 1,
            centeredSlides: true,
            loop: false,
        };

        const _option = option ? option : defaultOption;
        _option.longSwipesRatio = 0;
   
        if (!_option.customTouchRatio) {
            _option.touchRatio = 0.5;
        }
        const _swiper = new Swiper(swiper, _option);
        return _swiper;
    } else {
        swiper.classList.add("swiper-single");
    }
}

// [이벤트] 스크롤 동작 막기 (ios 이슈로 테스트 중)
function disableScroll() {
    let yv = window.scrollY;
    document.body.classList.add("is-lock");
    // if (document.querySelector('.filter-fixed')) {
    //     gsap.set('.filter-fixed', { top: window.scrollY + 50 })
    //     // document.querySelector('.tab-main-content-wrap').setAttribute('data-scroll', yv)
    //     // gsap.set(document.querySelector('.tab-main-content-wrap'), { y: `-${yv}px`, })
    // } else {
    //     // document.querySelector('.wrap').setAttribute('data-scroll', yv)
    //     // gsap.set(document.querySelector('.wrap'), { y: `-${yv}px`, })
    // }

    // document.querySelector('.container').setAttribute('data-scroll', yv);
    // gsap.set('.wrap', { y: `-${yv}px` })
}
// [이벤트] 스크롤 동작 막기 (ios 이슈로 테스트 중)
function enableScroll() {
    // if (document.querySelector('.filter-fixed')) {
    //     gsap.set('.filter-fixed', { clearProps: 'top' })
    // }
    document.body.classList.remove("is-lock");
    // gsap.set(window, { scrollTo: { y: document.querySelector('.wrap').getAttribute('data-scroll') }, onComplete: () => {

    //     if (document.querySelector('.filter-fixed')) {
    //         gsap.set('.filter-fixed', { clearProps: 'top' })
    //         gsap.set(document.querySelector('.tab-main-content-wrap'), { clearProps: 'y' })
    //     } else {
    //         gsap.set(document.querySelector('.wrap'), { clearProps: 'y' })
    //     }
    // }})
    // gsap.set('.wrap', { clearProps: 'y' })
    // gsap.set('.container', { clearProps: 'height, overflow' })
    // gsap.to(window, { scrollTo: { y: `${document.querySelector('.container').getAttribute('data-scroll')}` }, duration: 0.1, delay: 0.1 })
}

//////////////////// [인풋 - 약관 전체 동의] ////////////////////
function initComInfoAgreement(group) {
    if (group.classList.contains("uncheck")) {
        if (document.querySelector(".btn-loading")) {
            const button = document.querySelector(".btn-loading");
            button.addEventListener("click", () => {
                // 'is-loading' 클래스 추가 시 lottie-player 보여집니다.
                button.classList.add("is-loading");
                button.querySelector("lottie-player").currentTime = 0;
                button.querySelector("lottie-player").play();
            });
        }
        return;
    }
    const listGroup = gsap.utils.toArray(".input-checkbox-group", group);

    let buttonValidate;
    if (document.querySelector(".btn-agreement")) {
        buttonValidate = document.querySelector(".btn-agreement");
        if (!buttonValidate.classList.contains("bg-black")) {
            buttonValidate.disabled = true;
        }
    }

    let totalTerms = null;
    let headerTemrsAll = null;

    if (group.querySelector(".terms-all")) {
        headerTemrsAll = group.querySelector(".terms-all");
        totalTerms = gsap.utils.toArray("input[type=checkbox]", group.querySelector(".input-checkbox-list")).filter((inp) => !inp.classList.contains("terms-all"));
    }

    listGroup.forEach((list) => {
        let termsAll = null;
        let _inputs = gsap.utils.toArray("input[type=checkbox]", list.querySelector(".input-checkbox-list"));

        if (list.querySelector(".terms-all")) {
            _inputs = totalTerms;
        }

        // let inputs = _inputs.filter(inp => !inp.hasAttribute('data-option'))
        let inputs = _inputs;

        if (list.querySelector(".input-checkbox-all input[type=checkbox]")) {
            termsAll = list.querySelector(".input-checkbox-all input[type=checkbox]");
            termsAll.onchange = (e) => {
                let is_checked = termsAll.checked;
                gsap.utils.toArray(".input-checkbox-list input[type=checkbox]", list).forEach((inp) => (inp.checked = is_checked));
                checkTotalInput();
            };
        }

        inputs.forEach((inp) => {
            inp.onchange = (e) => {
                if (inp.checked == false) {
                    if (termsAll) {
                        termsAll.checked = false;
                    }
                }
                checkTotalInput();
            };
        });

        const checkRequireInput = () => {
            const requiredInputs = _inputs.filter((i) => !i.hasAttribute("data-option"));

            if (requiredInputs.length == requiredInputs.filter((i) => i.checked).length) {
                buttonValidate.disabled = false;
                buttonValidate.classList.add("bg-black");
            } else {
                buttonValidate.disabled = true;
                buttonValidate.classList.remove("bg-black");
            }
        };

        const checkTotalInput = () => {
            if (inputs.filter((i) => i.checked).length == inputs.length) {
                if (termsAll) {
                    termsAll.checked = true;
                }
            }
            if (headerTemrsAll) {
                headerTemrsAll.checked = totalTerms.filter((i) => i.checked).length == totalTerms.length;
            }

            if (buttonValidate) {
                checkRequireInput();
            }
        };
    });
}

if (document.querySelector(".com-info-agreement") || document.querySelector(".com-info-agreement-bottomsheet")) {
    gsap.utils.toArray(".com-info-agreement").forEach((c) => {
        initComInfoAgreement(c);
    });

    gsap.utils.toArray(".com-info-agreement-bottomsheet").forEach((c) => {
        initComInfoAgreement(c);
    });
}

if (document.querySelector(".com-info-agreement-bottomsheet")) {
    const termsElement = gsap.utils.toArray(".input-checkbox-all-group");

    if (termsElement.length > 1) {
        let _termsAll = gsap.utils.toArray(".com-info-agreement-bottomsheet .terms-all");

        const temrsAll = _termsAll.filter((a) => !a.classList.contains("terms-all-init"));

        _termsAll[0].oncheck = () => {
            const checked = () => termsAll.filter((t) => t.checked).length;
            if (checked() == termsAll.length - 1) {
                termsAll[0].checked = true;
            } else {
                termsAll[0].checked = false;
            }
        };
    }

    gsap.utils.toArray(".input-checkbox-all-group").forEach((group, i) => {
        comInfoAgreement(group);
    });
}

function commonSearchInputEvent() {
    gsap.utils.toArray(".input-search").forEach((input) => {
        if (document.querySelector(".search-dsp-mo-lp-001")) return;
        if (document.querySelector(".search-dsp-mo-5-pg-001")) return;
        if (document.querySelector(".footer-cs-cmp-mo-17-pu-002")) return;
        if (document.querySelector(".footer-cs-cmp-mo-17-tb-001")) return;

        const isSearhPopup = input.closest(".popup-search-address");
        const _input = input.querySelector("input");

        if (isSearhPopup) {
            document.querySelector(".btn-input-search").disabled = true;
        }
        _input.oninput = () => {
            if (_input.value.length > 0) {
                if (isSearhPopup) {
                    if (_input.value.length >= 2) {
                        if (document.querySelector(".btn-input-search").disabled) {
                            document.querySelector(".btn-input-search").disabled = false;
                        }
                    } else {
                        if (!document.querySelector(".btn-input-search").disabled) {
                            document.querySelector(".btn-input-search").disabled = true;
                        }
                    }
                }
                if (!input.classList.contains("filled")) {
                    input.classList.add("filled");
                }

                if (document.querySelector(".footer-cs-cmp-mo-17-tb-001")) {
                    if (_input.value.length > 0 && _input.value.length <= 10) {
                        document.querySelector(".content-tabs-accordion").style.display = "none";
                        document.querySelector(".search-typing-contents").style.display = "block";

                        document.querySelector(".search-typing-contents .col-results").style.display = "flex";
                        document.querySelector(".search-typing-contents .empty-state").style.display = "none";
                    } else if (_input.value.length > 10) {
                        document.querySelector(".search-typing-contents .col-results").style.display = "none";
                        document.querySelector(".search-typing-contents .empty-state").style.display = "flex";
                    }
                } else if (document.querySelector(".footer-cs-cmp-mo-17-pu-002")) {
                    if (_input.value.length > 0 && _input.value.length <= 5) {
                        document.querySelector(".content-default").classList.remove("no-result");
                        document.querySelector(".content-default").classList.remove("show-1");
                        document.querySelector(".content-default").classList.add("show-2");
                    } else if (_input.value.length > 5 && _input.value.length <= 10) {
                        document.querySelector(".content-default").classList.remove("no-result");
                        document.querySelector(".content-default").classList.remove("show-2");
                        document.querySelector(".content-default").classList.add("show-1");
                    } else {
                        document.querySelector(".content-default").classList.remove("show-1");
                        document.querySelector(".content-default").classList.remove("show-2");
                        document.querySelector(".content-default").classList.add("no-result");
                    }
                }
            } else {
                input.classList.remove("filled");

                if (document.querySelector(".footer-cs-cmp-mo-17-tb-001")) {
                    document.querySelector(".content-tabs-accordion").style.display = "block";
                    document.querySelector(".search-typing-contents").style.display = "none";
                } else if (document.querySelector(".footer-cs-cmp-mo-17-pu-002")) {
                    document.querySelector(".content-default").classList.remove("no-result");
                    document.querySelector(".content-default").classList.remove("show-1");
                    document.querySelector(".content-default").classList.remove("show-2");
                }

                if (isSearhPopup) {
                    if (!document.querySelector(".btn-input-search").disabled) {
                        document.querySelector(".btn-input-search").disabled = true;
                    }
                }
            }
        };

        input.querySelector(".btn-input-x").addEventListener("click", () => {
            _input.value = "";
            input.classList.remove("filled");

            if (isSearhPopup) {
                document.querySelector(".btn-input-search").disabled = true;
            }

            if (document.querySelector(".search-dsp-mo-lp-001")) {
                document.querySelector(".search-default-contents").style.display = "block";
                document.querySelector(".search-typing-contents").style.display = "none";
            } else if (document.querySelector(".footer-cs-cmp-mo-17-tb-001")) {
                document.querySelector(".content-tabs-accordion").style.display = "block";
                document.querySelector(".search-typing-contents").style.display = "none";
            } else if (document.querySelector(".footer-cs-cmp-mo-17-pu-002")) {
                document.querySelector(".content-default").classList.remove("show-1");
                document.querySelector(".content-default").classList.remove("show-2");
            }
        });

        // if (input.querySelector('.btn-input-search')) {
        //     input.querySelector('.btn-input-search').addEventListener('click', () => {
        //         if (_input.value.length == 0) {
        //             toast(document.querySelector('.popup[data-type=popup-toast-1]'), 2);
        //         } else {
        //         }
        //     });
        // }
    });
}
commonSearchInputEvent();

//////////////////// [팝업] ////////////////////

// [인터랙션[ ico-small-arrow 화살표 아이콘 (아코디언, 팝업 열고 닫힐 때 사용) //
function openArrowIcon(icon) {
    gsap.to(icon, { scaleY: -1, duration: 0.4, ease: "power2.inOut" });
}
function closeArrowIcon(icon) {
    gsap.to(icon, { scaleY: 1, duration: 0.4, ease: "power2.inOut" });
}

// [인터랙션] 팝업 열림
function openPopup(type) {
    const yv = 60;

    const finder = document.querySelector(`.popup[data-type=${type}]`);

    if (finder) {
        document.activeElement.blur()
        finder.classList.add("active");
        if (finder.hasAttribute("style") && !finder.getAttribute("style").indexOf("z-index:") !== -1) {
            setZindex(finder, 3000);
        }
        if (type == 'product-product-inquiry') {
            setZindex(finder, 3002)
        }
        if (type == 'delivery-memo-1') {
            setZindex(finder, 3002)
        }

        if (window.scrollY) {
            document.body.setAttribute('data-scroll', window.scrollY)
            gsap.set(document.body, { scrollTo: { y: window.scrollY }, onComplete: () => {
                // gsap.set(document.body, { overflow: 'hidden', delay: 0.03 })
            } })
        }

        gsap.set(finder, {
            display: "block",
            pointerEvents: "auto",
            onComplete: () => {
                if (finder.querySelector(".tab-swipe-header")) {
                    if (finder.querySelector(".tab-content-wrap")) {
                        defaultEventTabWithLine(finder.querySelector(".tab-swipe-header"), gsap.utils.toArray(".tab-content", finder), true);
                    } else {
                        defaultEventTabWithLine(finder.querySelector(".tab-swipe-header"));
                    }
                }
            },
        });

        if (finder.classList.contains("popup-full")) {
            gsap.to(finder, {
                opacity: 1,
                duration: 0.25,
                ease: "power1.inOut",
                onComplete: () => {
                    if (finder.querySelector(".tab-swipe-header")) {
                        if (finder.querySelector(".tab-content-wrap")) {
                            defaultEventTabWithLine(finder.querySelector(".tab-swipe-header"), gsap.utils.toArray(".tab-content", finder), true);
                        } else {
                            defaultEventTabWithLine(finder.querySelector(".tab-swipe-header"));
                        }

                        ScrollTrigger.refresh();
                    }
                    if (finder.querySelector('.tooltip-container.no-icon')) {
                        // 툴팁 자동 노출, 3.5초 뒤 히든 처리 (PRD-MO-7-PU-002(1), PRD-MO-7-PU-001)
                        openNoticeToast(finder.querySelector('.tooltip-container.no-icon'))
                    }
                },
            });
 
        }

        gsap.to(finder.querySelector(".popup-background"), { opacity: 1, duration: 0.3, ease: "power1.inOut" });

        const sheet = finder.querySelector(".popup-container");
        if (finder.classList.contains("popup-bottomsheet")) {
            gsap.set(sheet, { y: yv });
        }
        gsap.to(sheet, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            delay: 0.1,
            onComplete: () => {
                disableScroll();
            },
        });
        gsap.to(sheet, { y: 0, duration: 0.35, ease: "power2.out", delay: 0.1 });
        if (document.querySelector(`.btn-evt-popup[data-type=${type}] .ico`)) {
            openArrowIcon(document.querySelector(`.btn-evt-popup[data-type=${type}] .ico`));
        }
    }
}
// [인터랙션] 팝업 닫힘
function closePopup(type, callback) {
    const yv = 60;
    const finder = document.querySelector(`.popup[data-type=${type}]`);

    finder.classList.remove("active");
    if (!finder) return;
    const sheet = finder.querySelector(".popup-container");
    gsap.killTweensOf([finder, sheet], "all");
    if (document.body.hasAttribute('data-scroll')) {
        gsap.set(window, { scrollTo: { y: document.body.getAttribute('data-scroll') }})
        document.body.removeAttribute('data-scroll')
    }
    // gsap.set(document.body, {clearProps: 'overflow'})
    if (finder.classList.contains("popup-full")) {
        gsap.to(finder, {
            opacity: 0,
            duration: 0.3,
            ease: "power1.inOut",
            onComplete: () => {
                if (finder.querySelector(".container")) {
                    finder.querySelector(".container").scrollY = 0;
                }
                gsap.set(finder, { display: "none", delay: 0.1 });
            },
        });
    } else {
    }

    gsap.set(finder, { pointerEvents: "none" });

    gsap.to(sheet, { opacity: 0, duration: 0.3, ease: "power1.inOut" });
    if (finder.classList.contains("popup-bottomsheet")) {
        gsap.to(sheet, { y: yv / 2, duration: 0.3, ease: "power1.inOut" });
    }
    gsap.to(finder.querySelector(".popup-background"), {
        opacity: 0,
        duration: 0.24,
        ease: "power1.inOut",
        delay: 0.15,
        onComplete: () => {
            if (finder.querySelector(".container")) {
                gsap.set(finder.querySelector(".container"), { scrollTo: { y: 0 } });
            }
            gsap.set(finder, { display: "none" });
            gsap.set(finder, { clearProps: "zIndex" });
            if (!finder.classList.contains("no-reset")) {
                if (!finder.classList.contains("popup-bottomsheet")) {
                    if (!finder.querySelector(".com-info-agreement-bottomsheet")) {
                        resetPopup(finder);
                    }
                }
            }

            gsap.delayedCall(0.4, () => {
                if (!document.querySelector(".popup.active")) {
                    enableScroll();
                }

                if (callback) callback();
            });
        },
    });

    closeArrowIcon(document.querySelector(`.btn-evt-popup[data-type=${type}] .ico`));
}
function resetPopup(popup) {
    gsap.utils.toArray("textarea", popup).forEach((input) => {
        if (input.value) {
            input.value = "";
        }
    });
    gsap.utils.toArray(".btn-validate", popup).forEach((button) => {
        if (button.classList.contains("bg-black")) {
            button.classList.remove("bg-black");
        } else {
        }
    });
    gsap.utils.toArray("input", popup).forEach((input) => {
        if (input.disabled) return;
        if (input.value) {
            input.value = "";
        }
        if (input.checked) {
            input.checked = false;
        }
        if (input.classList.contains("selected")) {
            input.classList.remove("selected");
        }
        if (input.hasAttribute("default")) {
            input.checked = true;
        }
    });

    gsap.utils.toArray(".error", popup).forEach((e) => e.classList.remove("error"));
}

//////////////////// [팝업 - 버텀시트] ////////////////////
gsap.utils.toArray(".btn-evt-popup").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.getAttribute("data-type");
        openPopup(type);
    });
});

gsap.utils.toArray(".popup-full").forEach((popup) => {
    if (popup.querySelector(".header .btn-close")) {
        gsap.utils.toArray(".header .btn-close", popup).forEach((button) => {
            button.addEventListener("click", () => {
                closePopup(popup.getAttribute("data-type"));
                if (button.classList.contains("all")) {
                    if (document.querySelector(".popup-full.active")) {
                        gsap.delayedCall(0.5, () => {
                            gsap.utils.toArray(".popup-full.active").forEach((p) => {
                                closePopup(p.getAttribute("data-type"));
                            });
                        });
                    }
                }
            });
        });
    }
});
function popupBottomSheetClickEvent(e) {
    const index = e.target.getAttribute("data-index");
    const popup = e.target.closest(".popup");
    const type = popup.getAttribute("data-type");
    const btnSheets = gsap.utils.toArray(".btn-bottomsheet", popup);

    if (e.target.classList.contains("selected")) {
        closePopup(type);
    } else {
        toggleClass(btnSheets, index);
        gsap.utils.toArray(`.btn-evt-popup[data-type=${type}]`).forEach((b) => {
            if (b.querySelector(".txt-selected")) {

                if (b.querySelector(".txt-selected").tagName == "INPUT") {
                    b.querySelector(".txt-selected").value = e.target.querySelector("[data-value]").getAttribute("data-value");
                    if (b.querySelector(".txt-selected").onchange) {
                        b.querySelector(".txt-selected").onchange();
                    }
                } else {
                    b.querySelector(".txt-selected").innerHTML = e.target.querySelector("[data-value]").getAttribute("data-value");
                }
                if (!b.querySelector(".txt-selected").classList.contains("selected")) {
                    b.querySelector(".txt-selected").classList.add("selected");
                }
            }
        });

        let callback = null;
        // popup-listoder 이고 스크롤 값 업데이트 필요한 경우
        if (gsap.utils.toArray(`.btn-evt-popup[data-type=${type}]`)[0].closest(".content-filter")) {
            callback = () => {
                const target = gsap.utils.toArray(`.btn-evt-popup[data-type=${type}]`)[0].closest(".content-filter");
                let _offsetY = 0;
                if (document.querySelector(".sticky-ui")) {
                    _offsetY = document.querySelector(".sticky-ui").clientHeight;
                }
                let _scroller = window;

                gsap.to(window, { scrollTo: { y: target, offsetY: _offsetY }, duration: 0.6, ease: "power2.inOut", delay: 0 });
            };
        }

        // 클릭 후에 바로 안닫히도록 딜레이 추가
        gsap.delayedCall(0.15, () => {
            closePopup(type, callback);
        });
    }

    if (e.target.classList.contains('add-option')) {
        document.body.classList.add('add-options')
    } else {
        document.body.classList.remove('add-options')
    }
}
function popupBottomSheetEvent(btnSheets, type, callback) {
    btnSheets.forEach((button, i) => {
        if (!button.hasAttribute("data-index")) {
            button.setAttribute("data-index", i);
        }
        button.removeEventListener("click", popupBottomSheetClickEvent);
        button.addEventListener("click", popupBottomSheetClickEvent);
    });
}

function popupInit(popup) {
    if (popup.classList.contains("popup-full")) return;
    // 팝업-버텀 시트 필터 예외 처리
    if (popup.classList.contains("popup-bottomsheet-filter")) return;
    const type = popup.getAttribute("data-type");

    // btn-close, popup-background 클릭 시 팝업 닫힘
    if (popup.querySelector(".btn-close")) {
        gsap.utils.toArray(".btn-close", popup).forEach((button) => {
            button.addEventListener("click", () => {
                closePopup(type);
            });
        });
    }
    // 버텀 시트 내 옵션 버튼 선택 시 닫힘
    const btnSheets = gsap.utils.toArray(".btn-bottomsheet", popup);
    const isCustom = popup.classList.contains("popup-evt-custom");

    if (popup.classList.contains("popup-evt-custom")) return;

    popupBottomSheetEvent(btnSheets, type);
}
// 팝업 - 버텀 시트 내 이벤트
gsap.utils.toArray(".popup").forEach((popup) => popupInit(popup));
//////////////////// [팝업 - 토스트] ////////////////////

// 수정 내역
// 20230726 - 기존 : 메시지만 전달, 팝업 생성 -> popup 넘겨줘서 실행
function toast(_popup, dur, callback) {
    let popup = _popup;
    let timer = null;
    if (!popup) {
        popup = document.querySelector(".popup-toast");
    }
    const popupContent = popup.querySelector(".content");

    gsap.killTweensOf([popup, popupContent], "all");
    gsap.set(popupContent, { opacity: 0 });

    const sv = 0.95;

    gsap.set(popup, { display: "block" });
    gsap.from(popupContent, { scale: sv, duration: 0.35, ease: "power1.out" });
    gsap.to(popupContent, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => {
            gsap.delayedCall(dur ? dur : 2, () => {
                closeToast(popup);
            });
            if (callback) callback();
        },
    });
}
function closeToast(_popup) {
    let popup = _popup;
    if (!popup) {
        popup = document.querySelector(".popup-toast");
    }
    const popupContent = popup.querySelector(".content");
    gsap.to(popupContent, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
            gsap.set(popup, { display: "none" });
        },
    });
}
// 토스트 팝업 실행해야하는 버튼 클릭 이벤트 생성
gsap.utils.toArray(".btn-evt-toast").forEach((button) => {
    button.addEventListener("click", () => {
        toast();
    });
});

//////////////////// [툴팁] ////////////////////
function tooltipToggle(container) {
    if (container.classList.contains("btn-gift")) return;

    let nextElement = null;
    let isArccordion = false;
    if (container.closest('.detail-content-main')) {
        isArccordion = true;
        container.setAttribute('data-arccordion', true)
    }
    if (container.classList.contains("show")) {
        container.classList.remove("show");
    } else {
        if (isArccordion) {
            if (document.querySelector('.tooltip-container[data-arccordion="true"].show')) {
                gsap.utils.toArray('.tooltip-container[data-arccordion="true"].show').forEach(c => {
                    if (c !== container) {
                        if (c.querySelector('.tooltip-btn')) {
                            c.querySelector('.tooltip-btn').click()
                        }
                    }
                })
            }
        }
        container.classList.add("show");


        gsap.delayedCall(0.2, () => {
            const closeEvent = () => {
                container.classList.remove("show");
                document.removeEventListener('click', closeEvent);
            }
            // 툴팁 실행 되고 - 클릭 이벤트 있으면 hidden 처리
            document.addEventListener('click', closeEvent);
        })
    }
}

const _toggleTooltip = (e) => {
    e.stopPropagation();
    tooltipToggle(e.currentTarget.closest(".tooltip-container"));
};

function _initTooltip() {
    gsap.utils.toArray(".tooltip-container").forEach((container) => {
        if (container.querySelector(".tooltip-btn")) {
            container.querySelector(".tooltip-btn").removeEventListener("click", _toggleTooltip);
            container.querySelector(".tooltip-btn").addEventListener("click", _toggleTooltip);
        }
    });
}
_initTooltip()
//////////////////// [인풋] ////////////////////
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// [인풋] 숫자만 입력 가능한 케이스
function inputAllowOnlyNumbers(input) {
    // 세자리 마다 콤마 추가
    if (input.getAttribute("data-type") == "price") {
        input.value = numberWithCommas(input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"));
    } else if (input.getAttribute("data-type") == "phone") {
    } else {
        input.value = input.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    }
}
gsap.utils.toArray(".input-text-check").forEach((input) => {
    if (input.classList.contains("input-number")) {
        input.oninput = () => inputAllowOnlyNumbers(input);
    }
});

function validatePhone(e, container) {
    var val = e.target.value.replace(/\D/g, "");

    var x = val.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (val.length >= 11) {
        var x = val.match(/(\d{0,3})(\d{0,4})(\d{0,4})/);
    }
    const pattern = /^(010|080|011|016|017|019)/; // 010, 080, 011, 016, 017, 019 중 하나로 시작하는 패턴

    if (!pattern.test(val) || val.length < 11) {
        // container.classList.add('error');
    }
    if (val.length === 0) {
        // container.classList.remove('error');
    }
    if (!x[2]) {
        e.target.value = x[1];
        // container.classList.add('error');
    } else {
        // container.classList.remove('error');
        e.target.value = "" + x[1] + " - " + x[2] + (x[3] ? " - " + x[3] : "");
    }
}

// [이벤트] 상품, 제목, 내용 인풋 값 체크
function checkInputs(container, inputs) {
    let _container = container;
    let _inputs = inputs;
    if (!container) {
        _container = document.body;
        if (_container) {
            _inputs = gsap.utils.toArray('.input-validate', _container)
        }
    }
    const checkCount = () => {
        let count = 0;
        _inputs.forEach((input) => {
            if (input.type == 'checkbox') {
                if (!input.hasAttribute('required')) {
                    count++;
                } else {
                    if (input.checked) {
                        count++;
                    } else {
                        count = 0;
                        return count;
                    }
                }
            } else {
                if (input.hasAttribute('min')) {
                    if (input.value.length >= input.getAttribute('min')) {
                        count++;
                    }
                } else {
                    if (input.value) {
                        count++;
                    }
                }
            }
        });
        return count;
    };

    if (_container.querySelector('.error')) return false;
    if (checkCount() == _inputs.length) return true;
}
// [인풋] textarea length 카운트
function checkValidateLength(wrap, input, check) {
    // const input = wrap.querySelector('.input-text-length');

    const min = input.getAttribute("min");
    const max = input.getAttribute("max");
    // const splitValue = input.substring(0, max);;

    let value = input.value;
    // 레이어 안에 버튼 없는 경우 있어서 id로 연결\

    if (input.type == "textarea") {
        wrap.querySelector(".txt-character-counter .current").innerHTML = numberWithCommas(input.value.length);
    }
    if (wrap.closest(".popup-address")) {
        if (value.length === 0) {
            wrap.querySelector(".txt-guide-error").innerText = "필수 입력 항목이에요.";
        } else if (input.classList.contains("input-phone")) {
            wrap.querySelector(".txt-guide-error").innerText = "올바른 휴대폰 번호를 입력해주세요.";
        } else if (input.classList.contains("input-name")) {
            wrap.querySelector(".txt-guide-error").innerText = "2자 이상 입력해 주세요.";
        } else if (input.classList.contains("input-detail-addr")) {
            wrap.querySelector(".txt-guide-error").innerText = "주소를 상세하게 작성해 주세요.";
        }
    }
    if (value.length >= 0) {
        if (value.length < min) {
            if (check) {
                wrap.setAttribute("data-checked", true);
            }
            if (!wrap.classList.contains("error") && wrap.hasAttribute("data-checked")) {
                wrap.classList.add("error");
            }
            if (wrap.classList.contains("check-validate")) {
                if (wrap.querySelector(".btn-validate").classList.contains("selected")) {
                    wrap.querySelector(".btn-validate").classList.remove("selected");
                    if (wrap.querySelector(".btn-validate").classList.contains("btn-main-task")) {
                        wrap.querySelector(".btn-validate").classList.remove("bg-black");
                    } else {
                        wrap.querySelector(".btn-validate").disabled = true;
                    }
                }
            }

            if (input.type == "textarea") {
                if (wrap.oncheck) {
                    wrap.oncheck();
                }
            }
            if (input.classList.contains("input-number")) {
                inputAllowOnlyNumbers(input);
            }
        } else {
            if (input.type == "textarea") {
                if (wrap.oncheck) {
                    wrap.oncheck();
                }
            }

            if (wrap.classList.contains("error")) {
                if (!wrap.classList.contains('forbidden')) {    
                    wrap.classList.remove("error");
                }
            }

            if (wrap.classList.contains("check-validate")) {
                if (!wrap.querySelector(".btn-validate").classList.contains("selected")) {
                    wrap.querySelector(".btn-validate").classList.add("selected");
                    if (wrap.querySelector(".btn-validate").classList.contains("btn-main-task")) {
                        wrap.querySelector(".btn-validate").classList.add("bg-black");
                    } else {
                        wrap.querySelector(".btn-validate").disabled = false;
                    }
                }
            }
        }
        if (value.length > max) {
            input.value = input.value.substring(0, max);
            if (input.type == "textarea") {
                wrap.querySelector(".txt-character-counter .current").innerHTML = input.value.length;
            }
        }

        if (input.classList.contains("input-birth-masking")) {
            input.value = input.value
                .replace(/[^0-9]/g, "")
                .replace(/^(\d{0,6})(\d{0,7})$/g, "$1-$2")
                .replace(/-{1,2}$/g, "");
            if (input.value.length == 8) {
                input.value = input.value.substring(0, 8) + "******";
            }
        }

        if (input.classList.contains("input-phone")) {
            input.onkeydown = (e) => validatePhone(e, wrap);
            input.onkeyup = (e) => validatePhone(e, wrap);
            input.onkeypress = (e) => validatePhone(e, wrap);
        }
    }
}
function commonInputEvent() {
    const inputs = gsap.utils.toArray(".input-text-length-wrap");
    inputs.forEach((wrap, index) => {
        const input = wrap.querySelector(".input-text-length");
        const isOnce = wrap.classList.contains("once");
        input.oninput = () => checkValidateLength(wrap, input, isOnce);
        input.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) {
                if (inputs[index + 1]) {
                    inputs[index].querySelector(".input-text-length").click();
                }
            }
        });
        input.onblur = () => checkValidateLength(wrap, input, isOnce);
    });
}
commonInputEvent();
//////////////////// [아코디언] ////////////////////
// [아코디언] ex. 주문자 정보, 배송지 클릭 시 콘텐츠 열고 닫히는 이벤트
function openAccordion(accordion, dir, callback) {
    if (document.querySelector(".container")) {
        if (document.querySelector(".container").classList.contains("detail")) {
            // on detail page, close all accordion when open new accordion
            gsap.utils.toArray(".detail-content-notice .accordion-container").forEach((accordion) => {
                closeAccordion(accordion);
            });
        }
        if (document.querySelector(".container").classList.contains("footer-cs-event")) {
            // on detail page, close all accordion when open new accordion
            gsap.utils.toArray(".content-tabs-accordion .accordion-container").forEach((accordion) => {
                closeAccordion(accordion);
            });
        }
    }

    accordion.setAttribute("data-open", "true");
    const _duration = dir ? dir : 0.35;
    gsap.set(accordion.querySelector(".accordion-content"), { overflow: 'hidden', opacity: 0 })
    gsap.to(accordion.querySelector(".accordion-content"), {
        opacity: 1,
        duration: _duration * 0.7,
        ease: "power1.inOut",
        delay: _duration * 0.4,
    });
    gsap.to(accordion.querySelector(".accordion-content"), {
        height: "auto",
        overflow: 'visible',
        duration: _duration,
        ease: "power1.inOut",
        onComplete: () => {
            if (accordion.hasAttribute("data-scroll")) {
                let scroller = window;
                if (accordion.hasAttribute("data-scroller")) {
                    scroller = document.querySelector(`.${accordion.getAttribute("data-scroller")}`);
                }
                gsap.to(scroller, { scrollTo: { y: accordion, offsetY: accordion.getAttribute("data-offset") ? accordion.getAttribute("data-offset") : 45 }, duration: 0.5, ease: "power1.out" });
            }

            if (callback) {
                callback()
            }
        },
    });

    if (accordion.querySelector(".ico-arrow-small")) {
        openArrowIcon(accordion.querySelector(".ico-arrow-small"));
    }
}
function closeAccordion(accordion, dir, callback) {
    accordion.setAttribute("data-open", "false");
    gsap.to(accordion.querySelector(".accordion-content"), {
        opacity: 0,
        duration: dir ? dir : 0.35,
        ease: "power1.inOut",
    });
    gsap.to(accordion.querySelector(".accordion-content"), {
        height: 0,
        overflow: 'hidden',
        duration: dir ? dir : 0.3,
        ease: "power1.inOut",
        onComplete: () => {
            if (callback) {
                callback();
            }
            if (accordion.classList.contains("payment-content-product")) {
                gsap.utils.toArray('.accordion-container[data-open="true"]', accordion).forEach((ac) => {
                    closeAccordion(ac, 0);
                });
            }
        },
    });

    if (accordion.querySelector(".ico-arrow-small")) {
        closeArrowIcon(accordion.querySelector(".ico-arrow-small"));
    }
}
// [인풋] 라디오 선택 값에 따라 아코디언 열고 닫힘
function inputRadioWithAccordion(inputs) {
    inputs.forEach((input, j) => {
        input.querySelector("input").onchange = () => {
            if (input.querySelector("input").checked) {
                if (input.getAttribute("data-open") == "false") {
                    openAccordion(input);
                }
                inputs.forEach((inp, k) => {
                    if (k !== j) {
                        if (inp.getAttribute("data-open") == "true") {
                            closeAccordion(inp);
                        }
                    }
                });
            }
            // 콘텐츠 토글 기능 있으면 (페이지 : PAY-MO-10-PG-001-5 구독 방식 - 정기 구독)
            if (input.classList.contains("input-with-toggle")) {
                if (input.classList.contains("show")) {
                    document.querySelector(".content-input-toggle").classList.add("show");
                } else {
                    document.querySelector(".content-input-toggle").classList.remove("show");
                }
            }
        };
    });
}

gsap.utils.toArray(".input-accordion-group").forEach((group) => {
    const inputs = gsap.utils.toArray(".input-radio", group);

    inputRadioWithAccordion(inputs);
});

// 아코디언 클릭 이벤트 생성
function _initAccordionEvent(e) {
    if (e.target.tagName == "INPUT" || e.target.tagName == "LABEL") {
        return;
    }
    const accordion = e.currentTarget.closest(".accordion-container");
    if (accordion.getAttribute("data-open") == "true") {
        closeAccordion(accordion);
    } else {
        if (accordion.hasAttribute("data-single")) {
            if (document.querySelector('.accordion-container[data-open="true"]')) {
                const toCloseAccordion = document.querySelector('.accordion-container[data-open="true"]');

                if (!toCloseAccordion.hasAttribute("data-auto-close")) {
                    closeAccordion(toCloseAccordion);
                }
            }
        }
        openAccordion(accordion);
    }
}

function initAccordionSingle(accordion) {
    if (accordion.classList.contains("custom")) return;
    if (accordion.classList.contains("input-radio")) return;
    if (accordion.querySelector(".accordion-header")) {
        accordion.querySelector(".accordion-header").removeEventListener("click", _initAccordionEvent);
        accordion.querySelector(".accordion-header").addEventListener("click", _initAccordionEvent);
    }
}
function initAccordion() {
    gsap.utils.toArray(".accordion-container").forEach((accordion) => {
        initAccordionSingle(accordion);
    });
}
function initAccordionGroup() {
    gsap.utils.toArray(".detail-content").forEach((content) => {
        if (content.classList.contains("accordion-container-group")) {
            const accordions = gsap.utils.toArray(".accordion-container", content);

            accordions.forEach((accordion, index) => {
                if (accordion.classList.contains("custom")) return;
                if (accordion.classList.contains("input-radio")) return;
                if (accordion.querySelector(".accordion-header")) {
                    accordion.querySelector(".accordion-header").addEventListener("click", (e) => {
                        if (e.target.tagName == "INPUT" || e.target.tagName == "LABEL") {
                            return;
                        }
                        if (accordion.getAttribute("data-open") == "true") {
                            closeAccordion(accordion);
                        } else {
                            if (accordion.hasAttribute("data-single")) {
                                accordions.forEach((a, j) => {
                                    if (a.getAttribute("data-open") == "true" && index !== j) {
                                        if (!a.hasAttribute("data-auto-close")) {
                                            closeAccordion(a);
                                        }
                                    }
                                });
                            }
                            openAccordion(accordion);
                        }
                    });
                }
            });
        } else {
            gsap.utils.toArray(".accordion-container", content).forEach((accordion) => {
                initAccordionSingle(accordion);
            });
        }
    });

    gsap.utils.toArray(".popup-full").forEach((popup) => {
        gsap.utils.toArray(".accordion-container", popup).forEach((accordion) => {
            initAccordionSingle(accordion);
        });
    });
}

if (document.querySelector(".detail .tabbar-detail")) {
    initAccordionGroup();
} else {
    initAccordion();
}

// 디폴트로 열려야 하는 아코디언 요소들
function _initAccordionToOpen(callback) {
    if (document.querySelector('.accordion-container[data-open="true"]')) {
        gsap.utils.toArray('.accordion-container[data-open="true"]').forEach((container) => {
            openAccordion(container.closest(".accordion-container"), null, callback);
        });
    }
}
_initAccordionToOpen();
function activeSelectedTab(container, slide, index, init) {
    if (container.classList.contains('is-swiper')) {
        const swiper = container.swiper;
        const slideWidth = slide.clientWidth;
        const containerWidth = swiper.el.clientWidth;
        const slidePosition = slide.offsetLeft;
        const centerPosition = (containerWidth / 2) - (slideWidth / 2);
        
        
        let translateX = slidePosition - centerPosition;

        if (translateX < 24) {
            translateX = -24;
        }

        const maxTranslateX = swiper.wrapperEl.scrollWidth - containerWidth;

        if (translateX > maxTranslateX) {
            translateX = maxTranslateX;
        }

        const _dt = init ? 0 : 350;

        swiper.translateTo(translateX * -1, _dt)
    } else {
        scrollSelectTab(container, index, init);
    }
}
// [tab]
function transitionActiveLine(container, index, init, reset) {
    const tabs = gsap.utils.toArray(".tab", container);

    const tab = tabs[index];
    const { width, x, left } = tab.getBoundingClientRect();
    let spd = 0.6;

    let _x = left - container.getBoundingClientRect().left;

    if (init) {
        spd = 0;
    }

    activeSelectedTab(container, tab, index, init)

    if (container.querySelector(".line")) {
        const line = container.querySelector(".line");
        gsap.to(line, { width: width, duration: spd, ease: "power2.out" });

        if (container.classList.contains('is-swiper')) {
            container.classList.add('visible-line')
            gsap.to(line, { x: (left - container.getBoundingClientRect().left) , duration: spd, ease: "power2.out" });
        } else {
            let _xv = 24;
            const _tabMargin = parseInt(gsap.getProperty(container, 'gap'));
            const _beforeTab = tabs.filter((t, i) => i < index);

            _beforeTab.forEach(t => {
                _xv += t.getBoundingClientRect().width + _tabMargin;
            });
            
            gsap.to(line, { x: _xv, duration: spd, ease: "power2.out", onComplete: () => {
                container.classList.remove('visible-line')
            } });
        }
    }

    toggleClass(tabs, index);

    if (reset) {
        scrollReset();
    }
}

function scrollSelectTab(container, index, init) {
    const tabs = gsap.utils.toArray(".tab", container);
    const tab = tabs[index];
    const { width, x } = tab.getBoundingClientRect();

    let spd = 0.6;

    let _x = x - document.querySelector(".container").getBoundingClientRect().left;

    if (init) {
        spd = 0;
    }

    gsap.to(container, { scrollTo: { x: tab, offsetX: Math.floor(document.querySelector(".container").clientWidth / 2 - width / 2) }, duration: spd, ease: "power2.out" });
}

function btnFloatingUIEvent(button) {
    let _scroller = window;

    button.addEventListener("click", () => {
        scrollReset(_scroller);
        button.classList.remove("active");
    });

    const minYV = document.querySelector(".header") ? document.querySelector(".header").clientHeight : 60;

    const observer = Observer.create({
        target: document,
        type: "scroll",
        onUp: (e) => {
            const _sy = e.scrollY();
            if (gsap.isTweening(window)) {
                button.classList.remove("active");
                return;
            }
            if (_sy < minYV) {
                button.classList.remove("active");
                return;
            }
            button.classList.add("active");
        },
        onDown: (e) => {
            const _sy = e.scrollY();
            if (_sy < minYV) {
                button.classList.remove("active");
                return;
            }
            if (!button.classList.contains("active")) {
                button.classList.add("active");
            }
        },
    });
}
gsap.utils.toArray(".btn-floating-top").forEach((button) => btnFloatingUIEvent(button));

function scrollReset(scroller) {
    gsap.to(scroller ? scroller : window, {
        scrollTo: { y: 0 },
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            if (document.querySelector(".btn-floating-top") && document.querySelector(".btn-floating-top.active")) {
                document.querySelector(".btn-floating-top").classList.remove("active");
            }
        },
    });
}

//////////////////// [배너] ////////////////////
// [이벤트] 이미지 배너 슬라이드 이벤트 (img-banner-swiper)
function initImgBannerSwiper(swiper) {
    if (swiper.classList.contains("custom")) return;
    const option = {
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        nested: true,
        pagination: {
            el: swiper.querySelector(".swiper-pagination"),
        },
    };

    if (swiper.hasAttribute("data-auto-play")) {
        option.autoplay = {
            delay: swiper.getAttribute("data-auto-play"),
            disableOnInteraction: false,
        };
    }
    const slides = swiper.querySelectorAll(".swiper-slide");
    const changeLink = swiper.classList.contains("has-link");
    let buttonLink;

    // 활성화된 슬라이드의 버튼 링크로 교체 (data-url 속성으로 임의 추가해두었습니다)
    if (changeLink) {
        buttonLink = swiper.parentElement.querySelector(".btn-swiper-link");
        buttonLink.href = slides[0].getAttribute("data-url");
    }

    if (slides.length < 2) {
        swiper.classList.add("swiper-single");
    } else {
        const _swiper = createSwiper(swiper, option);

        if (swiper.querySelector(".pageindicator-num")) {
            const indicator = swiper.querySelector(".pageindicator-num");
            swiper.querySelector(".pageindicator-num .total").innerHTML = slides.length;
            gsap.to(swiper.querySelector(".pageindicator-num"), { opacity: 1, duration: 0.15, ease: 'power1.out' })
            _swiper.on("slideChange", (s) => {
                const { activeIndex, realIndex } = s;
                swiper.querySelector(".pageindicator-num .current").innerHTML = realIndex + 1;
                if (buttonLink) {
                    buttonLink.href = slides[realIndex].getAttribute("data-url");
                }
            });
        }
    }
}

function initBannerSwiper() {
    gsap.utils.toArray(".swiper").forEach((swiper) => {
        initImgBannerSwiper(swiper);
    });
}

if (document.querySelector(".btn-debug")) {
    document.querySelector(".btn-debug").addEventListener("click", () => {
        if (!document.body.classList.contains("is-debug")) {
            document.body.classList.add("is-debug");
        } else {
            document.body.classList.remove("is-debug");
        }
    });
}

function viewCustomLoading(_dt) {
    const popup = document.querySelector(".blind-loading");
    const lottie = popup.querySelector(".loading");
    const txt = popup.querySelector(".txt-loading .txt");
    const background = popup.querySelector('.popup-background') ?? null;

    const dt = _dt ?? 4.7;

    gsap.killTweensOf([popup, lottie, txt, background], "all");
    gsap.set(popup, { display: "block", pointerEvents: "auto" });
    gsap.set([txt, lottie, background], { opacity: 0 })

    setZindex(popup, 1100);
    if (background) {
        gsap.to(background, { opacity: 1, duration: 0.3, ease: "power1.inOut" });
    }
    gsap.to(lottie, {
        opacity: 1,
        duration: 0.35,
        ease: "power1.inOut",
        delay: 0,
        onComplete: () => {
            disableScroll();
        },
    });

    if (lottie.querySelector("lottie-player").pause) {
        lottie.querySelector("lottie-player").play();
    }
    gsap.to(txt, { opacity: 1, duration: 0.3, ease:"power1.inOut", delay: dt })

}

function hideCustomLoading() {
    const popup = document.querySelector(".blind-loading");
    const lottie = popup.querySelector(".loading");
    const txt = popup.querySelector(".txt-loading .txt");
    const background = popup.querySelector('.popup-background') ?? null;

    gsap.killTweensOf([popup, lottie, txt, background], "all");

    gsap.set(popup, { pointerEvents: "none" });

    gsap.to([lottie, txt], {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => {
            if (!lottie.querySelector("lottie-player").pause) {
                lottie.querySelector("lottie-player").pause();
            }
        },
    });

    if (background) {
        gsap.to(background, {
            opacity: 0,
            duration: 0.24,
            ease: "power1.inOut",
            delay: 0.15,
            onComplete: () => {
                gsap.set(popup, { display: "none" });
                gsap.set(popup, { clearProps: "zIndex" });
                gsap.delayedCall(0.1, () => {
                    enableScroll();
                });
            },
        });
    }
}

// [인풋] 인풋 값 체크 이벤트 - 한 번만 실행 (등록 클릭 했을 때부터 - 에러 케이스 발생)
function checkMinTextLength(_container) {
    let container = _container ? _container : document;

    gsap.utils.toArray(".input-text-length-wrap", container).forEach((wrap) => {
        wrap.setAttribute("data-checked", true);
        checkValidateLength(wrap, wrap.querySelector(".input-text-length"));
    });
}

// [탭]
function defaultEventTabWithLine(tabContainer, contents, trigger, ignorereset, callback) {
    const tabs = gsap.utils.toArray(".tab", tabContainer);
    const _index = tabs.findIndex(t => t.classList.contains('selected'))
    const index = _index == -1 ? 0 : _index;

    transitionActiveLine(tabContainer, index, true);
    if (contents) {
        toggleClass(contents, index);
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            if (tab.classList.contains("selected")) return;
            if (contents) {
                toggleClass(contents, index);
            }
            

            // if (tabContainer.swiper) {
            //     tabContainer.swiper.slideTo(index)
            // } 

            transitionActiveLine(tabContainer, index);

            if (!ignorereset) {
                if (trigger) {
                    scrollReset();
                    // tabs.forEach((t, j) => {
                    //     if (index == j) {
                    //         ScrollTrigger.getById(`filter-fixed-${j}`).enable();
                    //     } else {
                    //         ScrollTrigger.getById(`filter-fixed-${j}`).disable();
                    //     }
                    // });
                    refreshScrollTrigger();
                }
            }

            if (callback) {
                callback()
            }
        });
    });
}
// gsap.set('.sticky-ui', { opacity: 0.3 })
function pinFilterTab(content, index, scroller) {}

function refreshScrollTrigger() {
    ScrollTrigger.getAll().forEach((st) => st.refresh());
}

// [페이지] 설정 : MEM-MO-15-PU-002-1 / 로그인 MEM-MO-PG-003
let timerAuth = null;
function initAuthNumber() {
    let expiredTime;
    const popup = document.querySelector(".popup[data-type=popup-auth-number]");

    function authValidateTimer() {
        const VALIDATE_TIME = 7

        // if (document.querySelector('.card-barcode').classList.contains('expired')) {
        //     document.querySelector('.card-barcode').classList.remove('expired');
        // }
        popup.querySelector(".auth-number").innerHTML = `${VALIDATE_TIME < 10 ? `0${VALIDATE_TIME}` : VALIDATE_TIME}:00`;
        popup.querySelector('.form-group-auth').classList.remove('error-expired')
        expiredTime = new Date().setMinutes(new Date().getMinutes() + VALIDATE_TIME);

        if (!timerAuth) {
            timerAuth = setInterval(countDown, 1000);
            const inputWrap = popup.querySelector(".form-group-auth");
            if (inputWrap.classList.contains("error")) {
                inputWrap.classList.remove("error");
                document.querySelector(".txt-notice .txt-title").innerHTML = "인증번호가 도착하지 않았나요?";
            }
        }
    }
    const inputWrap = popup.querySelector(".form-group-auth");
    const input = inputWrap.querySelector(".inp-auth-number");

    function authToExpired() {
        const inputWrap = popup.querySelector(".form-group-auth");
        const input = inputWrap.querySelector(".inp-auth-number");
        const button = popup.querySelector(".btn-validate");

        clearInterval(timerAuth);
        timerAuth = null;

        popup.querySelector(".auth-number").innerHTML = "00:00";
        inputWrap.classList.add("error");
        inputWrap.classList.add('error-expired')
        if(button.classList.contains('is-loading')) {
            button.classList.remove('is-loading')
        }
        button.classList.remove('bg-black')
        button.disabled = true;
        popup.querySelector(".txt-notice .txt-title").innerHTML = "인증 시간이 초과되었어요. 인증 번호를 재전송해 주세요.";
    }

    function countDown() {
        const now = new Date();
        const diff = expiredTime - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor(diff / 1000);

        const m = mins - hours * 60;
        const s = secs - mins * 60;

        popup.querySelector(".auth-number").innerHTML = `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;

        if (diff <= 0) {
            authToExpired();
        }
        const inputWrap = popup.querySelector(".form-group-auth");
        const input = inputWrap.querySelector(".inp-auth-number");
        const button = popup.querySelector(".btn-validate");
        const guideText = popup.querySelector(".txt-notice .txt-title");

        button.addEventListener("click", () => {
            // 성공 케이스
            if (inputWrap.classList.contains('error')) return;
            if (input.value.length == input.getAttribute("maxlength")) {
                inputWrap.classList.remove("error");
                // [로그인] MEM-MO-PG-003 성공 토스트 안뜸.
                if (!button.classList.contains("btn-non-toast")) {
                    toast(document.querySelector(".popup-toast[data-type=success-toast]"));
                } else {
                    if (button.classList.contains("btn-loading")) {
                        // 'is-loading' 클래스 추가 시 lottie-player 보여집니다.
                        button.classList.add("is-loading");
                        button.querySelector("lottie-player").currentTime = 0;
                        button.querySelector("lottie-player").play();
                    }
                }
            } else {
                if (input.value.length == 0) {
                    openPopup("fail-toast");
                    guideText.innerHTML = "인증 번호 입력 후 인증해 주세요.";
                } else {
                    inputWrap.classList.add("error");
                    guideText.innerHTML = "인증번호가 일치하지 않습니다. 다시 입력해 주세요.";
                }

                
            }
        });
        input.oninput = () => {
            if (inputWrap.classList.contains('error-expired')) return;
            if (input.value.length > 0) {
                if (input.value.length == input.getAttribute("maxlength")) {
                    document.activeElement.blur();
                    button.click();
                }
                if (!button.classList.contains("bg-black")) {
                    button.classList.add("bg-black");
                }
            }
            // if (input.value.length )
        };
    }

    authValidateTimer();
}
if (document.querySelector(".popup[data-type=popup-auth-number] .auth-number")) {
    initAuthNumber();
}
// [페이지] 설정 : MEM-MO-15-PU-001 / 로그인 : MEM-MO-PG-001
function initRegisterForm() {
    const popup = document.querySelector(".input-form");
    const buttonSubmit = popup.querySelector(".btn-validate");
    const inputs = gsap.utils.toArray(".input-text-length-wrap", popup);

    if (popup.querySelector(".input-telecom")) {
        popup.querySelector(".input-telecom .txt-selected").addEventListener("focusin", () => {
            gsap.delayedCall(0.1, () => {
                openPopup("tel");
            });
        });
    }
    // 이름
    // 주민등록번호
    if (popup.querySelector(".input-birth-wrap")) {
        const inputWrap = document.querySelector(".input-birth-wrap");
        const inputResident = gsap.utils.toArray(".input-birth", inputWrap);
        const cross = document.querySelector(".cross");

        inputResident.forEach((input, index) => {
            const max = input.getAttribute("max");
            input.onkeydown = () => {
                if (input.value.length > max) return;
                input.value = input.value.substring(0, max);

                if (index == 0) {
                    if (input.value.length == max) {
                        inputWrap.classList.add("fill");
                    } else {
                        inputWrap.classList.remove("fill");
                    }
                }
                if (index == 1) {
                    if (input.value.length < 1) {
                        document.activeElement.blur();
                        inputWrap.classList.remove("fill");
                    }
                }
            };
            input.onkeypress = () => {
                input.value = input.value.substring(0, max);
            };
            input.onkeyup = () => {
                input.value = input.value.substring(0, max);
            };
        });
    }

    const fillInputs = inputs.filter((inp) => inp.querySelector(".input-text-length") && inp.querySelector(".input-text-length").hasAttribute("tabIndex"));

    // [다음] 버튼 - 디폴트 : 활성화_비강조 상태
    // 화면 내 모든 입력필드 내 1자 이상 입력된 경우 활성화_강조 상태로 전환
    inputs.forEach((wrap) => {
        const _input = wrap.querySelector("input");

        _input.oninput = () => checkValidateLength(wrap, _input);
        _input.onblur = () => {
            const isOnce = wrap.classList.contains("once");
            checkValidateLength(wrap, _input, isOnce);
        };
        _input.addEventListener("focusout", () => {
            if (fillInputs.filter((inp) => inp.querySelector("input").value.length == 0).length < 1) {
                if (!buttonSubmit.classList.contains("bg-black")) {
                    buttonSubmit.classList.add("bg-black");
                }
            }
        });

        if (_input.classList.contains("input-phone")) {
            // gsap.utils.toArray('.input-phone').forEach((input) => {
            // const container = popup.querySelector('.input-phone').parentElement;

            _input.onkeydown = (e) => validatePhone(e, wrap);
            _input.onkeyup = (e) => validatePhone(e, wrap);
            _input.onkeypress = (e) => validatePhone(e, wrap);
        }
    });

    buttonSubmit.addEventListener("click", () => {
        inputs.forEach((input) => checkValidateLength(input, input.querySelector(".input-text-length"), true));

        const checkedLength = inputs.filter((input) => input.classList.contains("error"));

        if (checkedLength.length == 0) {
            // 성공
            if (buttonSubmit.hasAttribute("data-next")) {
                openPopup(buttonSubmit.getAttribute("data-next"));
            } else {
                openPopup("agree");
            }
        } else {
            // 실패
            toast(document.querySelector(".popup-toast[data-type=fail-submit]"));
        }
    });
    // if (document.querySelector('.btn-evt-next-loading')) {
    //     const button = document.querySelector('.btn-evt-next-loading');
    //     button.addEventListener('click', () => {
    //         if (button.classList.contains('bg-black')) {
    //             button.classList.add('btn-loading');
    //             button.disabled = true;
    //         }
    //     });
    // }
}
if (document.querySelector(".input-form")) {
    initRegisterForm();
}

// 결제수단 (payment-content-method -> card-swiper) - 카드사 슬라이드
// [결제] 결제하기 페이지 일괄, 구독관리-상품 : 결제 관련 페이지
function initCardSwiper() {
    const swiper = document.querySelector(".card-swiper");
    const slides = gsap.utils.toArray(".swiper-slide", swiper);

    if (slides.length < 2) {
        swiper.classList.add("swiper-single");
        return;
    } else {
        swiper.classList.remove("swiper-single");
    }
    const option = {
        init: false,
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        touchStartPreventDefault: isMobile ? true : false,
        touchMoveStopPropagation: isMobile ? true : false,
        observer: true,
        cssMode: isMobile ? true : false
    };

    const _swiper = createSwiper(swiper, option);

    _swiper.on("init", function (e) {
        // do something
        slides.forEach((s, i) => {
            if (s.classList.contains("checked") && e.realIndex !== i) {
                _swiper.slideTo(i, 0);
            }
        });
    });
    _swiper.on("touchStart", function (e) {
        // do something
        if (e.pointerType === 'touch' && e.changedTouches[0].pageX < 30) {
            e.preventDefault();
        }
    });
    _swiper.init();
    _swiper.on("slideChange", (e) => {
        toggleClass(slides, e.realIndex, "checked");
    });

    return _swiper;
}

function initBannerPayment() {
    const option = {
        spaceBetween: 15,
        centeredSlides: false,
        slidesPerGroup: 1,
        slidesPerView: 'auto',
        longSwipes: false,
        touchRatio: 0.3,
        loop: true,
        customTouchRatio: true,
        pagination: {
            el: document.querySelector(".banner-payment .swiper-pagination"),
        },
    };

    if (isIOS) {
        option.touchRatio = 0.5;
    }


    createSwiper(document.querySelector(".banner-payment"), option);
    

    
}

// [이벤트] '복사하기'
/** data-copy-text="복사될 텍스트" */
// 다른 방식으로 수정해야한다면 전달 부탁드립니다.
function copyClipboard(button) {
    if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(button.getAttribute("data-copy-text")).then(() => {
            toast(document.querySelector('.popup-toast[data-type="toast-copy-text]'), 2);
        });
    }
}

// [팝업] 배송/구독 시작일 팝업

function initChangeDeliveryDate(popup) {
    const buttonCalendar = gsap.utils.toArray(".btn-calendar-date", popup);
    const buttonSubmit = popup.querySelector(".btn-main-task");

    buttonCalendar.forEach((button, i) => {
        button.addEventListener("click", () => {
            if (!button.classList.contains("selected")) {
                toggleClass(buttonCalendar, i);
                toggleClass(buttonCalendar, buttonCalendar.length + 1, "active-turn");
                const _b = moment(button.getAttribute("data-cal-datetext").split(". (")[0].split(". ").join("/"));
                popup.querySelector(".txt-round-date").innerHTML = button.getAttribute("data-cal-datetext");

                for (let j = 0; j < 3; j++) {
                    const next = _b.add(1, "week");
                    const findDays = ["월", "화", "수", "목", "금", "토", "일"];
                    const formatter = next.format("YYYY.M.D");
                    const finder = `${formatter.split(".").join(". ")}. (${findDays[next.isoWeekday() - 1]})`;
                    const target = popup.querySelector(`.btn-calendar-date[data-cal-datetext="${finder}"`);
                    if (target) {
                        target.classList.add("active-turn");
                    }
                }
                if (!buttonSubmit.classList.contains("bg-black")) {
                    buttonSubmit.classList.add("bg-black");
                    if (buttonSubmit.hasAttribute("disabled") && buttonSubmit.disabled == true) {
                        buttonSubmit.disabled = false;
                    }
                }
            }
        });
    });

    buttonSubmit.addEventListener("click", () => {
        if (buttonSubmit.classList.contains("bg-black")) {
            closePopup(popup.getAttribute("data-type"));

            // gsap.delayedCall(0.5, () => {
            //     toast(document.querySelector('.popup[data-type=success-submit]'));
            // });
        }
    });
}
//

function resetField(i) {
    gsap.utils.toArray(".tab-content-wrap .tab-content").forEach((c, j) => {
        if (j !== i) {
            gsap.utils.toArray(".input-text-length-wrap", c).forEach((input) => {
                input.classList.remove("error");
                if (input.querySelector(".input-text-length")) {
                    input.querySelector(".input-text-length").value = "";
                }
            });
            gsap.utils.toArray(".fields .input-set", c).forEach((set, k) => {
                if (k > 0) {
                    set.remove();
                }
            });
        }
    });
    toggleClass(gsap.utils.toArray(".tab-content-wrap .tab-content"), i);
    // detectEnable();
}
function prevCheckEvent(i) {
    const popup = document.querySelector('.popup-custom[data-type="reset-check"]');
    setZindex(popup, 3100);
    openPopup("reset-check");
    gsap.utils.toArray(".btn-group button", popup).forEach((button) => {
        button.addEventListener("click", () => {
            if (button.classList.contains("btn-confirm")) {
                resetField(i);
                closePopup("reset-check");
                gsap.utils.toArray('input[name="radio-tab-group"]')[i].checked = true;
            } else {
                closePopup("reset-check");
                gsap.utils.toArray('input[name="radio-tab-group"]').forEach((g, k) => {
                    if (k !== i) {
                        g.checked = true;
                    } else {
                        g.checked = false;
                    }
                });
            }
        });
    });
}
function inputFilledCheckEVent() {
    const inputs = gsap.utils.toArray('input[name="radio-tab-group"]');
    gsap.utils.toArray('input[name="radio-tab-group"]').forEach((inp, i) => {
        inp.onchange = () => {
            // 입력값 있는지 확인

            gsap.utils.toArray(".tab-content-wrap .tab-content").forEach((c, j) => {
                if (j !== i) {
                    const filled = gsap.utils.toArray(".input-text-length", c).filter((input) => input.value).length;
                    inp.checked = false;
                    if (filled) {
                        prevCheckEvent(i);
                    } else {
                        inp.checked = true;

                        toggleClass(gsap.utils.toArray(".tab-content-wrap .tab-content"), i);
                        // detectEnable();
                    }
                }
            });
        };
    });
}

//
function _initComMoreProduct() {
    let numClicked = 1;
    let loadContArr = [];
    gsap.utils.toArray(".card-product-content").forEach((content, i) => {
        const ElArr = gsap.utils.toArray(".com-card-product", content);
        if (ElArr.length > 10 && content.querySelector("button.btn-txt-ico")) {
            const loadMoreContents = () => {
                numClicked = numClicked + 1;
                loadContArr = [];
                ElArr.forEach((el, idx) => {
                    if (idx < 10 * numClicked && idx < ElArr.length) {
                        el.style.display = "flex";
                        loadContArr.push(el);
                    }
                });

                if (loadContArr.length === ElArr.length) {
                    content.classList.add("is-open");
                }
            };
            content.querySelector("button.btn-txt-ico").removeEventListener("click", loadMoreContents);
            content.querySelector("button.btn-txt-ico").addEventListener("click", loadMoreContents);
        }
    });
}

// header - sticky
function scrollTransitionSticky(state, nonAnim) {
    if (state == "hide") {
        if (document.body.classList.contains("is-lock")) return;
    }
    // if (document.body.classList.contains('is-lock')) return;
    if (!document.querySelector('.sticky-ui')) {
        const ui = document.querySelector(".sticky-ui");
        const headerHeight = ui.querySelector(".header").clientHeight;
        const container = document.querySelector(".wrap");
        let _duration = 0.3;
        let _ease = "power1.out";
    
        if (document.querySelector('#common-membership-header-main-area.header-main[style="display: none;"]')) {
            document.body.classList.add('page-ssp-membership')
        }
    
        if (nonAnim) {
            _duration = 0;
            _ease = "power0.none";
        }
    
        const yv = {
            value: 0,
        };
    
        gsap.set(ui, { "--height": headerHeight });
    
        const updatePosition = (yv) => {
            gsap.set(ui, { y: yv.value });
    
            if (container.querySelector(".sticky-tab")) {
                gsap.set(".sticky-tab", { y: yv.value });
                gsap.set(".sticky-tab", { "--y": `${yv.value}px` });
            }
        };
        if (state == "hide") {
            if (container.classList.contains("hide")) return;
            container.classList.add("hide");
    
            gsap.to(yv, {
                value: -headerHeight,
                duration: _duration,
                ease: _ease,
                onUpdate: () => {
                    updatePosition(yv);
                },
            });
        } else if (state == "show") {
            if (!container.classList.contains("hide")) return;
            container.classList.remove("hide");
    
            gsap.to(yv, {
                value: 0,
                duration: _duration,
                ease: _ease,
                onUpdate: () => {
                    updatePosition(yv);
                },
            });
        }
    }

}
function _initHeaderTransition(scroller) {
    // header type
    let header = document.querySelector(".sticky-ui");
    if (scroller) {
        header = scroller.querySelector(".sticky-ui");
    }

    let minHeight = header.querySelector(".header").clientHeight;

    let innerTab;

    if (header.parentElement.querySelector(".sticky-tab")) {
        innerTab = header.parentElement.querySelector(".sticky-tab");
        minHeight = innerTab.getBoundingClientRect().top - minHeight;
        if (minHeight < 0) {
            minHeight = document.querySelector(".header").clientHeight;
        }
    }
    const observer = Observer.create({
        target: scroller ? scroller : document,
        type: "scroll",
        onUp: (e) => {
            scrollTransitionSticky("show");
        },
        onDown: (e) => {
            if (e.scrollY() < minHeight) {
                scrollTransitionSticky("show", true);
                return;
            }
            if (innerTab) {
                if (gsap.utils.toArray(".sticky-tab").length > 1) {
                    if (document.querySelector(".category-dsp-mo-4-tb-001")) {
                        const selectTab = document.querySelector(".category-dsp-mo-4-tb-001 .tab-main-content.selected .sticky-tab");
                        if (selectTab) {
                            if (selectTab.classList.contains("fixed")) {
                                scrollTransitionSticky("hide");
                            }
                        }
                    }
                } else {
                    if (innerTab.classList.contains("fixed")) {
                        scrollTransitionSticky("hide");
                    }
                }
            } else {
                if (e.scrollY() > minHeight) {
                    scrollTransitionSticky("hide");
                }
            }
        },
        onEnable: () => {
            if (isSafari()) {
                document.documentElement.style.overscrollBehavior = 'none';
                document.body.style.overscrollBehavior = 'none';
            }
        },
        onDisable: () => {
            document.documentElement.style.overscrollBehavior = '';
            document.body.style.overscrollBehavior = '';
        }
    });
}

function _initHeaderStickyTab(container, scroller) {


    gsap.utils.toArray(".sticky-tab").forEach((tab) => {
        if (!tab.hasAttribute('data-load')) {
            tab.setAttribute('data-load', true)
            let _top = 0;
            let _end = 0;
            
            if (container.querySelector(".sticky-ui")) {
                _top = container.querySelector(".sticky-ui").clientHeight;
            } else {
                _top = container.querySelector(".header").clientHeight;
            }

            const toggleFixed = (state) => {
                if (state) {
                    tab.classList.add("fixed");
                    if (tab.closest('.pin-tab-area')) {
                        gsap.set(tab.closest('.pin-tab-area'), { zIndex: 'unset'})
                    }
                } else {
                    tab.classList.remove("fixed");
                    if (tab.closest('.pin-tab-area')) {
                        gsap.set(tab.closest('.pin-tab-area'), { zIndex: '1'})
                    }
                }
            }

            ScrollTrigger.create({
                trigger: tab,
                start: () => `top top+=${_top}`,
                endTrigger: container,
                end: () => `120% bottom`,
                pin: tab,
                scroller: scroller ? scroller : window,
                pinSpacing: false,
                pinType: "fixed",
                id: `sitkcy-tab`,
                markers: false,
                onUpdate: (self) => {
                    if (!self.isActive && _end !== 0) {
                        if (container.offsetHeight !== _end) {
                            if (self.scroller.scrollY >= self.end) {
                                _end = container.offsetHeight
                                self.refresh()
                            }
                        }
                    }
                },
                onToggle: (self) => {
                    if (self.isActive) {
                        toggleFixed(true)
     
                    } else {
                        toggleFixed(false);
          
                    }
                },
                onLeave: () => {
                    if (!container.querySelector('.filter-option-content')) {
                        toggleFixed(false);
                    }
                },
                onLeaveBack: () => {
                    if (!container.querySelector('.filter-option-content')) {
                        toggleFixed(false);
                    }
                },
            });

            _end = container.offsetHeight
        }

    });
}

function _initHeaderStickyEvent() {
    gsap.utils.toArray(".container").forEach((container) => {
        let scroller = null;

        if (container.parentElement.classList.contains("popup")) {
            scroller = container.querySelector(".wrap");
        }
        if (container.querySelector(".sticky-tab")) {
            _initHeaderStickyTab(container, scroller);
        }

        if (container.querySelector(".sticky-ui")) {
            if (container.parentElement.classList.contains("popup")) {
                _initHeaderTransition(container);
            } else {
                _initHeaderTransition();
            }
        }
    });
}

// productBottom
function _initProductBottomsheet() {
    let productBottomSheets = [];

    gsap.utils.toArray("form", document.querySelector(".productbottom")).forEach((form, i) => {
        productBottomSheets[i] = new ProductBottom(form);
        productBottomSheets[i].checkSubmit();
    });
}

function _initProductBottomSelectCategory() {
    const popup = document.querySelector(".popup-select-product-category");

    const popupScrollUpdate = (list) => {
        const selectedTab = popup.querySelector(".tab-content.selected");

        gsap.to(popup.querySelector(".container"), {
            scrollTo: { y: selectedTab.querySelector(".content-com-product-container"), offsetY: 210 },
            duration: 0.6,
            ease: "power2.inOut",
            delay: 0,
        });
    };

    const filters = gsap.utils.toArray(".popup-bottomsheet-filter");
    createNewFilter();

    gsap.utils.toArray(".popup-listorder").forEach((popup, index) => {
        const btnSheets = gsap.utils.toArray(".btn-bottomsheet", popup);
        btnSheets.forEach((button, i) => {
            button.addEventListener("click", () => popupScrollUpdate(true));
        });
    });
}

function _inputProductBottomDetail() {
    document.querySelector(".popup-product-detail .btn-back").addEventListener("click", () => {
        closePopup("popup-product-detail");
    });
}

/// scroll to section content on tab click
function scrollToContent(tab, cl) {
    const toScrollTo = tab.getAttribute("data-scrollto");

    let _offsetY = 114;
    let _target = document.querySelector(`.${toScrollTo}`);

    if (!_target) {
        _target = document.querySelector(".pin-tab-area");
        _offsetY = 64;
    }

    if (window.scrollY-window.innerHeight < (_target.getBoundingClientRect().y )) {
        if (toScrollTo == 'detail-content-inquiry' || toScrollTo == 'detail-content-howtouse') {
            _offsetY += 30;
        }
    } else {
        if (toScrollTo !== 'detail-content-info-fold') {
            _offsetY += 30;
        }
    }

    document.body.classList.add('is-scrolling');

    const rect = _target.getBoundingClientRect();
    const offsetTop = window.scrollY + rect.top - _offsetY;

    gsap.to(window, { scrollTo: { y: offsetTop, autoKill: false, overwrite: true }, duration: 0.6, ease: "power2.out", onComplete: () => {
        if (cl) {
            document.body.classList.remove('is-scrolling')
        }
        if (ScrollTrigger.getById('sitkcy-tab')) {
            ScrollTrigger.refresh()
        }

        if (document.querySelector('.container').hasAttribute('data-init') && document.querySelector('.container').classList.contains('is-init')) {
            document.querySelector('.container').classList.remove('is-init')
        }
    }})

}
function _initTabContent() {
    const container = document.querySelector(".container");
    const contents = gsap.utils.toArray(".tab-content", container.querySelector(".tab-content-wrap"));
    const tabs = gsap.utils.toArray(".tab", container.querySelector(".tab-fixed"));

    let offsetY = container.querySelector(".sticky-ui") ? container.querySelector(".sticky-ui").clientHeight * 2 : 0;
    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => {
            let _yv = contents[i];
            if (container.classList.contains("tab-fixed-wrap")) {
                _yv = 0;
            }
            toggleClass(tabs, i);
            toggleClass(contents, i);
            ScrollTrigger.refresh();

            if(contents[i] && contents[i].querySelector('.com-txt-empty')) {
                container.classList.add("show-empty");
            } else {
                container.classList.remove("show-empty");
            }

            if (container.querySelector(".tab-fixed") && container.querySelector(".tab-fixed").classList.contains("detail-tabs")) {
                scrollToContent(tab, true);
            } else {
                gsap.to(window, {
                    scrollTo: { y: _yv, offsetY: offsetY },
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => {
                        if (container.querySelector(".sticky-ui")) {
                            scrollTransitionSticky("show");
                        }
                    },
                });
            }

            if (container.querySelector(".list-inquiry-wrap")) {
                if (container.querySelector(".list-inquiry-info")) {
                    container.classList.add("is-loggedin");
                }
            }
        });
    });
}
function _initTabSwipeHeader() {
    if (document.querySelector(".tab-swipe-header")) {
        defaultEventTabWithLine(document.querySelector(".tab-swipe-header"), gsap.utils.toArray(".tab-main-content-wrap .tab-main-content"), true, true);
        pcSwiperTabSlide()
    }
}

//
/**
 * @desc 퍼블 delivery.js FE에서 쓰는 함수 구별
 * @desc 따로 구현 예정 (팝업이라 각 html에서 import하기 힘듦)
 */
// 배송지 추가/수정 시 사용 (인풋 값 체크, 리스트 추가)
class DeliveryFormValidate {
    constructor(form) {
        this.form = form;
        this.formType = this.form.getAttribute("data-type");
        this.initAllInputsArr = [];
        this.chgAllInputsArr = [];
        this.allInputs = this.form.querySelectorAll("input, textarea");
        this.checkInputs = this.form.querySelectorAll(".input-validate");
        this.buttonSubmit = this.form.querySelector(".btn-validate");

        this.page = document.querySelector(".delivery-list-wrap");
        this.listContainer = document.querySelector(".delivery-list-container");
        this.pageInAddressList = this.page.querySelectorAll(".info-accordion-delivery");
        this.init();

        let inputVal = "";
        this.allInputs.forEach((input) => {
            if (input.id === "phonenumber") {
                inputVal = input.value.replace(/[^0-9]/g, "");
            } else if (input.getAttribute("type") === "checkbox") {
                inputVal = input.checked;
            } else {
                inputVal = input.value;
            }

            this.initAllInputsArr.push(inputVal);
        });

        this.checkInputs.forEach((input) => {
            if (input.classList.contains("input-phone") && input.value.length > 0) {
                const e = { target: input };
                validatePhone(e);
            }
        });
    }

    /**
     * @name checkValidate
     * @desc input 다 입력 됐는지 확인
     */
    /** input 다 입력 됐는지 확인 */
    checkValidate() {
        const checkCount = () => {
            let count = 0;
            this.checkInputs.forEach((input) => {
                // 약관
                if (input.type == "checkbox") {
                    if (!input.hasAttribute("required")) {
                        count++;
                    } else {
                        if (input.checked) {
                            count++;
                        } else {
                            count = 0;
                            return count;
                        }
                    }
                } else {
                    if (input.value) {
                        count++;
                    }
                }
            });

            return count;
        };

        const hasError = gsap.utils.toArray(".error", this.form).length;

        if (hasError) return false;
        if (this.formType === "edit-address") {
            this.chgAllInputsArr = [];
            let inputVal = "";
            this.allInputs.forEach((input) => {
                if (input.id === "phonenumber") {
                    inputVal = input.value.replace(/[^0-9]/g, "");
                } else if (input.getAttribute("type") === "checkbox") {
                    inputVal = input.checked;
                } else {
                    inputVal = input.value;
                }
                this.chgAllInputsArr.push(inputVal);
            });

            return checkCount() == this.checkInputs.length && JSON.stringify(this.initAllInputsArr) !== JSON.stringify(this.chgAllInputsArr);
        }
        if (checkCount() == this.checkInputs.length) return true;
    }

    /**
     * @name detectEnable
     * @desc input 다 입력 됐는지 확인되면 버튼 활성화 상태로 전환
     */
    /** input 다 입력 됐는지 확인되면 버튼 활성화 상태로 전환 */
    detectEnable() {
        if (this.checkValidate()) {
            if (this.buttonSubmit.disabled) {
                setTimeout(()=> {
                    this.buttonSubmit.disabled = false;
                },500)
            }
            if (!this.buttonSubmit.classList.contains("bg-black")) {
                setTimeout(()=> {
                    this.buttonSubmit.classList.add("bg-black");
                },500)
            }
        } else {
            if (!this.buttonSubmit.disabled) {
                this.buttonSubmit.disabled = true;
            }
            if (this.buttonSubmit.classList.contains("bg-black")) {
                this.buttonSubmit.classList.remove("bg-black");
            }
        }
    }
    /**
     * @name init
     * @desc 배송지 수정, 배송지 추가 input change, keydown 이벤트에 따라 validation 체크 (detectEnable 함수 실행)
     */
    init() {
        if (this.formType === "edit-address") {
            this.allInputs.forEach((i) => {
                i.addEventListener("input", this.detectEnable.bind(this));
            });
        } else {
            this.checkInputs.forEach((i) => {
                i.addEventListener("input", this.detectEnable.bind(this));

                if (i.disabled == true) {
                    i.onchange = () => {
                        this.detectEnable();
                    };
                }
            });
        }
    }
}

/**
 * @name DeliveryFormValidate 생성자 함수 binding
 * ##FE : FE에서 initDeliveryValidation()호출로 구현예정
 */
function initDeliveryValidation() {
    gsap.utils.toArray(".popup-address-input").forEach((popup, i) => {
        commonInputEvent(); // common.js 함수
        new DeliveryFormValidate(popup);
    });
}

function initInputClear() {
    const deleteInput = (e) => {
        e.target.parentElement.querySelector("input").value = "";
    };
    gsap.utils.toArray(".input-default").forEach((input) => {
        if (input.querySelector(".btn-input-x")) {
            input.querySelector(".btn-input-x").removeEventListener("click", deleteInput);
            input.querySelector(".btn-input-x").addEventListener("click", deleteInput);
        }
    });
}

// 선물하기, 상품 상세 [상품정보 더보기]
function detailFoldToggle() {
    const foldToggle = document.querySelectorAll(".detail-content-info-fold .fold-toggle");

    foldToggle.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            // toggle.classList.toggle('active');
            let fold_container = toggle.closest(".detail-content-info-fold").querySelector(".fold-container");
            let fold = fold_container.querySelector(".fold");
            let fold_toggle_label = fold_container.querySelector(".fold-toggle-text");

            const _height = 670;
            
            if (fold_container.getAttribute("data-open") == "false") {
                fold_container.setAttribute("data-open", true);
                fold_toggle_label.innerHTML = "상품 정보 접기";
                if (!document.querySelector('.container').hasAttribute('data-init')) {
                    document.querySelector('.container').setAttribute('data-init', true)
                    document.querySelector('.container').classList.add('is-init')
                }
                gsap.to(fold, {
                    height: "auto",
                    duration: 0.6,
                    ease: "power1.inOut",
                    onComplete: () => {
                        ScrollTrigger.refresh();
                        ScrollTrigger.update();
                    },
           
                });
                gsap.to(fold, {
                    height: "auto",
                    duration: 0.8,
                    ease: "power1.inOut",
                    onComplete: () => {
                        ScrollTrigger.refresh();
                        ScrollTrigger.update();
                    },
           
                });
            } else {
                fold_container.setAttribute("data-open", false);
                fold_toggle_label.innerHTML = "상품 정보 더 보기";
                if (document.querySelector('.container').hasAttribute('data-init') && document.querySelector('.container').classList.contains('is-init')) {
                    document.querySelector('.container').classList.remove('is-init')
                }
                gsap.to(fold, {
                    height: _height,
                    duration: 0.6,
                    ease: "power1.inOut",
                    onComplete: () => {
                        ScrollTrigger.refresh();
                        ScrollTrigger.update()
                    },
                });

                gsap.to(window, { scrollTo: { y: ".pin-tab-area", offsetY: 65 }, duration: 0.6, ease: "power2.out", onComplete: () => {
                    ScrollTrigger.refresh();
                    ScrollTrigger.update()
                }, });
            }
        });
    });
}

function buttonToLoading(button, callback) {
    if (!button) return;
    if (button.classList.contains("btn-loading")) {
        // 'is-loading' 클래스 추가 시 lottie-player 보여집니다.
        button.classList.add("is-loading");
        button.querySelector("lottie-player").currentTime = 0;
        button.querySelector("lottie-player").play();
        gsap.delayedCall(1, () => {
            gsap.delayedCall(0.1, () => {
                button.querySelector("lottie-player").pause();
                button.disabled = false;
                // 비지니스 로직처리 소스는 callback 으로
                callback();
            });
        });
    } else {
        // 비지니스 로직처리 소스는 callback 으로
        callback();
    }
}

function initBottomSheetFilter() {
    let tabs = gsap.utils.toArray(".tab-main-content");
    if (tabs.length == 0) {
        tabs = gsap.utils.toArray(".tab-content");
    }

    const filters = gsap.utils.toArray(".popup-bottomsheet-filter");

    let filterArr = [];
    let _total = 0;
    tabs.forEach((tab, index) => {
        if (tab.querySelector(".filter-fixed")) {
            filterArr[_total] = new Filter(tab, filters[index], _total, refreshScrollTrigger);
            _total++;
        }
    });
}

// popup-listorder (인기순, ...) 정렬 클릭 이벤트
function initPopupListorder() {
    gsap.utils.toArray(".popup-listorder").forEach((popup, index) => {
        const btnSheets = gsap.utils.toArray(".btn-bottomsheet", popup);
        const type = popup.getAttribute("data-type");
        popupBottomSheetEvent(btnSheets, type);
    });
}

// tab-swipe-btn-med click 스크롤 이벤트
function initTabSwipeBtnmedClick(e) {
    const tab = e.target;
    const index = tab.getAttribute("data-index");
    const tabContainer = tab.closest(".tab-swipe-btn-med");
    const tabs = gsap.utils.toArray(".tab", tabContainer);


    if (!tabContainer.classList.contains('is-swiper')) {
        activeSelectedTab(tabContainer, tab, index)
    }

    toggleClass(tabs, index);

    if (tabContainer.classList.contains("tab-event")) {
        initTabSwipeContent(tabContainer, index);
        pcSwiperTabSlide()
    }
    
}
function initTabSwipeContent(tabContainer, index) {
    const container = tabContainer.parentElement.querySelector(".tab-content-wrap");
    const contents = gsap.utils.toArray(".tab-content", container);
    toggleClass(contents, index);
}
function initTabSwipeBtnmed() {
    gsap.utils.toArray(".tab-swipe-btn-med").forEach((tabs) => {
        const hasTabContent = tabs.classList.contains("tab-event");
        const _index = gsap.utils.toArray('.tab', tabs).findIndex((tab, i) => tab.classList.contains('selected'));

        if (_index == -1) {
            gsap.utils.toArray('.tab', tabs)[0].classList.add('selected')
        }
        const index = _index == -1 ? 0 : _index;
        
        if (!tabs.classList.contains('is-swiper')) {
            activeSelectedTab(tabs, gsap.utils.toArray('.tab', tabs)[index], index, true)
        }

        tabs.querySelectorAll(".tab").forEach((tab, index) => {
            if (!tab.hasAttribute("data-index")) {
                tab.setAttribute("data-index", index);
            }
            tab.removeEventListener("click", initTabSwipeBtnmedClick);
            tab.addEventListener("click", initTabSwipeBtnmedClick);
        });
    });
}

// 가격 input 초기화 (filter / category / search)
// _container : '.range-input input', '.txt-result-default p' 를 감싸는 엘리먼트
function resetPrice(_container) {
    const container = _container ? _container : document;
    const rangeInput = container.querySelectorAll(".range-input input");
    let txt = container.querySelector(".txt-result-default p");

    rangeInput.forEach((input) => {
        input.value = input.getAttribute("data-init");
    });

    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    txt.innerHTML = `${minRange}${minRange > 0 ? "만 원" : "원 "} ~ ${maxRange}만 원`;

    gsap.set(gsap.utils.toArray(".range-selected", container), { clearProps: "all" });

    rangeInput[0].value = 0;
    rangeInput[1].value = 10;
}

function createNewFilter(idx) {
    idx = idx ? idx : 0;
    let tab = gsap.utils.toArray(".tab-main-content.selected");
    if (tab.length == 0) {
        tab = gsap.utils.toArray(".tab-content.selected");
    }
    const filters = gsap.utils.toArray(".popup-bottomsheet-filter");

    new Filter(tab[idx], filters[idx], 0, refreshScrollTrigger());
}

// 키보드 열린 상태 + 스크롤 이슈 테스트
const keyboardListener = () => {
    const KEYBOARD_HEIGHT = 300;
    const isKeyboardOpen = isMobile && window.screen.height - KEYBOARD_HEIGHT > window.visualViewport.height;

    let yv = null;

    function hideKeyboradEvent() {
        if (document.activeElement && document.activeElement.tagName === "INPUT") {
            // if ((yv + (document.activeElement.getBoundingClientRect().top + document.activeElement.clientHeight)) < window.scrollY) {
            //     if (document.activeElement) {
            //         document.activeElement.blur()
            //         document.removeEventListener('scroll', hideKeyboradEvent)
            //     }
            // }
        } else {
            document.removeEventListener("scroll", hideKeyboradEvent);
        }
    }

    if (isKeyboardOpen) {
        yv = window.scrollY;
        document.querySelector("body").classList.add("is-keyboardOpen");
        document.addEventListener("scroll", hideKeyboradEvent);
    } else {
        document.querySelector("body").classList.remove("is-keyboardOpen");
        if (yv !== null) {
            yv = null;
            document.removeEventListener("scroll", hideKeyboradEvent);
        }
    }
};
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", keyboardListener);
}

// mysubscription / footer_cs_event 내 바코드 유효 시간 타이머
function barcodeToExpired(content, timer) {
    clearInterval(timer);
    timer = null;
    content.classList.add("expired");
}
// function barcodeToExpired() {
//     clearInterval(timer);
//     timer = null;
//     content.classList.add('expired');
// }
function barcodeValidateTimer(_content, seconds) {
    let timer = null;
    let expiredTime;

    const content = _content;

    const VALIDATE_TIME = seconds ? Number(seconds) / 60 : 20;

    if (content.classList.contains("expired")) {
        content.classList.remove("expired");
    }
    content.querySelector(".txt-time-num").innerHTML = VALIDATE_TIME < 10 ? `0${VALIDATE_TIME}:00` : `${VALIDATE_TIME}:00`;
    expiredTime = new Date().setMinutes(new Date().getMinutes() + VALIDATE_TIME);

    const countDown = () => {
        const now = new Date();
        const diff = expiredTime - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor(diff / 1000);

        const m = mins - hours * 60;
        const s = secs - mins * 60;

        content.querySelector(".txt-time-num").innerHTML = `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;

        if (diff < 0) {
            barcodeToExpired(content, timer);
        }
    };

    if (!timer) {
        timer = setInterval(countDown, 1000);
    }

    // if (content.querySelector('.btn-refresh')) {
    //     content.querySelector('.btn-refresh').addEventListener('click', () => {
    //         barcodeValidateTimer(content);
    //     });
    // }

    return timer;
}

function initBannerInstall() {
    if (document.querySelector(".banner-install")) {
        const banner = document.querySelector(".banner-install");
        banner.setAttribute('data-load', true)
        ScrollTrigger.create({
            trigger: banner,
            start: () => `top top`,
            end: () => `+=10px`,
            id: `banner-install`,
            onEnter: () => {
                banner.classList.remove("banner-hide");
            },
            onEnterBack: () => {
                banner.classList.remove("banner-hide");
            },
            onLeave: () => {
                banner.classList.add("banner-hide");
            },
        });

        banner.querySelector(".button-close-banner").addEventListener("click", () => {
            banner.remove();
            ScrollTrigger.getById("banner-install").kill();
        });

        // popup-bottom-img 팝업 : [T 우주 앱 설치하고 더 많은 혜택을 받아보세요]
        const type = "noti";
        if (document.querySelector(`.popup[data-type=${type}]`)) {
            setZindex(document.querySelector(`.popup[data-type=${type}]`), 1)
            // openPopup(type);
            document.querySelector(`.popup[data-type=${type}] .btn-txt-underline`).addEventListener("click", () => {
                closePopup(type);
            });
        }
    }
}
function scrollReset() {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 0.6, ease: "power2.out" });
}

/** (스크롤 객체(앵커링 되야하는 요소), 스크롤되는 객체(popup이면 popup을 넘겨주세요), 애니메이션 시간) */
function scrollToFocus(el, popup, duration) {
    const _scroller = popup ? popup.querySelector(".container") : window;
    const _offsetY = document.querySelector(".header") ? 64 : 0;
    gsap.to(_scroller, { scrollTo: { y: el, offsetY: _offsetY }, duration: duration ? duration : 0.6, ease: "power2.out" });
}


function pcSwiperSlide() {
    if (!/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)) {
        gsap.utils.toArray('.com-product-wrap-row').forEach(wrapper => {
            if (!wrapper.classList.contains('is-swiper')) {
                
                let _slideClass = wrapper.querySelector('.com-product-bg-white') ? 'com-product-bg-white' : 'com-product-thumb-1';

                if (wrapper.querySelector('.com-product-thumb-4')) {
                    _slideClass = 'com-product-thumb-4';
                }
        
                if (wrapper.querySelectorAll(`.${_slideClass}`).length > 2) {
                    wrapper.classList.add('is-swiper')
                    const container = wrapper.parentElement;
        
                    const _afterOffset = wrapper.querySelector('.btn-more-arrow-txt') ? 104 : 24;
            
            
                    const swiper = new Swiper(container, {
                        slidesPerView: 'auto',
                        wrapperClass: 'com-product-wrap-row',
                        slideClass: _slideClass,
                        freeMode: true,
                        slidesOffsetAfter: _afterOffset,
                        slidesOffsetBefore: 24,
                        spaceBetween: 10,
                    });
                } else {
                    wrapper.classList.add('swiper-single')
                }

            }
        })

        gsap.utils.toArray('.list-hor-recommend').forEach(list => {
            const wrapper = list.querySelector('.com-product-wrap')

            if (!wrapper.classList.contains('is-swiper')) {
                wrapper.classList.add('is-swiper')
                const _slideClass = 'com-product-thumb-4'
    
                const container = wrapper.parentElement;
        
                const _afterOffset = wrapper.querySelector('.btn-more-arrow-txt') ? 104 : 48;
        
                const swiper = new Swiper(container, {
                    slidesPerView: 'auto',
                    wrapperClass: 'com-product-wrap',
                    slideClass: _slideClass,
                    freeMode: true,
                    slidesOffsetAfter: _afterOffset,
                    spaceBetween: 10,
                });
            }

        })
        pcSwiperTabSlide()
    } 
}

//[탭 스와이퍼] tabs : tab-swipe-header, tab-swipe-btn-med
function pcSwiperTabSlide() {
    if (!/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)) {
        gsap.utils.toArray('.tabs').forEach((wrapper, __index) => {
            if (wrapper.querySelector('.tab-inner')) {
                if (!wrapper.classList.contains('is-swiper')) {
                    const container = wrapper;
                    let _slideClass = 'tab';
                        
                    if (wrapper.querySelector('.btn-size')) {
                        _slideClass = 'btn-size';
                    }

                    if (wrapper.querySelector('.btn-small-regular')) {
                        _slideClass = 'btn-small-regular';
                    }
                    if (wrapper.querySelectorAll(`.${_slideClass}`).length > 2) {
                        wrapper.classList.add('is-swiper')
                    
                        const _tabMargin = parseInt(gsap.getProperty(wrapper, 'gap'))
                        gsap.set(wrapper, { gap: 0 })
    
                        let _slideAfter = 24;
                        
             
                     
                        const swiper = new Swiper(container, {
                            slidesPerView: 'auto',
                            wrapperClass: 'tab-inner',
                            slideClass: _slideClass,
                            freeMode: false,
                            slidesOffsetAfter: _slideAfter,
                            slidesOffsetBefore: 24,
                            spaceBetween: _tabMargin,
                            preventClicks: true,
                            preventClicksPropagation: true,
                            init: false,
                        });


                        if (wrapper.classList.contains('tab-swipe-header') || wrapper.classList.contains('tab-swipe-btn-med')) {
                            const reposition = () => {
                                const _tabs = gsap.utils.toArray(`.tab`, wrapper);                                
                                if (_tabs.length >= 1) {
                                    let _index = _tabs.findIndex((f, i) => f.classList.contains('selected'))
                                    if (_index == -1) {
                                        _index = 0;
                                        _tabs[_index].classList.add('selected')
                                    }
                                    activeSelectedTab(wrapper, _tabs[_index], _index ,true)
                                }
                            }
                            swiper.on('afterInit', () => {
                                reposition()
                            })
                            swiper.on('init', () => {
                                reposition()
                            })
                        }
                        swiper.init()
                    } else {
                        wrapper.classList.add('swiper-single')
                    }

       
                }
            }
        })

        if (document.querySelector('.filter-option-selected')) {
            gsap.utils.toArray('.filter-option-selected').forEach(wrap => {
                gsap.set(wrap, { overflow: 'hidden' })
                const wrapper = wrap.querySelector('.filter-selected-wrap');
                if (!wrapper.classList.contains('is-swiper')) {
                    wrapper.classList.add('is-swiper')
                    const swiper = new Swiper(wrapper, {
                        slidesPerView: 'auto',
                        wrapperClass: 'filter-selected-inner',
                        slideClass: 'btn-small-ico',
                        freeMode: true,
                        slidesOffsetBefore: 0,
                        slidesOffsetAfter: 24,
                        spaceBetween: 4,
                    });
                }
            })
        }
    } 
}
// [탭 스와이퍼] btn-category-wrap (search/DSP-MO-4-PG-001 / category/DSP-MO-4-PG-001)
function pcSwiperCategoryTab() {
    if (!/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)) {
        const wrapper = document.querySelector('.btn-category-wrap')
        if (wrapper && !wrapper.classList.contains('is-swiper')) {
            wrapper.classList.add('is-swiper')
            const swiper = new Swiper(wrapper, {
                slidesPerView: 'auto',
                wrapperClass: 'btn-inner',
                slideClass: 'btn-category',
                freeMode: true,
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 24,
                spaceBetween: 24,
            });
        }
    }
}

// 발견 & 카테고리 투표 영역
// [페이지] DSP-MO-2-PG-001a, DSP-MO-2-PG-001b
// [이벤트] 투표 이벤트 (content-survey button)
function initSurvey() {
    gsap.utils.toArray('.content-survey').forEach(container => {
        if (!container.hasAttribute('data-load')) {
            container.setAttribute('data-load', true)
            const surveys = gsap.utils.toArray('.btn-survey-option' , container);
            if (!surveys) return;
            surveys.forEach((button, i) => {
                button.addEventListener('click', () => {
                    if (container.classList.contains('selected')) return;
                    container.classList.add('selected');
                    button.classList.add('select');
                    surveyLoading(container);
                    surveys.forEach((s, j) => {
                        if (j !== i) {
                            s.classList.add('unselect');
                        }
                    });
                });
            });
        }

    })

}
// [인터랙션] 버튼 클릭 시 로딩 인터랙션
function surveyLoading(container) {
    // ios 이슈로 추가 (box-shadow, filter remove)
    document.body.classList.add('hidden-filter');
    gsap.to(gsap.utils.toArray('.survey-loading', container), { height: 'auto', duration: 0.4, ease: 'power2.out', delay: 0 });
    gsap.set(gsap.utils.toArray('.survey-loading', container), { autoAlpha: 1, delay: 0 });
    gsap.to(gsap.utils.toArray('.survey-loading .tt', container), { autoAlpha: 1, duration: 0.4, ease: 'power1.inOut', delay: 0.28, stagger: 0.05 });
    gsap.from(gsap.utils.toArray('.survey-loading .tt', container), { y: 20, duration: 0.45, ease: 'power2.out', delay: 0.25, stagger: 0.05 });
    gsap.to(gsap.utils.toArray('.survey-loading .loading', container), { autoAlpha: 1, duration: 0.4, ease: 'power1.inOut', delay: 0.75 });

    gsap.delayedCall(0.8, () => {
        container.querySelector('.loading lottie-player').play();
    });

    gsap.delayedCall(3.3, () => {
        container.querySelector('.loading lottie-player').pause();
        surveyComplete(container);
    });
}
// [인터랙션] 버튼 클릭 시 로딩 인터랙션 후 진행
function surveyComplete(container) {
    gsap.to(gsap.utils.toArray('.btn-survey-option .ico', container), { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
    gsap.to(gsap.utils.toArray('.btn-survey-option.unselect', container), {
        backgroundColor: 'rgba(160, 160, 160, 0.1)',
        duration: 0.15,
        ease: 'power2.out',
    });
    gsap.to(gsap.utils.toArray('.btn-survey-option.unselect .survey-fill', container), {
        backgroundColor: 'rgba(160, 160, 160, 0.11)',
        duration: 0.15,
        ease: 'power2.out',
    });
    gsap.to(gsap.utils.toArray('.btn-survey-option.unselect .survey-fill .txt', container), {
        color: '#000',
        duration: 0.15,
        ease: 'power2.out',
    });

    gsap.utils.toArray('.btn-survey-option', container).forEach((b) => {
        const width = b.getAttribute('data-value');
        b.querySelector('.survey-fill').setAttribute('data-value', width);
        gsap.to(b.querySelector('.survey-fill'), { width: `${width}%`, '--width': `${width}%`, duration: 0.5, ease: 'power2.out' });
    });
    gsap.to(gsap.utils.toArray('.btn-survey-option .txt-percentage', container), { opacity: 1, duration: 0.5, ease: 'power1.inOut', delay: 0.35 });
    gsap.to(gsap.utils.toArray('.survey-loading', container), {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.inOut',
        onComplete: () => {
            gsap.set(gsap.utils.toArray('.survey-result', container), { display: 'block' });
            gsap.delayedCall(0.1, () => {
                gsap.to(gsap.utils.toArray('.survey-loading', container), { display: 'none', height: 0, duration: 0.3, ease: 'power1.inOut' });
                gsap.to(gsap.utils.toArray('.survey-result', container), { height: 'auto', duration: 0.3, ease: 'power1.inOut' });
                gsap.to(gsap.utils.toArray('.survey-result', container), {
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power1.inOut',
                    delay: 0.23,
                    onComplete: () => {
                        gsap.delayedCall(0.2, () => {
                            document.body.classList.remove('hidden-filter');
                        });
                    },
                });
            });
        },
    });
}


// 추가상품팝업 - 스크롤 이벤트
function scrollToEvent(content) {
    const scroller = content.closest('.bottomsheet-wrap');
    if (scroller) {
        gsap.to(scroller, { scrollTo: { y: content }, duration: 0.6, ease: 'power2.out'})
    }
}

/** visible === false : 딜레이 이후 사라짐 */
function openNoticeToast(tooltip, visible) {

    if (tooltip) {
        tooltip.classList.add('show');
        gsap.to(tooltip.querySelector('.tooltip'), { opacity: 1, duration: 0.5, ease: 'power1.inOut', delay: 0.01, onComplete: () => {
            if (!visible) {
                gsap.delayedCall(3.5, () => {
                    tooltip.classList.remove('show');
                    gsap.to(tooltip.querySelector('.tooltip'), { opacity: 0, duration: 0.3, ease: 'power1.inOut' })
                })
            }
        } })
    }
        

}