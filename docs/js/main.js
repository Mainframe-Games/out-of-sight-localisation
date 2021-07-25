const CLIENT_ID = '8208b90a617463778ae7';

var locales = []
var tableData = []

$.ajax({
    method: 'GET',
    url: 'https://raw.githubusercontent.com/Mainframe-Games/out-of-sight-localisation/main/data.json',
    success: function (res) {
        let data = JSON.parse(res);
        console.log(data);

        // debug values
        data.locales['fr'] = "French";
        data.locales['sp'] = "Spanish";

        locales = data.locales
        tableData = data.data;

        buildHeaders(locales);
        buildTable(tableData);
    }
})

// search
$('#search-input').on('keyup', function () {
    let val = $(this).val();
    console.log(val);
    var data = searchTable(val, tableData);
    buildTable(data);
});

/*
    Sets headers
*/
function buildHeaders(locales) {
    let headers = document.getElementById('headers');
    for (let l in locales) {
        headers.innerHTML += `<th>${locales[l]}(${l})</th>`;
    }
}

/*
    Builds the table
*/
function buildTable(data) {
    // sort data to alphabetical 
    data = data.sort((a, b) => a.id > b.id ? 1 : -1);

    console.log("Build table", data);

    let table = document.getElementById('myTable');
    table.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i])

        let id = data[i].id;
        let row = `<tr><td>${id}</td>`;

        for (let l in locales) {

            let val = data[i][l];

            if (val == null)
                val = '';

            // add edit button to non-english values
            if (l === 'en') {
                row += `<td>${val}</td>`
            } else {
                row += `<td>${val} <button class="btn btn-sm btn-primary btn-edit" data-id=${id} data-locale=${l}>Edit</button></td>`
            }
        }

        row += '</tr>';

        table.innerHTML += row;
    }

    $('.btn-edit').click(function () {
        showModal($(this).data('id'), $(this).data('locale'))
    });
}

/*
    Filters table

    val = input value from search input
    data = the entire table
*/
function searchTable(val, data) {
    val = val.toLowerCase();
    let filteredData = [];
    for (let i = 0; i < data.length; i++) {
        let id = data[i].id.toLowerCase();
        if (id.includes(val)) {
            filteredData.push(data[i]);
        }
    }
    return filteredData;
}

/*
    data: entire row data
*/
function showModal(dataId, locale) {
    // get data from id
    let data = getDataFromId(dataId);
    console.log("Show modal with data:", locale, data);

    // set current value to empty string if null
    let curValue = data[locale];
    if (curValue == null)
        curValue = '';

    // text default text
    document.getElementById('dataId').innerHTML = `<center><b>${data.id}</b></center>`;
    document.getElementById('defaultText').innerHTML = `<center>${data.en}</center>`;
    document.getElementById('editingLocale').innerHTML = `<center>Editing Locale: ${locale}</center>`;
    document.getElementById('edit-input').value = curValue;
    document.getElementById('edit-input').setAttribute('data-id', dataId);
    document.getElementById('edit-input').setAttribute('data-locale', locale);

    // show modal
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function postEntry() {

    closeModal();

    let id = document.getElementById('edit-input').getAttribute('data-id');
    let locale = document.getElementById('edit-input').getAttribute('data-locale');
    let newValue = document.getElementById('edit-input').value;

    let d = getDataFromId(id)
    console.log(d);

    // if same value just ignore
    if (newValue === '') {
        alert("No value was set");
        return false;
    }

    // if same value just ignore
    if (locale in d && d[locale] == newValue) {
        alert("Value hasn't changed");
        return false;
    }

    console.log("Update value:", id, locale, newValue)

    // POST request to github
    setNewData(id, locale, newValue);
    buildTable(tableData);
}

function getDataFromId(id) {
    for (let i in tableData) {
        if (tableData[i].id == id)
            return tableData[i];
    }
    return null;
}

function setNewData(id, locale, value) {
    for (let i in tableData) {
        if (tableData[i].id == id)
            tableData[i][locale] = value;
    }
    console.log("Changed table:", tableData);
}


/* -------------- */

function showProfile(data) {
    const profile_data = JSON.stringify(data);
    document.getElementById('github-profile').innerHTML = profile_data;
}

function getProfile(data) {
    console.log("get profile")
    const access_token = data;
    localStorage.setItem('access_token', access_token);

    fetch(`https://api.github.com/user?access_token=${access_token}`)
        .then(data => data.json())
        .then(data => showProfile(data))
        .catch(err => console.error(err));
}

function getAccessToken() {
    if (access_token = localStorage.getItem('access_token'))
        getProfile(access_token);

    let code = window.location.search;
    code = code.replace("?code=", '');
    console.log('Got the code', code);
    fetch(`https://out-of-sight-localisation.herokuapp.com/${CLIENT_ID}/${code}`)
        .then(data => data.json())
        .then(data => getProfile(data.access_token))
        .catch(err => console.error(err));
}

function doWeHaveAccessToken() {
    let authed = access_token = localStorage.getItem('access_token');
    console.log("authed:", authed);

    document.getElementById('github-button').hidden = authed;
    document.getElementById('content').hidden = !authed;

    if (authed) {
        getProfile(access_token);
    }else{
        console.log('not authed');
        getAccessToken();
    }
}
document.getElementById('github-button').addEventListener('click', getAccessToken)
document.addEventListener('DOMContentLoaded', doWeHaveAccessToken);