import React from 'react';
import * as $         from 'jquery';
import { LtTooltip }  from '../../../../commons/uiStyles';
import {IconButton, Box} from '@mui/material';
import ListIcon from '@mui/icons-material/List';


function ButtonMagnitudeReference({magnitudeTitles, magnitudeReferences}) {

	/*
	 * List all magnitude values references 
	 */
	const listMagnitudeReferences = () => {
		const references = []
		for (let i = 0; i < magnitudeTitles.length; i++) {
			references.push(
				<div className="references-values-sTitle">{magnitudeTitles[i]}</div>
			) 
			const fieldsAndVal = Object.entries(magnitudeReferences[i])
			for (let a = 0; a < fieldsAndVal.length; a++) {
				references.push(
					<div key={i+" "+a} className="references-values-box">
						<div className="references-values-labels">{fieldsAndVal[a][0]}</div>
						<div className="references-values-values">{fieldsAndVal[a][1]}</div>
					</div>
				)
			}
		}
		return references
    };

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
						listMagnitudeReferences()
					}
				</div>

				<div className="graphOpt-action-buttons"></div>
			</Box>
		</div>
    );
}
export default ButtonMagnitudeReference;
