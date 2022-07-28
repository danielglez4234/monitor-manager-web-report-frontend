import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";

/*
 * Available types of snackbars:
 * 1. default 
 * 2. info
 * 3. success
 * 4. warning
 * 5. error
 */

const HandleMessage = () => {
    const [conf, setConf] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const props = {}
    useEffect(()=>{
        const message = conf?.message
        if(message){
            const type = conf?.type
            if(type){
                props.variant = type
                // if error => persist ; the rest dont
                props.persist = (type === 'error')
                // if warnig => preventDuplicate ; the rest dont
                props.preventDuplicate = (type === 'warning')
            }
            enqueueSnackbar(message, props);
        }
    },[conf]);
    return [conf, setConf];
};
export default HandleMessage;