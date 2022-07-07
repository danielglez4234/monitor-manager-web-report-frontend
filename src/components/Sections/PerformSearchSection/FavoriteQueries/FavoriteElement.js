import React from 'react';
import InventoryIcon from '@mui/icons-material/Inventory';
import { IconButton } from '@mui/material';

const FavoriteElement = ({element}) => {
	return(
		<div className="drag componentItem-box-container monitor-element">
			<div 
				className="componentItem-box" 
				onClick={() => { 
					// select(monitorData); 
					// diActivateReload(); 
				}}
			>
				<div className="componentItem-icon">
                    <div className="monitor-seleted-typeIcon">
                        <InventoryIcon sx={{color: "rgb(139, 159, 159)"}}/>
                    </div>
				</div>
				<div className="monitorItem-title-div favoriteItem-title-div">
					<p className="monitorItem-title"> { element.name } </p>
				</div>

				<div className="monitorItem-title-div favoriteItem-title-actions-icons">
					<div className="monitor-seleted-typeIcon">
					<IconButton>
                        <InventoryIcon sx={{color: "rgb(139, 159, 159)"}}/>
					</IconButton>
                    </div>
					<div className="monitor-seleted-typeIcon">
					<IconButton>
                        <InventoryIcon sx={{color: "rgb(139, 159, 159)"}}/>
					</IconButton>
                    </div>
				</div>
			</div>
		</div>
	);
}

export default FavoriteElement;