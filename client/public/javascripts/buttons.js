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

function placeOrder() {
  const formData = new FormData($("#order-form"));
  formData.append("accountId", "1");

  if ($("#order-btn").hasClass("buy-btn")) {
    console.debug("Sending a BUY order");
    formData.append("action", Action.BUY);
  } else if ($("#order-btn").hasClass("sell-btn")) {
    console.debug("Sending a SELL order");
    formData.append("action", Action.SELL);
  } else {
    console.error(
      "Well this is just unexpected to be honest... but I don't know what to do"
    );
  }

  var request = new XMLHttpRequest();
  request.open("POST", "order");
  request.send(formData);

  // $.post("order", formData.serialize());
}

$("#order-btn").on("click", placeOrder);
$("#buy-sell-btns button").on("click", toggleOrderType);

$("#order-btn").addClass("buy-btn");
$("#buy-form-btn").addClass("active");
