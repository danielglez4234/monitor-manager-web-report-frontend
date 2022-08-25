import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	handleSelectedElemets,
	setloadingButton
} from '../../../../actions';
import * as $  from 'jquery';
import {
    IconButton, Button
} from '@mui/material'
import { LtTooltip } from '../../../../commons/uiStyles'

import DataUsageIcon                from '@mui/icons-material/DataUsage';
import SettingsBackupRestoreIcon    from '@mui/icons-material/SettingsBackupRestore';
import ClearAllIcon                 from '@mui/icons-material/ClearAll';
import DetailsIcon                  from '@mui/icons-material/Details';
import ArrowDropUpSharpIcon         from '@mui/icons-material/ArrowDropUpSharp';
import ExpandMoreIcon               from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon  from '@mui/icons-material/KeyboardDoubleArrowDown';
import CachedIcon from '@mui/icons-material/Cached';

import { CONSTRAINTS } from './constrainst';  
import SelectedElement      from './SelectedElement'


    /*
     * Default State of the list
     */
	let initialInfoText = <div className="no_monitor_selected">
                            <DataUsageIcon className="img_monitor_selected"/>
                                <p className="no_monitor_selected_message">Select a Monitor from the MonitorList</p>
                        </div>;

    /*
	 * Blink animation when a monitor is selected // TODO: llamar solo al guardar los opciones
	 */
	const blinkAnimation = () => {
		const animationListeners = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
		$('.selected-monitors-extends-buttons').addClass('blink')
		$('.selected-monitors-extends-buttons').one(animationListeners, function () {  // when the animation ends remove the class
			$('.selected-monitors-extends-buttons').removeClass('blink')
		})
	}

    /*
	 * Hide Component and monitor list handle arrows movement
	 */
	const handleExpandSection = (icon, setHeightPX) => {
		$(".menu-monitorSelected-contain").css('height', setHeightPX + "px")
		if (setHeightPX === 0) {
			$(".menu-monitorSelected-contain").addClass('hide-sections')
			$(".selected-monitors-select-all").addClass('hide-sections')
		}else {
			$(".menu-monitorSelected-contain").removeClass('hide-sections')
			$(".selected-monitors-select-all").removeClass('hide-sections')
		}
		$('.rotback').removeClass('rotate180 activeExpandColor')
		if (icon === "visibilityMiddle-icon") {
			if (!$('.visibilityMiddle-icon').hasClass('activeExpandColor')) {
				$('.' + icon).toggleClass('activeExpandColor')
			}
		}else if (icon === "visibilityOff-icon") {
			$('.' + icon).toggleClass('rotate180 activeExpandColor')
			$('.visibilityMiddle-icon').removeClass('rotate180')
		}else {
			$('.' + icon).toggleClass('rotate180 activeExpandColor')
			$('.visibilityMiddle-icon').toggleClass('rotate180')
		}
	}

    /*
	 * Show Less Details
	 */
	const lessDatails = () => {
		$('.monitor-selected-info_component_id').toggleClass('display-none')
		$('.lessDetail-icon').toggleClass('color-menu-active')
	}

	/*
	 * Reset all options
	 */
	const resetOptions = () => {
		$(".checkboxMo-monitor").prop('checked', false)
		$('.color-line').prop('disabled', true)
		$(".monitor-selected-select option").attr('selected', false)
		$(".monitor-selected-select option[value='1']").attr('selected', true)
		$(".input-limits-grafic-options").val('')
	}


