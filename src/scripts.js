// const Recipe = require("./Recipe");
let recipeCardSection = document.querySelector(".recipe-cards-parent");
let sidebarSection = document.querySelector(".search-options");
let userProfileSection = document.querySelector(".user-list");

// let searchBtn = document.getElementById("search-btn");
// let clearSearchBtn = document.getElementById("clear-text-btn");

const generateRandomUser = () => {
  return Math.round(Math.random() * usersData.length);
}
  
const currentUser = new User(usersData[generateRandomUser()]);
const currentPantry = new Pantry(currentUser.pantry);

// DOM display onload

const welcomeGreeting = () => {
  let greeting = document.querySelector(".user-greeting");
  let firstName = currentUser.name.split(" ")[0];
  greeting.innerText = `Welcome, ${firstName}!`;
}

const populateRecipeCards = (recipeList) => {
  recipeCardSection.innerHTML = "";
  recipeCardSection.insertAdjacentHTML("beforeend",`<div class="recipe-modal"></div>`);
  recipeList.forEach(recipe => {
    let cardHtml = `
        <div class="recipe-card" id="${recipe.id}">
          <img src=${recipe.image} class="recipe-img" alt="Image of recipe">
            <div class="card-overlay">
              <div class="card-overlay-top">
                <button class="card-btn add-favorite-recipe-btn">
                  <img src="../assets/heart.svg" class="user-icons red-heart add-to-favorite" id="${recipe.id}" alt="Image of heart">
                </button>   
                <button class="card-btn" class="add-planned-recipe-btn" id="${recipe.id}">
                  <img src="../assets/calendar.svg" class="user-icons calendar add-to-planned" id="${recipe.id}" alt="Image of calendar">
                </button>
              <h5 class="recipe-title">${recipe.name}</h5>
              </div>
            </div>`
    recipeCardSection.insertAdjacentHTML("beforeend", cardHtml);
  })
}

const populateAllTags = (recipeList) => {
  let tagList = document.querySelector(".tag-list");
  let uniqueTags = [];
  recipeList.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!uniqueTags.includes(tag)) { 
        uniqueTags.push(tag);
        let tagHTML = `<button class="tag-buttons" id="${tag}">${capitalize(tag)}</button>`
        tagList.insertAdjacentHTML('beforeend', tagHTML);
      }
    });
  })
}

const capitalize = (words) => {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
};

const loadHandler = () => {
  let greeting = document.querySelector(".user-greeting");
  populateAllTags(recipeData);
  populateRecipeCards(recipeData);
  welcomeGreeting();
}

// Pantry Modal //

const openPantryInfo = () => {
  let pantryModal = document.querySelector(".pantry-modal");
  pantryModal.style.display = "inline";
  // generatePantryDetails(pantryModal);
}

// const generatePantryDetails = (pantryModal) => {
 
// }

const closePantryList = () => {
  let pantryModal = document.querySelector(".pantry-modal");
  pantryModal.style.display = "none";
};

const myPantryHandler = (event) => {
  if (event.target.className === "user-list-btns pantry-btn") {
    openPantryInfo();
  }
  if (event.target.className === "close-icon close-icon-pantry") {
    closePantryList();
  }
};

userProfileSection.addEventListener("click", myPantryHandler);

// Sidebar Buttons //
const sidebarButtonsHandler = (event) => {
  if (event.target.className === "filter-btns show-favorite-btn") {
    populateRecipeCards(currentUser.favoriteRecipes);
  }
  if (event.target.className === "filter-btns show-planned-btn") {
    populateRecipeCards(currentUser.plannedRecipes);
  }
  if (event.target.className === "filter-btns show-all-btn") {
    populateRecipeCards(recipeData);
  }
}

sidebarSection.addEventListener("click", sidebarButtonsHandler);

// Recipe Modals //

const viewRecipe = () => {
  let allRecipeInfo = document.querySelector(".recipe-modal");
  allRecipeInfo.innerHTML = "";
  allRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipeObj = recipeData.find(recipe => recipe.id === Number(recipeId));
  let recipe =  new Recipe(recipeObj); 
  displayRecipeDetails(recipe, ingredientsData);
};
 
const makeIngredientsList = (recipe, ingredientsList) => {
  return recipe.ingredients.map(ingredient => {
    let ingredientName = recipe.findIngredient(ingredient, ingredientsList);
    return `${ingredient.quantity.amount} ${ingredient.quantity.unit} ${capitalize(ingredientName.name)}</br>`;
  }).join(" ");
}

const getRecipeInstructions = (recipe) => {
  return recipe.getInstructions();
}

const getNeededIngredientsList = (recipe, ingredientsList) => {
  return currentPantry.createGroceryList(recipe, ingredientsList).map(ingredient => {
    return `${capitalize(ingredient.name)} $${Math.round(ingredient.cost)}</br>`;
  }).join(" ");
}

const displayRecipeDetails = (recipe, ingredientsList) => {
  let ingredients = makeIngredientsList(recipe, ingredientsList);
  let instructions = getRecipeInstructions(recipe);
  let neededIngredients = getNeededIngredientsList(recipe, ingredientsList)
  let recipeModalContent = document.querySelector(".recipe-modal");
  let recipeTitle = `
      <button id="exit-btn"><img src="../assets/close.svg" class="close-icon" alt="Close instructions"></button>
       <img src="${recipe.image}" class="recipe-img" id="recipe-modal-img"
       alt = "Image of recipe" >
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <article class="card-ingredients-list">${ingredients}</article>
      <h4>Instructions</h4>
      <article>${instructions}</article>
      <h4>Cost</h4>
      <article>To make this recipe, you need to buy: </br> ${neededIngredients}.</br>For a total of $20!</article>`
  recipeModalContent.insertAdjacentHTML("beforeend", recipeTitle);
}

const closeRecipe = () => {
  let recipeInfo = document.querySelector(".recipe-modal");
  recipeInfo.style.display = "none";
} 

const toggleFavoriteRecipe = (event) => {
  let recipe = recipeData.find(recipe => recipe.id === Number(event.target.id));
  if (!currentUser.favoriteRecipes.includes(recipe)) {
    changeHeartGreen(event);
    currentUser.addFavoriteRecipe(recipe);
  } else {
    changeHeartRed(event);
    currentUser.deleteFavoriteRecipe(recipe);
  }
};

const changeHeartGreen = (event) => {
  event.target.src = "../assets/heart-active.svg";
};

const changeHeartRed = (event) => {
  event.target.src = "../assets/heart.svg";
};

const addRecipeToPlanned = (event) => {
  let recipe = recipeData.find(recipe => recipe.id === Number(event.target.id));
  currentUser.addPlannedRecipe(recipe);
};

const recipeCardHandler = (event) => {
  if (event.target.className === "recipe-img") {
    viewRecipe();
  }
  if (event.target.className === "close-icon") {
    closeRecipe();
  } 
  if (event.target.className === "user-icons red-heart add-to-favorite") {
    toggleFavoriteRecipe(event);
  }
  if (event.target.className === "user-icons calendar add-to-planned") {
    addRecipeToPlanned(event);
  }
}


recipeCardSection.addEventListener("click", recipeCardHandler);

window.onload = loadHandler();


