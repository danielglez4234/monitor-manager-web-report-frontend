import React, {Fragment} from 'react';
import {
    TextField, 
    Autocomplete, 
    CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

const GetSummarySelect = ({id, monitorData, boxplot, setBoxplot, constraints}) => {
    const intervalOptions = monitorData.summaryConfigs.data.map(x => x.interval)
	const collapseValuesOptions = monitorData.summaryConfigs.values
    
    /*
     * handle onChange for boxplot object state 
     */
    const handleOnChange = (name, value) => {
        setBoxplot(prevState => ({
            ...prevState,
            [name]: value
        }))
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
                                    "Display"
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
                    className="input-limits-grafic-options input-select-prefix"
                    name="interval"
                    options={intervalOptions}
                    onChange={(e, newValue) => {
                        handleOnChange("interval", newValue)
                    }}
                    value={boxplot.interval}
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
                    className="input-limits-grafic-options input-select-prefix"
                    name="onlyCollapseValues"
                    options={collapseValuesOptions}
                    onChange={(e, newValue) => {
                        handleOnChange("collapseValue", newValue)
                    }}
                    value={boxplot.collapseValue}
                    renderInput={(params) => (
                        <TextField {...params} />
                    )}
                />
            </div>
        </div>
     );
}

export default GetSummarySelect;