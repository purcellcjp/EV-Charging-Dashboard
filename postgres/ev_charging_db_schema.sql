--------------------------------------------------
--------------------------------------------------
-- Database: Employees_db
--------------------------------------------------
--------------------------------------------------
DROP DATABASE IF EXISTS "Crowdfunding_db";

CREATE DATABASE "EV_Charging_db"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


--------------------------------------------------
--------------------------------------------------
-- Create Tables
--------------------------------------------------
--------------------------------------------------

--------------------------------------------------
--  Drop Tables if they Exists
--------------------------------------------------
DROP TABLE IF EXISTS fuel_stations;
DROP TABLE IF EXISTS access_code;
DROP TABLE IF EXISTS ev_connector_types;


--------------------------------------------------
-- Create table access_code
--------------------------------------------------
CREATE TABLE access_code 
(
 access_code		CHAR(10)		PRIMARY KEY,
 access_descp		VARCHAR(20)		NOT NULL
);

/*
Value 	Description
public 	Public
private 	Private
*/

--------------------------------------------------
-- Create table ev_connector_types
--------------------------------------------------
CREATE TABLE ev_connector_types 
(
 connector_type_code    VARCHAR(50)		PRIMARY KEY,
 code_descp	        	VARCHAR(50)		NOT NULL
);

/*
Value 	Description
NEMA1450 	NEMA 14-50
NEMA515 	NEMA 5-15
NEMA520 	NEMA 5-20
J1772 	J1772
J1772COMBO 	CCS
CHADEMO 	CHAdeMO
TESLA 	J3400
*/

--------------------------------------------------
-- Create table fuel_stations
--------------------------------------------------
CREATE TABLE fuel_stations 
(
 id				    SERIAL 			PRIMARY KEY,
 station_name	    VARCHAR(50)		NOT NULL,
 access_code        VARCHAR(50)	NOT NULL,
 owner      		VARCHAR(75)		NOT NULL,
 last_used			DATE            NOT NULL,
 open_date			DATA            NOT NULL,
 ev_dc_fast			INT		        NOT NULL,
 level1_charging	CHAR(1)			NULL,
 level2_charging	CHAR(1)			NULL,
 street_address		VARCHAR(50)		NOT NULL,
 city		        VARCHAR(50)	    NOT NULL,
 state              CHAR(2)        NOT NULL,
 zipcode			CHAR(5)		    NOT NULL,
 latitude		    DECIMAL(18,4)	NOT NULL,
 longitude		    DECIMAL(18,4)	NOT NULL,
 pricing            VARCHAR(50)    NOT NULL,
 connector_type     VARCHAR    	NOT NULL
);




--------------------------------------------------
--------------------------------------------------
-- Table Imports
--------------------------------------------------
--------------------------------------------------
COPY access_code
FROM 'C:\Users\purce\Documents\GitHub\Crowdfunding_ETL\Resources\category.csv'
DELIMITER ','
CSV HEADER;

COPY ev_connector_types
FROM 'C:\Users\purce\Documents\GitHub\Crowdfunding_ETL\Resources\subcategory.csv'
DELIMITER ','
CSV HEADER;

COPY fuel_stations
FROM 'C:\Users\purce\Documents\GitHub\Crowdfunding_ETL\Resources\contacts.csv'
DELIMITER ','
CSV HEADER;




--------------------------------------------------
--------------------------------------------------
-- Add Table Foreign Keys to table fuel_stations
--------------------------------------------------
--------------------------------------------------
ALTER TABLE fuel_stations
ADD CONSTRAINT fk_contacts_contact_id
FOREIGN KEY(contact_id)
REFERENCES contacts(contact_id)
ON DELETE CASCADE;

		
ALTER TABLE fuel_stations
ADD CONSTRAINT fk_category_id
FOREIGN KEY(category_id)
REFERENCES category(category_id)
ON DELETE CASCADE;

 
ALTER TABLE campaign
ADD CONSTRAINT fk_subcategory_id
FOREIGN KEY(subcategory_id)
REFERENCES subcategory(subcategory_id)
ON DELETE CASCADE;		


--------------------------------------------------
--------------------------------------------------
-- Drop Foreign Key Contraints
--------------------------------------------------
--------------------------------------------------
-- Only needed if tables need to be repopulated
/*
ALTER TABLE salaries
DROP CONSTRAINT fk_salaries_emp_no;
		
ALTER TABLE dept_manager
DROP CONSTRAINT fk_dept_manager_dept_no;
  
ALTER TABLE dept_manager
DROP CONSTRAINT fk_dept_manager_emp_no;	
*/

--------------------------------------------------
--------------------------------------------------
-- truncate Tables
--------------------------------------------------
--------------------------------------------------
/* Needed in case import needs to be re-executed
TRUNCATE TABLE category;
TRUNCATE TABLE subcategory;
TRUNCATE TABLE campaign;
TRUNCATE TABLE contacts;
*/