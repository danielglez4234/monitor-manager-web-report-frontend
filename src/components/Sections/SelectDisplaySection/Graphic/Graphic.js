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


const PROCESSOR = {
	numericField: "value",
	dateField: "time_sample",
	lowValueField: "MIN",
	highValueField: "MAX",
	q1ValueField: "Q1",
	q3ValueField: "Q3",
	meanValueField: "MEAN",
	meadianValueField: "MEDIAN"
}
const FORMATER = {
	dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
	timeFormat: "HH:mm:ss.SSS",
	numberFormat: "#",
	timeInterval: "millisecond"
}

const data_test = [
	{
	  time_sample: "2019-08-01 13:00:00.000",
	  Q3: 132.312368903,
	  MAX: 136.96312368903,
	  MIN: 131.15312368903,
	  Q1: 136.49312368903,
	  MEDIAN: 135.96312368903,
	  MEAN: (135.9312368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:05:00.000",
	  Q3: 135.2612368903,
	  MAX: 135.952612368903,
	  MIN: 131.52612368903,
	  Q1: 131.852612368903,
	  MEDIAN: 133.952612368903,
	  MEAN: (133.92612368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:10:00.000",
	  Q3: 129.912368903,
	  MAX: 133.27912368903,
	  MIN: 128.3912368903,
	  Q1: 132.25912368903,
	  MEDIAN: 130.40912368903,
	  MEAN: (130.40912368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:15:00.000",
	  Q3: 132.9412368903,
	  MAX: 136.249412368903,
	  MIN: 132.639412368903,
	  Q1: 135.039412368903,
	  MEDIAN: 134.279412368903,
	  MEAN: (134.279412368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:20:00.000",
	  Q3: 136.7612368903,
	  MAX: 137.867612368903,
	  MIN: 132.07612368903,
	  Q1: 134.017612368903,
	  MEDIAN: 135.277612368903,
	  MEAN: (135.277612368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:25:00.000",
	  Q3: 131.1112368903,
	  MAX: 133.01112368903,
	  MIN: 125.091112368903,
	  Q1: 126.391112368903,
	  MEDIAN: 129.271112368903,
	  MEAN: (129.271112368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:30:00.000",
	  Q3: 130.1112368903,
	  MAX: 133.01112368903,
	  MIN: 125.091112368903,
	  Q1: 127.391112368903,
	  MEDIAN: 129.271112368903,
	  MEAN: (129.271112368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:35:00.000",
	  Q3: 125.1112368903,
	  MAX: 126.01112368903,
	  MIN: 121.091112368903,
	  Q1: 122.391112368903,
	  MEDIAN: 124.271112368903,
	  MEAN: (124.21112368903 -1)
	},
	{
	  time_sample: "2019-08-01 13:40:00.000",
	  Q3: 131.1112368903,
	  MAX: 133.01112368903,
	  MIN: 122.091112368903,
	  Q1: 124.391112368903,
	  MEDIAN: 130.271112368903,
	  MEAN: 1311123689030.27
	}
  ];

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

/*
 * transform from string to array
 * expected str => eg. "[12, 32 ,3456, 7865, 345, 34]"
 */
const stringToArray = (str) => {
	try {
		// delete first and last "[ ]" and split
		return str.substring(1).slice(0, -1).split(',')
	} catch (error) {
		console.error(error)
	}
}


function Graphic() {
	const [msg, PopUpMessage]  = HandleMessage()
	const getResponse          = useSelector(state => state.getResponse)
	const monitor 			   = useSelector(state => state.monitor)
	const reload               = useSelector(state => state.reload)
	const error                = useSelector(state => state.searchErrors)
	let root // graphic root variable initialization
	// const graphicOptions = getGraphicoptions()

	const [noDataRecived, setNoDataRecived] = useState(false);
    
	/*
	 * convert to logarithm
	 */
	const convertToLogarithm = (value) => {
		try {
			if(value > 0)
				return Math.log10(value)
			return null
		} catch (error) {
			return null
		}
	}

	/*
	 * remove null entries from array
	 */
	const removeNullEntries = (array) => {
		try {
			return array.filter((el) => el !== null)
		} catch (error) {
			console.error(error)
		}
	}

	/*
	 * handle the server's values for display
	 */
	const buildGraphicValues = (date, _value, logarithm) => {
		try {
			const parseDate = parseInt(date)
			const parseValue = parseFloat(_value)
			const value_ = (logarithm)
			? convertToLogarithm(parseValue)
			: parseValue

			if (value_ === null) {
				PopUpMessage({
					type:'warning', 
					message:'Logarithm can\'t have zero or negative values, \
					all incompatible values will be ignored!! If you want to \
					avoid inconsistencies deactivate the logarithm format'
				})
				return {}
			}
			else {
				return {
					[PROCESSOR.dateField]: parseDate, 
					[PROCESSOR.numericField]: value_ 
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
			const arr_value = stringToArray(_value)
			if(Array.isArray(arr_value)) {
				const instance = {}
				const time_sample = parseInt(date)

				for (const [key, value] of Object.entries(collapseBind))
					instance[key] = parseFloat(arr_value[value])

				return { time_sample, ...instance }
			}
			else{
				PopUpMessage({
					type:'error', 
					message:'The data type is not valid!! please contact the administrator to fix this'
				})
			}
		} catch (error) {
			console.log(error)
		}
	}


	/*
	 * set columns monitor objects
	 */
	const setColumnsRowObjects = (row) => {
		try {
			const { legendTrunkName } = getGraphicoptions()
			let { name } = row
			console.log("🚀 ~ file: Graphic.js ~ line 240 ~ setColumnsRowObjects ~ name", name)
			const {
				position,
				unit,
				storagePeriod,
				summaryPeriod
			} = row

			console.log("🚀 ~ file: Graphic.js ~ line 249 ~ setColumnsRowObjects ~ legendTrunkName", legendTrunkName)
			if(legendTrunkName)
				name = name.split("/").at(-1)
			name = name + (~position) ? " /" + position : " "

			console.log("🚀 ~ file: Graphic.js ~ line 252 ~ setColumnsRowObjects ~ !~position)", !~position)
			
			const unit_abbr = (unit !== null) ? unit.abbreviature : ""

			return {
				name, unit_abbr, storagePeriod, summaryPeriod
			}
		} catch (error) {
			console.error(error)
			return ""
		}
	}

	/*
	 * create data for configuration in the chart
	 */
	const getArrangeByMonitorData = (res) => {
		try {
			const { columns, samples } = res.responseData
		
			// we remove these two fields so that the indexes of the graphical monitor options match more easily
			if(columns.at(0).name === "TimeStamp"){
				columns.shift() // delete timeStamp
				columns.shift() // delete timeStampLong
			}

			// get the index if it exists in the other array as many times as it appears
			const indexOfFrom_ = getIndexFromID(columns, monitor)
			
			return columns.map((columns_row, index) => 
			{
				// set options
				const options = monitor.at(indexOfFrom_.at(index) || 0).options
				// conf options
				const { 
					logarithm, limit_min, limit_max,
					boxplot: { isEnable, onlyCollapseValues }
				} = options

				const min_l = limit_min || -Infinity
				const max_l = limit_max || Infinity

				const _data = samples.map((sample_val) => 
				{
					const { stateOrMagnitudeValuesBind, summaryValuesBind } = columns_row
					// the chart does not support microseconds
					const date = sample_val.at(1).substring(0, sample_val.at(1).length - 3) // convert to milliseconds
					let value  = sample_val.at(index+2) // +2 => jumping timestamp and timestampLong

					if (value === "")
						return null

					if (stateOrMagnitudeValuesBind)
						value = stateOrMagnitudeValuesBind[value]

					if(summaryValuesBind && isEnable && !onlyCollapseValues)
						return buildBoxplotGraphicValues(date, value, summaryValuesBind)
					else
						return (value > min_l && value < max_l) ? buildGraphicValues(date, value, logarithm) : null
				})

				const data = removeNullEntries(_data)
				return { ...setColumnsRowObjects(columns_row), ...options, data }
			})
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
   *  Chart init
   *   - When the component is mounted, the root is initialized, since responseData is empty for the moment nothing is shown
   +   - When the responseData subscriber receives the data the function is executed again, the change of [responseData] will trigger the update of the function.
   *       - the same for [reload] the function will be updated with the new data
   +   - The root element of amchart cannot be duplicated, we avoid this by using the 'retun () => {...}' method to execute the 'dispose()' when the component is unmount
   */
useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    root = am5.Root.new("chartdiv") // Create root element =ref=> <div id="chartdiv"></div>
    root.fps = 40

	if (error || getResponse.length === 0)
		setNoDataRecived(false)
	else
	{
		if (getResponse.responseData.samples.length > 0 || getResponse.responseData.reportInfo.totalPages > 1)
		{
			root.setThemes(getRootTheme())
			const graphicData = getArrangeByMonitorData(getResponse)
			
			if(graphicData !== undefined)
			{
				generateGraphic(graphicData)
				setNoDataRecived(false)
			}
			else{
				PopUpMessage({
					type:'error', 
					message:'The data could not be processed, please contact the administrator to fix this.'
				})
			}
		}
		else {
			setNoDataRecived(true)
			$("#initialImg").addClass('display-none')
		}
	}

	
    // store current value of root and restore root element when update
    root.current = root
    return () => {
      	root.dispose()
    }
}, [getResponse, reload, error])


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
 * Calculate scale base count 
 */
const getMillisecondBaseCount = (info) => {
	let totalSum = 0;
	const globalSampling = getResponse.sampling_period
	const totalLength = info.length
	if (globalSampling === 0)
	{
		for (let n = 0; n < info.length; n++)
		{
			const period = info[n].summaryPeriod || info[n].storagePeriod

			const ifsampling = (period === "") ? 2000000 : period
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
			labelText: `[bold]${name}[/]\n[bold]{valueX.formatDate('${FORMATER.dateFormat}')}[/]\n${PROCESSOR.highValueField}: {highValueY}\n${PROCESSOR.q3ValueField}: {openValueY}\n${PROCESSOR.meadianValueField}: {MEDIAN}\n${PROCESSOR.q1ValueField}: {valueY}\n${PROCESSOR.lowValueField}: {lowValueY}`
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
			// name: PROCESSOR.meadianValueField,
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
// const addMeanSeriesDefaultConf = (props) => {
// 	let meanSeries = props.chart.series.push(
// 		am5xy.StepLineSeries.new(root, {
// 			stroke: "#d1d8d9",
// 			// name: "josué " +PROCESSOR.meanValueField,
// 			xAxis: props.dateAxis,
// 			yAxis: props.valueAxis,
// 			valueYField: PROCESSOR.meanValueField,
// 			valueXField: PROCESSOR.dateField,
// 			noRisers: true
// 		})
// 	)
// 	meanSeries.strokes.template.setAll({
// 		strokeDasharray: [2, 2],
// 		strokeWidth: 2
// 	})
// 	return meanSeries
// }

/*
 * get series
 */
const getSeries = (props, data) => {
	try {
		let config
		const isBoxplotEnabled = data?.boxplot?.isEnable
		const onlyCollapseValues = data?.boxplot?.onlyCollapseValues
		const seriesType = data.graphicType

		if(isBoxplotEnabled && !onlyCollapseValues)
			config = boxplotSeriesConfiguration(data.name)
		else
			config = seriesConfiguration(data)
		
		config["xAxis"] = props.dateAxis
		config["yAxis"] = props.valueAxis

		if(isBoxplotEnabled && !onlyCollapseValues)
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

/*
 * calculate median for the graphic date baseInterval
 */
const baseIntervalmedian = (info) => {
	const globalSampling = getResponse.sampling_period
	if(globalSampling === 0)
	{
		const arr = info.map(strg => Math.trunc(strg.storagePeriod)/1000)
		arr.sort((a,b) => a-b);
		const l=arr.length;
		return l%2===0
			? arr.slice(l/2-1, l/2+1).reduce((a,b) => a+b)/2
			: arr.slice((l/2), l/2+1)[0];
	}
	else
	{
		return globalSampling / 1000
	}
}

//----------------------------------------Generate Graphic-----------------------------------------------------

const generateGraphic = (info) =>{
   	// Initialize variables for chart
	let [chart, dateAxis, valueAxis, series, legend, scrollbarX, scrollbarY] = [] // [] => this represents undefined
	// Initialize variables for general options
	// const generalOptions 	 = getGraphicoptions()
	// const { grid, limitMIN, limitMAX, groupData, microTheme, legends, legendContainerPos } = generalOptions

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
    })

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
    )

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
    }))

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
		if(data_?.boxplot.isEnable && !data_?.boxplot.onlyCollapseValues){
			addMedianSeriesDefaultConf(graphProps).data.setAll(data_.data)
			// addMeanSeriesDefaultConf(graphProps).data.setAll(data_.data)
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
			legend = chart.bottomAxesContainer
			.children.push(am5.Legend.new(root, legendSettings)) 
		}
    	else { 
			legend = chart.rightAxesContainer
			.children.push(am5.Legend.new(root, legendSettings)) 
		}

		// TODO: NOT_WORKING: el evento hover salta un excepción con el tipo de gráfica boxplot
		if(false){
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
		}

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
	}))

	/*
	 * if microTheme is active
	 */
	if (microTheme) {
		valueAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}));

		dateAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}))
	}

	/*
	 * Set Zoom ScrollBar
	 */
	// Horizontal Zoom
	scrollbarX = am5.Scrollbar.new(root, {
		orientation: "horizontal",
		exportable: false
	})
	chart.set("scrollbarX", scrollbarX);
	// chart.bottomAxesContainer.children.push(scrollbarX);

	// Vertical Zoom
	scrollbarY = am5.Scrollbar.new(root, {
		orientation: "vertical",
		exportable: false
	})
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
	})
} // end generateGraphic




	return(
		<div className="display-grafic-section">
			<div id="chartdiv" className="grafic-box">

			{/* The Graphic will be display here  => id="chartdiv"*/}
			<InsertChartIcon id="initialImg" className="display-none" />

			{
			(error) ? 
				<div className="server-error-error-message"> 
					<NearbyErrorIcon className="icon-server-error error-icon error-color" />
					<p>An error has ocurred!</p>
					<p>If the error persist</p>
					<p>please contact the administrators.</p>
				</div>
			:
			(noDataRecived) ?
				<div className="no-data-error-message">
					<LiveHelpIcon className="icon-no-data help-icon" />
					<MoreHorizIcon className="icon-no-data dot-icon" />
					<p>No Data Available.</p>
					<p>Try to use a different date range or a different Monitor.</p>
				</div>
			: ""
			}
			</div>
		</div>
	);
}

export default Graphic;