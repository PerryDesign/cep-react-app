import {createNotification} from './createNotification'

function activeCompHandler(item) {
    
    if(!item){
        createNotification('error',"Active item is not a composition. Please select the composition first.")
    }
    return item;
    

}

export {activeCompHandler};