const translations = {
    cs: {
        homeBtn: "Domů / Rozcestník",
        timelineBtn: "Aktuální zápasy",
        undoBtn: "Zpět",
        manageServersBtn: "Spravovat servery",
        mainTitle: "🎯 Moje Šipkařské Ligy",
        timelineTitle: "🗓️ Aktuální zápasy",
        addMatchBtn: "Přidat zápas / ligu",
        formTitleAdd: "Přidat zápas",
        formModeSingle: "Jeden zápas",
        formModeBulk: "Hromadně (celá liga)",
        optNewServer: "+ Nový server...",
        formMatchFormat: "Formát zápasu & Délka",
        formMaxWeekly: "Max zápasů týdně",
        formFinalDeadline: "Konečná deadline (datum)",
        optFlexi: "Flexibilní zápas (odehraju kdykoliv)",
        optFixed: "Pevné kolo / Týden",
        formBulkDateLabel: "Datum prvního týdne (pro automatické rozpočítání po týdnech):",
        formOpponentsLabel: "Seznam soupeřů (každé jméno na nový řádek):",
        formRematchesLabel: "Včetně odvet (zduplikovat celý seznam jako druhé kolo)",
        btnCancel: "Zrušit",
        btnSave: "Uložit",
        btnSelectAll: "Vybrat vše",
        btnDeleteSelected: "Smazat vybrané",
        btnSaveClose: "Uložit a zavřít",
        modalClearLeagues: "Smazat ligy",
        modalManageServers: "Spravovat servery a pořadí",
        modalManageServersDesc: "Použij šipky pro změnu pořadí serverů. Můžeš je také skrýt nebo trvale smazat.",
        emptyMatchesLabel: "Žádné domluvené ani označené zápasy k dohrávce.",
        lblConfirmedCheck: "Potvrzeno?",
        btnDelete: "Smazat",
        placeholderWeek: "Kolo / Týden",
        placeholderDateInput: "dd.mm.rrrr",
        termLabel: "TERMÍN",
        noTermLabel: "Bez termínu",
        mustPlayLabel: "🔥 Dohrávka",
        tooltipClose: "Zavřít",
        tooltipSave: "Uložit změny",
        tooltipDelete: "Smazat zápas",
        tooltipEdit: "Upravit zápas",
        tooltipGCal: "Přidat do Google Kalendáře",
        badgeEditTitle: "Úprava",
        btnAddMatchToLeague: "+ Přidat zápas do této ligy"
    },
    de: {
        homeBtn: "Hauptmenü / Übersicht",
        timelineBtn: "Aktuelle Spiele",
        undoBtn: "Rückgängig",
        manageServersBtn: "Server verwalten",
        mainTitle: "🎯 Meine Darts-Ligen",
        timelineTitle: "🗓️ Aktuelle Spiele",
        addMatchBtn: "Spiel / Liga hinzufügen",
        formTitleAdd: "Spiel hinzufügen",
        formModeSingle: "Einzelnes Spiel",
        formModeBulk: "Massenhaft (ganze Liga)",
        optNewServer: "+ Neuer Server...",
        formMatchFormat: "Spielformat & Dauer",
        formMaxWeekly: "Max. Spiele pro Woche",
        formFinalDeadline: "Endgültige Deadline (Datum)",
        optFlexi: "Flexibles Spiel (jederzeit spielbar)",
        optFixed: "Feste Spielwoche / Runde",
        formBulkDateLabel: "Datum der ersten Woche (für automatische Wochenberechnung):",
        formOpponentsLabel: "Gegnerliste (jeder Name in eine neue Zeile):",
        formRematchesLabel: "Inklusive Rückspiele (gesamte Liste verdoppeln)",
        btnCancel: "Abbrechen",
        btnSave: "Speichern",
        btnSelectAll: "Alle auswählen",
        btnDeleteSelected: "Ausgewählte Ligen löschen",
        btnSaveClose: "Speichern & Schließen",
        modalClearLeagues: "Ligen löschen",
        modalManageServers: "Server & Reihenfolge verwalten",
        modalManageServersDesc: "Verwende die Pfeile, um die Reihenfolge der Server zu ändern.",
        emptyMatchesLabel: "Keine vereinbarten oder zum Nachholen markierten Spiele.",
        lblConfirmedCheck: "Bestätigt?",
        btnDelete: "Löschen",
        placeholderWeek: "Runde / Woche",
        placeholderDateInput: "tt.mm.jjjj",
        termLabel: "TERMIN",
        noTermLabel: "Kein Termin",
        mustPlayLabel: "🔥 Nachholspiel",
        tooltipClose: "Schließen",
        tooltipSave: "Änderungen speichern",
        tooltipDelete: "Spiel löschen",
        tooltipEdit: "Spiel bearbeiten",
        tooltipGCal: "Zu Google Kalender hinzufügen",
        badgeEditTitle: "Bearbeiten",
        btnAddMatchToLeague: "+ Spiel zu dieser Liga hinzufügen"
    }
};

let currentLang = localStorage.getItem("dartLang") || "cs";

function toggleLanguage() {
    setLanguage(currentLang === "cs" ? "de" : "cs");
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("dartLang", lang);
    document.getElementById("langSwitcher").innerText = lang === "cs" ? "🇩🇪" : "🇨🇿";
    translateUI();
    render();
}

function handleDatePlaceholder(input) {
    if (input.value) {
        input.classList.remove("empty-date");
        input.style.setProperty("--date-opacity", "1");
    } else {
        input.classList.add("empty-date");
        input.style.setProperty("--date-opacity", "0");
    }
}

