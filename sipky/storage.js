let matches = JSON.parse(localStorage.getItem("dartMatchesV23")) || [];
let emptyServers = JSON.parse(localStorage.getItem("dartEmptyServersV23")) || [];
let emptyLeagues = JSON.parse(localStorage.getItem("dartEmptyLeaguesV23")) || [];
let hiddenServers = JSON.parse(localStorage.getItem("dartHiddenServersV23")) || [];
let serverOrder = JSON.parse(localStorage.getItem("dartServerOrderV23")) || [];
let closedStates = JSON.parse(localStorage.getItem("dartClosedStatesV23")) || {};
let historyStack = [];

function pushToHistory() {
    const state = { matches: JSON.parse(JSON.stringify(matches)), emptyServers, emptyLeagues, hiddenServers, serverOrder };
    historyStack.push(JSON.stringify(state));
    if (historyStack.length > 20) historyStack.shift();
    updateUndoButton();
}

function undo() {
    if (historyStack.length === 0) return;
    const prev = JSON.parse(historyStack.pop());
    matches = prev.matches; emptyServers = prev.emptyServers; emptyLeagues = prev.emptyLeagues || []; hiddenServers = prev.hiddenServers; serverOrder = prev.serverOrder || [];
    localStorage.setItem("dartMatchesV23", JSON.stringify(matches));
    localStorage.setItem("dartEmptyServersV23", JSON.stringify(emptyServers));
    localStorage.setItem("dartEmptyLeaguesV23", JSON.stringify(emptyLeagues));
    localStorage.setItem("dartHiddenServersV23", JSON.stringify(hiddenServers));
    localStorage.setItem("dartServerOrderV23", JSON.stringify(serverOrder));
    updateUndoButton(); render();
}

function updateUndoButton() {
    const btn = document.getElementById("undoBtn");
    if (historyStack.length > 0) {
        btn.disabled = false; btn.className = "flex-1 bg-gray-900 hover:bg-gray-855 text-orange-500 rounded-lg border border-orange-900/40 flex items-center justify-center py-2.5 transition-all cursor-pointer";
    } else {
        btn.disabled = true; btn.className = "flex-1 bg-gray-900 text-gray-800 rounded-lg border border-gray-955 flex items-center justify-center py-2.5 transition-all opacity-30 cursor-not-allowed";
    }
}

function save(skipRender = false) {
    localStorage.setItem("dartMatchesV23", JSON.stringify(matches));
    localStorage.setItem("dartEmptyServersV23", JSON.stringify(emptyServers));
    localStorage.setItem("dartEmptyLeaguesV23", JSON.stringify(emptyLeagues));
    localStorage.setItem("dartHiddenServersV23", JSON.stringify(hiddenServers));
    localStorage.setItem("dartServerOrderV23", JSON.stringify(serverOrder));
    localStorage.setItem("dartClosedStatesV23", JSON.stringify(closedStates));
    if (!skipRender) render();
}
