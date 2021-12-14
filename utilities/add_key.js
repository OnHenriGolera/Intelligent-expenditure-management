const jsonfile = require('jsonfile')


var aliments = require("../data/aliments.json")

for (key in aliments){

    aliments[key]["name"] = ""

}

const file = './data/aliments.json'
const obj = aliments
    
jsonfile.writeFile(file, obj, { spaces: 4 }, function (err) {
    if (err) console.error(err)
})