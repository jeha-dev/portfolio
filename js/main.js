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
      fn.hideOtherList();
			fn.scrollAnimation();
      fn.popupOpen();
      fn.popupClose();
		},

    // other list 페이지별로 제어
    hideOtherList : function(){
      let sectionWrapID = $(".section-wrap").attr("id");
      $(".other-project-link").find(".list-other li").each(function(){
        if($(this).find("a").attr("id") == sectionWrapID){
          $(this).closest("li").css("display","none");
        }else {
          $(this).closest("li").css("display","block");
        }
      });
    },

    // scroll animation
    scrollAnimation : function(){

      secbgAniEvent();
      aniEvent();

      $(document).scroll(function(){
        let scrTop = $(window).scrollTop();
        let headerHt = $(".header_container").height();
        let btnHome = $(".btn.home");
        let clientHt = $(document).innerHeight();
        let winHt = $(window).height();
        let scrBottom = clientHt - winHt;
        
        // scroll event common
        if( scrTop > headerHt){
          secbgAniEvent();
          aniEvent();
          btnHome.addClass("active");
        }

        // btnHome remove
        if(scrTop == 0 || scrTop == scrBottom){
          btnHome.removeClass("active");
        }
        
        // details-intro 
        let deIntroHt = $('.details-intro').height();
        if(scrTop < (deIntroHt / 3)*2){
          $(".details-desc").removeClass("absolute");
          $(".details-desc").addClass("fixed");
        }else {
          $(".details-desc").addClass("absolute");
        }
        if(scrTop < deIntroHt){
          $(".details-desc").addClass("fixed");
        }
        if(scrTop == 0){
          $(".details-desc").removeClass("fixed");
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
});

