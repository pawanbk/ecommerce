// variables
const cartItems = document.querySelector(".cart-items") // total items in cart
const cartTotal = document.querySelector(".cart-total") //total sum of cart 

const cartContent = document.querySelector(".cart-content")
const cartOverlay = document.querySelector(".cart-overlay")

const clearCart = document.querySelector(".clear-cart")

// buttons
let addToCartBtns;
//cart array
let cart;
//product content container
const productContainer = document.querySelector(".product-content")

class UI{

    constructor(){
        this.cart = new Cart()
    }
    showCart(){
        cartOverlay.classList.add('visibility')
        cartDOM.classList.add('showCart')
    }
    hideCart(){
        cartOverlay.classList.remove('visibility')
        cartDOM.classList.remove('showCart')
    }
    addCartItem(cartItem){
        let div = document.createElement("div")
        div.classList.add("cart-item")
        div.innerHTML = `
                        <img src=${cartItem.image} alt="product">
                        <div>
                            <h4>${cartItem.title}</h4>
                            <h5>$${cartItem.price}</h5>
                            <span class="remove" data-id=${cartItem.id}>remove</span>
                        </div>
                        <div>
                            <i class="fa fa-caret-up"></i>
                            <p class="quantity">${cartItem.amount}</p>
                            <i class="fa fa-caret-down"></i>
                        </div>
                    `
        cartContent.appendChild(div)

    }
    populateCart(){
        const cartItems = Storage.getCartItems()
        cartItems.forEach(cartItem => this.addCartItem(cartItem))
    }

    displayProducts(products){
        let result = "";
        products.forEach(product=>{
            result += `
            <!--single-product-->
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="product" class="product-img" />
                        <button class="add-to-cart" data-id=${product.id}>
                            <i class="fa fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article>
            <!--end-single-product-->`
        })
        productContainer.innerHTML = result

    }

    addToCartBtns(){
        addToCartBtns = [...document.querySelectorAll(".add-to-cart")]
        addToCartBtns.forEach(button=>{
            let id = button.dataset.id
            let inCart = cart.find(item => item.id == id)
            if(inCart){
                button.innerText = "In Cart"
                button.disabled = true
            } 
            button.addEventListener("click", event => {
                button.innerText = "In Cart"
                button.disabled = true
                // get product from localstorage
                let cartItem = Storage.getProduct(id)

                // add amount in item
                cartItem = {...cartItem, "amount":1}

                // updating cart array
                cart = [...cart, cartItem]

                //adding to cart
                this.cart.addToCart(cart)

                // setting cart values
                this.setCartValues(cart)
            })
            
        })
        
    }

    setCartValues(){
        cartItems.innerHTML = this.cart.getTotalItems()
        cartTotal.innerHTML = `<h3>Your Total : $${this.cart.getCartTotal()}</h3>`
    }

    cartDOMManipulate(){
        const cartItemsDOM = document.querySelector(".cart-item")
        // cartItemsDOM.children[2].addEventListener("click",(e)=>{
        //     console.log(e.target.className)
        //     // switch(e.target.className){
        //     //     case 'remove':
        //     //         //todo
        //     //         break
        //     //     case 'asa':
        //     //     break
        //     // }
            
        // })
    }

    cartLogic(){
        //clearCart 
        clearCart.addEventListener("click",()=>{
            this.cart.clearCart()
        })
    }
    getSingleButton(id){
        return addToCartBtns.find(button => button.dataset.id === id)
    }

    load(){
        this.addToCartBtns()
        this.setCartValues()
        showCartBtn.addEventListener("click", this.showCart)
        hideCartBtn.addEventListener("click",this.hideCart)
        this.populateCart()
        this.cartLogic()
        this.cartDOMManipulate()
    }
}
class Products{
    async getProducts(){
        let data = await fetch("products.json")
        let result = await data.json()
        return result.items
    }
}
class Cart{
    addToCart(cart){
        //adding to localstorage
        Storage.saveCart(cart)
    }
    getTotalItems(){
        let totalItems = 0
        cart.forEach(item =>{
            totalItems += item.amount
        })
        return totalItems;
    }
    getCartTotal(){
        let total = 0;
        cart.forEach(item=>{
            total += item.amount * item.price
        })
        return total.toFixed(2)
    }
    clearCart(){
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))
    }

    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        
    }
    
}
class Storage{
    static addProducts(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products;
        if(localStorage.getItem("products")){
            products = JSON.parse(localStorage.getItem("products"))
        }
        return products.find(item => item.id == id)
    }
    static saveCart(cart){
        localStorage.setItem("carts", JSON.stringify(cart))
    }
    static getCartItems(){
        return JSON.parse(localStorage.getItem("carts"))
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    cart = localStorage.getItem("carts") ? JSON.parse(localStorage.getItem("carts")) : []
    const ui = new UI()
    const product = new Products()
    product.getProducts().then(products=>{
        ui.displayProducts(products)
        Storage.addProducts(products)
    }).then(()=>{
       ui.load()
    })
})

