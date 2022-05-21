// --- React dependencies
import React, { useState, useEffect } from 'react';

// --- Dependencies
import * as $  from 'jquery';
import { getDataFromServer } from '../../../services/services';

import {
	useDispatch,
	useSelector
} from 'react-redux';

import {
	reloadGrafic,
	loadGraphic,
	setloadingButton,
	setTotalResponseData,
	setActualPage,
	setSamples,
	getUrl
} from '../../../actions';

import loadingSls    from '../../../commons/img/loadingSls.svg';

// --- Model Component elements
import {
	Stack,
	Button,
	Pagination,
	LinearProgress
} from '@mui/material';

// --- Icons
import ReplayIcon                   from '@mui/icons-material/Replay';
import ArrowDropUpIcon              from '@mui/icons-material/ArrowDropUp';

// --- React Components
//import MenuGraficOrTable from './MenuGraficOrTable';
import Graphic              from './Graphic/Graphic';
import MonitorList			from './SelectedMonitor/MonitorList';
import SelectedElement      from './SelectedMonitor/SelectedElement';
import ButtonGeneralOptions from './OptionsBarSection/ButtonGeneralOptions';
import PopUpMessage         from '../../handleErrors/PopUpMessage';
import ButtonMagnitudeReference from './OptionsBarSection/ButtonMagnitudeReference'
// import RangeThresholdsOptions from './OptionsBarSection/RangeThresholdsOptions';





