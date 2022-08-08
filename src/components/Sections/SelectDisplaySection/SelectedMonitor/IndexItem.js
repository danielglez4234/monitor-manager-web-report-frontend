import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { TrendingUpRounded } from '@mui/icons-material';
import { usesTyles } from '../../../../commons/uiStyles/usesTyles'


const BUTTON_TOGGLE = {
    active: "contained",
    disable: "outlined"
}

const IndexItem = ({isActive, indexNumber, selectedIndexes, setSelectedIndexes, defaultPos}) => {
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
        if(selectedIndexes[0] === defaultPos) // if default state if set delete it
            selectedIndexes.shift()

        if(selectedIndexes.length === 0)
            setSelectedIndexes(defaultPos)
        else if(!active)
            setSelectedIndexes(prevState => ([ ...prevState, indexNumber ]))
        else{
            const deselect = filterItems(selectedIndexes, indexNumber)
            setSelectedIndexes(deselect)
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