from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

documents = []
next_id = 1


class Document(BaseModel):
    title: str
    content: str
@app.post("/documents")
def create_document(document: Document):
    global next_id

    new_doc = {
        "id": next_id,
        "title": document.title,
        "content": document.content
    }

    documents.append(new_doc)
    next_id += 1

    return new_doc

@app.get("/documents")
def get_documents():
    return documents
@app.get("/documents/{id}")
def get_document(id: int):
    for doc in documents:
        if doc["id"] == id:
            return doc

    raise HTTPException(404, "Document not found")


@app.put("/documents/{id}")
def update_document(id: int, document: Document):
    for doc in documents:
        if doc["id"] == id:
            doc["title"] = document.title
            doc["content"] = document.content
            return doc

    raise HTTPException(404, "Document not found")
@app.delete("/documents/{id}")
def delete_document(id: int):
    for doc in documents:
        if doc["id"] == id:
            documents.remove(doc)
            return {"message": "Deleted"}

    raise HTTPException(404, "Document not found")