function ListSelectedMonitor(props) {
	const dispatch             = useDispatch();
	const [msg, handleMessage] = PopUpMessage();

	const monitor           = useSelector(state => state.monitor);
	const getResponse       = useSelector(state => state.getResponse);
	const onSearch          = useSelector(state => state.onSearch);
	const totalResponseData = useSelector(state => state.totalResponseData);

	const graphicStillLoading = useSelector(state => state.loadingButton);
	const loadingGraphic      = useSelector(state => state.loadingGraphic);

	// pagination
	let url            = useSelector(state => state.url);
	const pagination   = useSelector(state => state.pagination);
	const [disabled, setDisabled]         = useState(true);

	const [startloadingGraphic, setStartloadingGraphic]   = useState(false);

	const [page, setPage]                             = useState(1);
	const [totalPages, setTotalPages]                 = useState(0);
	const [activatePagination, setActivatePagination] = useState(false);
	const [loadingPage, setLoadingPage]               = useState(false);
	const [totalPerPage, setTotalPerPages]            = useState(0);

	const [infoSamplesByPage, setInfoSamplesByPage]   = useState(0);
	const [infoTotalSamples, setInfoTotalSamples]     = useState(0);



  /*
   * Update reload button when 'loadingbutton' and 'responseData'states changes
   */
	useEffect(() => {
		if(graphicStillLoading)
		{
			if (getResponse?.responseData?.samples.length > 0)
			{
				const totalPages   = getResponse.responseData.iTotalPages
				const totalSamples = getResponse.responseData.iTotalSamples
				const totalDisplay = getResponse.responseData.iTotalDisplaySamplesByPage
				const totalPerPage = totalResponseData.totalPerPage 
				// info display
				setInfoSamplesByPage(totalDisplay)
				setInfoTotalSamples(totalSamples)
				// set pagination
				setTotalPages(totalPages)
				setTotalPerPages(totalPerPage)
				setPage(1) // default page
				setDisabled(false)
				setActivatePagination((totalPages <= 1) ? false : true)
			}
			else 
			{
				setDisabled(true)
				setTotalPages(0)
				setInfoSamplesByPage(0)
				setInfoTotalSamples(0)
			}
		}
	}, [graphicStillLoading])

	/*
	 * Show the loading icon for graphic when the loadingGrahic state changes
	 */
	useEffect(() => {
		setStartloadingGraphic(loadingGraphic)
		if(loadingGraphic)
		{
			setDisabled(true)
		}
	}, [loadingGraphic])


	/*
	 * If perform is true the monitors selected 'id' will be stored,
	 + This will reset the 'reset_button' to 'active' if it returns to
	 + the original state of the monitors selected when the search was made
	 */
	useEffect(() => {
		if (getResponse?.responseData && onSearch?.perform && monitor.length > 0)
		{
			let monitorLastState    = onSearch.searchedMonitors
			let monitorsNowSelected = monitor.map(e => e.monitorData["id"])
			// transform object to array, so we can use the every() and includes() functions
			let a = Object.values(monitorLastState)
			let b = Object.values(monitorsNowSelected)

			let comparation = b.every(function (e) {
				let val = (a.includes(e) && a.length === b.length)
				return val
			});

			// if they match disable is set to false
			if (!loadingGraphic){ // if the graphic is loading dont compare
				setDisabled(!comparation)
			}
		}
	}, [monitor, onSearch, getResponse])


   	/*
     * Handle graphic Info OPEN popover
     */
    const handleClickOpenInfo = () => {
		$('.totalRecord-button-close_rangeZone').toggleClass('display-none')
		$('.totalRecord-button-Popover ').toggleClass('display-none')
    };


	/*
	 * Handle pagination input value
	 */
	const handleChange = (event, value) => {
		setPage(value)
		dispatch(setActualPage(activatePagination, totalPerPage, value, totalPages))
	};

	/*
	 * Handle next page dataSamples
	 */
	// TODO: REFACTOR: convert to this NOTE: buscar como setear la variable disabled a true o false con estas condiciones, sin el Promise
	// useEffect(() => {
	// 	if(getResponse.length !== 0 && pagination.active)
	// 	{
	// 		if(loadingGraphic){
	// 			setLoadingPage(false)
	// 			setDisabled(false)
	// 		}else{
	// 			setLoadingPage(true)
	// 		}
	// 	}
	// }, [loadingGraphic]);

	useEffect(()=>{
		if (getResponse.length !== 0 && pagination.active ) 
		{
			dispatch(loadGraphic(true))

			let iDisplayLength = pagination.displayLength
			let actualPage     = pagination.actualPage

			// let start = (actualPage * iDisplayLength) - iDisplayLength;
			let start = actualPage-1

			dispatch(setloadingButton(true))
			setLoadingPage(true)

			url = url.split('&iDisplayStart')
			url[0] += "&iDisplayStart="+ start +"&iDisplayLength="+ iDisplayLength
			url = url[0]

			console.log("url: " + props.serviceName + "WebReport/rest/webreport/search/" + url)
			dispatch(getUrl(url))

			Promise.resolve( getDataFromServer({url}) )
			.then(res => {
				const totalArraysRecive  = res.samples.length
				const totalRecords       = res.iTotalSamples
				const totalPerPage       = props.urliDisplayLength
				const sampling_period    = getResponse.sampling_period
				dispatch(setTotalResponseData(totalArraysRecive, totalRecords, totalPerPage))
					if (totalArraysRecive === 0) 
					{
						handleMessage({
							message: 'No data was collected on this page, this may happen if the monitor goes into FAULT state.', 
							type: 'default', 
							persist: true,
							preventDuplicate: false
						})
					}
					else
					{
						dispatch(setSamples(res, sampling_period))
						setInfoSamplesByPage(res.iTotalDisplaySamplesByPage)
					}
					console.log("Data recibe successfully");
				})
				.catch(error => {
					handleMessage({
						message: 'Error: Request failed with status code 500', 
						type: 'error', 
						persist: true,
						preventDuplicate: false
					})
					console.error(error)
				})
				.finally(() => {
					dispatch(setloadingButton(true))
					dispatch(loadGraphic(false))
					setLoadingPage(false)
					setDisabled(false)
					// $(".block-monitor-selected-when-searching").remove() // unlock monitor selected section
				})
		}
	},[pagination]);


	/*
	 * Check if exists magnitudes and return button component with values references
	 */
	const checkIfExistsMagnitudes = (data) => {
		let titles = []
		let references = []
		for (let a = 2; a < data.length; a++) 
		{
			if ((typeof data[a].stateOrMagnitudeValuesBind !== "undefined") && (data[a].stateOrMagnitudeValuesBind !== null))
			{
				titles.push(data[a].sTitle)
				references.push(data[a].stateOrMagnitudeValuesBind)
			}
		}
		if (references.length > 0) 
		{
			return <ButtonMagnitudeReference 
						magnitudeTitles={titles}
						magnitudeReferences={references}
					/>;
		}
	}


    return(
		<div className="grafic-section">

			{/*<MenuGraficOrTable />*/}

			<MonitorList />
			{
				(startloadingGraphic) ? 
					<div className="img-load-svg-box">
						<img src={loadingSls} alt='loading.....' className="img-load-svg" /> 
					</div>
				: 
					<Graphic />
			}


		<div className="grafic-options-section">
			<div className="cover_amchart5-promotion"></div>

			{
				(loadingPage) ?
					<div className="loading-graphic-page-box">
						<LinearProgress className="loading-graphic-page" color="secondary" />
					</div>
				: ""
			}

			<Stack className="grafic-option-display-width" direction="row" spacing={2}>
			<div className="grafic-option-box">
				<div className="display-option-for-grafic">
					{
						<ButtonGeneralOptions />
					}
					{
						(graphicStillLoading && getResponse.length !== 0) ?
							(getResponse.responseData.length !== 0 && getResponse.responseData.samples.length > 0) ?
								checkIfExistsMagnitudes(getResponse.responseData.columns)
							: ""
						: ""
					}
					{
						// <RangeThresholdsOptions />
					}
				</div>
				{
					(startloadingGraphic && pagination?.active === false) ? "" :
					(totalResponseData.length === 0) ? "" :
					<>
					<div className="displayTotal-responseData">
						{
						(totalPages === 0 || totalPages === 1) ? "" :
						<>
							<div className="pagination-box">
								<Pagination
									id="pagination"
									count={totalPages}
									disabled={disabled}
									page={page}
									onChange={handleChange}
									showFirstButton
									showLastButton
									size="small"
									shape="rounded"
									siblingCount={1}
									boundaryCount={1}
									defaultValue={1}
								/>
							</div>
							{/* <p className="total-pages">
							Pages:  <span> { totalPages } </span>
							</p> */}
						</>
						}
					</div>
						<div className="totalRecord-button-close_rangeZone display-none" onClick={handleClickOpenInfo}></div>
						<div className="totalRecord-box">
						<Button  
							variant="contained" 
							onClick={handleClickOpenInfo} 
							className="totalRecord-button" 
							endIcon={<ArrowDropUpIcon />}
						>
							Displayed:  <span className="totalRecord-button-data"> {infoSamplesByPage.toLocaleString()} </span>
						</Button>
							<div className="totalRecord-button-Popover display-none">
							<p className="totalRecord-button-Popover-box">
								<span className="totalRecord-button-Popover-label">Displayed:</span>  
								<span className="totalRecord-button-Popover-data"> {infoSamplesByPage.toLocaleString()} </span>
							</p>
							<p className="totalRecord-button-Popover-box">
								<span className="totalRecord-button-Popover-label">Instance Of Time:</span>  
								<span className="totalRecord-button-Popover-data"> {totalResponseData.totalArrays.toLocaleString()} </span>
							</p>
							<p className="totalRecord-button-Popover-box">
								<span className="totalRecord-button-Popover-label">Total Estimated:</span> 
								<span className="totalRecord-button-Popover-data"> {infoTotalSamples.toLocaleString()} </span>
							</p>
							</div>
						</div>
					</>
				}
				<div className="grafic-option-buttons-setbox">
					<Button 
						disabled={disabled} 
						onClick={() => { dispatch(reloadGrafic(1)) }} 
						className="grafic-option-buttons grafic-option-button-save" 
						variant="contained" 
						startIcon={<ReplayIcon />}
					>
						Reload
					</Button>
				</div>
			</div>
			</Stack>
		</div>
		</div>
    );

}
export default ListSelectedMonitor;
