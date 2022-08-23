import React from 'react';
import { IconButton } from '@mui/material';
import { LtTooltip } from '../../../../commons/uiStyles'
import InventoryIcon from '@mui/icons-material/Inventory';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
				<LtTooltip title="Concat" placement="top" className="tool-tip-options" disableInteractive>
					<IconButton
						onClick={() => {loadMonitors("concatMultiple", element.name)}}
						size="small"
					>
						<AddCircleIcon sx={{color: "rgb(232, 238, 238)"}} fontSize="small"/>
					</IconButton>
				</LtTooltip>
				<LtTooltip title="Load" placement="top" className="tool-tip-options" disableInteractive>
					<IconButton
						onClick={() => {loadMonitors("addMultiple", element.name)}}
						size="small"
					>
						<DownloadForOfflineIcon className="rotate270" sx={{color: "rgb(232, 238, 238)"}} fontSize="small"/>
					</IconButton>
				</LtTooltip>
				<LtTooltip title="UnMarked" placement="top" className="tool-tip-options" disableInteractive>
					<IconButton
						onClick={() => {removeFavorite(element.id)}}
						size="small"
					>
                        <BookmarkRemoveIcon sx={{color: "rgb(232, 238, 238)"}} fontSize="small"/>
					</IconButton>
				</LtTooltip>
				</div>
			</div>
		</div>
	);
}

export default FavoriteElement;