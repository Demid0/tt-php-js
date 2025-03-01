let isEvenSubmitted = false;

const input = document.getElementById('text-input');
const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    check(input.innerText, true).then(row => {
        let html = document.getElementById('history-template').innerHTML;
        html += `<tr><td>${row.lang}</td><td>${row.datetime}</td><td>${row.checkedtext.substring(0, 50)}${row.checkedtext.length > 50 ? '...' : ''}</td></tr>`;
        document.getElementById('history-template').innerHTML = html;
    });

    if (!isEvenSubmitted) {
        input.addEventListener('input',
            debounce((ev) => {
                check(ev.target.innerText, false).then();
            }, 2000)
        );

        isEvenSubmitted = true;
    }

});

function debounce(f, ms) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => f.apply(this, arguments), ms);
    };
}

function check(text, saveInHistory) {
    input.blur();
    return fetch('/api/checkAndSave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            save: saveInHistory
        })
    }).then(r => {
        if (!r.ok) throw new Error(`Ошибка обработки запроса: ${r.status}`);
        return r.json();
    }).then(data => {
        input.innerHTML = colorText(text, data.lang, data.engIndexes, data.noAlphaIndexes);
        return data;
    }).catch(e => {
        console.log(e);
    })
}

function colorText(text, lang, engIndexes, noAlphaIndexes) {
    let txt = '', detect;

    if (lang === 'en') detect = (i) => engIndexes.includes(i);
    else detect = (i) => !engIndexes.includes(i);

    for (let i = 0; i < text.length; i++) {
        if (detect(i) || noAlphaIndexes.includes(i)) txt += text[i];
        else txt += `<b>${text[i]}</b>`;
    }

    return txt;
}


document.addEventListener('DOMContentLoaded', () =>  {
    fetch('/api/getHistory', {
        method: 'GET'
    }).then(r => {
        if (!r.ok) throw new Error(`Ошибка обработки запроса: ${r.status}`);
        return r.json();
    }).then(data => {
        let html = '';
        data.forEach(row => {
            html += `<tr><td>${row.lang}</td><td>${row.datetime}</td><td>${row.checkedtext.substring(0, 50)}${row.checkedtext.length > 50 ? '...' : ''}</td></tr>`;
        });
        document.getElementById('history-template').innerHTML = html;
    }).catch(e => {
        console.log(e);
    });
});