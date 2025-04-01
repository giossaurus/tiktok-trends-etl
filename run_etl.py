import subprocess
import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

steps = [
    ("Extract", "python3 extract/extract_data.py"),
    ("Transform", "python3 transform/transform_data.py"),
    ("Load", "python3 load/load_to_bigquery.py"),
]

def run_pipeline():
    for step_name, command in steps:
        logging.info(f"Iniciando etapa: {step_name}")
        try:
            subprocess.run(command, shell=True, check=True)
            logging.info(f"Etapa {step_name} concluída com sucesso.\n")
        except subprocess.CalledProcessError as e:
            logging.error(f"Falha na etapa {step_name}: {e}")
            sys.exit(1)

if __name__ == "__main__":
    logging.info("Iniciando pipeline ETL completo...\n")
    run_pipeline()
    logging.info("Pipeline completo com sucesso!")