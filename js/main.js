$(document).ready(function() {
  const $eixo = document.querySelector("input#eixo-check");
  const $garra = document.querySelector("input#garra-check");
  const $btnPOST = document.querySelector("#submitForm");
  const $btnNew = document.querySelector("#newCommand");
  const $btnReset = document.querySelector("#resetCommand");
  const $btnDemo = document.querySelector("#demoCommand");

  const $div_garra = document.querySelector("div.garra");
  const $div_eixo = document.querySelector("div.eixo");

  const commands = [];

  $($garra).click(() => {
    setupGarra();
  });

  $($eixo).click(() => {
    setupEixo();
  });

  $($btnNew).click(() => {
    console.log("new");
    if (isNullorEmpty()) {
      return;
    } else {
      const values = getValues();
      const text = parseData(values);
      renderCommands(text);
      commands.push(values);
      console.log(commands);
      resetInputs();
    }
  });

  $($btnDemo).click(() => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/demo", {})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  $($btnReset).click(() => {
    const data = { start: "G1 X0.00 Y0.00 Z0.00" };
    event.preventDefault();
    axios
      .post("http://localhost:3000/exec", {
        data
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  $($btnPOST).click(() => {
    const data = commands;
    event.preventDefault();

    if (commands.length === 0) {
      alert("Adicione um comando antes de enviar");
    } else {
      axios
        .post("http://localhost:3000", {
          data
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  });

  // TODO: renderizar cada item de commands
  function renderCommands(text) {
    const $ul = document.querySelector("ul.itens");
    const item = document.createElement("li");
    item.textContent = text;
    $ul.appendChild(item);
  }

  function parseData(data) {
    const command = data.command;

    if (command === "eixo") {
      const qual_eixo = data.action.eixo;
      const valor = data.action.valor;

      const text = `eixo ${qual_eixo} → mover ${valor}`;
      return text;
    } else {
      let status = data.action;
      status === "true" ? (status = "abrir") : (status = "fechar");
      const text = `garra → ${status}`;
      return text;
    }
  }

  function resetInputs() {
    document.querySelector("select#eixos").value = "";
    document.querySelector("select#garras").value = "";
    document.querySelector("input#quant-move-eixo").value = 1;
  }

  function fadeMainChoise() {
    const $main = document.querySelector("div.main-choise");
    const $main_opacity = $main.style.opacity;

    if ($main_opacity == 1 || $main_opacity == "") {
      $main.style.opacity = 0;
    } else {
      $main.style.opacity = 1;
    }
  }

  function isNullorEmpty() {
    const eixos = document.querySelector("select#eixos").value;
    const garras = document.querySelector("select#garras").value;
    const quant_eixo = document.querySelector("input#quant-move-eixo").value;

    if ($garra.checked) {
      if (garras === "") {
        return true;
      }
    } else {
      if (eixos === "" || quant_eixo === "") {
        return true;
      }
    }
    return;
  }

  function getValues() {
    const qual_eixo = document.querySelector("select#eixos").value;
    const value_garras = document.querySelector("select#garras").value;
    const quanto_move_eixo = document.querySelector("input#quant-move-eixo")
      .value;

    if ($garra.checked) {
      return {
        command: "garra",
        action: value_garras
      };
    } else {
      return {
        command: "eixo",
        action: {
          eixo: qual_eixo,
          valor: quanto_move_eixo
        }
      };
    }
  }

  function setupEixo() {
    fadeMainChoise();
    addHideDiv($div_garra, $div_eixo);
    requiredEixo();
  }

  function setupGarra() {
    fadeMainChoise();
    addHideDiv($div_eixo, $div_garra);
    requiredGarra();
  }

  function addHideDiv($divHide, $divShow) {
    setTimeout(_ => {
      $divHide.classList.add("d-none");
      $divShow.classList.remove("d-none");
      fadeMainChoise();
    }, 300);
  }

  function requiredEixo() {
    document.querySelector("select#garras").required = false;
    document.querySelector("select#eixos").required = true;
    document.querySelector("input#quant-move-eixo").required = true;
  }

  function requiredGarra() {
    document.querySelector("select#garras").required = true;
    document.querySelector("select#eixos").required = false;
    document.querySelector("input#quant-move-eixo").required = false;
  }
});
