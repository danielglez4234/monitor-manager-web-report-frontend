import * as $  from 'jquery';


// TODO: refactor into two functions monitorSettings and graphicSettings 
// probably use a call inside de monitorSetting and made a parent function in here that call de other two 
// FIXME: Graphic.js will now call both functions


/*
 * Get all options from the monitors selected
 */
function getGraphicoptions(){
	let selectMonitorName     = [];
	let selectGraphicType     = [];
	let selectStrokeWidth     = [];
	let selectCanvas          = [];
	let selectColor           = [];
	
	let selectCurved          = [];
	let selectFilled          = [];
	let selectDotted          = [];
	let selectLogarithm       = [];
	
	let selectValueMIN        = [];
	let selectValueMAX        = [];
	
	let selectUnitType        = [];
	let selectPrefix          = [];	

	let selectPositionAxisY   = [];
	let selectPositionAxisX   = [];

	const selectMultiaxisPOS    = $(".multiAxis input[type='checkbox']").is(":checked");

	const selectConnect          = $(".conenctLines").is(":checked");
	const selectLegends           = $(".legends").is(":checked");
	const selectLegendContainer   = $("#BottonCont").is(":checked");
	const selectLegendtrunkedName = $(".legendsMonitorName").is(":checked");

	const selectNumberFormat    = $(".numberFormat").val()
	const selectSciNotation     = $(".scientific-notation").is(":checked");

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
		let name        = $(".monitor-name").eq(i).text();
		let graphType   = $(".grafic-type .MuiInputBase-input").eq(i).val();
		let unit        = $(".unit-type .MuiInputBase-input").eq(i).val();
		let unitDefult  = $(".default-unit").eq(i).text();
		let prefix      = $(".prefix .MuiInputBase-input").eq(i).val();
		let stroke      = $(".stroke-width .MuiInputBase-input").eq(i).val();
		let canvas      = $(".canvas-width .MuiInputBase-input").eq(i).val();
		let posY        = $(".position-axis-y option:selected").eq(i).text();
		let posX        = $(".position-axis-x option:selected").eq(i).text();
		let curved      = $(".curved").eq(i).is(":checked");
		let filled      = $(".filled").eq(i).is(":checked");
		let dotted      = $(".dotted").eq(i).is(":checked");
		let log_        = $(".logarithm").eq(i).is(":checked");
		let colorCheck  = $(".checkbox-color").eq(i).is(":checked");
		let color       = $(".color-line").eq(i).val();
		let min         = $(".yaxisMin").eq(i).val();
		let max         = $(".yaxisMax").eq(i).val();


		selectMonitorName.push(name);
		if(unit === "Default"){
			if(unitDefult){
				selectUnitType.push("None")
			}else{
				selectUnitType.push(unitDefult)
			}
		}
		else if(unit === undefined){
			selectUnitType.push("None")
		}
		else{
			selectUnitType.push(unit)
		}
		// (unit === "Default") ?  selectUnitType.push(unitDefult) :
		// (unit === undefined) ? selectUnitType.push("None") : selectUnitType.push(unit);

		(prefix !== "Default" && prefix !== "") ? selectPrefix.push(prefix) : selectPrefix.push("None")
		

		selectGraphicType.push(graphType)
		selectStrokeWidth.push(stroke);
		selectCanvas.push(canvas);
		selectPositionAxisY.push(posY);
		selectPositionAxisX.push(posX);

		selectCurved.push(curved);
		selectFilled.push(filled);
		selectDotted.push(dotted);
		selectLogarithm.push(log_);

		// if the checkbox color is checked gets the color, if not is set o false
		(colorCheck) ? selectColor.push(color) : selectColor.push(false);

		// the limit is set to an absurd range when not specified to avoid iterations as much as possible and increase performance
		// we use the "value % 1 !== 0" comprobation because you can use letters and decimals to provide the range => 3e-4, -0.00003 or 3e+5, 6, 10
		(min === "") ? selectValueMIN.push(-9e+99) :
		(min % 1 !== 0) ? selectValueMIN.push(parseFloat(min)) : selectValueMIN.push(parseInt(min));

		(max === "") ? selectValueMAX.push(9e+99) :
		(max % 1 !== 0) ? selectValueMAX.push(parseFloat(max)) : selectValueMAX.push(parseInt(max));
	}

	const monitorMagnitudData ={
		name:           selectMonitorName,
		unitType:       selectUnitType,
		prefix: 		selectPrefix,
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
			numberFormat:       selectNumberFormat,
			scientificNotation: selectSciNotation,
			multiaxisPOS:       selectMultiaxisPOS,
			howManyYAxis:       selectHowManyYAxis,
			howManyXAxis:       selectHowManyXAxis,
		}
	};

  return monitorMagnitudData;
}
export default getGraphicoptions;
