
import pandas as pd
import sqlalchemy
from sqlalchemy import Column, Integer, Float, String, Date
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine


import sqlite3
import pandas as pd


conn = sqlite3.connect(r'../Data/fuel_stations.sqlite')
data = pd.read_csv('../Data/DMV_Merge.csv')
data.to_sql('fuel_stations', conn,if_exists='replace',index=False)

