import { Fragment } from 'react';
import {TextField, Autocomplete, CircularProgress } from '@mui/material';

const GetSummarySelect = ({
    id,
    boxplot, setBoxplot, checkBoxplot,
    summaryIntervals, setSummaryIntervals,
    showSummaryValues, setShowSummaryValues, checkShowCollapse,
    collapseList, setCollapseList
}) => {
    const loading = Boolean()
    const summaryOptions = ["hola"]
    /*
     * Get summary Intervals
     */
    const getSummaryIntervals = () => {
        // Promise.resolve()
        // .then((res) => {
        //     setSummaryIntervals(res)
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
                    <label className="label-cont-inputchecbox settings-checkbox-presnetation">
                        {
                            (showSummaryValues) ? 
                                (boxplot) ? "Display" : "Only Values" 
                            : "Display"
                        }
                        <input
                            className={"checkboxMo checkboxMo-monitor boxplot"+ id}
                            name="logarithm"
                            type="checkbox"
                            onChange={(e) => {setBoxplot(e.target.checked)}}
                            value={boxplot}
                            onClick={() => {checkBoxplot(!boxplot, id)}}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>

            <div>
			    <span className="monitor-selected-input-label-selects label-selects-grafic-type">Summary Intervals:</span>
		    </div>
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    disabled={!boxplot}
                    className="input-limits-grafic-options input-select-prefix prefix"
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
                        setSummaryIntervals(newValue);
                    }}
                    value={summaryIntervals}
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
                    <label className="label-cont-inputchecbox settings-checkbox-presnetation">
                        Collapse value
                        <input
                            className={"checkboxMo checkboxMo-monitor collapseValues"+ id}
                            name="logarithm"
                            type="checkbox"
                            onChange={(e) => {setShowSummaryValues(e.target.checked)}}
                            value={showSummaryValues}
                            onClick={() => {checkShowCollapse(!showSummaryValues, id)}}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>

            <div>
			    <span className="monitor-selected-input-label-selects label-selects-grafic-type">Collapse Values:</span>
		    </div>
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    disabled={!showSummaryValues}
                    className="input-limits-grafic-options input-select-prefix prefix"
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
                        setCollapseList(newValue)
                        if(boxplot){
                            setBoxplot(false)
                            checkBoxplot(false, id)
                        }
                    }}
                    value={collapseList}
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
        </div>
     );
}

export default GetSummarySelect;