import { Tablero } from "./table.js";

let tablero = null;

const btnNormal = document.getElementById("btnNormal");
const btnDificil = document.getElementById("btnDificil");
const btnReiniciar = document.getElementById("btnReiniciar");

btnNormal.addEventListener("click", () => {
  iniciarJuego(4);
});

btnDificil.addEventListener("click", () => {
  iniciarJuego(6);
});

btnReiniciar.addEventListener("click", () => {
  if (tablero) tablero.reiniciar();
});

function iniciarJuego(tamanio) {
  
  if (tablero) {
    tablero.detenerTimer?.();
  }

  tablero = new Tablero("tablero", tamanio);
  tablero.generar();
}
