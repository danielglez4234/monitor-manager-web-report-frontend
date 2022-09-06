import React, {Fragment, useState} from 'react';
import {
    TextField, 
    Autocomplete, 
    CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { isEmpty } from '../../../standarFunctions';
import { getSummaryIntervals, getCollapseValuesOptions } from '../../../../services/services';

const GetSummarySelect = ({id, component, magnitude, boxplot, setBoxplot, constraints}) => {
    const DefaultRest = ["None"]
    const [summaryConfigOptions, setSummaryConfigOptions] = useState([boxplot.summaryConfig]);
	const [collapseValuesOptions, setCollapseValuesOptions] = useState([boxplot.collapseValues]);

    /*
     * handle onChange for boxplot object state 
     */
    const handleOnChange = (name, value) => {
        setBoxplot(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    /*
     * Get summary Intervals
     */
    const loadSummaryIntervals = async () => {
        try {
	        await Promise.resolve(getSummaryIntervals(component, magnitude))
	        .then(res => {
                setSummaryConfigOptions((isEmpty(res)) ? DefaultRest :res)
            })
	        .catch(error => {
                setSummaryConfigOptions(DefaultRest)
                handleOnChange("collapseValues", null)
            })
        } catch (error) {
            console.error(error)
        }
    }

    /*
     * Get collapse values options
     */
    const loadCollapseValuesOptions = async () => {
        try {
            await Promise.resolve(getCollapseValuesOptions())
            .then(res => {
                setCollapseValuesOptions((isEmpty(res)) ? DefaultRest :res)
            })
            .catch(error => {
                console.error(error)
                setCollapseValuesOptions(DefaultRest)
            })
        } catch (error) {
            console.error(error)
        }
    }




    return ( 
        <div className="monitor-selected-select-box">
            <div className="checkbox-monitor-selected">
                <div className="label-monitor-settings">BoxPlot:</div>
                <div className="input-settings-checkbox">
                    <FormControlLabel
                        sx={{margin: "-2px 0px"}}
                        label={
                            <Fragment>
                                <b className="checkbox-monitor-selected-label">
                                {
                                    (!boxplot.onlyCollapseValues) ? "Display" : "Only Values"
                                }
                                </b>
                            </Fragment>
                        }
                        control={
                            <Checkbox
                                sx={{ '&:hover': { bgcolor: 'transparent' }}}
                                size="small"
                                onClick={() => {
                                    constraints({apply_to: id})
                                }}
                                onChange={(e) => {
                                    handleOnChange("isEnable", e.target.checked)
                                    if(boxplot.onlyCollapseValues)
                                        handleOnChange("onlyCollapseValues", false)
                                }}
                                checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
                                icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                                checked={boxplot.isEnable} 
                            />
                        }
                    />
                </div>
            </div>

            <div>
			    <span className="monitor-selected-input-label-selects label-selects-grafic-type">Summary Intervals:</span>
		    </div>
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    disabled={!boxplot.isEnable}
                    className="input-limits-grafic-options input-select-prefix"
                    name="summaryIntervals"
                    options={summaryConfigOptions}
                    onOpen={() => { 
                        console.log("sdfuoñsdgñaouifnñsad", summaryConfigOptions)
                        if(summaryConfigOptions.length <= 1)
                            loadSummaryIntervals()
                    }}
                    onChange={(e, newValue) => {
                        handleOnChange("summaryConfig", newValue)
                    }}
                    value={boxplot.summaryConfig}
                    renderInput={(params) => (
                        <TextField {...params} />
                    )}
                />
            </div>

            <div className="checkbox-monitor-selected">
                <div className="input-settings-checkbox">
                    <FormControlLabel
                        sx={{margin: "-2px 0px"}}
                        label={
                            <Fragment>
                                <b className="checkbox-monitor-selected-label">{"Collapse value"}</b>
                            </Fragment>
                        }
                        control={
                            <Checkbox
                                sx={{ '&:hover': { bgcolor: 'transparent' }}}
                                size="small"
                                name="onlyCollapseValues"
                                onChange={(e) => {
                                    handleOnChange("onlyCollapseValues", e.target.checked)
                                    if(boxplot.isEnable)
                                        handleOnChange("isEnable", false)
                                }}
                                checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
                                icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                                checked={boxplot.onlyCollapseValues} 
                            />
                        }
                    />
                </div>
            </div>

            <div>
			    <span className="monitor-selected-input-label-selects label-selects-grafic-type">Collapse Values:</span>
		    </div>
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    disabled={!boxplot.onlyCollapseValues}
                    className="input-limits-grafic-options input-select-prefix"
                    name="onlyCollapseValues"
                    options={collapseValuesOptions}
                    onOpen={() => { 
                        if(collapseValuesOptions.length <= 1)
                            loadCollapseValuesOptions()
                    }}
                    onChange={(e, newValue) => {
                        handleOnChange("collapseValues", newValue)
                    }}
                    value={boxplot.collapseValues}
                    renderInput={(params) => (
                        <TextField {...params} />
                    )}
                />
            </div>
        </div>
     );
}

export default GetSummarySelect;