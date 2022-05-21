import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	menuHandleSelectedMonitors,
	setloadingButton
} from '../../../../actions';
import * as $  from 'jquery';
import {
	Stack,
	Button,
	Pagination,
	LinearProgress,
	Popover,
    IconButton
} from '@mui/material'
import { LtTooltip } from '../../../../commons/uiStyles'

import DataUsageIcon                from '@mui/icons-material/DataUsage';
import SettingsBackupRestoreIcon    from '@mui/icons-material/SettingsBackupRestore';
import ReplayIcon                   from '@mui/icons-material/Replay';
import ClearAllIcon                 from '@mui/icons-material/ClearAll';
import DetailsIcon                  from '@mui/icons-material/Details';
import ArrowDropUpSharpIcon         from '@mui/icons-material/ArrowDropUpSharp';
import ExpandMoreIcon               from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon  from '@mui/icons-material/KeyboardDoubleArrowDown';

import CachedIcon from '@mui/icons-material/Cached';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import SelectedElement      from './SelectedElement'

function MonitorList({disabled}) {
    const dispatch = useDispatch();
    const monitor = useSelector(state => state.monitor)

    const [countMonitors, setCountMonitors] = useState(0);
	const [elements, setSelectedElements] = useState([]);
	const [onSelect, setOnSelect] = useState(true);

   
    /*
     * Default State of the list
     */
	let initialInfoText = <div className="no_monitor_selected">
                            <DataUsageIcon className="img_monitor_selected"/>
                                <p className="no_monitor_selected_message">Select a Monitor from the MonitorList</p>
                        </div>;

    /*
	 * Blink animation when a monitor is selected
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

	/*
	 * Map selected elements
	 */
	useEffect(() => {
		if (monitor.length > 0) 
		{
			setOnSelect(false)
			setCountMonitors(monitor.length)
			setSelectedElements(monitor)
				blinkAnimation()
		}
		else 
		{
			setOnSelect(true)
			setCountMonitors(0)
		}
	}, [monitor])

    /*
	 * handle all menu global state acions from monitorSelected
	 */
	const menuHandle = (id, type) => {
		dispatch(menuHandleSelectedMonitors(id, type))
	}

    /*
	 * Disabled reload when the conditions are not compatible
	 */
	const diActivateReload = () => {
		dispatch(setloadingButton(false))
		// setDisabled(true) // TODO: REFACTOR:
	}

    /*
	 * Check all the corresponding checkboxes when you click the selected all 
	 */
	const checkAllCheckboxes = (selectedCheckbox) => {
		var checkboxAll       = $("." + selectedCheckbox + "-all")
		var checkboxMonitors  = $("." + selectedCheckbox);

		if (checkboxAll.is(":checked")) {
			checkboxMonitors.prop('checked', true)
		}else {
			checkboxMonitors.prop('checked', false)
		}
	}



    return ( 
        <div  className="selected-monitors-section">
			<div className="selected-monitors-select-all">
			<div className="selected-monitors-select-all-title"> Selected Monitors </div>
				<label onClick={() =>{ checkAllCheckboxes("logarithm") }} className="label-cont-inputchecbox select-all-checkbox">logarithm
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
				</label>
				{
                    (true) ? "" : 
                    <IconButton aria-label="fingerprint" color="success">
                        <CachedIcon />
                    </IconButton>
                }
			</div>

			<div className="menu-monitorSelected-contain">
				<div className="table-selected-monitors-options">
					<LtTooltip onClick={() => { resetOptions() }} title="Reset Options" placement="left" className="tool-tip-options">
						<SettingsBackupRestoreIcon className="table-selected-clearAll-icon reset-menu-icon"/>
					</LtTooltip>
					<LtTooltip onClick={() => { menuHandle('', 'diselectALLMonitor'); diActivateReload() }} title="Clear All" placement="left" className="tool-tip-options">
						<ClearAllIcon className="table-selected-clearAll-icon"/>
					</LtTooltip>
					<LtTooltip onClick={() => { lessDatails() }} title="Less Details" placement="left" className="tool-tip-options">
						<DetailsIcon id="lessDetail-icon" className="table-selected-clearAll-icon lessDetail-icon"/>
					</LtTooltip>
				</div>
				<div id="resizable" data-bottom="true" className="selected-monitors-box">
					{
					(onSelect) ? initialInfoText :
						<table id="drop-area" className="table-selected-monitors">
							<tbody>
							{
								elements.map((element, index) =>
									<SelectedElement
										key           = { element.monitorData.id  }
										id            = { element.monitorData.id }
										monitorData   = { element.monitorData }
										component     = { element.component }
										menuHandle    = { menuHandle }
										diActivateReload = { diActivateReload }
										// onRemove      = { onRemove }
										// disableWhileSearching = { disableWhileSearching }
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
                    countMonitors
                    }
                </div>
                <KeyboardDoubleArrowDownIcon 
                    onClick={() => { handleExpandSection("visibilityLarge-icon", 400) }} 
                    className="section-selected-extends-icons rotback visibilityLarge-icon"
                />
                <ExpandMoreIcon 
                    onClick={() => { handleExpandSection("visibilityMiddle-icon", 98) }} 
                    className="section-selected-extends-icons rotback activeExpandColor visibilityMiddle-icon" 
                />
                <ArrowDropUpSharpIcon 
                    onClick={() => { handleExpandSection("visibilityOff-icon", 0) }} 
                    className="section-selected-extends-icons rotback visibilityOff-icon" 
                />
            </div>
		</div>
    );
}

export default MonitorList;