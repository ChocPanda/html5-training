function toggleOrderType() {
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
}

const Action = {
  BUY: 1,
  SELL: 2
};

$("#order-form").submit(() => {
  $("#order-form").append('<input type="hidden" name="account" value="1"/>')

  if ($("#order-btn").hasClass("buy-btn")) {
    console.debug("Sending a BUY order");
    $("#order-form").append(`<input type="hidden" name="action" value="${Action.BUY}"/>`)
  } else if ($("#order-btn").hasClass("sell-btn")) {
    console.debug("Sending a SELL order");
    $("#order-form").append(`<input type="hidden" name="action" value="${Action.SELL}"/>`)
  } else {
    console.error(
      "Well this is just unexpected to be honest... but I don't know what to do"
    );
  }

  return true;
});

$("#buy-sell-btns button").on("click", toggleOrderType);

$("#order-btn").addClass("buy-btn");
$("#buy-form-btn").addClass("active");
