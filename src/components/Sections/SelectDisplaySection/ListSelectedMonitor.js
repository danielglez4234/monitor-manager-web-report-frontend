import React, { useState, useEffect } from 'react';
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
import {
	Stack,
	Button,
	Pagination,
	LinearProgress
} from '@mui/material';
import ReplayIcon                   from '@mui/icons-material/Replay';
import ArrowDropUpIcon              from '@mui/icons-material/ArrowDropUp';

//import MenuGraficOrTable from './MenuGraficOrTable';
import Graphic              from './Graphic/Graphic';
import MonitorList			from './SelectedMonitor/MonitorList';
import ButtonGeneralOptions from './OptionsBarSection/ButtonGeneralOptions';
import PopUpMessage         from '../../handleErrors/PopUpMessage';
import ButtonMagnitudeReference from './OptionsBarSection/ButtonMagnitudeReference'
// import RangeThresholdsOptions from './OptionsBarSection/RangeThresholdsOptions';

const { REACT_APP_IDISPLAYLENGTH } = process.env

/*
 * css loading cube
 */
const cubeSpinnerImg = () => {
	return (
		<>
		   <div className="spinner">
			   <div></div>
			   <div></div>
			   <div></div>
			   <div></div>
			   <div></div>
			   <div></div>
		   </div>
		   <div className="spinner-text">Getting data...</div>
		</>
	)
}


function ListSelectedMonitor() {
	const dispatch             = useDispatch();
	const [msg, handleMessage] = PopUpMessage();

	const monitor           = useSelector(state => state.monitor);
	const getResponse       = useSelector(state => state.getResponse);
	const onSearch          = useSelector(state => state.onSearch);
	const totalResponseData = useSelector(state => state.totalResponseData);

	const graphicStillLoading = useSelector(state => state.loadingButton);
	const loadingGraphic      = useSelector(state => state.loadingGraphic);

	// pagination => todo => refactor 
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

	const [references, setReferences] = useState([]);
	const [referenceComponent, setReferenceComponent] = useState([]);



	/*
	 * Update reload button when 'loadingbutton' and 'responseData' states change
	 */
	useEffect(() => {
		if(graphicStillLoading)
		{
			if (getResponse?.responseData?.samples.length > 0)
			{
				const totalPages   = getResponse.responseData.reportInfo.totalPages
				const totalSamples = getResponse.responseData.reportInfo.totalSamples
				const totalDisplay = getResponse.responseData.reportInfo.totalDisplaySamplesByPage
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

				checkIfExistsMagnitudes(getResponse.responseData.columns)
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
	 *Show loading icon for the graph when the loadingGrahic status changes
	 */
	useEffect(() => {
		setStartloadingGraphic(loadingGraphic)
		if(loadingGraphic)
		{
			setDisabled(true)
		}
	}, [loadingGraphic])


	/*
	 *	This will reset the 'reset button' to 'active' if it returns to the original state of
	 *	the selected monitors when the search was performed. the original state of the monitors
	 * 	selected when the search was made.
	 */
	useEffect(() => {
		if (getResponse?.responseData && onSearch?.perform && monitor.length > 0)
		{
			let monitorLastState    = onSearch.searchedMonitors
			let monitorsNowSelected = monitor.map(e => e["id"])

			let a = Object.values(monitorLastState)
			let b = Object.values(monitorsNowSelected)

			let comparation = b.every(function (e) {
				let val = (a.includes(e) && a.length === b.length)
				return val
			});

			// if they match 'disabled' is set to false
			if (!loadingGraphic && getResponse.responseData.samples.length > 0) { // if the graphic is loading dont compare
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
	 * Handle next page dataSamples REFACTOR: => eliminar, llamar a funcion general
	 */
	useEffect(()=>{
		if (getResponse.length !== 0 && pagination.active ) 
		{
			dispatch(loadGraphic(true))

			const iDisplayLength = pagination.displayLength
			const actualPage     = pagination.actualPage

			let start = actualPage-1

			dispatch(setloadingButton(true))
			setLoadingPage(true)

			url = url.split('&page')
			url[0] += "&page="+ start +"&length="+ iDisplayLength
			url = url[0]

			dispatch(getUrl(url))

			Promise.resolve( getDataFromServer(url) )
			.then(res => {
				const totalArraysRecive  = res.samples.length
				const totalRecords       = res.reportInfo.totalSamples
				const totalPerPage       = REACT_APP_IDISPLAYLENGTH
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
						setInfoSamplesByPage(res.reportInfo.totalDisplaySamplesByPage)
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
				})
		}
	},[pagination]);


	/*
	 * Checks if magnitudes exist and returns the button component with the references of the values
	 */
	const checkIfExistsMagnitudes = (data) => {
		try {
			const titles = []
			const references = []
			for (let a = 2; a < data.length; a++) 
			{
				if (data[a]?.stateOrMagnitudeValuesBind !== null)
				{
					titles.push(data[a].sTitle)
					references.push(data[a].stateOrMagnitudeValuesBind)
				}
			}
			setReferences(references)
			setReferenceComponent(titles)
		} catch (error) {
			handleMessage({
				message: error, 
				type: 'error', 
				persist: true,
				preventDuplicate: false
			})
		}
	}

	/*
	 * Disabled reload when the conditions are not compatible
	 */
	const diActivateReload = () => {
		dispatch(setloadingButton(false))
		setDisabled(true)
	}


    return(
		<div className="grafic-section">

			{/*<MenuGraficOrTable />*/}

			<MonitorList 
				diActivateReload={diActivateReload}
			/>
			{
				(startloadingGraphic) ? 
					<div className="spinner-box">
                        {
                            cubeSpinnerImg()
                        }
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
						(startloadingGraphic && getResponse.length > 0) ?
							(getResponse?.responseData.length !== 0 && getResponse?.responseData?.samples.length > 0) ?
								(references.length > 0) ?
									<ButtonMagnitudeReference 
										magnitudeTitles={referenceComponent}
										magnitudeReferences={references}
									/>
								: ""
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
