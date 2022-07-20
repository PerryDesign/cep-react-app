function evalScript(script, params) {
    return new Promise((resolve, reject) => {
        var cs = new CSInterface();
        cs.evalScript(`${script}(${JSON.stringify(params)})`, (res) => {
            if (params && res) {
                console.log("Success eval of script " + script)
                resolve(res)
            } else if (!params && res) {
                console.log("Success eval of script " + script)
                resolve(res)
            } else {
                console.log("May have failed to execute script " + script)
                resolve(res)
            }
        })
    })
}

export { evalScript };