from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # Correct capitalization

app = FastAPI()

# Configure CORS to allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ensure React frontend is allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve the React build folder as static files
# app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")


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
