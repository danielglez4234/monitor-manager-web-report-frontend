import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { TrendingUpRounded } from '@mui/icons-material';
import { usesTyles } from '../../../../commons/uiStyles/usesTyles'


const BUTTON_TOGGLE = {
    active: "contained",
    disable: "outlined"
}

const IndexItem = (
    {
        isActive, 
        indexNumber, 
        selectedIndexes,
        defaultPos, 
        setRanges
    }
) => {
    
    const classes = usesTyles()
    const active = isActive

    /*
     * filter selected item
     */
    const filterItems = (arr, index) => arr.filter((item) => item !== index);

    /*
     * tooggle select and deselect actions
     */
    const tooggleSelect = () => {
        try {
            if(selectedIndexes.length === 0)
                setRanges(defaultPos)
            else if(!active)
            {
                const arr_ = (selectedIndexes[0] === defaultPos[0]) 
                            ? filterItems(selectedIndexes, defaultPos[0])
                            : selectedIndexes

                setRanges([ ...arr_, indexNumber])
            }
            else{
                const deselect = filterItems(selectedIndexes, indexNumber)
                setRanges((deselect.length === 0) ? defaultPos : deselect)
            } 
        } catch (error) {
            console.error(error)
        }
    }

    /*
     * backgroud type
     */
    const bgActive = active ? BUTTON_TOGGLE.active : BUTTON_TOGGLE.disable
    const classesBg = active ? classes.index_button_contained : classes.index_button_outlined

    return (
        <Button
            variant={bgActive}
            onClick={() =>{
                tooggleSelect()
            }}
            className={classesBg}
        >
            {
                indexNumber
            }
        </Button>
    );
}

export default IndexItem;