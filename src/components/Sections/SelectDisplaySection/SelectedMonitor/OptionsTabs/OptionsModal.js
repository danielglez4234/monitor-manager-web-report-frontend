// Tabs
import BoxPlotTab from './Tabs/BoxPlotTab'
import PresentationTab from './Tabs/PresentationTab'
import VisualizationTab from './Tabs/VisualizationTab'

// --- Dependecies
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import * as $ from 'jquery';
import {
  fnIsArray,
  fnIsMagnitude,
  fnIsState
}
from '../../../../standarFunctions';
import { LtTooltip } from '../../../../../commons/uiStyles';
import {Stack, IconButton, Box, TextField, Autocomplete, FormControlLabel, Checkbox, Popover } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'
import CloseIcon           from '@mui/icons-material/Close';

import InfoRoundedIcon     from '@mui/icons-material/InfoRounded';
import GetMonitordIconType from '../GetMonitordIconType';
import TuneIcon            from '@mui/icons-material/Tune';
import AnnouncementIcon    from '@mui/icons-material/Announcement';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

/*
 * Set oprions 'select' inputs 
 */
const graphicOpts = [ "Line Series", "Step Line Series" ]
const strokeOpts  = [ "Light", "Medium", "Bold", "Bolder" ]
const canvasOpts  = [ "Default", "Dotted", "Dashed", "Large Dashed", "Dotted Dashed"]
const patternOpts = [ "Default", "0.#", "0.##", "0.###", "0.####", "0.#####", "0.######", "0.#######", "0.########" ]
const unitOpt     = [ "Default" ]
const prefixOpt   = [ "Default" ]

const tabStyle = {
    fontSize: '12.5px', 
    fontFamily: 'RobotoMono-Bold', 
    color: '#fff',
    '&:hover': {
        color: '#ced4d5',
        opacity: 1,
    },
      '&.Mui-selected': {
        color: '#9bb7d5',
    },
      '&.Mui-focusVisible': {
        backgroundColor: '#d1eaff',
    },
}

/*
 * Apply changes warning message
 */
const applyChangesWarning = <LtTooltip
								title={
									<React.Fragment>
										<b className="label-indHlp-tooltip">{"To apply these changes you have"}</b><br />
										<b className="label-indHlp-tooltip">{"to press the "}<i>{"'Search & Display'"}</i></b><br />
										<b className="label-indHlp-tooltip">{"button again."}</b>
									</React.Fragment>
								}
									placement="left" className="tool-tip-options">
								<AnnouncementIcon className="index-help-icon"/>
							</LtTooltip>

/*
 * Handle monitor settings options OPEN popover
 */
const handleClickOpenSettings = (id) => {
	const offset = $('.id-TuneIcon-sett' + id).offset()
	$('.id-mon-sett' + id).toggleClass('display-none').offset({ top: offset.top, right: offset.right})
	$('.close-settingsMon' + id).toggleClass('display-none')
}



