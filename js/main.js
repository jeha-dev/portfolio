/**
* --------------------------------
* main JS
* --------------------------------
*/
var fn = (function() {
	"use strict";

	return {
		//공통
		common : function(){
			fn.scrollAnimation();
      fn.popupOpen();
      fn.popupClose();
		},

    // scroll animation common
    scrollAnimation : function(){

      aniEvent();
      $(document).scroll(function(){
        var scrTop = $(window).scrollTop();
        var headerHt = $(".header_container").height();

        if( scrTop > headerHt){
          aniEvent();
        }
      });
      function aniEvent(){
        $(".box-ani").each(function(){
          var winTop = $(window).scrollTop() + $(window).height();
          var elOffTop = $(this).offset().top;

          if(winTop > elOffTop + 200){
            $(this).addClass("aniload");
          }
        });

      }

      // refresh : animation이 적용된 요소들를 초기화 하겠습니다.
      removeAniEvent();
      function removeAniEvent(){
        $(".box-ani").removeClass("aniload");
      }

    },

		//popupOpen
		popupOpen : function(){
      $(document).on("click", ".work_container .thumb-box", function(){
        $(this).closest(".thumb-wrap").siblings(".poplayer").addClass("open");
      });
		},

		//popupClose
		popupClose : function(){
      $(".work_container .poplayer .btn_popclose").on("click", function(){
        $(this).parent().removeClass("open");
        // console.log($(this).parent());
      });
		},
	}
})();


// $(document).ready(function(){
// });

$(window).on("load", function(){
	fn.common();
  // $(".menu_icon").addClass("active");
  // $(".closeBtn").addClass("active");
});

