/**
 * archive, generates self signed certificate and signing a zxp package
 */
 const fs = require('fs')
 const path = require('path')
 const zxpSignCmd = require('zxp-sign-cmd')
//  const utils = require('./utils.js')
 const pluginConfig = require('./CertOptions.js')
 const isWindows = false;
 const distFolder = pluginConfig.destinationFolder
 const srcFolder = pluginConfig.sourceFolder
 const pluginFolder = path.join(distFolder, pluginConfig.extensionBundleId)
 const extensionBundleId = pluginConfig.extensionBundleId
 const certificate_options = pluginConfig.certificate
 const zxpFile = path.join(distFolder, pluginConfig.extensionBundleId + '.zxp')
 const chalk = require('chalk');
 const zxpProvider = require('zxp-provider')
 
 archive()
 
 function archive() {
     log_progress('ARCHIVE', 'blue')
     
     var prepare = prepareCert();
     prepare.then(res => {
        log_progress("got hereee;")
         signPackage(res)
    })
     .then(res => {
         log_progress(`package is signed: ${zxpFile}`, 'green')
         log_progress('DONE', 'blue')
     })
     .catch(err => {log_error(err)})
 }
 
 /**
  * find a custom certificate or generate a self sign the certificate
  *
  * @return {Promise} a promise, that resolves the cert data {path, password}
  */
 function prepareCert() {
     const options_custom_cert = certificate_options.customCert
     const options_self_sign = certificate_options.selfSign
     const isCustom = options_custom_cert && options_custom_cert.path.trim() !== ''
     var path='', password=''
 
     if(isCustom) {
         path = options_custom_cert.path
         password = options_custom_cert.password
     } else if(options_self_sign){
         path = options_self_sign.output
         password = options_self_sign.password
     }
 
     const isValid = path!==undefined && path.trim()!==''
     const data = {path, password}
 
    //  on non windows, we need to change the permissions
     if(!isWindows) {
        const osx = zxpProvider.supportedPlatforms.osx
         var providerStr = zxpProvider({ os: osx })
         // for some reason the path returns quoted, so I un-quote
         var unquote = providerStr.substring(1, providerStr.length - 1)
         fs.chmodSync(unquote, '755')
     }
 
     return new Promise((resolve, reject) => {
         if(!isValid) {
             reject('no valid cert info')
 
             return
         }
 
         if(isCustom) {
             log_progress('found a custom certificate')
             resolve(data)
         } else {
             log_progress('generating a self signed certificate')
             zxpSignCmd.selfSignedCert(options_self_sign).then((error, result) => {
                resolve(data)
             })
 
         }
 
     })
 
 }
 
 /**
  * sign the package
  *
  * @param  {{path, password}} cert description
  *
  * @return {Promise}  a promise
  */
 function signPackage(cert) {
     console.log("About to sign")
     const options = {
         input: srcFolder,
         output: zxpFile,
         cert: cert.path,
         password: cert.password
     }
 
     return new Promise((resolve, reject) => {
         zxpSignCmd.sign(options, function (error, result) {
             if(error) reject(error)
             else resolve(result)
 
         })
 
     })
 
 }

 function log_progress(val, color) {
    var c = color ? color : 'yellow'

    console.log(chalk[c](val))
}

function log_error(val) {
    log_progress(val, 'red')
}