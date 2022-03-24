import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";

const PopUpMessage = () => {
    const [conf, setConf] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    useEffect(()=>{
        if(conf?.message){
            enqueueSnackbar(conf.message, {
                variant: conf.type,
                persist: conf.persist,
                preventDuplicate: conf.preventDuplicate,
            });
        }
    },[conf]);
    return [conf, setConf];
};

export default PopUpMessage;