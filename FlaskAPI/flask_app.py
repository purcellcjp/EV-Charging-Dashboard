from flask import Flask, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


# Database Setup
#####################################################
engine = create_engine("sqlite:///Data/fuel_stations.sqlite")

#reflect database to new model and table
Base= automap_base()
#tables
Base.prepare(autoload_with=engine)

#save references to table
fuel_stations = Base.classes.fuel_stations

#Create session link from python to the DB
session = Session(engine)

#Flask Setup
#####################################################

app = Flask(__name__)

#####################################################
#Flask Routes
#####################################################

@app.route("/")
def home():
    return (
        "Welcome to the Electric Charge Station Finder Tool Home Page!<br/><br/>"
        "Available Routes:<br/>"
        "/api/v1.0/chargers_by_city/<town><br/>"
        "/api/v1.0/chargers_by_state/<state>"
    )
#Query results

@app.route("/api/v1.0/chargers_by_city/<town>")
def chargers_by_city(town):
    results = session.query(fuel_stations.Station_Name,
                              fuel_stations.Address,
                              fuel_stations.City,
                              fuel_stations.State,
                              fuel_stations.Zipcode,
                              fuel_stations.Latitude,
                              fuel_stations.Longitude,
                              fuel_stations.Connection_Type).filter(fuel_stations.City == town).all()
    session.close()

    if not results:
        return jsonify({'message': 'No results for the given city'}), 404
    
    #Dictionary first API
    address_list = []
    for results in results:
        address = {
            "Location Name": results.Station_Name,
            "Address": results.Address,
            "Town": results.City,
            "State": results.State,
            "Zip Code": results.Zipcode,
            "Latitude": results.Latitude,
            "Longitude": results.Longitude,
            "ConnectionType": results.Connection_Type
        }
        address_list.append(address)
    #Return JSON
    return jsonify(address_list)

# #Query by State

@app.route("/api/v1.0/chargers_by_state/<state>")
def chargers_by_state(state):
    results = session.query(fuel_stations.Station_Name,
                              fuel_stations.Address,
                              fuel_stations.City,
                              fuel_stations.State,
                              fuel_stations.Zipcode,
                              fuel_stations.Latitude,
                              fuel_stations.Longitude,
                              fuel_stations.Connection_Type).filter(fuel_stations.State == state).all()
    session.close()

    if not results:
        return jsonify({'message': 'No results for the given state'}), 404

    #Dictionary first API
    state_address_list = []
    for results in results:
        state_address = {
            "Location Name": results.Station_Name,
            "Address": results.Address,
            "Town": results.City,
            "State": results.State,
            "Zip Code": results.Zipcode,
            "Latitude": results.Latitude,
            "Longitude": results.Longitude,
            "ConnectionType": results.Connection_Type
        }
        state_address_list.append(state_address)
    #Return JSON
    return jsonify(state_address_list)


######################################################

if __name__ == "__main__":
    app.run(debug=True)
    
session.close()
