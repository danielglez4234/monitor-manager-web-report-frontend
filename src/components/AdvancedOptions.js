// --- React dependencies
import React, { useState }   from 'react';

// --- Dependencies
import * as $ from 'jquery';
import { DatePicker } from 'antd';

import { 
  Accordion,
  AccordionSummary,
  AccordionDetails
} from './uiStyles'

// --- Model Component elements
import { Button, Typography, Tab }        from '@mui/material';
import { TabContext, TabList, TabPanel }  from '@mui/lab';

// --- Icons
import ExpandMoreIcon             from '@mui/icons-material/ExpandMore';
import SettingsIcon               from '@mui/icons-material/Settings';
import InfoRoundedIcon            from '@mui/icons-material/InfoRounded';
import LegendToggleRoundedIcon    from '@mui/icons-material/LegendToggleRounded';
import MultilineChartRoundedIcon  from '@mui/icons-material/MultilineChartRounded';




function AdvancedOptions() {

    const [expanded, setExpanded] = useState('panel1');
    const [axisXTab, setAxisXTab] = useState('1');

    const handleChangeExpandAccordion = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const showAdvanceOptions = () => {
      $(".advanced-options-box").toggleClass("display-none");
      $(".perfrom-query-button-advanced-options").toggleClass("display-none");
    }

    const enableMultiAxis = (checkbox, input) => {
      if ($("." + checkbox).is(":checked")) {
        $("#" + input).removeClass('display-none');
      }else {
        $("#" + input).addClass('display-none');
      }
    }

    const handleTabAxisX = (event, newValue) => {
      setAxisXTab(newValue);
    };


    return(
      <div className="perfrom-query-advanced-options-box">

            <div className="advanced-options-box display-none">
              <div className="close-advance-option-box">
                <p className="close-advance-option" onClick={() => { showAdvanceOptions() }}>X</p>
              </div>
              <div className="container-advance-ooptions">

                <Accordion expanded={expanded === 'panel1'} onChange={handleChangeExpandAccordion('panel1')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography sx={{ width: '90%', flexShrink: 0 }} className="advance-option-label-options" >
                      Multi Axis Y
                    </Typography>
                    <MultilineChartRoundedIcon />
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="advanceSubOptions-infoText">
                      <InfoRoundedIcon />
                      <p>This option will activate position selection input on selected monitors</p>
                    </div>
                    <div className="subOptions-accordion-box">
                      <label className="checkbox-advanceSubOptions label-cont-inputchecbox select-all-checkbox"> Enabled
                        <input onClick={() => {enableMultiAxis('multiAxisY', 'howManyYAxis')}} type="checkbox" className="multiAxisY checkboxMo logarithm-all" />
                        <span className="checkmark"></span>
                      </label>

                      <div id="howManyYAxis" className="display-none">
                        <label className="howManyYAxis-label">YAxis</label>
                        <select id="howManyYAxis-id" className="advance-options-select howManyYAxis">
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                  <Accordion expanded={expanded === 'panel2'} onChange={handleChangeExpandAccordion('panel2')}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '90%', flexShrink: 0 }} className="advance-option-label-options" >
                        Multi Axis X
                      </Typography>
                      <LegendToggleRoundedIcon />
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="advanceSubOptions-infoText">
                        <InfoRoundedIcon />
                        <p>This option will activate position selection input on selected monitors</p>
                      </div>
                      <div className="subOptions-accordion-box">
                        <label className="checkbox-advanceSubOptions label-cont-inputchecbox select-all-checkbox"> Enabled
                          <input onClick={() => { enableMultiAxis('multiAxisX', 'howManyXAxis') }} type="checkbox" className="multiAxisX checkboxMo logarithm-all" />
                          <span className="checkmark"></span>
                        </label>

                        <div id="howManyXAxis" className="display-none">
                          <label className="howManyXAxis-label">XAxis</label>
                          <select id="howManyXAxis-id" className="advance-options-select howManyXAxis">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                      <TabContext value={axisXTab}>
                          <TabList onChange={handleTabAxisX} aria-label="lab API tabs example">
                            <Tab label="Ax.1" value="1" />
                            <Tab label="Ax.2" value="2" />
                            <Tab label="Ax.3" value="3" />
                          </TabList>
                        <TabPanel value="1">
                          Item One
                          <DatePicker
                             id="beginDate"
                             format="DD/MM/YYYY"
                             placeholder="Start Date"
                           />
                           <DatePicker
                             id="endDate"
                             format="DD/MM/YYYY"
                             placeholder="End Date"
                           />
                        </TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                      </TabContext>
                    </AccordionDetails>
                  </Accordion>
              </div>
            </div>

            <Button
              className="perfrom-query-button-advanced-options"
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => { showAdvanceOptions() }}
            >
              Advanced Options
            </Button>

      </div>
    );


}
export default AdvancedOptions;
