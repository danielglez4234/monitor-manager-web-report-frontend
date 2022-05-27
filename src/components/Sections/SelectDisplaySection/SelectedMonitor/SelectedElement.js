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
// --- Model Component elements
import {Stack, IconButton, Box, TextField, Autocomplete } from '@mui/material';

// --- Icons
import CloseIcon                  from '@mui/icons-material/Close';
import HelpIcon                   from '@mui/icons-material/Help';
import InfoRoundedIcon            from '@mui/icons-material/InfoRounded';

// --- Get other Components
import GetMonitordIconType  from './GetMonitordIconType';
import GetIndexArrayModal   from './GetIndexArrayModal';
import GetUnitSelecttype    from './GetUnitSelecttype';
import TuneIcon             from '@mui/icons-material/Tune';
import AnnouncementIcon     from '@mui/icons-material/Announcement';

/*
 * Set oprions 'select' inputs 
 */
const graphicOpts = [
	"Line Series",
	"Step Line Series"
]
const strokeOpts = [
	"Light",
	"Medium",
	"Bold",
	"Bolder"
]
const canvasOpts = [
	"Default",
	"Dotted",
	"Dashed",
	"Large Dashed",
	"Dotted Dashed"
]
const patternOpts = [
	"Default",
	"0.#",
	"0.##",
	"0.###",
	"0.####",
	"0.#####",
	"0.######",
	"0.#######",
	"0.########"
]
const unitOpt = [ // dynamic
	"Default"
] 
const prefixOpt = [ // dynamic
	"Default"
]

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



function SelectedElement({ id, monitorData, component, menuHandle, diActivateReload}) {
		
	const loadWhileGetData = useSelector(state => state.loadingGraphic)
	const [disableWhileSearching, setDisableWhileSearching] = useState(false)

	const [logarithm, setLogarithm] = useState(false);
	const [curved, setCurved] = useState(false);
	const [filled, setFilled] = useState(false);
	const [enabled_color, setEnabled_color] = useState(false);

	const [limit_max, setLimit_max] = useState("");	
	const [limit_min, setLimit_min] = useState("");
	const [color, setColor] = useState("");
	const [pos, setPos] = useState("");

	const [graphic_type, setGraphic_type] = useState(graphicOpts[0])
	const [stroke, setStroke] = useState(strokeOpts[0])
	const [canvas, setCanvas] = useState(canvasOpts[0])
	const [unit, setUnit] = useState(unitOpt[0])
	const [prefix, setPrefix] = useState(prefixOpt[0])
	const [decimal, setDecimal] = useState(patternOpts[0])


	/*
	 * handle get options  
	 */
	const getOptions = () => {
		return {
			options: {
				logarithm,
				curved,
				filled,
				limit_max,
				limit_min,
				graphic_type,
				stroke,
				canvas,
				enabled_color,
				color,
				pos:	 (fnIsArray(monitorData.type)) ? pos : undefined, // optional field
				prefix:  (prefix === "Default") ? undefined : prefix,     // optional field
				unit:  	 (unit === "Default") ? undefined : unit,		  // optional field
				decimal: (decimal === "Default") ? undefined : decimal	  // optional field
			}
		}
	}

	/*
	 *	call save options  
	 */
	const saveOptions = () => {
		menuHandle(id, getOptions(), 'saveMonitorOptions')
	}

	/*
	 * store monitor selected options on redux variable
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
		menuHandle(id, null, 'diselectMonitor')
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
						<span>{ component }</span>
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
								<span>type: { monitorData.type } - </span>
								<span>id: { id }</span>
							</>
						}
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
								(!fnIsMagnitude(monitorData.type)) ?
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
										className="checkboxMo checkboxMo-monitor logarithm"
										name="logarithm"
										type="checkbox"
										onChange={(e) => {setLogarithm(e.target.checked)}}
										value={logarithm}
									/>
									<span className="checkmark"></span>
								</label>
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
									curved
									<input
										className="checkboxMo checkboxMo-monitor curved"
										name="curved"
										type="checkbox"
										onChange={(e) => {setCurved(e.target.checked)}}
										value={curved}
									/>
									<span className="checkmark"></span>
								</label>
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
									filled
									<input
										className="checkboxMo checkboxMo-monitor filled"
										name="filled"
										type="checkbox"
										onChange={(e) => {setFilled(e.target.checked)}}
										value={filled}
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
									className={`checkboxMo checkboxMo-monitor checkbox-color colorInput` + id} 
									name="enabled_color"
									type="checkbox"
									onChange={(e) => {setEnabled_color(e.target.checked)}}
									value={enabled_color}
								/>
								<span className="checkmark"></span>
								</label>
							</div>
							</div>
						</div>

						{
						(fnIsMagnitude(monitorData.type) || fnIsState(monitorData.type)) ? "" :
							<div className="monitor-selected-input-Unit-box">
								<div>
									<div className="label-monitor-settings">Unit Conversion:</div>
									<span className="monitor-selected-input-label-selects label-selects-grafic-type">Conversions:</span>
									{
										applyChangesWarning
									}
								</div>

								<GetUnitSelecttype 
									id={id}
									DefaultUnit={monitorData?.unit} 
									unit={unit}
									setUnit={setUnit}
									prefix={prefix}
									setPrefix={setPrefix}
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
