let currentLang = localStorage.getItem("dartLang") || "cs";
let editingMatchIds = new Set();
let currentView = "home";
let formMode = "single";
let activeDeleteServerName = "";

function toggleLanguage() { setLanguage(currentLang === "cs" ? "de" : "cs"); }

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("dartLang", lang);
    const sw = document.getElementById("langSwitcher");
    if(sw) sw.innerText = lang === "cs" ? "🇩🇪" : "🇨🇿";
    translateUI();
    render();
}

function handleDatePlaceholder(input) {
    if (!input) return;
    if (input.value) {
        input.classList.remove("empty-date");
        input.style.setProperty("--date-opacity", "1");
    } else {
        input.classList.add("empty-date");
        input.style.setProperty("--date-opacity", "0");
    }
}

function setupDateInput(input) {
    if (!input || !translations[currentLang]) return;
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
    const fc = document.getElementById("formComp");
    if(fc) fc.placeholder = currentLang === "cs" ? "Liga / Cup (např. Cup 6c, Liga Division E)" : "Liga / Cup (z.B. Cup 6c, Liga Division E)";
    const fw = document.getElementById("formWeek");
    if(fw) fw.placeholder = translations[currentLang].placeholderWeek;
    const fo = document.getElementById("formOpponent");
    if(fo) fo.placeholder = currentLang === "cs" ? "Soupeř" : "Gegner";

    const ffd = document.getElementById("formFinalDeadline");
    if (ffd) setupDateInput(ffd);
    const fbs = document.getElementById("formBulkStartDate");
    if (fbs) setupDateInput(fbs);

    const setElTitle = (id, val) => { const el = document.getElementById(id); if(el) el.title = val; };
    setElTitle("btnHomeIcon", translations[currentLang].homeBtn);
    setElTitle("btnTimelineIcon", translations[currentLang].timelineBtn);
    setElTitle("undoBtn", translations[currentLang].undoBtn);
    setElTitle("btnAddIcon", translations[currentLang].addMatchBtn);
    setElTitle("btnManageIcon", translations[currentLang].manageServersBtn);
}

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

// Nová funkce pro nezávislý ruční přepínač neodehraného termínu
function toggleMissedTerm(id) {
    pushToHistory();
    const match = matches.find(m => m.id === id);
    if (match) {
        match.missedTerm = !match.missedTerm;
        save();
    }
}

function deleteMatch(id) {
    if (confirm("Opravdu smazat tento zápas?")) {
        pushToHistory();
        matches = matches.filter(m => m.id !== id);
        editingMatchIds.delete(id);
        save();
    }
}

function quickDeleteMatch(id) {
    if (confirm("Zapsat jako odehrané a smazat ze seznamu?")) {
        pushToHistory();
        matches = matches.filter(m => m.id !== id);
        editingMatchIds.delete(id);
        save();
    }
}

function toggleEditMatch(id) {
    if (editingMatchIds.has(id)) { editingMatchIds.delete(id); } else { editingMatchIds.add(id); }
    render();
}

