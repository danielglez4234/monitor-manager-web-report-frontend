import React, { useEffect, useState }  from 'react';

import { useSelector }    from 'react-redux';
import getGraphicoptions  from './getGraphicoptions';
import * as $             from 'jquery';

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Micro    from "@amcharts/amcharts5/themes/Micro";
import * as am5exporting  from "@amcharts/amcharts5/plugins/exporting";
import * as am5           from "@amcharts/amcharts5";
import * as am5xy         from "@amcharts/amcharts5/xy";
import * as d3            from "d3-shape";

import InsertChartIcon    from '@mui/icons-material/InsertChart';
import LiveHelpIcon       from '@mui/icons-material/LiveHelp';
import MoreHorizIcon      from '@mui/icons-material/MoreHoriz';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';

import HandleMessage from '../../../handleErrors/HandleMessage';


// const data_test = [
// 	{
// 	  time_sample: "2019-08-01 13:00:00.000",
// 	  q3: 132.3,
// 	  max: 136.96,
// 	  min: 131.15,
// 	  q1: 136.49,
// 	  median: 135.96,
// 	  mean: (135.9 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:05:00.000",
// 	  q3: 135.26,
// 	  max: 135.95,
// 	  min: 131.5,
// 	  q1: 131.85,
// 	  median: 133.95,
// 	  mean: (133.9 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:10:00.000",
// 	  q3: 129.9,
// 	  max: 133.27,
// 	  min: 128.3,
// 	  q1: 132.25,
// 	  median: 130.40,
// 	  mean: (130.40 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:15:00.000",
// 	  q3: 132.94,
// 	  max: 136.24,
// 	  min: 132.63,
// 	  q1: 135.03,
// 	  median: 134.27,
// 	  mean: (134.27 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:20:00.000",
// 	  q3: 136.76,
// 	  max: 137.86,
// 	  min: 132.0,
// 	  q1: 134.01,
// 	  median: 135.27,
// 	  mean: (135.27 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:25:00.000",
// 	  q3: 131.11,
// 	  max: 133.0,
// 	  min: 125.09,
// 	  q1: 126.39,
// 	  median: 129.27,
// 	  mean: (129.27 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:30:00.000",
// 	  q3: 130.11,
// 	  max: 133.0,
// 	  min: 125.09,
// 	  q1: 127.39,
// 	  median: 129.27,
// 	  mean: (129.27 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:35:00.000",
// 	  q3: 125.11,
// 	  max: 126.0,
// 	  min: 121.09,
// 	  q1: 122.39,
// 	  median: 124.27,
// 	  mean: (124.2 -1)
// 	},
// 	{
// 	  time_sample: "2019-08-01 13:40:00.000",
// 	  q3: 131.11,
// 	  max: 133.0,
// 	  min: 122.09,
// 	  q1: 124.39,
// 	  median: 130.27,
// 	  mean: 130.27
// 	}
//   ];



const PROCESSOR = {
	numericField: "value",
	dateField: "time_sample",
	lowValueField: "min",
	highValueField: "max",
	q1ValueField: "q1",
	q3ValueField: "q3",
	meanValueField: "mean",
	meadianValueField: "median"
}
const FORMATER = {
	dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
	timeFormat: "HH:mm:ss.SSS",
	numberFormat: "#",
	timeInterval: "millisecond"
}

/*
 * obtain the index of the element of the second matrix that matches it
 */
const getIndexFromID = (fromArray, inArray) => {
	return fromArray.map((val) => {
		const index = inArray.map(object => object.id).indexOf(val.id)
		if(index !== -1)
			return index
		return false
	})
}