function setupDateInput(input) {
    input.setAttribute("data-placeholder", translations[currentLang].placeholderDateInput);
    handleDatePlaceholder(input);
}

function translateUI() {
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    document.getElementById("formComp").placeholder = currentLang === "cs" ? "Liga / Cup (např. Cup 6c, Liga Division E)" : "Liga / Cup (z.B. Cup 6c, Liga Division E)";
    document.getElementById("formWeek").placeholder = translations[currentLang].placeholderWeek;
    document.getElementById("formOpponent").placeholder = currentLang === "cs" ? "Soupeř" : "Gegner";

    const ffd = document.getElementById("formFinalDeadline");
    if (ffd) setupDateInput(ffd);
    const fbs = document.getElementById("formBulkStartDate");
    if (fbs) setupDateInput(fbs);

    document.getElementById("btnHomeIcon").title = translations[currentLang].homeBtn;
    document.getElementById("btnTimelineIcon").title = translations[currentLang].timelineBtn;
    document.getElementById("undoBtn").title = translations[currentLang].undoBtn;
    document.getElementById("btnAddIcon").title = translations[currentLang].addMatchBtn;
    document.getElementById("langSwitcher").title = currentLang === "cs" ? "Switch to German / Přepnout do němčiny" : "Auf Tschechisch umstellen / Přepnout do češtiny";
    document.getElementById("btnManageIcon").title = translations[currentLang].manageServersBtn;
}

let matches = JSON.parse(localStorage.getItem("dartMatchesV23")) || [];
let emptyServers = JSON.parse(localStorage.getItem("dartEmptyServersV23")) || [];
let emptyLeagues = JSON.parse(localStorage.getItem("dartEmptyLeaguesV23")) || [];
let hiddenServers = JSON.parse(localStorage.getItem("dartHiddenServersV23")) || [];
let serverOrder = JSON.parse(localStorage.getItem("dartServerOrderV23")) || [];
let closedStates = JSON.parse(localStorage.getItem("dartClosedStatesV23")) || {};
let editingMatchIds = new Set();
let historyStack = [];
let currentView = "home";
let formMode = "single";
let activeDeleteServerName = "";

function getLegsFromFormat(formatStr) {
    if (!formatStr) return 7;
    const fmtLower = formatStr.toLowerCase();
    const matchNum = fmtLower.match(/\d+/);
    if (!matchNum) return 7;
    const num = parseInt(matchNum[0]);
    if (fmtLower.includes("first to") || fmtLower.includes("race to")) return (2 * num) - 1;
    return num;
}

function calculateDurationMinutes(formatStr) {
    const legs = getLegsFromFormat(formatStr);
    if (legs <= 8) return 30;
    if (legs <= 11) return 45;
    return 60;
}

function autoCalcDuration() {
    const formatStr = buildFormatString();
    document.getElementById("formDuration").value = calculateDurationMinutes(formatStr);
}

function toggleMustPlay(id) {
    pushToHistory();
    const match = matches.find(m => m.id === id);
    if (match) {
        match.mustPlay = !match.mustPlay;
        save();
    }
}

function toggleConfirmed(id) {
    pushToHistory();
    const match = matches.find(m => m.id === id);
    if (match) {
        match.confirmed = !match.confirmed;
        save();
    }
}

function toggleEditMatch(id) {
    if (editingMatchIds.has(id)) {
        editingMatchIds.delete(id);
    } else {
        editingMatchIds.add(id);
    }
    render();
}

function clearMatchDateInEdit(id) {
    const dateEl = document.getElementById(`edit-date-${id}`);
    const timeEl = document.getElementById(`edit-time-${id}`);
    if (dateEl) { dateEl.value = ""; handleDatePlaceholder(dateEl); }
    if (timeEl) timeEl.value = "";
}

function saveMatchEdit(id) {
    pushToHistory();
    const match = matches.find(m => m.id === id);
    if (match) {
        const dateEl = document.getElementById(`edit-date-${id}`);
        const timeEl = document.getElementById(`edit-time-${id}`);
        const weekEl = document.getElementById(`edit-week-${id}`);
        const notesEl = document.getElementById(`edit-notes-${id}`);

        if (dateEl) match.date = dateEl.value;
        if (timeEl) match.time = timeEl.value;
        if (weekEl) match.week = weekEl.value.trim();
        if (notesEl) match.notes = notesEl.value.trim();

        match.status = match.date ? "scheduled" : "unscheduled";
        if (!match.date) match.confirmed = false;

        editingMatchIds.delete(id);
        save();
    }
}

