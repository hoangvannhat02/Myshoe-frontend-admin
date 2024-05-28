document.addEventListener("click", function (event) {
  var showSetting = document.querySelectorAll(".showmodel");
  
  showSetting.forEach(function (element) {
    if (event.target.id === element.getAttribute("data-target").substring(1)) {
      // If the clicked element has the correct ID, set display to block for the current element
      element.style.display = "block";
    }
  });
});

$(document).ready(function () {
  // $(".box-user").click(function () {
  //   $(".info-user").toggleClass("hidden");
  // });

  $(".iconclose").click(function () {
    $(".showmodel").hide();
  });

  // $(".navbar_content").click(function(){
  //   $(".nav-menu").toggle();
  // })

  // $(".box-manage-menu").click(function (e) {
  //   e.preventDefault();
  //   var menuList = $(this).next(".menu-item__list");
  //   menuList.toggleClass('show');
  // });
});
