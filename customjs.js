$(document).ready(function(){
     var HHeight = $(".fHeader1").outerHeight();

  $('body').css('padding-top', HHeight);
  $(window).scroll(function () {

    if ($(this).scrollTop() > 3) {

      $('.fHeader1').addClass('active');


    } else {

      $('.fHeader1').removeClass('active');

    }

  });
    
   $(".social_sec_ftr, .ftr_menu").wrapAll("<div class='both_set_copy'><div class='row'></div></div>");
    

  //  $(".navbar-toggler").click(function(){
  //       $(".menu-horizontal").slideToggle();
  //   });


    $(".menu-horizontal nav > ul > li > ul").addClass("sub");

    $(".menu-horizontal nav > ul > li > ul > li > ul").addClass("sub-mane");

    $(" header  nav ").addClass("navbar navbar-expand-lg ");

    // $(" header nav ").wrapInner("<div class='collapse navbar-collapse' id='navbarSupportedContent'>");


});





$(document).ready(function(){
    var nav_up = $('#nav-up');

    $(window).scroll(function() {
      if ($(window).scrollTop() > 300) {
        nav_up.css('display',"block");
      } else {
        nav_up.css('display',"none");
      }
    });

    nav_up.on('click', function(e) {
      //e.preventDefault();
      //$('html, body').animate({scrollTop:0}, '300');
      var body = $("html, body");
    body.animate({scrollTop:0}, 500, 'swing', function() { 
       //alert("Finished animating");
    });
    });

});




$(document).ready(function(){


$(".fModuleTitle ").addClass("wow zoomIn   animated");

$(".container-function").wrapInner("<div class='container'></div>");

$("ul.fGalleryImages .fGalleryItem").wrapInner("<div class='ItemfinnerGallery '></div>");

$(".fRegion.region-footer").wrapInner("<div class='row'></div>");

$(".fRegion.region-header").wrapInner("<div class='row  w-100'></div>");

$(".fRegion.region-headertop").wrapInner("<div class='row w-100'></div>");

$(".contact-left-Image , .fconvincedyet-Text").wrapAll("<div class='fcontactsistingyet'><div class='container'><div class='row'></div></div></div>");

$(".f-about-products , .f-product-gallery-image").wrapAll("<div class='fproductpagecontain'><div class='container'><div class='row'></div></div></div>");

});



$(document).ready(function(){

  $(".single_itemone").owlCarousel({

   autoPlay: 3000, //Set AutoPlay to 3 seconds
   items : 1,
   pagination:false,
   smartSpeed: 800,
   autoplayTimeout:1000 ,
   navigation : false,
   navigationText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
   loop  : true,
   itemsDesktop: [1199, 1],
   itemsDesktopSmall: [979, 1],
   itemsTablet: [700, 1],
   itemsMobile: [480, 1]

 });



});

$(document).ready(function(){

  $(".single_itemthree").owlCarousel({

   autoPlay: 4000, //Set AutoPlay to 4 seconds
   items : 3,
   pagination:false,
   smartSpeed: 800,
   autoplayTimeout:1000 ,
   navigation : true,
   navigationText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
   loop  : true,
   itemsDesktop: [1199, 2],
   itemsDesktopSmall: [1000, 2],
   itemsTablet: [767, 1],
   itemsMobile: [480, 1]

 });



});