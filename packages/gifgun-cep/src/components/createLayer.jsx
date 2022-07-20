import {evalScript} from './evalScript'

function createLayer(type,layerKey) {
    var string;

    if(type == 'mv'){string = 'Mosh-MV-'};
    if(type == 'swap'){string = 'Mosh-Swap-'};
    if(type == 'map'){string = 'Mosh-Map-'};

    return new Promise((resolve,reject) => {


        evalScript('makeNewMoshLayer', {layerKey:layerKey,string:string}).then(() => {
            resolve('madeNew moshLayer');
        }).catch((error) => {
            reject(error);
        });
    })

}

export {createLayer};