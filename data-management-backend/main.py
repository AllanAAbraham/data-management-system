from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Date
from databases import Database
from datetime import date, datetime
import yaml
from sqlalchemy.sql import select, or_, and_

with open("config.yaml", 'r') as stream:
    config = yaml.safe_load(stream)

DATABASE_URL = config['database_url']
engine = create_engine(DATABASE_URL)
metadata = MetaData()

samples = Table(
    "samples",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(255)),
    Column("date_collected", Date),
    Column("experiment_type", String(255)),
    Column("storage_location", String(255)),
)

database = Database(DATABASE_URL)

class SampleIn(BaseModel):
    name: str = Field(..., example="Sample 1")
    date_collected: date = Field(..., example="2022-01-01")
    experiment_type: str = Field(..., example="Type 1")
    storage_location: str = Field(..., example="Location 1")

class SampleOut(SampleIn):
    id: int

app = FastAPI()

origins = [
    "http://localhost:3000",  # React
    "http://localhost:8000",  # FastAPI server 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/samples", response_model=List[SampleOut])
async def read_samples():
    #print('get')
    query = samples.select()
    return await database.fetch_all(query)

@app.get("/samples/{sample_id}", response_model=SampleOut)
async def read_sample(sample_id: int):
    #print('get2')
    query = samples.select().where(samples.c.id == sample_id)
    result = await database.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="Sample not found")
    return result
'''
@app.get("/samples/search/{query}", response_model=List[SampleOut])
async def search_samples(query: str):
    query = samples.select().where(
        or_(
            samples.c.name.ilike(f"%{query}%"),
            samples.c.experiment_type.ilike(f"%{query}%"),
            #samples.c.date_collected.like(f"%{query}%"),
            samples.c.storage_location.ilike(f"%{query}%")
        )
    )
    return await database.fetch_all(query)'''

@app.get("/samples-search", response_model=List[SampleOut])
async def search_samples(
    name: Optional[str] = Query(None),
    date_collected: Optional[str] = Query(None),
    experiment_type: Optional[str] = Query(None),
    storage_location: Optional[str] = Query(None)
):
    #print('get3')
    #print(name)
    #print(date_collected)
    #print(experiment_type)
    #print(storage_location)
    conditions = []
    
    if name:
        conditions.append(samples.c.name.ilike(f"%{name}%"))
    if experiment_type:
        conditions.append(samples.c.experiment_type.ilike(f"%{experiment_type}%"))
    if storage_location:
        conditions.append(samples.c.storage_location.ilike(f"%{storage_location}%"))
    if date_collected and date_collected.strip():
        date_collected = datetime.strptime(date_collected, '%Y-%m-%d').date()
        conditions.append(samples.c.date_collected == date_collected)

    sql_query = samples.select()
    if conditions:
        sql_query = sql_query.where(and_(*conditions))

    return await database.fetch_all(sql_query)
    

@app.post("/samples", response_model=SampleOut)
async def create_sample(sample: SampleIn):
    #print("Insert data")
    query = samples.insert().values(**sample.dict())
    last_record_id = await database.execute(query)
    return {**sample.dict(), "id": last_record_id}

@app.put("/samples/{sample_id}", response_model=SampleOut)
async def update_sample(sample_id: int, sample: SampleIn):
    #print('put')
    query = samples.update().where(samples.c.id == sample_id).values(**sample.dict())
    await database.execute(query)
    return {**sample.dict(), "id": sample_id}

@app.delete("/samples/{sample_id}")
async def delete_sample(sample_id: int):
    query = samples.delete().where(samples.c.id == sample_id)
    await database.execute(query)
    return {"message": "Sample deleted successfully"}