export class Card {
  constructor(imgSrc, onClick) {
    this.imgSrc = imgSrc;
    this.volteada = false;
    this.bloqueada = false;

    this.elemento = document.createElement("div");
    this.elemento.classList.add("card");

    this.elemento.innerHTML = `
      <div class="cara frente"></div>
      <div class="cara atras"><img src="${this.imgSrc}" alt="carta"></div>
    `;

    this.elemento.addEventListener("click", () => {
      if (!this.bloqueada) onClick(this);
    });
  }

  voltear() {
    this.volteada = !this.volteada;
    this.elemento.classList.toggle("volteada");
  }

  bloquear() {
    this.bloqueada = true;
  }
}
