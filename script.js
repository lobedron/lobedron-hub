const el = id => document.getElementById(id);
let searchMatches = [], currentMatchIdx = 0, lastSearchTerm = "";

function hInput() {
    const code = el('edit').value, ext = el('fExt').value, term = el('findInp').value;
    el('lnBox').innerHTML = Array.from({length: code.split('\n').length}, (_, i) => i + 1).join('<br>');
    
    // Синтаксис и поиск
    let highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (term) {
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark style="background:var(--accent); color:#000;">$1</mark>');
    }
    el('syntaxHighlight').innerHTML = highlighted + '<br>';
    
    // Поиск совпадений для счетчика
    if (term) {
        const matches = [...code.matchAll(new RegExp(term, 'gi'))];
        searchMatches = matches.map(m => m.index);
        el('matchInfo').innerText = searchMatches.length > 0 ? `${currentMatchIdx + 1}/${searchMatches.length}` : '0/0';
    } else {
        searchMatches = [];
        el('matchInfo').innerText = '0/0';
    }

    const f = el('ifr').contentWindow.document;
    f.open();
    f.write(ext === '.html' ? code : ext === '.css' ? `<style>${code}</style>` : `<script>${code}<\/script>`);
    f.close();
    syncScroll();
}

function handleKeys(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const a = e.target, s = a.selectionStart;
        a.value = a.value.substring(0, s) + "    " + a.value.substring(a.selectionEnd);
        a.selectionStart = a.selectionEnd = s + 4;
        hInput();
    }
}

function syncScroll() {
    el('syntaxHighlight').scrollTop = el('edit').scrollTop;
    el('lnBox').scrollTop = el('edit').scrollTop;
}

function navSearch(dir) {
    if (searchMatches.length === 0) return;
    currentMatchIdx = (currentMatchIdx + dir + searchMatches.length) % searchMatches.length;
    el('matchInfo').innerText = `${currentMatchIdx + 1}/${searchMatches.length}`;
}

function setM(m) {
    const w = el('wrap');
    w.className = 'editor-wrap v-' + m;
    document.querySelectorAll('.m-btn').forEach(b => b.classList.remove('active'));
    el(m === 'code' ? 'b1' : m === 'view' ? 'b2' : 'b3').classList.add('active');
}

function exp() {