import React, { useState } from 'react';
import {
  fnIsSimpleArray,
  fnIsDoubleArray
}
from '../../../standarFunctions';
import { LtTooltip } from '../../../../commons/uiStyles/components';
import HelpIcon                   from '@mui/icons-material/Help';
import SettingsBackupRestoreIcon  from '@mui/icons-material/SettingsBackupRestore';
import IndexItem from './IndexItem';

const GetIndexArrayModal = ({pos, setPos, applyChangesWarning, dimension_x, dimension_y}) => {
	const defaultPos = ["All"]
	const availablePositions = dimension_x * dimension_y
	const allPositions = Array.from(Array(availablePositions).keys());
	
	const [openIndexModal, setOpenIndexModal]     = useState(false)
	const [enableResetIndex, setEnableResetIndex] = useState(true)

	const positions = (pos === "" || pos === null) ? defaultPos : pos
	const [selectedIndexes, setSelectedIndexes] = useState(positions)
	
	/*
	 * create ranges if necessary
	 */
	const createRanges = (arr) => {
		
	}

   	/*
     * handle open "choose index" modal
     */
  	const openModal = () => setOpenIndexModal(preState => !preState);
	  
	/*
	 * reset to default state
	 */
	const reset = () => setSelectedIndexes(defaultPos);


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
		<LtTooltip title={JSON.stringify(selectedIndexes)} enterDelay={900} leaveDelay={100} placement="left" className="tool-tip-options">
			<div className="array-index-box">
					{
						selectedIndexes.map((element) => 
							<div 
								onClick={() => { openModal() }} 
								className="array-index-button-box"
							>
									<span className={`array-index-button-text`}>
									{
										element
									}
									</span>
							</div>
						)
					}
				{
				(enableResetIndex) ?
					<div
						onClick={() => {
							setEnableResetIndex(false);
							reset()
							setPos(null)
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
							reset()
						}}
						className="index-choose-button index-choose-add"
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
							/>
						)
					}
				</div>
			</div>
	
		</>
	);
}

export default GetIndexArrayModal;
