/**
* --------------------------------
* main JS
* --------------------------------
*/
let fn = (function() {
	"use strict";

	return {
		//공통
		common : function(){
			fn.scrollAnimation();
      fn.popupOpen();
      fn.popupClose();
		},

    // scroll animation
    scrollAnimation : function(){

      secbgAniEvent();
      aniEvent();

      $(document).scroll(function(){
        let scrTop = $(window).scrollTop();
        let headerHt = $(".header_container").height();
        let col2 = $(".details .details-module");
        let btnHome = $(".btn.home");
        let clientHt = $(document).innerHeight();
        let winHt = $(window).height();
        let somewhere = clientHt - winHt;
        // console.log(scrTop);

        if( scrTop > headerHt){
          secbgAniEvent();
          aniEvent();
          btnHome.addClass("active");
        }

        if(scrTop == 0 || scrTop == somewhere){
          btnHome.removeClass("active");
        }


        let deIntroHt = $('.details-intro').height();
        if(scrTop > col2.offset().top -100 && scrTop < deIntroHt){
          $(".details-module-mobile").addClass("fixed");
          console.log("응");
        }else if(scrTop < col2.offset().top || scrTop > deIntroHt - 500){
          $(".details-module-mobile").removeClass("fixed");
        }

      });

      function secbgAniEvent(){
        $(".content").each(function(){
          let scrTop = $(window).scrollTop();
          let secOffTop = $(this).offset().top;

          if(scrTop >= secOffTop - 280){
            $(this).find(".section-bg").addClass("active");
          }else if(scrTop < secOffTop + 650){
            $(this).find(".section-bg").removeClass("active");
          }

          if(scrTop > secOffTop + 600){
            $(this).find(".section-bg").removeClass("active");
          }
        });
      }
      function aniEvent(){
        $(".box-ani").each(function(){
          let winHt = $(window).height();
          let winTop =  $(window).scrollTop() + winHt;
          let elOffTop = $(this).offset().top;

          if(winTop > elOffTop + 300){
            $(this).addClass("aniload");
          }
        });
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

