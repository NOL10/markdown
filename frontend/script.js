
const API = "http://127.0.0.1:8000/documents";

const title = document.getElementById("title");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const list = document.getElementById("documents");

let id = null;


editor.oninput = function() {
    preview.innerHTML = marked.parse(editor.value);
};

async function loadDocuments() {
    const res = await fetch(API);
    const data = await res.json();

    list.innerHTML = "";

    data.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = doc.title;
        li.onclick = () => openDocument(doc.id);
        list.appendChild(li);
    });
}


async function openDocument(docId) {
    const res = await fetch(API + "/" + docId);
    const doc = await res.json();

    id = doc.id;
    title.value = doc.title;
    editor.value = doc.content;
    preview.innerHTML = marked.parse(doc.content);
}


async function saveDocument() {
    const method = id === null ? "POST" : "PUT";
    const url = id === null ? API : API + "/" + id;

    const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            content: editor.value
        })
    });

    const doc = await res.json();

    if (method === "POST") id = doc.id;

    loadDocuments();
}


async function deleteDocument() {
    if (id === null) return;

    await fetch(API + "/" + id, { method: "DELETE" });

    newDocument();
    loadDocuments();
}


function newDocument() {
    id = null;
    title.value = "";
    editor.value = "";
    preview.innerHTML = "";
}


loadDocuments();