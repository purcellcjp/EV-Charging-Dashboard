from flask import Flask, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


# Database Setup
#####################################################
engine = create_engine("sqlite:///Data/fuel_stations.sqlite", echo=False)

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
    results = session.query(fuel_stations.Title,
                              fuel_stations.AddressLine1,
                              fuel_stations.Town,
                              fuel_stations.StateOrProvince,
                              fuel_stations.Postcode,
                              fuel_stations.Latitude,
                              fuel_stations.Longitude,
                              fuel_stations.ConnectionTypeIDs).filter(fuel_stations.Town == town).all()
    session.close()

    if not results:
        return jsonify({'message': 'No results for the given city'}), 404
    
    #Dictionary first API
    address_list = []
    for results in results:
        address = {
            "Location Name": results.Title,
            "Address": results.AddressLine1,
            "Town": results.Town,
            "State": results.StateOrProvince,
            "Zip Code": results.Postcode,
            "Latitude": results.Latitude,
            "Longitude": results.Longitude,
            "ConnectionType": results.ConnectionTypeIDs
        }
        address_list.append(address)
    #Return JSON
    return jsonify(address_list)

#Query by State

@app.route("/api/v1.0/chargers_by_state/<state>")
def chargers_by_state(state):
    results = session.query(fuel_stations.Title,
                              fuel_stations.AddressLine1,
                              fuel_stations.Town,
                              fuel_stations.StateOrProvince,
                              fuel_stations.Postcode,
                              fuel_stations.Latitude,
                              fuel_stations.Longitude,
                              fuel_stations.ConnectionTypeIDs).filter(fuel_stations.StateOrProvince == state).all()
    session.close()

    if not results:
        return jsonify({'message': 'No results for the given state'}), 404

    #Dictionary first API
    state_address_list = []
    for results in results:
        state_address = {
            "Location Name": results.Title,
            "Address": results.AddressLine1,
            "Town": results.Town,
            "State": results.StateOrProvince,
            "Zip Code": results.Postcode,
            "Latitude": results.Latitude,
            "Longitude": results.Longitude,
            "ConnectionType": results.ConnectionTypeIDs
        }
        state_address_list.append(state_address)
    #Return JSON
    return jsonify(state_address_list)


######################################################

if __name__ == "__main__":
    app.run(debug=True)
    
session.close()
