document.getElementById('generarDatos').addEventListener('click', function() {
    // Mostrar el formulario
    document.getElementById('registroForm').style.display = 'block';

    // Ocultar el formulario después de 2 segundos
    setTimeout(function() {
        document.getElementById('registroForm').style.display = 'none';
    }, 2000);
    
    // Función para obtener usuarios del localStorage
    const obtenerUsuariosLocalStorage = () => {
        const usuariosLocalStorage = localStorage.getItem('usuarios');
        return usuariosLocalStorage ? JSON.parse(usuariosLocalStorage) : [];
    }

    // Función para verificar si el email ya está registrado
    const verificarEmailRegistrado = (email) => {
        const usuarios = obtenerUsuariosLocalStorage();
        return usuarios.some(usuario => usuario.email === email);
    }

    // Función para generar una contraseña aleatoria
    const generarContrasena = () => {
        return Math.random().toString(36).slice(-8); // Contraseña de 8 caracteres
    }

    // Inicializar Cleave.js en los campos de la tarjeta de crédito
    const cleaveNumeroTarjeta = new Cleave('#numeroTarjeta', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // Actualizar automáticamente el campo "Emisor de la Tarjeta" según el tipo de tarjeta detectado
            document.getElementById('emisorTarjeta').value = type;
        }
    });

    const cleaveCVV = new Cleave('#cvv', {
        blocks: [3],
        numericOnly: true
    });

    const cleaveFechaVencimiento = new Cleave('#fechaVencimiento', {
        date: true,
        datePattern: ['m', 'y']
    });

    // Generar y almacenar el monto de plata en el Local Storage
    const montoPlata = Math.floor(Math.random() * 1000) + 1; // Generar un número aleatorio entre 1 y 1000
    localStorage.setItem('montoPlata', montoPlata);

    fetch('https://randomuser.me/api/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const usuario = data.results[0];
            document.getElementById('nombre').value = usuario.name.first + ' ' + usuario.name.last;
            document.getElementById('email').value = usuario.email;
            document.getElementById('direccion').value = usuario.location.street.name + ', ' + usuario.location.street.number;
            document.getElementById('pais').value = usuario.location.country;
            document.getElementById('telefono').value = usuario.phone;

            // Generar una contraseña aleatoria y mostrarla en el campo correspondiente
            const contrasena = generarContrasena();
            document.getElementById('contrasena').value = contrasena;

            // Generar un número de tarjeta de crédito aleatorio y completar los campos relacionados
            let numeroTarjeta;
            if (Math.random() < 0.5) {
                // Generar una tarjeta Visa
                numeroTarjeta = generarNumeroTarjetaAleatorio('4');
            } else {
                // Generar una tarjeta Mastercard
                numeroTarjeta = generarNumeroTarjetaAleatorio('5');
            }
            cleaveNumeroTarjeta.setRawValue(numeroTarjeta);

            // Obtener y mostrar datos de la tarjeta de crédito
            const datosTarjeta = obtenerDatosTarjeta(numeroTarjeta);
            document.getElementById('numeroTarjeta').value = datosTarjeta.numeroTarjeta;
            document.getElementById('emisorTarjeta').value = datosTarjeta.emisorTarjeta;
            document.getElementById('cvv').value = datosTarjeta.cvv;
            document.getElementById('fechaVencimiento').value = datosTarjeta.fechaVencimiento;

            // Crear el objeto de usuario con el saldo aleatorio
            const usuarioRegistrado = {
                nombre: usuario.name.first + ' ' + usuario.name.last,
                email: usuario.email,
                direccion: usuario.location.street.name + ', ' + usuario.location.street.number,
                pais: usuario.location.country,
                contrasena: contrasena,
                telefono: usuario.phone,
                tarjeta: datosTarjeta,
                saldo: montoPlata // Agregar el saldo aleatorio al usuario
            };

            // Obtener y actualizar la lista de usuarios en localStorage
            const usuarios = obtenerUsuariosLocalStorage();
            usuarios.push(usuarioRegistrado);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });
});

function obtenerDatosTarjeta(numeroTarjeta) {
    // Obtener el emisor de la tarjeta
    const emisorTarjeta = obtenerEmisorTarjeta(numeroTarjeta);

    // Simulamos otros datos de tarjeta de crédito para este ejemplo
    return {
        numeroTarjeta: numeroTarjeta,
        emisorTarjeta: emisorTarjeta,
        cvv: '123', // Valor de ejemplo
        fechaVencimiento: '12/25' // Valor de ejemplo
    };
}

function obtenerEmisorTarjeta(numeroTarjeta) {
    // Lógica para determinar el emisor de la tarjeta basado en el número
    if (numeroTarjeta.startsWith('4')) {
        return 'Visa';
    } else if (numeroTarjeta.startsWith('5')) {
        return 'Mastercard';
    } else {
        return 'Desconocido';
    }
}

// Función para generar un número de tarjeta de crédito aleatorio válido
function generarNumeroTarjetaAleatorio(inicio) {
    let numeroTarjeta = inicio; // Comienza con el número inicial para Visa (4) o Mastercard (5)
    for (let i = 1; i < 16; i++) {
        numeroTarjeta += Math.floor(Math.random() * 10); // Agrega dígitos aleatorios
        if (i % 4 === 0 && i !== 16) {
            numeroTarjeta += ' '; // Agrega espacios cada 4 dígitos para mayor legibilidad
        }
    }
    return numeroTarjeta;
}
