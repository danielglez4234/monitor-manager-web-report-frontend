import React, { useState, useEffect } from 'react';
import $                              from "jquery";
import { 
  getComponents, 
  getMonitorsFromComponent 
} from '../../../services/services'
import { useDispatch, useSelector }   from 'react-redux';
import {
  handleSelectedElemets,
  setloadingButton
}
from '../../../actions';
import Fuse                           from 'fuse.js';
import {Stack, Skeleton, IconButton}  from '@mui/material';
import { 
  Search,
  SearchIconWrapper,
  StyledInputBase 
} from '../../../commons/uiStyles';
import CachedIcon 					  from '@mui/icons-material/Cached';
import SearchIcon                     from '@mui/icons-material/Search';
import SnippetFolderIcon              from '@mui/icons-material/SnippetFolder';
import ArrowLeftIcon                  from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon                 from '@mui/icons-material/ArrowRight';
import HelpOutlineIcon                from '@mui/icons-material/HelpOutline';
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import ComponentElement               from './ComponentElement';
import MonitorElement                 from './MonitorElement';
import HandleMessage                   from '../../handleErrors/HandleMessage';


/*
 * Declare condition html variables
 */
const noSelectedComponent = <div className="noComponentSelected-box">
								<SnippetFolderIcon className="noComponentSelected-icon" />
								<p className="noComponentSelected-title">No Component Selected From Component Item List</p>
							</div>;
const skeleton            = <div>
								<Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
								<Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
							</div>;
const noResultFound       = <div className="noComponentSelected-box">
								<HelpOutlineIcon className="noComponentSelected-icon" />
								<p className="noComponentSelected-title">No Results Found</p>
							</div>;
const noMonitorElements   = <div className="noComponentSelected-box">
								<HelpOutlineIcon className="noComponentSelected-icon" />
								<p className="noComponentSelected-title">No Monitors Found</p>
							</div>;
const error               = <div className="noComponentSelected-box">
								<ReportGmailerrorredRoundedIcon className="noComponentSelected-icon" />
								<p className="noComponentSelected-title">Connection Error</p>
							</div>;


