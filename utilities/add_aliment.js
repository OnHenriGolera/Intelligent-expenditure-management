const jsonfile = require('jsonfile')


var aliments = require("../data/aliments.json")

const prompt = require('prompt-sync')({sigint: true});
  
const input_data = prompt('Aliment data : {name, price, for, unit, duration} ');

var splitted_data = input_data.split(" ")

var name = splitted_data[0]
var price = parseInt( parseFloat(splitted_data[1])*100 ) / 100
var forE = parseInt( parseFloat(splitted_data[2])*100 ) / 100
var unit = splitted_data[3]
var duration = parseInt(splitted_data[4])

aliments[name] = {price: price, for: forE, unit: unit, duration: duration}

const input_confirm = prompt(`\n${JSON.stringify(aliments[name])} : is it correct ? (Y/N) `);

if (input_confirm.toLowerCase() == "y"){
    const file = './data/aliments.json'
    const obj = aliments
    
    jsonfile.writeFile(file, obj, { spaces: 4 }, function (err) {
        if (err) console.error(err)
    })
}else{
    console.log("Aborted !")
}