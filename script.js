let ps = new PerfectScrollbar("#cells", {
    wheelSpeed: 0.2,
  });
  
  $(".pick-color").colorPick({
    initialColor: "#3498db",
    allowRecent: true,
    recentMax: 5,
    allowCustomColor: true,
    palette: [
      "#1abc9c",
      "#16a085",
      "#2ecc71",
      "#27ae60",
      "#3498db",
      "#2980b9",
      "#9b59b6",
      "#8e44ad",
      "#34495e",
      "#2c3e50",
      "#f1c40f",
      "#f39c12",
      "#e67e22",
      "#d35400",
      "#e74c3c",
      "#c0392b",
      "#ecf0f1",
      "#bdc3c7",
      "#95a5a6",
      "#7f8c8d",
    ],
    onColorSelected: function () {
      if (this.color != "#ABCD") {
        if ($(this.element.children()[1]).attr("id") == "fill-color") {
          $(".input-cell.selected").css("background-color", this.color);
          $("#fill-color").css("border-bottom", `4px solid ${this.color}`);
  
          // $(".input-cell.selected").each((index, data) => {
          //   let [rowId, colId] = getRowCol(data);
          //   cellData[rowId - 1][colId - 1].bgcolor = this.color;
          // });
          updateCellData("bgcolor", this.color);
        }
  
        if ($(this.element.children()[1]).attr("id") == "text-color") {
          $(".input-cell.selected").css("color", this.color);
          $("#text-color").css("border-bottom", `4px solid ${this.color}`);
  
          // $(".input-cell.selected").each((index, data) => {
          //   let [rowId, colId] = getRowCol(data);
          //   cellData[rowId - 1][colId - 1].color = this.color;
          // });
          updateCellData("color", this.color);
        }
      }
    },
  });
  
  $("#fill-color").click(function (e) {
    setTimeout(() => {
      $(this).parent().click();
    }, 10);
  });
  
  $("#text-color").click(function (e) {
    setTimeout(() => {
      $(this).parent().click();
    }, 10);
  });
  
  for (let i = 1; i <= 100; i++) {
    let str = "";
    let n = i;
  
    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        str = "Z" + str;
        n = Math.floor(n / 26) - 1;
      } else {
        str = String.fromCharCode(rem - 1 + 65) + str;
        n = Math.floor(n / 26);
      }
    }
    $("#columns").append(`<div class = "column-name column-${i}" id="${str}">${str}</div>`);
    $("#rows").append(`<div class = "row-name">${i}</div>`);
  }
  
  let cellData = {
    Sheet1: {},
  };
  
  let save = true;
  
  let selectedSheet = "Sheet1";
  let totalSheets = 1;
  let lastlyAddedSheet = 1;
  let defaultProperties = {
    "font-family": "Noto Sans",
    "font-size": 14,
    text: "",
    bold: false,
    italic: false,
    underlined: false,
    alignment: "left",
    color: "#444",
    bgcolor: "#fff",
    "formula" : "",
    "upStream" : [],
    "downStream" : [],
  };
  
  for (let i = 1; i <= 100; i++) {
    let row = $('<div class="cell-row"></div>');
    let rowArray = [];
    for (let j = 1; j <= 100; j++) {
      row.append(
        `<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`
      );
    }
    $("#cells").append(row);
  }
  
  $("#cells").scroll(function (e) {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
  });
  
  $(".input-cell").dblclick(function (e) {
    $(".input-cell.selected").removeClass(
      "selected top-selected bottom-selected left-selected right-selected"
    );
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });
  
  $(".input-cell").blur(function (e) {
    $(this).attr("contenteditable", "false");
    updateCellData("text", $(this).text());
  });
  
  function getRowCol(ele) {
    let id = $(ele).attr("id");
    let idArray = id.split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
  }
  
  function getTopBottomRightLeft(rowId, colId) {
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
  
    return [topCell, bottomCell, leftCell, rightCell];
  }
  
  $(".input-cell").click(function (e) {
    let [rowId, colId] = getRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell] = getTopBottomRightLeft(
      rowId,
      colId
    );
  
    if ($(this).hasClass("selected") && e.ctrlKey) {
      unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    } else {
      selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }
  });
  
  function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if ($(ele).attr("contenteditable") == "false") {
      if ($(ele).hasClass("top-selected")) {
        topCell.removeClass("bottom-slected");
      }
  
      if ($(ele).hasClass("bottom-selected")) {
        bottomCell.removeClass("top-slected");
      }
  
      if ($(ele).hasClass("left-selected")) {
        leftCell.removeClass("right-slected");
      }
  
      if ($(ele).hasClass("right-selected")) {
        rightCell.removeClass("left-slected");
      }
  
      $(ele).removeClass(
        "selected top-selected bottom-selected right-selected left-selected"
      );
    }
  }
  
  function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if (e.ctrlKey) {
      let topSelected;
      if (topCell) {
        topSelected = topCell.hasClass("selected");
      }
  
      let bottomSelected;
      if (bottomCell) {
        bottomSelected = bottomCell.hasClass("selected");
      }
  
      let rightSelected;
      if (rightCell) {
        rightSelected = rightCell.hasClass("selected");
      }
  
      let leftSelected;
      if (leftCell) {
        leftSelected = leftCell.hasClass("selected");
      }
  
      if (bottomSelected) {
        $(ele).addClass("bottom-selected");
        bottomCell.addClass("top-selected");
      }
  
      if (topSelected) {
        $(ele).addClass("top-selected");
        topCell.addClass("bottom-selected");
      }
  
      if (leftSelected) {
        $(ele).addClass("left-selected");
        leftCell.addClass("right-selected");
      }
  
      if (rightSelected) {
        $(ele).addClass("right-selected");
        rightCell.addClass("left-selected");
      }
    } else {
      $(".input-cell.selected").removeClass(
        "selected top-selected bottom-selected right-selected left-selected"
      );
    }
    $(ele).addClass("selected");
    changeHeader(getRowCol(ele));
  }
  
  function changeHeader([rowId, colId]) {
    let data;
    if (
      cellData[selectedSheet][rowId - 1] &&
      cellData[selectedSheet][rowId - 1][colId - 1]
    ) {
      data = cellData[selectedSheet][rowId - 1][colId - 1];
    } else {
      data = defaultProperties;
    }
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
  
    $("#fill-color").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color").css("border-bottom", `4px solid ${data.color}`);
    $("#font-family").val(data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $("#font-family").css("font-family", data["font-family"]);
  }
  
  function addRemoveSelectFromFontStyle(data, property) {
    if (data[property]) {
      $(`#${property}`).addClass("selected");
    } else {
      $(`#${property}`).removeClass("selected");
    }
  }
  
  let startCellSelected = false;
  let startCell = {};
  let endCell = {};
  let scrollXrStarted = false;
  let scrollXlStarted = false;
  
  $(".input-cell").mousemove(function (e) {
    // console.log(e.buttons);  // normal-move -> value=0 , left-click -> value = 1 , right-click -> value = 2
    e.preventDefault(); // -> to prevent the default behaviour of click function in browser
    if (e.buttons == 1) {
      if (!startCellSelected) {
  
        let [rowId, colId] = getRowCol(this);
        startCell = { rowId: rowId, colId: colId };
        selectAllBetweenCells(startCell, startCell);
        startCellSelected = true;
        $(".input-cell.selected").attr("contenteditable","false");
      }
    } else {
      startCellSelected = false;
    }
  });
  
  $(".input-cell").mouseenter(function (e) {
    if (e.buttons == 1) {
      if (e.pageX < $(window).width() - 100 && scrollXrStarted) {
        clearInterval(scrollXrInterval);
        scrollXrStarted = false;
      } else if (e.pageX > 100 && scrollXlStarted) {
        clearInterval(scrollXlInterval);
        scrollXlStarted = false;
      }
  
      let [rowId, colId] = getRowCol(this);
      endCell = { rowId: rowId, colId: colId };
      selectAllBetweenCells(startCell, endCell);
    }
  });
  
  function selectAllBetweenCells(start, end) {
    $(".input-cell.selected").removeClass(
      "selected top-selected bottom-selected right-selected left-selected"
    );
    let srow = Math.min(start.rowId, end.rowId);
    let erow = Math.max(start.rowId, end.rowId);
    let scol = Math.min(start.colId, end.colId);
    let ecol = Math.max(start.colId, end.colId);
  
    for (let i = srow; i <= erow; i++) {
      for (let j = scol; j <= ecol; j++) {
        let [topCell, bottomCell, leftCell, rightCell] = getTopBottomRightLeft(
          i,
          j
        );
        selectCell(
          $(`#row-${i}-col-${j}`)[0],
          { ctrlKey: true },
          topCell,
          bottomCell,
          leftCell,
          rightCell
        );
      }
    }
  }
  
  $(".data-container").mousemove(function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
      if (e.pageX > $(window).width() - 100 && !scrollXrStarted) {
        scrollXR();
      } else if (e.pageX < 100 && !scrollXlStarted) {
        scrollXL();
      }
    }
  });
  
  let scrollXrInterval;
  function scrollXR() {
    scrollXrStarted = true;
    scrollXrInterval = setInterval(() => {
      $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
    }, 100);
  }
  
  let scrollXlInterval;
  function scrollXL() {
    scrollXlStarted = true;
    scrollXlInterval = setInterval(() => {
      $("#cells").scrollLeft($("#cells").scrollLeft() - 100);
    }, 100);
  }
  
  $("body").mouseup(function (e) {
    clearInterval(scrollXrInterval);
    clearInterval(scrollXlInterval);
    scrollXrStarted = false;
    scrollXlStarted = false;
  });
  
  $(".alignment").click(function (e) {
    let alignment = $(this).attr("data-type");
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected");
    $(".input-cell.selected").css("text-align", alignment);
    updateCellData("alignment", alignment);
  });
  
  $("#bold").click(function (e) {
    setStyle(this, "bold", "font-weight", "bold");
  });
  
  $("#italic").click(function (e) {
    setStyle(this, "italic", "font-style", "italic");
  });
  
  $("#underlined").click(function (e) {
    setStyle(this, "underlined", "text-decoration", "underline");
  });
  
  function setStyle(ele, property, key, value) {
    if ($(ele).hasClass("selected")) {
      $(ele).removeClass("selected");
      $(".input-cell.selected").css(key, "");
      // $(".input-cell.selected").each(function (index, data) {
      //   let [rowId, colId] = getRowCol(data);
      //   cellData[rowId - 1][colId - 1][property] = false;
      // });
      updateCellData(property, false);
    } else {
      $(ele).addClass("selected");
      $(".input-cell.selected").css(key, value);
      // $(".input-cell.selected").each(function (index, data) {
      //   let [rowId, colId] = getRowCol(data);
      //   cellData[rowId - 1][colId - 1][property] = true;
      // });
      updateCellData(property, true);
    }
  }
  
  $(".menu-selector").change(function (e) {
    let value = $(this).val();
    // console.log(value);
    let key = $(this).attr("id");
    if (key == "font-family") {
      $("#font-family").css(key, value);
    }
  
    if (!isNaN(value)) {
      value = parseInt(value);
    }
  
    $(".input-cell.selected").css(key, value);
  
    // $(".input-cell.selected").each((index, data) => {
    //   let [rowId, colId] = getRowCol(data);
    //   cellData[rowId - 1][colId - 1][key] = value;
    // });
    updateCellData(key, value);
  });
  
  function updateCellData(property, value) {
    let currCellData = JSON.stringify(cellData);
    if (value != defaultProperties[property]) {
      $(".input-cell.selected").each(function (index, data) {
        let [rowId, colId] = getRowCol(data);
        if (cellData[selectedSheet][rowId - 1] == undefined) {
          cellData[selectedSheet][rowId - 1] = {};
          cellData[selectedSheet][rowId - 1][colId - 1] = {...defaultProperties, "upStream" : [], "downStream" : [] };
          cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
        } else {
          if (cellData[selectedSheet][rowId - 1][colId - 1] == undefined) {
            cellData[selectedSheet][rowId - 1][colId - 1] = {...defaultProperties, "upStream" : [], "downStream" : [] };
            cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
          } else {
            cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
          }
        }
      });
    } else {
      $(".input-cell.selected").each(function (index, data) {
        let [rowId, colId] = getRowCol(data);
        if (
          cellData[selectedSheet][rowId - 1] != undefined &&
          cellData[selectedSheet][rowId - 1][colId - 1] != undefined
        ) {
          cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
          if (
            JSON.stringify(cellData[selectedSheet][rowId - 1][colId - 1]) ==
            JSON.stringify(defaultProperties)
          ) {
            delete cellData[selectedSheet][rowId - 1][colId - 1];
          }
          if (Object.keys(cellData[selectedSheet][rowId - 1]).length == 0) {
            delete cellData[selectedSheet][rowId - 1];
          }
        }
      });
    }
    if(save && currCellData != JSON.stringify(cellData)){
      save = false;
    }
  }
  
  $(".container").click(function(e){
    $(".sheet-options-modal").remove();
  });
  function addSheetEvents(){
      console.log("hello");
      $(".sheet-tab.selected").on("contextmenu", function (e) {
        e.preventDefault();
        selectSheet(this);
        $(".sheet-options-modal").remove();
        let modal = $(`<div class = "sheet-options-modal">
                          <div class = "options sheet-rename">Rename</div>
                          <div class = "options sheet-delete">Delete</div>
                      </div>`);
        modal.css({ "left": e.pageX });
        $(".container").append(modal);
        $(".sheet-rename").click(function(e) {
            let renameModal = $(`<div class = "sheet-modal-parent">
                                <div class = "sheet-rename-modal">
                                    <div class = "sheet-modal-title">Rename Sheet</div>
                                    <div class = "sheet-modal-input-container">
                                        <span class = "sheet-modal-input-title">Rename Sheet To:</span>
                                        <input class = "sheet-modal-input" type="text"/>
                                    </div>
                                    <div class = "sheet-modal-confirmation">
                                        <div class = "button yes-button">OK</div>
                                        <div class = "button no-button">Cancel</div>
                                    </div>
                                </div>`);
          $(".container").append(renameModal);
          $(".sheet-modal-input").focus();
          $(".no-button").click(function(e){
            renameModal.remove();
          });
  
          $(".yes-button").click(function(e){
            renameSheet();
          });
  
          $(".sheet-modal-input").keypress(function(e) {
            if(e.key == "Enter"){
              renameSheet();
            }
          })
        });
  
        $(".sheet-delete").click(function(e){
          if(totalSheets > 1){
            let deleteModal = $(`<div class = "sheet-modal-parent">
                                  <div class = "sheet-delete-modal">
                                      <div class = "sheet-modal-title">${selectedSheet}</div>
                                      <div class = "sheet-modal-detail-container">
                                          <span class = "sheet-modal-detail-title">Do you want to delete?</span>
                                      </div>
                                      <div class = "sheet-modal-confirmation">
                                          <div class = "button yes-button">
                                              <div class = "material-icons delete-icon">delete</div>     
                                              Delete
                                          </div>
                                          <div class = "button no-button">Cancel</div>
                                      </div>
                                  </div>
                              </div>`);
              $(".container").append(deleteModal);
  
              $(".no-button").click(function(e){
                $(".sheet-modal-parent").remove();
              });
  
              $(".yes-button").click(function(e){
                deleteSheet();
              });
          }
          else{
            alert("Not Possible");
          }
        });
  
      });
  
      $(".sheet-tab.selected").click(function(e) {
        selectSheet(this);
      });   
  }
  
  addSheetEvents();
  
  $(".add-sheet").click(function(e){
    save = false;
    lastlyAddedSheet++;
    totalSheets++;
    cellData[`Sheet${lastlyAddedSheet}`] = {};
    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab-container").append(`<div class = "sheet-tab selected">Sheet${lastlyAddedSheet}</div>`)
    selectSheet();
    addSheetEvents();
    $(".sheet-tab.selected")[0].scrollIntoView();
  });
  
  
  function selectSheet(ele) {
    if(ele && !$(ele).hasClass("selected")){
        $(".sheet-tab.selected").removeClass("selected");
        $(ele).addClass("selected");
    }
    emptyPreviousSheet();
    selectedSheet = $(".sheet-tab.selected").text();
    $("#row-1-col-1").click();
    loadCurrentSheet();
  }
  
  function emptyPreviousSheet() {
    let data = cellData[selectedSheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
      let rowId = parseInt(i);
      let colKeys = Object.keys(data[rowId]);
      for (let j of colKeys) {
        let colId = parseInt(j);
        let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
        cell.text("");
        cell.css({
          "font-family": "Noto Sans",
          "font-size": "14",
          "background-color": "#fff",
          "color": "#444",
          "text-decoration": "",
          "text-align": "left",
          "font-style": "",
          "font-weight": ""
        });
      }
    }
  }
  
  function loadCurrentSheet() {
    let data = cellData[selectedSheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
      let rowId = parseInt(i);
      let colKeys = Object.keys(data[rowId]);
      for (let j of colKeys) {
        let colId = parseInt(j);
        let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
        cell.text(data[rowId][colId].text);
        cell.css({
          "font-family": data[rowId][colId]["font-family"],
          "font-size": data[rowId][colId]["font-size"],
          "background-color": data[rowId][colId]["bgcolor"],
          "color": data[rowId][colId].color,
          "font-weight": data[rowId][colId].bold ? "bold" : "",
          "font-style": data[rowId][colId].italic ? "italic": "",
          "text-decoration": data[rowId][colId].underlined ? "underline" : "",
          "text-align": data[rowId][colId].alignment
        });
      }
    }
  }
  
  
  function renameSheet() {
        let newSheetName = $(".sheet-modal-input").val();
        if(newSheetName && !Object.keys(cellData).includes(newSheetName)){
            save = false;
            let newCellData = {};
            for(let i of Object.keys(cellData)) {
              if(i == selectedSheet){
                newCellData[newSheetName] = cellData[selectedSheet];
              }
              else {
                newCellData[i] = cellData[i];
              }
            }
            cellData = newCellData;
  
            selectedSheet = newSheetName;
            $(".sheet-tab.selected").text(newSheetName);
            $(".sheet-modal-parent").remove();
        }
        else{
            $(".rename-error").remove();
            $(".sheet-modal-input-container").append(`
                <div class = "rename-error">Sheet Name is invalid or Sheet already exists</div>
            `)
        }
  }
  
  function deleteSheet() {
      $(".sheet-modal-parent").remove();
      let sheetIndex = Object.keys(cellData).indexOf(selectedSheet);
      let currSelectedSheet = $(".sheet-tab.selected");
  
      if(sheetIndex == 0){
          selectSheet(currSelectedSheet.next()[0]);
      }
      else{
          selectSheet(currSelectedSheet.prev()[0]);
      }
  
      delete cellData[currSelectedSheet.text()];
      currSelectedSheet.remove();
      totalSheets--;
      $(".sheet-tab.selected")[0].scrollIntoView();
  }
  
  $(".left-scroller, .right-scroller").click( function(e) {
      let selectedSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
      if(selectedSheetIndex != 0 && $(this).text() == "arrow_left"){
        selectSheet($(".sheet-tab.selected").prev()[0]);
      }
      else if(selectedSheetIndex != (Object.keys(cellData).length - 1) && $(this).text() == "arrow_right"){
        selectSheet($(".sheet-tab.selected").next()[0]);
      }
  
      $(".sheet-tab.selected")[0].scrollIntoView();
  });
  
  $("#menu-file").click(function(e) {
  
      let fileModal = $(` <div class = "file-modal">
                            <div class = "file-options-modal">
                                <div class = "close">
                                    <div class="material-icons close-icon">arrow_circle_down</div>
                                    <div>Close</div>
                                </div>
                                <div class = "new">
                                    <div class="material-icons new-icon">insert_drive_file</div>
                                    <div>New</div>
                                </div>
                                <div class = "open">
                                    <div class="material-icons open-icon">folder_open</div>
                                    <div>Open</div>
                                </div>
                                <div class = "save">
                                    <div class="material-icons save-icon">save</div>
                                    <div>Save</div>
                                </div>
                            </div>
                            <div class = "file-recent-modal"></div>
                            <div class = "file-transparent"></div>
                        </div>`)
  
      $(".container").append(fileModal);
      fileModal.animate({
        width : "100vw"
      }, 300)
      $(".close, .file-transparent, .new, .save, .open").click(function(e){
          fileModal.animate({
            width : "0vw"
          }, 300);
          setTimeout(() => {
            fileModal.remove();
          }, 300);
      });
  
      $(".new").click(function(e){
        if(save){
           newFile();
        }
        else{
            $(".container").append(`<div class = "sheet-modal-parent">
                                    <div class = "sheet-delete-modal">
                                        <div class = "sheet-modal-title">${$(".title").text()}</div>
                                        <div class = "sheet-modal-detail-container">
                                            <span class = "sheet-modal-detail-title">Do you want to save change?</span>
                                        </div>
                                        <div class = "sheet-modal-confirmation">
                                            <div class = "button yes-button">
                                                <div class = "material-icons delete-icon"></div>     
                                                Yes
                                            </div>
                                            <div class = "button no-button">Cancel</div>
                                        </div>
                                    </div>
                                </div>`);
  
            $(".yes-button").click(function(e) {
               // save function
               $(".sheet-modal-parent").remove();
               saveFile(true);
            });
  
            $(".no-button").click(function(e) {
              $(".sheet-modal-parent").remove();
              newFile();
            });
        }
      });
  
      $(".save").click(function(e) {
        if(!save){
          saveFile();
        }
      });
  
      $(".open").click(function(e) {
          openFile();
      });
  
  });
  
  function newFile(){
    emptyPreviousSheet();
    cellData = {"Sheet1" : {}};
    $(".sheet-tab").remove();
    $(".sheet-tab-container").append(`<div class = "sheet-tab selected">Sheet1</div>`);
    addSheetEvents();
    selectedSheet = "Sheet1";
    totalSheets = 1;
    lastlyAddedSheet = 1;
    $(".title").text = "Excel - Book";
    $("#row-1-col-1").click();
  }
  
  function saveFile(newClicked) {
      $(".container").append(`<div class = "sheet-modal-parent">
                              <div class = "sheet-rename-modal">
                                  <div class = "sheet-modal-title">Save File</div>
                                  <div class = "sheet-modal-input-container">
                                      <span class = "sheet-modal-input-title">File Name:</span>
                                      <input class = "sheet-modal-input" value="${$(".title").text()}"type="text"/>
                                  </div>
                                  <div class = "sheet-modal-confirmation">
                                      <div class = "button yes-button">Save</div>
                                      <div class = "button no-button">Cancel</div>
                                  </div>
                              </div>`);
    $(".yes-button").click(function(e) {
        $(".title").text($(".sheet-modal-input").val());
        let a = document.createElement("a");
        a.href = `data:application/json,${encodeURIComponent(JSON.stringify(cellData))}`;
        a.download = $(".title").text() + ".json";
        $(".container").append(a);
        a.click();
        a.remove();
        save = true;
    });
    $(".no-button, .yes-button").click(function(e) {
        $(".sheet-modal-parent").remove();
        if(newClicked){
          newFile();
        }
    });
  }
  
  function openFile() {
      let inputFile = $(`<input accept="application/json" type="file" />`);
      $(".container").append(inputFile);
      inputFile.click();
  
      inputFile.change(function(e) {
          let file = e.target.files[0];
          $(".title").text(file.name.split(".json")[0]);
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function() {       // executes when file reading is complete
              // console.log(reader.result);
              emptyPreviousSheet();
              cellData = JSON.parse(reader.result);
              $(".sheet-tab").remove();
              let keys = Object.keys(cellData);
              for(let i = 0 ; i<keys.length ; i++){
                  $(".sheet-tab-container").append(`<div class = "sheet-tab selected">${keys[i]}</div>`);
              }
              addSheetEvents();
              $(".sheet-tab").removeClass("selected");
              $($(".sheet-tab")[0]).addClass("selected");
              selectedSheet = keys[0];
              totalSheets = keys.length;
              lastlyAddedSheet = keys.length;
              $("#row-1-col-1").click();
              loadCurrentSheet();
              inputFile.remove();
          }
      });
  }
  
  let clipBoard = {startCell : [], cellData : {}};
  let contentCutted = false;
  $("#cut,#copy").click(function(e) {
      if($(this).text() == "content_cut"){
        contentCutted = true
      }
      clipBoard = {startCell : [], cellData : {}};
      clipBoard.startCell = getRowCol($(".input-cell.selected")[0]);
      $(".input-cell.selected").each(function(index, data) {
          let [rowId, colId] = getRowCol(data);
          if(cellData[selectedSheet][rowId-1] && cellData[selectedSheet][rowId-1][colId-1]) {
              if(!clipBoard.cellData[rowId]) {
                clipBoard.cellData[rowId] = {};
              }
              clipBoard.cellData[rowId][colId] = {...cellData[selectedSheet][rowId-1][colId-1]};
          }
      });
  });
  
  $("#paste").click(function(e) {
      if(contentCutted){
        emptyPreviousSheet();
      }
      let startCell = getRowCol($(".input-cell.selected")[0]);
      let rows = Object.keys(clipBoard.cellData);
      for(let i of rows){
        let cols = Object.keys(clipBoard.cellData[i]);
        for(let j of cols){
          if(contentCutted == true){
            delete cellData[selectedSheet][i-1][j-1];
            if(Object.keys(cellData[selectedSheet][i-1]).length==0){
              delete cellData[selectedSheet][i-1];
            }
          }
        }
      }
        for(let i of rows){
          let cols = Object.keys(clipBoard.cellData[i]);
          for(let j of cols){
            let rowDistance = parseInt(i) - parseInt(clipBoard.startCell[0]);   
            let colDistance = parseInt(j) - parseInt(clipBoard.startCell[1]);
            if(!cellData[selectedSheet][startCell[0] + rowDistance - 1]) {
              cellData[selectedSheet][startCell[0] + rowDistance - 1] = {};
            }
            cellData[selectedSheet][startCell[0] + rowDistance - 1][startCell[1] + colDistance - 1] = {...clipBoard.cellData[i][j]};
          }
        }
        if(contentCutted){
          contentCutted = false;
          clipBoard = {startCell : [], cellData : {}}; 
        }
        loadCurrentSheet();
  });
  
  $("#formula-input").blur(function(e) {
        if($(".input-cell.selected").length > 0) {
            let formula = $(this).text();
            let tempElements = formula.split(" ");
            let elements = [];
            for(let i of tempElements) {
                if(i.length >= 2){
                    i = i.replace("(", "");
                    i = i.replace(")", "");
                    if(!elements.includes(i)){
                      elements.push(i);
                    }
                }
            }
            $(".input-cell.selected").each(function(index, data){
              if(updateStreams(data, elements)){
  
              }
              else{
                alert("Formula is not valid");
              }
            });
        }
        else{
          alert("Please select a cell first !!");
        }
  });
  
  function updateStreams(ele, elements){
    
      let [rowId, colId] = getRowCol(ele);
      let selfColCode = $(`.column-${colId}`).attr("id");
      if(elements.includes(selfColCode + rowId)) {
        return false;
      }
  
      if(cellData[selectedSheet][rowId-1] && cellData[selectedSheet][rowId-1][colId-1]){
        let downStream = cellData[selectedSheet][rowId-1][colId-1].downStream;
        let upstream = cellData[selectedSheet][rowId-1][colId-1].upStream;
        for(let i of downStream){
          if(elements.includes(i)){
            return false;
          }
        }
      }
      
      if(!cellData[selectedSheet][rowId-1]){
        cellData[selectedSheet][rowId-1] = {};
        cellData[selectedSheet][rowId-1][colId-1] = {...defaultProperties, "upStream" : [...elements], "downStream" : []};
      }
      else if(!cellData[selectedSheet][rowId-1][colId-1]){
        cellData[selectedSheet][rowId-1][colId-1] = {...defaultProperties, "upStream" : [...elements], "downStream" : []};
      }
      else {
        let downStream = cellData[selectedSheet][rowId-1][colId-1].downStream;
        for(let i of downStream){
          if(elements.includes(i)){
            return false;
          }
        }
  
        let upstream = cellData[selectedSheet][rowId-1][colId-1].upStream;
  
        for(let i of upstream){
          let [calRowId, calColId] = codeToValue(i);
          let index = cellData[selectedSheet][rowId-1][colId-1].downStream.indexOf();
        }
        cellData[selectedSheet][rowId-1][colId-1].upStream = [...elements];
      }
  
      for(let i of elements){
          let[calRowId, calColId] = codeToValue(i);
          if(!cellData[selectedSheet][calRowId-1]){
            cellData[selectedSheet][calRowId-1] = {};
            cellData[selectedSheet][calRowId-1][calColId-1] = {...defaultProperties, "upStream" : [], "downStream" : [selfColCode + rowId]};
          }
          else if(!cellData[selectedSheet][calRowId-1][calColId-1]){
            cellData[selectedSheet][calRowId-1][calColId-1] = {...defaultProperties, "upStream" : [], "downStream" : [selfColCode + rowId]};
          }
          else {
            if(!cellData[selectedSheet][calRowId-1][calColId-1].downStream.includes(selfColCode + rowId)){
              cellData[selectedSheet][calRowId-1][calColId-1].downStream = [selfColCode + rowId];
            }
          }
      }
      console.log(cellData);
      return true;
  }
  
  function codeToValue(code) {
      let colCode = "";
      let rowCode = "";
      for(let i = 0 ; i<code.length ; i++){
        if(!isNaN(code.charAt(i))){
          rowCode = rowCode + code.charAt(i);
        }
        else{
          colCode = colCode + code.charAt(i); 
        }
      }
  
      let colId = parseInt($(`#${colCode}`).attr("class").split(" ")[1].split("-")[1]);
      let rowId = parseInt(rowCode);
      return [rowId, colId];
  }