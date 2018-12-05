const updateSymbol = caller => {
  $(".currency-symbol").text($(caller).getAttribute("data-symbol"));
  $(".currency-amount").prop(
    "placeholder",
    this.getAttribute("data-placeholder")
  );
  $(".currency-code").text(this.getAttribute("data-code"));
  $("#btc-btn").html(this.innerHTML);
}

$(".currency-option").on("click", updateSymbol);
