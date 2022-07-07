import React from 'react';
import { IconButton } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

const FavoriteElement = ({element, loadMonitors, removeFavorite}) => {
	return(
		<div className="drag componentItem-box-container monitor-element">
			<div className="componentItem-box">
				<div className="componentItem-icon">
                    <div className="monitor-seleted-typeIcon">
                        <InventoryIcon sx={{color: "rgb(139, 159, 159)"}}/>
                    </div>
				</div>
				<div className="monitorItem-title-div favoriteItem-title-div">
					<p className="monitorItem-title"> { element.name } </p>
				</div>

				<div className="monitorItem-title-div favoriteItem-title-actions-icons">
					<IconButton className="divide-vertical-left"
						onClick={() => {loadMonitors(element.id)}}
					>
						<DownloadForOfflineIcon className="rotate270" sx={{color: "rgb(232, 238, 238)"}}/>
					</IconButton>
					<IconButton
						onClick={() => {removeFavorite(element.id)}}
					>
                        <DeleteIcon sx={{color: "rgb(232, 238, 238)"}}/>
					</IconButton>
				</div>
			</div>
		</div>
	);
}

export default FavoriteElement;