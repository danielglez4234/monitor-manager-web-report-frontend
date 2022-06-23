import React, { useEffect, useRef, useState }  from 'react';

import { useSelector }    from 'react-redux';
import getGraphicoptions  from './getGraphicoptions';
import * as $             from 'jquery';
import { useSnackbar }    from 'notistack';

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Micro    from "@amcharts/amcharts5/themes/Micro";
import * as am5exporting  from "@amcharts/amcharts5/plugins/exporting";
import * as am5           from "@amcharts/amcharts5";
import * as am5xy         from "@amcharts/amcharts5/xy";
import * as d3            from "d3-shape";
// import * as am5pie        from "@amcharts/amcharts5/percent";

import InsertChartIcon    from '@mui/icons-material/InsertChart';
import LiveHelpIcon       from '@mui/icons-material/LiveHelp';
import MoreHorizIcon      from '@mui/icons-material/MoreHoriz';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';

import PopUpMessage from '../../../handleErrors/PopUpMessage';
import { ConstructionOutlined } from '@mui/icons-material';



/*
 * get the index of the element of the second array that matches it
 */
const getIndexFromID = (fromArray, inArray) => {
	const result = []
	fromArray.map((val) => {
		const index = inArray.map(object => object.id).indexOf(val.id)
		if(index !== -1)
			result.push(index)
	})
	return result
}


