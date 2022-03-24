import * as $  from 'jquery';

/*
 * Get all options from the monitors selected
 */
function getGraphicoptions(){
  let selectMonitorName     = [];
  let selectGraphicType     = [];
  let selectUnitType        = [];
  let selectStrokeWidth     = [];
  let selectCanvas          = [];
  let selectColor           = [];

  let selectCurved          = [];
  let selectFilled          = [];
  let selectDotted          = [];
  let selectLogarithm       = [];

  let selectValueMIN        = [];
  let selectValueMAX        = [];

  let selectPositionAxisY   = [];
  let selectPositionAxisX   = [];

  const selectMultiaxisPOS    = $(".multiAxis input[type='checkbox']").is(":checked");

  const selectConnect          = $(".conenctLines").is(":checked");
  const selectLegends           = $(".legends").is(":checked");
  const selectLegendContainer   = $("#BottonCont").is(":checked");
  const selectLegendtrunkedName = $(".legendsMonitorName").is(":checked");

  const selectTooltip         = $(".tooltip").is(":checked");
  const selectGrid            = $(".grid").is(":checked");
  const selectGroupData       = $(".groupData").is(":checked");
  const selectAnimations      = $(".animations").is(":checked");
  const selectMicroTheme      = $(".microTheme").is(":checked");

  const generalMin            = $(".limitMin").val();
  const selectlimitMIN        = (generalMin === "") ? false :
                                (generalMin % 1 !== 0) ? parseFloat(generalMin) : parseInt(generalMin);
  const generalMax            = $(".limitMax").val();
  const selectlimitMAX        = (generalMax === "") ? false :
                                (generalMax % 1 !== 0) ? parseFloat(generalMax) : parseInt(generalMax);

  const selectHowManyYAxis    = $(".howManyYAxis option:selected").text();
  const selectHowManyXAxis    = $(".howManyXAxis option:selected").text();


  for (let i = 0; i < $(".monitor-name").length; i++) {
    selectMonitorName.push($(".monitor-name").eq(i).text());
    selectUnitType.push($(".unit-type option:selected").eq(i).text());

    // selectGraphicType.push($(".grafic-type option:selected").eq(i).text());
    selectGraphicType.push($(".grafic-type .MuiInputBase-input").eq(i).val());

    // selectStrokeWidth.push($(".stroke-width").eq(i).val());
    selectStrokeWidth.push($(".stroke-width .MuiInputBase-input").eq(i).val());

    // selectCanvas.push($(".canvas-width").eq(i).val());
    selectCanvas.push($(".canvas-width .MuiInputBase-input").eq(i).val());

    selectPositionAxisY.push($(".position-axis-y option:selected").eq(i).text());
    selectPositionAxisX.push($(".position-axis-x option:selected").eq(i).text());

    selectCurved.push($(".curved").eq(i).is(":checked"));
    selectFilled.push($(".filled").eq(i).is(":checked"));
    selectDotted.push($(".dotted").eq(i).is(":checked"));
    selectLogarithm.push($(".logarithm").eq(i).is(":checked"));

    // if the checkbox color is checked gets the color, if not is set o false
    ($(".checkbox-color").eq(i).is(":checked")) ? selectColor.push($(".color-line").eq(i).val()) : selectColor.push(false);
    // the limit is set to an absurd range when not specified to avoid iterations as much as possible and increase performance
    // we use the "value % 1 !== 0" comprobation because you can use letters and decimals to provide the range => 3e-4, -0.00003 or 3e+5, 6, 10
    let min = $(".yaxisMin").eq(i).val();
    // (min === "") ? selectValueMIN.push(-Infinity) :
    (min === "") ? selectValueMIN.push(-9e+99) :
    (min % 1 !== 0) ? selectValueMIN.push(parseFloat(min)) : selectValueMIN.push(parseInt(min));

    let max = $(".yaxisMax").eq(i).val();
    // (max === "") ? selectValueMAX.push(Infinity) :
    (max === "") ? selectValueMAX.push(9e+99) :
    (max % 1 !== 0) ? selectValueMAX.push(parseFloat(max)) : selectValueMAX.push(parseInt(max));
  }

  const monitorMagnitudData ={
    name:           selectMonitorName,
    unitType:       selectUnitType,
    graphicType:    selectGraphicType,
    logarithm:      selectLogarithm,
    strokeWidth:    selectStrokeWidth,
    canvasWidth:    selectCanvas,
    filled:         selectFilled,
    curved:         selectCurved,
    dotted:         selectDotted,
    color:          selectColor,
    valueMIN:       selectValueMIN,
    valueMAX:       selectValueMAX,
    positionAxisY:  selectPositionAxisY,
    positionAxisX:  selectPositionAxisX,
    general: {
      limitMIN:           selectlimitMIN,
      limitMAX:           selectlimitMAX,
      tooltip:            selectTooltip,
      connect:            selectConnect,
      groupData:          selectGroupData,
      grid:               selectGrid,
      animations:         selectAnimations,
      microTheme:         selectMicroTheme,
      legends:            selectLegends,
      legendContainerPos: selectLegendContainer,
      legendTrunkName:    selectLegendtrunkedName,
      multiaxisPOS:       selectMultiaxisPOS,
      howManyYAxis:       selectHowManyYAxis,
      howManyXAxis:       selectHowManyXAxis,
    }
  };

  return monitorMagnitudData;
}
export default getGraphicoptions;
