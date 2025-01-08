#target illustrator

function showUI() {
    var dlg = new Window("dialog", "AnchorSpotlight（出來吧！錨點） v1.2");
    dlg.alignChildren = "fill";
    dlg.size = [350, 500];

    var mainPanel = dlg.add("panel", undefined, "樣式設定");
    mainPanel.alignChildren = "fill";

    var aPanel = mainPanel.add("panel", undefined, "錨點樣式");
    aPanel.orientation = "column";
    aPanel.alignChildren = "fill";

    var shapeGrp = aPanel.add("group");
    shapeGrp.orientation = "row";
    shapeGrp.add("statictext", undefined, "形狀:");
    var shapeDrop = shapeGrp.add("dropdownlist", undefined, ["正方形", "圓形"]);
    shapeDrop.selection = 0;

    var fillGrp = aPanel.add("group");
    fillGrp.orientation = "row";
    fillGrp.add("statictext", undefined, "填色:");
    var fillTxt = fillGrp.add("edittext", [0, 0, 100, 20], "#FFFFFF");
    var fillBtn = fillGrp.add("button", undefined, "選擇顏色");
    fillBtn.onClick = function() {
        var clr = $.colorPicker();
        if (clr !== -1) {
            fillTxt.text = rgbToHex(clr);
        }
    };

    var strokeGrp = aPanel.add("group");
    strokeGrp.orientation = "row";
    strokeGrp.add("statictext", undefined, "描邊:");
    var strokeTxt = strokeGrp.add("edittext", [0, 0, 100, 20], "#000000");
    var strokeBtn = strokeGrp.add("button", undefined, "選擇顏色");
    strokeBtn.onClick = function() {
        var clr = $.colorPicker();
        if (clr !== -1) {
            strokeTxt.text = rgbToHex(clr);
        }
    };

    var sizeGrp = aPanel.add("group");
    sizeGrp.orientation = "row";
    sizeGrp.add("statictext", undefined, "大小:");
    var sizeCtrl = sizeGrp.add("slider", undefined, 5, 1, 20);
    var sizeVal = sizeGrp.add("statictext", undefined, sizeCtrl.value.toFixed(1));
    sizeCtrl.onChanging = function() {
        sizeVal.text = sizeCtrl.value.toFixed(1);
    };

    var hPanel = mainPanel.add("panel", undefined, "控制桿樣式");
    hPanel.orientation = "column";
    hPanel.alignChildren = "fill";

    var lineClrGrp = hPanel.add("group");
    lineClrGrp.orientation = "row";
    lineClrGrp.add("statictext", undefined, "顏色:");
    var lineClrTxt = lineClrGrp.add("edittext", [0, 0, 100, 20], "#2D2D2D");
    var lineClrBtn = lineClrGrp.add("button", undefined, "選擇顏色");
    lineClrBtn.onClick = function() {
        var clr = $.colorPicker();
        if (clr !== -1) {
            lineClrTxt.text = rgbToHex(clr);
        }
    };

    var lineWGrp = hPanel.add("group");
    lineWGrp.orientation = "row";
    lineWGrp.add("statictext", undefined, "粗細:");
    var lineWCtrl = lineWGrp.add("slider", undefined, 1, 0.1, 10);
    var lineWVal = lineWGrp.add("statictext", undefined, lineWCtrl.value.toFixed(1));
    lineWCtrl.onChanging = function() {
        lineWVal.text = lineWCtrl.value.toFixed(1);
    };

    var pPanel = mainPanel.add("panel", undefined, "控制點樣式");
    pPanel.orientation = "column";
    pPanel.alignChildren = "fill";

    var pFillGrp = pPanel.add("group");
    pFillGrp.orientation = "row";
    pFillGrp.add("statictext", undefined, "填色:");
    var pFillTxt = pFillGrp.add("edittext", [0, 0, 100, 20], "#FFFFFF");
    var pFillBtn = pFillGrp.add("button", undefined, "選擇顏色");
    pFillBtn.onClick = function() {
        var clr = $.colorPicker();
        if (clr !== -1) {
            pFillTxt.text = rgbToHex(clr);
        }
    };

    var pStrokeGrp = pPanel.add("group");
    pStrokeGrp.orientation = "row";
    pStrokeGrp.add("statictext", undefined, "描邊:");
    var pStrokeTxt = pStrokeGrp.add("edittext", [0, 0, 100, 20], "#000000");
    var pStrokeBtn = pStrokeGrp.add("button", undefined, "選擇顏色");
    pStrokeBtn.onClick = function() {
        var clr = $.colorPicker();
        if (clr !== -1) {
            pStrokeTxt.text = rgbToHex(clr);
        }
    };

    var pSizeGrp = pPanel.add("group");
    pSizeGrp.orientation = "row";
    pSizeGrp.add("statictext", undefined, "大小:");
    var pSizeCtrl = pSizeGrp.add("slider", undefined, 5, 1, 20);
    var pSizeVal = pSizeGrp.add("statictext", undefined, pSizeCtrl.value.toFixed(1));
    pSizeCtrl.onChanging = function() {
        pSizeVal.text = pSizeCtrl.value.toFixed(1);
    };


    //carry轉換
    var runBtn = dlg.add("button", undefined, "生成");
    runBtn.onClick = function () {
        dlg.close();
        var cfg = {
            anchorShape: shapeDrop.selection.text,
            anchorFill: hexToRGB(fillTxt.text),
            anchorStroke: hexToRGB(strokeTxt.text),
            anchorSize: parseFloat(sizeCtrl.value),
            handleLineColor: hexToRGB(lineClrTxt.text),
            handleLineWidth: parseFloat(lineWCtrl.value),
            handlePointFill: hexToRGB(pFillTxt.text),
            handlePointStroke: hexToRGB(pStrokeTxt.text),
            handlePointSize: parseFloat(pSizeCtrl.value),
        };
        showAnchorsAndHandles(cfg);
    };

    dlg.show();
}

