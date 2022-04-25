//  TODO: 
//  1|> añadir prefijos al lado del input de unidades
//  2|> esperar a recibir un booleano que indique si tiene sentido activar los prefijos
//  en caso de que no se bloquearía el input 

import { useState, Fragment } from 'react';
import { getUnitConversion } from '../services/services';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import PopUpMessage                   from './handleErrors/PopUpMessage';

function GetUnitSelecttype({id, unit}) {
  const defaultUnitOpt = "Default";  
  const defaultPrefixOpt = "Default"  
  const noMatches = "No Matches";
  const [msg, handleMessage] = PopUpMessage();
  const [loading, setLoading] = useState(false);
  const [compatibleConversion, setCompatibleConversion] = useState([defaultUnitOpt]);
  const [prefixes, setPrefixes] = useState([])
  

    /*
     *  Get units type compatible conversion from server
     */
    const getcompatibleconversion = (unit) => {
      Promise.resolve( getUnitConversion(unit) )
      .then(res => {
        const units    = res.units
        const prefix   = res.prefixes
        const fullname = prefix.map(value => value.fullName)

        if (units.length > 0){
          setCompatibleConversion([defaultUnitOpt, ...units]);
          setPrefixes([defaultPrefixOpt, ...fullname]);
        }
        else 
        {
          setCompatibleConversion([defaultUnitOpt, noMatches]); 
          setPrefixes([defaultPrefixOpt, noMatches]);
        }

        // set options if res is greater than 0
        // if (res.length > 0){
        //   setCompatibleConversion([defaultUnitOpt, ...res]);
        // }
        // else 
        // {
        //   setCompatibleConversion([defaultUnitOpt, noMatches]); 
        // }
      })
      .catch(error => {
        console.log(error);
        handleMessage({
          message:"Error obtaining conpatible unit conversion.",
          type: 'error', 
          persist: true,
          preventDuplicate: true
        })
        setCompatibleConversion([defaultUnitOpt, noMatches]); 
        setPrefixes([]);
      })
      .finally(() => {
        setLoading(false);
      });
    }

  return (
    <div className="unit-and-prefix-box">
      { 
        // (prefixes.length > 0) ?
           <Autocomplete
            disablePortal // --> disabled entrys not related with the select
            disableClearable // --> disabled the posibility to leave the input empty
            // freeSolo
            id={`Prefix` + id}
            className="input-limits-grafic-options input-select-prefix"
            name="deimnalPattern"
            loading={loading}
            options={prefixes}
            defaultValue={"Default"}
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
        // : ""
       }


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
        defaultValue={"Default"}
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
  ); 
}

export default GetUnitSelecttype;
