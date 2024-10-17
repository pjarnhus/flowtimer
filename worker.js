let state = 0;
let timeoutID = null;
let tick = 0;
let longWorkTick = 0;
let extraBreakCount = 0;
let longWorkCount = 0;
const longWorkTime = 1500;
const maxBreakCnt = 4;
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
function updateLongWork()
{
    longWorkTick += state;
    
    if(longWorkTick == longWorkTime)
    {
        longWorkCount++;
        longWorkTick = 0;
    }
    
    if(longWorkCount + extraBreakCount == maxBreakCnt)
    {
        extraBreakCount++;
        longWorkCount = 0;
    }
}


function update()
{
    if(state != 0)
        timeoutID = setTimeout(update, 1000);
    
    tick += state;

    if(tick == 0)
        state = 0;
    
    updateLongWork();
    
    if(extraBreakCount == maxBreakCnt)
    {
        state = -1;
        tick = Math.floor(tick/5);
        tick += extraBreakCount * extraBreakTime;
        extraBreakCount = 0;
    }

    post(state, tick, longWorkCount, extraBreakCount);

}

onmessage = function(e){
    state = e.data;
    if(timeoutID != null)
    {
        clearTimeout(timeoutID);
    }
    if(state == 0)
    {
        tick = 0;
        longWorkTick = 0;
        longWorkCount = 0;
        extraBreakCount = 0;
        post(state, tick, longWorkCount, extraBreakCount);
    }
    else if(state == -1)
    {
        tick = Math.floor(tick/5);
        tick += extraBreakCount * extraBreakTime;
        extraBreakCount = 0;
    }
    update();
}
