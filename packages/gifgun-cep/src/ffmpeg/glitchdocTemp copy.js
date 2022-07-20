var moshInstructions = JSON.parse(`

`);
// Above is JSON obj

// Variables
var frameNumber = 1;
var currentFrameMVs = [];
var tail_length = 1;
var prev_fwd_mvs = [];
var effectedMVs = [];

var holdFrame = false;
var xPercentDone = 0;
var yPercentDone = 0;
var markerCompletion;
var frameIn;
var frameOut;
var frameDuration;
var height;
var width
// Mosh User Settings
var holdFrames;
var intensity;
var blend;
var oppBlend;
var acceleration;
var threshold;
var swapFI;
var swapFO;
var swapWI;

// Inputs
var compSize = moshInstructions.compData.size;
var frameRate = moshInstructions.compData.frameRate;
var workAreaIn = moshInstructions.compData.workAreaIn;
var workAreaOut = moshInstructions.compData.workAreaOut;
var workAreaDuration = moshInstructions.compData.duration;
var mvsDetected = moshInstructions.moduleMVData.length != 0 ? true : false;
var accelThreshold = moshInstructions.accelThreshold;
var accelerate;
var currentModule;
var currentRanBlocks = [];
var ranBlockCount;

var firstRun = true;




// GLITCH FRAME FUNCTION
function glitch_frame(frame, number_of_frames, last_frame)
{   
    // Map through Modules
    moshInstructions.modules.map((module,m) => {
        frameIn = parseInt((frameRate * module.markerIn - frameRate * workAreaIn).toFixed());
        frameOut = parseInt((frameRate * module.markerOut - frameRate * workAreaIn).toFixed());
        frameDuration = frameOut-frameIn;

        if( frameNumber >= frameIn && frameNumber <= frameOut ){
            // Set marker completion
            currentModule = module;
            markerCompletion = (frameNumber-frameIn)/frameDuration;
            // Set User settings from module
            holdFrames = module.moshData.holdFrames;
            intensity = module.moshData.intensity*.01;
            blend = blend >100 ? 1 : module.moshData.blend *.01;
            oppBlend = 1-blend;
            acceleration = module.moshData.acceleration *.1;
            threshold = module.moshData.threshold;
            swapFI = module.moshData.swapFI;
            swapFO = module.moshData.swapFO;
            swapWI = module.moshData.swapWI;
            //Set some algos
            accelerate = 1 + ((frameNumber-frameIn)/frameRate)*acceleration
            alterMVs(frame,module);
        }
    })
    // Counters
    frameNumber++;
}

function effectMVs(mv,i,j){
    
    // Assign variables to MVs
    var inMV0 = mv[0];
    var inMV1 = mv[1];
    var mv0 = inMV0;
    var mv1 = inMV1;
    
    // Swap functions
    if(currentModule.preset.type == 'experimental'){
        
        var fadeInFunction = swapFI > (frameNumber-frameIn) ? (frameNumber-frameIn) / swapFI : 1;
        var fadeOutFunction = frameDuration-swapFO < (frameNumber-frameOut) ? ((frameDuration-(frameNumber-frameOut)))/swapFO : 1;
        var swapWeight = (.01*swapWI)*fadeInFunction*fadeOutFunction;
        var oppWeight = 1-swapWeight;

        moshInstructions.moduleMVData.map(mvObj => {
            if(mvObj.key == currentModule.key){
                    if(mvObj.mvs.length-1 > frameNumber-frameIn){
                        var swapMV0 = mvObj.mvs[frameNumber-frameIn+1].mv.forward[i][j][0]*swapWeight + inMV0*oppWeight;
                        var swapMV1 = mvObj.mvs[frameNumber-frameIn+1].mv.forward[i][j][1]*swapWeight + inMV1*oppWeight;
                        mv0 = swapMV0 * eval(currentModule.preset.mv0);
                        mv1 = swapMV1 * eval(currentModule.preset.mv1);
                    }
            }
        })
    }else{
        // Threshold
        var xyAverage = (Math.abs(inMV0)+Math.abs(inMV1))/2;
        var accelThresholdMult = accelThreshold ? accelerate : 1;
        var mvTrailVal = effectedMVs[i][j];
        if (mvTrailVal != 0){
            changeEffectedMVS(i,j,(mvTrailVal-1))
        } 
        else if ((threshold == 0) || Math.sign(threshold) == -1 ? (xyAverage<Math.abs(threshold*accelThresholdMult)) : (xyAverage>(threshold*2)-(threshold*accelThresholdMult)) ){
            // Set preset
            mv0 = eval(currentModule.preset.mv0);
            mv1 = eval(currentModule.preset.mv1);
            // Add blend & acceleration
            mv0 = (mv0*oppBlend + inMV0*blend);
            mv1 = (mv1*oppBlend + inMV1*blend);
            // Add acceleration
            mv0 = inMV0 != mv0 ? mv0 * accelerate : mv0;
            mv1 = inMV1 != mv1 ? mv1 * accelerate : mv1;
        } else{
            // Set effectedMVs
            changeEffectedMVS(i,j,36)
        }
    }
    
    // Pass altered MVS
    mv[0] = mv0;
    mv[1] = mv1;

    
}
function alterMVs(frame,module){

    // Set overflow
    frame["mv"]["overflow"] = "truncate";

    // Get into MVs
    let mvs = frame["mv"];
    if ( !mvs )
        return;
    let fwd_mvs = mvs["forward"];
    if ( !fwd_mvs )
        return;
    
    // Store previous mvs, if average store 15
    pushIntervalMVs(fwd_mvs)

    // Video Properties
    height = fwd_mvs.length;
    width = fwd_mvs[1].length;

    // Made GRID array for trails on first run
    if(firstRun){
        function createAndFillTwoDArray({ rows, columns, defaultValue }){
            return Array.from({ length:rows }, () => (
                Array.from({ length:columns }, ()=> defaultValue)
            ))
        };
        
        effectedMVs = createAndFillTwoDArray({rows: height, columns: width, defaultValue: 0});
        firstRun = false;
    }

  
    // loop through all rows
    for ( let i = 0; i < fwd_mvs.length; i++ ){
        let row = fwd_mvs[i];
        yPercentDone = i/height;
        // loop through all macroblocks
        for ( let j = 0; j < row.length; j++ ){
            let mv = row[j];
            xPercentDone = j/width;
            // Motion Vector edits
            effectMVs(mv,i,j);
        }
    }
}

