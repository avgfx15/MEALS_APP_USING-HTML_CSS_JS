// All Declaration

const search = document.getElementById('search');
const submit = document.getElementById('submit');
const randomBtn = document.getElementById('randomBtn');
const meals = document.getElementById('meals');
const singleMeal = document.getElementById('singleMeal');
const result = document.getElementById('result');
const closeBtn = document.getElementById('closeBtn');
const addTOFavBtn = document.getElementById('addTOFavBtn');



// Random Search Meal On RandomBtn Click

randomBtn.onclick = async () => {
    singleMeal.innerHTML = ' ';
    result.innerHTML = "";

    // Try To fetch Meal Item randomly 

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);

        const res = await response.json();

        if (res.meals != null) {
            const singleMealInfo = res.meals[0];
            addMealToDom(singleMealInfo);
        } else {
            console.log("else");
        }
    } catch (error) {
        console.log(error);
    }
}

// Search Meals By Name 

const searchMeal = async (e) => {
    e.preventDefault();
    singleMeal.innerHTML = "";
    const searchResult = search.value
        ;
    // Try to fetch Meal from SearchName 

    if (searchResult.trim()) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchResult}`);

            const res = await response.json();

            if (res.meals != null) {
                result.innerHTML = `<h2>Search Result for '${searchResult}' : </h2>`
                meals.innerHTML = res.meals.map(meal => `
                <div class="meal">                
                     <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                     <div class="mealInfo" data-mealID="${meal.idMeal}">
                             <h3>${meal.strMeal}</h3>
                     </div>
                </div >
                `).join("");
            } else {
                result.innerHTML = `<h2> There are no search result for ${searchResult}</h2> `
            }
            search.value = " ";
            setTimeout(() => {
                result.innerHTML = " ";
            }, 3000);
        } catch (error) {
            alert(error.message);
        }

    } else {
        alert('Please enter a search text');
    }
}


// Meals Add Event Listener Function 

submit.addEventListener('submit', searchMeal);



// SingleMeal addEventListener Function

// Get Meal Item By Meal Id 

const getMealById = async (e) => {
    e.preventDefault();
    const mealItem = e.target;
    if (mealItem) {
        const mealId = mealItem.getAttribute("data-mealid");

        // Try to Fect Meal By meal Id 

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);

            const res = await response.json();

            if (res.meals != null) {
                const singleMealInfo = res.meals[0];
                addMealToDom(singleMealInfo);
            } else {
                console.log("else");
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("error");
    }
}

// Add singleMeal To Dom To connect ingredients with Measurement like 1 spoon or 2 - cup etc...

const addMealToDom = (singleMealInfo) => {

    const ingredients = [];
    for (let i = 1; i < 20; i++) {
        if (singleMealInfo[`strIngredient${i}`]) {
            ingredients.push(
                `${singleMealInfo[`strIngredient${i}`]} - ${singleMealInfo[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    // HTML Part for Single Meal Display 
    singleMeal.innerHTML = `
                    <div class="singleMealdata">
                            <div class="image">             
                                <img src="${singleMealInfo.strMealThumb}" alt="${singleMealInfo.strMeal}"/>
                            </div>
                            <div class="singleMealInfo" data-mealID="${singleMealInfo.idMeal}">                            
                               <h2 class="name">${singleMealInfo.strMeal}</h2>
                                   <div>
                                        ${singleMealInfo.strCategory ? `<p class="category">Category : <span>${singleMealInfo.strCategory}</span></p>` : " "}

                                        ${singleMealInfo.strArea ? `<p class="area">Area : <span>${singleMealInfo.strArea}</span></p>` : " "}

                                        ${singleMealInfo.strSource ? `<p class="source"> Source : <span>${singleMealInfo.strSource}</span></p>` : " "}

                                        ${singleMealInfo.strTags ? `<p class="source"> Tags : <span>${singleMealInfo.strTags}</span></p>` : " "}
                                  
                                        </div>
                                 </div>                                   
                    </div> 
                    <div class="description">
                                   ${singleMealInfo.strInstructions ? `<p class="source"> Decsription : <span>${singleMealInfo.strInstructions}</span></p>` : " "}
                                                             
                      </div>
                    <div class="ingredients">
                    <p>Ingredients : </p>
                                 <ul>
                                            ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
                                 </ul>
                                                       
                      </div>
                      <div class="actionBtn">
                                
                                <button type="button" class="addToFav btn" id="addTOFavBtn" onclick = "addToFav(${singleMealInfo.idMeal})">Add To Favourite</button>
                                <button type="button" class="close btn" id="closeBtn" onclick="goToHome()">Close</button>
                      </div>
                    `
}


// SingleMeal addEventListener Function 


meals.addEventListener("click", getMealById);


// Single Meal Close Btn To go at Home 

const goToHome = () => {
    // location.reload();
    location.href = "/";
}

// Add To Fav Function 

let favouriteMeals = [];

const addToFav = async (mealId) => {

    // Try to fetch All favourite Meals By Meal Id 

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const res = await response.json();

        if (res.meals != null) {

            const singleMealInfo = res.meals[0];

            // const favouriteMealsList = JSON.parse(localStorage.getItem("favouriteMeals"));

            // let checkMealAvailable = favouriteMealsList.some((meal => meal.idMeal === mealId));

            // Push Favourite Meal in to favouriteMeals Array 

            favouriteMeals.push(singleMealInfo);

            // Store favouriteMeals to localStorage 

            localStorage.setItem("favouriteMeals", JSON.stringify(favouriteMeals));

            result.innerHTML = `<h2>Meal added successfully</h2>`

            setTimeout(() => {
                result.innerHTML = " ";
            }, 3000);

        } else {
            console.log("else");
        }

    } catch (error) {
        console.log(error);
    }

}

// My Favourite Meals List 

const myFavMealList = () => {
    const favouriteMealsList = JSON.parse(localStorage.getItem("favouriteMeals"));


    meals.innerHTML = favouriteMealsList.map(meal => `
    <div class="meal">                
         <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
         <div class="mealInfo" data-mealID="${meal.idMeal}">
                 <h3>${meal.strMeal}</h3>
         </div>
    </div >
    `).join("");
}



