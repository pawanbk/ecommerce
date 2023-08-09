export default class Product{
    static async getAll(){
        try{
            let products = await fetch("products.json")
            let data = await products.json()
            // storing products in localStorage
            localStorage.setItem("products", JSON.stringify(data.items))
            return data.items
        } catch(error){
            console.log(error)
        }
       
    }
}