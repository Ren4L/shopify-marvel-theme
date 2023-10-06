document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        await fetch("/cart/add.json", {
            method: "POST",
            body: new FormData(form),
        });


        const message = document.createElement("p");
        message.classList.add("added-to-cart");
        message.textContent = "Added to cart!";
        form.appendChild(message);
    });
});

document.querySelector(".ModalCart--container").addEventListener('click', e => {
    e.target.classList.toggle('active');
})

document.querySelector('.button--cart').addEventListener('click', async e => {
    const res = await fetch("/?sections=cart");
    const cart = await res.json();
    const cartObject = await fetch("/cart.json");
    const cartObjectJson = await cartObject.json();
    console.log(cartObjectJson);
    if (cartObjectJson.items.length === 0) return;
    document.querySelector('.ModalCart').innerHTML = cart?.cart;
    document.querySelector(".ModalCart--container").classList.toggle('active');
    document.querySelectorAll('#quantity').forEach(el => el.addEventListener('change', AddEventUpdateForm));
    document.querySelectorAll('.button--delete').forEach(el => el.addEventListener('click', DeleteOfCart));
})
document.querySelector('.button--clear--cart').addEventListener('click', async e => {
    await fetch("/cart/clear.json", {method: "POST"})
})



async function AddEventUpdateForm(event) {

    const form = new FormData(event.target.parentNode.parentNode);
    let resChange = await fetch("/cart/change.json", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'line': +form.get('product-line'),
            'quantity': +form.get('quantity')
        }),
    });
    console.log(resChange);
    if (resChange.status === 200) {
        const res = await fetch("/?sections=cart");
        const cart = await res.json();
        document.querySelector('.ModalCart').innerHTML = cart?.cart;
        document.querySelectorAll('#quantity').forEach(el => el.addEventListener('change', AddEventUpdateForm));
        document.querySelectorAll('.button--delete').forEach(el => el.addEventListener('click', DeleteOfCart));
    }
}

async function DeleteOfCart(event){
    event.preventDefault();

    const form = new FormData(event.target.parentNode);
    let resChange = await fetch("/cart/change.json", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'line': +form.get('product-line'),
            'quantity': 0
        }),
    });
    if (resChange.status === 200) {
        const cartObject = await fetch("/cart.json");
        const cartObjectJson = await cartObject.json();
        if (cartObjectJson.items.length === 0) {
            document.querySelector('.ModalCart').innerHTML = '';
            document.querySelector(".ModalCart--container").classList.toggle('active');
            return;
        }

        const res = await fetch("/?sections=cart");
        const cart = await res.json();
        document.querySelector('.ModalCart').innerHTML = cart?.cart;
        document.querySelectorAll('#quantity').forEach(el => el.addEventListener('change', AddEventUpdateForm));
        document.querySelectorAll('.button--delete').forEach(el => el.addEventListener('click', DeleteOfCart));
    }
}

