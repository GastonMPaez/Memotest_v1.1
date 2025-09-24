import { Card } from "./card.js";

export class Tablero {
  constructor(contenedorId, tamanio) {
    this.contenedor = document.getElementById(contenedorId);
    this.tamanio = tamanio;
    this.cartas = [];
    this.imagenesDisponibles = [
      "resources/img/001.png",
      "resources/img/002.png",
      "resources/img/003.png",
      "resources/img/004.png",
      "resources/img/005.png",
      "resources/img/006.png",
      "resources/img/007.png",
      "resources/img/008.png",
      "resources/img/009.png",
      "resources/img/010.png",
      "resources/img/011.png",
      "resources/img/012.png",
    ];

    this.primeraCarta = null;
    this.bloqueo = false;
    this.paresEncontrados = 0;

    this.movimientos = 0;
    this.tiempo = 0;
    this.timerId = null;
    this.timerActivo = false;

    this.movimientosElem = document.getElementById("movimiento");
    this.tiempoElem = document.getElementById("tiempo");
    this.paresDescElem = document.getElementById("pares-descubiertos");
  }

  formatearTiempo(segundosTotales) {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  }

  detenerTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.timerActivo = false;
  }

  generar() {
    this.detenerTimer();

    this.contenedor.innerHTML = "";
    this.cartas = [];
    this.primeraCarta = null;
    this.bloqueo = false;
    this.paresEncontrados = 0;

    this.movimientos = 0;
    this.tiempo = 0;
    this.movimientosElem.textContent = this.movimientos;
    this.tiempoElem.textContent = this.formatearTiempo(this.tiempo);
    this.paresDescElem.textContent = this.paresEncontrados;

    this.contenedor.style.gridTemplateColumns = `repeat(${this.tamanio}, 1fr)`;

    const pares = (this.tamanio * this.tamanio) / 2;

    let seleccionadas = [...this.imagenesDisponibles]
      .sort(() => Math.random() - 0.5)
      .slice(0, pares);

    let baraja = [...seleccionadas, ...seleccionadas]
      .sort(() => Math.random() - 0.5);

    baraja.forEach(src => {
      const carta = new Card(src, () => this.manejarClick(carta));
      this.contenedor.appendChild(carta.elemento);
      this.cartas.push(carta);
    });
  }

  iniciarTimer() {
    if (this.timerActivo) return;
    this.timerActivo = true;

    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(() => {
      this.tiempo++;
      this.tiempoElem.textContent = this.formatearTiempo(this.tiempo);
    }, 1000);
  }

  manejarClick(carta) {
    if (this.bloqueo || carta.volteada) return;

    if (!this.timerActivo) this.iniciarTimer();

    carta.voltear();

    if (!this.primeraCarta) {
      this.primeraCarta = carta;
    } else {
      this.movimientos++;
      this.movimientosElem.textContent = this.movimientos;

      if (this.primeraCarta.imgSrc === carta.imgSrc) {
        this.primeraCarta.bloquear();
        carta.bloquear();
        this.paresEncontrados++;
        this.paresDescElem.textContent = this.paresEncontrados;

        if (this.paresEncontrados === this.cartas.length / 2) {
          this.detenerTimer();
          this.mostrarMensajeFinal();
        }
      } else {
        this.bloqueo = true;
        const primera = this.primeraCarta;
        const segunda = carta;

        setTimeout(() => {
          primera.voltear();
          segunda.voltear();
          this.bloqueo = false;
        }, 1000);
      }

      this.primeraCarta = null;
    }
  }

  mostrarMensajeFinal() {
    const modal = document.getElementById("modal");
    const modalMsg = document.getElementById("modalMsg");
    if (modalMsg)
      modalMsg.textContent = `¡Ganaste en ${this.movimientos} movimientos y un tiempo de ${this.formatearTiempo(this.tiempo)}!`;
    if (modal) modal.style.display = "flex";
  }

  reiniciar() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
    this.detenerTimer();
    this.generar();
  }
}