function openGoogleCalendar(id) {
    const match = matches.find(m => m.id === id);
    if (!match || !match.date) return;

    const cleanDate = match.date.replace(/-/g, "");
    const duration = match.duration || calculateDurationMinutes(match.format);

    let startIso = "", endIso = "";
    if (match.time) {
        const parts = match.time.split(":");
        const startHour = parseInt(parts[0]), startMin = parseInt(parts[1]);
        const startDateObj = new Date(match.date);
        startDateObj.setHours(startHour, startMin, 0);
        const endDateObj = new Date(startDateObj.getTime() + duration * 60000);
        const pad = (n) => n.toString().padStart(2, "0");
        startIso = `${cleanDate}T${pad(startHour)}${pad(startMin)}00`;
        endIso = `${endDateObj.getFullYear()}${pad(endDateObj.getMonth() + 1)}${pad(endDateObj.getDate())}T${pad(endDateObj.getHours())}${pad(endDateObj.getMinutes())}00`;
    } else {
        startIso = cleanDate; endIso = cleanDate;
    }

    const title = encodeURIComponent(`🎯 [${match.server}] ${match.comp} - ${match.format} - ${match.opponent}`);
    let detailsText = `Soupeř: ${match.opponent}\nFormát: ${match.format}\nServer: ${match.server}\nLiga: ${match.comp}\nDélka: ${duration} min`;
    if (match.week) detailsText += `\nKolo: ${match.week}`;
    if (match.notes) detailsText += `\nPoznámka: ${match.notes}`;
    if (match.webUrl) detailsText += `\nWeb: ${match.webUrl}`;
    if (match.discordUrl) detailsText += `\nDiscord: ${match.discordUrl}`;

    const details = encodeURIComponent(detailsText);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`, '_blank');
}

function importTxt(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) { parseTxtData(e.target.result); };
    reader.readAsText(file);
}

function parseTxtData(textText) {
    pushToHistory();
    const newMatches = [];
    const blocks = textText.split(/----+/).map(b => b.trim()).filter(b => b.length > 0);

    blocks.forEach((block, bIdx) => {
        const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) return;

        const headerLine = lines[0];
        const headerParts = headerLine.split("->").map(p => p.trim());
        let server = "", compFull = "", format = "BO 8 501 DO", weekInfo = "", webUrl = "", discordUrl = "";

        headerParts.forEach(part => {
            if (part.startsWith("http")) {
                if (part.includes("discord")) discordUrl = part;
                else webUrl = part;
            }
        });

        const nonUrlParts = headerParts.filter(p => !p.startsWith("http"));
        if (nonUrlParts.length >= 3) {
            server = nonUrlParts[0]; compFull = nonUrlParts[1]; format = nonUrlParts[2] || format;
            if (nonUrlParts[3]) weekInfo = nonUrlParts[3];
        } else {
            compFull = nonUrlParts[0] || "Liga"; format = nonUrlParts[1] || format;
            if (nonUrlParts[2]) weekInfo = nonUrlParts[2];
            const combined = `${compFull} ${webUrl} ${discordUrl}`.toLowerCase();
            if (combined.includes("edc")) server = "EDC";
            else if (combined.includes("scolia")) server = "Scolia Checkout Community";
            else if (combined.includes("dartfan")) server = "Dartfan online";
            else if (combined.includes("hood")) server = "HOOD";
            else if (combined.includes("dbf")) server = "DBF";
            else server = "Ostatní";
        }

        const duration = calculateDurationMinutes(format);

        lines.slice(1).forEach((mLine, mIdx) => {
            if (!mLine.startsWith("-")) return;
            const matchParts = mLine.replace(/^-/, "").trim().split("->").map(p => p.trim());
            const opponent = matchParts[0];
            let date = "", time = "", confirmed = false, mustPlay = false, week = weekInfo, notes = "";

            matchParts.slice(1).forEach(part => {
                if (part.includes("🔥")) mustPlay = true;
                else if (part.startsWith("W:")) week = part.replace("W:", "").trim();
                else if (part.startsWith("NOTE:")) notes = part.replace("NOTE:", "").trim();
                else {
                    const dtMatch = part.match(/(\d{1,2})\.(\d{1,2})\.?(?:\s+(\d{1,2}:\d{2}))?/);
                    if (dtMatch) {
                        date = `${new Date().getFullYear()}-${dtMatch[2].padStart(2, '0')}-${dtMatch[1].padStart(2, '0')}`;
                        if (dtMatch[3]) time = dtMatch[3];
                        confirmed = true;
                    }
                }
            });

            newMatches.push({
                id: Date.now() + (bIdx * 100) + mIdx,
                server, comp: compFull, opponent, format, duration,
                type: week ? "fixed" : "flexi", week, date, time, confirmed, mustPlay,
                status: date ? "scheduled" : "unscheduled", notes, maxWeekly: "", finalDeadline: "", discordUrl, webUrl
            });
        });
    });

    if (newMatches.length > 0) {
        matches = newMatches; save(); alert(currentLang === "cs" ? "TXT soubor byl úspěšně načten!" : "TXT-Datei erfolgreich geladen!");
    }
}

function exportTxt() {
    const grouped = {};
    matches.forEach(m => {
        const key = `${m.server}::${m.comp}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
    });

    let txtContent = "";
    Object.keys(grouped).forEach((key, idx) => {
        const compMatches = grouped[key], first = compMatches[0];
        let header = `${first.server} -> ${first.comp}`;
        if (first.format) header += ` -> ${first.format}`;
        if (first.week) header += ` -> ${first.week}`;
        if (first.webUrl) header += ` -> ${first.webUrl}`;
        if (first.discordUrl) header += ` -> ${first.discordUrl}`;
        txtContent += `${header}\n`;

        compMatches.forEach(m => {
            let line = `- ${m.opponent}`;
            if (m.date) {
                const parts = m.date.split("-");
                line += ` -> ${parts[2]}.${parts[1]}.`;
                if (m.time) line += ` ${m.time}`;
            } else { line += ` -> `; }
            if (m.mustPlay) line += ` -> 🔥`;
            if (m.week) line += ` -> W: ${m.week}`;
            if (m.notes) line += ` -> NOTE: ${m.notes}`;
            txtContent += `${line}\n`;
        });
        if (idx < Object.keys(grouped).length - 1) txtContent += `\n---------------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Šipky zápasy.txt";
    link.click();
}

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

function toggleForm(presetServer = null, presetComp = null) {
    const form = document.getElementById("matchForm");
    form.classList.toggle("hidden");
    if (!form.classList.contains("hidden")) {
        if (presetServer) { document.getElementById("formServer").value = presetServer; checkNewServer(presetServer); }
        if (presetComp) document.getElementById("formComp").value = presetComp;
        autoCalcDuration();
    }
}

function setFormMode(mode) {
    formMode = mode;
    document.getElementById("mode-single").className = mode === "single" ? "px-3 py-1 rounded bg-orange-600 font-semibold text-white" : "px-3 py-1 rounded text-gray-400 font-semibold";
    document.getElementById("mode-bulk").className = mode === "bulk" ? "px-3 py-1 rounded bg-orange-600 font-semibold text-white" : "px-3 py-1 rounded text-gray-400 font-semibold";
    document.getElementById("singleOpponentContainer").classList.toggle("hidden", mode !== "single");
    document.getElementById("singleWeekContainer").classList.toggle("hidden", mode !== "single");
    document.getElementById("bulkContainer").classList.toggle("hidden", mode !== "bulk");
    document.getElementById("formTitle").innerText = mode === "single" ? translations[currentLang].formTitleAdd : translations[currentLang].formModeBulk;
}

function checkNewServer(val) {
    document.getElementById("formNewServerInput").classList.toggle("hidden", val !== "__NEW__");
}

function toggleCollapse(key) { closedStates[key] = !closedStates[key]; save(); }

function setView(view) {
    currentView = view;
    document.getElementById("filterContainer").classList.toggle("hidden", view !== "timeline");
    document.getElementById("pageTitle").innerText = view === "home" ? translations[currentLang].mainTitle : translations[currentLang].timelineTitle;
    render();
}

function goHome() { setView("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToElement(id) { setView("home"); setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }

function editServerName(oldName) {
    const newName = prompt(currentLang === "cs" ? `Zadej nový název pro server "${oldName}":` : `Neuer Name für Server "${oldName}":`, oldName);
    if (newName && newName.trim() !== oldName) {
        pushToHistory();
        matches.forEach(m => { if (m.server === oldName) m.server = newName.trim(); });
        emptyLeagues.forEach(l => { if (l.server === oldName) l.server = newName.trim(); });
        if (emptyServers.includes(oldName)) emptyServers[emptyServers.indexOf(oldName)] = newName.trim();
        if (hiddenServers.includes(oldName)) hiddenServers[hiddenServers.indexOf(oldName)] = newName.trim();
        if (serverOrder.includes(oldName)) serverOrder[serverOrder.indexOf(oldName)] = newName.trim();
        updateServerSelect(); save();
    }
}

function editCompName(serverName, oldCompName) {
    const newName = prompt(currentLang === "cs" ? `Zadej nový název pro ligu "${oldCompName}":` : `Neuer Name für Liga "${oldCompName}":`, oldCompName);
    if (newName && newName.trim() !== oldCompName) {
        pushToHistory();
        matches.forEach(m => { if (m.server === serverName && m.comp === oldCompName) m.comp = newName.trim(); });
        emptyLeagues.forEach(l => { if (l.server === serverName && l.comp === oldCompName) l.comp = newName.trim(); });
        save();
    }
}

function moveServerOrder(serverName, dir) {
    pushToHistory();
    const all = getAllServersOrdered(), idx = all.indexOf(serverName), target = idx + dir;
    if (target >= 0 && target < all.length) {
        const temp = all[idx]; all[idx] = all[target]; all[target] = temp; serverOrder = all; save(); openServerManager();
    }
}

function getAllServersOrdered() {
    const existing = [...new Set([...matches.map(m => m.server), ...emptyServers, ...emptyLeagues.map(l => l.server)])];
    let ordered = [];
    serverOrder.forEach(s => { if (existing.includes(s)) ordered.push(s); });
    existing.forEach(s => { if (!ordered.includes(s)) ordered.push(s); });
    return ordered;
}

function openLeagueDeleteModal(serverName) {
    activeDeleteServerName = serverName;
    document.getElementById("leagueDeleteServerDesc").innerText = `Server: ${serverName}`;
    const list = document.getElementById("leagueDeleteList");
    list.innerHTML = "";
    const comps = [...new Set([...matches.filter(m => m.server === serverName).map(m => m.comp), ...emptyLeagues.filter(l => l.server === serverName).map(l => l.comp)])];
    comps.forEach(comp => {
        list.innerHTML += `<label class="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer select-none"><input type="checkbox" value="${comp}" class="league-del-cb h-4 w-4 accent-orange-500"><span class="text-sm font-semibold">${comp}</span></label>`;
    });
    document.getElementById("leagueDeleteModal").classList.remove("hidden");
}

function closeLeagueDeleteModal() { document.getElementById("leagueDeleteModal").classList.add("hidden"); }
function selectAllLeaguesForDelete(check) { document.querySelectorAll(".league-del-cb").forEach(cb => cb.checked = check); }

function confirmLeagueDeletes() {
    const selected = Array.from(document.querySelectorAll(".league-del-cb:checked")).map(cb => cb.value);
    if (selected.length === 0) { closeLeagueDeleteModal(); return; }
    if (confirm(translations[currentLang].confirmDeleteSelectedLeagues)) {
        pushToHistory();
        matches = matches.filter(m => !(m.server === activeDeleteServerName && selected.includes(m.comp)));
        emptyLeagues = emptyLeagues.filter(l => !(l.server === activeDeleteServerName && selected.includes(l.comp)));
        save(); closeLeagueDeleteModal();
    }
}

function openServerManager() {
    const list = document.getElementById("serverManagerList");
    list.innerHTML = "";
    getAllServersOrdered().forEach((server, idx) => {
        const isHidden = hiddenServers.includes(server);
        list.innerHTML += `<div class="bg-gray-855 p-3 rounded-lg border border-gray-800 flex items-center justify-between gap-3"><div class="flex items-center gap-2"><div class="flex flex-col"><button onclick="moveServerOrder('${server}', -1)">▲</button><button onclick="moveServerOrder('${server}', 1)">▼</button></div><span class="font-bold">${server}</span></div><div class="flex items-center gap-2"><button onclick="editServerName('${server}')" class="text-xs text-orange-400">✏️</button><label class="text-xs"><input type="checkbox" onchange="toggleServerHide('${server}')" ${isHidden ? 'checked' : ''}> Skrýt</label><button onclick="confirmDeleteServer('${server}')" class="text-xs text-red-400">Smazat</button></div></div>`;
    });
    document.getElementById("serverManagerModal").classList.remove("hidden");
}

function closeServerManager() { document.getElementById("serverManagerModal").classList.add("hidden"); }
function toggleServerHide(serverName) { pushToHistory(); hiddenServers = hiddenServers.includes(serverName) ? hiddenServers.filter(s => s !== serverName) : [...hiddenServers, serverName]; save(); openServerManager(); }

function confirmDeleteServer(serverName) {
    if (confirm(translations[currentLang].confrimDeleteServer)) {
        pushToHistory();
        matches = matches.filter(m => m.server !== serverName);
        emptyServers = emptyServers.filter(s => s !== serverName);
        emptyLeagues = emptyLeagues.filter(l => l.server !== serverName);
        updateServerSelect(); save(); openServerManager();
    }
}

function updateServerSelect() {
    const select = document.getElementById("formServer"), active = getAllServersOrdered();
    select.innerHTML = "";
    active.forEach(s => select.appendChild(new Option(s, s)));
    select.appendChild(new Option(translations[currentLang].optNewServer, "__NEW__"));
    checkNewServer(select.value);
}

function buildFormatString() {
    const type = document.getElementById("fmtType").value, num = document.getElementById("fmtNumber").value.trim();
    const game = document.getElementById("fmtGame").value.trim() || "501", outType = document.getElementById("fmtOut").value;
    return `${type} ${num ? num + ' ' : ''}${game} ${outType}`.trim();
}

function isCurrentCalendarWeek(dStr) {
    if (!dStr) return false;
    const d = new Date(dStr), now = new Date();
    const startOfWeek = (dt) => { const day = dt.getDay(), diff = dt.getDate() - day + (day === 0 ? -6 : 1); return new Date(dt.setDate(diff)).setHours(0,0,0,0); };
    return startOfWeek(now) === startOfWeek(d);
}

function isWeekInPastOrCurrent(wStr) {
    if (!wStr) return false;
    const match = wStr.match(/(\d{1,2})\.(\d{1,2})\./);
    if (!match) return false;
    let year = new Date().getFullYear();
    const targetMonth = parseInt(match[2]) - 1;
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 && targetMonth === 0) {
        year += 1;
    }
    const ws = new Date(year, targetMonth, parseInt(match[1]));
    return new Date() >= ws;
}

function saveFromForm() {
    let server = document.getElementById("formServer").value;
    if (server === "__NEW__") {
        server = document.getElementById("formNewServerInput").value.trim();
        if (!server) return alert("Zadej název serveru");
    }
    const comp = document.getElementById("formComp").value.trim();
    if (!comp) return alert("Zadej název ligy");

    pushToHistory();
    const format = buildFormatString(), duration = parseInt(document.getElementById("formDuration").value) || calculateDurationMinutes(format);
    const maxWeekly = document.getElementById("formMaxWeekly").value.trim(), finalDeadline = document.getElementById("formFinalDeadline").value;
    const discordUrl = document.getElementById("formDiscordUrl").value.trim(), webUrl = document.getElementById("formWebUrl").value.trim();

    if (formMode === "single") {
        const opponent = document.getElementById("formOpponent").value.trim(), week = document.getElementById("formWeek").value.trim();
        if (!opponent) return alert("Zadej soupeře");
        matches.push({ id: Date.now(), server, comp, opponent, format, duration, type: week ? "fixed" : "flexi", week, date: "", time: "", confirmed: false, mustPlay: false, status: "unscheduled", notes: "", maxWeekly, finalDeadline, discordUrl, webUrl });
    } else {
        const names = document.getElementById("formOpponentsList").value.split("\n").map(n => n.trim()).filter(n => n);
        if (names.length === 0) return alert("Zadej aspoň jednoho soupeře");
        const incRematches = document.getElementById("formRematches").checked, bDate = document.getElementById("formBulkStartDate").value ? new Date(document.getElementById("formBulkStartDate").value) : null;
        
        names.forEach((name, idx) => {
            let w = bDate ? `(${new Date(bDate.getTime() + idx*7*86400000).getDate()}.${new Date(bDate.getTime() + idx*7*86400000).getMonth()+1}.)` : "";
            matches.push({ id: Date.now() + idx, server, comp, opponent: name, format, duration, type: "fixed", week: w, date: "", time: "", confirmed: false, mustPlay: false, status: "unscheduled", notes: "", maxWeekly, finalDeadline, discordUrl, webUrl });
        });
        if (incRematches) {
            names.forEach((name, idx) => {
                let w = bDate ? `(${new Date(bDate.getTime() + (names.length+idx)*7*86400000).getDate()}.${new Date(bDate.getTime() + (names.length+idx)*7*86400000).getMonth()+1}.)` : "";
                matches.push({ id: Date.now() + names.length + idx, server, comp, opponent: name, format, duration, type: "fixed", week: w, date: "", time: "", confirmed: false, mustPlay: false, status: "unscheduled", notes: "", maxWeekly, finalDeadline, discordUrl, webUrl });
            });
        }
    }
    updateServerSelect(); save(); toggleForm();
}

function deleteMatch(id) {
    if (confirm(translations[currentLang].confrimDeleteMatch)) {
        pushToHistory(); matches = matches.filter(m => m.id !== id); save();
    }
}

// RYCHLÉ SMAZÁNÍ ODEHRANÉHO ZÁPASU JEDNÍM KLIKNUTÍM (v Aktuálních zápasech)
function quickDeleteMatch(id) {
    pushToHistory();
    matches = matches.filter(m => m.id !== id);
    save();
}

function getFullGroupedData() {
    const grouped = {};
    getAllServersOrdered().forEach(s => { if (!hiddenServers.includes(s)) grouped[s] = {}; });
    matches.forEach(m => {
        if (hiddenServers.includes(m.server)) return;
        if (!grouped[m.server]) grouped[m.server] = {};
        if (!grouped[m.server][m.comp]) grouped[m.server][m.comp] = [];
        grouped[m.server][m.comp].push(m);
    });
    emptyLeagues.forEach(l => {
        if (!hiddenServers.includes(l.server)) {
            if (!grouped[l.server]) grouped[l.server] = {};
            if (!grouped[l.server][l.comp]) grouped[l.server][l.comp] = [];
        }
    });
    return grouped;
}

function renderSidebar(grouped) {
    const nav = document.getElementById("sidebarNav"); nav.innerHTML = "";
    Object.keys(grouped).forEach(serverName => {
        const sDiv = document.createElement("div"); sDiv.className = "space-y-1";
        sDiv.innerHTML = `<div onclick="scrollToElement('${serverName.replace(/\s+/g, '-')}')" class="text-sm font-bold text-orange-400 cursor-pointer truncate">🖥️ ${serverName}</div>`;
        const ul = document.createElement("ul"); ul.className = "pl-3 border-l border-gray-800 space-y-1 mt-0.5";
        Object.keys(grouped[serverName]).forEach(compName => {
            const compMatches = grouped[serverName][compName];
            let hasMustPlay = compMatches.some(m => m.mustPlay);
            let hasWarning = compMatches.some(m => !m.date && m.week && isWeekInPastOrCurrent(m.week));
            let statusIcon = "";
            if (hasMustPlay) statusIcon = " <span class='text-xs'>🔥</span>";
            else if (hasWarning) statusIcon = " <span class='text-xs'>⚠️</span>";

            const li = document.createElement("li"); li.className = "text-xs text-gray-400 hover:text-white cursor-pointer truncate flex items-center justify-between";
            li.innerHTML = `<span class="truncate">🏆 ${compName}</span><span>${statusIcon}</span>`;
            li.onclick = (e) => { e.stopPropagation(); scrollToElement(`${serverName.replace(/\s+/g, '-')}-${compName.replace(/\s+/g, '-')}`); };
            ul.appendChild(li);
        });
        sDiv.appendChild(ul); nav.appendChild(sDiv);
    });
}

function render() {
    const container = document.getElementById("mainContentContainer"); container.innerHTML = "";
    const grouped = getFullGroupedData();
    renderSidebar(grouped);
    updateServerSelect();

    const fS = document.getElementById("filterServer"), fC = document.getElementById("filterComp");
    const curS = fS.value, curC = fC.value;
    fS.innerHTML = `<option value="all">Všechny servery</option>`;
    fC.innerHTML = `<option value="all">Všechny ligy</option>`;
    Object.keys(grouped).forEach(s => fS.innerHTML += `<option value="${s}">${s}</option>`);
    fS.value = curS;

    if (fS.value !== "all" && grouped[fS.value]) {
        Object.keys(grouped[fS.value]).forEach(c => fC.innerHTML += `<option value="${c}">${c}</option>`);
    } else {
        [...new Set(matches.map(m => m.comp))].forEach(c => fC.innerHTML += `<option value="${c}">${c}</option>`);
    }
    fC.value = curC;

    if (currentView === "timeline") {
        let timelineMatches = matches.filter(m => (m.date || m.mustPlay) && !hiddenServers.includes(m.server));
        if (fS.value !== "all") timelineMatches = timelineMatches.filter(m => m.server === fS.value);
        if (fC.value !== "all") timelineMatches = timelineMatches.filter(m => m.comp === fC.value);

        timelineMatches.sort((a, b) => `${a.date}T${a.time || "00:00"}`.localeCompare(`${b.date}T${b.time || "00:00"}`));

        if (timelineMatches.length === 0) {
            container.innerHTML = `<div class="text-center py-12 text-gray-500 bg-gray-900 rounded-xl border border-gray-800">${translations[currentLang].emptyMatchesLabel}</div>`;
            return;
        }

        timelineMatches.forEach(m => {
            const card = document.createElement("div"), isEditing = editingMatchIds.has(m.id);
            card.className = "bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4";
            
            let formattedDate = m.date;
            if (m.date && m.date.includes("-")) {
                const parts = m.date.split("-");
                formattedDate = `${parseInt(parts[2])}.${parseInt(parts[1])}.`;
            }

            let nameColorClass = "text-white";
            if (m.date) {
                if (isCurrentCalendarWeek(m.date)) nameColorClass = "text-yellow-400";
                else if (m.confirmed) nameColorClass = "text-emerald-400";
                else nameColorClass = "text-red-400";
            }

            if (isEditing) {
                card.className = "bg-gray-900 p-4 rounded-xl border border-orange-500/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg";
                card.innerHTML = `
                    <div class="flex items-center gap-4 flex-1 w-full">
                        <div class="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 text-center shrink-0 min-w-[85px]">
                            <p class="text-[10px] text-gray-400 uppercase font-bold">${translations[currentLang].badgeEditTitle}</p>
                            <button onclick="toggleEditMatch(${m.id})" class="text-xs text-orange-400 hover:underline font-semibold mt-1">${translations[currentLang].tooltipClose}</button>
                        </div>
                        <div class="flex-1 space-y-2">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-lg font-bold text-orange-400">${m.opponent}</span>
                                <span class="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">${m.format}</span>
                                <input type="text" id="edit-week-${m.id}" value="${m.week || ''}" placeholder="${translations[currentLang].placeholderWeek}" class="bg-blue-950/60 text-blue-400 text-xs px-2 py-1 rounded border border-blue-900/50 font-semibold focus:outline-none focus:border-orange-500 w-28 text-center">
                            </div>
                            <input type="text" id="edit-notes-${m.id}" value="${m.notes || ''}" placeholder="Poznámka..." class="w-full max-w-md bg-gray-950 border border-gray-700 text-xs px-2.5 py-1.5 rounded text-gray-200 focus:outline-none focus:border-orange-500">
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-none border-gray-800 flex-wrap">
                        <button onclick="toggleMustPlay(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition ${m.mustPlay ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-red-400 border border-gray-700'}" title="Nachholspiel">🔥</button>
                        <input type="date" id="edit-date-${m.id}" value="${m.date}" class="bg-gray-800 border border-gray-700 p-2 rounded text-sm text-gray-200 focus:outline-none focus:border-orange-500 w-36 text-center">
                        <input type="time" id="edit-time-${m.id}" value="${m.time}" class="bg-gray-800 border border-gray-700 p-2 rounded text-sm text-gray-200 focus:outline-none focus:border-orange-500">
                        <button onclick="clearMatchDateInEdit(${m.id})" class="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-900/40 p-2 rounded-lg text-xs font-bold transition" title="Vymazat termín">❌</button>
                        <button onclick="toggleConfirmed(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition border ${m.confirmed ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300'}" title="${translations[currentLang].lblConfirmedCheck}">👍</button>
                        <button onclick="saveMatchEdit(${m.id})" class="bg-emerald-600 hover:bg-emerald-500 text-white p-2 px-3 rounded-lg text-sm font-bold transition" title="${translations[currentLang].tooltipSave}">✔️</button>
                        <button onclick="deleteMatch(${m.id})" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 px-2.5 rounded-lg text-sm font-semibold transition border border-red-900/40" title="${translations[currentLang].tooltipDelete}">🗑️</button>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="flex items-center gap-4 flex-1">
                        <div onclick="toggleEditMatch(${m.id})" class="bg-gray-800 hover:bg-gray-750 cursor-pointer px-3 py-2 rounded-lg border border-gray-700 text-center shrink-0 min-w-[85px] transition group" title="Kliknutím upravit">
                            <p class="text-[10px] text-gray-400 uppercase font-bold group-hover:text-orange-400 transition">${translations[currentLang].termLabel}</p>
                            <p class="text-sm font-black ${m.date ? 'text-white' : 'text-gray-400'}">${formattedDate || translations[currentLang].noTermLabel}</p>
                            <p class="text-xs text-orange-400 font-semibold">${m.time || '--:--'}</p>
                        </div>
                        <div class="truncate flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-lg font-bold ${nameColorClass}">${m.opponent}</span>
                                <span class="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">${m.format}</span>
                                ${m.mustPlay ? `<span class="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 flex items-center gap-1 animate-pulse">${translations[currentLang].mustPlayLabel}</span>` : ''}
                                ${m.week ? `<span class="text-xs text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30 font-semibold">${m.week}</span>` : ''}
                            </div>
                            <p class="text-xs text-gray-500 mt-1 truncate">🖥️ ${m.server} • 🏆 ${m.comp}</p>
                            ${m.notes ? `<p class="text-xs text-gray-400 mt-1 italic">📝 ${m.notes}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-none border-gray-800">
                        <button onclick="toggleMustPlay(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition ${m.mustPlay ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-red-400'}" title="Nachholspiel">🔥</button>
                        ${m.date ? `<button onclick="openGoogleCalendar(${m.id})" class="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1" title="${translations[currentLang].tooltipGCal}">📅</button>` : ''}
                        ${m.date ? `<button onclick="toggleConfirmed(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition border ${m.confirmed ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' : 'bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-300'}" title="${translations[currentLang].lblConfirmedCheck}">👍</button>` : ''}
                        <button onclick="quickDeleteMatch(${m.id})" class="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 p-2 rounded-lg text-xs font-semibold transition" title="Rychle uzavřít / smazat odehraný zápas">✅</button>
                        <button onclick="toggleEditMatch(${m.id})" class="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 p-2 rounded-lg text-xs font-semibold transition" title="${translations[currentLang].tooltipEdit}">✏️</button>
                    </div>
                `;
            }
            container.appendChild(card);

            if (isEditing) {
                const editDateEl = document.getElementById(`edit-date-${m.id}`);
                if (editDateEl) {
                    setupDateInput(editDateEl);
                    editDateEl.addEventListener('input', () => handleDatePlaceholder(editDateEl));
                }
            }
        });
        return;
    }

    // HLAVNÍ ZOBRAZENÍ DOMŮ S BAREVNÝMI TEČKAMI U LIG (Červená = bez termínu, Žlutá = domluvené/s termínem)
    Object.keys(grouped).forEach(serverName => {
        const sEl = document.createElement("div"); sEl.id = serverName.replace(/\s+/g, '-'); sEl.className = "bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4 shadow-lg";
        sEl.innerHTML = `<h2 class="text-xl font-bold text-orange-500 flex justify-between items-center"><span>🖥️ ${serverName}</span><div class="flex gap-2"><button onclick="editServerName('${serverName}')" class="text-xs text-gray-400 hover:text-orange-400">✏️</button><button onclick="openLeagueDeleteModal('${serverName}')" class="text-xs text-red-400">🗑️</button></div></h2>`;

        Object.keys(grouped[serverName]).forEach(compName => {
            const compMatches = grouped[serverName][compName];
            const collapseKey = `${serverName}__${compName}`;
            const isClosed = closedStates[collapseKey] || false;

            // Spočítáme zbývající (bez termínu) a domluvené (s termínem)
            let unscheduledCount = compMatches.filter(m => !m.date).length;
            let scheduledCount = compMatches.filter(m => m.date).length;

            let badgesHTML = `<div class="flex items-center gap-1.5 text-xs">`;
            if (unscheduledCount > 0) {
                badgesHTML += `<span class="bg-red-950/80 text-red-400 border border-red-900/60 px-2 py-0.5 rounded-full font-bold" title="Zbývá zápasů bez termínu">${unscheduledCount}</span>`;
            }
            if (scheduledCount > 0) {
                badgesHTML += `<span class="bg-yellow-950/80 text-yellow-400 border border-yellow-900/60 px-2 py-0.5 rounded-full font-bold" title="Domluvené zápasy">${scheduledCount}</span>`;
            }
            badgesHTML += `<span class="bg-gray-900 px-2 py-0.5 rounded text-gray-400 ml-1">${compMatches.length}</span></div>`;

            const lEl = document.createElement("div"); lEl.id = `${sEl.id}-${compName.replace(/\s+/g, '-')}`; lEl.className = "bg-gray-850 p-3 rounded-lg border border-gray-800 space-y-2";
            lEl.innerHTML = `
                <div class="flex justify-between items-center cursor-pointer select-none" onclick="toggleCollapse('${collapseKey}')">
                    <h3 class="font-semibold text-gray-200 flex items-center gap-2">
                        <span class="text-xs text-orange-400">${isClosed ? '▶' : '▼'}</span>
                        🏆 ${compName} 
                    </h3>
                    <div class="flex items-center gap-3">
                        ${badgesHTML}
                        <div class="flex gap-2" onclick="event.stopPropagation()">
                            <button onclick="editCompName('${serverName}', '${compName}')" class="text-xs text-gray-400 hover:text-orange-400">✏️</button>
                            <button onclick="toggleForm('${serverName}', '${compName}')" class="text-xs bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 px-2.5 py-1 rounded border border-orange-500/30">${translations[currentLang].btnAddMatchToLeague}</button>
                        </div>
                    </div>
                </div>
            `;

            if (!isClosed) {
                const matchesContainer = document.createElement("div");
                matchesContainer.className = "space-y-2 mt-2";
                compMatches.forEach(m => {
                    const mDiv = document.createElement("div");
                    mDiv.className = "bg-gray-900 p-3 rounded border border-gray-800 flex justify-between items-center";
                    let formattedMatchDate = m.date ? `${parseInt(m.date.split('-')[2])}.${parseInt(m.date.split('-')[1])}.` : translations[currentLang].noTermLabel;
                    
                    let statusIconHTML = "";
                    if (m.mustPlay) {
                        statusIconHTML = `<span class="text-xs text-red-400 font-bold mr-2" title="Dohrávka">🔥</span>`;
                    } else if (!m.date && m.week && isWeekInPastOrCurrent(m.week)) {
                        statusIconHTML = `<span class="text-xs text-yellow-500 font-bold mr-2" title="Nutno naplánovat">⚠️</span>`;
                    }

                    mDiv.innerHTML = `
                        <div class="flex items-center">
                            ${statusIconHTML}
                            <span class="font-bold text-white">${m.opponent}</span>
                            <span class="text-xs text-gray-400 ml-2 bg-gray-800 px-2 py-0.5 rounded">${m.format}</span>
                            ${m.week ? `<span class="text-xs text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30 font-semibold ml-2">${m.week}</span>` : ''}
                        </div>
                        <div class="flex gap-3 items-center">
                            <span class="text-xs font-semibold ${m.date ? 'text-white' : 'text-gray-500'}">${formattedMatchDate} ${m.time || ''}</span>
                            <button onclick="toggleEditMatch(${m.id})" class="text-xs bg-orange-600/10 text-orange-400 px-2 py-1 rounded border border-orange-500/30">✏️</button>
                        </div>
                    `;
                    matchesContainer.appendChild(mDiv);
                });
                lEl.appendChild(matchesContainer);
            }
            sEl.appendChild(lEl);
        });
        container.appendChild(sEl);
    });
}

translateUI(); render();
