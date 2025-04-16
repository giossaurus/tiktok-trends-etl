import os
import json
import csv
import logging
from datetime import datetime
from pathlib import Path

from bellingcat_hashtag_scraper import run_hashtag_scraper

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

RAW_DIR = Path("data/raw")
RAW_DIR.mkdir(parents=True, exist_ok=True)

def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def save_to_csv(data, filename):
    if not data:
        logging.warning("Nenhum dado para salvar em CSV.")
        return

    keys = data[0].keys()
    with open(filename, "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)

def extract_data(hashtag: str, limit: int = 100):
    logging.info(f"Iniciando extração de dados para #{hashtag} com limite de {limit} vídeos")

    data = run_hashtag_scraper(hashtag=hashtag, max_videos=limit)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = RAW_DIR / f"{hashtag}_{timestamp}.json"
    csv_path = RAW_DIR / f"{hashtag}_{timestamp}.csv"

    save_to_json(data, json_path)
    save_to_csv(data, csv_path)

    logging.info(f"Dados salvos em:\nJSON: {json_path}\nCSV: {csv_path}")
    return data

if __name__ == "__main__":
    # Exemplo: hashtag hardcoded (vamos trocar por argparse depois)
    extract_data("python", limit=50)