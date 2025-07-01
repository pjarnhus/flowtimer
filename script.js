let activityBtn = document.getElementById('start')
let stopBtn = document.getElementById('stop')
let tracker = document.getElementById('tracker')
// Get overlay elements
const overlay = document.getElementById('activity-overlay');
const descInput = document.getElementById('activity-desc');
const saveBtn = document.getElementById('save-desc');
const cancelBtn = document.getElementById('cancel-desc');

let maxBreakCnt = tracker.children.length;
let extraBreakCount = 0;
let longWorkCount = 0;
let state = 0;

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

function updateDisplay(tick)
{
    let sec = tick;
    let hr = Math.floor(tick/3600);
    sec = sec - 3600 * hr;
    let min = Math.floor(sec/60);
    sec = sec - 60 * min;
    updateClock(hr, min, sec);
    updateTitle(hr, min, sec);
    updateTracker();
}


function updateButton(newState)
{
    activityBtn.disabled = newState;
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


// Show overlay function
function showOverlay() {
    descInput.value = ""; // clear previous value
    overlay.style.display = "flex";
    descInput.focus();
}

// Hide overlay function
function hideOverlay() {
    overlay.style.display = "none";
}



function onStateChange()
{
    if(state == 0)
    {
        activityBtn.innerHTML = 'Work';
        updateButton(false);
        return
    }
    if(state == 1)
    {
        activityBtn.innerHTML = 'Break';
        return
    }
}


const worker = new Worker('worker.js');

worker.onmessage = (event) => {
    extraBreakCount = event.data['extraBreakCount'];
    longWorkCount = event.data['longWorkCount'];
    if(state != event.data['state'])
    {
        state = event.data['state'];
        onStateChange();
    }
    if((event.data['disableButton'] ^ activityBtn.disabled) && state == 1)
    {
        updateButton(event.data['disableButton']);
    }
    updateDisplay(event.data['tick']);
}

activityBtn.addEventListener('click', () => {
    if(activityBtn.innerHTML == 'Break'){
        showOverlay();
    }
    else {
        worker.postMessage(1);
    }
});

// Save button
saveBtn.addEventListener('click', () => {
    const description = descInput.value.trim();
    if(description) {
        // You can save the description somewhere or send it to the worker if needed
        // For now, just proceed as before:
        worker.postMessage(-1);
        hideOverlay();
        // Optionally, store or use the description, e.g.,
        // localStorage.setItem('lastActivityDesc', description);
    } else {
        alert("Please enter a description.");
    }
});


stopBtn.addEventListener('click', () => {
    worker.postMessage(0);
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    hideOverlay();
});
