from google.cloud import bigquery
import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

CREDENTIALS_PATH = "gcp_key.json"
CSV_FILE_PATH = Path("data/processed/formatted_data.csv")

PROJECT_ID = "tiktok-data-pipeline"
DATASET_ID = "tiktok_data"
TABLE_ID = "videos"

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH

def upload_csv_to_bigquery():
    client = bigquery.Client()

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        autodetect=True,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,  # sobrescreve
    )

    with open(CSV_FILE_PATH, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_ref, job_config=job_config)

    job.result()

    logging.info(f"Upload para BigQuery completo: {table_ref}")
    table = client.get_table(table_ref)
    logging.info(f"Linhas carregadas: {table.num_rows}")

if __name__ == "__main__":
    upload_csv_to_bigquery()