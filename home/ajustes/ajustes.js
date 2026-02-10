const input = document.getElementById('profileName');
const avatar = document.getElementById('avatarIcono');

input.value = localStorage.getItem('nombrePerfil') || input.value;
avatar.src = localStorage.getItem('iconoUsuario') || avatar.src;

input.addEventListener('change',()=>{
  localStorage.setItem('nombrePerfil',input.value.trim());
});

function cerrarSesion(){
  if(confirm("¿Cerrar sesión?")){
    window.location.href="https://www.google.com/";
  }
}