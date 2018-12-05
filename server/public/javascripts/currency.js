const updateSymbol = event => {
  const target = $(event.currentTarget)
  $(".currency-symbol").text(target.attr("data-symbol"));
  $(".currency-amount").prop(
    "placeholder",
    target.attr("data-placeholder")
  );
  $(".currency-code").text(target.attr("data-code"));
  $("#btc-btn").html(target.html());
}

$(".currency-option").on("click", updateSymbol);
