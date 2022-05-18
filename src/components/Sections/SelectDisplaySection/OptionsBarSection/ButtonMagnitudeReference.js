// --- React dependencies
import React from 'react';

// --- Dependencies
import * as $         from 'jquery';
import { LtTooltip }  from '../../../../commons/uiStyles';

// --- Model Component elements
// import Popover        from '@mui/material/Popover';
import {IconButton, Box} from '@mui/material';

// --- Icons
import ListIcon from '@mui/icons-material/List';


function ButtonMagnitudeReference({magnitudeTitles, magnitudeReferences}) {

	/*
	 * List all magnitude values references 
	 */
	const listMagnitudeReferences = () => {
		let references = []
		// magnitudeTitles.map((name, index) => {
		//   references.push(
		//     <div>{name}</div>
		//   ) 
		//     magnitudeReferences.map(objects => {
		//       let fieldsWithValues = Object.entries(objects);
			
		//       fieldsWithValues.map(([key, value]) => {
		//         references.push(
		//           <div className="references-values-box">
		//             <div className="references-values-labels">{key}</div>
		//             <div className="references-values-values">{value}</div>
		//           </div>
		//         )
		//       }) 
		//     })
		// })

		for (let i = 0; i < magnitudeTitles.length; i++) {
			references.push(
				<div className="references-values-sTitle">{magnitudeTitles[i]}</div>
			) 
			let refere = magnitudeReferences[i]
			let fieldsAndVal = Object.entries(refere)
			for (let a = 0; a < fieldsAndVal.length; a++) {
				references.push(
					<div className="references-values-box">
						<div className="references-values-labels">{fieldsAndVal[a][0]}</div>
						<div className="references-values-values">{fieldsAndVal[a][1]}</div>
					</div>
				)
			}
		}
		return references
    };

    const referencesList = listMagnitudeReferences()


    /*
     * Handle graphic options OPEN popover
     */
    const handleClickOpenList = () => {
      	$('.graphOpt-box-magnitude-ref').toggleClass('display-none');
      	$('.close_rangeZone-magnitude-ref').toggleClass('display-none');
    };

    return(
		<div className="button-general-options">
			<LtTooltip title="Magnitude Values References" placement="top" className="tool-tip-options">
				<IconButton aria-label="settings" onClick={handleClickOpenList}>
					<ListIcon className="settings-generalOptButton"/>
				</IconButton>
			</LtTooltip>
			
			<div className="close_rangeZone-magnitude-ref display-none" onClick={handleClickOpenList}></div>
			<Box className="graphOpt-box-magnitude-ref display-none" id="graphOpt-sx" sx={{boxShadow: 3}}>
				<div className="graphOpt-label-title">
					<p>Magnitude References</p>
				</div>

				<div className="graphOpt-refrences-box">
					{
						referencesList
					}
				</div>

				<div className="graphOpt-action-buttons"></div>
			</Box>
		</div>
    );
}
export default ButtonMagnitudeReference;
