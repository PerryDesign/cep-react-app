const path = require('path')
const root = __dirname
const srcFolder = path.join(root, "../Datamosh2")
const destFolder = path.join(root, "../build")
const certPath = path.join(destFolder, "cert.p12")
module.exports = {
    extensionBundleId: 'com.aescripts.datamosh2',
    extensionBundleName: 'Datamosh 2',
    extensionBundleVersion: '2.0.0',
    cepVersion: '8.0',
    panelName: 'Datamosh 2',
    width: '400',
    height: '600',
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate : {
        customCert: {
            path: '',
            password: 'password'
        },
        selfSign: {
            country: 'US',
            province: 'KY',
            org: 'Plugin Play',
            name: 'Daniel Perry',
            password: 'password',
            locality: 'locality',
            orgUnit: 'orgUnit',
            email: 'danny@pluginplay.app',
            output: certPath
        }

    }

}