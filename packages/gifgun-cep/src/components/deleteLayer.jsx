import {evalScript} from './evalScript'

function deleteLayer(index) {
    return new Promise((resolve,reject) => {
        evalScript('deleteLayer', {index: index}).then(() => {
            resolve('deleted swap Layer');
        }).catch((error) => {
            reject(error);
        });
    })

}

export {deleteLayer};