
let paginaActual = document.querySelector("title") ? "senate" : "house";
let endPoint = `https://api.propublica.org/congress/v1/113/${paginaActual}/members.json`

let init = {
  method: "GET",
  headers: {
    "X-API-Key":"npXc5aP6rSKvX4l1kLL4YalMFgYVUk1f6oQAYjpo"
  }
}

fetch(endPoint, init)
  .then(res => res.json())
  .then(data => {
    let datas = data.results[0].members;
    dataApi(datas)
  })
  .catch(err => console.error(err.message))

function dataApi(data) { 
  checkbox.forEach((party) => {
    party.addEventListener("change", () => {
      let checked = seleccion(checkbox);
      if (checked.length) { 
        filtrarTable(filtrarPorPartido(data, checked))
        return resultado = filtrarPorPartido(data, checked)
      } else {
        msjAviso();
      }
    });
  });
  imprimirEstados(filtrarEstados(data));
 }

const tBody = document.querySelector(".table tbody");

/*********** Imprime tabla en el HTML *************/
function filtrarTable(array) {
  tBody.innerHTML = "";
  array.forEach((member) => {
    const name = `${member.first_name}, ${member.middle_name || ""} ${
      member.last_name || ""
    }`;
    tBody.innerHTML += `
    <tr>
        <td><a href="http://${member.url}" target="_blank">${name}</a></td>
        <td>${member.party}</td>
        <td>${member.state}</td>
        <td>${member.seniority}</td>
        <td>${member.votes_with_party_pct}</td>
    </tr>
    `;
  });
}

/************** Msj de aviso************/
function msjAviso() {
  tBody.innerHTML = `<div class="alert alert-danger d-flex m-2 col-12" role="alert">
  Select an option: First the State (default all) and then the parties. 
</div>`;
}

/*********** filtros por estados ***********/
let state = [];
function filtrarEstados(arrays) {
  arrays.map((array) => {
    if (!state.includes(array.state)) {
      // No repite estados
      state.push(array.state);
    }
  });
  return state.sort();
}

/**********Imprime los estados en los selectores************/
let select = document.getElementById("state");
function imprimirEstados(state) {
  state.forEach((states) => {
    select.innerHTML += `<option class="selector" value="${states}">${states}</option>`;
  });
}
/******* filtros por estdo junto con partidos **********/
select.addEventListener('change', (event) => {
  filtrarState(resultado, event.target.value)
});

/* filtrar estados */
let estadosSeleccionados;
function filtrarState(array, select) {
   if (select !== "All") {
    estadosSeleccionados = array.filter((estado) => estado.state == select);
  } else {
    estadosSeleccionados = array;
  }
  filtrarTable(estadosSeleccionados); // envia el filtrado final 
}

/* Seleccion de los checkbox del HTML */
let checkbox = document.querySelectorAll(".party");
function seleccion(checkbox) {
  let array2 = [];
  checkbox.forEach((check) => {
    if (check.checked) {
      array2.push(check.value);
    }
  });
  return array2;
}

function filtrarPorPartido(miembros, array) {
  return miembros.filter((miembro) => array.includes(miembro.party));
}

/*****Cambiar texto del boton*****/

function readMore(){
  boton = document.getElementById("button")
  boton.innerHTML === "Read Less" ? boton.innerHTML = "Read More" : boton.innerHTML = "Read Less";
}  


