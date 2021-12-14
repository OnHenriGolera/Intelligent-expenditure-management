const budget = 30
const times_per_week = 8

const config_food = require("./data/aliments.json")
const config_recipe = require("./data/recipes.json")

const tag_blacklist = ["for","comments","tag"]

var container_zip = ["pastas","onion", "cream", "bacon", "bread", "francfort", "ham", "egg"]
var container_raw = {
    "pastas": {"date":300, "number":100},
    "onion":  {"date":345, "number":3},
    "cream": {"date":345, "number":3},
    "bacon": {"date":346, "number":3},
    "francfort": {"date":346, "number":3},
    "ham": {"date":346, "number":5},
    "bread": {"date":346, "number":5},
    "egg": {"date":346, "number":3}
}

console.log(listFeasibleRecipe(container_zip, container_raw))

function timeRemainingBeforePeremption(aliment, date){
    var today = new Date()

    var month_number = [0,31,59,90,120,151,181,212,243,274,304,334]

    var day_number = month_number[today.getMonth()] + today.getDate()

    var remaining_duration = - day_number + date + config_food[aliment].duration

    return remaining_duration

}

function listFeasibleRecipe(container_zip, container_raw, seuil_percentage=0.3, seuil_value=1){

    var out = {}

    for (recipe in config_recipe){

        var recipePrice = getRecipePrice(config_recipe[recipe])

        var test = isRecipeFeasible(config_recipe[recipe], container_zip, container_raw)
        
        if (test.feasible == true){

            out[recipe] = {"sup":0, "supList":[]}
        
        }else{

            var sum_ingredients = 0
            for (lack in test.lack){

                var number = Math.ceil( test.lack[lack] / config_food[lack].for )
                sum_ingredients += config_food[lack].price * number

            }

            if (sum_ingredients < seuil_value || sum_ingredients < seuil_percentage * recipePrice){

                out[recipe] = {"sup":sum_ingredients, "supList":test.lack}

            }

        }
        
    }

    return out

}


function isRecipeFeasible(recipe, container_zip, container_raw){

    var out = {"feasible":true, "lack": [], "time_remaining": 100}

    for (aliment in recipe){

        if (!tag_blacklist.includes(aliment)){

            if (!container_zip.includes(aliment)){
                
                out.lack[aliment] = recipe[aliment]
                out.feasible = false

            }else{

                if (container_raw[aliment].number < recipe[aliment]){

                    out.lack[aliment] = recipe[aliment] - container_raw[aliment].number
                    out.feasible = false
                    
                }

                var remaining_duration = timeRemainingBeforePeremption(aliment, container_raw[aliment].date)
                
                if (out.time_remaining > remaining_duration){

                    out.time_remaining = remaining_duration

                }

            }

        }

    }

    return out

}

function showTimeLine(container){

    for (el in container){

        var aliment = container[el]

        var remaining_duration = timeRemainingBeforePeremption(el, aliment.date)

        out = `${el}\t\t[${aliment.number}] \t\t: `

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

        if (!tag_blacklist.includes(ingredient)){

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
        
        if (!tag_blacklist.includes(key)){
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
