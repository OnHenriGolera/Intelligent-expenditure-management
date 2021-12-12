const budget = 30
const times_per_week = 8

const config_food = require("./data/aliments.json")
const config_recipe = require("./data/recipes.json")
var container = [
    {"name":"pastas", "date":300, "number":100},
    {"name":"onion", "date":335, "number":3}
]

showTimeLine(container)

function showTimeLine(container){

    var today = new Date()

    var month_number = [0,31,59,90,120,151,181,212,243,274,304,334]

    var day_number = month_number[today.getMonth()] + today.getDate()

    for (el in container){

        var aliment = container[el]

        var remaining_duration = aliment.date + config_food[aliment.name].duration - day_number

        out = `${aliment.name}\t\t[${aliment.number}] \t\t: `

        for (var i=0;i<remaining_duration;i++){

            if (i>20){
                break
            }

            if ((i+1)%5==0){
                out+=(i+1)+" "
            }else{
                out+="- "
            }

        }

        console.log(out)

    }

}

function getRecipeIngredients(recipe, show=false){

    var data = {}

    for (ingredient in recipe){

        if (!["for","comments"].includes(ingredient)){

            var ingredient_unit = config_food[ingredient].unit

            data[ingredient] = recipe[ingredient]+" "+ingredient_unit

        }

    }

    if (show == true){
        console.table(data)
    }

    return data

}

function getRecipePrice(recipe, perPerson=false, show=false){
    var price = 0
    
    for (var key in recipe){

        var data = {}

        if (!["comments", "for"].includes(key)){
            var aliment_price = config_food[key].price
            var aliment_price_for = config_food[key].for
            var recipe_aliment_quantity = recipe[key]

            var recipe_price = ( aliment_price / aliment_price_for ) * recipe_aliment_quantity

            data[key] = Math.ceil( (recipe_price)*100 ) / 100

            if (perPerson == false){
                price += recipe_price
            }else{
                price += recipe_price / recipe.for
            }

        }

        if (show == true){
            console.table(data)
        }

    }

    var rounded_price = Math.ceil( (price)*10 ) / 10

    return rounded_price
}
