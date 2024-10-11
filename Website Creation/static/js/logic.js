import csv from "csvtojson";

(async () => {
  const data = await csv().fromFile("data")
  console.log(data)
})