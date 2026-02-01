# Microservicio: ms-venta-bff (Backend for Frontend)

## Descripción General
**ms-venta-bff** es el Backend for Frontend que actúa como puente entre la interfaz web del carrito de compras y los microservicios internos. Proporciona una API simplificada y adaptada específicamente para las necesidades del frontend, manejando el flujo completo de compra desde el carrito hasta la confirmación con Webpay.

## Puerto de Ejecución
- **Puerto:** `8080`

## Responsabilidades Principales

### 1. Adaptación API para Frontend
- Expone endpoints simples y específicos para el carrito de compras
- Traduce entre formatos del frontend y sistemas internos
- Maneja CORS y seguridad específica para el navegador

### 2. Orquestación del Flujo de Compra
- Coordina el proceso completo desde carrito hasta confirmación
- Gestiona redirecciones entre frontend, Webpay y back
- Proporciona feedback de estado al usuario

## Comunicación con Otros Componentes

### Recibe Llamadas Desde:
1. **Frontend Web (HTML/JS/CSS - Puerto 5500)**
   - `POST /bff/add/venta` - Iniciar proceso de pago
   - `PUT /bff/status/venta/{token_ws}` - Confirmar transacción

### Realiza Llamadas Hacia:
1. **ms-venta-bs (Business Service - Puerto 8081)**
   - Reenvía todas las operaciones de transacciones

### Flujo de Comunicación Completo:
```
Frontend (5500) → ms-venta-bff (8080) → ms-venta-bs (8081) → ...
... → ms-venta-amb (8082) → Webpay → Base de datos (8083)
```

## Endpoints Disponibles

### Endpoints del BFF:
- **POST `/bff/add/venta`** - Inicia proceso de pago
  - Recibe: `VentaRequest` desde frontend
  - Devuelve: `VentaResponse` para redirección a Webpay

- **PUT `/bff/status/venta/{token_ws}`** - Confirma resultado de pago
  - Recibe: `token_ws` desde Webpay (vía frontend)
  - Devuelve: `StatusResponse` con resultado final

## Flujo Completo del Sistema de Compras

### 1. Estructura del Frontend (Sitio Web)

#### Características:
- **Tema:** Ferretería "FERREMAS"
- **Tecnologías:** HTML5, CSS3, JavaScript Vanilla
- **Diseño:** Responsive, moderno con Font Awesome icons
- **Puerto local:** 5500 (Live Server)

#### Componentes del Carrito:
```
Productos predefinidos:
1. Caja de Clavos ($3.500) - Cantidad: 2
2. Martillo de Carpintero ($5.000) - Cantidad: 1
Total inicial: $12.000
```

#### Funcionalidades Frontend:
- Ajuste de cantidades (+, -)
- Eliminación de productos
- Códigos promocionales (ej: "FERRO10" = 10% descuento)
- Cálculo automático de totales
- Integración directa con Webpay

### 2. Flujo Detallado de una Compra

#### Paso 1: Interacción en el Carrito
```
Usuario en http://127.0.0.1:5500/index.html
↓
Agrega/remueve productos del carrito
↓
Aplica código promocional (opcional)
↓
Hace clic en "PAGAR PEDIDO"
```

#### Paso 2: Preparación de Datos (JavaScript)
```javascript
// script.js - función procesarPagoWebpay()
1. Calcula total: subtotal - descuento
2. Genera identificadores únicos:
   - buy_order: "FERRETERIA_" + timestamp
   - session_id: "SESION_" + random string
3. Prepara objeto para BFF:
   {
     "buy_order": "FERRETERIA_123456789",
     "session_id": "SESION_ABC123DEF",
     "amount": 12000,
     "return_url": "http://127.0.0.1:5500/index.html"
   }
```

#### Paso 3: Llamada al BFF
```
Frontend → POST http://localhost:8080/bff/add/venta
↓
ms-venta-bff recibe VentaRequest
↓
Reenvía a ms-venta-bs (8081)
↓
Flujo continúa por microservicios hasta Webpay
↓
Webpay responde con {token, url}
↓
Respuesta viaja de vuelta al frontend
```

#### Paso 4: Redirección a Webpay
```javascript
// script.js - función redirigirAWebpay()
1. Recibe {token: "abc123", url: "https://webpay..."}
2. Crea formulario HTML oculto:
   <form method="POST" action="[url_webpay]">
     <input type="hidden" name="token_ws" value="abc123">
   </form>
3. Envía formulario automáticamente
4. Usuario ve formulario de pago Webpay
```

### 3. Proceso de Pago en Webpay

#### Ambiente de Pruebas:
- **URL:** https://webpay3gint.transbank.cl
- **Tarjetas de Prueba:**
  - VISA: 4051 8856 0044 6623 (cualquier fecha futura, CVV 123)
  - MASTERCARD: 5186 0595 5959 0568 (cualquier fecha futura, CVV 123)
  - AMEX: 3757 7817 1354 006 (cualquier fecha futura, CVV 1234)

#### Flujo en Webpay:
```
1. Usuario ingresa datos de tarjeta de prueba
2. Webpay procesa pago (siempre exitoso en pruebas)
3. Webpay redirige de vuelta a return_url
4. URL incluye parámetro: ?token_ws=abc123
```

### 4. Confirmación de la Transacción

#### Paso 5: Retorno a la Tienda
```
Webpay → http://127.0.0.1:5500/index.html?token_ws=abc123
↓
JavaScript detecta token_ws en URL
↓
Llama a confirmación: PUT http://localhost:8080/bff/status/venta/abc123
↓
ms-venta-bff reenvía a ms-venta-bs
↓
Sistema confirma transacción con Webpay
↓
Actualiza estado en base de datos
↓
Devuelve StatusResponse al frontend
```

#### Paso 6: Respuesta al Usuario
```javascript
// Posibles respuestas según StatusResponse:
1. ÉXITO (status: 'AUTHORIZED', response_code: 0):
   - Muestra: "¡Compra aprobada! Gracias por tu compra"
   - Acción: Limpia carrito automáticamente

2. FALLIDA (status: 'FAILED', response_code ≠ 0):
   - Muestra: "La compra no pudo ser realizada"
   - Acción: Mantiene productos en carrito

3. CANCELADA (parámetro TBK_TOKEN):
   - Muestra: "La transacción fue anulada por el usuario"
   - Acción: Mantiene productos en carrito
```

### 5. Estados Finales en Interfaz

#### Popup de Confirmación:
- **Diseño:** Modal centrado con animación suave
- **Contenido:** Icono + mensaje + botón "Aceptar"
- **Cierre automático:** 5 segundos para transacciones exitosas

#### Actualización del Carrito:
- **Éxito:** Carrito se vacía, muestra mensaje especial
- **Fallo:** Carrito mantiene productos, permite reintentar

## Modelos de Datos del BFF

### Recibe del Frontend:
```json
{
  "buy_order": "string",
  "session_id": "string", 
  "amount": 12000,
  "return_url": "http://127.0.0.1:5500/index.html"
}
```

### Devuelve al Frontend:
```json
// Para creación (addVenta):
{
  "token": "abc123def456",
  "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
}

// Para confirmación (statusVenta):
{
  "status": "AUTHORIZED",
  "response_code": 0,
  "buy_order": "FERRETERIA_123456789",
  "authorization_code": "123456",
  "card_detail": {"card_number": "6623"},
  "amount": 12000,
  "...": "otros campos de Webpay"
}
```
