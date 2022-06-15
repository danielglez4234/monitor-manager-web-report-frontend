// --- React dependencies
import React, { useState, useEffect }  from 'react';

// --- Dependencies
import * as $                from 'jquery';
import { getDataFromServer } from '../../../services/services';

import moment                 from 'moment';
import { DatePicker }         from 'antd';
import 'antd/dist/antd.css';

// --- Imported functions
import { useDispatch, useSelector } from 'react-redux';
import {
	hadleSearch,
	setloadingButton,
	loadGraphic,
	setSamples,
	setTotalResponseData,
	getUrl,
	setActualPage
}
from '../../../actions';
import {
	fnIsState,
	fnIsScalar,
	fnIsArray,
	fnIsMagnitude,
	getCategory
}
from '../../standarFunctions'


// --- Model Component elements
import LoadingButton                            from '@mui/lab/LoadingButton';
import {Stack, MenuItem, FormControl, Select }  from '@mui/material';

// --- Icons
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import ArrowRightIcon            from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon             from '@mui/icons-material/ArrowLeft';
// import StopCircleIcon            from '@mui/icons-material/StopCircle';


import DownloadEmailData from './DownloadData/DownloadEmailData';
// import AdvancedOptions from './AdvancedOptions';
import SaveQuery     	 from './StroreQuerys/SaveQuery';
import ViewHandleQuery 	 from './StroreQuerys/handleQuerys/ViewHandleQuery';
import PopUpMessage      from '../../handleErrors/PopUpMessage';


const { REACT_APP_SERVER_PORT } = process.env

