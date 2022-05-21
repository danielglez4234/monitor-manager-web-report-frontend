// --- Dependecies
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as $ from 'jquery';
import {
  fnIsArray,
  fnIsMagnitude
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




function SelectedElement({ id, monitorData, component, menuHandle, diActivateReload}) {
		
	const loadWhileGetData = useSelector(state => state.loadingGraphic);
	const [disableWhileSearching, setDisableWhileSearching] = useState(false);

	const [booleanValue, setBooleanValue] = useState({
		logarithm: false,
		curved: false,
		filled: false,
		enabled_color: false
	});
	const onChangeBoolean = (e) => {
		const name = e.target.name
		const value = e.target.value
		setBooleanValue({
			...booleanValue,
			[name]: value
		})
	}

	const [stringValue, setStringValue] = useState({
		limit_max: "",
		limit_min: "",
		color: "",
		pos: ""
	});
	const onChangeString = (e) => {
		const name = e.target.name
		const value = e.target.value
		setStringValue({
			...stringValue,
			[name]: value
		})
	}

	const [arrayValue, setArrayValue] = useState({
		graphicType: null,
		stroke: null,
		canvas: null,
		prefix: null,
		unit: null,
		decimal_pattern: null,
	});
	const onChangeArray = (e, newValue) => {
		const name = e.target.name
		setArrayValue({
			...arrayValue,
			[name]: newValue
		})
	}




	/*
	 * 'loadWhileGetData' will be set to true when the data has arrive, and then buttons will be active again
	 */
	useEffect(() => {
		setDisableWhileSearching(loadWhileGetData)
	}, [loadWhileGetData]);

	/*
	 * Set oprions 'select' inputs 
	 */
	const graphicOpts = [
		"Line Series",
		"Step Line Series"
	];
	const strokeOpts = [
		"Light",
		"Medium",
		"Bold",
		"Bolder"
	];
	const canvasOpts = [
		"Default",
		"Dotted",
		"Dashed",
		"Large Dashed",
		"Dotted Dashed"
	];
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
	];

	/*
	 * Handle remove item from list 
	 */
	const onRemove = (id) => {
		menuHandle(id, 'diselectMonitor');
		diActivateReload();
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
	 * Get Icons
	 */
	const icontype = <GetMonitordIconType type={ monitorData.type } />;


	/*
	 * If the button is alredy active when a new monitor is selected, apply the changes
	 */
	let lessDetailIfActive;
	if ($('#lessDetail-icon').hasClass('color-menu-active')) {
		lessDetailIfActive = 'display-none';
	}

	/*
	 * Handle monitor settings options OPEN popover
	 */
	const handleClickOpenSettings = (id) => {
		const offset = $('.id-TuneIcon-sett' + id).offset();
		$('.id-mon-sett' + id).toggleClass('display-none').offset({ top: offset.top, right: offset.right});
		$('.close-settingsMon' + id).toggleClass('display-none');
	};

	/*
	 * Handle disabled color input
	 */
	const handleClickDisabledColor = (id) => {
		if ($('.colorInput' + id).is(":checked")) {
		$('.selectColorInput' + id).prop('disabled', false);
		}else {
		$('.selectColorInput' + id).prop('disabled', true);
		}
	}
  
	return(
		<tr className={`tr-monMag${id}`} id={id}>
			<td>
			<div className="monitor-selected-td-container">
				<Stack className={`monitor-selected-info_component_id ${lessDetailIfActive}`} direction="row">
					<div className="monitor-selected-info-component">
						<span>{ component }</span>
					</div>
					<div className="monitor-selected-info">
						<span>version: { monitorData.version } - </span>
						{ 
							(fnIsMagnitude(monitorData.type)) ?
							<>              
								<span>MagnitudeType: { (monitorData?.magnitudeType?.name) ? monitorData.magnitudeType.name : ""} - </span>
							</>
							:
							<>              
								<span>unit: <span className="default-unit">{ monitorData.unit }</span> - </span>
							</>
						}
						<span>type: { monitorData.type } - </span>
						<span>id: { id }</span>
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

					<IconButton onClick={() => {handleClickOpenSettings(id)}} arai-label="tune-setings" className={`settings-selected-monitor id-TuneIcon-sett` + id}>
						<TuneIcon />
					</IconButton>

					<div className={`close_rangeZone-monitor-settings display-none close-settingsMon` + id} onClick={() => {handleClickOpenSettings(id)}}></div>
					<Box className={`setting-selectd-monitor-options-box display-none id-mon-sett` + id} id="mon-settings-sx" sx={{boxShadow: 3}}>
					<div className="monitor-selected-select-contain">
						<div className="monitor-selected-select-box">

						<div className="checkbox-monitor-selected">
							<div className="label-monitor-settings">Presentation:</div>
							<div className="input-settings-checkbox">
							<label className="label-cont-inputchecbox settings-checkbox-presnetation">
								logarithm
								<input
									type="checkbox"
									name="logarithm"
									onChange={onChangeBoolean}
									value={booleanValue.logarithm}
									className="checkboxMo checkboxMo-monitor logarithm"
								/>
								<span className="checkmark"></span>
							</label>
								<label className="label-cont-inputchecbox settings-checkbox-presnetation">
								curved
								<input
									type="checkbox"
									name="curved"
									onChange={onChangeBoolean}
									value={booleanValue.curved}
									className="checkboxMo checkboxMo-monitor curved"
								/>
							<span className="checkmark"></span>
							</label>
							<label className="label-cont-inputchecbox settings-checkbox-presnetation">
								filled
								<input
								type="checkbox"
								name="filled"
								onChange={onChangeBoolean}
								value={booleanValue.filled}
								className="checkboxMo checkboxMo-monitor filled"
								/>
							<span className="checkmark"></span>
							</label>
							{/*<label className="label-cont-inputchecbox settings-checkbox-presnetation">
								dotted
								<input type="checkbox" className="checkboxMo checkboxMo-monitor dotted" />
								<span className="checkmark"></span>
							</label>*/}
							</div>
						</div>

						<div className="limtis-monnitor-settings-box">
							<div className="label-monitor-settings">Limits:</div>
							<div className="limtis-monnitor-settings-inputs">
							<label className="monitor-limits-label "> Max: </label>
							<input
								type="text"
								max="9999999"
								min="-9999999"
								placeholder="0.."
								name="limit_max"
								onChange={onChangeString}
								value={stringValue.limit_max}
								className="input-limits-grafic-options yaxisMax"
							/>
							<label className="monitor-limits-label"> Min: </label>
							<input
								type="text"
								max="9999999"
								min="-9999999"
								placeholder="0.."
								name="limit_min"
								onChange={onChangeString}
								value={stringValue.limit_min}
								className="input-limits-grafic-options yaxisMin"
							/>
							</div>
						</div>
						</div>

						<div className="monitor-selected-input-box">
							<div className="label-monitor-settings">Graphic Type:</div>

							<span className="monitor-selected-input-label-selects label-selects-grafic-type">Grafic Type:</span>
							<Autocomplete
								disablePortal // --> disabled entrys not related with the select
								// freeSolo
								disableClearable
								id={`grafic-type` + id}
								name={"graphicType"}
								className="input-limits-grafic-options input-select-graphic grafic-type"
								options={graphicOpts}
								defaultValue={graphicOpts[0]}
								onChange={(e, newValue) => {onChangeArray(e, newValue)}}
								value={arrayValue.graphicType}
								renderInput={(params) => <TextField {...params} />}
							/>

							<div className="visualization-monitor-settings">
							<div className="label-monitor-settings label-visualization">Visualization:</div>
							<span className="monitor-selected-input-label-selects">StrokeWidth:</span>
							<Autocomplete
								disablePortal // --> disabled entrys not related with the select
								// freeSolo
								disableClearable
								id={`strokeWidth` + id}
								name="stroke"
								className="input-limits-grafic-options input-select-graphic stroke-width"
								options={strokeOpts}
								defaultValue={strokeOpts[0]}
								onChange={(e, newValue) => {onChangeArray(e, newValue)}}
								value={arrayValue.stroke}
								renderInput={(params) => <TextField {...params} />}
							/>
							<span className="monitor-selected-input-label-selects">Canvas:</span>
							<Autocomplete
								disablePortal // --> disabled entrys not related with the select
								// freeSolo
								disableClearable
								id={`canvas` + id}
								name="canvas"
								className="input-limits-grafic-options input-select-graphic canvas-width"
								options={canvasOpts}
								defaultValue={canvasOpts[0]}
								onChange={(e, newValue) => {onChangeArray(e, newValue)}}
								value={arrayValue.canvas}
								renderInput={(params) => <TextField {...params} />}
							/>
							<span className="monitor-selected-input-label-selects">Color:</span>
							<div className="monitor-selected-checkbox-color">
								<input 
									disabled={booleanValue.enabled_color}
									onChange={onChangeString}
									value={stringValue.color}
									className={`monitor-selected-input-color color-line selectColorInput` + id} 
									type="color"
								/>
								<label onClick={() => { handleClickDisabledColor(id)} } className="label-cont-inputchecbox settings-checkbox-presnetation set-color-settings-checkbox">
								<input 
									type="checkbox"
									onChange={onChangeBoolean}
									value={booleanValue.enabled_color}
									className={`checkboxMo checkboxMo-monitor checkbox-color colorInput` + id} 
								/>
								<span className="checkmark"></span>
								</label>
							</div>
							</div>
						</div>

						{
						(fnIsMagnitude(monitorData.type)) ? "" :
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
									unit={(monitorData.unit === undefined) ? "None" : monitorData.unit} 
									applyChangesWarning={ applyChangesWarning }
									prefixValue={arrayValue.prefix}
									unitValue={arrayValue.unit}
									valueOnChange={setArrayValue}
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
									disablePortal // --> disabled entrys not related with the select
									// freeSolo
									disableClearable
									id={`Pattern` + id}
									name="deimnalPattern"
									className="input-limits-grafic-options input-select-pattern deimnalPattern"
									options={patternOpts}
									defaultValue={patternOpts[0]}
									onChange={(e, newValue) => {onChangeArray(e, newValue)}}
									value={arrayValue.decimal_pattern}
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
