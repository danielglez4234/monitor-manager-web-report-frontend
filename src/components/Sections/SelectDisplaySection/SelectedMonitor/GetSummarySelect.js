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

const GetSummarySelect = ({boxplot, setBoxplot}) => {
    const loading = Boolean()
    const summaryOptions = ["hola", "test", "prog", "foi", "djn"]
    const collapseValuseOptions = ["max", "min", "q1", "q3", "mean"]

    const handleOnChange = (name, value) => {
        setBoxplot(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    /*
     * Get summary Intervals
     */
    const getSummaryIntervals = () => {
        // Promise.resolve()
        // .then((res) => {
        //     setSummaryIntervals(handleOnChange("intervals", res))
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
        // .finally(() => {

        // })
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
                                onChange={(e) => {
                                    handleOnChange("isEnable", e.target.checked); 
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
                    onOpen={() => {
                        if([].length < 2)
                        {
                            // setLoading(true);
                            getSummaryIntervals();
                        }
                    }}
                    // loading={loading}
                    options={summaryOptions}
                    onChange={(e, newValue) => {
                        handleOnChange("intervals", newValue)
                    }}
                    value={boxplot.intervals}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={""}
                            InputProps={{
                            ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {loading ? <CircularProgress size={16} className="cicularProgress-unit" /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
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
                    options={collapseValuseOptions}
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