// --- Get other Components
import GetMonitordIconType       from './GetMonitordIconType';

const MonitorElement = ({ id, monitorData, component, select, diActivateReload }) => {
  /*
   * Get Icons
   */
  let icontype = <GetMonitordIconType type={ monitorData.type } />;

  return(
    <div id="dropitem" className="drag componentItem-box-container">
         <div className="componentItem-box" onClick={() => { select(id, monitorData, component); diActivateReload(); }}>
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
