// ajustes.js

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const inputNombre = document.getElementById('profileName');
  const avatar = document.getElementById('avatarIcono');

  // ────────────────────────────────────────────────
  // Cargar datos guardados al iniciar la página
  // ────────────────────────────────────────────────
  if (inputNombre) {
    const nombreGuardado = localStorage.getItem('nombrePerfil');
    if (nombreGuardado) {
      inputNombre.value = nombreGuardado;
    }
  }

  if (avatar) {
    const iconoGuardado = localStorage.getItem('iconoUsuario');
    if (iconoGuardado) {
      avatar.src = iconoGuardado;

      // Seguridad extra: si la imagen no carga (URL rota), volvemos al default
      avatar.onerror = () => {
        avatar.src = "https://storage.googleapis.com/a1aa/image/b50518ce-36a3-4774-29fd-7da1f03afbb3.jpg";
      };
    }
  }

  // ────────────────────────────────────────────────
  // Guardar nombre cada vez que cambie (en tiempo real)
  // ────────────────────────────────────────────────
  if (inputNombre) {
    inputNombre.addEventListener('input', () => {   // 'input' → cada tecla
      const valor = inputNombre.value.trim();
      if (valor) {
        localStorage.setItem('nombrePerfil', valor);
      } else {
        localStorage.removeItem('nombrePerfil'); // opcional: si está vacío, borramos
      }
    });
  }

  // Opcional: también guardar al perder foco (blur)
  if (inputNombre) {
    inputNombre.addEventListener('blur', () => {
      const valor = inputNombre.value.trim();
      if (valor) {
        localStorage.setItem('nombrePerfil', valor);
      }
    });
  }
});

// ────────────────────────────────────────────────
// Función de cerrar sesión (ya la tenías, solo la dejamos bonita)
// ────────────────────────────────────────────────
function cerrarSesion() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    // Aquí podrías limpiar datos sensibles si quisieras
    // localStorage.removeItem('nombrePerfil');
    // localStorage.removeItem('iconoUsuario');
    
    window.location.href = "https://www.google.com/";
  }
}
