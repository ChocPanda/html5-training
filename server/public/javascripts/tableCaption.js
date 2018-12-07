const updateTableCaption = tableId => {
  if ($(`#${tableId} tr`).has($("td")).length) {
    $(`#${tableId} caption`).remove();
  } else {
    $('<caption class="text-center">No orders to show.</caption>').appendTo(
      `#${tableId}`
    );
  }
};

$(".table").each((_, table) => {
  console.log(table)
});