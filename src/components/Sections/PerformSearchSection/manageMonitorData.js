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
            monitorData = item.id_magnitude_description
            monitorList.push({component_id, name, ...monitorData, options})
        }
        else if(item?.id_monitor_description){
            monitorData = item.id_monitor_description
            item.options["prefix"] 	= item.prefix
            item.options["unit"] 	= item.unit
            item.options["decimal"] = item.decimal
            item.options["pos"] 	= item.pos.slice(1, -1) // TODO: REFACTOR: esto no debería ser necesario
            monitorList.push({component_id, name, ...monitorData, options})
        }
        else{
            monitorList.push({id: component_id, name, magnitude: "STATE", type: "state", options})
        }
    })
    return monitorList
}
