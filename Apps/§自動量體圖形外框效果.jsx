@target illustrator
// 自動量體圖形外框效果
// 可能出現顯示錯誤，存檔後重新開啟即可
var pluginName = "自動量體圖形外框效果";
var pluginVersion = "1.0.9";


var mainDialog = new Window("dialog", pluginName + " v" + pluginVersion);
mainDialog.orientation = "column";
mainDialog.alignChildren = "fill";

var strokeGroup = mainDialog.add("panel", undefined, "邊框設置");
strokeGroup.orientation = "column";
strokeGroup.alignChildren = "left";

var strokeWidthGroup = strokeGroup.add("group");
strokeWidthGroup.add("statictext", undefined, "邊框寬度:");
var strokeWidthSlider = strokeGroup.add("slider", undefined, 2, 0, 10);
var strokeWidthValue = strokeGroup.add("edittext", undefined, "2");
strokeWidthValue.characters = 4;


var colorGroup = strokeGroup.add("group");
colorGroup.add("statictext", undefined, "邊框顏色:");
var colorButton = colorGroup.add("button", undefined, "選擇顏色");
var currentColor = new RGBColor();
currentColor.red = 0;
currentColor.green = 0;
currentColor.blue = 0;


var colorPreview = colorGroup.add("panel");
colorPreview.preferredSize = [30, 20];
updateColorPreview(currentColor);


var processButton = mainDialog.add("button", undefined, "處理", {name: "ok"});


function updateColorPreview(color) {
    var r = color.red / 255;
    var g = color.green / 255;
    var b = color.blue / 255;
    colorPreview.graphics.backgroundColor = colorPreview.graphics.newBrush(
        colorPreview.graphics.BrushType.SOLID_COLOR,
        [r, g, b]
    );
}


function checkSelection() {
    if (app.documents.length < 1) {
        alert("請先開啟文件！");
        return false;
    }
    if (app.activeDocument.selection.length < 1) {
        alert("請先選擇物件！");
        return false;
    }
    return true;
}

function processSelection() {
    try {
        var doc = app.activeDocument;
        var originalItems = doc.selection;


        var originalGroup = doc.groupItems.add();
        for (var i = originalItems.length - 1; i >= 0; i--) {
            originalItems[i].moveToBeginning(originalGroup);
        }


        var mergedGroup = originalGroup.duplicate();
        

        mergedGroup.selected = true;
        originalGroup.selected = false;
        
 
        app.executeMenuCommand("ungroup");
    
        app.executeMenuCommand("Live Pathfinder Add");
        app.executeMenuCommand("expandStyle");
        

        app.redraw();

        var mergedPaths = doc.selection;
        
        app.executeMenuCommand("ungroup");
        
        var strokeWidth = parseFloat(strokeWidthValue.text) || 2;
        
        for (var i = 0; i < doc.selection.length; i++) {
            var item = doc.selection[i];
            if (item.typename === "PathItem" || item.typename === "CompoundPathItem") {
                if (item.typename === "CompoundPathItem") {
                    for (var j = 0; j < item.pathItems.length; j++) {
                        var pathItem = item.pathItems[j];
                        pathItem.strokeWidth = strokeWidth;
                        pathItem.strokeColor = currentColor;
                        pathItem.stroked = true;
                        pathItem.filled = true;
                    }
                } else {
                    item.strokeWidth = strokeWidth;
                    item.strokeColor = currentColor;
                    item.stroked = true;
                    item.filled = true;
                }
            }
        }


        app.executeMenuCommand("group");


        var finalGroup = doc.groupItems.add();
        originalGroup.moveToBeginning(finalGroup);
        for (var i = 0; i < mergedPaths.length; i++) {
            mergedPaths[i].moveToEnd(finalGroup);
        }

        finalGroup.selected = true;

        return true;
    } catch (e) {
        alert("處理過程中出現錯誤：" + e.message);
        return false;
    }
}


colorButton.onClick = function() {
    var newColor = app.showColorPicker(currentColor);
    if (newColor) {
        currentColor = newColor;
        updateColorPreview(currentColor);
    }
};

strokeWidthSlider.onChanging = function() {
    var value = Math.round(strokeWidthSlider.value * 100) / 100;
    strokeWidthValue.text = value.toString();
};

strokeWidthValue.onChange = function() {
    var val = parseFloat(strokeWidthValue.text);
    if (!isNaN(val) && val >= 0 && val <= 10) {
        strokeWidthSlider.value = val;
    }
};

processButton.onClick = function() {
    if (checkSelection()) {
        if (processSelection()) {
            alert("處理完成！");
            mainDialog.close();
        }
    }
};

if (checkSelection()) {
    mainDialog.show();
}