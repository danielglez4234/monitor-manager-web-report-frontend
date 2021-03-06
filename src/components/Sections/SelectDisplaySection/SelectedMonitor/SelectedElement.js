// --- Dependecies
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as $ from 'jquery';
import {
  fnIsArray,
  fnIsMagnitude,
  fnIsState
}
from '../../../standarFunctions';
import { LtTooltip } from '../../../../commons/uiStyles';
import {Stack, IconButton, Box, TextField, Autocomplete } from '@mui/material';
import CloseIcon           from '@mui/icons-material/Close';
import HelpIcon            from '@mui/icons-material/Help';
import InfoRoundedIcon     from '@mui/icons-material/InfoRounded';
import GetMonitordIconType from './GetMonitordIconType';
import GetIndexArrayModal  from './GetIndexArrayModal';
import GetUnitSelecttype   from './GetUnitSelecttype';
import TuneIcon            from '@mui/icons-material/Tune';
import AnnouncementIcon    from '@mui/icons-material/Announcement';

/*
 * Set oprions 'select' inputs 
 */
const graphicOpts = [ "Line Series", "Step Line Series" ]
const strokeOpts  = [ "Light", "Medium", "Bold", "Bolder" ]
const canvasOpts  = [ "Default", "Dotted", "Dashed", "Large Dashed", "Dotted Dashed"]
const patternOpts = [ "Default", "0.#", "0.##", "0.###", "0.####", "0.#####", "0.######", "0.#######", "0.########" ]
const unitOpt     = [ "Default" ]
const prefixOpt   = [ "Default" ]

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
 * If the button is alredy active when a new monitor is selected, apply the changes
 */
let lessDetailIfActive;
if ($('#lessDetail-icon').hasClass('color-menu-active')) {
	lessDetailIfActive = 'display-none'
}

/*
 * Handle monitor settings options OPEN popover
 */
const handleClickOpenSettings = (id) => {
	const offset = $('.id-TuneIcon-sett' + id).offset()
	$('.id-mon-sett' + id).toggleClass('display-none').offset({ top: offset.top, right: offset.right})
	$('.close-settingsMon' + id).toggleClass('display-none')
}

const checkLog 		   = (value, id) => {$(".logarithm"+id).prop('checked', value)}
const checkCurved 	   = (value, id) => {$(".curved"+id).prop('checked', value)}
const checkFilled 	   = (value, id) => {$(".filled"+id).prop('checked', value)}
const checkEnableColor = (value, id) => {$(".enabled_color"+id).prop('checked', value)}