function OptionsModals({ id, monitorData, saveOptions, menuHandle, diActivateReload}) {
	const loadWhileGetData = useSelector(state => state.loadingGraphic)
	
	// If the button is alredy active when a new monitor is selected, apply the changes
	let lessDetailIfActive
	if ($('#lessDetail-icon').hasClass('color-menu-active')) {
		lessDetailIfActive = 'display-none'
	}

	/*
	 * STATES
	 */
	// checkbox inputs
	const [logarithm, setLogarithm] 	  = useState(monitorData?.options?.logarithm 	 || false)
	const [curved, setCurved] 			  = useState(monitorData?.options?.curved 	 	 || false)
	const [filled, setFilled] 			  = useState(monitorData?.options?.filled 	 	 || false)
	const [enabledColor, setEnabledColor] = useState(monitorData?.options?.enabled_color || false)

	// string inputs
	const [limit_max, setLimit_max] = useState(monitorData?.options?.limit_max 	|| "")
	const [limit_min, setLimit_min] = useState(monitorData?.options?.limit_min 	|| "")
	const [color, setColor] 		= useState(monitorData?.options?.color 		|| "")
	const [pos, setPos] 			= useState(monitorData?.options?.pos 		|| "")

	// autocomplete inputs
	const isEnumOrMonitor = (fnIsMagnitude(monitorData.type)) ?  graphicOpts[1] : graphicOpts[0]
	const [graphicType, setGraphicType]   = useState(monitorData?.options?.graphicType || isEnumOrMonitor)
	const [stroke, setStroke] 			  = useState(monitorData?.options?.stroke 	   || strokeOpts[0])
	const [canvas, setCanvas] 			  = useState(monitorData?.options?.canvas 	   || canvasOpts[0])
	const [unit, setUnit] 				  = useState(monitorData?.options?.unit 	   || unitOpt[0])
	const [prefix, setPrefix] 			  = useState(monitorData?.options?.prefix 	   || prefixOpt[0])
	const [decimal, setDecimal] 		  = useState(monitorData?.options?.decimal 	   || patternOpts[0])
	
	// Boxplot
	const [boxplot, setBoxplot] = useState({
		isEnable: false,
		onlyCollapseValues: false,
		intervals: null,
		collapseValues: null
	});

    const [tabValue, setTabValue] = useState('1');

	/*
	 * handle get options
	 */
	const getOptions = () => {
		return {
			boxplot: boxplot,
			logarithm: logarithm,
			curved: curved,
			filled: filled,
			limit_max: limit_max,
			limit_min: limit_min,
			graphicType: graphicType,
			stroke: stroke,
			canvas: canvas,
			color: enabledColor && color,
			pos: (fnIsArray(monitorData.type)) ? pos : null,
			prefix: fnIfExistDefault(prefix),
			unit: fnIfExistDefault(unit),
			decimal: fnIfExistDefault(decimal)
		}
	}

	const fnIfExistDefault = (value) => {
		if(fnIsMagnitude(monitorData.type) || fnIsState(monitorData.type))
			return null
		else
			return value
	}

	/*
	 *	call save options action
	 */
	const saveOpt = () => {
		saveOptions(id, getOptions())
	}
	
	/*
	 * store the selected monitor options in the redux variable
	 */
	useEffect(() => {
		if(monitorData)
			saveOpt()
	}, [])

	/*
	 * Handle remove item from list 
	 */
	const onRemove = (id) => {
		menuHandle('remove', id, null)
		diActivateReload()
	}

	/*
	 * Get Icons
	 */
	const iconType = <GetMonitordIconType type={ monitorData.type } />

  
	return(
		<tr className={`tr-monMag${id}`} id={id}>
			<td>
                <div className="monitor-selected-td-container">
                    <Stack className={`monitor-selected-info_component_id ${lessDetailIfActive}`} direction="row">
                        <div className="monitor-selected-info-component">
                            <span>{ monitorData?.name }</span>
                        </div>
                        <div className="monitor-selected-info">

                            {
                                (fnIsState(monitorData.type)) ? ""
                                :
                                <>
                                    <span>version: { monitorData.version } - </span>
                                    {
                                    (fnIsMagnitude(monitorData.type)) ?              
                                        <span>MagnitudeType: { (monitorData?.magnitudeType?.name) ? monitorData.magnitudeType.name : ""} - </span>
                                    :
                                        <span>unit: <span className="default-unit">{ monitorData.unit }</span> - </span>
                                    }
                                </>
                            }
                            <span>type: { monitorData.type } - </span>
                            <span>id: { monitorData.id }</span>
                        </div>
                    </Stack>
                <div className="align-content-flex-row">

                <div className="monitor-seleted-options-icons">
                    <IconButton 
                        className="monitor-seleted-closeIcon"
                        color="success"
                        aria-label="upload picture" 
                        component="span" 
                        onClick={() => { onRemove(id) }} 
                        disabled={loadWhileGetData} 
                    >
                        <CloseIcon  />
                    </IconButton>
                    {
                        iconType
                    }
                </div>

                <div className="monitor-seleted-item-box">

                    <Stack className="monitor-seleted-item" direction="row">
                        <div className="monitor-selected-item-title-box">
                            <p className="monitor-selected-item-title">
                                {
                                    (!fnIsMagnitude(monitorData.type) && !fnIsState(monitorData.type)) ?
                                    <>
                                        <LtTooltip
                                            disableInteractive
                                            title={ 
                                                <React.Fragment>
                                                    <b className="label-indHlp-tooltip">{"This graphic has a summary!!"}</b>
                                                </React.Fragment>
                                            }
                                            placement="bottom" className="tool-tip-options-description">
                                            <CandlestickChartIcon className="description-info-icon sumary-info-icon" />
                                        </LtTooltip>
                                    </>
                                    : ""
                                }
                            </p>
                            <p className="monitor-selected-item-title">
                                {
                                    (!fnIsMagnitude(monitorData.type) && !fnIsState(monitorData.type)) ?
                                    <>
                                        <LtTooltip
                                            disableInteractive
                                            title={ 
                                                <React.Fragment>
                                                    <b className="label-indHlp-tooltip">{"Descirption:"}</b><br />
                                                    <span className="indHlp-vis-desc">{ monitorData.description }</span>
                                                </React.Fragment>
                                            }
                                            placement="right" className="tool-tip-options-description">
                                            <InfoRoundedIcon className="description-info-icon" />
                                        </LtTooltip>
                                    </>
                                    : ""
                                }
                                <span className="monitor-selected-monitorMagnitudeName">{ monitorData.magnitude }</span>
                            </p>
                        </div>

                        <PopupState variant="popover" >
                            {(popupState) => (
                                <>
                                    <IconButton 
                                        arai-label="tune-setings" 
                                        className={`settings-selected-monitor id-TuneIcon-sett` + id}
                                        {...bindTrigger(popupState)}
                                    >
                                        <TuneIcon />
                                    </IconButton>
                                    <Popover
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                    <div className="store-query-title">
                                        Options
                                    </div>
                                    <TabContext value={tabValue} sx={{height: '10px'}}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                                            <TabList 
                                                onChange={(event, newValue) => { setTabValue(newValue) }} 
                                                aria-label="lab API tabs example"
                                                sx={{backgroundColor: '#40435'}}
                                            >
                                                <Tab label="Boxplot" value="0" 
                                                    sx={tabStyle}
                                                />
                                                <Tab label="Presentation" value="1" 
                                                    sx={tabStyle}
                                                />
                                                <Tab label="Visualization" value="2" 
                                                    sx={tabStyle}
                                                />
                                                <Tab label="Unit Conversions" value="3" 
                                                    sx={tabStyle}
                                                />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="0">
                                            <BoxPlotTab />
                                        </TabPanel>
                                        <TabPanel value="1">
                                            {/* <PresentationTab /> */}
                                        </TabPanel>
                                        <TabPanel value="2">
                                            {/* <VisualizationTab /> */}
                                        </TabPanel>
                                        <TabPanel value="3">
                                            {/* <UnitConversions /> */}
                                        </TabPanel>
                                    </TabContext>

                                    </Popover>
                                </>
                            )}
                        </PopupState>

                        <div 
                            className={`close_rangeZone-monitor-settings display-none close-settingsMon` + id} 
                            onClick={() => {
                                handleClickOpenSettings(id);
                                saveOpt();
                            }}>	
                        </div>
                        

                        


                    </Stack>
                </div>
                </div>

                </div>
			</td>
		</tr>
	);
}

export default OptionsModals;
