const productContainer = document.getElementById("productContainer")
const searchInput = document.getElementById("searchInput")
const loading = document.getElementById("loading")
const error = document.getElementById("error")
const pagination= document.getElementById("pagination")

let currentPage =1;
let totalProduct =0;
let product_per_page =8;

const Api_URl = "https://fakestoreapi.noksha.dev/api/products";

let products = [];

const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));
// get Product
const getProducts = async (page = 1) => {
    try {
        await delay(3000);
        const skip= (page-1)*product_per_page;
        const response = await fetch(`${Api_URl}?limit=${product_per_page}&skip=${skip}`)   
        if (!response.ok) {
            throw new Error("Api error")
        }
        const data = await response.json()
        console.log(data)
        displayProducts(data.data)
        products=data.data
          totalProduct = data.total
        currentPage=page;
        createPagination()
    }
    catch (err) {
        error.innerText = "Failed To fetch"
    }
    finally {
        loading.style.display = "none"
    }
}
getProducts()

function createPagination(){
    pagination.innerHTML="";
    const totalPage= Math.ceil(totalProduct/product_per_page)

    const previousButton = document.createElement("button")
    previousButton.innerText="<="
    previousButton.disabled=currentPage==1;

    previousButton.addEventListener("click",function(){
        getProducts(currentPage-1)
    })

    pagination.appendChild(previousButton)

    for(let page=1;page<=totalPage;page++){
         const button = document.createElement("button")
         button.textContent=page
            button.disabled = page === currentPage
            button.addEventListener("click",function(){
                getProducts(page)
            })
           pagination.appendChild(button)

    }


}

const displayProducts = (data) => {
    productContainer.innerHTML = ""
    if (data.length == 0) {
        productContainer.innerHTML = `
        <h2>No product Found</h2>
        `
        return
    }

    data.forEach((element => {
        console.log(element)
        const card = document.createElement("div")
        card.classList.add("product")

        card.innerHTML = `
        <img src=${element.image}>
        <span class="category">
        ${element.category}
        </span>
        <h2>${element.title}</h2>
        <div class="price_rating">
                <div class="price">
                    $${element.price}
                </div>
                <div class="rating">
                    ⭐${element.rating}
                </div>
        </div>

        `
        productContainer.appendChild(card)

    }));
}


searchInput.addEventListener("input",function(){
    const searchText = searchInput.value.toLowerCase().trim();
    console.log(products)

    const filterItems = products.filter(function(element){
        return element.category.toLowerCase().startsWith(searchText) ||  element.title.toLowerCase().startsWith(searchText)

    })
    console.log(filterItems)
    displayProducts(filterItems)



})