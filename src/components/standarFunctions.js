/*
* This Functions are used in several components as like 'PerformQuery', 'listComponentMonitors'
* and 'getIcons'
*/

  // export const fnconstants = (name) => {
  //  this.UNKNOWN = 'UNKNOWN';
  //  this.STATE_TYPE = "x";
  // }
  /*
   * This function say if a monitor is a state or no.
   */
	export const fnIsState = (type) => {
		if ((type === "state"))
			return true;
		return false;
	}
  /*
   * This function say if a monitor is a magnitude or no.
   */
	export const fnIsMagnitude = (type) => {
		if ((type === "b")  || ( type === "e"))
			return true;
		return false;
	}
  /*
   * This function say if a monitor is a scalar monitor or no.
   */
	export const fnIsMonitor = (type) => {
		if ((type === "d") || (type ==="f") || (type === "l")
			|| (type === "s") || (type === "o") )
			return true;
		return false;
	}
  /*
   * This function say if a monitor is a simple array monitor or no.
   */
	export const fnIsSimpleArray = (type) => {
		if ((type === "D") || (type ==="F") || (type ==="L")
			|| (type === "S") || (type ==="O"))
			return true;
		return false;
	}
  /*
   * This function say if a monitor is a double array monitor or no.
   */
  export const fnIsDoubleArray = (type) => {
    if ((type ==="9")  || (type ==="8")|| (type ==="7")
        || (type ==="6") || (type === "5"))
       return true;
    return false;
  }
  /*
   * This function say if a monitor is a scalar monitor or no.
   */
	export const fnIsScalar = (type) => {
		if ((type === "d") || (type ==="f") || (type === "l")
			|| (type === "s") || (type === "o") || (type === "b")  || ( type === "e"))
			return true;
		return false;
	}

  /*
   * 
   */
	export const fnIsNumeric = (type) => {
		if((type === "d") || (type ==="f") || (type === "l")
			|| (type === "s") || (type === "o") ||(type === "D") 
			|| (type ==="F") || (type ==="L") || (type === "S") 
			|| (type ==="O") || (type ==="9")  || (type ==="8")
			|| (type ==="7")  || (type ==="6") || (type === "5") )
			return true
		return false
	}

  /*
   * This function say if a monitor is a array monitor or no.
   */
	export const fnIsArray = (type) => {
		if ((type === "D") || (type ==="F") || (type ==="L")
			|| (type === "S") || (type ==="O") || (type ==="9")  || (type ==="8")
			|| (type ==="7")  || (type ==="6") || (type === "5") )
			return true;
		return false;
	}

  /*
   * This function return the category type.
   */
	export const getCategory = (type) =>{
		if ((type === "D") || (type ==="F") || (type ==="L") || (type === "S")
				|| (type === "O") || (type === "9") || (type === "8")
					|| (type === "7") || (type === "6") || (type === "5")
					|| (type === "d") || (type === "f") || (type === "l")
				|| (type === "s") || (type === "o")){
			return "monitor";
		}else if ((type === "b")  || (type === "e") ){
			return "magnitud";
		}else if (type === 'state'){
			return "state";
		}
	}
