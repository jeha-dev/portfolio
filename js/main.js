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
			fn.lnb();
			fn.scrollHeader();
		},

    // lnb
    lnb : function(){

        //메뉴 버튼을 클릭했을 때
        let $itrOffsetTop = $('#symbolic').offset().top;

        $(".menu_icon").addClass("active");
        $(".btn_close").addClass("active");

        $(".menu_icon").off("click").on("click",function(){
    
          $(".allmenu").hide();
          $(".btn_close").show();
          $(".lnb").addClass("show");

          setTimeout(function(){
            $(".list_menu li").addClass("active");
          },500);
    
          if($(window).scrollTop()==$itrOffsetTop){
            $(".btn_close").addClass("active");
            $(".menu_icon").removeClass("active");
            $(".btn_close").show();
          }else {
            $(".btn_close").removeClass("active");
            $(".btn_close").show();
          }
    
        });
    
        // 닫기 버튼 클릭했을 때
        $(".btn_close").off("click").on("click",function(){
    
          if($(window).scrollTop()==$itrOffsetTop || $(window).scrollTop()==0){
    
            $(".list_menu li").removeClass("active");
            setTimeout(function(){
              $(".lnb").removeClass("show");
            },200);
    
            $(".allmenu").show();
            $(".menu_icon").addClass("active");
          }else {
            $(".list_menu li").removeClass("active");
            setTimeout(function(){
              $(".lnb").removeClass("show");
            },200);
    
            $(".allmenu").show();
          }
        });
    
      // LNB list_menu li를 클릭했을 때
      $(".list_menu li").on("click",function(){
    
        let $index = $(this).index();

        $(".allmenu").show();
        $(".list_menu li").find("a").removeClass("on");
        $(".list_menu li").eq($index).find("a").addClass("on");

        setTimeout(function(){
          $(".lnb").removeClass("show");
        },200);

        $("html,body").stop().animate({
          scrollTop : $(".section_container section").eq($index).offset().top
        },500);
    
        if($(this).index() == 2){
    
          $(".sk90").addClass("show");
          $(".sk80").addClass("show");
          $(".sk70").addClass("show");
    
        }else {
          $(".sk90").removeClass("show");
          $(".sk80").removeClass("show");
          $(".sk70").removeClass("show");
        }
    
      });
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
          
          $(".menu_icon").addClass("active");
          $('.footer').hide();
          $(".list_menu li").find("a").removeClass("on");
          $(".list_menu li").eq(0).find("a").addClass("on");
        }else {
          $logo.show();
          $(".menu_icon").removeClass("active");
        }

        if( $scroll > $workOffsetTop - $windowHt ) {
          $(".main_header").show();
          $logo.show();
          $(".menu_icon").removeClass("active");

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
		popupOpen : function(obj){
			$(obj).addClass("open");
			$("body").addClass("ov-hidden");
		},

		//popupClose
		popupClose : function(obj){
			$(obj).removeClass("open");
			$("body").removeClass("ov-hidden");
		},
	}
})();

$(document).ready(function(){
});


$(window).on("load", function(){
	fn.common();
  $(".menu_icon").addClass("active");
  $(".closeBtn").addClass("active");
});

