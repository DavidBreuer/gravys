import base64
import os
import secrets
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(dotenv_path=Path(__file__).parents[2] / ".env")

KEY = os.getenv("KEY", "")
NEO4J_HOST = os.getenv("NEO4J_HOST", "")
NEO4J_USER = os.getenv("NEO4J_USER", "")
NEO4J_WORD = os.getenv("NEO4J_WORD", "")

todos = [{"id": "1", "item": "Read a book."}, {"id": "2", "item": "Cycle around town."}]

app = FastAPI()

origins = ["http://localhost:5173", "localhost:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_credentials(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Basic "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    try:
        decoded = base64.b64decode(auth[6:]).decode("utf-8")
        username, _, password = decoded.partition(":")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    if not secrets.compare_digest(password.encode("utf-8"), KEY.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )
    return username


@app.get("/login", tags=["auth"])
async def login(username: str = Depends(verify_credentials)):
    return {"username": username}


@app.get("/", tags=["root"])
async def read_root(username: str = Depends(verify_credentials)) -> dict:
    return {"message": "Welcome to your todo list."}


@app.get("/todo", tags=["todos"])
async def get_todos(username: str = Depends(verify_credentials)) -> dict:
    return {"data": todos}


@app.post("/todo", tags=["todos"])
async def add_todo(todo: dict, username: str = Depends(verify_credentials)) -> dict:
    todos.append(todo)
    return {"data": {"Todo added."}}


@app.put("/todo/{id}", tags=["todos"])
async def update_todo(
    id: int, body: dict, username: str = Depends(verify_credentials)
) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todo["item"] = body["item"]
            return {"data": f"Todo with id {id} has been updated."}

    return {"data": f"Todo with id {id} not found."}


@app.delete("/todo/{id}", tags=["todos"])
async def delete_todo(id: int, username: str = Depends(verify_credentials)) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todos.remove(todo)
            return {"data": f"Todo with id {id} has been removed."}

    return {"data": f"Todo with id {id} not found."}


@app.get("/neo4j/nodes", tags=["neo4j"])
async def get_neo4j_nodes(username: str = Depends(verify_credentials)):
    try:
        from neo4j import GraphDatabase

        print(NEO4J_HOST, NEO4J_USER, NEO4J_WORD)
        driver = GraphDatabase.driver(NEO4J_HOST, auth=(NEO4J_USER, NEO4J_WORD))
        with driver.session() as session:
            result = session.run("MATCH (n) RETURN n LIMIT 100")
            nodes = [dict(record["n"]) for record in result]
        driver.close()
        return {"data": nodes}
    except Exception as e:
        return {"data": [], "error": str(e)}
