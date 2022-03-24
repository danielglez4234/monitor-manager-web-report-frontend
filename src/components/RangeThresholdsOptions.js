// --- React dependencies
import React from 'react';

// --- Dependencies
import * as $         from 'jquery';
import { LtTooltip }  from './uiStyles';

// --- Model Component elements
// import Popover        from '@mui/material/Popover';
import {IconButton, Box} from '@mui/material';

// --- Icons
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DataThresholdingIcon      from '@mui/icons-material/DataThresholding';
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



function RangeThresholdsOptions() {
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
    $('.graphOpt-box2').toggleClass('display-none');
    $('.close_rangeZone2').toggleClass('display-none');
  };

    return(
      <div className="button-general-options">
        <LtTooltip title="Genereal Options settings" placement="top" className="tool-tip-options">
          <IconButton aria-label="settings" onClick={handleClickOpenConf}>
            <DataThresholdingIcon className="settings-generalOptButton"/>
          </IconButton>
        </LtTooltip>

        <div className="close_rangeZone close_rangeZone2 display-none" onClick={handleClickOpenConf}></div>
        <Box className="graphOpt-box graphOpt-box2 display-none" id="graphOpt-sx" sx={{boxShadow: 3}}>
          <div className="graphOpt-label-title">
            <p>Graphic Options</p>
          </div>

          <div className="graphOpt-options-box">
            
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
export default RangeThresholdsOptions;
