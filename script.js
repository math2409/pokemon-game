var characters = [];
var ennemis = [];
var niveau = 1;
var attaques = [];
let health = 100;

function initGame() {
  characters = [
    {
      name: "Kaïminus",
      type: "eau",
    },
    {
      name: "Bulbizarre",
      type: "plante",
    },
    {
      name: "Pikachu",
      type: "electrique",
    },
    {
      name: "Rondoudou",
      type: "fee",
    },
    {
      name: "Ronflex",
      type: "normal",
    },
    {
      name: "Voltali",
      type: "electrique",
    },
    {
      name: "Tortank",
      type: "eau",
    },
    {
      name: "Togepi",
      type: "normal",
    },
    {
      name: "Nidoking",
      type: "poison",
    },
    {
      name: "Cacturne",
      type: "plante",
    },
    {
      name: "Caninos",
      type: "feu",
    },
    {
      name: "Canarticho",
      type: "vol",
    },
    {
      name: "Noeunoeuf",
      type: "psy",
    },
    {
      name: "Chamallot",
      type: "feu",
    },
    {
      name: "Pachirisu",
      type: "electrique",
    },
  ];

  ennemis = [
    {
      name: "Spinda",
      type: "normal",
      health: 100,
      ennemiAttacks: [
        { nom: "Charge", puissance: 40, pp: 35, type: "normal" },
        {
          nom: "Rafale Psy",
          puissance: 65,
          pp: 20,
          type: "psy",
        },
        // {
        //     nom: "Psyko",
        //     puissance: 90,
        //     pp: 10,
        //     type: "psy",
        // }
      ],
    },
    {
      name: "Ludicolo",
      type: "eau",
      health: 100,
      ennemiAttacks: [
        {
          nom: "Bulles d'O",
          puissance: 65,
          pp: 20,
          type: "eau",
        },
        {
          nom: "Méga-Sangsue",
          puissance: 40,
          pp: 15,
          type: "plante",
        },
      ],
    },
    {
      name: "Tortipouss",
      type: "plante",
      health: 100,
      ennemiAttacks: [
        {
          nom: "Tranch'Herbe",
          puissance: 55,
          pp: 25,
          type: "plante",
        },
        {
          nom: "Tempête Verte",
          puissance: 130,
          pp: 5,
          type: "plante",
        },
      ],
    },
  ];

  attaques = [
    {
      nom: "Fouet Lianes",
      puissance: 45,
      pp: 25,
      type: "plante",
    },
    {
      nom: "Tonnerre",
      puissance: 90,
      pp: 15,
      type: "electrique",
    },
    {
      nom: "Psyko",
      puissance: 90,
      pp: 10,
      type: "psy",
    },
    {
      nom: "Ultralaser",
      puissance: 150,
      pp: 5,
      type: "normal",
      cooldown: true,
    },
  ];

  niveau = 1;
  choixPokemon();
}

function randomNum(max, min) {
  // generate a random number

  // min not required
  if (min === undefined || min === "" || min === null) {
    // min default value
    min = 0;
  }

  // random number, yay
  return Math.floor(Math.random() * (max - min) + min);
}

function clearText() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      $(".texte").empty();
      $(".texte").css({ display: "none" });
      $(".liste-attaque").css({ display: "grid" });
      resolve();
    }, 1000);
  });
}

function slowPrint(texte) {
  //Ecrit le texte lettre par lettre dans la balise du texte de combat
  $(".liste-attaque").css({ display: "none" });
  $(".texte").css({ display: "flex" });
  $(".texte").append('<h3 class="texte_combat"></h3>');
  let i = 0;
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      document.getElementsByClassName("texte_combat").item(0).innerHTML +=
        texte[i];
      i++;
      if (i >= texte.length) {
        clearInterval(interval);
        await clearText();
        resolve();
      }
    }, 30);
  });
}

var combattant = {};
var ennemi = {};
var attaqueName = "";
var monAttaque = {};

function choixPokemon() {
  // Crée la liste des pokemons à choisir
  for (var i in characters) {
    $(".choix").append(
      '<div class="pokemon"><img src="images/' +
        characters[i].name +
        '/choix.png" class="img_pokemon"><h3 class="pokemon_name">' +
        characters[i].name +
        "</h3></div>"
    );
  }
  // Ajoute l'évènement 'si on clique sur ce pokemon, ça devient notre combattant'
  $(".pokemon").click(function () {
    var name = $(this).children("h3").text();
    $(".music")[0].play();
    for (var i in characters) {
      if (characters[i].name == name) {
        combattant = characters[i];
        characters.splice(i, 1);
        // j = randomNum(characters.length,0)
        // ennemi = characters[j];
        // characters.splice(j,1);
        choixEnnemi();
      }
    }
  });
}

function choixEnnemi() {
  // Détermine le prochain ennemi
  if (ennemis.length > 0) {
    $(".ennemi").empty();
    ennemi = ennemis[0];
    initCombat();
  } else {
    // Si tous les ennemis sont vaincus, termine le jeu
    odj();
  }
}