function ListComponentMonitor() {
	const dispatch            = useDispatch()
	const [msg, PopUpMessage] = HandleMessage()

	const monitorAlreadySelected  = useSelector(state => state.monitor)

	const [idMonitorsAlreadySelected, setIdMonitorsAlreadySelected] = useState([])

	const [data_components, setData_components]            = useState([])
	const [loadingComponent, setLoadingComponent]          = useState(true)
	const [resultQueryComponent, setResultQueryComponent]  = useState([])
	const [component_clicked, setComponent_clicked]        = useState('')

	const [data_monitors, setData_monitors]                = useState([])
	const [initialStateMonitors, setInitialStateMonitors]  = useState(true)
	const [resultQueryMonitor, setResultQueryMonitor]      = useState([])

	const [loadingMonitors, setLoadingMonitors]            = useState(true)
	const [monitorsAvailable, setNoMonitorsAvailable]      = useState(true)

	const [connectionError, setConnectionError] = useState(false)

	/*
	 * Get All Components
	 */
	const loadComponents = () => {
		Promise.resolve( getComponents() )
		.then(res => {
			setConnectionError(false)
			setData_components(res)
			setResultQueryComponent(res)
			console.log("Comoponent Data was recibe successfully")
		})
		.catch(error => { 
			setConnectionError(true)
			PopUpMessage({type:'error', message:'Error fetching components data on the Server'})
			console.error(error)
		})
		.finally(() => { 
			setLoadingComponent(false)
		});
	}
	
	/*
	 * Init load
	 */
	useEffect(() => {
		$("#initialImg").removeClass('display-none') // return to default state
		loadComponents()
	}, [])

	/*
	 * Try reconnecting
	 */
	const tryReconnect = () => {
		setLoadingComponent(true)
		loadComponents()
	}

	/*
	 * Check if the monitor is alredy selected
	 */
	useEffect(() => {
		setIdMonitorsAlreadySelected(monitorAlreadySelected)
	}, [monitorAlreadySelected])


	/*
	 * Get All MonitorsMagnitude and state from a Component
	 */
	const getMonitors = (title) =>{
		document.getElementById('searchInputCompMon').value = '' // reset the value of the search input when a component is clicked
		if (component_clicked !== title)
		{
			setInitialStateMonitors(false)
			setComponent_clicked(title)
			setLoadingMonitors(true)
			Promise.resolve( getMonitorsFromComponent(title) )
			.then(res => {
				if (res.magnitudeDescriptions.length > 0 || res.monitorDescription.length > 0) 
				{
					setNoMonitorsAvailable(false)
					const dataList = buildDataElementsList(res)
					setData_monitors(dataList)
					setResultQueryMonitor(dataList)
					console.log("Get monitors from component successfully")
				}
				else 
				{
					setNoMonitorsAvailable(true)
				}
				setLoadingMonitors(false)
			})
			.catch(error => {
				PopUpMessage({type:'error', message:'Error fetching monitors data on the Server'})
				console.error(error)
			})
		}
	}

	/*
	 * build monitors list data
	 */
	const buildDataElementsList = (data) => {
		const component_id = data.id
		const name = data.name

		const magnitudeDescriptions = data.magnitudeDescriptions
		for (let i = 0; i < magnitudeDescriptions.length; i++) {
			magnitudeDescriptions[i]["component_id"] = component_id
			magnitudeDescriptions[i]["name"] = name
		}

		const monitorDescription = data.monitorDescription
		for (let i = 0; i < monitorDescription.length; i++) {
			monitorDescription[i]["component_id"] = component_id
			monitorDescription[i]["name"] = name
		}

		const stateDescriptions = {
			id: component_id, 
			name: name,
			magnitude: 'STATE',
			type: 'state'
		}

		return [stateDescriptions, ...monitorDescription, ...magnitudeDescriptions]
	}

	/*
	 * Handle Search For Components
	 */
	const handleSearchComponent = value => {
		$('.component-list-items').scrollTop(0)
		const fuse = new Fuse(data_components)
		const results = fuse.search(value)
		const searchResult = results.map(result => result.item)
		if (value === '')
			setResultQueryComponent(data_components)
		else
			setResultQueryComponent(searchResult)
	}

    /*
     * Get current value of the search input from Components
     */
    const handleOnSeacrhComponent = ({ currentTarget = [] }) => {
		const { value } = currentTarget
		handleSearchComponent(value)
    }

	/*
	 * Handle Search For Monitors
	 */
	const handleSearchMonitors = value => {
		$('.monitors-list-items').scrollTop(0)
		const fuse = new Fuse(data_monitors, {
			keys: ["magnitude"],
		});
		const results = fuse.search(value)
		const searchResult = results.map(result => result.item)
		if (value === '')
			setResultQueryMonitor(data_monitors)
		else
			setResultQueryMonitor(searchResult)
	}

    /*
     * Get current value of the search input from Monitors
     */
    const handleOnSeacrhMonitors = ({ currentTarget = [] }) => {
		const { value } = currentTarget
		handleSearchMonitors(value)
    }

    /*
     * Hide or Show Component and monitor list
     */
    const hideAndShowSection = () => {
		$('.SampleMonitorList-section').toggleClass('hide-sections')
		$('.arrow-showListSection').toggleClass('hide-sections')
    }

    /*
     * disable the reload button when a new component is selected
     */
    const diActivateReload = () => {
      	dispatch(setloadingButton(false))
    }

    /*
     * dispatch variables to the global state action selectMonitor
     */
    const select = (monitorData) => {
		if (idMonitorsAlreadySelected.length > 0 && idMonitorsAlreadySelected.filter(e => e["id"] === monitorData.id).length > 0)
			PopUpMessage({type:'info', message:'The monitor '+monitorData.magnitude+' is alredy selected'})
		else
			dispatch(handleSelectedElemets('add', null, monitorData, null))
    }


	return (
		<div className="container-adjust-height">
			<div className="arrowShowHide arrow-showListSection hide-sections"><ArrowRightIcon onClick={() => { hideAndShowSection() }} className="arrow-rightSection" /></div>
			<div className="SampleMonitorList-section">
				<div className="sample-list-box">
					<div className="sample-header sample-items-components">
						<Stack direction="column" spacing={2}>
							<Stack className="stack-row-components-title-buttons" direction="row">
								<p className="components-item-title">Components Item List</p>
								<ArrowLeftIcon onClick={() => { hideAndShowSection() }} className="hide_icon_componentList"/>
							</Stack>
							<Search>
								<SearchIconWrapper>
									<SearchIcon />
								</SearchIconWrapper>
								<StyledInputBase
									placeholder="Search…"
									onChange={handleOnSeacrhComponent}
									inputProps={{ 'aria-label': 'search' }}
									className="searchInputCompMon"
								/>
							</Search>
							{
								(connectionError) ?
									<IconButton 
										color="primary" 
										aria-label="upload picture" 
										component="span"
										className={"try-reconnect-button-box"}
									>
										<CachedIcon 
											className={"try-reconnect-button"}
											onClick = {() => {
												tryReconnect()
											}}
										/>
									</IconButton>
								: ""
							}
						</Stack>
					</div>

					<div className="sample-items component-list-items">
						{
							(connectionError)  ? error :
							(loadingComponent) ? skeleton :
							(resultQueryComponent.length === 0) ? noResultFound :
							resultQueryComponent.map((element, index) =>
								<ComponentElement
									key                = { index }
									title              = { element }
									getMonitors        = { getMonitors }
								/>
							)
						}
					</div>
				</div>

				<div className="monitor-of-selected-sample-box">
					<div className="sample-header sample-header-monitors">
					<Stack direction="column" spacing={2}>
						<Stack className="stack-row-components-title-buttons" direction="row">
						<p className="components-item-title">Monitors Item List</p>
						</Stack>
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search…"
								onChange={handleOnSeacrhMonitors}
								inputProps={{ 'aria-label': 'search' }}
								id="searchInputCompMon"
							/>
						</Search>
					</Stack>
					<p className="component-title">
						{
							component_clicked
						}
						{/* to do => botones de selección multiple ["TAGS" => "scalar, enum, boolean, array, array2D, state"] */}
					</p>
					</div>

					<div id="offer-area" className="sample-items monitors-list-items">
						{
							(initialStateMonitors) ? noSelectedComponent :
							(loadingMonitors) ? skeleton :
							(resultQueryMonitor.length === 0 || monitorsAvailable) ? noMonitorElements :
							resultQueryMonitor.map((element, index) =>
								<MonitorElement
									key                = { index }
									monitorData        = { element }
									select             = { select }
									diActivateReload   = { diActivateReload }
								/>
							)
						}
					</div>

				</div>

			</div>
		</div>
	);
}

export default ListComponentMonitor;