function Graphic() {
	const [msg, PopUpMessage]  = HandleMessage()
	const getResponse          = useSelector(state => state.getResponse)
	const monitor 			   = useSelector(state => state.monitor)
	const reload               = useSelector(state => state.reload)
	const searchErrors         = useSelector(state => state.searchErrors)
	let root // graphic root variable initialization

	const [nodataRecive, setNodataRecive] = useState(false);
	const [error, setError] = useState(false);

	/*
	 * if a data search error is sent
	 */
	useEffect(() => {
		setError(searchErrors)
   	}, [searchErrors])

   	/*
	 * handle the server's values for display
	 */
	const buildGraphicValues = (date, _value, logarithm) => {
		try {
			const value = (logarithm) ? Math.log10(parseFloat(_value)) : parseFloat(_value)
			if ((logarithm && value === 0) || isNaN(value))
				PopUpMessage({type:'error', message:'Error: Logarithm can\'t have zero values, disabled the Logarithm option and click reload'})
			else{
				return { 
					[PROCESSOR.dateField]: parseInt(date), 
					[PROCESSOR.numericField]: value 
				}
			}
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

	/*
	 * handle server's values for collapse display using the collapseBind object
	 */
	const buildBoxplotGraphicValues = (date, _value, collapseBind) => {
		try {
			if(Array.isArray(_value)) {
				const instance = {}
				const time_sample = parseInt(date)
				for (const [key, value] of Object.entries(collapseBind))
					instance[key] = parseFloat(_value[value])
				return { time_sample, ...instance }
			}
			else{
				PopUpMessage({type:'error', message:'The data type is not valid!! please contact the administrator to fix this'})
			}
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * create data for configuration in the chart
	 */
	const arrangeData = (res) => {
		try {
			const columns_ = res.responseData.columns
			const samples_ = res.responseData.samples
			const graphicOptions = getGraphicoptions()
		
			const info_ = []
			// we remove these two fields so that the indexes of the graphical monitor options match more easily
			if(columns_.at(0).name === "TimeStamp"){
				columns_.shift() // delete timeStamp
				columns_.shift() // delete timeStampLong
			}
			const indexOfFrom_ = getIndexFromID(columns_, monitor)
			
			columns_.map((columns_row, index) => {
				const optionsIndex = indexOfFrom_.at(index)
				const options = (optionsIndex !== undefined) ? monitor.at(optionsIndex).options : monitor.at(0).options
				
				const data = []
				samples_.map((sample_val) => {

					const date = sample_val.at(1).substring(0, sample_val.at(1).length - 3) // convert to milliseconds (the chart does not support microseconds)
					let value  = sample_val.at(index+2) // +2 => jumping timestamp and timestampLong
					
					const isMagnitude = columns_row?.stateOrMagnitudeValuesBind
					const isSummary = columns_row?.summaryValuesBind

					if (value !== "" && value.length > 0){
						if (isMagnitude)
							value = isMagnitude[value]

						if(isSummary)
							data.push( buildBoxplotGraphicValues(date, value, isSummary))
						else
						{
							const min_l = options.limit_min || -Infinity
							const max_l = options.limit_max || Infinity
							if (value > min_l && value < max_l)
								data.push( buildGraphicValues(date, value, options.logarithm) )
						}
					}
				})
				// if "Only monitor name" is checked
				let _name = columns_row.name
				if(graphicOptions.legendTrunkName)
				{
					_name = _name.split("/")
					_name = _name[_name.length - 1]
				}
				// the graphic removes the "[]" so we force the position number with the "/"
				const name = _name + ((columns_row.position === -1) ? " " : " /" + columns_row.position) 
				// show the abbreviation if the monitor has a unit
				const unit_abbr = (columns_row?.unit !== null) ? columns_row.unit.abbreviature : ""
				// save monitor storage period
				const storagePeriod = columns_row.storagePeriod

				info_.push({name, unit_abbr, storagePeriod, data, ...options})
			})
			return info_
		} catch (error) {
			console.log(error)
		}
	}

/*
 * get root selected theme
 */
const getRootTheme = () => {
	try {
		const graphicOptions = getGraphicoptions()
		const setThemes = []
		if (graphicOptions.animations) { setThemes.push(am5themes_Animated.new(root)) }
		if (graphicOptions.microTheme) { setThemes.push(am5themes_Micro.new(root)) }
		return setThemes
	} catch (error) {
		console.log(error)
	}
}

  /*
   *  Chart initialization
   *   - When the component is mounted, the root is initialized, since responseData is empty for the moment nothing is shown
   +   - When the responseData subscriber receives the data the function is executed again, the change of [responseData] will trigger the update of the function.
   *       - the same for [reload] the function will be updated with the new data
   +   - The root element of amchart cannot be duplicated, we avoid this by using the 'retun () => {...}' method to execute the 'dispose()' when the component is unmount
   */
useEffect(() => {
    root = am5.Root.new("chartdiv") // Create root element =ref=> <div id="chartdiv"></div>
    root.fps = 40

	if (getResponse.length === 0)
		setNodataRecive(false)
	else
	{
		if(!getResponse.responseData?.samples)
		{
			setNodataRecive(true)
			$("#initialImg").addClass('display-none')
		}
		else if (getResponse.responseData.samples.length > 0)
		{
			root.setThemes(getRootTheme())
			const graphicData = arrangeData(getResponse)

			if(graphicData !== undefined)
			{
				generateGraphic(graphicData)
				setNodataRecive(false)
			}
			else
				PopUpMessage({type:'error', message:'The data could not be processed, please contact the administrator to fix this.'})
		}
		else
			setNodataRecive(true)
	}

    // store current value of root and restore root element when update
    root.current = root
    return () => {
      	root.dispose()
    }
}, [getResponse, reload])


/*
 * get Y renderer Axis
 */
const getYRenderer = (grid) => {
	try {
		let yRenderer = am5xy.AxisRendererY.new(root, {
			opposite: false,
		})
		if (grid) // hide grid
			  yRenderer.grid.template.set("visible", false)
		return yRenderer
	} catch (error) {
		console.log(error)
	}
}

/*
 * get X renderer Axis
 */
const getXRenderer = (grid) => {
	try {
		let xRenderer = am5xy.AxisRendererX.new(root, {
			minGridDistance: 100,
		})
		if (grid) // hide grid
			xRenderer.grid.template.set("visible", false)
		return xRenderer
	} catch (error) {
		console.log(error)
	}
}



/*
 * Calculate tooltip 
 */
const getMillisecondBaseCount = (info) => {
	let totalSum = 0;
	const globalSampling = getResponse.sampling_period
	const totalLength = info.length
	if (globalSampling === 0) 
	{
		for (let n = 0; n < info.length; n++) 
		{
			const ifsampling = (info[n].storagePeriod === "") ? 2000000 : info[n].storagePeriod
			const numSampling = Math.trunc(ifsampling) / 1000 // tranform to milliseconds
			totalSum += numSampling
		}
		return totalSum / totalLength
	}
	else 
	{
		return globalSampling / 1000
	}
}

/*
 * Set properties configuration to a series function
 */
const seriesConfiguration = (data) => {
	try {
		const generalOptions = getGraphicoptions()
		const gaps = generalOptions.connect
		const tooltip = generalOptions.tooltip
		const name = data.name
		const color = data.color
		const curved = data.curved
		const unitAbbr = data.unit_abbr
		const properties = {
			name: name,
			connect: !gaps,
			valueYField: PROCESSOR.numericField,
			valueXField: PROCESSOR.dateField,
			calculateAggregates: true,
			legendLabelText: "{name}: ",
			legendRangeLabelText: "{name}: ",
			legendValueText: "[bold]{valueY}",
			legendRangeValueText: "{valueYClose}",
			minBulletDistance: 10
		}
	
		const setTooltip = am5.Tooltip.new(root, {
			exportable: false,
			pointerOrientation: "horizontal",
			labelText: `[bold]{name}[/]\n{valueX.formatDate('${FORMATER.dateFormat}')}\n[bold]{valueY}[/] ${unitAbbr}`
		})
	
		if (tooltip)
			properties["tooltip"] = setTooltip
		if (curved)
			properties["curveFactory"] = d3.curveBumpX
		if (color) {
			properties["stroke"] = am5.color(color)
			properties["fill"] = am5.color(color)
		}
		return properties;
	} catch (error) {
		console.log(error)
	}
}

/*
 * get CandlestickSeries default config
 */
const boxplotSeriesConfiguration = (name) => {
	return {
		fill: "#333",
		stroke: "#333",
		name: name,
		valueYField: PROCESSOR.q1ValueField,
		openValueYField: PROCESSOR.q3ValueField,
		lowValueYField: PROCESSOR.lowValueField,
		highValueYField: PROCESSOR.highValueField,
		valueXField: PROCESSOR.dateField,
		tooltip: am5.Tooltip.new(root, {
			pointerOrientation: "horizontal",
			labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY},\nmedian: {median}\nmean: {mean}"
		})
	}
}

/*
 * // median series
 * get boxplot median values default options 
 */
const addMedianSeriesDefaultConf = (props) => {
	return props.chart.series.push(
		am5xy.StepLineSeries.new(root, {
			stroke: "#d1d8d9",
			name: PROCESSOR.meadianValueField,
			xAxis: props.dateAxis,
			yAxis: props.valueAxis,
			valueYField: PROCESSOR.meadianValueField,
			valueXField: PROCESSOR.dateField,
			noRisers: true
		})
	)
}

/*
 * // mean series
 * get boxplot mean values default options 
 */
const addMeanSeriesDefaultConf = (props) => {
	let meanSeries = props.chart.series.push(
		am5xy.StepLineSeries.new(root, {
			stroke: "#d1d8d9",
			// name: "josué " +PROCESSOR.meanValueField,
			xAxis: props.dateAxis,
			yAxis: props.valueAxis,
			valueYField: PROCESSOR.meanValueField,
			valueXField: PROCESSOR.dateField,
			noRisers: true
		})
	)
	meanSeries.strokes.template.setAll({
		strokeDasharray: [2, 2],
		strokeWidth: 2
	})
	return meanSeries
}

/*
 * get series
 */
const getSeries = (props, data) => {
	try {
		let config
		const isBoxplotEnabled = data?.boxplot?.isEnable
		const seriesType = data.graphicType

		if(isBoxplotEnabled)
			config = boxplotSeriesConfiguration(data.name)
		else
			config = seriesConfiguration(data)
		
		config["xAxis"] = props.dateAxis
		config["yAxis"] = props.valueAxis

		if(isBoxplotEnabled)
			return props.chart.series.push(am5xy.CandlestickSeries.new(root, config))
		else if(seriesType === "Step Line Series")
			return props.chart.series.push(am5xy.StepLineSeries.new(root, config))
		else
			return props.chart.series.push(am5xy.LineSeries.new(root, config))

	} catch (error) {
		console.log(error)
	}
}

/*
 * get line stroke
 */
const getLineStroke = (stroke) => {
	try {
		if (stroke === "Medium")
			return 2
		else if (stroke === "Light")
			return 1
		else if (stroke === "Bold")
			return 3
		else if (stroke === "Bolder")
			return 4
		else 
			return 1
	} catch (error) {
		console.log(error)
	}
}

/*
 * get line canvas 
 */
const getLineCanvas = (canvas) => {
	try {
		if (canvas === "Dotted")
			return ["1"]
		else if (canvas === "Dashed")
			return ["3","3"]
		else if (canvas === "Large Dashed")
			return ["10"]
		else if (canvas === "Dotted Dashed")
			return ["10", "5", "2", "5"]
		else
			return false
	} catch (error) {
		console.log(error)
	}
}

/*
 * get legend height
 */
const getLegendHeight = (length) => {
	try {
		if (length === 1 || length === 2) 
			return 50
		else if (length === 3) 
			return 80
		else if (length === 4) 
			return 110
		else 
			return 150
	} catch (error) {
		console.log(error)
	}
}



//----------------------------------------Generate Graphic-----------------------------------------------------

const generateGraphic = (info) =>{
   	// Initialize variables for chart
	let [chart, dateAxis, valueAxis, series, legend, scrollbarX, scrollbarY] = [] // [] => this represents undefined
	// Initialize variables for general options
	const generalOptions 	 = getGraphicoptions()
	const grid 				 = !generalOptions.grid
	const limitMIN 			 = generalOptions.limitMIN
	const limitMAX 			 = generalOptions.limitMAX
	const groupData 		 = generalOptions.groupData
	const microTheme 		 = !generalOptions.microTheme
	const showLegends 		 = generalOptions.legends
	const legendContainerPos = generalOptions.legendContainerPos
	
    /*
	* Set the root format number for received values depending on whether the number is integer or not
	*/
	const sciNotation = (generalOptions.scientificNotation) ? "e" : ""
    root.numberFormatter.setAll({
		numberFormat: FORMATER.numberFormat + sciNotation,
    });

    /*
     * Set Local Time Zone to avoid default date formating
     */
    root.utc = true;

    /*
     * Create chart
     */
    chart = root.container.children.push(
		am5xy.XYChart.new(root, {
			panY: false,
			wheelY: "zoomX",
			maxTooltipDistance: 0
		})
    );

    /*
     * Add Value Y Axis
     * format suported -> 5e-7 or 0.0000005, 450000 or 45e+4
     * ***WARNING*** on this version the exponential format is up to 7, this does not work in the plugin: 1e-8, +etc...
     */
    valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		extraTooltipPrecision: 1,
		min: limitMIN,
		max: limitMAX,
		renderer: getYRenderer(grid)
    }));

    /*
     *  Set the format for representing the values and set the data count interval 
     */
    dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		groupData: groupData,
		maxDeviation: 0,
		baseInterval: {
			timeUnit: FORMATER.timeInterval,
			count: getMillisecondBaseCount(info)
		},
		renderer: getXRenderer(grid)
    }))

    /*
     * Format the date depending on the time unit to be displayed
     */
    dateAxis.get("dateFormats")[FORMATER.timeInterval] = FORMATER.timeFormat

    // --- --- --- --- --- --- Add All series --- --- --- --- --- --- ---
    
	for (let y = 0; y < info.length; y++) {
		// Set Graphic data
		const data_ = info[y]
		const graphProps = {chart, dateAxis, valueAxis}
		
		// Set Series
		series = getSeries(graphProps, data_)

		// if boxplot is enabled the way to show the median is using the steps series type
		if(data_?.boxplot.isEnable){
			addMedianSeriesDefaultConf(graphProps).data.setAll(data_.data)
			addMeanSeriesDefaultConf(graphProps).data.setAll(data_.data)
		}
		else{
			// Set Series line weight and dashArray view // this doesn't work with boxplot series type
			series.strokes.template.setAll({
				strokeWidth: getLineStroke(data_.stroke),
				strokeDasharray: getLineCanvas(data_.canvas)
			})
		}

		// Set filled
		if (data_?.filled) {
			series.fills.template.setAll({
				visible: true,
				fillOpacity: 0.3
			});
		}

		// Set up data processor to parse string dates		
		series.data.processor = am5.DataProcessor.new(root, {
			dateFormat: FORMATER.timeInterval,
			dateFields: [PROCESSOR.dateField]
		});
		
		// Set series DATA
		series.data.setAll(data_.data)
		// series.data.setAll(data_test)
    } 	
	
	// --- --- --- --- --- end for 'Add All series ' --- --- --- --- --- --- ---


	// TODO:
	// Create axis ranges
	// function createRange(series, value, endValue, color) {
	//   var rangeDataItem = valueAxis.makeDataItem({
	//     value: value,
	//     endValue: endValue
	//   });
	
	//   var range = series.createAxisRange(rangeDataItem);
	
	//   range.strokes.template.setAll({
	//     stroke: color,
	//     strokeWidth: 2
	//   });
	
	//   rangeDataItem.get("axisFill").setAll({
	//     fill: color,
	//     fillOpacity: 0.05,
	//     visible: true
	//   });
	// }
	// createRange(series, 30, 20, am5.color(0xf41a1a));
	// createRange(series, 10, 14, am5.color(0xf41a1a));


   /*
    * set legend height depending on how many legends
    */

    /*
     * Set legends to the chart
     */
    if (showLegends) {
		const legendSettings = {
			width: am5.percent(100),
			height: getLegendHeight(info.length),
			verticalScrollbar: am5.Scrollbar.new(root, {
				orientation: "vertical"
			})
		}

      	if (legendContainerPos) { 
			legend = chart.bottomAxesContainer.children.push(am5.Legend.new(root, legendSettings)) 
		}
    	else { 
			legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, legendSettings)) 
		}

		// TODO: NOT_WORKING: el evento hover salta un excepción con el tipo de gráfica boxplot
		// if(false){
			//  When hovering over the legend element container, all series are dimmed except the one hovered over.
			legend.itemContainers.template.events.on("pointerover", function(e) {
				let itemContainer = e.target;
				//  As the list of series is data from a legend, dataContext is the series
				let series = itemContainer.dataItem.dataContext;

				chart.series.each(function(chartSeries) {
				if (chartSeries !== series) {
					chartSeries.strokes.template.setAll({
						strokeOpacity: 0.15,
						stroke: am5.color(0x000000)
					});
				} else {
					chartSeries.strokes.template.setAll({});
				}
				})
			})

			// When legend item container is unhovered, make all series as they are
			legend.itemContainers.template.events.on("pointerout", function(e) {
				chart.series.each(function(chartSeries) {
					chartSeries.strokes.template.setAll({
						strokeOpacity: 1,
						stroke: chartSeries.get("fill")
					});
				});
			})
		// }

		// align legends content in the container
		legend.itemContainers.template.set("width", am5.p100);
		legend.valueLabels.template.setAll({
			width: am5.p100,
			textAlign: "left"
		});
		// It is important to set the legend data after all events are set in the template, otherwise the events will not be applied.
		legend.data.setAll(chart.series.values);
    }


	/*
	 * Set Cursor XY on the chart
	 */
	chart.set("cursor", am5xy.XYCursor.new(root, {
		behavior: "zoomX",
		xAxis: dateAxis
	}));

	/*
	 * if microTheme is active
	 */
	if (microTheme) {
		valueAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}));

		dateAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}));
	}

	/*
	 * Set Zoom ScrollBar
	 */
	// Horizontal Zoom
	scrollbarX = am5.Scrollbar.new(root, {
		orientation: "horizontal",
		exportable: false
	});
	chart.set("scrollbarX", scrollbarX);
	// chart.bottomAxesContainer.children.push(scrollbarX);

	// Vertical Zoom
	scrollbarY = am5.Scrollbar.new(root, {
		orientation: "vertical",
		exportable: false
	});
	chart.set("scrollbarY", scrollbarY);
	chart.leftAxesContainer.children.push(scrollbarY);

	/*
	 * Set Exporting menu
	 */
	am5exporting.Exporting.new(root, {
		menu: am5exporting.ExportingMenu.new(root, {}),
		// dataSource: getResponse.responseData.samples,
		numericFields: [PROCESSOR.numericField],
		dateFields: [PROCESSOR.dateField],
		dateFormat: FORMATER.dateFormat,
		dataFields: {
			value: "Value",
			time_sample: "Date"
		},
		dataFieldsOrder: ["date", "value"]
	});
} // end generateGraphic




	return(
		<div className="display-grafic-section">
			<div id="chartdiv" className="grafic-box">

			{/* The Graphic will be display here  => id="chartdiv"*/}
			<InsertChartIcon id="initialImg" className="display-none" />

			{
			(nodataRecive) ?
					<div className="no-data-error-message">
						<LiveHelpIcon className="icon-no-data help-icon" />
						<MoreHorizIcon className="icon-no-data dot-icon" />
						<p>No Data Available.</p>
						<p>Try to use a different date range or a different Monitor.</p>
					</div>
				:
				(error) ? 
					<div className="no-data-error-message"> 
						<NearbyErrorIcon className="icon-no-data help-icon error-color" />
						<p>An error has ocurred!</p>
						<p>If the error persist</p>
						<p>please contact the administrators.</p>
					</div>
				: ""
			}
			</div>
		</div>
	);
}

export default Graphic;