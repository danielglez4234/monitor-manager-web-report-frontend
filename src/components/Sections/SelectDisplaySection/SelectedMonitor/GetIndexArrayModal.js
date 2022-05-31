import React, { useState } from 'react';
import {
  fnIsSimpleArray,
  fnIsDoubleArray
}
from '../../../standarFunctions';
import { LtTooltip } from '../../../../commons/uiStyles';

import HelpIcon                   from '@mui/icons-material/Help';
import SettingsBackupRestoreIcon  from '@mui/icons-material/SettingsBackupRestore';


const GetIndexArrayModal = ({id, type, setPos, applyChangesWarning, dimension_x, dimension_y}) => {
  
  const availablePositions = (dimension_x * dimension_y);
  /*
   * Store the state of all input options
   */
  const [inputState, setInputState] = useState({
    single: "",
    fromRange: "",
    toRange: "",
    single2Dx: "",
    single2Dy: "",
    fromRange2Dx: "",
    fromRange2Dy: "",
    toRange2Dx: "",
    toRange2Dy: ""
  })
  
  const [openIndexModal, setOpenIndexModal]     = useState(false);
  const [enableResetIndex, setEnableResetIndex] = useState(false);

  const [textIndex, setTextIndex]                   = useState("/");
  const [indexTypeChoosen, setIndexTypeChoosen]     = useState("range");
  const [indexTypeChoosen2D, setIndexTypeChoosen2D] = useState("range2D");

   /*
    * handle open "choose index" modal
    */
   const openModal = () => {
    setOpenIndexModal(preState => !preState);
  }

 /*
  * handle add index 1D
  */
  const addIndexNumber = (type, single, fromRange, toRange) => {
    let text = "";
   
    if (type === "range") {
      text += "[" + fromRange + "-" + toRange + "]";
    }
    else {
      text += "[" + single + "]";
    }

    if ((type === "single" && single === "") || ((type === "range" && fromRange === "") || toRange === "")) {

    }
    else if (Number(fromRange) > Number(toRange) || Number(fromRange) === Number(toRange)) {
      
    }
    else {
      if (textIndex === "/") {
        setTextIndex(text);
        setPos(text);                   // REFACTOR:
        setEnableResetIndex(true);
      }
      else {
        setTextIndex(textIndex + ";" + text);
        setPos(textIndex + ";" + text); // REFACTOR:
      }
    }
  }

  /*
   * handle add index 2D
   */
   const addIndexNumber2D = (type, single2Dx, single2Dy, fromRange2Dx, fromRange2Dy, toRange2Dx, toRange2Dy) => {
     let text = "";
     if (type === "range2D") {
        text += "[" + ((fromRange2Dx === "") ? "0" : fromRange2Dx) + "," + fromRange2Dy + "-" + ((toRange2Dx === "") ? "0" : toRange2Dx) + "," + toRange2Dy + "]";
     }
     else {
        text += "[" + ((single2Dx === "") ? "0" : single2Dx) + "," + single2Dy + "]";
     }

     if ((type === "single2D" && single2Dy === "") || ((type === "range2D" && fromRange2Dy === "") || toRange2Dy === "")) {
        // $("").addClass("wrong-set-input");
     }
     else if (fromRange2Dx > toRange2Dx) {
       // $("").addClass("wrong-set-input");
     }else{
       // $("").removeClass("wrong-set-input");
       if (textIndex === "/") {
         setTextIndex(text);
         setPos(text);                  // REFACTOR:
         setEnableResetIndex(true)
       }
       else {
         setTextIndex(textIndex + ";" + text);
         setPos(textIndex + ";" + text); // REFACTOR:
       }
     }
   }

   /*
    * handle onchange index input
    */
    const handleChange = (e) => {
      const value = e.target.value;
      setInputState({
        ...inputState,
        [e.target.name]: value
      })
    }
 

  return(
    <>
      <div className="indexInput-tooltip-box">
        <label className="monitor-limits-label"> Index: </label>
        {
        (fnIsSimpleArray(type)) ?
            <LtTooltip
                title={
                <React.Fragment>
                    <b className="label-indHlp-tooltip">{"Available formats:"}</b><br />
                    <span className="indHlp-vis">{"empty      -  return all"}</span><br />
                    <span className="indHlp-vis">{"1,3,7        -  return several selected"}</span><br />
                    <span className="indHlp-vis">{"0-5           -  return a range"}</span><br />
                    <span className="indHlp-vis"><b className="info-indHlp-tooltip">{"Available Positions:"}</b> {availablePositions}</span><br />
                </React.Fragment>
                }
                placement="left" className="tool-tip-options">
                <HelpIcon className="index-help-icon"/>
            </LtTooltip>
        :
            <LtTooltip
                title={
                <React.Fragment>
                    <b className="label-indHlp-tooltip">{"Available formats:"}</b><br />
                    <span className="indHlp-vis">{"empty      -  return all"}</span><br />
                    <span className="indHlp-vis">{"0,1 , 0,3   -  return several 2D selected"}</span><br />
                    <span className="indHlp-vis">{"0,4-6,8     -  return 2D range"}</span><br /><br />
                    <span className="indHlp-vis"><b className="info-indHlp-tooltip">{"Available Positions:"}</b> {availablePositions}</span><br />
                </React.Fragment>
                }
                placement="left" className="tool-tip-options">
                <HelpIcon className="index-help-icon"/>
            </LtTooltip>
        }
        {
            applyChangesWarning
        }
     </div>
     
     {/* 
       * SHOW Index number selected and reset button
       */}
    <LtTooltip title={textIndex} enterDelay={900} leaveDelay={100} placement="left" className="tool-tip-options">
        <div className="array-index-box">
            <div onClick={() => { openModal() }} className="array-index-button-box">
            {"{"}
                <span className={`array-index-button-text Index${id}`}>
                {
                    textIndex
                }
                </span>
            {"}"}
            </div>
            {
            (enableResetIndex) ?
            <div
                onClick={() => {
                  setEnableResetIndex(false);
                  setTextIndex("/");
                }}
                className="clear-choose-index-box"
            >
                <SettingsBackupRestoreIcon className="clear-choose-icon"/>
            </div>
            : ""
            }
        </div>
    </LtTooltip>

    {/* 
      * Handle modal selection number inputs for "textIndex"
      */}
    {
        (openIndexModal) ?
        (fnIsSimpleArray(type)) ?
            <div className="choose-array-index-box">
            <div className="index-choose-inputs-box">
        {
            (indexTypeChoosen === "single") ?
            <div className="index-inputIndex-choose-single-box">
                <input
                type="number"
                max="999"
                min="-1"
                placeholder="0.."
                name="single"
                value = {inputState.single}
                onChange={handleChange}
                className={`index-inputIndex-choose index-inputIndex-choose-single single-i`}
                />
            </div>
            : (indexTypeChoosen === "range") ?
            <div className="index-inputIndex-choose-range-box">
                <input
                type="number"
                max="999"
                min="-1"
                placeholder="0.."
                name="fromRange"
                value = {inputState.fromRange}
                onChange={handleChange}
                className={`index-inputIndex-choose index-inputIndex-choose-range range-iF`}
                />
                <span className="input-range-separator separator_guion"> - </span>
                <input
                type="number"
                max="999"
                min="-1"
                placeholder="0.."
                name="toRange"
                value = {inputState.toRange}
                onChange={handleChange}
                className={`index-inputIndex-choose index-inputIndex-choose-range range-iT`}
                />
            </div>
            : ""
        }
            </div>
            <div className="index-choose-button-box">
                <div onClick={() => { setIndexTypeChoosen("range") }} className="index-choose-button index-choose-range">
                    <span>Range</span>
                </div>
                <div onClick={() => { setIndexTypeChoosen("single") }} className="index-choose-button index-choose-selected">
                    <span>Single</span>
                </div>
                <div onClick={() => {
                    if (indexTypeChoosen === "single") 
                    {
                      addIndexNumber(indexTypeChoosen, inputState.single, false);
                    }
                    else if (indexTypeChoosen === "range") 
                    {
                      addIndexNumber(indexTypeChoosen, false, inputState.fromRange, inputState.toRange);
                    }
                }} className="index-choose-button index-choose-add">
                    <span>Add</span>
                </div>
            </div>
        </div>
            
        : (fnIsDoubleArray(type)) ?
            <div className="choose-array-index-box choose-index-box-2D">
            <div className="index-choose-inputs-box">
            {
            (indexTypeChoosen2D === "single2D") ?
                <div className="index-inputIndex-choose-single-box choose-single-box2D">
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="single2Dx"
                    value = {inputState.single2Dx}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-single`}
                />
                    <span className="input-range-separator"> , </span>
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="single2Dy"
                    value = {inputState.single2Dy}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-single`}
                />
                </div>
            : (indexTypeChoosen2D === "range2D") ?
                <div className="index-inputIndex-choose-range-box">
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="fromRange2Dx"
                    value = {inputState.fromRange2Dx}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-range range-i1F`}
                />
                    <span className="input-range-separator"> , </span>
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="fromRange2Dy"
                    value = {inputState.fromRange2Dy}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-range range-i2F`}
                />
                <span className="input-range-separator separator_guion"> - </span>
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="toRange2Dx"
                    value = {inputState.toRange2Dx}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-range range-i1T`}
                />
                    <span className="input-range-separator"> , </span>
                <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="0.."
                    name="toRange2Dy"
                    value = {inputState.toRange2Dy}
                    onChange={handleChange}
                    className={`index-inputIndex-choose index-inputIndex-choose-range range-i2T`}
                />
                </div>
            : ""
            }
            </div>
            <div className="index-choose-button-box">
                <div onClick={() => { setIndexTypeChoosen2D("range2D") }} className="index-choose-button index-choose-range">
                    <span>Range</span>
                </div>
                <div onClick={() => { setIndexTypeChoosen2D("single2D") }} className="index-choose-button index-choose-selected">
                    <span>Single</span>
                </div>
                <div onClick={() => {
                    if (indexTypeChoosen2D === "single2D") 
                    {
                      addIndexNumber2D(indexTypeChoosen2D, inputState.single2Dx, inputState.single2Dy);
                    }
                    else if (indexTypeChoosen2D === "range2D") 
                    {
                      addIndexNumber2D(indexTypeChoosen2D, false, false, inputState.fromRange2Dx, inputState.fromRange2Dy, inputState.toRange2Dx, inputState.toRange2Dy);
                    }
                }} className="index-choose-button index-choose-add">
                    <span>Add</span>
                </div>
            </div>
        </div>
        : ""
      : ""
    }
    </>
  );
}

export default GetIndexArrayModal;
