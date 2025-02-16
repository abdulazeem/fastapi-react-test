from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- Note the correct capitalization

app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/calculate/{operation}")
async def calculate(num1: float, num2: float, operation: str):
    try:
        if operation == "add":
            result = num1 + num2
        elif operation == "subtract":
            result = num1 - num2
        elif operation == "multiply":
            result = num1 * num2
        elif operation == "divide":
            if num2 == 0:
                return {"error": "Division by zero!", "status": "error"}
            result = num1 / num2
        else:
            return {"error": "Invalid operation", "status": "error"}

        return {"result": result, "status": "success"}

    except Exception as e:
        return {"error": str(e), "status": "error"}