const chai = require('chai');
const expect = chai.expect;
const Pantry = require('../src/Pantry');
// const User = require('../src/User');
const Recipe = require('../src/Recipe');
// const ingredientsData = require("../data/ingredients");


describe('Pantry', function() {
  let pantryFull, pantryEmpty, ingredients, recipe1, recipeInfo1, recipe2, recipeInfo2;

  beforeEach(function() {
    ingredients = [
      {
        "ingredient": 11477,
        "amount": 4
      },
      {
        "ingredient": 18372,
        "amount": 4
      },
      {
        "ingredient": 20081,
        "amount": 2
      }
    ]
    pantryFull = new Pantry(ingredients);
    pantryEmpty = new Pantry();
    recipeInfo1 = {
      "id": 595736,
      "image": "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      "ingredients": [
        {
          "id": 20081,
          "quantity": {
            "amount": 1.5,
            "unit": "c"
          }
        },
        {
          "id": 18372,
          "quantity": {
            "amount": 0.5,
            "unit": "tsp"
          }
        }
      ]
    };
    recipeInfo2 = {
      "id": 678353,
      "image": "https://spoonacular.com/recipeImages/678353-556x370.jpg",
      "ingredients": [
        {
          "id": 1009016,
          "quantity": {
            "amount": 10.5,
            "unit": "cups"
          }
        },
        {
          "id": 9003,
          "quantity": {
            "amount": 20
          }
        }
      ],
      "instructions": [
        {
          "instruction": "Season the pork chops with salt and pepper and grill or pan fry over medium high heat until cooked, about 3-5 minutes per side. (If grilling, baste the chops in the maple dijon apple cider sauce as you grill.)Meanwhile, mix the remaining ingredients except the apple slices, bring to a simmer and cook until the sauce thickens, about 2-5 minutes.Grill or saute the apple slices until just tender but still crisp.Toss the pork chops and apple slices in the maple dijon apple cider sauce and enjoy!",
          "number": 10
        }
      ]
    },
    recipe1 = new Recipe(recipeInfo1);
    recipe2 = new Recipe(recipeInfo2);
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should instantiate a new pantry', function () {
    expect(pantryFull).to.be.an.instanceOf(Pantry);
    expect(pantryEmpty).to.be.an.instanceOf(Pantry);
  });

  it('can have no ingredients by default', function () {
    expect(pantryEmpty.ingredients).to.deep.equal([]);
  });

  it('can be instantiated with ingredients', function() {
    expect(pantryFull.ingredients).to.deep.equal(ingredients);
  });

  it.only('should check if recipe and pantry ingredients match and if pantry has enough for recipe', function() {
    expect(pantryFull.matchAndCompareIngredients(recipe1)).to.equal(true);
    expect(pantryFull.matchAndCompareIngredients(recipe2)).to.equal(false);
    expect(pantryEmpty.matchAndCompareIngredients(recipe1)).to.equal(false);

  });

  it.only('should determine if pantry has enough ingredients for meal', function() {
    expect(pantryFull.checkPantry(recipe1)).to.equal(true);
    expect(pantryFull.checkPantry(recipe2)).to.equal(false);
    expect(pantryEmpty.checkPantry(recipe1)).to.equal(false);
  });

  // it('should determine if I have enough ingredients for a meal', function () {
  //   expect(pantry.checkPantry(recipe1)).to.equal(true);
  //   expect(pantry.checkPantry(recipe2)).to.equal(false);
  // })


});