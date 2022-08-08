import React, { useState } from 'react';
import { usesTyles } from '../../../../../commons/uiStyles/usesTyles'
import { 
    Modal,
    Box,
    Grid,
	Button,
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';

import QueryTable from './QueryTable';


function ViewHandleQuery({addItemtoLocalStorage}) {
	const classes = usesTyles()
	const [openViewQuery, setOpenViewQuery] = useState(false)

	const handleOpenViewQuery = () => setOpenViewQuery(true)
	const handleCloseSaveQuery = () => setOpenViewQuery(false)


    return(
		<>
			<Button
				className={classes.view_store_queries_button}
				variant="contained"  
				startIcon={<InventoryIcon />}
				onClick={() => {handleOpenViewQuery()}}
			>
				View Store Queries
			</Button>

		{/*
			Modals
		*/}

			<Modal
				open={openViewQuery}
				onClose={handleCloseSaveQuery}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="view-query-modal">
					<Grid container spacing={0} className="view-query-modal-cont">
						<Grid item xs={12} sm={12} md={12} className="store-query-title">
							View Store Queries
						</Grid>
						<Grid item xs={12} sm={12} md={12} className="store-query-title-table-box">
							{
								<QueryTable
									addItemtoLocalStorage={addItemtoLocalStorage}
									openViewQuery={openViewQuery}
									handleCloseSaveQuery={handleCloseSaveQuery}
								/>
							}
						</Grid>
					</Grid>
				</Box>
			</Modal>
	</>

    );
}
export default ViewHandleQuery;