function PerformQuery(props) {
	const dispatch             = useDispatch();
	const [msg, handleMessage] = PopUpMessage();

	const monitor          = useSelector(state => state.monitor);
	const loadWhileGetData = useSelector(state => state.loadingButton);
	const pagination       = useSelector(state => state.pagination);
	const editing 	   	   = useSelector(state => state.editingQuery);

	const [loadingSearch, setLoadingSearch] = useState(false);
	const [beginDateInput, setBeginDateInput] = useState("");
	const [endDateInput, setEndDateInput] = useState("");
	
	const [timeQuery, setTimeQuery] = useState({
		beginDate: "",
		endDate: "",
		sampling: ""
	});

	/*
	 * Show Error
	 */
	const showErrorMessage = (mesage) => {
		handleMessage({ 
			message: mesage, 
			type: 'error',
			persist: true,
			preventDuplicate: false
		})
	}
	
	/*
	 * 'loadWhileGetData' will be set to true when the data has arrive, and then buttons will be active again
	 */
	useEffect(() => {
		if (loadWhileGetData) {
			setLoadingSearch(false);
		}
	}, [loadWhileGetData]);


	useEffect(() => {
		if(editing?.active){
			if(editing?.sampling){
				setTimeQuery({
					...timeQuery,
					sampling: editing.sampling
				})
			}
		}else{
			setTimeQuery({
				...timeQuery,
				sampling: 0
			})
		}
	}, [editing]);

  	/*
	 * Build url with monitors and place index if necessary
	 */
	const constructURL = (qs) =>{
		try {			
			let queryRest = "";
			for (let i = 0; i < monitor.length; i++)
			{
				const infoMonitor = monitor[i];
				const type = infoMonitor.type
				const id = infoMonitor.id
				const name = infoMonitor.name
				/* 
				 * magnitud("b","e"); scalar("d","f","l","s","o"); arrays("D","F","L","S","O"); doubleArrays("9","8","7","6","5");
				 * state("state");
				 */
				queryRest += "id" + getCategory(type) + "=";
				if (fnIsScalar(type))
				{
					queryRest += id;
				}
				else if (fnIsArray(type))
				{
					// Get Index
					let index = $(".Index" + id).text();
					if (index === '/') 
					{
						index = "[[-1]]";
						queryRest += id + index;
					}
					else 
					{
						index = "[" + index + "]";
						queryRest += id + index;
					}
				}
				else if (fnIsState(type))
				{
					queryRest += name;
				}
				else
				{
					showErrorMessage('Error: Type is not supported. \n Please contact the system administrator.')
				}
				if(!fnIsMagnitude(type) || !fnIsState(type))
				{
					const unit    = (infoMonitor.options.unit    !== "Default") ? infoMonitor.options.unit    : false
					const prefix  = (infoMonitor.options.prefix  !== "Default") ? infoMonitor.options.prefix  : false
					const decimal = (infoMonitor.options.decimal !== "Default") ? infoMonitor.options.decimal : false
					if (unit || decimal){
						queryRest += "{"
						if(unit){
							queryRest += "unit:" + unit
							if(prefix){
								queryRest += ",prefix:" + prefix
							}
						}
						if(decimal){
							if(unit){
								queryRest += ","
							}
							queryRest += "decimal:" + decimal
						}
						queryRest += "}"
					}
				}
				if ((i + 1) < monitor.length)
				{
					queryRest += "&";
				}
			}
			let startAt = 0;
			if ((qs?.paginating && pagination?.active) || qs?.download)
			{
				if(pagination?.actualPage && pagination?.actualPage !== 0){
					startAt = pagination.actualPage-1
				}
			}
			const beginDate = timeQuery.beginDate.replace(/\s{1}/,"@")+".000"
			const endDate 	= timeQuery.endDate.replace(/\s{1}/,"@")+".000"
			const sampling  = timeQuery.sampling
			const page 		= "page=" + startAt
			const length 	= "length=" + props.urliDisplayLength;

			const url = beginDate+"/"+endDate+"/"+sampling+"?"+queryRest+"&"+page+"&"+length;

			const action = (qs?.download) ? "download" : (qs?.query) ? "query" : "search"; // this is for log purposes
			console.log(`URL: ${window.location.href.replace('3006', REACT_APP_SERVER_PORT)}/rest/${action}/${encodeURI(url).replace(/#/g,'%23')}`);
			return url
		} catch (error) {
			console.error(error)
		}
	};


	/*
	 * Get Samples From Server
	 */
	const getSamplesFromServer = () => {
		/*
		 * we send the data to constructURL because the 'donwload button' uses only the function constructURL 
		 * to prevent it from being displayed on the graph, and then to be able to pass parameters to the function
		 */
		const url = constructURL();
		dispatch(getUrl(url));
		// server call
		Promise.resolve( getDataFromServer({url}) )
		.then(res => { 
			const totalArraysRecive  = res.samples.length;
			const totalRecords       = res.iTotalSamples;
			const totalPerPage       = props.urliDisplayLength

			dispatch(setSamples(res, timeQuery.sampling));
			dispatch(setTotalResponseData(totalArraysRecive, totalRecords, totalPerPage));
			console.log(
				"\n \
				MonitorsMagnitude Data was recibe successfully!! \n \
				Sampling Period Choosen: " + timeQuery.sampling + " microsegundos \n \
				Arrays Recived: " + totalArraysRecive + " \n \
				total Records: " + totalRecords + " \n \
				----------------------------------------------------------------"
			);
		})
		.catch(error => {
			const error_message = (error.response?.data) ? error.response.data.toString() : "Unsupported error";
			const error_status = (error.response?.status) ? error.response.status : "Unknown"
			handleMessage({ 
				message: 'Error: ' + error_message + " - Code " + error_status,
				type: 'error',
				persist: true,
				preventDuplicate: false
			})
		console.error(error);
		})
		.finally(() => {
			dispatch(setloadingButton(true));
			dispatch(loadGraphic(false));
			$(".block-monitor-selected-when-searching").remove(); // unlock monitor selected section
		})
	}


	/*
	 * get BeginDate Value
	 */
	const onChangeBeginDate = (date, dateString) => {
		setTimeQuery({
			...timeQuery,
			beginDate: dateString // string format
		})
		setBeginDateInput(date) // antDesign input format date
	}

	/*
	 * get endDate Value
	 */
	const onChangeEndDate = (date, dateString) => {
		setTimeQuery({
			...timeQuery,
			endDate: dateString // string format
		})
		setEndDateInput(date) // antDesign input format date
	}

	/*
	 * get sampling input value
	 */
	const handleChange = (event) => {
		setTimeQuery({
			...timeQuery,
			sampling: event.target.value
		})
	};
   
	/*
	 * handle warning message
	 */
	const showWarningMeggage = (message) => {
		handleMessage({ 
			message: message, 
			type: 'warning', 
			persist: false,
			preventDuplicate: false
		})
	}
   
	/*
	 * Hide Component and monitor list
	 */
	const hideAndShowSection = () => {
		$('.perform-query-section').toggleClass('hide-sections');
		$('.arrow-showPerfomSection').toggleClass('hide-sections');
	}
	
	/*
	 * Convert Date to unix
	 */
	const convertToUnix = (date) => {
		let format = date.split(" ") // split date an time
		format = format[0].split(/[-/]/).reverse().join('/') + " " + format[1] // change format to YYYY/MM/DD
		return new Date(format).getTime()
	}

	/*
	 * Check Dates and sampling inputs before submit
	 */
	const checkOnSubmit = (button_click) => {
		const perform = true; // initial state use to check searched monitors selected comparation
		
		// convert to unix 
		// we use this to get a better control over the correct validation of the dates
		const unixBeginDate = convertToUnix(timeQuery["beginDate"])
		const unixEndDate = convertToUnix(timeQuery["endDate"])

		// if sampling is not selected is set to 0 by default 
		// 0 means for the server the monitor default storage period
		if (timeQuery.sampling === "" || timeQuery.sampling  === "Default") {
			timeQuery["sampling"] = 0;
		}
		// handle all errors from the date inputs
		if (timeQuery.beginDate === '' || timeQuery.endDate === ''){
			showWarningMeggage('The Date Fields cannot be empty')
			return false
		}
		else if (unixBeginDate > unixEndDate){
			showWarningMeggage('The begin Date cannot be greater than end Date')
			return false
		}
		else if (timeQuery.beginDate === timeQuery.endDate){
			showWarningMeggage('The begin and end Date cannot be the same')
			return false
		}
		else if (monitor[0] === undefined){
			showWarningMeggage('There are no monitors selected')
			return false
		}
		else{
			if(button_click !== "download"){
				setLoadingSearch(true)
				dispatch(setActualPage(false, 0, 0)) // reset pagination if it is already display
				let searchedMonitors = monitor.map(e => e["id"]) // save the monitors id's that where choosen for the search
				dispatch(hadleSearch(perform, timeQuery.beginDate, timeQuery.endDate, timeQuery.sampling, searchedMonitors))
				dispatch(setloadingButton(false))
				dispatch(loadGraphic(true))
				/*
				 * construct the url and call the server data 
				 */
				getSamplesFromServer()
			}
			else{
				/*
				 * construct the url for download
				 */
				return constructURL({download: true})
			}
			return true
		}
	}

    return(
		<>
			<div className="arrowShowHide arrow-showPerfomSection hide-sections"><ArrowLeftIcon onClick={() => { hideAndShowSection() }} className="arrow-rightSection" /></div>
			<div className="perform-query-section">
				<div className="sample-header-perform-query">
					<Stack direction="column" spacing={1}>
					<Stack className="stack-row-components-title-buttons" direction="row">
						<p className="components-item-title">Perform Queries</p>
						<ArrowRightIcon onClick={() => { hideAndShowSection() }} className="hide_icon_componentList"/>
					</Stack>
					<div className="perform-query-date-time-picker">
						<DatePicker
							id="beginDate"
							showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
							format="DD/MM/YYYY HH:mm:ss"
							placeholder="Start Date"
							value={beginDateInput}
							onChange={onChangeBeginDate}
						/>
						<DatePicker
							id="endDate"
							showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
							format="DD/MM/YYYY HH:mm:ss"
							placeholder="End Date"
							value={endDateInput}
							onChange={onChangeEndDate}
						/>
					</div>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<Select
							className="select-sampling-perform-query"
							value={timeQuery.sampling}
							onChange={handleChange}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem disabled value="">
							<em className="default-select-sampling">Sampling</em>
							</MenuItem>
							<MenuItem value={0}>Default</MenuItem>
							<MenuItem value={100000}>100 milliseconds</MenuItem>
							<MenuItem value={200000}>200 milliseconds</MenuItem>
							<MenuItem value={500000}>500 milliseconds</MenuItem>
							<MenuItem value={1000000}>1 second</MenuItem>
							<MenuItem value={2000000}>2 seconds</MenuItem>
							<MenuItem value={5000000}>5 seconds</MenuItem>
							<MenuItem value={10000000}>10 seconds</MenuItem>
							<MenuItem value={60000000}>1 minute</MenuItem>
							<MenuItem value={120000000}>2 minutes</MenuItem>
							<MenuItem value={300000000}>5 minutes</MenuItem>
							<MenuItem value={600000000}>10 minutes</MenuItem>
							<MenuItem value={3600000000}>1 hour</MenuItem>
							<MenuItem value={7200000000}>2 hours</MenuItem>
						</Select>
					</FormControl>
					</Stack>
				</div>
				<div className="perform-query-buttons-box">
					<Stack spacing={1}>
						{ // Advance options component
						// <AdvancedOptions />
						}
						<div className="flex-row">
							<LoadingButton
								onClick={() => {
									checkOnSubmit('display');
								}}
								loading={loadingSearch}
								loadingPosition="start"
								className="perfrom-query-button-search"
								variant="contained"
								startIcon={<PlayCircleFilledWhiteIcon/>}
							>
								Search & Display
							</LoadingButton>
						</div>

						{ // Only_Download data component
							<DownloadEmailData 
								service ={props.serviceIP} 
								checkOnSubmit={checkOnSubmit}
							/>
						}

					</Stack>
				</div>
				<div className="store-query-section">
					<div className="sample-header-store-query">
						<Stack direction="column" spacing={1}>
							Store Queries
								<SaveQuery 
									convertToUnix={convertToUnix}
									timeQuery={timeQuery}
									editing={editing}
								/>
								{
									(editing?.active) ? "" :
										<ViewHandleQuery 
											constructURL={constructURL}
											editing={editing}
										/>
								}
						</Stack>
					</div>
				</div>
			</div>
		</>
    );

}
export default PerformQuery;
