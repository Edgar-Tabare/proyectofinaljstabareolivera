document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    // Obtener los usuarios registrados del localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios'));

    // Verificar si las credenciales ingresadas coinciden con algún usuario registrado
    const usuarioEncontrado = usuariosRegistrados.find(usuario => usuario.email === email && usuario.contrasena === contrasena);

    // Obtener elemento para mostrar el mensaje
    const mensaje = document.getElementById('mensajeLogin');

    if (usuarioEncontrado) {
        // Mostrar mensaje de inicio de sesión exitoso
        mensaje.textContent = 'Inicio de sesión exitoso';
        mensaje.style.color = 'green';
        // Aquí puedes redireccionar a la página principal o realizar cualquier otra acción necesaria
    } else {
        // Mostrar mensaje de error
        mensaje.textContent = 'Email o contraseña incorrectos';
        mensaje.style.color = 'red';
    }
});