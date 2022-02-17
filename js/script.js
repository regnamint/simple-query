$('document').ready(function() {
  var selectColumnNum = 0;
  var deleteConditionNum = 0;

  $('#deleteHaveWhereCondition').on('click', function () {
    if($(this).hasClass('btn-secondary')) {
      $(this).removeClass('btn-secondary');
      $(this).addClass('btn-danger');
      // add where condition for delete
      $('.deleteWhereConditionAddRemove').removeClass('hide');
      $('.deleteWhereConditionAddRemove').addClass('show');
      AddWhereCondition('delete')
    }else{
      $(this).addClass('btn-secondary');
      $(this).removeClass('btn-danger');
      // remove where condition for delete
      $('.deleteWhereConditionAddRemove').addClass('hide');
      $('.deleteWhereConditionAddRemove').removeClass('show');
      clearWhereCondition('delete')
    }
  });

  $('#deleteWhereConditionAddBtn').on('click', function () {
    AddWhereCondition('delete')
  });

  $('#deleteWhereConditionRemoveBtn').on('click', function () {
    if (deleteConditionNum <= 1) {
      $('#deleteHaveWhereCondition').addClass('btn-secondary');
      $('#deleteHaveWhereCondition').removeClass('btn-danger');
      // remove where condition for delete
      $('.deleteWhereConditionAddRemove').addClass('hide');
      $('.deleteWhereConditionAddRemove').removeClass('show');
      clearWhereCondition('delete')
    } else {
      removeWhereCondition('delete')
    }
  });

  $("#generateDeleteQuery").on("click", function () {
    var deleteFromTable = $('[name="deleteFrom"]').val();
    if (deleteFromTable == "") {
      $("#deleteModal .errormsg").css("display", "block");
      $(".deleteQuery").html("");
    } else {
      $("#deleteModal .errormsg").css("display", "none");
      var deleteWhereCondition = "";
      var deleteWhereConditionContent = "";
      //deleteConditionAndOr deleteConditionOperator1
      for (var i = 1; i <= deleteConditionNum; i++) {
        var tempkey = $('#deleteConditionKey'+i).val();
        var tempoperator = $('#deleteConditionOperator'+i).val();
        var tempvalue = $('#deleteConditionValue'+i).val();
        deleteWhereConditionContent = tempkey!=""&&tempoperator!=""&&tempvalue!=""?tempkey+" "+getOperator(tempoperator)+" "+tempvalue:""
        var tempcondition = "";
        if (i != 1) {
          tempcondition = $('[name="deleteConditionAndOr'+i+'"]:checked').val();
          if (deleteWhereCondition != "" && deleteWhereConditionContent != "") {
            deleteWhereCondition += " " + tempcondition + " " + deleteWhereConditionContent
          } else {
            deleteWhereCondition += deleteWhereConditionContent
          }
        } else {
          deleteWhereCondition += deleteWhereConditionContent
        }
      }
      deleteWhereCondition = deleteWhereCondition!=""?" WHERE " + deleteWhereCondition:"";
      $(".deleteQuery").html("DELETE FROM " + deleteFromTable + deleteWhereCondition);
    }
  });

  function getOperator(operator) {
    switch (operator){
      case 'greaterthan': 
        return '>'
        break;
      case 'lessthan':
        return '<'
        break;
      case 'greaterthanorequalto':
        return '>='
        break;
      case 'lessthanorequalto':
        return '<='
        break;
      case 'notequal':
        return '<>'
        break;
      case 'between':
        return 'BETWEEN'
        break;
      case 'like':
        return 'LIKE'
        break;
      case 'in':
        return 'IN'
        break;
      default:
        return '='
    }
  }

  function clearWhereCondition(querytype) {
    if(querytype=='delete') {
      deleteConditionNum = 0;
    }
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).children().remove();
  }

  function removeWhereCondition(querytype) {
    if(querytype=='delete') {
      deleteConditionNum-=1;
    }
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).children().last().remove();
  }

  function AddWhereCondition(querytype) {
    if(querytype=='delete') {
      deleteConditionNum++;
      num = deleteConditionNum;
    }
    var AndOr = '<div class="col-12" style="margin-bottom: 15px;">\
                 <div class="form-check form-check-inline">\
                 <input class="form-check-input" type="radio" name="'+querytype+'ConditionAndOr'+num+'" id="'+querytype+'ConditionAnd'+num+'" value="AND" checked>\
                 <label class="form-check-label" for="'+querytype+'ConditionAnd'+num+'">AND</label>\
                 </div>\
                 <div class="form-check form-check-inline">\
                 <input class="form-check-input" type="radio" name="'+querytype+'ConditionAndOr'+num+'" id="'+querytype+'ConditionOr'+num+'" value="OR">\
                 <label class="form-check-label" for="'+querytype+'ConditionOr'+num+'">OR</label>\
                 </div>\
                 </div>';
    var ConditionKey = '<div class="col-4 col-lg-3">\
                        <label for="'+querytype+'ConditionKey'+num+'" class="visually-hidden">Key'+num+'</label>\
                        <input type="text" class="form-control" id="'+querytype+'ConditionKey'+num+'" placeholder="Key '+num+'">\
                        </div>';
    var Operator = '<div class="col-4 col-lg-6">\
                    <select id="'+querytype+'ConditionOperator'+num+'" class="form-select" aria-label="Default select example">\
                    <option selected>Open this select menu</option>\
                    <option value="equal">=</option>\
                    <option value="greaterthan">&gt;</option>\
                    <option value="lessthan">&lt;</option>\
                    <option value="greaterthanorequalto">&gt;=</option>\
                    <option value="lessthanorequalto">&lt;=</option>\
                    <option value="notequal">&lt;&gt;</option>\
                    <option value="between">BETWEEN</option>\
                    <option value="like">LIKE</option>\
                    <option value="in">IN</option>\
                    </select>\
                    </div>';
    var ConditionValue = '<div class="col-4 col-lg-3">\
                          <label for="'+querytype+'ConditionValue'+num+'" class="visually-hidden">Key'+num+'</label>\
                          <input type="text" class="form-control" id="'+querytype+'ConditionValue'+num+'" placeholder="Value '+num+'">\
                          </div>';
    var NewCondition = '<div class="row">' + ConditionKey + Operator + ConditionValue + '</div>';
    if(num!=1) {
      NewCondition = AndOr + NewCondition
    }
    NewCondition = '<div class="row">' + NewCondition + '</div>';
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).append(NewCondition);
  }

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