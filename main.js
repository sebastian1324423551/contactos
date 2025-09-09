import Contacto from './contacto.js';

// Arreglo de contactos
let contactos = [];
let contactoEditando = null;

// Elementos del DOM
const btnAgregar = document.querySelector("#btnAgregar");
const btnActualizar = document.querySelector("#btnActualizar");
const btnCancelar = document.querySelector("#btnCancelar");
const btnConsultar = document.querySelector("#btnConsultar");
const btnEliminar = document.querySelector("#btnEliminar");
const tablaContactos = document.querySelector("#tablaContactos");
const frmContacto = document.querySelector("#frmContacto");
const resultadosBusqueda = document.querySelector("#resultadosBusqueda");
const resultadoTabla = document.querySelector("#resultadoTabla");

// Evento para agregar contacto
btnAgregar.addEventListener("click", () => {
    if (validarFormulario()) {
        const identificacion = document.querySelector("#txtIdentificacion").value;
        
        // Verificar si ya existe un contacto con la misma identificación
        if (contactoExiste(identificacion)) {
            Swal.fire("Error", "Ya existe un contacto con esta identificación", "error");
            return;
        }

        const nombre = document.querySelector("#txtNombre").value;
        const apellido = document.querySelector("#txtApellido").value;
        const correo = document.querySelector("#txtCorreo").value;
        const celular = document.querySelector("#txtCelular").value;

        // Crear nuevo contacto
        const contacto = new Contacto(identificacion, nombre, apellido, correo, celular);
        contactos.push(contacto);

        // Actualizar tabla
        mostrarContactos();
        Swal.fire("Éxito", "Contacto agregado correctamente", "success");
        
        // Limpiar formulario
        frmContacto.reset();
    }
});

// Evento para actualizar contacto
btnActualizar.addEventListener("click", () => {
    if (validarFormulario() && contactoEditando) {
        const identificacion = document.querySelector("#txtIdentificacion").value;
        const nombre = document.querySelector("#txtNombre").value;
        const apellido = document.querySelector("#txtApellido").value;
        const correo = document.querySelector("#txtCorreo").value;
        const celular = document.querySelector("#txtCelular").value;

        // Actualizar contacto
        contactoEditando.identificacion = identificacion;
        contactoEditando.nombre = nombre;
        contactoEditando.apellido = apellido;
        contactoEditando.correo = correo;
        contactoEditando.celular = celular;

        // Actualizar tabla
        mostrarContactos();
        Swal.fire("Éxito", "Contacto actualizado correctamente", "success");
        
        // Limpiar formulario y resetear botones
        frmContacto.reset();
        resetearFormulario();
    }
});

// Evento para cancelar edición
btnCancelar.addEventListener("click", () => {
    frmContacto.reset();
    resetearFormulario();
});

// Evento para consultar contacto
btnConsultar.addEventListener("click", () => {
    const identificacion = document.querySelector("#txtBuscarIdentificacion").value;
    
    if (!identificacion) {
        Swal.fire("Error", "Por favor ingrese una identificación para buscar", "error");
        return;
    }

    const contacto = buscarContacto(identificacion);
    
    if (contacto) {
        resultadoTabla.innerHTML = `
            <tr>
                <td>${contacto.identificacion}</td>
                <td>${contacto.nombre}</td>
                <td>${contacto.apellido}</td>
                <td>${contacto.correo}</td>
                <td>${contacto.celular}</td>
            </tr>
        `;
        resultadosBusqueda.style.display = "block";
    } else {
        Swal.fire("No encontrado", "No se encontró ningún contacto con esa identificación", "info");
        resultadosBusqueda.style.display = "none";
    }
});

// Evento para eliminar contacto
btnEliminar.addEventListener("click", () => {
    const identificacion = document.querySelector("#txtBuscarIdentificacion").value;
    
    if (!identificacion) {
        Swal.fire("Error", "Por favor ingrese una identificación para eliminar", "error");
        return;
    }

    const index = contactos.findIndex(contacto => contacto.identificacion === identificacion);
    
    if (index !== -1) {
        Swal.fire({
            title: "¿Está seguro?",
            text: `Va a eliminar el contacto con identificación ${identificacion}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                contactos.splice(index, 1);
                mostrarContactos();
                document.querySelector("#txtBuscarIdentificacion").value = "";
                resultadosBusqueda.style.display = "none";
                Swal.fire("Eliminado", "El contacto ha sido eliminado", "success");
            }
        });
    } else {
        Swal.fire("No encontrado", "No se encontró ningún contacto con esa identificación", "info");
    }
});

// Función para mostrar contactos en la tabla
function mostrarContactos() {
    let datos = "";
    contactos.forEach((contacto, index) => {
        datos += `
            <tr>
                <td>${contacto.identificacion}</td>
                <td>${contacto.nombre}</td>
                <td>${contacto.apellido}</td>
                <td>${contacto.correo}</td>
                <td>${contacto.celular}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-action" onclick="editarContacto(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="eliminarContacto(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tablaContactos.innerHTML = datos;
}

// Función para validar formulario
function validarFormulario() {
    const identificacion = document.querySelector("#txtIdentificacion").value;
    const nombre = document.querySelector("#txtNombre").value;
    const apellido = document.querySelector("#txtApellido").value;
    const correo = document.querySelector("#txtCorreo").value;
    const celular = document.querySelector("#txtCelular").value;

    if (!identificacion) {
        Swal.fire("Error", "Debe ingresar la identificación", "error");
        return false;
    }
    if (!nombre) {
        Swal.fire("Error", "Debe ingresar el nombre", "error");
        return false;
    }
    if (!apellido) {
        Swal.fire("Error", "Debe ingresar el apellido", "error");
        return false;
    }
    if (!correo) {
        Swal.fire("Error", "Debe ingresar el correo", "error");
        return false;
    }
    if (!celular) {
        Swal.fire("Error", "Debe ingresar el celular", "error");
        return false;
    }

    return true;
}

// Función para verificar si un contacto ya existe
function contactoExiste(identificacion) {
    return contactos.some(contacto => contacto.identificacion === identificacion);
}

// Función para buscar contacto por identificación
function buscarContacto(identificacion) {
    return contactos.find(contacto => contacto.identificacion === identificacion);
}

// Función para resetear formulario
function resetearFormulario() {
    contactoEditando = null;
    btnAgregar.disabled = false;
    btnActualizar.disabled = true;
    btnCancelar.disabled = true;
}

// Función para editar contacto (global para que pueda ser llamada desde los botones)
window.editarContacto = function(index) {
    contactoEditando = contactos[index];
    
    document.querySelector("#txtIdentificacion").value = contactoEditando.identificacion;
    document.querySelector("#txtNombre").value = contactoEditando.nombre;
    document.querySelector("#txtApellido").value = contactoEditando.apellido;
    document.querySelector("#txtCorreo").value = contactoEditando.correo;
    document.querySelector("#txtCelular").value = contactoEditando.celular;
    
    btnAgregar.disabled = true;
    btnActualizar.disabled = false;
    btnCancelar.disabled = false;
};

// Función para eliminar contacto (global para que pueda ser llamada desde los botones)
window.eliminarContacto = function(index) {
    Swal.fire({
        title: "¿Está seguro?",
        text: `Va a eliminar el contacto con identificación ${contactos[index].identificacion}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            contactos.splice(index, 1);
            mostrarContactos();
            Swal.fire("Eliminado", "El contacto ha sido eliminado", "success");
        }
    });
};

// Inicializar la tabla
mostrarContactos();