function SelectedElement({ id, monitorData, menuHandle, diActivateReload}) {
	const loadWhileGetData = useSelector(state => state.loadingGraphic)
	const editing = useSelector(state => state.editingQuery) // refactor =>  eliminar editing
	const [disableWhileSearching, setDisableWhileSearching] = useState(false)

	/*
	 * Editing or Normal state conditions
	 */
	const logarithm_St = 	(monitorData?.options?.logarithm) ? monitorData?.options?.logarithm : false
	const curved_St = 		(monitorData?.options?.curved) ? monitorData?.options?.curved : false
	const filled_St = 		(monitorData?.options?.filled) ? monitorData?.options?.filled : false
	const enabled_color_St =(monitorData?.options?.enabled_color) ? monitorData?.options?.enabled_color : false
	
	const limit_max_St = 	(monitorData?.options?.limit_max) ? monitorData?.options?.limit_max : ""
	const limit_min_St = 	(monitorData?.options?.limit_min) ? monitorData?.options?.limit_min : ""
	const color_St = 		(monitorData?.options?.color) ? monitorData?.options?.color : ""
	const pos_St = 			(monitorData?.options?.pos) ? monitorData?.options?.pos : ""

	const isEnumOrMonitor = (fnIsMagnitude(monitorData.type)) ?  graphicOpts[1] : graphicOpts[0];
	const graphic_type_St = (monitorData?.options?.graphic_type) ? monitorData?.options?.graphic_type : isEnumOrMonitor
	const stroke_St = 		(monitorData?.options?.stroke) ? monitorData?.options?.stroke : strokeOpts[0]
	const canvas_St = 		(monitorData?.options?.canvas) ? monitorData?.options?.canvas : canvasOpts[0]
	const unit_St = 		(monitorData?.options?.unit) ? monitorData?.options?.unit : unitOpt[0]
	const prefix_St = 		(monitorData?.options?.prefix) ? monitorData?.options?.prefix : prefixOpt[0]
	const decimal_St = 		(monitorData?.options?.decimal) ? monitorData?.options?.decimal : patternOpts[0]

	/*
	 * STATES
	 */
	const [logarithm, setLogarithm] = useState(logarithm_St)
	const [curved, setCurved] = useState(curved_St)
	const [filled, setFilled] = useState(filled_St)
	const [enabled_color, setEnabled_color] = useState(enabled_color_St)
	const [limit_max, setLimit_max] = useState(limit_max_St)
	const [limit_min, setLimit_min] = useState(limit_min_St)
	const [color, setColor] = useState(color_St)
	const [pos, setPos] = useState(pos_St)
	const [graphic_type, setGraphic_type] = useState(graphic_type_St)
	const [stroke, setStroke] = useState(stroke_St)
	const [canvas, setCanvas] = useState(canvas_St)
	const [unit, setUnit] = useState(unit_St)
	const [prefix, setPrefix] = useState(prefix_St)
	const [decimal, setDecimal] = useState(decimal_St)

	// => refactor functions
	useEffect(() => {
			checkLog(monitorData?.options?.logarithm , id)
			checkCurved(monitorData?.options?.curved, id)
			checkFilled(monitorData?.options?.filled, id)
			checkEnableColor(monitorData?.options?.enabled_color, id)
	}, [editing]);

	/*
	 * handle get options
	 */
	const getOptions = () => {
		return {
			options: {
				logarithm: logarithm,
				curved: curved,
				filled: filled,
				limit_max: limit_max,
				limit_min: limit_min,
				graphic_type: graphic_type,
				stroke: stroke,
				canvas: canvas,
				enabled_color: enabled_color,
				color: color,
				pos: (fnIsArray(monitorData.type)) ? pos : null,
				prefix: fnIfExistDefault(prefix),
				unit: fnIfExistDefault(unit),
				decimal: fnIfExistDefault(decimal)
			}
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
	const saveOptions = () => {
		menuHandle('saveOptions', id, getOptions())
	}

	/*
	 * store the selected monitor options in the redux variable
	 */
	useEffect(() => {
		if(monitorData){
			saveOptions()
		}
	}, []);

	/*
	 * 'loadWhileGetData' will be set to true when the data has arrive, and then buttons will be active again
	 */
	useEffect(() => {
		setDisableWhileSearching(loadWhileGetData)
	}, [loadWhileGetData]);

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
	const icontype = <GetMonitordIconType type={ monitorData.type } />

  
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
					disabled={disableWhileSearching} 
				>
					<CloseIcon  />
				</IconButton>
				{
					icontype
				}
			</div>

			<div className="monitor-seleted-item-box">

				<Stack className="monitor-seleted-item" direction="row">
					<div className="monitor-selected-item-title-box">
						<p className="monitor-selected-item-title monitor-name">
							{
								(!fnIsMagnitude(monitorData.type) && !fnIsState(monitorData.type)) ?
								<>
									<LtTooltip
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
							saveOptions();
						}}></div>
					<Box className={`setting-selectd-monitor-options-box display-none id-mon-sett` + id} id="mon-settings-sx" sx={{boxShadow: 3}}>
					<div className="monitor-selected-select-contain">
						<div className="monitor-selected-select-box">

						<div className="checkbox-monitor-selected">
							<div className="label-monitor-settings">Presentation:</div>
							<div className="input-settings-checkbox">
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
									logarithm
									<input
										className={"checkboxMo checkboxMo-monitor logarithm logarithm"+id} // REFACTOR:
										name="logarithm"
										type="checkbox"
										onChange={(e) => {setLogarithm(e.target.checked)}}
										value={logarithm}
										onClick={() => {checkLog(!logarithm, id)}}
									/>
									<span className="checkmark"></span>
								</label>
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
									curved
									<input
										className={"checkboxMo checkboxMo-monitor curved curved"+id} // REFACTOR:
										name="curved"
										type="checkbox"
										onChange={(e) => {setCurved(e.target.checked)}}
										value={curved}
										onClick={() => {checkCurved(!curved, id)}}
									/>
									<span className="checkmark"></span>
								</label>
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
									filled
									<input
										className={"checkboxMo checkboxMo-monitor filled filled"+id} // REFACTOR:
										name="filled"
										type="checkbox"
										onChange={(e) => {setFilled(e.target.checked)}}
										value={filled}
										onClick={() => {checkFilled(!filled, id)}}
									/>
									<span className="checkmark"></span>
								</label>
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
										setGraphic_type(newValue)
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
								<label className="label-cont-inputchecbox settings-checkbox-presnetation set-color-settings-checkbox">
								<input 
									className={`checkboxMo checkboxMo-monitor checkbox-color colorInput` + id + " enabled_color"+id}
									name="enabled_color"
									type="checkbox"
									onChange={(e) => {setEnabled_color(e.target.checked)}}
									value={enabled_color}
									onClick={() => {checkEnableColor(!enabled_color, id)}}
								/>
								<span className="checkmark"></span>
								</label>
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
