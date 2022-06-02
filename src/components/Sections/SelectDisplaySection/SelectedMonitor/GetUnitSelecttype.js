import { useState, Fragment } from 'react';
import { getUnitConversion } from '../../../../services/services';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import PopUpMessage from '../../../handleErrors/PopUpMessage';

function GetUnitSelecttype({id, DefaultUnit, unit, setUnit, prefix, setPrefix, applyChangesWarning}) {
	const [msg, handleMessage] = PopUpMessage()
	const [loading, setLoading] = useState(false)
	const [unitOptions, setUnitOptions] = useState([unit]);
	const [prefixesOptions, setPrefixesOptions] = useState([prefix]);
	
    /*
     *  Get units type compatible conversion from server
     */
    const getcompatibleconversion = () => {
      Promise.resolve( getUnitConversion(DefaultUnit) )
      .then(res => {
			const units    = res.units
			const prefixes   = res.prefixes
			const fullname = prefixes.map(value => value.fullName)
			if (units.length > 0)
			{
				setUnitOptions([unit, ...units]) // unit -> "Default" option
				setPrefixesOptions([prefix, ...fullname]) // prefix -> "Default" option
			}
			else 
			{
				setUnitOptions([unit])
				setPrefixesOptions([])
			}
      })
      .catch(error => {
        console.log(error)
        handleMessage({
			message:"Error obtaining conpatible unit conversion.",
			type: 'error', 
			persist: true,
			preventDuplicate: true
        })
        setUnitOptions([unit])
        setPrefixesOptions([])
      })
      .finally(() => {
        	setLoading(false)
      });
    }

	return (
		<>
		<div>
			<div className="label-monitor-settings">Unit Conversion:</div>
			<span className="monitor-selected-input-label-selects label-selects-grafic-type">Prefix:</span>
			{
				applyChangesWarning
			}
		</div>
		<div className="unit-and-prefix-box">
			
			<Autocomplete
				disablePortal // --> disabled entrys not related with the select
				disableClearable // --> disabled the posibility to leave the input empty
				// id={`Prefix` + id}
				className="input-limits-grafic-options input-select-prefix prefix"
				name="deimnalPattern"
				onOpen={() => {
					if(unitOptions.length < 2)
					{
						setLoading(true);
						getcompatibleconversion();
					}
				}}
				loading={loading}
				options={prefixesOptions}
				onChange={(e, newValue) => {
					setPrefix(newValue);
				}}
				value={prefix}
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

		<div>
			<span className="monitor-selected-input-label-selects label-selects-grafic-type">Unit:</span>
			{
				applyChangesWarning
			}
		</div>


		<Autocomplete
			disablePortal // --> disabled entrys not related with the select
			// id={`Unit` + id}
			className="input-limits-grafic-options input-select-unit"
			name="deimnalPattern"
			disableClearable
			onOpen={() => {
				if(unitOptions.length < 2)
				{
					setLoading(true);
					getcompatibleconversion(unit);
				}
			}}
			loading={loading}
			options={unitOptions}
			onChange={(e, newValue) => {
				setUnit(newValue);
			}}
			value={unit}
			renderInput={(params) => (
			<TextField
				{...params}
				className={"unit-type"}
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
		</>
	); 
}

export default GetUnitSelecttype;
