import psycopg2
from psycopg2 import sql
import yaml

# Load database configuration from YAML file
with open('dbconfig.yaml', 'r') as file:
    config = yaml.safe_load(file)

# Connect to the PostgreSQL server
conn = psycopg2.connect(host=config['host'], user=config['user'], password=config['password'])

# Set the isolation level to ISOLATION_LEVEL_AUTOCOMMIT
conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

# Create a new cursor
cur = conn.cursor()

# Create a new database
cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(config['database_name'])))

# Close the cursor and the connection
cur.close()
conn.close()

# Connect to the PostgreSQL server
conn = psycopg2.connect(config['database_url'])

# Create a new cursor
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute("""
    CREATE TABLE samples (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date_collected DATE NOT NULL,
        experiment_type VARCHAR(255) NOT NULL,
        storage_location VARCHAR(255) NOT NULL
    )
""")

# Insert sample records
sample_records = [
    ('Sample1', '2022-01-01', 'Experiment1', 'Location1'),
    ('Sample2', '2022-01-02', 'Experiment2', 'Location2'),
    ('Sample3', '2022-01-03', 'Experiment3', 'Location3'),
    ('Sample4', '2022-01-04', 'Experiment4', 'Location4'),
    ('Sample5', '2022-01-05', 'Experiment5', 'Location5'),
    ('Sample6', '2022-01-06', 'Experiment6', 'Location6'),
    ('Sample7', '2022-01-07', 'Experiment7', 'Location7'),
    ('Sample8', '2022-01-08', 'Experiment8', 'Location8'),
    ('Sample9', '2022-01-09', 'Experiment9', 'Location9'),
    ('Sample10', '2022-01-10', 'Experiment10', 'Location10'),
]

for record in sample_records:
    cur.execute("""
        INSERT INTO samples (name, date_collected, experiment_type, storage_location)
        VALUES (%s, %s, %s, %s)
    """, record)

# Commit the transaction
conn.commit()

# Close the connection
cur.close()
conn.close()