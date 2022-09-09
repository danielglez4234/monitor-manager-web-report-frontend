import React, { useState, useEffect }  from 'react';
import * as $                from 'jquery';
import { getDataFromServer } from '../../../services/services';
import moment                 from 'moment';
import { DatePicker }         from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	hadleSearch,
	setloadingButton,
	loadGraphic,
	setSamples,
	setTotalResponseData,
	getUrl,
	setActualPage,
	setSearchErrors
}
from '../../../actions';
import LoadingButton                            from '@mui/lab/LoadingButton';
import {Stack, MenuItem, FormControl, Select }  from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import ArrowRightIcon            from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon             from '@mui/icons-material/ArrowLeft';
// import StopCircleIcon            from '@mui/icons-material/StopCircle';
import DownloadEmailData from './DownloadData/DownloadEmailData';
// import AdvancedOptions from './AdvancedOptions';
import SaveQuery     	 from './StroreQuerys/SaveQuery';
import ViewHandleQuery 	 from './StroreQuerys/handleQuerys/ViewHandleQuery';
import FavoriteQueries	 from './FavoriteQueries/FavoriteQueries'
import HandleMessage      from '../../handleErrors/HandleMessage';
import buildUrl		 	 from './buildUrl';
import { usesTyles } from '../../../commons/uiStyles/usesTyles';


const { REACT_APP_IDISPLAYLENGTH } = process.env

/*
 * Hide Component and monitor list
 */
const hideAndShowSection = () => {
	$('.perform-query-section').toggleClass('hide-sections')
	$('.arrow-showPerfomSection').toggleClass('hide-sections')
}

