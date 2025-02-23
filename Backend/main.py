from fastapi import FastAPI, HTTPException
from enum import Enum



app = FastAPI()

class BandChoices(Enum):
    Fiction = "fiction"
    Self = "self-help"
    dystopian = "dystopian"


BANDS = [{"id": 1, "name": "The Great Gatsby", "type": "Fiction"},
        {"id": 2, "name": "Atomic Habits", "type": "Self-Help"},
        {"id": 3, "name": "1984", "type": "Dystopian"},
         {"id": 4, "name": "1994", "type": "Dystopian"}]
@app.get('/', tags=["Default Page"])
async def home():
    return {"message":"This is home page"}


@app.post('/about')
async def about_page():
    return {"message":"About the message"}


@app.get('/bands')
async def bands() ->list[dict]:
    return BANDS


@app.get('/bands/{band_id}', description="To get the band detail", tags=['Admin page'])
async def band(band_id:int):
    band = next((b for b in BANDS if b['id']==band_id), None)
    if band is None:
        raise HTTPException(status_code=404, detail="Band not found")
    return bands

@app.get('/bands/type/{type_name}')
async def get_type(type_name:BandChoices) ->list[dict]:
    return [b for b in BANDS if b['type'].lower() == type_name.value]
