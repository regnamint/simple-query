$('document').ready(function() {
  var selectColumnNum = 0;
  var updateColumnNum = 1;
  var selectConditionNum = 0;
  var updateConditionNum = 0;
  var deleteConditionNum = 0;

  $("#generateSelectQuery").on("click", function () {
    var selectTable = $('[name="selectFrom"]').val();
    var selectColumn = $('[name="selectColumn"').val();
    selectColumn = selectColumn==""?"*":selectColumn;

    var selectJoin = $('[name="selectJoin"').val();
    var selectGroupBy = $('[name="selectGroupBy"').val();
    selectGroupBy = selectGroupBy==""?"":" GROUP BY "+selectGroupBy;
    var selectHaving = $('[name="selectHaving"').val();
    selectHaving = selectHaving==""?"":" HAVING "+selectHaving;
    var selectOrderBy = $('[name="selectOrderBy"').val();
    selectOrderBy = selectOrderBy==""?"":" ORDER BY "+selectOrderBy;

    if (selectTable == "") {
      show("#selectModal .errormsg");
      $(".selectQuery").html("");
    } else {
      hide("#selectModal .errormsg")

      var selectWhereCondition = generateWhereCondition('select');
      $(".selectQuery").html(
        "SELECT " + selectColumn + " FROM " + selectTable + " " +selectJoin + selectWhereCondition + selectGroupBy + selectHaving + selectOrderBy
      );
    }
  });

  $("#generateInsertQuery").on("click", function () {
    var insertTable = $('[name="insertTo"]').val();
    var insertToColumns = $('[name="insertToColumns"').val();
    insertToColumns = insertToColumns==""?"":" ("+insertToColumns+")";
    var insertValues = $('[name="insertSet"').val();
    insertValues = insertValues==""?"":" ("+insertValues+") ";

    if (insertTable == "") {
      show("#insertModal .errormsg");
      $(".insertQuery").html("");
    } else {
      hide("#insertModal .errormsg")

      if (insertValues == "") {
        show("#insertModal .errormsg-set");
      } else {
        hide("#insertModal .errormsg-set");

        $(".insertQuery").html(
          "INSERT INTO " + insertTable + insertToColumns + " VALUES" + insertValues
        );
      }
    }
  });

  $("#generateUpdateQuery").on("click", function () {
    var updateTable = $('[name="updateFrom"]').val();

    if (updateTable == "") {
      show("#updateModal .errormsg");
      $(".updateQuery").html("");
    } else {
      hide("#updateModal .errormsg");

      var updateSet = generateColumn('update');
      if (updateSet=="") {
        show("#updateModal .errormsg-set");
        $(".updateQuery").html("");
      } else {
        hide("#updateModal .errormsg-set");

        var updateWhereCondition = generateWhereCondition('update');
        $(".updateQuery").html("UPDATE " + updateTable + updateSet + updateWhereCondition);
      }
    }
  });

  $("#generateDeleteQuery").on("click", function () {
    var deleteFromTable = $('[name="deleteFrom"]').val();

    if (deleteFromTable == "") {
      show("#deleteModal .errormsg");
      $(".deleteQuery").html("");
    } else {
      hide("#deleteModal .errormsg");

      var deleteWhereCondition = generateWhereCondition('delete');
      $(".deleteQuery").html("DELETE FROM " + deleteFromTable + deleteWhereCondition);
    }
  });

  $('#selectHaveWhereCondition').on('click', function () {
    if($(this).hasClass('btn-secondary')) {
      $(this).removeClass('btn-secondary');
      $(this).addClass('btn-primary');
      // add where condition for select
      show('.selectWhereConditionAddRemove');
      AddWhereCondition('select')
    }else{
      $(this).addClass('btn-secondary');
      $(this).removeClass('btn-warning');
      // remove where condition for select
      hide('.selectWhereConditionAddRemove');
      clearWhereCondition('select')
    }
  });

  $('#updateHaveWhereCondition').on('click', function () {
    if($(this).hasClass('btn-secondary')) {
      $(this).removeClass('btn-secondary');
      $(this).addClass('btn-warning');
      // add where condition for update
      show('.updateWhereConditionAddRemove');
      AddWhereCondition('update')
    }else{
      $(this).addClass('btn-secondary');
      $(this).removeClass('btn-warning');
      // remove where condition for update
      hide('.updateWhereConditionAddRemove');
      clearWhereCondition('update')
    }
  });

  $('#deleteHaveWhereCondition').on('click', function () {
    if($(this).hasClass('btn-secondary')) {
      $(this).removeClass('btn-secondary');
      $(this).addClass('btn-danger');
      // add where condition for delete
      show('.deleteWhereConditionAddRemove');
      AddWhereCondition('delete')
    }else{
      $(this).addClass('btn-secondary');
      $(this).removeClass('btn-danger');
      // remove where condition for delete
      hide('.deleteWhereConditionAddRemove');
      clearWhereCondition('delete')
    }
  });

  $('#selectWhereConditionAddBtn').on('click', function () {
    AddWhereCondition('select')
  });

  $('#updateSetAddBtn').on('click', function () {
    AddColumn('update')
  });

  $('#updateWhereConditionAddBtn').on('click', function () {
    AddWhereCondition('update')
  });

  $('#deleteWhereConditionAddBtn').on('click', function () {
    AddWhereCondition('delete')
  });

  $('#selectWhereConditionRemoveBtn').on('click', function () {
    if (selectConditionNum <= 1) {
      $('#selectHaveWhereCondition').addClass('btn-secondary');
      $('#selectHaveWhereCondition').removeClass('btn-primary');
      // remove where condition for delete
      hide('.selectWhereConditionAddRemove');
      clearWhereCondition('select')
    } else {
      removeWhereCondition('select')
    }
  });

  $('#updateSetRemoveBtn').on('click', function () {
    if (updateColumnNum <= 1) {
      clearColumn('update');
    } else {
      removeColumn('update');
    }
  });

  $('#updateWhereConditionRemoveBtn').on('click', function () {
    if (updateConditionNum <= 1) {
      $('#updateHaveWhereCondition').addClass('btn-secondary');
      $('#updateHaveWhereCondition').removeClass('btn-warning');
      // remove where condition for delete
      hide('.updateWhereConditionAddRemove');
      clearWhereCondition('update')
    } else {
      removeWhereCondition('update')
    }
  });

  $('#deleteWhereConditionRemoveBtn').on('click', function () {
    if (deleteConditionNum <= 1) {
      $('#deleteHaveWhereCondition').addClass('btn-secondary');
      $('#deleteHaveWhereCondition').removeClass('btn-danger');
      // remove where condition for delete
      hide('.deleteWhereConditionAddRemove');
      clearWhereCondition('delete')
    } else {
      removeWhereCondition('delete')
    }
  });

  function show(element) {
    $(element).removeClass('hide');
    $(element).addClass('show');
  }

  function hide(element) {
    $(element).removeClass('show');
    $(element).addClass('hide');
  }

  function generateColumn(querytype) {
    var num = 0;
    if (querytype=='update') {
      num = updateColumnNum;
    } else {
      num = selectColumnNum;
    }
    var column = "";
    var columnContent = "";

    for (var i = 1; i <= num; i++) {
      var tempkey = $('#'+querytype+'ColumnKey'+i).val();
      var tempoperator = '=';
      var tempvalue = $('#'+querytype+'ColumnValue'+i).val();
      var tempdatatype = $('#'+querytype+'ColumnDataType'+i).val();
      columnContent = tempkey!=""&&tempvalue!=""?tempkey+" = "+dataTypeFormat(tempdatatype, tempvalue, tempoperator):"";
      if (column != "" && columnContent != "") {
        column += ", " + columnContent
      } else {
        column += columnContent
      }
    }
    column = column!=""?" SET " + column:"";

    return column;
  }

  function generateWhereCondition(querytype) {
    var num;
    if (querytype=='delete') {
      num = deleteConditionNum;
    } else if (querytype=='update') {
      num = updateConditionNum;
    } else {
      num = selectConditionNum;
    }
    console.log(num)
    
    var whereCondition = "";
    var whereConditionContent = "";
    for (var i = 1; i <= num; i++) {
      var tempkey = $('#'+querytype+'ConditionKey'+i).val();
      var tempoperator = $('#'+querytype+'ConditionOperator'+i).val();
      var tempvalue = $('#'+querytype+'ConditionValue'+i).val();
      var tempdatatype = $('#'+querytype+'ConditionDataType'+i).val();
      console.log(tempkey)
      console.log(tempoperator)
      console.log(tempvalue)
      console.log(tempdatatype)
      whereConditionContent = tempkey!=""&&tempoperator!=""&&tempvalue!=""?tempkey+" "+getOperator(tempoperator)+" "+dataTypeFormat(tempdatatype, tempvalue, tempoperator):"";
      
      console.log(whereConditionContent)
      var tempcondition = "";
      if (i != 1) {
        tempcondition = $('[name="'+querytype+'ConditionAndOr'+i+'"]:checked').val();
        if (whereCondition != "" && whereConditionContent != "") {
          whereCondition += " " + tempcondition + " " + whereConditionContent
        } else {
          console.log(whereCondition)
          console.log(whereConditionContent)
          whereCondition += whereConditionContent
        }
      } else {
        console.log(whereCondition)
        console.log(whereConditionContent)
        whereCondition += whereConditionContent
      }
    }
    console.log(whereCondition)
    whereCondition = whereCondition!=""?" WHERE " + whereCondition:"";

    console.log(whereCondition)
    return whereCondition;
  }

  function dataTypeFormat(datatype, value, operator) {
    value = value.replace(/[^a-zA-Z0-9-/, ]/g, "")
    var formattedvalue = "";
    if (operator=='between' || operator=='in') {
      var valuelist = value.split(',');
      for (var i=0;i<valuelist.length;i++) {
        formattedvalue += i!=0?',':'';
        formattedvalue += datatype=='string'?'\''+valuelist[i]+'\'':valuelist[i];
      }
      formattedvalue = '('+formattedvalue+')'
    } else if (operator=='like') {
      formattedvalue = '\'%'+value+'%\'';
    } else {
      formattedvalue = datatype=='string'?'\''+value+'\'':value;
    }
    return formattedvalue;
  }

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
    if (querytype=='delete') {
      deleteConditionNum = 0;
    } else if (querytype=='update') {
      updateConditionNum = 0;
    } else {
      selectConditionNum = 0;
    }
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).children().remove();
  }

  function removeWhereCondition(querytype) {
    if (querytype=='delete') {
      deleteConditionNum-=1;
    } else if (querytype=='update') {
      updateConditionNum-=1;
    } else {
      selectConditionNum-=1;
    }
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).children().last().remove();
  }

  function AddWhereCondition(querytype) {
    var num;
    if (querytype=='delete') {
      deleteConditionNum++;
      num = deleteConditionNum;
    } else if (querytype=='update') {
      updateConditionNum++;
      num = updateConditionNum;
    } else {
      selectConditionNum++;
      num = selectConditionNum;
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
    var ConditionKey = '<div class="col-3 col-lg-3">\
                        <label for="'+querytype+'ConditionKey'+num+'" class="visually-hidden">Key'+num+'</label>\
                        <input type="text" class="form-control" id="'+querytype+'ConditionKey'+num+'" placeholder="Key '+num+'">\
                        </div>';
    var Operator = '<div class="col-3 col-lg-3">\
                    <select id="'+querytype+'ConditionOperator'+num+'" class="form-select" aria-label="Default select example">\
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
    var DataTypes = '<div class="col-3 col-lg-3">\
                    <select id="'+querytype+'ConditionDataType'+num+'" class="form-select" aria-label="Default select example">\
                    <option value="string">String</option>\
                    <option value="number">Number</option>\
                    </select>\
                    </div>';
    var ConditionValue = '<div class="col-3 col-lg-3">\
                          <label for="'+querytype+'ConditionValue'+num+'" class="visually-hidden">Key'+num+'</label>\
                          <input type="text" class="form-control" id="'+querytype+'ConditionValue'+num+'" placeholder="Value '+num+'">\
                          </div>';
    var NewCondition = '<div class="row">' + ConditionKey + Operator + DataTypes + ConditionValue + '</div>';
    if(num!=1) {
      NewCondition = AndOr + NewCondition
    }
    NewCondition = '<div class="row">' + NewCondition + '</div>';
    var classname = '.'+querytype+'WhereConditionBlock';
    $(classname).append(NewCondition);
  }

  function clearColumn(querytype) {
    var classname = '.'+querytype+'ColumnBlock';
    $(classname).children().remove();
    if (querytype=='update') {
      updateColumnNum = 0;
      AddColumn('update');
    } else {
      selectColumnNum = 0;
    }
  }

  function removeColumn(querytype) {
    if (querytype=='update') {
      updateColumnNum-=1;
    } else {
      selectColumnNum-=1;
    }
    var classname = '.'+querytype+'ColumnBlock';
    $(classname).children().last().remove();
  }

  function AddColumn(querytype) {
    var num;
    if (querytype=='update') {
      updateColumnNum++;
      num = updateColumnNum;
    } else {
      selectColumnNum++;
      num = selectColumnNum;
    }
    var ColumnKey = '<div class="col-3 col-lg-3">\
                     <label for="'+querytype+'ColumnKey'+num+'" class="visually-hidden">Key'+num+'</label>\
                     <input type="text" class="form-control" id="'+querytype+'ColumnKey'+num+'" placeholder="Key '+num+'">\
                     </div>';
    var Operator = '<div class="col-3 col-lg-3">\
                    =\
                    </div>';
    var DataTypes = '<div class="col-3 col-lg-3">\
                    <select id="'+querytype+'ColumnDataType'+num+'" class="form-select" aria-label="Default select example">\
                    <option value="string">String</option>\
                    <option value="number">Number</option>\
                    </select>\
                    </div>';
    var ColumnValue = '<div class="col-3 col-lg-3">\
                       <label for="'+querytype+'ColumnValue'+num+'" class="visually-hidden">Key'+num+'</label>\
                       <input type="text" class="form-control" id="'+querytype+'ColumnValue'+num+'" placeholder="Value '+num+'">\
                       </div>';
    var NewColumn = '';
    if (querytype=='update') {
      NewColumn = '<div class="row">' + ColumnKey + Operator + DataTypes + ColumnValue + '</div>';
    } else {
      NewColumn = '<div class="row">' + ColumnKey + '</div>';
    }
    var classname = '.'+querytype+'ColumnBlock';
    $(classname).append(NewColumn);
  }
})