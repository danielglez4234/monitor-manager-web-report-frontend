import { fnIsArray } from '../../standarFunctions'

// TODO: REFACTOR: hacer esta función más eficiente

/*
 * Arrange the data received from the Backend according to the needs of the Frontend
 */
export const arrageMonitors =  (data) => {
    const monitorList = []
    data.map(item => {
        const component_id = item.id_monitor_component.id
        const name = item.id_monitor_component.name
        const options = item.options
        let monitorData
        if(item?.id_magnitude_description){
            // generate monitor element
            monitorData = item.id_magnitude_description
            monitorList.push({
                component_id, 
                name, 
                ...monitorData, 
                options
            })
        }
        else if(item?.id_monitor_description){
            console.log("options", options)
            // generate monitor element
            monitorData = item.id_monitor_description
            item.options["prefix"] 	= item.prefix
            item.options["unit"] 	= item.unit
            item.options["decimal"] = item.decimal
            item.options["pos"] = (item?.pos && fnIsArray(item.id_monitor_description.type)) ? item.pos : ""
            monitorList.push({
                component_id, 
                name, 
                ...monitorData, 
                options
            })
        }
        else{
            // generate state element
            monitorList.push({
                id: component_id, 
                name, 
                magnitude: "STATE", 
                type: "state", 
                options
            })
        }
    })
    return monitorList
}
