const supabaseUrl = "<YOUR SUPABASE URL>";
const supabaseKey = "<YOUR SUPABASE KEY>"; 

async function fetchData() {
    const { data, error } = await supabase.from('guestbook').select('*');
    
    if (error) alert(error);
    else refreshTable(data.reverse());

    const queriedTime = document.getElementById('queriedTime');
    queriedTime.innerHTML = getTime();
}

async function insertData() {
    const nameInput = document.getElementById('nameInput');
    const contentInput = document.getElementById('contentInput');
    const commentBtn = document.getElementById('commentBtn');

    var name = nameInput.value;

    nameInput.disabled = true;
    contentInput.disabled = true;
    commentBtn.disabled = true;

    if (nameInput.value == '') name = 'anonymous';
    if (contentInput.value == '') {
        alert("You must write content.");
        return;
    }
    
    const { data, error } = await supabase.from('guestbook').insert([{ name: name + "-" + getUnixTime(), content: contentInput.value }]);

    nameInput.value = '';
    contentInput.value = '';
    
    if (error) alert(error);
    else fetchData();

    setTimeout(() => {
        nameInput.disabled = false;
        contentInput.disabled = false;
        commentBtn.disabled = false;
    }, 3000);
}

function refreshTable(commentDataJSON) {
    const tableBody = document.getElementById('commentTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    
    commentDataJSON.forEach(item => {
        const commentRow = tableBody.insertRow();
        const nameCell = commentRow.insertCell(0);
        const contentCell = commentRow.insertCell(1);

        nameCell.textContent = item.name;
        contentCell.innerHTML = item.content.replace(/\n/g, "<br>");
    });
}

function getUnixTime() {
    const currentTime = Date.now();
    const targetTime = new Date('2025-01-01T00:00:00').getTime();
    return `${Math.floor((currentTime - targetTime) / 1000)}`;
}

function getTime() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

