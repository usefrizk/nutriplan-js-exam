const Categories = document.getElementById("categories-grid");
const searchfilter = document.getElementById("search-filters-section");
const secCategory = document.getElementById("meal-categories-section");
const secrecipes = document.getElementById("all-recipes-section");
const recipes = document.getElementById("recipes-grid");
const secDetail = document.getElementById("meal-details");
const backMeal = document.getElementById("back-to-meals-btn");
const logMeal = document.getElementById("log-meal-btn");
const gradients = document.getElementById("gradients");
const searchInput = document.getElementById("search-input");
const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");
const recipess = document.getElementById("recipes-grid");
const savedView = localStorage.getItem("view");
const savedSearch = localStorage.getItem("search");
const lastMeal = JSON.parse(localStorage.getItem("lastMeal"));
const productsSection = document.getElementById("products-section");
const foodlogSection = document.getElementById("foodlog-section");
const navLinks = document.querySelectorAll(".nav-link");
const headerTitle = document.querySelector("#header h1");
const headerText = document.querySelector("#header p");
const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
const gradeButtons = document.querySelectorAll(".nutri-score-filter");
const productCategoryBtns = document.querySelectorAll(".product-category-btn");
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const foodlogDate = document.getElementById("foodlog-date");
const foodlogProgress = document.querySelector("#foodlog-today-section .grid");
const loggedCount = document.querySelector("#foodlog-today-section h4");
const loggedList = document.getElementById("logged-items-list");
const clearFoodlog = document.getElementById("clear-foodlog");
const weeklyChart = document.getElementById("weekly-chart");
const quickBtns = document.querySelectorAll(".quick-log-btn");
const modalRoot = document.createElement("div");

if (savedSearch) {
  searchInput.value = savedSearch;
  searchMeals(savedSearch);
}
if (savedView === "list") {
  recipess.classList.add("grid-cols-2");
  recipess.classList.remove("grid-cols-4");
} else {
  recipess.classList.add("grid-cols-4");
  recipess.classList.remove("grid-cols-2");
}
gridBtn.addEventListener("click", function () {
  gridBtn.classList.add("bg-white", "shadow-sm");
  listBtn.classList.remove("bg-white", "shadow-sm");
});

listBtn.addEventListener("click", function () {
  listBtn.classList.add("bg-white", "shadow-sm");
  gridBtn.classList.remove("bg-white", "shadow-sm");
});
listBtn.addEventListener("click", function () {
  recipess.classList.add("grid-cols-2");
  recipess.classList.remove("grid-cols-4");

  localStorage.setItem("view", "list");
});

gridBtn.addEventListener("click", function () {
  recipess.classList.remove("grid-cols-2");
  recipess.classList.add("grid-cols-4");

  localStorage.setItem("view", "grid");
});

if (lastMeal) {
  searchfilter.classList.add("hidden");
  secCategory.classList.add("hidden");
  secrecipes.classList.add("hidden");
  secDetail.classList.remove("hidden");

  getDetails(lastMeal);
  inger(lastMeal);
  instruction(lastMeal);
  youTubeVideo(lastMeal);
}
let categories = [];
async function GetFood() {
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/meals/categories",
  );
  const data = await response.json();
  categories = data.results;
  const iconColors = [
    "#F97316",
    "#EAB308",
    "#EC4899",
    "#F59E0B",
    "#64748B",
    "#06B6D4",
    "#0EA5E9",
    "#10B981",
    "#22C55E",
    "#84CC16",
    "#8B5CF6",
    "#6366F1",
    "#EF4444",
    "#14B8A6",
  ];

  const cardColors = [
    "#FFF7ED",
    "#FEFCE8",
    "#FDF2F8",
    "#FFFBEB",
    "#F8FAFC",
    "#ECFEFF",
    "#F0F9FF",
    "#ECFDF5",
    "#F0FDF4",
    "#F7FEE7",
    "#F5F3FF",
    "#EEF2FF",
    "#FEF2F2",
    "#F0FDFA",
  ];

  const icons = [
    "fa-drumstick-bite",
    "fa-egg",
    "fa-bowl-food",
    "fa-fish",
    "fa-cake-candles",
    "fa-seedling",
    "fa-leaf",
    "fa-mug-hot",
    "fa-utensils",
    "fa-pizza-slice",
    "fa-burger",
    "fa-cheese",
    "fa-ice-cream",
    "fa-wheat-awn",
  ];
  let allCate = [];
  for (let i = 0; i < categories.length; i++) {
    allCate += `
    <div
              class="category-card rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              style="background-color:${cardColors[i]} ;"
              data-category="Beef"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                  style="background-color: ${iconColors[i]};"
                >
                 <i class="fa-solid ${icons[i]}"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${categories[i].name}</h3>
                </div>
              </div>
            </div>`;
  }
  Categories.innerHTML = allCate;
  addCategoryEvents();
}
GetFood();
let areas = [];
async function GetAreas() {
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/meals/areas",
  );
  const data = await response.json();
  const filteredAreas = data.results.slice(0, 23);
  areas = filteredAreas;
  getAreaMeals(areas);
}
GetAreas();
function getAreaMeals(area) {
  let filter = document.getElementById("filter");
  let cartona = [];
  for (let i = 0; i < areas.length; i++) {
    cartona += `<button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all">
      ${areas[i].name}
    </button>`;
  }
  filter.innerHTML = cartona;
  addAreaEvents();
}
searchInput.addEventListener("input", function () {
  localStorage.setItem("search", this.value);
  searchMeals(this.value);
});
async function searchMeals(query) {
  if (!query.trim()) {
    return;
  }

  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/search?q=${query}&page=1&limit=25`,
  );

  const data = await response.json();
  disPlayRecipesarea(data.results);
}
function addAreaEvents() {
  let filter = document.getElementById("filter");
  for (let i = 0; i < filter.children.length; i++) {
    filter.children[i].addEventListener("click", function () {
      getMealsbyarea(areas[i].name);
    });
  }
}
async function getMealsbyarea(category) {
  loadingSkeleton();
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/filter?area=${category}`,
  );
  const data = await response.json();
  console.log(data.results);
  disPlayRecipesarea(data.results);
}
function disPlayRecipesarea(meals) {
  let cartona = [];
  for (let i = 0; i < meals.length; i++) {
    cartona += ` <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="52772"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src=" ${meals[i].thumbnail}"
                  alt="Teriyaki Chicken Casserole"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  ><i class="fa-solid fa-tag text-red-400"></i>
                  ${meals[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                     ${meals[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                   ${meals[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                   ${meals[i].instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                  ${meals[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                     ${meals[i].area}
                  </span>
                </div>
              </div>
            </div>`;
  }
  recipes.innerHTML = cartona;
  showDetails(meals);
}

