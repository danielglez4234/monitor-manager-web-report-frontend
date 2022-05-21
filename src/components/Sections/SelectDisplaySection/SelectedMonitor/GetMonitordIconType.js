import CircleIcon                   from '@mui/icons-material/Circle';
import DonutSmallIcon               from '@mui/icons-material/DonutSmall';
import {
  fnIsState,
  fnIsMagnitude,
  fnIsMonitor,
  fnIsSimpleArray,
  fnIsDoubleArray
}
from '../../../standarFunctions'

const GetMonitordIconType = ({type}) => {
	let defineIcon;
	/*
	 * if magnitude
	 */
	if (fnIsMagnitude(type))
		defineIcon = <CircleIcon className ="color-type-indicator_magnitud_gray" />
	/*
	 * if scalar
	 */
	else if (fnIsMonitor(type))
		defineIcon = <CircleIcon className ="color-type-indicator_scalar_blue" />
	/*
	 * if scalar array
	 */
	else if (fnIsSimpleArray(type))
		defineIcon = <DonutSmallIcon className ="color-type-indicator_array_yellow" />
	/*
	 * if doubleArray
	 */
	else if (fnIsDoubleArray(type))
		defineIcon = <DonutSmallIcon className ="color-type-indicator_doubleArray_purple" />
	/*
	 * if state
	 */
	if (fnIsState(type))
		defineIcon = <CircleIcon className ="color-type-indicator_state" />

	return(
		<div className="monitor-seleted-typeIcon">
			{ defineIcon }
		</div>
	);
}

export default GetMonitordIconType;