function MonitorList({diActivateReload}) {
    const dispatch = useDispatch();
    const monitor = useSelector(state => state.monitor)

    const [countMonitors, setCountMonitors] = useState(0);
	// const [elements, setSelectedElements] = useState([]);
	// const [onSelect, setOnSelect] = useState(true);

	/*
	 * Map selected elements
	 */
	useEffect(() => {
		if (monitor.length > 0) 
		{
			// setOnSelect(false)
			// setCountMonitors(monitor.length)
			// setSelectedElements(monitor)
				blinkAnimation()
		}
		// else 
		// {
		// 	setOnSelect(true)
		// 	setCountMonitors(0)
		// }
	}, [monitor])

	/*
	 * save monitor options
	 */
	const saveOptions = (id, options) => {
		try {
			monitor.map(obj => {
				if (obj.id === id) {
					delete obj["options"]
					obj["options"] = options
				}
				return obj
			})
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * handle all menu global state acions from monitorSelected
	 */
	const menuHandle = (type, id, options) => {
		dispatch(handleSelectedElemets(type, id, null, options))
	}

	/*
	 *
	 */
	const handleBoxplotEnabled = (id) => {
		// !! => if undefined = true then ! revert to false
		if(!!id){ 
			monitor.map(obj => {
				if(obj.id !== id)
					if(obj?.options?.boxplot)
						obj.options.boxplot = false
				
				console.log("monitor", obj?.options?.boxplot)
			})
		}
	}

	/*
	 * add constraints to boxplot
	 */
	const constraints = ({apply_to}) => {
		if(CONSTRAINTS?.apply_constraints)
		{ 
			const boxplot = CONSTRAINTS.boxplot
			if(boxplot.only_one_collapse_enabled){
				handleBoxplotEnabled(apply_to)
			}
			// ...
		}
	}


    return ( 
        <div className="selected-monitors-section">
			<div className="selected-monitors-select-all">
			<div className="selected-monitors-select-all-title"> Selected Monitors </div>
				{/* <label onClick={() =>{ checkAllCheckboxes("logarithm") }} className="label-cont-inputchecbox select-all-checkbox">logarithm
					<input type="checkbox" className="checkboxMo checkboxMo-monitor logarithm-all" />
				<span className="checkmark"></span>
				</label>
				<label onClick={() =>{ checkAllCheckboxes("curved") }} className="label-cont-inputchecbox select-all-checkbox">curved
					<input type="checkbox" className="checkboxMo checkboxMo-monitor curved-all" />
				<span className="checkmark"></span>
				</label>
				<label onClick={() =>{ checkAllCheckboxes("filled") }} className="label-cont-inputchecbox select-all-checkbox">filled
					<input type="checkbox" className="checkboxMo checkboxMo-monitor filled-all" />
				<span className="checkmark"></span>
				</label> */}
				{
                    (true) ? "" : // testing
					<Button 
						className="selected-monitors-save-options"
						size="small" 
						variant="contained" 
						startIcon={<CachedIcon />}
						onClick={() =>{ saveOptions()}}
					>
						Aply Options
					</Button>
                }
			</div>

			<div className="menu-monitorSelected-contain">
				<div className="table-selected-monitors-options">
					<LtTooltip 
						onClick={() => { 
							resetOptions() 
						}} 
						title="Reset Options" 
						placement="left" 
						className="tool-tip-options"
					>
						<SettingsBackupRestoreIcon className="table-selected-clearAll-icon reset-menu-icon"/>
					</LtTooltip>
					<LtTooltip 
						onClick={() => { 
							menuHandle('removeAll', null, null); 
							diActivateReload() 
						}} 
						title="Clear All" 
						placement="left" 
						className="tool-tip-options"
					>
						<ClearAllIcon className="table-selected-clearAll-icon"/>
					</LtTooltip>
					<LtTooltip 
						onClick={() => {
							lessDatails()
						}}
						title="Less Details"
						placement="left"
						className="tool-tip-options"
					>
						<DetailsIcon id="lessDetail-icon" className="table-selected-clearAll-icon lessDetail-icon"/>
					</LtTooltip>
				</div>
				<div id="resizable" data-bottom="true" className="selected-monitors-box">
					{
					// (onSelect) ? initialInfoText :
					(monitor.length <= 0) ? initialInfoText :
						<table id="drop-area" className="table-selected-monitors">
							<tbody>
							{
								monitor.map((element) =>
									<SelectedElement
										key           	 = { element.id  }
										id            	 = { element.id }
										monitorData   	 = { element }
										saveOptions	  	 = { saveOptions }
										menuHandle    	 = { menuHandle }
										diActivateReload = { diActivateReload }
										constraints		 = { constraints }
									/>
								)
							}
							</tbody>
						</table>
					}
				</div>
			</div>
            <div className="selected-monitors-extends-buttons">
                <div className="selected-monitor-count">
                    º
                    {
                    	monitor.length
                    }
                </div>
                <KeyboardDoubleArrowDownIcon 
                    onClick={() => { 
						handleExpandSection("visibilityLarge-icon", 400) 
					}} 
                    className="section-selected-extends-icons rotback visibilityLarge-icon"
                />
                <ExpandMoreIcon 
                    onClick={() => { 
						handleExpandSection("visibilityMiddle-icon", 98) 
					}} 
                    className="section-selected-extends-icons rotback activeExpandColor visibilityMiddle-icon" 
                />
                <ArrowDropUpSharpIcon 
                    onClick={() => { 
						handleExpandSection("visibilityOff-icon", 0) 
					}} 
                    className="section-selected-extends-icons rotback visibilityOff-icon" 
                />
            </div>
		</div>
    );
}

export default MonitorList;