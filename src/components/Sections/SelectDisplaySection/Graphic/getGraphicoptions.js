import * as $  from 'jquery';

// NOTE: eliminar esta función
// TODO: 
// el estado de las opciones generales tiene que venir desde el mismo componente "ButtonGeneralOptions.js"
// NOTE: el estado de las opciones de los monitores ya esta siendo manejada a travez de redux
// de momento esta función se sigue utilizando

/*
 * Get all options from the monitors selected
 */
function getGraphicoptions(){
	const selectConnect           = $(".conenctLines").is(":checked");
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
	const selectlimitMIN        = (generalMin === "") ? false : parseFloat(generalMin);
	const generalMax            = $(".limitMax").val();
	const selectlimitMAX        = (generalMax === "") ? false : parseFloat(generalMax);

	const selectHowManyYAxis    = $(".howManyYAxis option:selected").text();
	const selectHowManyXAxis    = $(".howManyXAxis option:selected").text();

	return {
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
			howManyYAxis:       selectHowManyYAxis,
			howManyXAxis:       selectHowManyXAxis,
		}
	}
}
export default getGraphicoptions;
