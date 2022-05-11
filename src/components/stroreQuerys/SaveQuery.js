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
import getGraphicoptions            from '../getGraphicoptions'



const usesTyles = makeStyles({
	saveQueryButton: {    
		'&:hover': {
			background: '#569d90',
		},
	}
})


function SaveQuery({open, handleClose, monitorsSelected, searchForm, constructURL}) {

    console.log("searchForm?.sampling", searchForm.sampling)

    const classes = usesTyles()
    const monitorOptions = getGraphicoptions()
    const [msg, handleMessage] = PopUpMessage()
    const [queryName, setQueryName] = useState("")
    const [queryDescription, setQueryDescription] = useState("")
    const [openBackDrop, setOpenBackDrop] = useState(false)

    const backDropLoadOpen = () => { setOpenBackDrop(true) }
    const backDropLoadClose = () => { setOpenBackDrop(false) }


    /*
     * Show Warning message snackbar
     */
    const showWarningMessage = (message) => { 
        handleMessage({
            message: message,
            type: "warning",
            persist: false,
            preventDuplicate: false
        })
    }


    /*
     * save query on data base
     */
    const onSubmit = () => {
        if(queryName === "" || queryName === undefined){
            showWarningMessage("Name field cannot be empty")
        }
        else{
            backDropLoadOpen()
            const params = constructURL(searchForm)
            saveQuery(params)
        }
	}
    
    /*
     * save query on data base 
     */
    const saveQuery = (payload) => { 
        Promise.resolve( insertQuery(payload) )
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
            const error_message = (error?.response?.message) ? error.response.message : "Unsupported Error"
            const error_status = (error?.status) ? error.status : "Unkwon"
            handleMessage({
                message: "Error: " + error_message + " - Code " + error_status,
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
                                    <i>Begin date: { searchForm?.beginDate } </i>
                                </Grid>
                                <Grid item md={10}>
                                    <i>End date: { searchForm?.endDate } </i>
                                </Grid>
                                <Grid item md={10}>
                                    <i>Sampling: { (searchForm?.sampling !== "" && searchForm?.sampling !== "Default") ? searchForm.sampling  : 0 } </i>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-list-info-label">
                            <Grid container spacing={0} sx={{backgroundColor: "#5a6370", borderBottom: "3px solid #85e1d0", padding: "3px 0px 3px 15px"}}>
                                <Grid item md={12}>Monitors Settings</Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="save-query-list-box">
                            <Grid item xs={12} sm={12} md={12}>
                                <table id="drop-area" className="save-query-table-monitor-list">
                                    <tbody>
                                        {monitorsSelected.map((value) => {
                                            return (
                                                <tr key={value.monitorData.id} className="save-query-table-tr">
                                                    <td>
                                                        {value.monitorData.magnitude}
                                                    </td>
                                                    <td>
                                                        {value.component}
                                                    </td>
                                                    <td>
                                                        {monitorOptions.unitType}
                                                    </td>
                                                    <td>
                                                        {monitorOptions?.prefix}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="save-query-saveButton-box">
                            <LoadingButton
                                size="small"
                                sx={{backgroundColor: '#569d90'}}
                                className={classes.saveQueryButton}
                                onClick={() => { 
                                    onSubmit() 
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