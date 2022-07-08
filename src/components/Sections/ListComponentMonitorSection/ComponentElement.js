import React          from 'react';
import folder         from '../../../commons/img/folderIcon.png';

const ComponentElement = ({ title, getMonitors }) => {
	return(
		<div className="componentItem-box-container">
			<div className="componentItem-box" onClick={() => { getMonitors(title) }}>
				<div className="componentItem-icon component-icon-color">
					<img src={folder} alt="folder" className="component_IMG-folder"/>
				</div>
				<div className="componentItem-title-div">
					<p className="componentItem-title"> { title } </p>
				</div>
			</div>
		</div>
	);
}

export default ComponentElement;
