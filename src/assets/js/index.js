require('bootstrap');
require('slick-carousel');
require('magnific-popup');

window.addEventListener("DOMContentLoaded", function () {
      function setCursorPosition(pos, elem) {
        elem.focus();
        if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
        else if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.collapse(true);
          range.moveEnd("character", pos);
          range.moveStart("character", pos);
          range.select()
        }
      }

  function template(event) {
    var matrix = "+7 (___) - ___ - __ - __",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    if (def.length >= val.length) val = def;
    this.value = matrix.replace(/./g, function (a) {
      return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    });
    if (event.type == "blur") {
      if (this.value.length == 2) this.value = ""
    } else setCursorPosition(this.value.length, this)
  }

  var phoneForm = document.querySelector(".feedback__tel");

  if (phoneForm) {
    phoneForm.addEventListener("input", template, false);
    phoneForm.addEventListener("focus", template, false);
    phoneForm.addEventListener("blur", template, false);
  }
  });

  $(".slider").slick({
    slidesToShow: 1,
    infinite: true,
    autoplay: false,
    touchThreshold: 100,
    dots: true,
    dotsClass: "slider__dots",
    prevArrow: $(".slick-prev"),
    nextArrow: $(".slick-next")
  });