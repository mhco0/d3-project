d3.csv("lista_parlamentar.csv", function(d){
    //console.log(d);
    return {
        "parlament_id": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.CodigoParlamentar"],
        "public_palament_current_id": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.CodigoPublicoNaLegAtual"],
        "email": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.EmailParlamenta"],
        "treat_form": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.FormaTratamento"],
        "full_name": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.NomeCompletoParlamentar"],
        "name": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.NomeParlamentar"],
        "sex": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.SexoParlamentar"],
        "party_acronym": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.SiglaPartidoParlamentar"],
        "uf": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.UfParlamentar"],
        "img_ref": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.UrlFotoParlamentar"],
        "pag_ref": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.UrlPaginaParlamentar"],
        "private_pag_ref": d["ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.UrlPaginaParticular"],
    };
}).then((data) => {
    //console.log(data);

    var senatorObjs = [];
    data.forEach(function(item){
    var i = senatorObjs.findIndex(x => x["parlament_id"] == item["parlament_id"]);
    if(i <= -1 && item["parlament_id"] != ""){
        senatorObjs.push(item);
    }
    });

    console.log(senatorObjs);

    var svg = d3.select("svg");
    var mainGroup = svg.select("g");
    var allGroups = mainGroup.selectAll("g");
    var card = svg.select("#card");

    const buildCardUser = (card, senator) => {
        var cardImg = card.select("#card_img");
        var nameText = card.select("#card_user_name");
        var entourageName = card.select("#card_entourage_name");
        
        cardImg.attr("href", senator["img_ref"]);
        nameText.text(senator["full_name"]);
        entourageName.text(senator["party_acronym"]);

        card.style("visibility", "visible");
    };

    //buildCardUser(card, {});
    
    /// selecting all circles inside groups
    /// if you use arrow function here the this pointer will be pointing to the navegator window
    allGroups.selectAll("circle").on("mouseenter", function() {
        d3.select(this).style("stroke-width", "3");
        d3.select(this).style("stroke", "black");
    });

    allGroups.selectAll("circle").on("mouseleave", function() {
        d3.select(this).style("stroke-width", "0");
    });
});
