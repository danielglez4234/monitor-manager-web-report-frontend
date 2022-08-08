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
	const new_arrange_ = []
	let range_ = []

	for (let x = 0; x < arr_.length; x++) {

		const num = arr_[x]
		const nextNumber = num + 1

			if(arr_.includes(nextNumber)){
				range_.push(num)
			}
			else{
				range_.push(num)
				new_arrange_.push(getTemplate(range_))
				range_ = []
			}
	}
	return new_arrange_
}



const GetIndexArrayModal = ({pos, setPos, applyChangesWarning, dimension_x, dimension_y}) => {
	const defaultPos = ["All"] // this gets translate later to [-1]
	const availablePositions = dimension_x * dimension_y
	const allPositions = Array.from(Array(availablePositions).keys())
	
	const [openIndexModal, setOpenIndexModal]     = useState(false)

	// const positions = (pos === "" || pos === null) ? defaultPos : pos
	const positions = [0]


	const [selectedIndexes, setSelectedIndexes] = useState(positions) // TODO: invert names and calls
	const [activeIndexes, setActiveIndexes] = useState(getRanges(positions))
	
	/*
	 * create ranges if necessary
	 */
	const setRanges = (arr_) => {
		setActiveIndexes(getRanges(arr_))
	}

   	/*
     * handle open "choose index" modal
     */
  	const openModal = () => setOpenIndexModal(preState => !preState);
	  
	/*
	 * reset to default state
	 */
	const reset = () => {
		setRanges(defaultPos)
		setSelectedIndexes(defaultPos)
	}

	/*
	 * select all positions
	 */
	const selectAll = () => {
		setRanges(allPositions)
		setSelectedIndexes(allPositions)
	}


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
								setSelectedIndexes = { setSelectedIndexes }
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
