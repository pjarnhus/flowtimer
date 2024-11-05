let state = 0;
let timeoutID = null;
let tick = 0;
let extraBreakCount = 0;
let longWorkCount = 0;
let startTime = Date.now();
let targetTime = 0;
const longWorkTime = 1500;
const maxBreakCount = 4;
const extraBreakTime = 600;
const freezeTime = 600;


function post(state, tick, longWorkCount, extraBreakCount)
{
    mess = {
        "tick": tick,
        "state": state,
        "longWorkCount": longWorkCount,
        "extraBreakCount": extraBreakCount,
        "disableButton": tick < freezeTime
    };
    self.postMessage(mess);
    return
}
function updateLongWork(tick)
{
    
    let tempCount = Math.floor(tick / longWorkTime);
    let K = 2 * maxBreakCount - 1;
    if(K**2 - 4 * (2 * tempCount -K) > 0)
    {
        extraBreakCount = Math.ceil((K-Math.sqrt(K**2 - 4 * (2 * tempCount - K)))/2);
        longWorkCount = tempCount - (extraBreakCount * maxBreakCount - extraBreakCount * (extraBreakCount - 1)/2);
    }
    else
    {
        extraBreakCount = maxBreakCount;
        longWorkCount = 0;
    }
    
}


function update()
{
    if(state != 0)
        timeoutID = setTimeout(update, 100);
    
    currentTime = Date.now();
    
    tick = targetTime + state * Math.floor((currentTime-startTime)/1000);

    if(tick <= 0 && state == -1)
    {
        state = 0;
        tick = 0;
        targetTime = 0;
    }

    
    if(state == 1)
        updateLongWork(tick);
    
    if(extraBreakCount == maxBreakCount)
    {
        state = -1;
        targetTime = Math.floor(tick/5);
        targetTime += extraBreakCount * extraBreakTime;
        extraBreakCount = 0;
    }

    post(state, tick, longWorkCount, extraBreakCount);

}

onmessage = function(e){
    state = e.data;
    startTime = Date.now();
    targetTime = 0;
    if(timeoutID != null)
    {
        clearTimeout(timeoutID);
    }
    if(state == 0)
    {
        tick = 0;
        longWorkCount = 0;
        targetTime = 0;
        extraBreakCount = 0;
        post(state, tick, longWorkCount, extraBreakCount);
    }
    else if(state == -1)
    {
        targetTime = Math.floor(tick/5);
        targetTime += extraBreakCount * extraBreakTime;
        extraBreakCount = 0;
    }
    update();
}
