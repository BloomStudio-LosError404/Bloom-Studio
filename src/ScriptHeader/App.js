const API_URL = "https://localhost:8080/api/pedidos";

document.documentElement.classList.add("layout-loading");

const LAYOUT = {
    headerUrl: "/Layout/Header/index.html",
    footerUrl: "/Layout/Footer/index.html",
    headerMountId: "appHeader",
    footerMountId: "appFooter",
};


async function fetchHtml(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`No se pudo cargar ${url} (HTTP ${res.status})`);
    }
    return await res.text();
}

async function mountPartial(mountId, url) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const html = await fetchHtml(url);
    mount.innerHTML = html;
}

async function loadLayout() {
    await Promise.all([
        mountPartial(LAYOUT.headerMountId, LAYOUT.headerUrl),
        mountPartial(LAYOUT.footerMountId, LAYOUT.footerUrl),
    ]);

    if (typeof window.initHeader === "function") {
        window.initHeader();
    }
}


function initGlobalEnhancements() {

    const mobileMenu = document.querySelector(".desplegable");
    if (!mobileMenu) return;

    if (mobileMenu.dataset.boundClose === "1") return;
    mobileMenu.dataset.boundClose = "1";

    mobileMenu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        mobileMenu.classList.remove("abrir-menu");
    });
}


function getCurrentPageKey() {
    const bodyKey = document.body?.dataset?.page?.trim();
    if (bodyKey) return bodyKey.toLowerCase();

    const main = document.querySelector("main[data-page]");
    const mainKey = main?.dataset?.page?.trim();
    if (mainKey) return mainKey.toLowerCase();

    return null;
}

async function initPageSpecific() {
    const key = getCurrentPageKey();
    if (!key) return;

}


async function bootstrap() {
    await loadLayout();
    document.documentElement.classList.remove("layout-loading");
    document.documentElement.classList.add("layout-ready");
     window.actualizarNumeroCarrito();

    initGlobalEnhancements();

    await initPageSpecific();
}

document.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch((err) => {
        console.error("[app.js] Error en bootstrap:", err);
    });
});




// Actualizar carrito
window.actualizarNumeroCarrito = function() {
    const elContador = document.getElementById("cuenta-carrito");
    const memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);

    if (elContador) {
        elContador.innerText = cuenta;
    } else {
        console.warn("Contador no encontrado en el DOM.");
    }
};

console.log("TOKEN:", localStorage.getItem("token"));
//  Agregar producto 
window.agregarAlCarrito = async function(producto) {
    let memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    const indiceProducto = memoria.findIndex(item => item.id === producto.id);

    if (indiceProducto === -1) {
        memoria.push({ ...producto, cantidad: 1 });
    } else {
        memoria[indiceProducto].cantidad++;
    }


    localStorage.setItem("Articulos", JSON.stringify(memoria));
    window.actualizarNumeroCarrito();

    try {
       await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
        idInventario: producto.id,
        cantidad: 1
    })
});

    } catch (error) {
        console.error("Error de red al sincronizar suma:", error);
    }
};
window.restarAlCarrito = async function(producto) {
    let memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    const indiceProducto = memoria.findIndex(item => item.id === producto.id);

    if (indiceProducto !== -1) {
        if (memoria[indiceProducto].cantidad > 1) {
            memoria[indiceProducto].cantidad--;
        } else {
            memoria.splice(indiceProducto, 1);
        }

        localStorage.setItem("Articulos", JSON.stringify(memoria));
        window.actualizarNumeroCarrito();


        try {
           await fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
        idInventario: producto.id
    })
});

        } catch (error) {
            console.error("Error de red al sincronizar resta:", error);
        }
    }
};

// Cargar carrito al iniciar la página

window.cargarCarritoDesdeServidor = async function() {
    try {
        const res = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});

        if (res.ok) {
            const productos = await res.json();
            localStorage.setItem("Articulos", JSON.stringify(productos));
            window.actualizarNumeroCarrito();
        }
    } catch (error) {
        console.log("No se pudo recuperar el carrito del servidor, usando local.");
        window.actualizarNumeroCarrito();
    }
};


document.addEventListener("DOMContentLoaded", window.cargarCarritoDesdeServidor);


// Función carrito
/*window.actualizarNumeroCarrito = function() {
    if (!cuentaCarritoElement) {
        cuentaCarritoElement = document.getElementById("cuenta-carrito");
    }
    const memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    if (cuentaCarritoElement) {
        cuentaCarritoElement.innerText = cuenta;
    }
};*/