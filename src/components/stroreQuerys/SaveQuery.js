// TODO: 
// agregar un campo que muestre la fecha fin y fecha final de la query
// buscar la forma de llamar al metodos constructURL


import React, { useState, useEffect } from 'react';
import {
	insertQuery
} from '../../services/services'
import { 
    Modal,
    Box,
    Grid,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
    Backdrop,
    CircularProgress
} from '@mui/material';
import LoadingButton                from '@mui/lab/LoadingButton';
import SaveIcon                     from '@mui/icons-material/Save';
import PopUpMessage                 from '../../components/handleErrors/PopUpMessage';
import {makeStyles}					from '@material-ui/core';


const usesTyles = makeStyles({
	saveQueryButton: {    
		'&:hover': {
			background: '#569d90',
		},
	}
})


function SaveQuery({open, handleClose, monitorsSelected, beginDate, endDate}) {
    const classes = usesTyles()
    const [msg, handleMessage] = PopUpMessage()
    const [queryName, setQueryName] = useState("")
    const [queryDescription, setQueryDescription] = useState("")
    // const [checked, setChecked] = useState([0])
    const [openBackDrop, setOpenBackDrop] = useState(false)

    const backDropLoadOpen = () => { setOpenBackDrop(true) }
    const backDropLoadClose = () => { setOpenBackDrop(false) }

    /*
     * handle toggle checkecd checkboxes
     */
    // const handleToggle = (value) => () => {
    //     const currentIndex = checked.indexOf(value);
    //     const newChecked = [...checked];
    
    //     if (currentIndex === -1) {
    //       newChecked.push(value);
    //     } else {
    //       newChecked.splice(currentIndex, 1);
    //     }
    
    //     setChecked(newChecked);
    //     console.log("Checked", checked);
    // };

    /*
     * save query on data base
     */
    const saveQuery = (data) => {
		Promise.resolve( insertQuery(data) )
		.then(() =>{
            setQueryName("")
            setQueryDescription("")
			handleMessage({
				message: "Query save successfully!",
				type: "success",
				persist: false,
				preventDuplicate: false
			})
		})
		.catch((error) =>{
			console.error(error)
			handleMessage({
				// message: "Error: " + error.reponse.message.toSring(),
                message: "Error",
				type: "error",
				persist: true,
				preventDuplicate: false
			})
		}).finally(() => {
            backDropLoadClose()
        })
	}
    
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="save-query-modal">
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={12} className="save-query-title">
                            Save Actual Query
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-box-title-name">
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className="save-query-input-title-name"
                            >
                                <Grid item xs={1} sm={1} md={1} className="save-query-input-title-name">
                                    name
                                </Grid>
                                <Grid item xs={10} sm={10} md={10}>
                                    <input 
                                        className="save-query-input"
                                        type="text" 
                                        name="name"
                                        placeholder="query_name"
                                        value={queryName} 
                                        onChange={(e) => {setQueryName(e.target.value)}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-box-title-name">
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className="save-query-input-title-name"
                            >
                                <Grid item md={2.5} className="save-query-input-title-name">
                                    description 
                                </Grid>
                                <Grid item md={8.5}>
                                    <input 
                                        className="save-query-input description"
                                        type="text" 
                                        name="name"
                                        placeholder="optional"
                                        value={queryDescription} 
                                        onChange={(e) => {setQueryDescription(e.target.value)}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-box-title-name save-query-box-title-date">
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="left"
                                className="save-query-input-title-name save-query-title-date"
                            >
                                <Grid item md={2} className="save-query-input-title-name">
                                    <i>Begin date: { beginDate } </i>
                                </Grid>
                                <Grid item md={10}>
                                    <i>End Date: { endDate } </i>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-list-info-label">
                            <Grid container spacing={0} sx={{backgroundColor: "#5a6370", borderBottom: "3px solid #85e1d0", padding: "3px 0px 3px 15px"}}>
                                <Grid item md={12}>monitors selected</Grid>
                                {/* <Grid item md={1}>{ checked.length-1 } -</Grid>
                                <Grid item md={1}>{ monitorsSelected.length }</Grid> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="save-query-list-box">
                            <Grid item xs={12} sm={12} md={12}>
                                <List className="save-query-list-list">
                                    {monitorsSelected.map((value) => {
                                        const labelId = `checkbox-list-label-${value}`;
                                        return (
                                            <ListItem
                                                key={value}
                                                // secondaryAction={
                                                // <IconButton edge="end" aria-label="comments">
                                                //     <CommentIcon />
                                                // </IconButton>
                                                // }
                                                disablePadding
                                            >
                                                <ListItemButton 
                                                    role={undefined} 
                                                    // onClick={handleToggle(value)} 
                                                    dense
                                                >
                                                {/* <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        defaultChecked={true}
                                                        checked={checked.indexOf(value) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon> */}
                                                    <ListItemText 
                                                        id={labelId} 
                                                        primary={value.monitorData.magnitude} 
                                                        secondary={value.component}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-saveButton-box">
                            <LoadingButton
                                size="small"
                                sx={{backgroundColor: '#569d90'}}
                                className={classes.saveQueryButton}
                                onClick={() => { 
                                    backDropLoadOpen()
                                    saveQuery() 
                                }}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                            >
                                Save
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Backdrop
                sx={{ color: '#569d90', zIndex: (theme) => theme.zIndex.drawer + 13001 }}
                open={openBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
     );
}

export default SaveQuery;