function showAnchorsAndHandles(settings) {
    if (app.documents.length === 0) {
        alert("請先打開一個文件。");
        return;
    }

    var doc = app.activeDocument;
    var selection = doc.selection;


    if (selection.length === 0) {
        alert("請選擇一個物件。");
        return;
    }

    var layer = doc.layers[0];
    var group = layer.groupItems.add();
    var anchorsGroup = group.groupItems.add();  // 錨點
    var linesGroup = group.groupItems.add();    // 控制線
    var handlesGroup = group.groupItems.add();  // 控制點



    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];

        if (item.typename === "PathItem") {
            var pathPoints = item.pathPoints;
            

            for (var j = 0; j < pathPoints.length; j++) {
                var point = pathPoints[j];
                var anchor = point.anchor;
                var leftDirection = point.leftDirection;
                var rightDirection = point.rightDirection;
            

                if (!isSamePoint(leftDirection, anchor)) {
                    drawLine(linesGroup, leftDirection, anchor, settings.handleLineColor, settings.handleLineWidth);
                }
                if (!isSamePoint(rightDirection, anchor)) {
                    drawLine(linesGroup, rightDirection, anchor, settings.handleLineColor, settings.handleLineWidth);
                }
            }

            for (var j = 0; j < pathPoints.length; j++) {
                var point = pathPoints[j];
                var anchor = point.anchor;
                var leftDirection = point.leftDirection;
                var rightDirection = point.rightDirection;

                if (!isSamePoint(leftDirection, anchor)) {
                    drawPoint(handlesGroup, leftDirection, settings.handlePointFill, settings.handlePointStroke, settings.handlePointSize, "圓形");
                }
                if (!isSamePoint(rightDirection, anchor)) {
                    drawPoint(handlesGroup, rightDirection, settings.handlePointFill, settings.handlePointStroke, settings.handlePointSize, "圓形");
                }
            }
            for (var j = 0; j < pathPoints.length; j++) {
                var point = pathPoints[j];
                drawPoint(anchorsGroup, point.anchor, settings.anchorFill, settings.anchorStroke, settings.anchorSize, settings.anchorShape);
            }
        }
    }
    // 蓋住點點~
    anchorsGroup.zOrder(ZOrderMethod.BRINGTOFRONT);
}


function drawPoint(group, coords, fillColor, strokeColor, size, shape) {
    var point;
    if (shape === "圓形") {
        point = group.pathItems.ellipse(
            coords[1] + size,
            coords[0] - size,
            size * 2,
            size * 2,
            false,
            true
        );
    } else {
        point = group.pathItems.rectangle(
            coords[1] + size,
            coords[0] - size,
            size * 2,
            size * 2
        );
    }
    point.filled = true;
    point.fillColor = createColor(fillColor);
    point.stroked = true;
    point.strokeColor = createColor(strokeColor);
}


function drawLine(group, startCoords, endCoords, color, width) {
    var line = group.pathItems.add();
    line.setEntirePath([startCoords, endCoords]);
    line.stroked = true;
    line.strokeColor = createColor(color);
    line.strokeWidth = width;
}


function isSamePoint(a, b) {
    return Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) < 0.01;
}


function createColor(rgb) {
    var color = new RGBColor();
    color.red = rgb.red;
    color.green = rgb.green;
    color.blue = rgb.blue;
    return color;
}


function rgbToHex(color) {
    var r = ((color >> 16) & 0xFF).toString(16);
    var g = ((color >> 8) & 0xFF).toString(16);
    var b = (color & 0xFF).toString(16);
    
    // +0
    r = r.length == 1 ? "0" + r : r;
    g = g.length == 1 ? "0" + g : g;
    b = b.length == 1 ? "0" + b : b;
    
    return "#" + r + g + b;
}


function hexToRGB(hex) {
    hex = hex.replace("#", "");
    return {
        red: parseInt(hex.substring(0, 2), 16),
        green: parseInt(hex.substring(2, 4), 16),
        blue: parseInt(hex.substring(4, 6), 16)
    };
}



showUI();