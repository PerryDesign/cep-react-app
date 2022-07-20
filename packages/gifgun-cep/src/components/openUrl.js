const openUrl = (e) => {

    var cs = new CSInterface();
    e.preventDefault()
    var url = e.target.href;
    if(url){
        var res = cs.openURLInDefaultBrowser(url)
        console.log(res)
    }
    
}

export {openUrl}; 