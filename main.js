import Product from "./Product.js";
import UI from "./UI.js";

document.addEventListener("DOMContentLoaded", function(){
    const ui = new UI()
    Product.getAll().then(products=>{
        ui.load(products)
    })
})

