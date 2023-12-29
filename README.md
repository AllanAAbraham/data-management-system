# Project: Biotech Data Management System

## Setting Up and Running the Database Initialization Script

1. Ensure you have Python and PostgreSQL installed on your system. You can download Python [here](https://www.python.org/downloads/) and PostgreSQL [here](https://www.postgresql.org/download/).

2. Navigate to .\data-management-system\data-management-backend

2. Install the required Python packages by running the following command in your terminal:

    ```bash
    pip install -r requirements.txt
    ```

3. Edit dbconfig.yaml and config.yaml with your Postgres username, password (and host if necessary)

3. Run the `db_init.py` script to initialize your database. In your terminal, navigate to the directory containing `db_init.py` and run:

    ```bash
    python db_init.py
    ```

4. Start the backend server:


    ```bash
    uvicorn main:app --reload
    ```
5. Access API Documentation on 'http://localhost:8000/docs'

## Setting Up and Starting the Frontend

1. Ensure you have Node.js and npm installed on your system. You can download Node.js and npm [here](https://nodejs.org/en/download/).

2. Navigate to the frontend directory:

    ```bash
    cd .\data-management-System\data-management-frontend\data-frontend-app
    ```

3. Install the required packages by running:

    ```bash
    npm install
    ```

4. Start the frontend server:

    ```bash
    npm run dev
    ```

Visit `http://localhost:3000` in your browser to view the application.
# data-management-project