function editMatchFromHome(id) {
    if (!editingMatchIds.has(id)) { editingMatchIds.add(id); }
    setView("timeline");
    setTimeout(() => {
        const el = document.getElementById(`match-card-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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
    } else { startIso = cleanDate; endIso = cleanDate; }

    const title = encodeURIComponent(`🎯 [${match.server}] ${match.comp} - ${match.format} - ${match.opponent}`);
    let detailsText = `Soupeř: ${match.opponent}\nFormát: ${match.format}\nServer: ${match.server}\nLiga: ${match.comp}\nDélka: ${duration} min`;
    if (match.week) detailsText += `\nKolo: ${match.week}`;
    if (match.notes) detailsText += `\nPoznámka: ${match.notes}`;
    if (match.webUrl) detailsText += `\nWeb: ${match.webUrl}`;
    if (match.discordUrl) detailsText += `\nDiscord: ${match.discordUrl}`;
    const details = encodeURIComponent(detailsText);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`, '_blank');
}

function toggleForm(presetServer = null, presetComp = null) {
    const form = document.getElementById("matchForm");
    if (!form) return;
    
    if (presetServer) {
        form.classList.remove("hidden");
        const s = document.getElementById("formServer");
        if(s) { s.value = presetServer; checkNewServer(presetServer); }
        const c = document.getElementById("formComp");
        if(c && presetComp) c.value = presetComp;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        form.classList.toggle("hidden");
        if (!form.classList.contains("hidden")) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function setFormMode(mode) {
    formMode = mode;
    const ms = document.getElementById("mode-single");
    const mb = document.getElementById("mode-bulk");
    if(ms) ms.className = mode === "single" ? "px-3 py-1 rounded bg-orange-600 font-semibold text-white text-sm" : "px-3 py-1 rounded text-gray-400 font-semibold text-sm";
    if(mb) mb.className = mode === "bulk" ? "px-3 py-1 rounded bg-orange-600 font-semibold text-white text-sm" : "px-3 py-1 rounded text-gray-400 font-semibold text-sm";
    
    const soc = document.getElementById("singleOpponentContainer");
    const swc = document.getElementById("singleWeekContainer");
    const bc = document.getElementById("bulkContainer");
    if(soc) soc.classList.toggle("hidden", mode !== "single");
    if(swc) swc.classList.toggle("hidden", mode !== "single");
    if(bc) bc.classList.toggle("hidden", mode !== "bulk");
    
    const ft = document.getElementById("formTitle");
    if(ft && translations[currentLang]) ft.innerText = mode === "single" ? translations[currentLang].formTitleAdd : translations[currentLang].formModeBulk;
}

function checkNewServer(val) { 
    const el = document.getElementById("formNewServerInput");
    if(el) el.classList.toggle("hidden", val !== "__NEW__"); 
}

function toggleCollapse(key) { closedStates[key] = !closedStates[key]; save(); }

function setView(view) { 
    currentView = view; 
    const fc = document.getElementById("filterContainer");
    if(fc) fc.classList.toggle("hidden", view !== "timeline"); 
    const pt = document.getElementById("pageTitle");
    if(pt && translations[currentLang]) pt.innerText = view === "home" ? translations[currentLang].mainTitle : translations[currentLang].timelineTitle; 
    render(); 
}

function goHome() { setView("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToElement(id) { setView("home"); setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }

function editServerName(oldName) {
    const newName = prompt("Nový název:", oldName);
    if (newName && newName.trim() !== oldName) { pushToHistory(); matches.forEach(m => { if (m.server === oldName) m.server = newName.trim(); }); save(); updateServerSelect(); render(); }
}

function editCompName(serverName, oldCompName) {
    const newName = prompt("Nový název ligy:", oldCompName);
    if (newName && newName.trim() !== oldCompName) { pushToHistory(); matches.forEach(m => { if (m.server === serverName && m.comp === oldCompName) m.comp = newName.trim(); }); save(); render(); }
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
    const desc = document.getElementById("leagueDeleteServerDesc");
    if(desc) desc.innerText = serverName; 
    const modal = document.getElementById("leagueDeleteModal");
    if(modal) modal.classList.remove("hidden"); 
}

function closeLeagueDeleteModal() { 
    const modal = document.getElementById("leagueDeleteModal");
    if(modal) modal.classList.add("hidden"); 
}

function confirmLeagueDeletes() { 
    pushToHistory(); 
    matches = matches.filter(m => m.server !== activeDeleteServerName); 
    save(); 
    closeLeagueDeleteModal(); 
    render(); 
}

function openServerManager() { if(typeof openServerManagerModal === 'function') openServerManagerModal(); }

function updateServerSelect() { 
    const select = document.getElementById("formServer"); 
    if(select && translations[currentLang]) { 
        const active = getAllServersOrdered(); 
        select.innerHTML = ""; 
        active.forEach(s => select.appendChild(new Option(s, s))); 
        select.appendChild(new Option(translations[currentLang].optNewServer, "__NEW__")); 
        checkNewServer(select.value); 
    } 
}

function getFullGroupedData() {
    const grouped = {};
    const allServers = getAllServersOrdered();
    
    allServers.forEach(serverName => {
        if (hiddenServers.includes(serverName)) return;
        grouped[serverName] = {};
    });

    matches.forEach(m => {
        if (hiddenServers.includes(m.server)) return;
        if (!grouped[m.server]) grouped[m.server] = {};
        if (!grouped[m.server][m.comp]) grouped[m.server][m.comp] = [];
        grouped[m.server][m.comp].push(m);
    });

    emptyLeagues.forEach(l => {
        if (hiddenServers.includes(l.server)) return;
        if (!grouped[l.server]) grouped[l.server] = {};
        if (!grouped[l.server][l.comp]) grouped[l.server][l.comp] = [];
    });

    return grouped;
}

function isCurrentCalendarWeek(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(d - now);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
}

function isWeekInPastOrCurrent(wStr) {
    if (!wStr) return false;
    const match = wStr.match(/(\d{1,2})\.(\d{1,2})\./);
    if (!match) return false;
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const now = new Date();
    let year = now.getFullYear();
    if (now.getMonth() >= 6 && month <= 2) { year += 1; }
    let matchDate = new Date(year, month - 1, day);
    return now > matchDate;
}

function renderSidebar(grouped) {
    const nav = document.getElementById("sidebarNav"); if(!nav) return; nav.innerHTML = "";
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
            const scheduledCount = compMatches.filter(m => m.date).length;
            const totalCount = compMatches.length;
            const li = document.createElement("li"); li.className = "text-xs text-gray-400 hover:text-white cursor-pointer truncate flex items-center justify-between";
            li.innerHTML = `<span class="truncate flex items-center gap-1">🏆 ${compName} ${statusIcon}</span><span class="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded shrink-0">${scheduledCount}/${totalCount}</span>`;
            li.onclick = (e) => { e.stopPropagation(); scrollToElement(`${serverName.replace(/\s+/g, '-')}-${compName.replace(/\s+/g, '-')}`); };
            ul.appendChild(li);
        });
        sDiv.appendChild(ul); nav.appendChild(sDiv);
    });
}

function render() {
    const container = document.getElementById("mainContentContainer"); if(!container) return; container.innerHTML = "";
    const grouped = getFullGroupedData();
    renderSidebar(grouped);
    updateServerSelect();

    if (currentView === "timeline") {
        let timelineMatches = matches.filter(m => (m.date || m.mustPlay || editingMatchIds.has(m.id)) && !hiddenServers.includes(m.server));
        timelineMatches.sort((a, b) => `${a.date}T${a.time || "00:00"}`.localeCompare(`${b.date}T${b.time || "00:00"}`));
        if (timelineMatches.length === 0) {
            container.innerHTML = `<div class="text-center py-12 text-gray-500 bg-gray-900 rounded-xl border border-gray-800">${translations[currentLang].emptyMatchesLabel}</div>`;
            return;
        }
        timelineMatches.forEach(m => {
            const isEditing = editingMatchIds.has(m.id);
            const card = document.createElement("div"); card.id = `match-card-${m.id}`;
            card.className = "bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4";
            let formattedDate = m.date;
            if (m.date && m.date.includes("-")) { const parts = m.date.split("-"); formattedDate = `${parseInt(parts[2])}.${parseInt(parts[1])}.`; }
            let nameColorClass = m.date ? (isCurrentCalendarWeek(m.date) ? "text-yellow-400" : (m.confirmed ? "text-emerald-400" : "text-red-400")) : "text-white";
            
            // Podbarvení termínu se řídí čistě naším novým ručním přepínačem missedTerm
            let dateBoxStyle = m.missedTerm 
                ? "bg-red-950/80 border-red-600 text-red-400" 
                : "bg-gray-800 border-gray-700 text-white";

            if (isEditing) {
                card.className = "bg-gray-900 p-4 rounded-xl border border-orange-500/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg";
                card.innerHTML = `
                    <div class="flex items-center gap-4 flex-1 w-full">
                        <div class="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 text-center shrink-0 min-w-[85px]">
                            <p class="text-[10px] text-gray-400 uppercase font-bold">${translations[currentLang].badgeEditTitle}</p>
                            <button type="button" onclick="toggleEditMatch(${m.id})" class="text-xs text-orange-400 hover:underline font-semibold mt-1">${translations[currentLang].tooltipClose}</button>
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
                        <button type="button" onclick="toggleMustPlay(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition ${m.mustPlay ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-red-400 border border-gray-700'}" title="Nachholspiel">🔥</button>
                        <!-- Nové tlačítko pro označení neodehraného termínu -->
                        <button type="button" onclick="toggleMissedTerm(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition border ${m.missedTerm ? 'bg-red-600 text-white border-red-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-red-400'}" title="Označit jako neodehraný / propadlý termín">⚠️</button>
                        <input type="date" id="edit-date-${m.id}" value="${m.date}" class="bg-gray-800 border border-gray-700 p-2 rounded text-sm text-gray-200 focus:outline-none focus:border-orange-500 w-36 text-center">
                        <input type="time" id="edit-time-${m.id}" value="${m.time}" class="bg-gray-800 border border-gray-700 p-2 rounded text-sm text-gray-200 focus:outline-none focus:border-orange-500">
                        <button type="button" onclick="clearMatchDateInEdit(${m.id})" class="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-900/40 p-2 rounded-lg text-xs font-bold transition" title="Vymazat termín">❌</button>
                        <button type="button" onclick="toggleConfirmed(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition border ${m.confirmed ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300'}" title="${translations[currentLang].lblConfirmedCheck}">👍</button>
                        <button type="button" onclick="saveMatchEdit(${m.id})" class="bg-emerald-600 hover:bg-emerald-500 text-white p-2 px-3 rounded-lg text-sm font-bold transition" title="${translations[currentLang].tooltipSave}">✔️</button>
                        <button type="button" onclick="deleteMatch(${m.id})" class="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-900/40 p-2 px-2.5 rounded-lg text-sm font-semibold transition" title="${translations[currentLang].tooltipDelete}">🗑️</button>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="flex items-center gap-4 flex-1">
                        <div onclick="toggleEditMatch(${m.id})" class="${dateBoxStyle} cursor-pointer px-3 py-2 rounded-lg border text-center shrink-0 min-w-[85px] transition group" title="Kliknutím upravit">
                            <p class="text-[10px] uppercase font-bold opacity-80">${translations[currentLang].termLabel}</p>
                            <p class="text-sm font-black">${formattedDate || translations[currentLang].noTermLabel}</p>
                            <p class="text-xs font-semibold">${m.time || '--:--'}</p>
                        </div>
                        <div class="truncate flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-lg font-bold ${nameColorClass}">${m.opponent}</span>
                                <span class="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">${m.format}</span>
                                ${m.mustPlay ? `<span class="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 flex items-center gap-1">${translations[currentLang].mustPlayLabel}</span>` : ''}
                                ${!m.date && m.week && isWeekInPastOrCurrent(m.week) ? `<span class="text-xs font-bold text-yellow-500 bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800 flex items-center gap-1">⚠️</span>` : ''}
                                ${m.week ? `<span class="text-xs text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30 font-semibold">${m.week}</span>` : ''}
                            </div>
                            <p class="text-xs text-gray-500 mt-1 truncate">🖥️ ${m.server} • 🏆 ${m.comp}</p>
                            ${m.notes ? `<p class="text-xs text-gray-400 mt-1 italic">📝 ${m.notes}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-none border-gray-800">
                        <button type="button" onclick="toggleMustPlay(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition ${m.mustPlay ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-red-400'}" title="Nachholspiel">🔥</button>
                        ${m.date ? `<button type="button" onclick="openGoogleCalendar(${m.id})" class="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1" title="${translations[currentLang].tooltipGCal}">📅</button>` : ''}
                        ${m.date ? `<button type="button" onclick="toggleConfirmed(${m.id})" class="p-2 rounded-lg text-xs font-semibold transition border ${m.confirmed ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' : 'bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-300'}" title="${translations[currentLang].lblConfirmedCheck}">👍</button>` : ''}
                        <button type="button" onclick="quickDeleteMatch(${m.id})" class="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 p-2 rounded-lg text-xs font-semibold transition" title="Rychle uzavřít / smazat odehraný zápas">✅</button>
                        <button type="button" onclick="toggleEditMatch(${m.id})" class="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 p-2 rounded-lg text-xs font-semibold transition" title="${translations[currentLang].tooltipEdit}">✏️</button>
                    </div>
                `;
            }
            container.appendChild(card);
            if (isEditing) {
                const editDateEl = document.getElementById(`edit-date-${m.id}`);
                if (editDateEl) { setupDateInput(editDateEl); editDateEl.addEventListener('input', () => handleDatePlaceholder(editDateEl)); }
            }
        });
    } else {
        Object.keys(grouped).forEach(serverName => {
            const sEl = document.createElement("div"); sEl.id = serverName.replace(/\s+/g, '-'); sEl.className = "bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4 shadow-lg";
            sEl.innerHTML = `<h2 class="text-xl font-bold text-orange-500 flex justify-between items-center"><span>🖥️ ${serverName}</span><div class="flex gap-2"><button type="button" onclick="editServerName('${serverName}')" class="text-xs text-gray-400 hover:text-orange-400">✏️</button><button type="button" onclick="openLeagueDeleteModal('${serverName}')" class="text-xs text-red-400">🗑️</button></div></h2>`;

            Object.keys(grouped[serverName]).forEach(compName => {
                const compMatches = grouped[serverName][compName];
                const collapseKey = `${serverName}__${compName}`;
                const isClosed = closedStates[collapseKey] || false;

                const lEl = document.createElement("div"); lEl.id = `${sEl.id}-${compName.replace(/\s+/g, '-')}`; lEl.className = "bg-gray-850 p-3 rounded-lg border border-gray-800 space-y-2";
                lEl.innerHTML = `
                    <div class="flex justify-between items-center cursor-pointer select-none" onclick="toggleCollapse('${collapseKey}')">
                        <h3 class="font-semibold text-gray-200 flex items-center gap-2">
                            <span class="text-xs text-orange-400">${isClosed ? '▶' : '▼'}</span>
                            🏆 ${compName} <span class="text-xs bg-gray-900 px-2 py-0.5 rounded text-gray-400">${compMatches.length}</span>
                        </h3>
                        <div class="flex gap-2" onclick="event.stopPropagation()">
                            <button type="button" onclick="editCompName('${serverName}', '${compName}')" class="text-xs text-gray-400 hover:text-orange-400">✏️</button>
                            <button type="button" onclick="toggleForm('${serverName}', '${compName}')" class="text-xs bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 px-2.5 py-1 rounded border border-orange-500/30">${translations[currentLang].btnAddMatchToLeague}</button>
                        </div>
                    </div>
                `;

                let dotsHtml = `<div class="flex flex-wrap gap-1 px-1 py-1">`;
                compMatches.forEach(m => {
                    let dotColor = m.date ? "bg-yellow-500" : "bg-red-500";
                    dotsHtml += `<span class="inline-block w-2 h-2 rounded-full ${dotColor}" title="${m.opponent} (${m.date || 'bez termínu'})"></span>`;
                });
                dotsHtml += `</div>`;
                lEl.innerHTML += dotsHtml;

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
                                <button type="button" onclick="editMatchFromHome(${m.id})" class="text-xs bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30" title="Upravit zápas">✏️</button>
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
}
