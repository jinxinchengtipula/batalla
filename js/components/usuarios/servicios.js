class Servicios {
    autenticar(usuario, contrasena, callback) {
        const apiurl = 'json/login.json';
        $.ajax({
            url: apiurl,
            method: 'POST',
            data: { usuario, contrasena },
            success: (response) => {
                callback(null, response);
            },
            error: (error) => {
                callback(error);
            }
        });
    }

    obtenerUsuarios(token, callback) {
        const apiurl = 'json/usuarios.json';
        $.ajax({
            url: apiurl,
            method: 'GET',
            data: { token },
            success: (response) => {
                callback(null, response);
            },
            error: (error) => {
                callback(error);
            }
        });
    }
}

export default Servicios;

