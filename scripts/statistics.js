let paginaActual = document.querySelector("#senate") ? "senate" : "house";
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

function dataApi(data){
  let statistics = {
    democrats: [],
    republicans: [],
    independets: [],
    total: [],
    totalVoted: 0,
  };
  statistics.democrats = data.filter((miembro) => miembro.party === "D");
  statistics.republicans = data.filter((miembro) => miembro.party === "R");
  statistics.independets = data.filter((miembro) => miembro.party === "ID");
  statistics.total = statistics.democrats.length + statistics.republicans.length + statistics.independets.length;
  tableStatistics(filtrarPorcentajes(data, false, "missed_votes"),"leastEngaged", "missed_votes", "missed_votes_pct");
  tableStatistics(filtrarPorcentajes(data, true, "missed_votes"), "mostEngaged",  "missed_votes", "missed_votes_pct");
  tableStatistics(filtrarPorcentajes(data, true, "votes_with_party_pct"), "leastLoyal", "total_votes", "votes_with_party_pct");
  tableStatistics(filtrarPorcentajes(data, false, "votes_with_party_pct"), "mostLoyal", "total_votes", "votes_with_party_pct");

  /********* Senate at a glance ***********/
function tableAttendance(statistics, id) {
  if(Number(calcularPromedio(statistics.independets)) === 0){
    statistics.totalVoted = ((Number(calcularPromedio(statistics.democrats)) + Number(calcularPromedio(statistics.republicans))) / 2).toFixed(2);
  }else{
    statistics.totalVoted = ((Number(calcularPromedio(statistics.democrats)) + Number(calcularPromedio(statistics.republicans)) + Number(calcularPromedio(statistics.independets))) / 3).toFixed(2);
  }
  const tableID = document.querySelector(`#${id} tbody`);
  tableID.innerHTML += `
    <tr><td>Democrats</td><td>${statistics.democrats.length}</td><td>${calcularPromedio(statistics.democrats)} &percnt;</td></tr>
    <tr><td>Republicans</td><td>${statistics.republicans.length}</td><td>${calcularPromedio(statistics.republicans)} &percnt;</td></tr>
    <tr><td>Independets</td><td>${statistics.independets.length}</td><td>${calcularPromedio(statistics.independets)} &percnt;</td><tr>
    <tr><td>Total</td><td>${statistics.total}</td><td>${statistics.totalVoted} &percnt;</td><tr>`;
}
tableAttendance(statistics, "attendance");
}

function tableStatistics(array, id, dato, dato2) {
  const tableID = document.querySelector(`#${id} tbody`);
  if (tableID) {
    array.forEach((array) => {
      const name = `${array.first_name}, ${array.middle_name || ""} ${array.last_name || ""}`;
      const votoPromedio = array[dato] * array.votes_with_party_pct / 100; // se calcula la cantidad de votos a favor o en contra del partido segun su porcentaje
    tableID.innerHTML += `<tr>
    <td>${name}</td>
    <td>${votoPromedio.toFixed(0)}</td>
    <td>${array[dato2]} %</td>
    </tr>
    `;
    });
  }
}

/******** Calcular promedio Attendance*********/
function calcularPromedio(array) {
  let promedio = 0;
  let cantidad = array.length;
  let suma = array.reduce((acumulador, dato) => {
    return (acumulador += dato.votes_with_party_pct);  
  }, 0);
  if (suma != 0) {
    return promedio = Number(suma / cantidad).toFixed(2);
  }
  return promedio.toFixed(2);
}

/******** Filtrar (TOP 10)*********/
function filtrarPorcentajes(array, mayorMenor, dato) {
  let arrayAuxiliar = [...array];
  let arrayAuxiliar2 = [];

  arrayAuxiliar.sort((arrayA, arrayB) => {
    if (mayorMenor) {
      return arrayA[dato] - arrayB[dato];
    } else {
      return arrayB[dato] - arrayA[dato];
    }
  });
  if (dato === "missed_votes") {
    let limite = Math.round((arrayAuxiliar.length * 10 / 100) - 1);
   
    let limite10P = arrayAuxiliar[limite]
 
      arrayAuxiliar2 = arrayAuxiliar.filter((dato) => {
      return mayorMenor ? dato.missed_votes <= limite10P.missed_votes && dato.total_votes != 0 : dato.missed_votes >= limite10P.missed_votes;
    });
  } else {
    let limite = Math.round((arrayAuxiliar.length * 10 / 100) - 1);
   
    let limite10P = arrayAuxiliar[limite]
  
    arrayAuxiliar2 = arrayAuxiliar.filter((dato) => {
      return mayorMenor ? dato.votes_with_party_pct <= limite10P.votes_with_party_pct && dato.votes_with_party_pct != 0 : dato.votes_with_party_pct >= limite10P.votes_with_party_pct;
    });
  }
  return arrayAuxiliar2;
}
