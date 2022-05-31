// --- Get other Components
import GetMonitordIconType       from '../SelectDisplaySection/SelectedMonitor/GetMonitordIconType';

const MonitorElement = ({monitorData, select, diActivateReload }) => {
	/*
	 * Get Icons
	 */
	const icontype = <GetMonitordIconType type={ monitorData.type } />

	return(
		<div id={monitorData.id} className="drag componentItem-box-container monitor-element">
			<div 
				className="componentItem-box" 
				onClick={() => { 
					select(monitorData); 
					diActivateReload(); 
				}}
			>
				<div className="componentItem-icon">
					{ icontype }
				</div>
				<div className="monitorItem-title-div">
					<p className="monitorItem-title"> { monitorData.magnitude } </p>
				</div>
			</div>
		</div>
	);
}

export default MonitorElement;
