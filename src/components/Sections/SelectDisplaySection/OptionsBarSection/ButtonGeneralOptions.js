import React from 'react';
import * as $         from 'jquery';
import { LtTooltip }  from '../../../../commons/uiStyles';
import {IconButton, Box} from '@mui/material';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import SettingsIcon              from '@mui/icons-material/Settings';
import Grid3x3Icon               from '@mui/icons-material/Grid3x3';
import FilterFramesIcon          from '@mui/icons-material/FilterFrames';
import TimelineIcon              from '@mui/icons-material/Timeline';
import LegendToggleIcon          from '@mui/icons-material/LegendToggle';
import BallotIcon                from '@mui/icons-material/Ballot';
import MoveDownIcon              from '@mui/icons-material/MoveDown';
import AutoGraphIcon             from '@mui/icons-material/AutoGraph';
import AnimationIcon             from '@mui/icons-material/Animation';
import StackedBarChartIcon       from '@mui/icons-material/StackedBarChart';
import SelectAllIcon             from '@mui/icons-material/SelectAll';
import Looks3SharpIcon           from '@mui/icons-material/Looks3Sharp';



function ButtonGeneralOptions() {
    /*
     * Handle disabled incompatible options
     */
	const handleIncompatible = (name) => {
		if (name === "microTheme") 
		{
			if ($(".microTheme").is(":checked"))
			{
				$(".microIncomp").addClass("disabledIncompatible");
				if ($(".grid").is(":checked") || $(".animations").is(":checked"))
				{
					$(".grid").prop('checked', false);
					$(".animations").prop('checked', false);
				}
			}
			else {
				$(".microIncomp").removeClass("disabledIncompatible");
			}
		}
		else if (name === "legends") 
		{
			if ($(".legends").is(":checked"))
			{
				$(".legendIncomp").removeClass("disabledIncompatible");
				if ($(".legendsMonitorName").is(":checked"))
				{
					$(".legendsMonitorName").prop('checked', false);
				}
			}
			else {
				$(".legendIncomp").addClass("disabledIncompatible");
			}
		}
	}

	/*
	 * Reset all options
	 */
	const resetOptios = () => {
		$(".graphCheckbox").prop('checked', false);
		$(".graphOpt-inputLimits-checbox").val('');
		$(".grid").prop('checked', true);
		$(".tooltip").prop('checked', true);
		$(".legends").prop('checked', true);
		$(".legends-bottom").prop('checked', true);
		handleIncompatible("microTheme");
		handleIncompatible("legends");
	}

	/*
	 * handle check uncheck all inputs checkbox
	 */
	const handleCheckCheckboxes = () => {
		$(".graphCheckbox").prop('checked', false);
		handleIncompatible("microTheme");
		handleIncompatible("legends");
	}

	/*
	 * Handle graphic options OPEN popover
	 */
	const handleClickOpenConf = () => {
		$('.graphOpt-box').toggleClass('display-none');
		$('.close_rangeZone').toggleClass('display-none');
	};

    return(
		<div className="button-general-options">
			<LtTooltip title="Genereal Options settings" placement="top" className="tool-tip-options">
				<IconButton aria-label="settings" onClick={handleClickOpenConf}>
					<SettingsIcon className="settings-generalOptButton"/>
				</IconButton>
			</LtTooltip>

			<div className="close_rangeZone display-none" onClick={handleClickOpenConf}></div>
			<Box className="graphOpt-box display-none" id="graphOpt-sx" sx={{boxShadow: 3}}>
				<div className="graphOpt-label-title">
					<p>Graphic Options</p>
				</div>

				<div className="graphOpt-options-box">
					<div className="graphOpt-flex-column">
					<div className="graphOpt-title-Limitsection graphOpt-label-headers">
						View:
					</div>
						<div className="graphOpt-listOption-checbox">
						<div className="flex-row input-grahOpt-margin">
							<label className="label-cont-inputchecbox microIncomp graphOpt-label-cont-inputcheckbox">
								Show Grid
								<input defaultChecked type="checkbox" name="grahpGrid" className="checkboxMo graphCheckbox grid" />
							<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<Grid3x3Icon />
						</div>
						<div className="flex-row input-grahOpt-margin">
							<label className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
								Show Tooltip
							<input defaultChecked type="checkbox"name="grahpTooltip" className="checkboxMo graphCheckbox tooltip" />
							<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<FilterFramesIcon className="rotate90" />
						</div>
						<div className="flex-row input-grahOpt-margin">
							<label className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
								Gaps in data
							<input type="checkbox"name="grahpTooltip"  className="checkboxMo graphCheckbox conenctLines" />
							<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<TimelineIcon />
						</div>
						<div className="flex-row input-grahOpt-margin">
							<label className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
								Group Data
							<input type="checkbox"name="grahpTooltip"  className="checkboxMo graphCheckbox groupData" />
							<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<AutoGraphIcon />
						</div>
						</div>
					</div>

					<div className="graphOpt-flex-column">
						<div className="graphOpt-title-Limitsection graphOpt-label-headers">
							Graphic Limits:
						</div>
						<div className="graphOpt-listOption-limits">
							<label className="graphOpt-listOption-limits-Labels">
								Min
								<input type="text" placeholder="0.." className="graphOpt-inputLimits-checbox limitMin" />
							</label>

							<label className="graphOpt-listOption-limits-Labels">
								Max
								<input type="text" placeholder="0.." className="graphOpt-inputLimits-checbox limitMax" />
							</label>
						</div>

						<div className="graphOpt-box-perfomanceSection">
							<div className="graphOpt-title-perfomanceSection graphOpt-label-headers">
								Performance:
							</div>
							<div className="flex-row">
								<label className="label-cont-inputchecbox microIncomp graphOpt-label-cont-inputcheckbox">
									Toggle Animations
								<input type="checkbox"name="grahpTooltip" className="checkboxMo graphCheckbox animations" />
								<span className="checkmark graphOpt-checkmark"></span>
								</label>
								<AnimationIcon />
							</div>
							<div className="flex-row">
								<label onClick={() => {handleIncompatible("microTheme")}} className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
									Micro Theme
								<input type="checkbox"name="grahpTooltip"  className="checkboxMo graphCheckbox microTheme" />
								<span className="checkmark graphOpt-checkmark"></span>
								</label>
								<StackedBarChartIcon />
							</div>
						</div>
					</div>

					<div className="graphOpt-flex-column">
						<div className="graphOpt-title-Limitsection graphOpt-label-headers">
							Legends:
						</div>
						<div className="flex-row input-grahOpt-margin">
							<label onClick={() => {handleIncompatible("legends")}} className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
								Show Legends
								<input defaultChecked type="checkbox" name="grahpTooltip" className="checkboxMo graphCheckbox legends" />
								<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<LegendToggleIcon />
						</div>
						<div className="flex-row input-grahOpt-margin">
							<label className="label-cont-inputchecbox legendIncomp graphOpt-label-cont-inputcheckbox">
								Only monitor Name
								<input type="checkbox" name="grahpTooltip" className="checkboxMo graphCheckbox legendsMonitorName" />
								<span className="checkmark graphOpt-checkmark"></span>
							</label>
							<BallotIcon />
						</div>
						<div className="flex-row input-grahOpt-margin">
							<input defaultChecked id="BottonCont" type="radio" value="bottom" name="legendCont" className="legend-container legends-bottom" />
							<label htmlFor="BottonCont" className="label-cont-inputchecbox graphOpt-label-radio graphOpt-label-cont-inputcheckbox">
								<p className="label-legend-radio-text">Bottom container</p>
								<MoveDownIcon />
							</label>
						</div>
						<div className="flex-row input-grahOpt-margin">
							<input id="RightCont" type="radio" value="right" name="legendCont" className="legend-container" />
							<label  htmlFor="RightCont" className="label-cont-inputchecbox graphOpt-label-radio graphOpt-label-cont-inputcheckbox">
								<p className="label-legend-radio-text">Right container</p>
								<MoveDownIcon className="rotate270"/>
							</label>
						</div>
					</div>


					<div className="graphOpt-flex-column">
						<div className="graphOpt-title-Limitsection graphOpt-label-headers">
						Number Format:
						</div>
						<div className="flex-row graphOpt-scitific-notation">
						<label className="label-cont-inputchecbox graphOpt-label-cont-inputcheckbox">
							Scientific Notation
							<input defaultChecked type="checkbox"name="grahpTooltip"  className="checkboxMo graphCheckbox scientific-notation" />
							<span className="checkmark graphOpt-checkmark"></span>
						</label>
						<Looks3SharpIcon className="rotate180"/>
						</div>
						{/* <div className="graphOpt-listOption-limits">
						<label className="graphOpt-listOption-limits-Labels">
							Format
							<input id="decimalPattern" type="text" placeholder="00.##" className="graphOpt-inputLimits-checbox numberFormat" />
						</label>
						</div> */}
					</div>
					
				</div>

				<div className="graphOpt-action-buttons">
					<div className="graphOpt-action-checkboxButtons">
						<SelectAllIcon onClick={() => { handleCheckCheckboxes() } }/>
					</div>
					<div className="graphOpt-action-resetButton">
						<SettingsBackupRestoreIcon onClick={() => { resetOptios() } }/>
					</div>
				</div>
			</Box>

		</div>
    );
}
export default ButtonGeneralOptions;
