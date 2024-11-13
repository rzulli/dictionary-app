######
###### Script de população de Database. Faz download de json contendo palavras únicas de até 31 caracteres(as of 11/2024).
###### Insere palavras em na tabela dictionary de database postgres 
###### execeutar depois de 1_init.sql
import urllib.request
import json
import psycopg2
from psycopg2.extras import execute_values
import traceback

#TODO - remover hardcode
URL = "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json"

try:
    print("Downloading %s em /temp/data.json" % URL)
    urllib.request.urlretrieve(URL, "/temp/data.json")
    words = []
    with open("/temp/data.json", "rb") as f:
        json_data = json.load(f)
        words = list(json_data.keys())

    with psycopg2.connect(database="dictionary",
                            host="localhost",
                            user="postgres",
                            password="postgres",
                            port="5432") as conn, conn.cursor() as cur: 
        args = ','.join("('"+i+"')" for i in words)
        
        cur.execute("INSERT INTO dictionary VALUES " + (args)+" ON CONFLICT DO NOTHING")
        conn.commit()
    print("Database populado com sucesso! %i palavras adicionadas."%len(words))
except Exception as e:
    traceback.print_exc()
    print("----------DATABASE NÃO POPULADO----------")
    exit()