import * as $  from 'jquery';

// NOTE: eliminar esta función
// TODO: 
// el estado de las opciones generales tiene que venir desde el mismo componente "ButtonGeneralOptions.js"
// NOTE: el estado de las opciones de los monitores ya está siendo manejada a través de redux
// de momento esta función se sigue utilizando

/*
 * Get all options from the monitors selected
 */
function getGraphicoptions(){
	const connect            = $(".conenctLines").is(":checked");
	const legends            = $(".legends").is(":checked");
	const legendContainerPos = $("#BottonCont").is(":checked");
	const legendTrunkName 	 = $(".legendsMonitorName").is(":checked");

	const numberFormat    	 = $(".numberFormat").val()
	const scientificNotation = $(".scientific-notation").is(":checked");

	const tooltip         = $(".tooltip").is(":checked");
	const grid            = $(".grid").is(":checked");
	const groupData       = $(".groupData").is(":checked");
	const animations      = $(".animations").is(":checked");
	const microTheme      = $(".microTheme").is(":checked");

	const generalMin      = $(".limitMin").val();
	const limitMIN        = (generalMin === "") ? false : parseFloat(generalMin);
	const generalMax	  = $(".limitMax").val();
	const limitMAX        = (generalMax === "") ? false : parseFloat(generalMax);

	const howManyYAxis    = $(".howManyYAxis option:selected").text();
	const howManyXAxis    = $(".howManyXAxis option:selected").text();

	return {
		limitMIN,
		limitMAX,
		tooltip,
		connect,
		groupData,
		grid,
		animations,
		microTheme,
		legends,
		legendContainerPos,
		legendTrunkName,
		numberFormat,
		scientificNotation,
		howManyYAxis,
		howManyXAxis
	}
}
export default getGraphicoptions;
