import Servicios from './servicios.js';

class GestorUsuarios {
    constructor() {
        this.servicios = new Servicios();
        this.token = '';
        this.usuarios = [];
        this.entrenadoresSeleccionados = []; // Array para almacenar los entrenadores seleccionados para el combate
        this.init();
    }

    login() {
        const usuario = $('#user').val();
        const contrasena = $('#pass').val();

        this.servicios.autenticar(usuario, contrasena, (error, response) => {
            if (error) {
                alert('Usuario o contraseña incorrectos');
            } else {
                if (response.status === 200) {
                    alert('¡Login exitoso!');
                    this.token = response.token;
                    this.cleanMain();
                    this.mostrarUsuarios(this.token);
                }
            }
        });
    }

    mostrarUsuarios(token) {
        this.servicios.obtenerUsuarios(token, (error, response) => {
            if (error) {
                console.error('Error al obtener usuarios:', error);
            } else {
                const trainers = response.slice(0, 14); // Obtener los primeros 14 entrenadores
                this.renderizarUsuarios(trainers);
            }
        });
    }

    cleanMain() {
        $("#mainlogin").html("");
    }

    renderizarUsuarios(usuarios) {
        $('#trainers').empty();
        usuarios.forEach(trainer => {
            let trainerHtml = `
                <div class="trainer">
                    <h2>${trainer.entrenador}</h2>
                    <img src="${trainer.foto_entrenador}" alt="${trainer.entrenador}" class="trainer-photo">
                    <button class="btn ver-pokemons">Ver Pokémons</button>
                    <button class="btn nuevo-combate">Nuevo Combate</button>
                    <div class="pokemons" style="display: none;"></div>
                </div>`;
            $('#trainers').append(trainerHtml);
        });

        // Botón global para comenzar la batalla
        const $batallaContainer = $('<div class="batalla-container"></div>');
        const $seleccionadosContainer = $('<div class="seleccionados-container"></div>');
        const $btnComenzarBatalla = $('<button class="btn comenzar-batalla" disabled>Comenzar Batalla</button>');
        $batallaContainer.append($seleccionadosContainer, $btnComenzarBatalla);
        $('body').append($batallaContainer);

        // Evento click para el botón 'Ver Pokémons'
        $('.ver-pokemons').on('click', function() {
            const $trainerDiv = $(this).closest('.trainer');
            const trainerName = $trainerDiv.find('h2').text().trim(); // Obtener el nombre del entrenador
            const trainer = usuarios.find(t => t.entrenador === trainerName);

            if (trainer) {
                let pokemonsHtml = '';
                trainer.pokemons.forEach(pokemon => {
                    pokemonsHtml += `
                        <div class="pokemon ${pokemon.tipo}">
                            <img src="${pokemon.foto}" alt="${pokemon.nombre}">
                            <div class="name">${pokemon.nombre}</div>
                        </div>`;
                });

                $trainerDiv.find('.pokemons').html(pokemonsHtml).toggle();
            }
        });

        // Evento click para el botón 'Nuevo Combate'
        $('.nuevo-combate').on('click', (event) => {
            const $trainerDiv = $(event.target).closest('.trainer');
            const trainerName = $trainerDiv.find('h2').text().trim();

            // Verificar si el entrenador ya está seleccionado
            if (this.entrenadoresSeleccionados.includes(trainerName)) {
                // Si ya está seleccionado, deseleccionarlo
                this.entrenadoresSeleccionados = this.entrenadoresSeleccionados.filter(name => name !== trainerName);
                $trainerDiv.find('.nuevo-combate').text('Nuevo Combate'); // Cambiar el texto del botón
            } else {
                // Si no está seleccionado, seleccionarlo
                if (this.entrenadoresSeleccionados.length < 2) {
                    this.entrenadoresSeleccionados.push(trainerName);
                    $trainerDiv.find('.nuevo-combate').text('Cancelar'); // Cambiar el texto del botón
                }
            }

            // Actualizar la visualización de los entrenadores seleccionados
            this.actualizarSeleccionados();

            // Habilitar o deshabilitar el botón 'Comenzar Batalla' según si hay 2 entrenadores seleccionados
            if (this.entrenadoresSeleccionados.length === 2) {
                $btnComenzarBatalla.prop('disabled', false);
            } else {
                $btnComenzarBatalla.prop('disabled', true);
            }
        });

        // Evento click para el botón 'Comenzar Batalla'
        $btnComenzarBatalla.on('click', () => {
            const entrenador1 = this.entrenadoresSeleccionados[0];
            const entrenador2 = this.entrenadoresSeleccionados[1];

            // Mostrar mensaje de nuevo combate
            alert(`Se realizará un nuevo combate entre ${entrenador1} vs ${entrenador2}`);

            // Limpiar selección de entrenadores
            this.entrenadoresSeleccionados = [];
            $('.nuevo-combate').text('Nuevo Combate'); // Restaurar texto de los botones
            $btnComenzarBatalla.prop('disabled', true); // Deshabilitar el botón 'Comenzar Batalla'

            // Actualizar la visualización de los entrenadores seleccionados
            this.actualizarSeleccionados();
        });
    }

    actualizarSeleccionados() {
        const $seleccionadosContainer = $('.seleccionados-container');
        $seleccionadosContainer.empty();

        if (this.entrenadoresSeleccionados.length > 0) {
            const $seleccionadosTitle = $('<h3>Entrenadores seleccionados:</h3>');
            const $listaSeleccionados = $('<ul></ul>');

            this.entrenadoresSeleccionados.forEach(entrenador => {
                const $item = $(`<li>${entrenador}</li>`);
                $listaSeleccionados.append($item);
            });

            $seleccionadosContainer.append($seleccionadosTitle, $listaSeleccionados);
        } else {
            $seleccionadosContainer.append('<p>No hay entrenadores seleccionados</p>');
        }
    }

    renderLogin() {
        const templatelogin = `<div class="inputLogin">
            <div class="input">
                <label>Usuario</label>
                <input type="text" id="user" />
            </div>
            <div class="input">
                <label>Password</label>
                <input type="password" id="pass" />
            </div>
            <div class="input">
                <button type="submit" class="btn" id="btLogin">Logear</button>
            </div>
        </div>`;
        $("#mainlogin").append(templatelogin);
    }

    init() {
        this.render();
        $('#btLogin').on('click', () => {
            this.login();
        });

        // Inicialmente, deshabilitar el botón 'Comenzar Batalla' hasta que se seleccionen 2 entrenadores
        $('.comenzar-batalla').prop('disabled', true);
    }

    render() {
        this.renderLogin();
    }
}

export default GestorUsuarios;
