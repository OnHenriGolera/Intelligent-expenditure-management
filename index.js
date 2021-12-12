const budget = 30
const times_per_week = 8

const config_food = require("./data/aliments.json")
const config_recipe = require("./data/recipes.json")


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