async function initCombat() {
  //Retire la liste de choix
  $(".choix").empty();
  $(".subtitle").empty();
  // Ajoute les combattants à l'arène
  if (ennemis.length == 3) {
    $(".combattant").append(
      '<img src="images/' +
        combattant.name +
        '/dos.gif" class="img_combattant">'
    );
    $(".combattant").append(
      `
    <div class="infoBox" id="playerInfo">
      <div class="topRow" id="playerTopRow">
        <span class="bar-name" id="playerName">${combattant.name}</span>
      </div>
      <div class="healthBarContainer" id="playerHealthContainer">
        <span class="hp">HP</span>
        <div class="healthBar" id="playerHealthBar"><span class="healthFill"id="playerHealthFill"></span></div>
      </div>
    </div>
    `
    );

    await slowPrint(combattant.name + " ! Au combat !");
  }

  $(".ennemi").append(
    `
    <div class="infoBox" id="enemyInfo">
      <div class="topRow" id="enemyTopRow">
        <span class="bar-name" id="enemyName">${ennemi.name}</span>
      </div>
      <div class="healthBarContainer" id="enemyHealthContainer">
        <span class="hp">HP</span>
        <div class="healthBar" id="enemyHealthBar"><span class="healthFill"id="enemyHealthFill"></span></div>
      </div>
    </div>
    `
  );
  $(".ennemi").append(
    '<img src="images/' + ennemi.name + '.gif" class=img_combattant>'
  );

  await slowPrint("Mathias envoie un " + ennemi.name + " !");

  if (ennemis.length == 3) {
    attackMenu();
  }
}

function attackMenu() {
  // Crée la liste des attaques
  for (var i in attaques) {
    $(".liste-attaque").append(
      `<li class="attaque" id="${attaques[i].nom.replace(
        " ",
        ""
      )}"><p class="nom-attaque">${
        attaques[i].nom
      }</p><p class="puissance">Puissance : ${
        attaques[i].puissance
      }</p><p class="pp">PP : ${attaques[i].pp}</p></li>`
    );
  }
  // Crée l'évènement 'si on clique sur une attaque, déclenche la phase attaque'
  $(".attaque").click(async function () {
    attaqueName = $(this).children(".nom-attaque").text();
    // Récupère les données de l'attaque
    for (var i in attaques) {
      if (attaques[i].nom == attaqueName) {
        if (attaques[i].pp > 0) {
          attaques[i].pp -= 1;
          monAttaque = attaques[i];
          console.log(attaques[i]);
          $(`#${attaques[i].nom.replace(" ", "")} .pp`).text(
            `PP : ${attaques[i].pp}`
          );
          attack(monAttaque);
        } else {
          await slowPrint("Vous n'avez plus de PP !");
          monAttaque = attaques[i];
        }
      }
    }
  });
}

async function attack(attaqueObject) {
  // S'il reste des pp, lance l'attaque
  if (attaqueObject.pp >= 0) {
    $(".liste-attaque").addClass("disabled");
    $(".combattant .img_combattant").animate(
      {
        "margin-left": "-30px",
        "margin-top": "10px",
      },
      50,
      "swing"
    );
    $(".ennemi .img_combattant").animate(
      {
        "margin-left": "0px",
        "margin-top": "0px",
      },
      50,
      "swing"
    );
    $(".combattant .img_combattant").animate(
      {
        "margin-left": "30px",
        "margin-top": "-15px",
      },
      50,
      "swing"
    );
    $(".ennemi .img_combattant").animate(
      {
        "margin-left": "30px",
        "margin-top": "-10px",
      },
      50,
      "swing"
    );
    $(".combattant .img_combattant").animate(
      {
        "margin-left": "0px",
        "margin-top": "0px",
      },
      50,
      "swing"
    );
    $(".ennemi .img_combattant").animate(
      {
        "margin-left": "0px",
        "margin-top": "0px",
      },
      50,
      "swing"
    );

    // Mise à jour de la barre de vie
    ennemi.health -= (attaqueObject.puissance * 3) / 10;
    console.log(ennemi.health);
    $("#enemyHealthFill").animate(
      {
        width: ennemi.health.toString() + "%",
      },
      200,
      "linear"
    );
    await slowPrint(combattant.name + " utilise " + attaqueObject.nom + " !");
    if (ennemi.health <= 0) {
      ennemis.splice(0, 1);
      await slowPrint(ennemi.name + " est KO !");
      choixEnnemi();
    } else {
      ennemiAttack =
        ennemi.ennemiAttacks[randomNum(ennemi.ennemiAttacks.length)];
      $(".ennemi .img_combattant").animate(
        {
          "margin-left": "30px",
          "margin-top": "-10px",
        },
        50,
        "swing"
      );
      $(".combattant .img_combattant").animate(
        {
          "margin-left": "0px",
          "margin-top": "0px",
        },
        50,
        "swing"
      );
      $(".ennemi .img_combattant").animate(
        {
          "margin-left": "-30px",
          "margin-top": "15px",
        },
        50,
        "swing"
      );
      $(".combattant .img_combattant").animate(
        {
          "margin-left": "-30px",
          "margin-top": "10px",
        },
        50,
        "swing"
      );
      $(".ennemi .img_combattant").animate(
        {
          "margin-left": "0px",
          "margin-top": "0px",
        },
        50,
        "swing"
      );
      $(".combattant .img_combattant").animate(
        {
          "margin-left": "0px",
          "margin-top": "0px",
        },
        50,
        "swing"
      );

      // Mise à jour de la barre de vie
      health -= (ennemiAttack.puissance * 2.3) / 10;
      $("#playerHealthFill").animate(
        {
          width: health.toString() + "%",
        },
        200,
        "linear"
      );
      await slowPrint(ennemi.name + " utilise " + ennemiAttack.nom + " !");
      if (health <= 0) {
        await slowPrint(combattant.name + " est KO !");
        await slowPrint("Vous avez perdu !");
      }
    }
  }
}

function odj() {
  $("#combat").empty();
  $("#odj").css({ display: "flex" });
}

initGame();
