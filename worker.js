let state = 0;
let timeoutID = null;
let tick = 0;
let longWorkTick = 0;
let extraBreakCount = 0;
let longWorkCount = 0;
const longWorkTime = 1500;
const maxBreakCnt = 4;


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
        state = -1;

    mess = {
        "tick": tick,
        "state": state,
        "longWorkCount": longWorkCount,
        "extraBreakCount": extraBreakCount
    };
    self.postMessage(mess);

}

onmessage = function(e){
    state = e.data;
    if(state == 0)
    {
        tick = 0;
    }
    if (timeoutID == null)
    {
        update();
    }
}
