const HOTEL = {
    whatsapp: "524142195435",
    tipoCambioUSD: 17.50
};

const habitaciones = {
    clasica: { nombre: "Habitación Clásica", precio: 2200, capacidad: 2 },
    deluxe: { nombre: "Habitación Deluxe King", precio: 2850, capacidad: 2 },
    junior: { nombre: "Junior Suite", precio: 3650, capacidad: 3 },
    master: { nombre: "Master Suite", precio: 4900, capacidad: 4 },
    presidencial: { nombre: "Suite Presidencial", precio: 7200, capacidad: 4 }
};

const formulario = document.getElementById("formulario-reserva");

const fechaEntrada = document.getElementById("entrada");
const fechaSalida = document.getElementById("salida");

// Evitar fechas anteriores al día actual
const hoy = new Date();
const fechaHoy = new Date(
    hoy.getTime() - hoy.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

fechaEntrada.min = fechaHoy;
fechaSalida.min = fechaHoy;

fechaEntrada.addEventListener("change", function () {
    fechaSalida.min = fechaEntrada.value;

    if (fechaSalida.value && fechaSalida.value <= fechaEntrada.value) {
        fechaSalida.value = "";
    }
});

// Enviar solicitud de reservación
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const entrada = fechaEntrada.value;
    const salida = fechaSalida.value;
    const huespedes = Number(document.getElementById("huespedes").value);
    const tipoHabitacion = document.getElementById("habitacion").value;

    const resultado = document.getElementById("resultado-reserva");

    if (!nombre || !entrada || !salida || !huespedes || !tipoHabitacion) {
        resultado.textContent = "Por favor, completa todos los campos.";
        return;
    }

    const inicio = new Date(entrada + "T00:00:00");
    const fin = new Date(salida + "T00:00:00");

    const noches = Math.round((fin - inicio) / (1000 * 60 * 60 * 24));

    if (noches <= 0) {
        resultado.textContent = "La fecha de salida debe ser posterior a la llegada.";
        return;
    }

    const habitacion = habitaciones[tipoHabitacion];

    if (huespedes > habitacion.capacidad) {
        resultado.textContent =
            "Esta habitación tiene capacidad máxima para " +
            habitacion.capacidad + " huéspedes.";
        return;
    }

    const total = habitacion.precio * noches;
    const totalUSD = total / HOTEL.tipoCambioUSD;

    resultado.textContent =
        "Estancia de " + noches + " noche(s). Total estimado: " +
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN"
        }).format(total) +
        " (" +
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(totalUSD) +
        " USD de referencia).";

    const mensaje =
        "Hola, deseo solicitar una reservación en Hotel International Continental.%0A%0A" +
        "Nombre: " + encodeURIComponent(nombre) + "%0A" +
        "Llegada: " + encodeURIComponent(entrada) + "%0A" +
        "Salida: " + encodeURIComponent(salida) + "%0A" +
        "Noches: " + noches + "%0A" +
        "Huéspedes: " + huespedes + "%0A" +
        "Habitación: " + encodeURIComponent(habitacion.nombre) + "%0A" +
        "Total estimado: " + encodeURIComponent(
            new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN"
            }).format(total)
        ) +
        "%0A%0ASolicito confirmar disponibilidad y condiciones.";

    const enlace = "https://wa.me/" + HOTEL.whatsapp + "?text=" + mensaje;

    window.open(enlace, "_blank");
});