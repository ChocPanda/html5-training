
      $(".navbar-nav.multi-select li").on("click", function() {
        $(this)
          .siblings()
          .removeClass("active");
        $(this).addClass("active");
      });