import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import * as $ from 'jquery';
import {
  fnIsArray,
  fnIsMagnitude,
  fnIsState,
  isEmpty
}
from '../../../standarFunctions';
import { LtTooltip } from '../../../../commons/uiStyles';
import {Stack, IconButton, Box, TextField, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon           from '@mui/icons-material/Close';
import HelpIcon            from '@mui/icons-material/Help';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import InfoRoundedIcon     from '@mui/icons-material/InfoRounded';
import GetMonitordIconType from './GetMonitordIconType';
import GetIndexArrayModal  from './GetIndexArrayModal';
import GetUnitSelecttype   from './GetUnitSelecttype';
import GetSummarySelect    from './GetSummarySelect';
import TuneIcon            from '@mui/icons-material/Tune';
import AnnouncementIcon    from '@mui/icons-material/Announcement';

/*
 * Set options 'select' default options
 */
const graphicOpts = [ "Line Series", "Step Line Series" ]
const strokeOpts  = [ "Light", "Medium", "Bold", "Bolder" ]
const canvasOpts  = [ "Default", "Dotted", "Dashed", "Large Dashed", "Dotted Dashed"]
const patternOpts = [ "Default", "0.#", "0.##", "0.###", "0.####", "0.#####", "0.######", "0.#######", "0.########" ]
const unitOpt     = [ "Default" ]
const prefixOpt   = [ "Default" ]
const summaryConfigOpt = [ "None" ]
const collapseValuesOpt = [ "None" ]

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



function SelectedElement({ id, monitorData, saveOptions, menuHandle, diActivateReload, constraints}) {
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
	const [logarithm, setLogarithm]         = useState(monitorData?.options?.logarithm     || false)
	const [curved, setCurved]               = useState(monitorData?.options?.curved        || false)
	const [filled, setFilled]               = useState(monitorData?.options?.filled        || false)
	const [enabled_color, setEnabled_color] = useState(monitorData?.options?.enabled_color || false)

	// string inputs
	const [limit_max, setLimit_max] = useState(monitorData?.options?.limit_max  || "")
	const [limit_min, setLimit_min] = useState(monitorData?.options?.limit_min  || "")
	const [color, setColor]         = useState(monitorData?.options?.color      || "")
	const [pos, setPos]             = useState(monitorData?.options?.pos        || "")

	// autocomplete inputs
	const isEnumOrMonitor = (fnIsMagnitude(monitorData.type)) ?  graphicOpts.at(1) : graphicOpts.at(0)
	const [graphic_type, setgraphic_type] = useState(monitorData?.options?.graphic_type || isEnumOrMonitor)
	const [stroke, setStroke]             = useState(monitorData?.options?.stroke       || strokeOpts.at(1))
	const [canvas, setCanvas]             = useState(monitorData?.options?.canvas       || canvasOpts.at(0))
	const [unit, setUnit]                 = useState(monitorData?.options?.unit         || unitOpt.at(0))
	const [prefix, setPrefix]             = useState(monitorData?.options?.prefix       || prefixOpt.at(0))
	const [decimal, setDecimal]           = useState(monitorData?.options?.decimal      || patternOpts.at(0))
	
	// Boxplot
	const [boxplot, setBoxplot] = useState({
		isEnable: monitorData?.options?.boxplot?.isEnable                       || false,
		onlyCollapseValues: monitorData?.options?.boxplot?.onlyCollapseValues   || false,
		summaryConfig: monitorData?.options?.boxplot?.summaryConfig             || summaryConfigOpt.at(0),
		collapseValues: monitorData?.options?.boxplot?.collapseValues           || collapseValuesOpt.at(0),
	})

	console.log("boxplot.isEnable", boxplot.isEnable)
	console.log("monitorData?.options?.boxplot?.isEnable", monitorData?.options?.boxplot?.isEnable)

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
			graphic_type: graphic_type,
			stroke: stroke,
			canvas: canvas,
			enabled_color: enabled_color,
			color: (enabled_color) ? color : "",
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
	const saveOptionsCallBack = () => {
		saveOptions(id, getOptions())
	}
	
	/*
	 * store the selected monitor options in the redux variable
	 */
	useEffect(() => {
		if(monitorData){
			saveOptionsCallBack()
		}
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
								// (!fnIsMagnitude(monitorData.type) && !fnIsState(monitorData.type)) ?
								// <>
								// 	<LtTooltip
								// 		disableInteractive
								// 		title={ 
								// 			<React.Fragment>
								// 				<b className="label-indHlp-tooltip">{"This graphic has a summary!!"}</b>
								// 			</React.Fragment>
								// 		}
								// 		placement="bottom" className="tool-tip-options-description">
								// 		<CandlestickChartIcon className="description-info-icon sumary-info-icon" />
								// 	</LtTooltip>
								// </>
								// : ""
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

					<IconButton
						onClick={() => {
							handleClickOpenSettings(id);
						}}
						arai-label="tune-setings"
						className={`settings-selected-monitor id-TuneIcon-sett` + id}
					>
						<TuneIcon />
					</IconButton>

					<div
						className={`close_rangeZone-monitor-settings display-none close-settingsMon` + id} 
						onClick={() => {
							handleClickOpenSettings(id);
							saveOptionsCallBack();
						}}>
					</div>
					<Box className={`setting-selectd-monitor-options-box display-none id-mon-sett` + id} id="mon-settings-sx" sx={{boxShadow: 3}}>
					<div className="monitor-selected-select-contain">


					{
						// (isEmpty(monitorData.summaryConfigs)) &&
						<GetSummarySelect
							id={id}
							component={monitorData.name}
							magnitude={monitorData.magnitude}
							boxplot={boxplot}
							setBoxplot={setBoxplot}
							constraints={constraints}
						/>
					}

					
						<div className="monitor-selected-select-box">

						<div className="checkbox-monitor-selected">
							<div className="label-monitor-settings">Presentation:</div>
							<div className="input-settings-checkbox">
								<FormControlLabel
									sx={{ margin: "-2px 0px"}}
									label={
											<React.Fragment>
												<b className="checkbox-monitor-selected-label">{"Logarithm"}</b>
											</React.Fragment>
									}		
									control={
										<Checkbox
											sx={{ '&:hover': { bgcolor: 'transparent' }}}
											size="small"
											onChange={(e) => {setLogarithm(e.target.checked)}}
											checkedIcon={<CheckBoxIcon sx={{color: "#ea1884 "}} /> }
											icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
											checked={logarithm} 
										/>
									}
								/>
								<FormControlLabel
									sx={{margin: "-2px 0px"}}
									label={
										<React.Fragment>
											<b className="checkbox-monitor-selected-label">{"Curved"}</b>
										</React.Fragment>
									}
									control={
										<Checkbox
											sx={{ '&:hover': { bgcolor: 'transparent' }}}
											size="small"
											onChange={(e) => {setCurved(e.target.checked)}}
											checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
											icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
											checked={curved} 
										/>
									}
								/>
								<FormControlLabel
									sx={{margin: "-2px 0px"}}
									label={
										<React.Fragment>
											<b className="checkbox-monitor-selected-label">{"Filled"}</b>
										</React.Fragment>
									}
									control={
										<Checkbox
											sx={{ '&:hover': { bgcolor: 'transparent' }}}
											size="small"
											onChange={(e) => {setFilled(e.target.checked)}}
											checkedIcon={<CheckBoxIcon sx={{color: "#99d9bb "}} /> }
											icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
											checked={filled} 
										/>
									}
								/>
							</div>
						</div>

						<div className="limtis-monnitor-settings-box">
							<div className="label-monitor-settings">Limits:</div>
							<div className="limtis-monnitor-settings-inputs">
							<label className="monitor-limits-label "> Max: </label>
								<input
									className="input-limits-grafic-options yaxisMax"
									name="limit_max"
									type="text"
									max="9999999"
									min="-9999999"
									placeholder="0.."
									onChange={(e) => {setLimit_max(e.target.value)}}
									value={limit_max}
								/>
							<label className="monitor-limits-label"> Min: </label>
								<input
									className="input-limits-grafic-options yaxisMin"
									name="limit_min"
									type="text"
									max="9999999"
									min="-9999999"
									placeholder="0.."
									onChange={(e) => {setLimit_min(e.target.value)}}
									value={limit_min}
								/>
							</div>
						</div>
						</div>

						<div className="monitor-selected-input-box">
							<div className="label-monitor-settings">Graphic Type:</div>

							<span className="monitor-selected-input-label-selects label-selects-grafic-type">Grafic Type:</span>
								<Autocomplete
									disablePortal
									disableClearable
									id={`grafic-type` + id}
									name={"graphic_type"}
									className="input-limits-grafic-options input-select-graphic grafic-type"
									options={graphicOpts}
									onChange={(e, newValue) => {
										setgraphic_type(newValue)
									}}
									value={graphic_type}
									renderInput={(params) => <TextField {...params} />}
								/>
							<div className="visualization-monitor-settings">
							<div className="label-monitor-settings label-visualization">Visualization:</div>
							<span className="monitor-selected-input-label-selects">StrokeWidth:</span>
								<Autocomplete
									disablePortal
									disableClearable
									id={`strokeWidth` + id}
									name="stroke"
									className="input-limits-grafic-options input-select-graphic stroke-width"
									options={strokeOpts}
									onChange={(e, newValue) => {
										setStroke(newValue)
									}}
									value={stroke}
									renderInput={(params) => <TextField {...params} />}
								/>
							<span className="monitor-selected-input-label-selects">Canvas:</span>
								<Autocomplete
									disablePortal
									disableClearable
									id={`canvas` + id}
									name="canvas"
									className="input-limits-grafic-options input-select-graphic canvas-width"
									options={canvasOpts}
									onChange={(e, newValue) => {
										setCanvas(newValue)
									}}
									value={canvas}
									renderInput={(params) => <TextField {...params} />}
								/>
							<span className="monitor-selected-input-label-selects">Color:</span>
							<div className="monitor-selected-checkbox-color">
								<input 
									disabled={!enabled_color}
									className={`monitor-selected-input-color color-line selectColorInput` + id}
									name="color"
									type="color"
									onChange={(e) => {setColor(e.target.value)}}
									value={color}
								/>

								<Checkbox
									sx={{ '&:hover': { bgcolor: 'transparent' }}}
									size="small"
									onChange={(e) => {setEnabled_color(e.target.checked)}}
									checkedIcon={<CheckBoxIcon sx={{color: "#fff"}} /> }
									icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
									checked={enabled_color} 
								/>
							</div>
							</div>
						</div>

						{
						(fnIsMagnitude(monitorData.type) || fnIsState(monitorData.type)) ? "" :
							<div className="monitor-selected-input-Unit-box">

								<GetUnitSelecttype 
									id={id}
									DefaultUnit={monitorData?.unit} 
									unit={unit}
									setUnit={setUnit}
									prefix={prefix}
									setPrefix={setPrefix}
									applyChangesWarning={applyChangesWarning}
								/>

								<div className="label-monitor-settings-pattern">Decimal Pattern:</div>
								<div>
									<label className="monitor-limits-label "> Pattern: </label>
									<LtTooltip
									title={
										<React.Fragment>
										<b className="label-indHlp-tooltip">{"Instructions:"}</b><br />
										<span className="indHlp-vis">{"This option set how many decimals places"}</span><br />
										<span className="indHlp-vis">{"you want to display in the value."}</span><br />
										</React.Fragment>
									}
									placement="left" className="tool-tip-options">
									<HelpIcon className="index-help-icon"/>
									</LtTooltip>
									{
										applyChangesWarning
									}
								</div>
								<Autocomplete
									disablePortal
									disableClearable
									id={`Pattern` + id}
									name="deimnalPattern"
									className="input-limits-grafic-options input-select-pattern deimnalPattern"
									options={patternOpts}
									onChange={(e, newValue) => {
										setDecimal(newValue)
									}}
									value={decimal}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div> 
						}


						</div>
						<div className="indexInput-tooltip-contain">
						{
						(!fnIsArray(monitorData.type))
						?
							''
						:
							<GetIndexArrayModal
								id={ id }
								type={ monitorData.type }
								pos={pos}
								setPos={setPos}
								applyChangesWarning={ applyChangesWarning }
								dimension_x={ monitorData.dimension_x }
								dimension_y={ monitorData.dimension_y }
							/>
						}
						</div>
					</Box>
				</Stack>
			</div>
			</div>

				</div>
			</td>
		</tr>
	);
}

export default SelectedElement;
