import React, { useState } from 'react';
import { LtTooltip } from '../../../../commons/uiStyles/components';
import HelpIcon                   from '@mui/icons-material/Help';
import IndexItem from './IndexItem';

/*
 * return range and single indexes template
 */
function getTemplate(ma_){
	if(ma_.length > 1){
		const initial = ma_[0]
		const last = ma_[ma_.length - 1]
		return "["+initial+"-"+last+"]"
	}
	else{
		const single = ma_[0]
		return "["+single+"]"
	}
}

/*
 * TODO: make global function
 */
const sortDESC = (a, b) => {
	if (a < b) return -1
	if (a > b) return 1
}

/*
 * create ranges 
 */
const getRanges = (arr_) => {
	arr_.sort((a, b) => sortDESC(a, b))
	const arrange_ = []
	let range_ = []

	for (let x = 0; x < arr_.length; x++) {

		const num = arr_[x]
		const nextNumber = num + 1

			if(arr_.includes(nextNumber)){
				range_.push(num)
			}
			else{
				range_.push(num)
				arrange_.push(getTemplate(range_))
				range_ = []
			}
	}
	return JSON.stringify(arrange_).replace(/"/g, "")
}

/*
 * convert position string format to array of numbers
 * expected template "[[0];[0-0]; ...]"
 */
const convertToArrayFromTemplate = (str) => {
    try {
        const activeIndexes_ = []
        const result = str.replace(/;/g, ",")
		                  .substring(1)
		                  .slice(0, - 1)
		                  .split(",")
        result.map(val => 
            activeIndexes_.push(
                (val.includes("-"))
                ? getRangeFromString(val)
                : JSON.parse(val)
            )
        )
        return activeIndexes_.flat().sort((a, b) => sortDESC(a, b))
    } catch (error) {
        console.error(error)
    }
}

/*
 * create range from string // from => [1-4] to => [1, 2, 3, 4]
 */
const getRangeFromString = (values) => {
    try {
        const arrange_ = []
        const arr = values.replace(/\[/g, "").replace(/\]/g, "")
        const range = arr.split("-")
        const diference = Number(range[1]) - Number(range[0])
    
        for (let i = 0; i < diference; i++) { arrange_.push(Number(range[0]) + i) }
        return arrange_
    } catch (error) {
        console.error(error)
    }
}



const GetIndexArrayModal = ({pos, setPos, defaultPos, applyChangesWarning, dimension_x, dimension_y}) => {

	const availablePositions = dimension_x * dimension_y
	const allPositions = Array.from(Array(availablePositions).keys())
	const [openIndexModal, setOpenIndexModal] = useState(false)
	
	// TODO: invert names and calls  selectedIndexes <==> activeIndexes
	const positions_ = (Array.isArray(pos)) ? pos : convertToArrayFromTemplate(pos)
	const [selectedIndexes, setSelectedIndexes] = useState(positions_) 
	const [activeIndexes, setActiveIndexes] = useState(getRanges(positions_))
	
	/*
	 * create ranges if necessary
	 */
	const setRanges = (arr_) => {
		console.log(arr_)
		setPos(getRanges(arr_))
		setSelectedIndexes(arr_)
		setActiveIndexes(getRanges(arr_))
	}

   	/*
     * handle open "choose index" modal
     */
  	const openModal = () => setOpenIndexModal(preState => !preState);
	  
	/*
	 * reset to default state
	 */
	const reset = () => setRanges(defaultPos);

	/*
	 * select all positions
	 */
	const selectAll = () => setRanges(allPositions);


	return(
		<>
		<div className="indexInput-tooltip-box">
			<label className="monitor-limits-label"> Index: </label>
				<LtTooltip
					title={
					<React.Fragment>
						<span className="indHlp-vis">
							<b className="info-indHlp-tooltip">{"Available Positions: "}</b> 
							{availablePositions}
						</span>
						<br />
					</React.Fragment>
					}
					placement="left" className="tool-tip-options">
					<HelpIcon className="index-help-icon"/>
				</LtTooltip>
			{
				applyChangesWarning
			}
		</div>
		
		{/* 
		* SHOW Index selected and reset button
		*/}
		<LtTooltip title={JSON.stringify(activeIndexes)} enterDelay={900} leaveDelay={100} placement="left" className="tool-tip-options">
			<div className="array-index-box">
					<div 
						onClick={() => { openModal() }} 
						className="array-index-button-box"
					>
							<span className={`array-index-button-text`}>
							{
								activeIndexes
							}
							</span>
					</div>
			</div>
		</LtTooltip>

		{/* 
		* Handle modal selection inputs for "textIndex"
		*/}
			<div className="choose-array-index-box">
				<div className="index-choose-button-box">
					<div 
						onClick={() => { 
							reset() 
						}}
						className="index-choose-button index-choose-reset"
					>
						<span>Reset</span>
					</div>
					<div 
						onClick={() => { 
							selectAll() 
						}}
						className="index-choose-button index-choose-reset"
					>
						<span>Select All</span>
					</div>
				</div>
				<div className="index-choose-inputs-box">
					{
						allPositions.map((indexNumber, index) => 
							<IndexItem
								key = { index }
								indexNumber = { indexNumber }
								isActive = { selectedIndexes.indexOf(indexNumber) !== -1 }
								selectedIndexes = { selectedIndexes }
								defaultPos = { defaultPos }
								setRanges = { setRanges }
							/>
						)
					}
				</div>
			</div>
	
		</>
	);
}

export default GetIndexArrayModal;