function addCategoryEvents() {
  let cards = document.querySelectorAll(".category-card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      getMeals(categories[i].name);
    });
  }
}
let displaycat = [];
async function getMeals(category) {
  loadingSkeleton();
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/search?q=${category}`,
  );
  const data2 = await response.json();
  disPlayRecipes(data2.results);
}
function loadingSkeleton() {
  let cartona = "";

  for (let i = 0; i < 8; i++) {
    cartona += `
      <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        
        <div class="h-48 bg-gray-300"></div>

        <div class="p-4">
          <div class="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>

          <div class="flex gap-2 mb-3">
            <div class="h-5 w-20 bg-gray-200 rounded-full"></div>
            <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
          </div>

          <div class="h-3 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>

          <div class="flex justify-between">
            <div class="h-4 w-20 bg-gray-300 rounded"></div>
            <div class="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>

      </div>
    `;
  }

  recipes.innerHTML = cartona;
}
function disPlayRecipes(meals) {
  let cartona = [];
  for (let i = 0; i < meals.length; i++) {
    cartona += ` <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="52772"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src=" ${meals[i].thumbnail}"
                  alt="Teriyaki Chicken Casserole"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  ><i class="fa-solid fa-tag text-red-400"></i>
                  ${meals[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                     ${meals[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                   ${meals[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                   ${meals[i].instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                  ${meals[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                     ${meals[i].area}
                  </span>
                </div>
              </div>
            </div>`;
  }
  recipes.innerHTML = cartona;
  showDetails(meals);
}
function showDetails(meals) {
  let cards = document.querySelectorAll(".recipe-card");

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      localStorage.setItem("lastMeal", JSON.stringify(meals[i]));

      searchfilter.classList.add("hidden");
      secCategory.classList.add("hidden");
      secrecipes.classList.add("hidden");
      secDetail.classList.remove("hidden");

      getDetails(meals[i]);
      inger(meals[i]);
      instruction(meals[i]);
      youTubeVideo(meals[i]);
    });
  }
}
function getDetails(det) {
  let detailofsec = document.querySelector(".detailofsec");
  let cartona = [];
  cartona += `
  <div class="relative h-80 md:h-96">
              <img
                src="${det.thumbnail}"
                alt="${det.name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${det.category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${det.area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >Casserole</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${det.name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4  servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">485 cal/serving</span>
                  </span>
                </div>
              </div>
            </div>`;
  detailofsec.innerHTML = cartona;
}
function backmeals() {
  backMeal.addEventListener("click", function () {
    localStorage.removeItem("lastMeal");

    secDetail.classList.add("hidden");

    searchfilter.classList.remove("hidden");
    secCategory.classList.remove("hidden");
    secrecipes.classList.remove("hidden");
  });
}
backmeals();
function inger(para) {
  const gradients = document.getElementById("gradients");
  let p = para.ingredients;
  let usef = `<div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${para.ingredients.length}items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                `;
  for (let i = 0; i < p.length; i++) {
    usef += `
             <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${p[i].measure}</span>
                      ${p[i].ingredient}
                    </span>
                  </div>
                  `;
  }
  usef += `
                  </div>
                  </div>
                  `;

  gradients.innerHTML = usef;

  const ingredients = para.ingredients.map(
    (item) => `${item.measure} ${item.ingredient}`,
  );
  apical(para, ingredients);
}
let nutritionData = {};
let totals = {};

async function apical(meal, ingredients) {
  try {
    RightCal("loading");

    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "mRHgkF86KntbK8wpbNfCpbFdNKHmqPKgRQBJ7PPt",
        },
        body: JSON.stringify({
          ingredients,
        }),
      },
    );

    const data = await response.json();

    nutritionData = data.data.perServing;
    totals = data.data;

    currentMeal = meal;
    currentNutrition = nutritionData;

    RightCal(totals);
  } catch (error) {
    console.log(error);
  }
}
function RightCal(para) {
  const space = document.querySelector(".space-y-6");

  if (para === "loading") {
    const bar = (w) =>
      `<div class="animate-pulse bg-gray-200 rounded-full" style="height:10px;width:${w}"></div>`;

    space.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="fa-solid fa-chart-pie text-emerald-600"></i>
          Nutrition Facts
        </h2>

        <div class="animate-pulse bg-gray-100 rounded-xl" style="height:110px"></div>

        <div style="display:flex;flex-direction:column;gap:20px;margin-top:24px">
          ${bar("100%")}${bar("85%")}${bar("100%")}${bar("70%")}${bar("90%")}
        </div>

        <p class="text-sm text-gray-500 text-center" style="margin-top:24px">
          <i class="fa-solid fa-spinner fa-spin text-emerald-600 mr-2"></i>
          Calculating nutrition...
        </p>
      </div>`;
    return;
  }

  const cal = para.perServing;
  const caltot = para.totals;

  const pct = (value, max) => Math.min(100, Math.round((value / max) * 100));

  space.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
        Nutrition Facts
      </h2>

      <div id="nutrition-facts-container">
        <p class="text-sm text-gray-500 mb-4">Per serving</p>

        <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
          <p class="text-sm text-gray-600">Calories per serving</p>
          <p class="text-4xl font-bold text-emerald-600">${cal.calories}</p>
          <p class="text-xs text-gray-500 mt-1">Total: ${caltot.calories} cal</p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-gray-700">Protein</span>
            </div>
            <span class="font-bold text-gray-900">${cal.protein}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${pct(cal.protein, 50)}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span class="text-gray-700">Carbs</span>
            </div>
            <span class="font-bold text-gray-900">${cal.carbs}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: ${pct(cal.carbs, 250)}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-purple-500"></div>
              <span class="text-gray-700">Fat</span>
            </div>
            <span class="font-bold text-gray-900">${cal.fat}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" style="width: ${pct(cal.fat, 65)}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-orange-500"></div>
              <span class="text-gray-700">Fiber</span>
            </div>
            <span class="font-bold text-gray-900">${cal.fiber}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-orange-500 h-2 rounded-full" style="width: ${pct(cal.fiber, 28)}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-pink-500"></div>
              <span class="text-gray-700">Sugar</span>
            </div>
            <span class="font-bold text-gray-900">${cal.sugar}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-pink-500 h-2 rounded-full" style="width: ${pct(cal.sugar, 50)}%"></div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">
            Vitamins & Minerals (% Daily Value)
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Vitamin A</span>
              <span class="font-medium">15%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Vitamin C</span>
              <span class="font-medium">25%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Calcium</span>
              <span class="font-medium">4%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Iron</span>
              <span class="font-medium">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
function instruction(para) {
  const container = document.getElementById("instructions-container");
  let useful = para.instructions;

  let ins = `
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
        Instructions
      </h2>
      <div class="space-y-4">`;

  for (let i = 0; i < useful.length; i++) {
    ins += `
      <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
          ${i + 1}
        </div>
        <p class="text-gray-700 leading-relaxed pt-2">${useful[i]}</p>
      </div>`;
  }

  ins += `
      </div>
    </div>`;

  container.innerHTML = ins;
}
function youTubeVideo(para) {
  const youtube = document.querySelector(".youtube");
  const bbb = document.querySelector(".bbb");

  if (!para.youtube) {
    bbb.classList.add("hidden");
    return;
  }

  youtube.classList.remove("hidden");

  let videoId = para.youtube.split("v=")[1];
  youtube.src = `https://www.youtube.com/embed/${videoId}`;
}

modalRoot.id = "modal-root";
document.body.appendChild(modalRoot);
function escapeHTML(text) {
  return String(text === undefined || text === null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA"); // 2026-10-05
}

function round1(number) {
  return Math.round((Number(number) || 0) * 10) / 10;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed;bottom:24px;right:24px;z-index:200;background:#059669;color:#fff;padding:12px 20px;border-radius:12px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,.2)";
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 2500);
}

function closeModal() {
  modalRoot.innerHTML = "";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

function stateBox(icon, title, text) {
  return `
    <div class="text-center py-12 text-gray-500" style="grid-column:1/-1">
      <i class="fa-solid ${icon} text-4xl mb-3 text-gray-300"></i>
      <p class="font-medium text-gray-700">${title}</p>
      <p class="text-sm">${text}</p>
    </div>`;
}
const viewNames = ["meals", "products", "foodlog"];
const viewTitles = {
  meals: [
    "Meals & Recipes",
    "Discover delicious and nutritious recipes tailored for you",
  ],
  products: [
    "Product Scanner",
    "Search packaged foods and view their nutrition information",
  ],
  foodlog: ["Food Log", "Track and monitor your daily nutrition intake"],
};

function setActiveNav(view) {
  for (let i = 0; i < navLinks.length; i++) {
    const link = navLinks[i];
    const label = link.querySelector("span");
    const active = link.dataset.view === view;

    link.classList.toggle("bg-emerald-50", active);
    link.classList.toggle("text-emerald-700", active);
    link.classList.toggle("text-gray-600", !active);
    link.classList.toggle("hover:bg-gray-50", !active);
    label.classList.toggle("font-semibold", active);
    label.classList.toggle("font-medium", !active);
  }
}

function showView(view) {
  if (!viewTitles[view]) return;
  searchfilter.classList.add("hidden");
  secCategory.classList.add("hidden");
  secrecipes.classList.add("hidden");
  secDetail.classList.add("hidden");
  productsSection.classList.add("hidden");
  foodlogSection.classList.add("hidden");

  if (view === "meals") {
    const lastMeal = JSON.parse(localStorage.getItem("lastMeal"));

    if (lastMeal) {
      secDetail.classList.remove("hidden");

      getDetails(lastMeal);
      inger(lastMeal);
      instruction(lastMeal);
      youTubeVideo(lastMeal);
    } else {
      searchfilter.classList.remove("hidden");
      secCategory.classList.remove("hidden");
      secrecipes.classList.remove("hidden");
    }
  } else if (view === "products") {
    productsSection.classList.remove("hidden");
  } else if (view === "foodlog") {
    foodlogSection.classList.remove("hidden");
    renderFoodLog();
  }

  headerTitle.textContent = viewTitles[view][0];
  headerText.textContent = viewTitles[view][1];
  setActiveNav(view);
  window.scrollTo(0, 0);
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].dataset.view = viewNames[i];
  navLinks[i].addEventListener("click", function (e) {
    e.preventDefault();
    showView(navLinks[i].dataset.view);
  });
}
let currentMeal = null;
let currentNutrition = null;
logMeal.addEventListener("click", function () {
  if (!currentMeal) return;
  if (!currentNutrition) {
    showToast("Nutrition data is still loading...");
    return;
  }
  openLogModal({
    type: "meal",
    name: currentMeal.name,
    image: currentMeal.thumbnail,
    subtitle: currentMeal.category + " • " + currentMeal.area,
    nutrition: currentNutrition,
    unit: "serving",
  });
});

function openLogModal(item) {
  let servings = 1;
  const n = item.nutrition;
  const isProduct = item.unit === "100g";
  const title = item.type === "product" ? "Log This Product" : "Log This Meal";
  const image = item.image
    ? `<img src="${escapeHTML(item.image)}" class="w-16 h-16 rounded-xl object-cover" alt="" onerror="this.style.display='none'" />`
    : "";

  modalRoot.innerHTML = `
    <div id="modal-backdrop" class="fixed inset-0 bg-black/50 flex items-center justify-center" style="z-index:150">
      <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl" style="max-height:90vh;overflow-y:auto">

        <div class="flex items-center gap-4 mb-6">
          ${image}
          <div style="min-width:0">
            <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
            <p class="text-gray-500">${escapeHTML(item.name)}</p>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold text-gray-700 mb-3">
            ${isProduct ? "Number of Servings (100g each)" : "Number of Servings"}
          </h3>
          <div class="flex items-center gap-3">
            <button id="modal-minus" class="w-12 h-12 rounded-xl bg-gray-100 text-xl font-bold">-</button>
            <input id="modal-servings" type="text" value="1" class="w-20 h-12 border rounded-xl text-center font-bold text-xl" />
            <button id="modal-plus" class="w-12 h-12 rounded-xl bg-gray-100 text-xl font-bold">+</button>
          </div>
        </div>

        <div class="bg-emerald-50 rounded-2xl p-5 mb-6">
          <p class="text-gray-500 mb-4">Estimated nutrition:</p>
          <div class="grid grid-cols-4 text-center">
            <div>
              <h4 id="modal-cal" class="text-emerald-500 text-2xl font-bold">0</h4>
              <p class="text-xs text-gray-500">Calories</p>
            </div>
            <div>
              <h4 id="modal-protein" class="text-blue-500 text-2xl font-bold">0g</h4>
              <p class="text-xs text-gray-500">Protein</p>
            </div>
            <div>
              <h4 id="modal-carbs" class="text-orange-500 text-2xl font-bold">0g</h4>
              <p class="text-xs text-gray-500">Carbs</p>
            </div>
            <div>
              <h4 id="modal-fat" class="text-purple-500 text-2xl font-bold">0g</h4>
              <p class="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button id="modal-cancel" class="bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-semibold">
            Cancel
          </button>
          <button id="modal-save" class="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
            <i class="fa-solid fa-floppy-disk"></i>
            Log Meal
          </button>
        </div>
      </div>
    </div>`;

  const backdrop = document.getElementById("modal-backdrop");
  const input = document.getElementById("modal-servings");

  function updateNumbers() {
    document.getElementById("modal-cal").textContent = Math.round(
      n.calories * servings,
    );
    document.getElementById("modal-protein").textContent =
      round1(n.protein * servings) + "g";
    document.getElementById("modal-carbs").textContent =
      round1(n.carbs * servings) + "g";
    document.getElementById("modal-fat").textContent =
      round1(n.fat * servings) + "g";
  }
  updateNumbers();

  document.getElementById("modal-minus").addEventListener("click", function () {
    servings = Math.max(0.5, servings - 0.5);
    input.value = servings;
    updateNumbers();
  });
  document.getElementById("modal-plus").addEventListener("click", function () {
    servings += 0.5;
    input.value = servings;
    updateNumbers();
  });
  input.addEventListener("input", function () {
    const value = parseFloat(input.value);
    if (value > 0) {
      servings = value;
      updateNumbers();
    }
  });

  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.getElementById("modal-save").addEventListener("click", function () {
    if (!(servings > 0)) {
      showToast("Enter a valid number of servings");
      return;
    }

    addToFoodLog(item, servings);

    modalRoot.innerHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div class="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-xl">

        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <i class="fa-solid fa-check text-5xl text-green-500"></i>
        </div>

        <h2 class="text-3xl font-bold text-gray-800 mb-3">
          Meal Logged!
        </h2>

        <p class="text-gray-500 mb-3">
          ${item.name} has been added to your daily log.
        </p>

        <p class="text-emerald-500 text-2xl font-bold">
          +${Math.round(item.nutrition.calories * servings)} Calories
        </p>

      </div>

    </div>
  `;

    setTimeout(function () {
      closeModal();
    }, 2000);
  });
}
const PRODUCTS_API = "https://nutriplan-api.vercel.app/api/products";
const gradeColors = {
  a: "#22c55e",
  b: "#84cc16",
  c: "#eab308",
  d: "#f97316",
  e: "#ef4444",
};
const novaColors = { 1: "#22c55e", 2: "#84cc16", 3: "#f97316", 4: "#ef4444" };

let productsList = [];
let currentGrade = "";
let productsRequest = 0;
function normalizeProduct(p) {
  const n = p.nutrients || p.nutriments || p.nutrition || {};

  function pick() {
    for (let i = 0; i < arguments.length; i++) {
      const value = arguments[i];
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !isNaN(Number(value))
      ) {
        return Number(value);
      }
    }
    return 0;
  }

  let rawGrade =
    p.nutritionGrade ||
    p.nutriscore ||
    p.nutriscore_grade ||
    p.nutrition_grade ||
    "";
  if (typeof rawGrade === "object") rawGrade = rawGrade.grade || "";

  return {
    barcode: p.barcode || p.code || p.id || "",
    name: p.name || p.product_name || "Unknown product",
    brand: p.brand || p.brands || "",
    image: p.image || p.thumbnail || p.image_url || p.image_front_url || "",
    quantity: p.quantity || p.size || "",
    grade: String(rawGrade).toLowerCase(),
    nova: Number(p.novaGroup || p.nova || p.nova_group) || 0,
    calories: pick(
      n.calories,
      n.energy_kcal,
      n["energy-kcal_100g"],
      p.calories,
    ),
    protein: pick(n.protein, n.proteins, n.proteins_100g, p.protein),
    carbs: pick(n.carbs, n.carbohydrates, n.carbohydrates_100g, p.carbs),
    fat: pick(n.fat, n.fat_100g, p.fat),
    sugar: pick(n.sugar, n.sugars, n.sugars_100g, p.sugar),
  };
}
function extractResults(data) {
  if (Array.isArray(data.results)) return data.results;
  const single = data.result || data.product || data.data;
  if (Array.isArray(single)) return single;
  if (single) return [single];
  return [];
}

function loadingProducts() {
  let cartona = "";
  for (let i = 0; i < 8; i++) {
    cartona += `
      <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div class="h-40 bg-gray-300"></div>
        <div class="p-4">
          <div class="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div class="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="grid grid-cols-4 gap-1">
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>`;
  }
  productsGrid.innerHTML = cartona;
  productsCount.textContent = "Loading...";
}

async function fetchProducts(url) {
  const myRequest = ++productsRequest;
  loadingProducts();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed: " + response.status);
    const data = await response.json();
    if (myRequest !== productsRequest) return;

    console.log(data);
    const results = extractResults(data);
    productsList = [];
    for (let i = 0; i < results.length; i++) {
      productsList.push(normalizeProduct(results[i]));
    }
    displayProducts();
  } catch (error) {
    console.log(error);
    if (myRequest !== productsRequest) return;
    productsList = [];
    productsGrid.innerHTML = stateBox(
      "fa-triangle-exclamation",
      "Couldn't load products",
      "Please check the search and try again",
    );
    productsCount.textContent = "Something went wrong";
  }
}

function displayProducts() {
  let list = [];
  for (let i = 0; i < productsList.length; i++) {
    if (!currentGrade || productsList[i].grade === currentGrade) {
      list.push(productsList[i]);
    }
  }

  if (list.length === 0) {
    productsGrid.innerHTML = stateBox(
      "fa-box-open",
      "No products found",
      currentGrade
        ? "Try a different Nutri-Score filter"
        : "Try another search",
    );
    productsCount.textContent = "No products found";
    return;
  }

  let cartona = "";
  for (let i = 0; i < list.length; i++) {
    const p = list[i];

    const gradeBadge =
      p.grade && gradeColors[p.grade]
        ? `<div class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded uppercase" style="background-color:${gradeColors[p.grade]}">Nutri-Score ${p.grade}</div>`
        : "";
    const novaBadge =
      p.nova && novaColors[p.nova]
        ? `<div class="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${p.nova}" style="background-color:${novaColors[p.nova]}">${p.nova}</div>`
        : "";
    const image = p.image
      ? `<img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.style.display='none'" />`
      : `<i class="fa-solid fa-image text-4xl text-gray-300"></i>`;
    const quantity = p.quantity
      ? `<span><i class="fa-solid fa-weight-scale mr-1"></i>${escapeHTML(p.quantity)}</span>`
      : "";

    cartona += `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          ${image}
          ${gradeBadge}
          ${novaBadge}
        </div>

        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${escapeHTML(p.brand) || "&nbsp;"}</p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${escapeHTML(p.name)}</h3>

          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            ${quantity}
            <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(p.calories)} kcal/100g</span>
          </div>

          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-xs font-bold text-emerald-700">${round1(p.protein)}g</p>
              <p class="text-[10px] text-gray-500">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-xs font-bold text-blue-700">${round1(p.carbs)}g</p>
              <p class="text-[10px] text-gray-500">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
              <p class="text-xs font-bold text-purple-700">${round1(p.fat)}g</p>
              <p class="text-[10px] text-gray-500">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-xs font-bold text-orange-700">${round1(p.sugar)}g</p>
              <p class="text-[10px] text-gray-500">Sugar</p>
            </div>
          </div>
        </div>
      </div>`;
  }
  productsGrid.innerHTML = cartona;
  productsCount.textContent = "Showing " + list.length + " products";

  const cards = productsGrid.querySelectorAll(".product-card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      openProductModal(list[i]);
    });
  }
}

function openProductModal(p) {
  const parts = [];
  if (p.brand) parts.push(p.brand);
  if (p.grade) parts.push("Nutri-Score " + p.grade.toUpperCase());
  openLogModal({
    type: "product",
    name: p.name,
    image: p.image,
    subtitle: parts.join(" • "),
    nutrition: {
      calories: p.calories,
      protein: p.protein,
      carbs: p.carbs,
      fat: p.fat,
    },
    unit: "100g",
  });
}
function searchProducts() {
  const query = productSearchInput.value.trim();
  if (!query) return;
  fetchProducts(
    PRODUCTS_API +
      "/search?q=" +
      encodeURIComponent(query) +
      "&page=1&limit=24",
  );
}
searchProductBtn.addEventListener("click", searchProducts);
productSearchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") searchProducts();
});

function lookupBarcode() {
  const code = barcodeInput.value.trim();
  if (!/^\d{8,14}$/.test(code)) {
    showToast("Enter a valid barcode (8 to 14 digits)");
    return;
  }
  fetchProducts(PRODUCTS_API + "/barcode/" + encodeURIComponent(code));
}
lookupBarcodeBtn.addEventListener("click", lookupBarcode);
barcodeInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") lookupBarcode();
});

for (let i = 0; i < productCategoryBtns.length; i++) {
  productCategoryBtns[i].addEventListener("click", function () {
    const name = productCategoryBtns[i].textContent.trim().toLowerCase();
    fetchProducts(PRODUCTS_API + "/category/" + encodeURIComponent(name));
  });
}

function markActiveGrade() {
  for (let i = 0; i < gradeButtons.length; i++) {
    const active = gradeButtons[i].dataset.grade === currentGrade;
    gradeButtons[i].style.opacity = active ? "1" : "0.55";
    gradeButtons[i].style.boxShadow = active ? "0 0 0 2px #059669" : "none";
  }
}
for (let i = 0; i < gradeButtons.length; i++) {
  gradeButtons[i].addEventListener("click", function () {
    currentGrade = gradeButtons[i].dataset.grade;
    markActiveGrade();
    displayProducts();
  });
}
markActiveGrade();

productsGrid.innerHTML = stateBox(
  "fa-magnifying-glass",
  "Search for products",
  "Try a product name, a barcode, or pick a category",
);
const goals = { calories: 2000, protein: 50, carbs: 250, fat: 65 };
const goalCards = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    bg: "bg-blue-50",
    bar: "bg-blue-500",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    bg: "bg-amber-50",
    bar: "bg-amber-500",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    bg: "bg-purple-50",
    bar: "bg-purple-500",
  },
];

function getFoodLog() {
  try {
    return JSON.parse(localStorage.getItem("foodLog")) || [];
  } catch (error) {
    return [];
  }
}

function saveFoodLog(log) {
  localStorage.setItem("foodLog", JSON.stringify(log));
}

function addToFoodLog(item, servings) {
  const log = getFoodLog();
  log.push({
    id: Date.now(),
    date: todayKey(),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: item.type,
    name: item.name,
    image: item.image || "",
    unit: item.unit,
    servings: servings,
    calories: round1(item.nutrition.calories * servings),
    protein: round1(item.nutrition.protein * servings),
    carbs: round1(item.nutrition.carbs * servings),
    fat: round1(item.nutrition.fat * servings),
  });
  saveFoodLog(log);
  showToast("Added to your food log");
  if (!foodlogSection.classList.contains("hidden")) renderFoodLog();
}

function removeLogItem(id) {
  const log = getFoodLog();
  const newLog = [];
  for (let i = 0; i < log.length; i++) {
    if (log[i].id !== id) newLog.push(log[i]);
  }
  saveFoodLog(newLog);
  renderFoodLog();
}

function renderFoodLog() {
  const log = getFoodLog();
  const today = todayKey();

  const todayItems = [];
  const sum = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (let i = 0; i < log.length; i++) {
    if (log[i].date === today) {
      todayItems.push(log[i]);
      sum.calories += log[i].calories;
      sum.protein += log[i].protein;
      sum.carbs += log[i].carbs;
      sum.fat += log[i].fat;
    }
  }

  foodlogDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  let progress = "";
  for (let i = 0; i < goalCards.length; i++) {
    const g = goalCards[i];
    const value = sum[g.key];
    const pct = Math.min(100, Math.round((value / goals[g.key]) * 100));
    const over = value > goals[g.key];
    progress += `
      <div class="${g.bg} rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">${g.label}</span>
          <span class="text-sm text-gray-500">${Math.round(value)} / ${goals[g.key]} ${g.unit}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="${g.bar} h-2.5 rounded-full" style="width:${pct}%;${over ? "background-color:#ef4444" : ""}"></div>
        </div>
      </div>`;
  }
  foodlogProgress.innerHTML = progress;
  loggedCount.textContent = "Logged Items (" + todayItems.length + ")";
  clearFoodlog.style.display = todayItems.length ? "" : "none";

  if (todayItems.length === 0) {
    loggedList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page or scan products</p>
      </div>`;
  } else {
    let list = "";
    for (let i = 0; i < todayItems.length; i++) {
      const item = todayItems[i];
      const icon =
        item.type === "product"
          ? "fa-barcode"
          : item.type === "custom"
            ? "fa-pencil"
            : "fa-utensils";
      const image = item.image
        ? `<img src="${escapeHTML(item.image)}" class="w-12 h-12 rounded-lg object-cover" alt="" onerror="this.style.display='none'" />`
        : `<div class="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center"><i class="fa-solid ${icon} text-gray-400"></i></div>`;
      const amount =
        item.unit === "100g"
          ? item.servings * 100 + "g"
          : item.servings + (item.servings === 1 ? " serving" : " servings");

      list += `
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          ${image}
          <div class="flex-1" style="min-width:0">
            <p class="font-semibold text-gray-900 truncate">${escapeHTML(item.name)}</p>
            <p class="text-xs text-gray-500">${amount} • ${item.time}</p>
          </div>
          <div class="flex items-center gap-3 text-xs font-semibold">
            <span class="text-emerald-600">${Math.round(item.calories)} kcal</span>
            <span class="text-blue-600">${item.protein}g P</span>
            <span class="text-amber-600">${item.carbs}g C</span>
            <span class="text-purple-600">${item.fat}g F</span>
          </div>
          <button class="delete-log-btn text-red-500 hover:text-red-600" data-id="${item.id}" title="Remove">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>`;
    }
    loggedList.innerHTML = list;

    const delBtns = loggedList.querySelectorAll(".delete-log-btn");
    for (let i = 0; i < delBtns.length; i++) {
      delBtns[i].addEventListener("click", function () {
        removeLogItem(Number(delBtns[i].dataset.id));
      });
    }
  }

  renderWeeklyChart(log);
}

clearFoodlog.addEventListener("click", function () {
  if (!confirm("Remove all items logged today?")) return;
  const today = todayKey();
  const log = getFoodLog();
  const newLog = [];
  for (let i = 0; i < log.length; i++) {
    if (log[i].date !== today) newLog.push(log[i]);
  }
  saveFoodLog(newLog);
  renderFoodLog();
});

function renderWeeklyChart(log) {
  const labels = [];
  const calories = [];

  for (let d = 6; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const key = date.toLocaleDateString("en-CA");

    let total = 0;
    for (let i = 0; i < log.length; i++) {
      if (log[i].date === key) total += log[i].calories;
    }
    labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
    calories.push(Math.round(total));
  }

  let hasData = false;
  for (let i = 0; i < calories.length; i++) {
    if (calories[i] > 0) hasData = true;
  }

  if (typeof Plotly !== "undefined") Plotly.purge(weeklyChart);

  if (!hasData || typeof Plotly === "undefined") {
    weeklyChart.style.display = "";
    weeklyChart.innerHTML = `
      <div class="text-center text-gray-400">
        <i class="fa-solid fa-chart-line text-4xl mb-2"></i>
        <p>Weekly nutrition chart will appear here</p>
      </div>`;
    return;
  }

  weeklyChart.innerHTML = "";
  weeklyChart.style.display = "block";

  const bars = {
    x: labels,
    y: calories,
    type: "bar",
    name: "Calories",
    marker: { color: "#10b981" },
  };
  const goalLine = {
    x: labels,
    y: labels.map(function () {
      return goals.calories;
    }),
    type: "scatter",
    mode: "lines",
    name: "Goal",
    line: { color: "#6366f1", dash: "dash", width: 2 },
  };

  Plotly.newPlot(
    weeklyChart,
    [bars, goalLine],
    {
      height: 256,
      margin: { t: 20, r: 20, b: 40, l: 50 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: { title: "kcal" },
      legend: { orientation: "h", y: -0.2 },
    },
    { displayModeBar: false, responsive: true },
  );
}

function openCustomEntryModal() {
  modalRoot.innerHTML = `
    <div id="modal-backdrop" class="fixed inset-0 bg-black/50 flex items-center justify-center" style="z-index:150">
      <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl" style="max-height:90vh;overflow-y:auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-1">Custom Entry</h2>
        <p class="text-gray-500 mb-5">Add a food that isn't in the recipes or products</p>

        <label class="font-semibold text-gray-700 text-sm">Food name</label>
        <input id="custom-name" type="text" placeholder="e.g. Homemade koshari" class="w-full h-12 border rounded-xl px-4 mt-1 mb-4" />

        <div class="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label class="font-semibold text-gray-700 text-sm">Calories (kcal)</label>
            <input id="custom-cal" type="number" min="0" placeholder="0" class="w-full h-12 border rounded-xl px-4 mt-1" />
          </div>
          <div>
            <label class="font-semibold text-gray-700 text-sm">Protein (g)</label>
            <input id="custom-protein" type="number" min="0" placeholder="0" class="w-full h-12 border rounded-xl px-4 mt-1" />
          </div>
          <div>
            <label class="font-semibold text-gray-700 text-sm">Carbs (g)</label>
            <input id="custom-carbs" type="number" min="0" placeholder="0" class="w-full h-12 border rounded-xl px-4 mt-1" />
          </div>
          <div>
            <label class="font-semibold text-gray-700 text-sm">Fat (g)</label>
            <input id="custom-fat" type="number" min="0" placeholder="0" class="w-full h-12 border rounded-xl px-4 mt-1" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button id="modal-cancel" class="bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-semibold">Cancel</button>
          <button id="modal-save" class="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">Add to Log</button>
        </div>
      </div>
    </div>`;

  const backdrop = document.getElementById("modal-backdrop");
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.getElementById("modal-save").addEventListener("click", function () {
    const name = document.getElementById("custom-name").value.trim();
    const cal = Number(document.getElementById("custom-cal").value);
    if (
      !name ||
      !(cal >= 0) ||
      document.getElementById("custom-cal").value === ""
    ) {
      showToast("Please enter a name and calories");
      return;
    }
    addToFoodLog(
      {
        type: "custom",
        name: name,
        image: "",
        unit: "serving",
        nutrition: {
          calories: cal,
          protein: Number(document.getElementById("custom-protein").value) || 0,
          carbs: Number(document.getElementById("custom-carbs").value) || 0,
          fat: Number(document.getElementById("custom-fat").value) || 0,
        },
      },
      1,
    );
    closeModal();
  });
}

if (quickBtns.length >= 3) {
  quickBtns[0].addEventListener("click", function () {
    showView("meals");
  });
  quickBtns[1].addEventListener("click", function () {
    showView("products");
  });
  quickBtns[2].addEventListener("click", openCustomEntryModal);
}

function showNutritionError() {
  const space = document.querySelector(".space-y-6");
  space.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg p-6 text-center">
      <i class="fa-solid fa-triangle-exclamation text-orange-500 text-3xl mb-3"></i>
      <p class="text-gray-700 font-medium">Couldn't load nutrition data</p>
      <p class="text-sm text-gray-500">Please try again later</p>
    </div>`;
}
