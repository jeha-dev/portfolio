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
			fn.scrollHeader();
      fn.popupOpen();
      fn.popupClose();
		},

    //스크롤 시 헤더
    scrollHeader : function(){
      //메뉴 버튼을 클릭했을 때
      let $itrOffsetTop = $('#symbolic').offset().top;
      let $workOffsetTop = $('#listWork').offset().top;
      let $profileOffsetTop = $('#profile').offset().top;
      let $logo = $('.logo');

      $(window).on("scroll",function(){

        let $scroll = $(window).scrollTop();
        // let $windowHeight2 = $(window).height();
        let $windowHt = ($(window).height())*0.4;
        // console.log($windowHt);
      
        if( $scroll > $itrOffsetTop - $windowHt ) {
          $(".main_header").hide();
          $logo.hide();
          
          // $(".menu_icon").addClass("active");
          $('.footer').hide();
          $(".list_menu li").find("a").removeClass("on");
          $(".list_menu li").eq(0).find("a").addClass("on");
        }else {
          $logo.show();
          // $(".menu_icon").removeClass("active");
        }

        if( $scroll > $workOffsetTop - $windowHt ) {
          $(".main_header").show();
          $logo.show();
          // $(".menu_icon").removeClass("active");

          $(".list_menu li").find("a").removeClass("on");
          $(".list_menu li").eq(1).find("a").addClass("on");
        }

        if( $scroll >= $profileOffsetTop - $windowHt ) {

          $(".list_menu li").find("a").removeClass("on");
          $(".list_menu li").eq(2).find("a").addClass("on");

          $('.footer').show();

          $(".sk90").addClass("show");
          $(".sk80").addClass("show");
          $(".sk70").addClass("show");
        }
      });
    },

		//popupOpen
		popupOpen : function(){
      $(document).on("click", ".work_container .thumb_box", function(){
        $(this).closest(".thumb_wrap").siblings(".poplayer").addClass("open");
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

$(document).ready(function(){
});


$(window).on("load", function(){
	fn.common();
  // $(".menu_icon").addClass("active");
  $(".closeBtn").addClass("active");
});

