$("#buy-sell-btns button").on("click", function() {
  $(this)
    .siblings()
    .removeClass("active");
  $(this).addClass("active");
  $("#order-btn").addClass(`${this.getAttribute("data-order-type")}-btn`);

  $(this)
    .siblings()
    .each(function() {
      $("#order-btn").removeClass(
        `${this.getAttribute("data-order-type")}-btn`
      );
    });
  $("#order-btn .order-type").text(`${this.getAttribute("data-order-type")}`);
});

$("#buy-form-btn").addClass("active");
$("#order-btn").addClass("buy-btn");
