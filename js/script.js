$('document').ready(function() {
  var selectColumnNum = 0;

  $("#generateSelectQuery").on("click", function () {
    var selectTable = $('[name="selectFrom"]').val();
    if (selectTable == "") {
      $(".errormsg").css("display", "block");
      $(".selectQuery").html("");
    } else {
      $(".errormsg").css("display", "none");
      var selectColumn = $("#selectColumn").val();
      var selectColumnText = selectColumn == "all" ? "*" : "";
      var temp = "";
      for (var i = 1; i <= selectColumnNum; i++) {
        temp = $("#selectColumn" + i).val();
        selectColumnText += i == 1 || temp == "" ? temp : ", " + temp;
      }
      $(".selectQuery").html(
        "SELECT " + selectColumnText + " FROM " + selectTable
      );
    }
  });

  $("#selectColumn").on("change", function () {
    if ($("#selectColumn").val() == "specific") {
      addColumn();
      $(".selectcolumnblock").css("display", "block");
    } else {
      clearColumn();
      $(".selectcolumnblock").css("display", "none");
    }
  });

  $("#addcolumnbutton").on("click", addColumn);

  $("#removecolumnbutton").on("click", removeColumn);

  function clearColumn() {
    selectColumnNum = 0;
    $(".selectColumn").children().remove();
  }

  function addColumn() {
    selectColumnNum += 1;
    $(".selectColumn").append(
      '<div class="col-3"><label for="selectColumn' +
        selectColumnNum +
        '" class="visually-hidden">Column' +
        selectColumnNum +
        '</label><input type="text" class="form-control" id="selectColumn' +
        selectColumnNum +
        '" placeholder="Column' +
        selectColumnNum +
        '"></div>'
    );
  }

  function removeColumn() {
    selectColumnNum -= 1;
    if (selectColumnNum <= 0) {
      $("#selectColumn").val("all").change();
    } else {
      $(".selectColumn").children().last().remove();
    }
  }

})