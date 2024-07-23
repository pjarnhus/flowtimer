let activityBtn = document.getElementById('start')
let stopBtn = document.getElementById('stop')
let tracker = document.getElementById('tracker')

// Settings
const freezeTime = 600;
const extraBreakTime = 600;
const longWorkTime = 1500;

// Global Variables
let state = 0;
let prev_state = 0;

let tick = 0;
let longWorkTick = 0;
let longWorkCount = 0;
let extraBreakCount = 0;

let timeoutID = null;
let maxBreakCnt = tracker.children.length;

// Display Functions
function formatOutput(n)
{
    prefix = Math.abs(n) < 10 ? "0" : "";
    return prefix + n.toString();
}

function updateClock(hr, min, sec)
{
    // Update clock value
    document.getElementById('hr').innerHTML = formatOutput(hr);
    document.getElementById('min').innerHTML = formatOutput(min);
    document.getElementById('sec').innerHTML = formatOutput(sec);
} 

function updateTitle(hr, min, sec)
{
    if(state==0)
        document.title = "FlowTimer";
    else if(state == 1)
        document.title = "FlowTimer - Work - " + formatOutput(hr) + ":" + formatOutput(min) + ":" + formatOutput(sec);
    else if(state == -1)
        document.title = "FlowTimer - Break - " + formatOutput(hr) + ":" + formatOutput(min) + ":" + formatOutput(sec);
}    

function updateButton()
{
    if(state == 1)
        activityBtn.disabled = tick < freezeTime;
    if(activityBtn.disabled)
    {
        activityBtn.classList.remove('active');
        activityBtn.classList.add('inactive');
    }
    else
    {
        activityBtn.classList.remove('inactive');
        activityBtn.classList.add('active');
    }

}

function updateTracker()
{
    let allClasses = ['fa-star', 'fa-circle', 'fa-regular', 'fa-solid']
    let extraBreakIcon = ['fa-star', 'fa-solid']
    let longWorkIcon = ['fa-circle', 'fa-solid']
    let emptyIcon = ['fa-circle', 'fa-regular']
    for(let i=0; i < maxBreakCnt; i++)
    {
        tracker.children[i].classList.remove(...allClasses);
        if(i < extraBreakCount)
            tracker.children[i].classList.add(...extraBreakIcon);
        else if(i < extraBreakCount + longWorkCount)
            tracker.children[i].classList.add(...longWorkIcon);
        else
            tracker.children[i].classList.add(...emptyIcon);
    }
}

function updateDisplay()
{
    let sec = tick;
    let hr = Math.floor(tick/3600);
    sec = sec - 3600 * hr;
    let min = Math.floor(sec/60);
    sec = sec - 60 * min;
    updateClock(hr, min, sec);
    updateTitle(hr, min, sec);
    updateButton();
    updateTracker();
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
function onStateChange()
{
    if(state == 0)
    {
        tick = 0;
        longWorkTick = 0;
        activityBtn.innerHTML = 'Work';
        activityBtn.disabled = false;
        return
    }
    if(state == 1)
    {
        activityBtn.innerHTML = 'Break';
        return
    }
    if(state == -1)
    {
        tick = Math.floor(tick/5);
        tick += extraBreakCount * extraBreakTime;
        extraBreakCount = 0;
        activityBtn.disabled = true;
        return
    }
    
}

function resetTicks()
{
    tick = 0;
    longWorkTick = 0;
}

function resetCounts()
{
    extraBreakCount = 0;
    longWorkCount = 0;
}

function update()
{
    if(state != 0)
        timeoutID = setTimeout(update, 1000);
    
    if(prev_state != state)
    {
        onStateChange();
        prev_state = state;
    }

    tick += state;

    if(tick == 0)
        state = 0;
    
    updateLongWork();
    
    if(extraBreakCount == maxBreakCnt)
        state = -1;

    updateDisplay();

}

activityBtn.addEventListener('click', () => {
    state = state == 1 ? -1 : 1;
    if(timeoutID)
        timeoutID = clearTimeout(timeoutID);
    update();
});


stopBtn.addEventListener('click', () => {
    state = 0;
    resetCounts();
    resetTicks();

    if(timeoutID)
        timeoutID = clearTimeout(timeoutID);
    update();
});