// ADDITIONAL FUNCTIONS
function average_mv(mv, i, j, tailLength, xOrY){
    let avalaibleFrames = Math.min(tailLength, frameNumber, prev_fwd_mvs.length);
    tail_length = tailLength;
    
    let sum = 0;
    for ( let t = 0; t < avalaibleFrames; t++ ){
        sum += prev_fwd_mvs[t][i][j][xOrY];
    }
    let val = Math.round(sum / avalaibleFrames);
    val = Math.max(val, -30);
    val = Math.min(val,  30);;
    return val;
};
function add_mv(mv, i, j, tailLength, xOrY){
    let avalaibleFrames = Math.min(tailLength, frameNumber, prev_fwd_mvs.length)
    tail_length = tailLength;

    let sum = 0;
    for ( let t = 0; t < avalaibleFrames; t++ ){
        sum += prev_fwd_mvs[t][i][j][xOrY];
    }
    let val = sum;
    val = Math.max(val, -60);
    val = Math.min(val,  60);;
    return val;
};
function averageNeighbors(i, j, size, xOrY){
    let sum = 0;
    for ( let y = -1*size; y <= size; y++ ){
        for ( let x = -1*size; x <= size; x++ ){
            var yPos = y;
            var xPos = x;
            if(i+y < 0 || i+y > height-1) yPos=0;
            if(j+x < 0 || j+x > width-1) xPos=0;
            sum += prev_fwd_mvs[0][i+yPos][j+xPos][xOrY];
        }
    }
    let val = Math.round(sum / (size*size));
    val = Math.max(val, -30);
    val = Math.min(val,  30);;
    return val;
};
function pushIntervalMVs(newMVs){
    let MVJson = JSON.stringify(newMVs);
    let deepCopy = JSON.parse(MVJson);
    prev_fwd_mvs.push(deepCopy);
    if (prev_fwd_mvs.length > tail_length)  {prev_fwd_mvs = prev_fwd_mvs.slice(1)};
}

function randomBlocks(xOrY,i,j,frequency,xSize,ySize,freqRan,sizeRan,quantity,inMV0,inMV1){
    var returnMV0 = false;
    var returnMV1 = false;
    // Set Quantity
    if(ranBlockCount==undefined) ranBlockCount = quantity;
    

    // If this is 0x0 create the boxes
    if(xOrY==0 && i==0&&j==0){
        // If freq is accurate
        if(frameNumber % frequency == 0){
            for(var k = 0; k<ranBlockCount;k++){
                if(currentRanBlocks.length > ranBlockCount) currentRanBlocks = currentRanBlocks.slice(1);
                createNewRanBox()
            }
        }
        //Add more / take away less if freqRandom 
        if(newFreqRan()){
            currentRanBlocks = currentRanBlocks.slice(1);
            ranBlockCount--
        }
        if(newFreqRan()) {
            createNewRanBox(); 
            ranBlockCount++
        }
    }
    function createNewRanBox(){
        var ranX = Math.round(Math.random()*100)/100
        var ranY = Math.round(Math.random()*100)/100
        var xStart = Math.round(width*ranX);
        var yStart = Math.round(height*ranY);
        var xEnd = Math.round(width*xSize*newRanNum(sizeRan))+xStart;
        var yEnd = Math.round(height*ySize*newRanNum(sizeRan))+yStart;
        if(xEnd > width-1) xEnd = width-1;
        if(yEnd > height-1) yEnd = height-1;
        //Push new block into array
        currentRanBlocks.push([[xStart,yStart],[xEnd,yEnd]])
    }
    function newFreqRan() {
        return (freqRan*Math.random() > Math.random() ? true : false);
    };
    function newRanNum(type){
        var initFreq = Math.round(Math.random()*100*type)/100
        var multiplier = initFreq*100 % 2 ? 1 : -1;
        return (1+(initFreq*multiplier));
    };

    currentRanBlocks.map(block => {
        if(i>block[0][1] && j>block[0][0]){
            if(i<block[1][1] && j<block[1][0]){
                returnMV0 = true;
                returnMV1 = true;
            }
        }
    })
    return (xOrY == 0 ? returnMV0 : returnMV1); 

}

function changeEffectedMVS(i,j,val){
    let newEffectedMVs = effectedMVs
    newEffectedMVs[i][j] = val;

    let MVJson = JSON.stringify(newEffectedMVs);
    let deepCopy = JSON.parse(MVJson);
    effectedMVs = deepCopy;
}
