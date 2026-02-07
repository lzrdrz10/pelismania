document.addEventListener('DOMContentLoaded', () => {

  /* BACKGROUND DINÁMICO */
  const hero = document.querySelector('.hero');
  if(hero && hero.dataset.bg){
    hero.style.backgroundImage = `url('${hero.dataset.bg}')`;
  }

  /* FAVORITOS */
  const btnFav = document.getElementById('btn-fav');

  function getFavoritos(){
    return JSON.parse(localStorage.getItem('favoritos')) || [];
  }

  function isFavorito(){
    return getFavoritos().some(item => item.id === CONTENT_DATA.id);
  }

  function toggleFavorito(){
    let favoritos = getFavoritos();

    if(isFavorito()){
      favoritos = favoritos.filter(i => i.id !== CONTENT_DATA.id);
      btnFav.classList.remove('active');
      btnFav.innerHTML = '<i class="fal fa-heart"></i><span>Guardar en favoritos</span>';
    }else{
      favoritos.push(CONTENT_DATA);
      btnFav.classList.add('active');
      btnFav.innerHTML = '<i class="fas fa-heart"></i><span>En favoritos</span>';
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  if(btnFav){
    btnFav.onclick = toggleFavorito;
    if(isFavorito()){
      btnFav.classList.add('active');
      btnFav.innerHTML = '<i class="fas fa-heart"></i><span>En favoritos</span>';
    }
  }

  /* SINOPSIS */
  const btnSin = document.getElementById('btn-sinopsis');
  if(btnSin){
    btnSin.onclick = () => {
      const t = document.getElementById('sinopsis-text');
      t.classList.toggle('expand');
      btnSin.textContent = t.classList.contains('expand') ? 'Ver menos' : 'Ver más';
    };
  }

});
