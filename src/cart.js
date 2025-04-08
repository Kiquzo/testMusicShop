const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

openCartBtn.addEventListener('click', () => {
    cartModal.classList.add('show');
    renderCart();
});
closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Корзина пуста</p>';
        cartTotalEl.textContent = `ВСЕГО: 0 ₽`;
        return;
    }

    Promise.all(
        cart.map(item =>
            fetch(`/api/products/${item.id}`).then(res => res.json())
        )
    ).then(products => {
        products.forEach((product, i) => {
            const item = cart[i];
            const subtotal = product.price * item.quantity;
            total += subtotal;

            cartItemsEl.innerHTML += `
        <div class="cart-item">
          <img src="${product.image}" width="50" />
          <div>
            <p>${product.name}</p>
            <p>${product.price.toLocaleString()} ₽</p>
          </div>
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" />
          <button class="remove-btn" data-id="${item.id}">✖</button>
        </div>
      `;
        });

        cartTotalEl.textContent = `ВСЕГО: ${total.toLocaleString()} ₽`;
    });
}

// Кол-во / удаление
cartItemsEl.addEventListener('input', e => {
    if (e.target.type === 'number') {
        const id = e.target.dataset.id;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.id === id);
        item.quantity = parseInt(e.target.value);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
});
cartItemsEl.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
        const id = e.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(i => i.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
});

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
    }).then(res => {
        if (res.ok) {
            alert('Заказ оформлен!');
            localStorage.removeItem('cart');
            renderCart();
        }
    });
});
