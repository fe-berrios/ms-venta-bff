// Datos iniciales del carrito
let cartItems = [
    {
        id: 1,
        name: "Caja de Clavos",
        description: "Caja de clavos galvanizados de 3 pulgadas (100 unidades)",
        price: 3500,
        quantity: 2,
        image: "fas fa-box"
    },
    {
        id: 2,
        name: "Martillo de Carpintero",
        description: "Martillo profesional con mango de fibra de vidrio",
        price: 5000,
        quantity: 1,
        image: "fas fa-hammer"
    }
];

let discount = 0;
let promoApplied = false;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCart();
    checkWebpayReturn();
});

// Configurar todos los event listeners
function initializeEventListeners() {
    // Botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const change = parseInt(this.getAttribute('data-change'));
            updateQuantity(index, change);
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeItem(index);
        });
    });
    
    // Botón de aplicar código promocional
    document.getElementById('applyPromoBtn').addEventListener('click', applyPromoCode);
    
    // Enter en campo de código promocional
    document.getElementById('promo-code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
    
    // Botón de pagar
    document.getElementById('checkoutBtn').addEventListener('click', procesarPagoWebpay);
}

// Función para actualizar las cantidades
function updateQuantity(index, change) {
    const newQuantity = cartItems[index].quantity + change;
    
    if (newQuantity < 1) {
        removeItem(index);
        return;
    }
    
    cartItems[index].quantity = newQuantity;
    document.getElementById(`quantity-${index}`).textContent = newQuantity;
    updateCart();
}

// Función para eliminar un item
function removeItem(index) {
    cartItems.splice(index, 1);
    
    // Actualizar la visualización
    if (cartItems.length === 0) {
        document.querySelector('.cart-items').innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para continuar con tu compra</p>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        // Recargar la lista de items (en una implementación real sería más dinámico)
        location.reload();
    }
    
    updateCart();
}

// Función para actualizar el carrito
function updateCart() {
    let subtotal = 0;
    
    // Calcular subtotal
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Actualizar total por item
        const itemTotalElement = document.getElementById(`item-total-${index}`);
        if (itemTotalElement) {
            itemTotalElement.textContent = `$${itemTotal.toLocaleString()}`;
        }
    });
    
    // Aplicar descuento
    const total = subtotal - discount;
    
    // Actualizar UI
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
    document.querySelector('.cart-count').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar botón de pago
    document.getElementById('checkoutBtn').disabled = cartItems.length === 0;
}

// Función para aplicar código promocional
function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value.toUpperCase();
    const messageDiv = document.getElementById('message');
    
    if (promoApplied) {
        showMessage("Ya tienes un descuento aplicado", "error");
        return;
    }
    
    if (promoCode === "FERRO10") {
        discount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1;
        document.getElementById('discount').textContent = `-$${discount.toLocaleString()}`;
        showMessage("¡Descuento del 10% aplicado!", "success");
        promoApplied = true;
        updateCart();
    } else if (promoCode === "") {
        showMessage("Ingresa un código promocional", "error");
    } else {
        showMessage("Código promocional no válido", "error");
    }
}

// Función para mostrar mensajes
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// FUNCIÓN PRINCIPAL PARA PROCESAR PAGO CON WEBPAY
async function procesarPagoWebpay() {
    const messageDiv = document.getElementById('message');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Mostrar overlay de carga
    loadingOverlay.style.display = 'flex';
    
    try {
        // Calcular el total
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal - discount;
        
        // Validar monto mínimo
        if (total < 100) {
            throw new Error('El monto mínimo de compra es de $100');
        }
        
        // Generar identificadores únicos
        const buyOrder = "FERRETERIA_" + Date.now();
        const sessionId = "SESION_" + Math.random().toString(36).substr(2, 12);
        const returnUrl = "http://127.0.0.1:5500/index.html";
        
        // Datos para la transacción Webpay
        const webpayData = {
            "buy_order": buyOrder,
            "session_id": sessionId,
            "amount": total,
            "return_url": returnUrl
        };

        // 1. Crear la transacción en el backend
        const response = await fetch('http://localhost:8081/bs/add/venta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webpayData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${errorText}`);
        }

        const data = await response.json();
        
        // 2. Validar respuesta de Webpay
        if (!data.token || !data.url) {
            throw new Error('Respuesta incompleta de Webpay: falta token o URL');
        }
        
        // 3. Mostrar mensaje de confirmación
        showMessage("Redirigiendo a Webpay para completar tu pago...", "success");
        
        // 4. Redirigir automáticamente después de 2 segundos
        setTimeout(() => {
            redirigirAWebpay(data.url, data.token);
        }, 2000);
        
    } catch (error) {
        showMessage(`Error al procesar el pago: ${error.message}`, "error");
        console.error('Error en Webpay:', error);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Función para redirigir a Webpay (crea y envía formulario automáticamente)
function redirigirAWebpay(urlWebpay, tokenWebpay) {
    // Crear formulario dinámico según especificaciones de Webpay
    const formulario = document.createElement('form');
    formulario.id = 'webpayRedirectForm';
    formulario.method = 'POST';
    formulario.action = urlWebpay;
    formulario.style.display = 'none';
    
    // Input para token_ws (EXACTAMENTE como Webpay lo requiere)
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'token_ws'; // Nombre EXACTO requerido
    tokenInput.value = tokenWebpay;
    
    formulario.appendChild(tokenInput);
    document.getElementById('formularioOculto').appendChild(formulario);
    
    // Enviar formulario automáticamente
    formulario.submit();
}

function checkWebpayReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenWs = urlParams.get('token_ws');
    const tbkToken = urlParams.get('TBK_TOKEN'); // Para transacciones anuladas
    
    // Si tenemos token_ws, significa que Webpay nos redirigió de vuelta
    if (tokenWs) {
        // Mostrar overlay de carga
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.querySelector('.loading-text').textContent = 'Confirmando transacción con Webpay...';
        }
        
        // Llamar al endpoint de confirmación
        confirmarTransaccionWebpay(tokenWs);
    }
    
    // Si tenemos TBK_TOKEN, la transacción fue anulada
    if (tbkToken) {
        mostrarResultadoTransaccion({
            error: true,
            message: 'La transacción fue anulada por el usuario',
            status: 'CANCELLED'
        });
    }
}

// Función para confirmar la transacción con Webpay
async function confirmarTransaccionWebpay(tokenWs) {
    try {
        // Endpoint de tu microservicio BFF para confirmar la venta
        // ¡IMPORTANTE! Usar backticks (`) en lugar de comillas simples (')
        const confirmacionUrl = `http://localhost:8080/bff/status/venta/${tokenWs}`;
        
        console.log('URL de confirmación:', confirmacionUrl); // Para debugging
        
        const response = await fetch(confirmacionUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            // Intentar obtener más detalles del error
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = `Error ${response.status}: ${errorText}`;
                }
            } catch (e) {
                // Si no podemos leer el texto del error, usar el mensaje básico
            }
            throw new Error(errorMessage);
        }

        const resultado = await response.json();
        
        // Mostrar el resultado de la transacción
        mostrarResultadoTransaccion(resultado);
        
        // Si la transacción fue exitosa, limpiar el carrito
        if (resultado.status === 'AUTHORIZED' || resultado.response_code === 0) {
            limpiarCarritoExitoso();
        }
        
    } catch (error) {
        console.error('Error confirmando transacción:', error);
        mostrarResultadoTransaccion({
            error: true,
            message: `Error al confirmar la transacción: ${error.message}`,
            status: 'ERROR'
        });
    } finally {
        // Ocultar overlay de carga
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}