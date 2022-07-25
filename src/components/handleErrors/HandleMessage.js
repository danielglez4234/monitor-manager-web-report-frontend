import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";

const HandleMessage = () => {
    const [conf, setConf] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const typeConf = {}
    useEffect(()=>{
        if(conf?.message){
            if(conf?.type){
                typeConf.variant = conf?.type
                if(conf.type === 'error'){  // error deafult conf
                    typeConf.persist = true
                    typeConf.preventDuplicate = false
                }
                else if(conf.type === 'warning'){ // warning deafult conf
                    typeConf.persist = false
                    typeConf.preventDuplicate = true
                }
                else if(conf.type === 'info' || conf.type === 'success' || conf.type === 'default'){ // default, info, success deafult conf
                    typeConf.persist = false
                    typeConf.preventDuplicate = false
                }
                else{ // default conf 
                    typeConf.persist = false
                    typeConf.preventDuplicate = false
                }
            }
            enqueueSnackbar(conf.message, typeConf);
        }
    },[conf]);
    return [conf, setConf];
};
export default HandleMessage;