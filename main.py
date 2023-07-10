from fastapi import FastAPI, UploadFile, Form, Response,Depends
from fastapi.staticfiles import StaticFiles
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
import sqlite3
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

# SQLite database connection
conn = sqlite3.connect('WordPuzzle.db')
cursor = conn.cursor()

# CREATE TABLE statement
cursor.execute('''
    CREATE TABLE IF NOT EXISTS my_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        word TEXT
    )
''')

# Data model for request body
class DataModel(BaseModel):
    title: str
    description: str
    words: list[str]

@app.post("/save-data")
async def save_data(data: DataModel):
    title = data.title
    description = data.description
    words = ', '.join(data.words)

    # Insert data into the database
    cursor.execute('INSERT INTO my_table (title, description, word) VALUES (?, ?, ?)',
                   (title, description, words))
    conn.commit()

    return


@app.get("/get-answer-data")
async def get_answer_data():
    conn = sqlite3.connect('WordPuzzle.db')
    cursor = conn.cursor()
    cursor.execute("SELECT word FROM my_table")
    rows = cursor.fetchall()
    conn.close()

    answer_data = []

    # 정답 데이터를 2차원 배열로 변환
    for row in rows:
        words = row[0].split(", ")
        answer_data.append(words)

    return JSONResponse(content=answer_data)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
async def read_main():
    return FileResponse("frontend/main.html")

@app.get("/game.html")
async def get_game_page():
    return FileResponse("frontend/game.html")

app.mount("/", StaticFiles(directory="frontend",html=True),name = "frontend")