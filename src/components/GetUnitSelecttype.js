import { useState, Fragment } from 'react';
import { getUnitConversion } from '../services/services';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import PopUpMessage                   from './handleErrors/PopUpMessage';

function GetUnitSelecttype({id, unit}) {
  const defaultOpt = "Default";    
  const noMatches = "No Matches";
  const [msg, handleMessage] = PopUpMessage();
  const [loading, setLoading] = useState(false);
  const [compatibleConversion, setCompatibleConversion] = useState([defaultOpt]);

    /*
     *  Get units type compatible conversion from server
     */
    const getcompatibleconversion = (unit) => {
      Promise.resolve( getUnitConversion(unit) )
      .then(res => {
        // set options if res is greater than 0
        if (res.length > 0){
          setCompatibleConversion([defaultOpt, ...res]);
        }
        else 
        {
          setCompatibleConversion([defaultOpt, noMatches]); 
        }
      })
      .catch(error => {
        console.log(error);
        handleMessage({
          message:"Error obtaining conpatible unit conversion.",
          type: 'error', 
          persist: true,
          preventDuplicate: true
        })
        setCompatibleConversion([defaultOpt, noMatches]); 
      })
      .finally(() => {
        setLoading(false);
      });
    }

  return (
      <Autocomplete
        disablePortal // --> disabled entrys not related with the select
        // freeSolo
        id={`Unit` + id}
        className="input-limits-grafic-options input-select-unit"
        name="deimnalPattern"
        disableClearable
        onOpen={() => {
          // if(compatibleConversion.length < 2)
          // {
            setLoading(true);
            getcompatibleconversion(unit);
          // }
        }}
        loading={loading}
        options={compatibleConversion}
        // getOptionLabel={(option) => option || ""}
        // getOptionDisabled={(option) => 
        //   option === compatibleConversion[1]
        // }
        defaultValue={"Default"}
        renderInput={(params) => (
          <TextField
            {...params}
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
  ); 
}

export default GetUnitSelecttype;
