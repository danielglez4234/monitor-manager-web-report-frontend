import React          from 'react';
import InventoryIcon from '@mui/icons-material/Inventory';

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
                        <InventoryIcon />
                    </div>
				</div>
				<div className="monitorItem-title-div favoriteItem-title-div">
					<p className="monitorItem-title"> { element.name } </p>
				</div>
			</div>
		</div>
	);
}

export default FavoriteElement;