function Graphic() {
	const [msg, handleMessage] = PopUpMessage();
	const getResponse          = useSelector(state => state.getResponse);
	const monitor 			   = useSelector(state => state.monitor)
	const reload               = useSelector(state => state.reload);
	const searchErrors         = useSelector(state => state.searchErrors);

	const [nodataRecive, setNodataRecive] = useState(false);
	const [error, setError] = useState(false);

	/*
	 * if data search error is send
	 */
	useEffect(() => {
		setError(searchErrors)
   	}, [searchErrors])

   	/*
	 * handle tranform value from server for display
	 */
	const buildGraphicValues = (date, _value, logarithm) => {
		const time_sample = parseInt(date)
		const value = (logarithm) ? Math.log10(parseFloat(_value)) : parseFloat(_value)
		if (logarithm && value === 0 || isNaN(value)) {
			handleMessage({ 
				message: 'Error: Logarithm can\'t have zero values, disabled the Logarithm option and click reload', 
				type: 'error', 
				persist: false,
				preventDuplicate: true
			});
		}
		else{
			return { time_sample, value }
		}
	}

	/*
	 * create data for configuration in graphic
	 */
	const arrangeData = (res) => {
		try {
			const columns_ = res.responseData.columns
			const samples_ = res.responseData.samples
			const graphicOptions = getGraphicoptions()
		
			const info_ = []
			// we delete this two fields to match the monitor graphic options indexes more easely
			if(columns_[0].name === "TimeStamp"){
				columns_.shift() // delete timeStamp
				columns_.shift() // delete timeStampLong
			}
			const indexOfFrom_ = getIndexFromID(columns_, monitor)
			columns_.map((columns_row, index) => {
				const optionsIndex = indexOfFrom_[index]
				const options = (optionsIndex !== undefined) ?  monitor[optionsIndex].options : monitor[0].options
		
				const dateAndSamples_ = []
				samples_.map((sample_val) => {
					const date = sample_val[1].substring(0, sample_val[1].length - 3)
					let value  = sample_val[index+2] // +2 => jumping timestamp and timestampLong
					
					const isMagnuted = columns_row.stateOrMagnitudeValuesBind
					if (value !== ""){
						if (typeof isMagnuted !== "undefined" && isMagnuted !== null){
							value = isMagnuted[value]
						}
						const min_l = (options.limit_min === "") ? -Infinity : options.limit_min
						const max_l = (options.limit_max === "") ? Infinity  : options.limit_max
						if (value > min_l && value < max_l){
							dateAndSamples_.push( buildGraphicValues(date, value, options.logarithm) )
						}
					}
				})
				let unit_abbr = ""
				let sTitle = columns_row.sTitle
				if(graphicOptions.general.legendTrunkName){
					sTitle = sTitle.split("/")
					sTitle = sTitle[sTitle.length - 1]
				}
				if(columns_row?.unit !== null){ 
					unit_abbr = columns_row.unit.abbreviature 
				}
				const position = (columns_row.position === -1) ? " " : " /" + columns_row.position 
				const data = {
					sTitle: sTitle,
					name: sTitle + position,
					unit_abbr: unit_abbr,
					data: dateAndSamples_,
					sampling_period: columns_row.storagePeriod
				}
				info_.push({...data, ...options})
			})
			return info_
		} catch (error) {
			console.log(error)
		}
	}



  /*
   *  Chart initialization
   *  this function do tree mainly things:
   *    - When the component mount root is initialize, since responseData is empty at the moment nothing is display
   *    - When responseData suscribtion recive the data the function role again, the change of [responseData] trigger the update of the function
   *        - same for [reload] it will update the function with the new _propertiesChange
   *    - The root element from amchart can't be duplicate, we avoid that using the method 'retun () => {...}' to execcute the 'dispose()' when the component unmount
   *
   * this function do as like the componentDidMount, componentDidUpdate and componentWillUnmount at the same time.
   *
   */
let root;

useEffect(() => {
    root = am5.Root.new("chartdiv") // Create root element =ref=> <div id="chartdiv"></div>
    root.fps = 40

	if (getResponse.length === 0)
	{
		setNodataRecive(false)
	}
	else
	{
		if(!getResponse.responseData?.samples)
		{
			setNodataRecive(true)
			$("#initialImg").addClass('display-none')
		}
		else if (getResponse.responseData.samples.length > 0)
		{
			const graphicOptions = getGraphicoptions()

			const setThemes = []
			if (graphicOptions.general.animations) { setThemes.push(am5themes_Animated.new(root)) }
			if (graphicOptions.general.microTheme) { setThemes.push(am5themes_Micro.new(root)) }
			root.setThemes(setThemes)

			const sampling_period = getResponse.sampling_period
			const graphicData = arrangeData(getResponse)

			if(graphicData !== undefined)
			{
				generateGraphic(graphicData, graphicOptions, sampling_period)
				setNodataRecive(false)
			}
			else
			{
				handleMessage({ 
					message: "Este error no debería aparecer. contacta al administrador!!", 
					type: 'error', 
					persist: false,
					preventDuplicate: true
				})
			}
		}
		else
		{
			setNodataRecive(true)
		}
	}

    // store current value of root and restore root element when update
    root.current = root
    return () => {
      	root.dispose()
    }
  }, [getResponse, reload]);



//----------------------------------------Generate Graphic-----------------------------------------------------

const generateGraphic = (info, generalOptions, sampling_period) =>{
    /*
     * Initialize variables for chart
     */
    let chart;
    let xRenderer;
    let dateAxis;
    let yRenderer;
    let valueAxis;
    let series;
    let legend;
    let scrollbarX;
    let scrollbarY;
    let exporting;


    /*
     * Set Root format number for the values recived based if the number is integrer or not
     */
    // let ifFormat = (generalOptions.general.numberFormat !== "") ? generalOptions.general.numberFormat : "#";
    const sciNotation = (generalOptions.general.scientificNotation) ? "e" : "";
    root.numberFormatter.setAll({
		numberFormat: "#" + sciNotation,
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
			// focusable: true,
			panY: false,
			wheelY: "zoomX",
			maxTooltipDistance: 0
		})
    );

    /*
     * Add Value Y Axis
     * format suported -> 5e-7 or 0.0000005, 450000 or 45e+4
     * ***WARNING*** on this version the exponential format is up to 7, this wont work on the plugin: 1e-8, +etc...
     */
    yRenderer = am5xy.AxisRendererY.new(root, {
		opposite: false,
    });
    // hide grid
    if (!generalOptions.general.grid) {
      	yRenderer.grid.template.set("visible", false);
    }
    valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		// logarithmic: true,
		extraTooltipPrecision: 1,
		min: generalOptions.general.limitMIN,
		max: generalOptions.general.limitMAX,
		renderer: yRenderer
    }));

    /*
     * Add Date X Axis
     */
    xRenderer = am5xy.AxisRendererX.new(root, {
		minGridDistance: 100,
    });
    // hide grid
    if (!generalOptions.general.grid) {
      	xRenderer.grid.template.set("visible", false);
    }

    /*
     * Calculate tooltip 
     */
    let millisecondBaseCount;
    let totalSum = 0;
    const totalLength = info.length;
    if (sampling_period === 0) 
    {
		for (let n = 0; n < info.length; n++) 
		{
			const ifsampling = (info[n].sampling_period === "") ? 2000000 : info[n].sampling_period;
			const numSampling = Math.trunc(ifsampling) / 1000; // tranform to milliseconds
			totalSum += numSampling;
		}
		millisecondBaseCount = totalSum / totalLength; 
    }
    else 
    {
      	millisecondBaseCount = sampling_period / 1000;
    }
    /*
     * Set the value representation format and set the count interval for data 
     */
    dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		groupData: generalOptions.general.groupData,
		maxDeviation: 0,
		baseInterval: {
			timeUnit: "millisecond",
			count: millisecondBaseCount
		},
		renderer: xRenderer
    }));

    /*
     * Format the date depending on the time unit is showing
     */
    dateAxis.get("dateFormats")["millisecond"] = "HH:mm:ss.SSS";

    /*
     * We Create an empty series to generate the 'toggle All' legend
     */
    // series = chart.series.push(am5xy.LineSeries.new(
    //   root, { name: 'Toggle All', xAxis: dateAxis, yAxis: valueAxis }
    // ));

    /*
     * --- --- --- --- --- --- Add All series --- --- --- --- --- --- ---
     */
     /*
      * Set properties configuration to a series function
      */
     const  configuration = (info) => {
		let properties = {
			name: info.name,
			connect: !generalOptions.general.connect,
			xAxis: dateAxis,
			yAxis: valueAxis,
			valueYField: "value",
			valueXField: "time_sample",
			calculateAggregates: true,
			legendLabelText: "{name}: ",
			legendRangeLabelText: "{name}: ",
			legendValueText: "[bold]{valueY}",
			legendRangeValueText: "{valueYClose}",
			minBulletDistance: 10
		}
		let setTooltip = am5.Tooltip.new(root, {
			exportable: false,
			pointerOrientation: "horizontal",
			labelText: `[bold]{name}[/]\n{valueX.formatDate('yyyy-MM-dd HH:mm:ss.SSS')}\n[bold]{valueY}[/] ${info.unit_abbr}`
		});
		if (generalOptions.general.tooltip) { properties["tooltip"] = setTooltip };
		if (info.curved) { properties["curveFactory"] = d3.curveBumpX };
		if (info.color) {
			properties["stroke"] = am5.color(info.color);
			properties["fill"] = am5.color(info.color);
		};
		return properties;
     }

	/*
	 * Create series
	 */
	for (let y = 0; y < info.length; y++) {
		/*
		 * Set Graphic type all call configurations function
		 */
		let graphtype = info[y].graphic_type;
			if (graphtype === "Line Series") {
			series = chart.series.push(am5xy.LineSeries.new(root, configuration(info[y])));
		}
		else if(graphtype === "Step Line Series") {
			series = chart.series.push(am5xy.StepLineSeries.new(root, configuration(info[y])));
		}
		else if(graphtype === "Vertical Bar Series") {
			series = chart.series.push(am5xy.ColumnSeries.new(root, configuration(info[y])));
		}
		else if(graphtype === "Candel Sticks Series") {
			series = chart.series.push(am5xy.LineSeries.new(root, configuration(info[y])));
		}
		else {
			series = chart.series.push(am5xy.LineSeries.new(root, configuration(info[y])));
		}

		/*
		 * Set Series line weight and dasharray view
		 */
		let handleStroke;
		let stroke = info[y].strokeWidth;
		if      (stroke === "Medium") { handleStroke = 2 }
		else if (stroke === "Light")  { handleStroke = 1 }
		else if (stroke === "Bold")   { handleStroke = 3 }
		else if (stroke === "Bolder") { handleStroke = 4 }
		else { handleStroke = 1 }

		let handleCanvasArray;
		let caNv = info[y].canvasWidth;
		if      (caNv === "Dotted")        { handleCanvasArray = ["1"] }
		else if (caNv === "Dashed")        { handleCanvasArray = ["3","3"] }
		else if (caNv === "Large Dashed")  { handleCanvasArray = ["10"] }
		else if (caNv === "Dotted Dashed") { handleCanvasArray = ["10", "5", "2", "5"] }
        else { handleCanvasArray = false }

		/*
		 * Set Stroke
		 */
		series.strokes.template.setAll({
			strokeWidth: handleStroke,
			strokeDasharray: handleCanvasArray
		});

		/*
		 * Set filled
		 */
		if (info[y].filled) {
			series.fills.template.setAll({
				visible: true,
				fillOpacity: 0.3
			});
		}

		/*
		 * Set bullets
		 */
		if (info[y].dotted) {
			series.bullets.push(function() {
				return am5.Bullet.new(root, {
				sprite: am5.Circle.new(root, {
					radius: 1.5,
					fill: "#333"
				})
				});
			});
		}

		/*
		 * Set Data to the Series
		 */
		// Set up data processor to parse string dates
		series.data.processor = am5.DataProcessor.new(root, {
			dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
			dateFields: ["time_sample"]
		});
		series.data.setAll(info[y].data);
		//  series.data.setAll(dataTest);

    } // --- --- --- --- --- end for 'info.length' --- --- --- --- --- --- ---

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
    let legendHeight;
    if (info.length === 1 || info.length === 2) { legendHeight = 50  }
    else if (info.length === 3) { legendHeight = 80 }
    else if (info.length === 4) { legendHeight = 110 }
    else { legendHeight = 150 }

    /*
     * Set legends to the chart
     */
    // if (generalOptions.general.legends) {
    if (generalOptions.general.legends) {
		let legendSettings = {
			width: am5.percent(100),
			height: legendHeight,
			verticalScrollbar: am5.Scrollbar.new(root, {
				orientation: "vertical"
			})
		}

      	if (generalOptions.general.legendContainerPos) { legend = chart.bottomAxesContainer.children.push(am5.Legend.new(root, legendSettings)) }
    	else { legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, legendSettings)) }

		// When legend item container is hovered, dim all the series except the hovered one
		legend.itemContainers.template.events.on("pointerover", function(e) {
			let itemContainer = e.target;
			// As series list is data of a legend, dataContext is series
			let series = itemContainer.dataItem.dataContext;

			chart.series.each(function(chartSeries) {
			if (chartSeries != series) {
				chartSeries.strokes.template.setAll({
					strokeOpacity: 0.15,
					stroke: am5.color(0x000000)
				});
			} else {
				chartSeries.strokes.template.setAll({
					// strokeWidth: 3
				});
			}
			})
		})

		// When legend item container is unhovered, make all series as they are
		legend.itemContainers.template.events.on("pointerout", function(e) {
			let itemContainer = e.target;
			let series = itemContainer.dataItem.dataContext;

			chart.series.each(function(chartSeries) {
			chartSeries.strokes.template.setAll({
				strokeOpacity: 1,
				// strokeWidth: 1,
				stroke: chartSeries.get("fill")
			});
			});
		})
		// align legends content in the container
		legend.itemContainers.template.set("width", am5.p100);
		legend.valueLabels.template.setAll({
			width: am5.p100,
			textAlign: "left"
		});
		// It's is important to set legend data after all the events are set on template, otherwise events won't be apply
		legend.data.setAll(chart.series.values);
		// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    }


	/*
	* Set Cursor XY on the chart
	*/
	chart.set("cursor", am5xy.XYCursor.new(root, {
		behavior: "zoomX",
		xAxis: dateAxis
	}));


	if (!generalOptions.general.microTheme) {
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
	exporting = am5exporting.Exporting.new(root, {
		menu: am5exporting.ExportingMenu.new(root, {}),
		// dataSource: getResponse.responseData.samples,
		numericFields: ["value"],
		dateFields: ["time_sample"],
		dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
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

			{/*
			Initial Return State to 'ListSelectedMonitors',
			the class of 'initialImg' is remove onces when the component 'ListSelectedMonitors' mounts, then When
			the useEffect is updated here it will lose this propertie and the display-none class will be set again by default
			resulting in that it will never show up a second time
			*/}
			<InsertChartIcon id="initialImg" className="display-none" />
			{/* --- --- --- */}
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
						{/* <MoreHorizIcon className="icon-no-data dot-icon" /> */}
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