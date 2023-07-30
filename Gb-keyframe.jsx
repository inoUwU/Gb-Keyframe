/*
Gb-Keyframe
version 1.0
*/
var toolPanel = createUI(this);
//---------scriptUI-------------------
function createUI(thisObj) {
  var scriptname = "Gb-Keyframe";
  var myPanel =
    thisObj instanceof Panel
      ? thisObj
      : new Window("palette", scriptname, undefined, { resizeable: true });
  var tab = myPanel.add("tabbedpanel");
  var tab1 = tab.add("tab", undefined, "Delete");
  tab1.margins = 1;
  var tab2 = tab.add("tab", undefined, "Move");
  tab2.margins = 1;
  var framework = tab1.add("group");
  framework.orientation = "column";
  framework.margins = 5;
  framework.alignment = ["fill", "center"];
  var optionsGrp = framework.add("panel", undefined, "Delete Setting");
  optionsGrp.name = ["options"];
  optionsGrp.margins = 10;
  optionsGrp.orientation = "column";
  optionsGrp.alignment = ["center", "center"];
  var dualRadioBtn = optionsGrp.add(
    "radiobutton",
    [30, 10, 220, 30],
    "Start and End Keyframe"
  );
  var startRadioBtn = optionsGrp.add(
    "radiobutton",
    [30, 10, 220, 30],
    "StartPoint Keyframe"
  );
  var endRadioBtn = optionsGrp.add(
    "radiobutton",
    [30, 10, 220, 30],
    "EndPoint Keyframe"
  );
  var runBtn = framework.add("button", undefined, "Execution");
  runBtn.alignment = ["fill", "center"];
  dualRadioBtn.value = true; //selected
  //tab2
  var framework2 = tab2.add("group");
  framework2.orientation = "column";
  framework2.margins = 5;
  framework2.alignment = ["fill", "center"];
  var optionsGrp2 = framework2.add("panel", undefined, "Move Settings");
  optionsGrp2.name = ["options"];
  optionsGrp2.margins = 10;
  optionsGrp2.orientation = "column";
  optionsGrp2.alignment = ["fill", "center"];
  optionsGrp2.add(
    "statictext",
    [30, 10, 220, 30],
    "※Move keyframe onto indicator"
  );
  var startKey = optionsGrp2.add(
    "radiobutton",
    [30, 10, 220, 30],
    "StartPoint Keyframe"
  );
  var endKey = optionsGrp2.add(
    "radiobutton",
    [30, 10, 220, 30],
    "EndPoint Keyframe"
  );
  endKey.value = true; //selected
  var runBtn2 = framework2.add("button", undefined, "Execution");
  runBtn2.alignment = ["fill", "center"];

  //ButtonClickEvents
  runBtn.onClick = function () {
    var deleteMode = 0;
    if (dualRadioBtn.value === true) {
      deleteMode = 0;
    } else if (startRadioBtn.value === true) {
      deleteMode = 1;
    } else if (endRadioBtn.value === true) {
      deleteMode = 2;
    }
    DeleteExecution(deleteMode);
  };
  runBtn2.onClick = function () {
    var moveMode = 0;
    if (startKey.value === true) {
      moveMode = 0;
    } else if (endKey.value === true) {
      moveMode = 1;
    }
    MoveExecution(moveMode);
  };

  return myPanel;
}

toolPanel.layout.layout();
toolPanel.onResize = function () {
  toolPanel.layout.resize();
};
if (toolPanel instanceof Window) {
  toolPanel.center();
  toolPanel.show();
}
//---------------functions-----------------------------
function DeleteExecution(mode) {
  var SelectedLayer = app.project.activeItem.selectedLayers;
  if (SelectedLayer.length !== 0) {
    for (var i = 0; i < SelectedLayer.length; i++) {
      var isTImeRemap = SelectedLayer[i].canSetTimeRemapEnabled;
      if (isTImeRemap === false) {
        continue;
      }
      var timeRemapProp = SelectedLayer[i].property("ADBE Time Remapping");
      var keysIndex = timeRemapProp.numKeys;
      if (mode === 0) {
        timeRemapProp.removeKey(keysIndex);
        timeRemapProp.removeKey(1);
      } else if (mode === 1) {
        timeRemapProp.removeKey(1);
      } else {
        timeRemapProp.removeKey(keysIndex);
      }
      if (SelectedLayer.length === 1) {
        timeRemapProp.selected = true;
      }
    }
  } else {
    alert("Layer is not selected");
  }
}

function MoveExecution(mode) {
  var time = [app.project.activeItem.time];
  var SelectedLayer = app.project.activeItem.selectedLayers;
  if (SelectedLayer.length !== 0) {
    for (var i = 0; i < SelectedLayer.length; i++) {
      var isTImeRemap = SelectedLayer[i].canSetTimeRemapEnabled;
      if (isTImeRemap === false) {
        continue;
      }
      var timeRemapProp = SelectedLayer[i].property("ADBE Time Remapping");
      var keysIndex = timeRemapProp.numKeys;
      var setVal = [];
      if (mode === 0) {
        setVal.push(timeRemapProp.keyValue(1));
        timeRemapProp.removeKey(1);
        timeRemapProp.setValuesAtTimes(time, setVal);
      } else if (mode === 1) {
        setVal.push(timeRemapProp.keyValue(keysIndex));
        timeRemapProp.removeKey(keysIndex);
        timeRemapProp.setValuesAtTimes(time, setVal);
      }
      if (SelectedLayer.length === 1) {
        timeRemapProp.selected = true;
      }
    }
  } else {
    alert("Layer is not selected");
  }
}
