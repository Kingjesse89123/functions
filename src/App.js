
import './App.css';


import {useEffect, useState} from 'react';

export default function App() {

    function getDatesInRange(startDate, endDate) {
        let date = new Date(startDate).getTime()
        const dates = [];
        while (date <= new Date(endDate).getTime()) {
            let month = new Date(date).getUTCMonth() + 1; //months from 1-12
            let day = new Date(date).getUTCDate();
            let year = new Date(date).getUTCFullYear();
            dates.push(month + '/' + day + "/" + year);
            date += 86400000;
        }

        return dates;
    }

    let time = '18052'
    let restId = 'db464e8e-7b1f-45f3-aa13-6791f94d7b9f'
    let startDate = '2022-12-18T12:00:00-08:00'
    let endDate = '2023-12-25T12:00:00-08:00'
    const [orders, setOrders] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/orders?filter[_and][0][date_created][_between][0]=${startDate}&filter[_and][0][date_created][_between][1]=${endDate}&filter[restaurant][id][_eq]=${restId}&fields=*.*`)
            .then(response => response.json())
            .then(res => {
                setOrders(res)
            })
            .catch(error => console.log(error));
    }, [])
    const [products, setProducts] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/orders?filter[restaurant][id][_eq]=${restId}&fields[]=line_items.products.name,id&fields[]=date_created&sort[]=-date_created`)
            .then(response => response.json())
            .then(res => {
                setProducts(res)
            })
            .catch(error => console.log(error));
    }, [])
    const [ingredients, setIngredients] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/orders?filter[restaurant][id][_eq]=${restId}&fields[]=date_created&fields[]=line_items.ingredients_on_product.ingredients_id.name&fields[]=line_items.selections_on_product.ingredient_id.name&fields[]=line_items.ingredients_on_product.amount&fields[]=line_items.selections_on_product.selections_id.name&sort[]=-date_created`)
            .then(response => response.json())
            .then(res => {
                setIngredients(res)
            })
            .catch(error => console.log(error));
    }, [])

    function getProducts(orders) {
        let productsArray = []
        let dateI = 0
        if (orders !== undefined) {
            if(products!==undefined){
                for (let i = 0; i < orders.length; i++) {
                    dateI = orders[i].date_created
                    for (let i2 = 0; i2 < orders[i].line_items.length; i2++) {
                        productsArray.push({
                            product: orders[i].line_items[i2].products.name,
                            dateOrdered: dateI
                        })
                    }
                }
            }
        }
        return productsArray
    }

    function getProductChart(products) {
            let chartData = [
                {
                    name: products[0]?.product,
                    count: 0
                }
            ]
            let bool = true
            for (let i = 0; i < products.length; i++) {
                bool = true
                for (let i2 = 0; i2 < chartData.length; i2++) {
                    if (products[i].product === chartData[i2].name) {
                        chartData[i2].count += 1
                        bool = false
                    }

                }
                if (bool === true) {
                    chartData.push({
                        name: products[i].product,
                        count: 0
                    })
                }
            }

            return chartData

    }
    function getIngredients(orders) {
        let datei
        let ingredients = []
        let selections =[]
        let allingredients = []
        if(orders !==undefined){
            for (let i = 0; i < orders.length; i++) {
                datei = orders[i].date_created
                for (let i2 = 0; i2 < orders[i].line_items.length; i2++) {
                    selections = []
                    ingredients = []
                    for (let i3 = 0; i3 < orders[i].line_items[i2].ingredients_on_product.length; i3++) {
                        if(orders[i].line_items[i2].ingredients_on_product[i3].ingredients_id.name){
                            ingredients.push({
                                name: orders[i].line_items[i2].ingredients_on_product[i3].ingredients_id.name,
                                amount: orders[i].line_items[i2].ingredients_on_product[i3].amount,
                                date: datei
                            })
                        }
                    }
                    for (let i3 = 0; i3 < orders[i].line_items[i2].selections_on_product.length; i3++) {
                        if(orders[i].line_items[i2].selections_on_product[i3].ingredient_id){
                            selections.push({
                                selection: orders[i].line_items[i2].selections_on_product[i3].selections_id.name,
                                choice: orders[i].line_items[i2].selections_on_product[i3].ingredient_id.name,
                                date: datei
                            })
                        }
                    }
                    if(selections.length > 1||ingredients.length>1){
                        allingredients.push({
                            selections: selections,
                            ingredients: ingredients
                        })
                    }
                }
            }
        }
        return allingredients
    }

    const [data2, setData2] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/users`)
            .then(response => response.json())
            .then(res => {
                setData2(res)
            })
            .catch(error => console.log(error));
    }, [])


    function getCustomer(customers, currentCustomer) {
        if (customers !== undefined) {
            for (let i = 0; i < customers.length; i++) {
                if (customers[i].email === currentCustomer.email) {
                    return {
                        customer: customers[i].id
                    }
                }
            }
        }
        return {
            "first_name": currentCustomer.fname,
            "last_name": currentCustomer.lname,
            "email": currentCustomer.email,
            "role": "1cc19275-896f-4944-94da-4139d0e6381a",
            "email_notifications": true,
            "phone": currentCustomer.phone,
            "zip_code": currentCustomer.zip
        }
    }

    let currentCustomer = {
        fname: 'Jerry',
        lname: "perry",
        email: 'Jesse@blueplate.ai',
        phone: "8054401373",
        zip: '93401'
    }

    function getTodaysDateAtTimews(todaystime) {
        let hour = todaystime.slice(0, 2)
        let min = todaystime.slice(3, 5)
        let date = new Date()
        let month = new Date(date).getUTCMonth()
        let day = new Date(date).getUTCDate() - 1
        let year = new Date(date).getUTCFullYear()
        return new Date(year, month, day, hour, min).getTime()
    }

    function validateCart(cartItems, newProducts, newIngredients) {
        let currentTime = new Date().getTime()
        let cartItemsConflicts = {
            bool: 'bool',
            conflicts: []
        }
        let bool = true
        let booli = true
        if (newProducts !== undefined) {
            for (let i = 0; i < cartItems.length; i++) {
                booli = false
                for (let i2 = 0; i2 < newProducts.length; i2++) {
                    booli = false
                    if (cartItems[i].id === newProducts[i2].id) {
                        for (let i5 = 0; i5 < newProducts[i2].avaliable_days.length; i5++) {
                            if (newProducts[i2].avaliable_days[i5] === new Date().toLocaleString('en-us', {weekday: 'long'})) {
                                booli = true
                            }
                            if ("Daily" === newProducts[i2].avaliable_days[i5]) {
                                booli = true
                            }
                            if (booli !== true) {
                                if (i5 + 1 === newProducts[i2].avaliable_days.length) {
                                    cartItemsConflicts.conflicts.push({
                                        cartItem: cartItems[i],
                                        why: "This Item is not available on this day"
                                    })
                                    bool = false
                                    break
                                }
                            }
                        }
                        if (newProducts[i2].category.start_time !== null) {
                            if (getTodaysDateAtTimews(newProducts[i2].category.start_time) >= currentTime || getTodaysDateAtTimews(newProducts[i2].category.end_time) <= currentTime) {
                                cartItemsConflicts.conflicts.push({
                                    cartItem: cartItems[i],
                                    why: "This Item is not available at this time"
                                })
                                bool = false
                                break
                            }
                        }
                        if (newProducts[i2].instock === false) {
                            cartItemsConflicts.conflicts.push({
                                cartItem: cartItems[i],
                                why: "This Item is not in stock at this time"
                            })
                            bool = false
                            break
                        }

                        if (cartItems[i].price !== newProducts[i2].price) {
                            cartItems[i].price = newProducts[i2].price
                        }
                        if (newIngredients !== undefined) {
                            for (let i3 = 0; i3 < cartItems[i].ingredientChoice.length; i3++) {
                                for (let i4 = 0; i4 < newIngredients.length; i4++) {
                                    if (cartItems[i].ingredientChoice[i3].id === newIngredients[i4].id) {
                                        if (cartItems[i].ingredientChoice[i3].selection !== 0) {
                                            if (newIngredients[i4].instock === false) {
                                                cartItemsConflicts.conflicts.push({
                                                    cartItem: cartItems[i].ingredientChoice[i3],
                                                    why: 'The ingredient you selected is out of stock'
                                                })
                                                bool = false
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i3 = 0; i3 < cartItems[i].selectionChoice.length; i3++) {
                                for (let i4 = 0; i4 < newIngredients.length; i4++) {
                                    if (cartItems[i].selectionChoice[i3].ingredient_id === newIngredients[i4].id) {
                                        if (newIngredients[i4].instock === false) {
                                            cartItemsConflicts.conflicts.push({
                                                cartItem: cartItems[i].selectionChoice[i3],
                                                why: 'The selection you made is out of stock'
                                            })
                                            bool = false
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        cartItemsConflicts.bool = bool
        return cartItemsConflicts
    }

    let samplecart = [
        {
            id: "73a72875-b6f4-45de-ac87-e03034081586",
            price: 17.75,
            ingredientChoice: [
                {
                    id: "9617c1a8-ead4-4a6f-8255-955fa241c6c3"
                }
            ],
            selectionChoice: [
                {
                    ingredient_id: '9617c1a8-ead4-4a6f-8255-955fa241c6c3'
                }
            ]
        },
        {
            id: "e2731be7-b0b0-4045-83f5-934a185b25d8",
            price: 17.75,
            ingredientChoice: [
                {
                    id: "9617c1a8-ead4-4a6f-8255-955fa241c6c3"
                }
            ],
            selectionChoice: [
                {
                    ingredient_id: '9617c1a8-ead4-4a6f-8255-955fa241c6c3'
                }
            ]
        }
    ]
    const [data3, setData3] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/products?fields=*.*&filter[restaurant][id][_eq]=${restId}`)
            .then(response => response.json())
            .then(res => {
                setData3(res)
            })
            .catch(error => console.log(error));
    }, [])
    const [data4, setData4] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/ingredients?fields=*.*&filter[restaurant][id][_eq]=${restId}`)
            .then(response => response.json())
            .then(res => {
                setData4(res)
            })
            .catch(error => console.log(error));
    }, [])

    function validateCategory(startTime, endTime) {
        if (startTime !== undefined) {
            if (startTime !== null) {
                let houred = endTime.slice(0, 2)
                let mined = endTime.slice(3, 5)
                let hourst = startTime.slice(0, 2)
                let minst = startTime.slice(3, 5)
                let date = new Date()
                let dateInt = new Date().getTime()
                let month = new Date(date).getMonth()
                let day = new Date(date).getDate()
                let year = new Date(date).getFullYear()
                let startInt = new Date(year, month, day, hourst, minst).getTime()
                let endInt = new Date(year, month, day, houred, mined).getTime()
                if (dateInt >= startInt) {
                    if (dateInt < endInt) {
                        return true
                    }
                }
                return false
            }
            return true
        }
    }
    const [orders25, setOrders25] = useState()
    useEffect(() => {
        fetch(`https://blueplate.directus.app/items/orders?filter[restaurant][id][_eq]=${restId}&fields[]=line_items.products.name&fields[]=conv_fee,id,total,tax,tip,subtotal,date_created&fields[]=line_items.ingredients_on_product.ingredients_id.name&fields[]=line_items.selections_on_product.ingredient_id.name&fields[]=line_items.ingredients_on_product.amount&fields[]=line_items.selections_on_product.selections_id.name&fields[]=customer.first_name&fields[]=customer.last_name&fields[]=customer.email&fields[]=customer.phone`)
            .then(response => response.json())
            .then(res => {
                setOrders25(res)
            })
            .catch(error => console.log(error));
    }, [])
    function last25OrdersInfo(orders){
        let orderArray = []
        let entree
        let ingredients = []
        let selections = []
        if (orders !== undefined) {
            for(let i = 0; i < orders.length; i++){
                orderArray.push({
                    id: orders[i].id,
                    date: orders[i].date_created,
                    total: orders[i].total,
                    subtotal: orders[i].subtotal,
                    tax:  orders[i].tax,
                    tip:  orders[i].tip,
                    convFee: orders[i].conv_fee,
                    customer: orders[i].customer,
                    line_items: []
                })
                for (let i2 = 0; i2 < orders[i].line_items.length; i2++) {
                    selections = []
                    ingredients = []
                    entree = orders[i].line_items[i2].products.name
                    for(let i3 = 0;i3<orders[i].line_items[i2].ingredients_on_product.length;i3++){
                        if(orders[i].line_items[i2].ingredients_on_product[i3].amount!==undefined){
                            if (orders[i].line_items[i2].ingredients_on_product[i3].amount !== 2) {
                                ingredients.push({
                                    ingredient: orders[i].line_items[i2].ingredients_on_product[i3].ingredients_id.name,
                                    amount: orders[i].line_items[i2].ingredients_on_product[i3].amount
                                })
                            }
                        }
                    }
                    for(let i3 = 0;i3<orders[i].line_items[i2].selections_on_product.length;i3++){
                        if(orders[i].line_items[i2].selections_on_product[i3].ingredient_id!==null){
                            selections.push({
                                choice: orders[i].line_items[i2].selections_on_product[i3].ingredient_id.name,
                                selection: orders[i].line_items[i2].selections_on_product[i3].selections_id.name
                            })
                        }
                    }
                    orderArray[i].line_items.push({
                        entree: entree,
                        ingredients: ingredients,
                        selections: selections
                    })
                }
            }
        }
        return orderArray
    }
    console.log(last25OrdersInfo(orders25?.data))
}

