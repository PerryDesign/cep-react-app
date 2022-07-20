function openUrl_button(url) {
    var cs = new CSInterface();
    if(url){
        var res = cs.openURLInDefaultBrowser(url)
        console.log(res)
    }
}

export {openUrl_button}; 