function PerformQuery() {
	const classes = usesTyles()
	const dispatch             = useDispatch()
	const [msg, PopUpMessage] = HandleMessage()

	const monitor          = useSelector(state => state.monitor)
	const loadWhileGetData = useSelector(state => state.loadingButton)
	const pagination       = useSelector(state => state.pagination)
	const editing 	   	   = useSelector(state => state.editingQuery)

	const [loadingSearch, setLoadingSearch] = useState(false)
	const [beginDateInput, setBeginDateInput] = useState("")
	const [endDateInput, setEndDateInput] = useState("")
	
	const [timeQuery, setTimeQuery] = useState({
		beginDate: "",
		endDate: "",
		sampling: 0
	})

	// TODO: temporal
	const [addItem, setAddItem] = useState(null)
	
	/*
	 * 'loadWhileGetData' will be set to true when the data has arrived, and then the buttons will be active again
	 */
	useEffect(() => {
		if (loadWhileGetData)
			setLoadingSearch(false)
	}, [loadWhileGetData])

	/*
	 * set a sampling if specified
	 */
	useEffect(() => {
		setTimeQuery(prevState =>({
			...prevState,
			sampling: (editing?.active && editing?.sampling) ? editing.sampling : 0
		}))
	}, [editing])

	/*
	 * Get Samples From Server
	 */
	const getSamplesFromServer = async () => {
		const url = buildUrl(monitor, timeQuery, pagination) // construct url
		dispatch(getUrl(url)) // refactor => eliminar
		
		await Promise.resolve( getDataFromServer(url) )
		.then(res => { 
			const totalArraysRecive  = res.samples.length
			const totalRecords       = res.reportInfo.totalSamples
			const totalPerPage       = REACT_APP_IDISPLAYLENGTH

			dispatch(setSamples(res, timeQuery.sampling))
			dispatch(setTotalResponseData(totalArraysRecive, totalRecords, totalPerPage))
			dispatch(setSearchErrors(false))
			console.log(`\
				MonitorsMagnitude Data was recibe successfully!!\n \
				Sampling Period Choosen: ${timeQuery.sampling} microsegundos\n \
				Arrays Recived: ${totalArraysRecive}\n \
				total Records: ${totalRecords}\n \
				----------------------------------------------------------------`
			)
		})
		.catch(error => {
			const error_message = (error.response?.data) ? error.response.data.toString() : "Unsupported error";
			const error_status = (error.response?.status) ? error.response.status : "Unknown"
			dispatch(setSearchErrors(true))
			PopUpMessage({type:'error', message:'Error: '+error_message+" - Code "+error_status})
			console.error(error)
		})
		.finally(() => {
			dispatch(setloadingButton(true))
			dispatch(loadGraphic(false))
		})
	}

	/*
	 * handle  search inputs onchange
	 */
	const onChange = (date, value, dateFieldName) => {
		try {
			setTimeQuery(prevState => ({
				...prevState,
				[dateFieldName]: value
			}))
			if(dateFieldName === "beginDate") // antDesign input string format date
				setBeginDateInput(date) 
			else if(dateFieldName === "endDate")
				setEndDateInput(date)
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
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
	 * dispatch acction if submit was correct
	 */
	const dispatchActionsOnSubmit = () => {
		try {
			const perform = true; // initial state use to check searched monitors selected comparation
			const searchedMonitors = monitor.map(e => e["id"]) // save the monitors id's that where choosen for the search
	
			dispatch(setActualPage(false, 0, 0)) // reset pagination if it is already display
			dispatch(hadleSearch(perform, timeQuery.beginDate, timeQuery.endDate, timeQuery.sampling, searchedMonitors))
			dispatch(setloadingButton(false))
			dispatch(loadGraphic(true))
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * Check Dates and sampling inputs before submit
	 */
	const checkOnSubmit = (button_click) => {
		// convert to unix 
		// we use this to get a better control over the correct validation of the dates
		const unixBeginDate = convertToUnix(timeQuery.beginDate)
		const unixEndDate = convertToUnix(timeQuery.endDate)

		// handle all errors from the date inputs
		if (timeQuery.beginDate === '' || timeQuery.endDate === ''){
			PopUpMessage({type:'warning', message:'The Date Fields cannot be empty'})
			return false
		}
		else if (unixBeginDate > unixEndDate){
			PopUpMessage({type:'warning', message:'The begin Date cannot be greater than end Date'})
			return false
		}
		else if (timeQuery.beginDate === timeQuery.endDate){
			PopUpMessage({type:'warning', message:'The begin and end Date cannot be the same'})
			return false
		}
		else if (monitor[0] === undefined){
			PopUpMessage({type:'warning', message:'There are no selected monitors'})
			return false
		}
		else{
			if(button_click !== "download"){ // refactor llamar buildUrl desde download
				setLoadingSearch(true)
				dispatchActionsOnSubmit()
				getSamplesFromServer()
			}
			else{
				return buildUrl(monitor, timeQuery, pagination, true) // true to identified download
			}
			return true
		}
	}


	/*
	 * TODO: temporal => cuendo se tenga una tabla dedicada esto se borrara
	 */
	const addItemtoLocalStorage = (items) => {
		setAddItem(items)
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
							onChange={(date, dateString) => {onChange(date, dateString, "beginDate")}}
						/>
						<DatePicker
							id="endDate"
							showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
							format="DD/MM/YYYY HH:mm:ss"
							placeholder="End Date"
							value={endDateInput}
							onChange={(date, dateString) => {onChange(date, dateString, "endDate")}}
						/>
					</div>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<Select
							className="select-sampling-perform-query"
							value={timeQuery.sampling}
							onChange={(e) => {onChange(null, e.target.value, "sampling")}}
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
								// className={classes.perfrom_query_button_search}
								className="perfrom-query-button-search"
								variant="contained"
								startIcon={<PlayCircleFilledWhiteIcon/>}
							>
								Search & Display
							</LoadingButton>
						</div>

						{ // Only_Download data component // TODO: change file name
							<DownloadEmailData
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
											addItemtoLocalStorage={addItemtoLocalStorage}
										/>
								}
						</Stack>
					</div>
				</div>
					<FavoriteQueries 
						addItem={addItem}
					/>
			</div>
		</>
    );

}
export default PerformQuery;
