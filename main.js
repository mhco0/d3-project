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

    const buildCardUser = (card, senator) => {
        var cardImg = card.select("#card_img");
        var nameText = card.select("#card_user_name");
        var entourageName = card.select("#card_entourage_name");
        
        cardImg.attr("href", senator["img_ref"]);
        nameText.text(senator["full_name"]);
        entourageName.text(senator["party_acronym"]);

        card.style("visibility", "visible");
    };

    const positionBasedOn = (centerPoint, radius, angle) => {
        const x1 = centerPoint.x - radius * Math.cos(angle);
        const y1 = centerPoint.y - radius * Math.sin(angle);

        return {
            "x": x1,
            "y": y1
        };
    };

    const toRadian = (angle) => {
        return angle * (Math.PI / 180);
    };

    const getAnglePadding = (pointsInLvl, startAngle, endAngle) => {
        if (pointsInLvl == 0) return 0;

        const deltaSpace = endAngle - startAngle;

        if(deltaSpace <= 1e-8){
            console.error("space for angle too tight");
            return 0;
        }

        return deltaSpace / pointsInLvl;
    }

    var senatorObjs = [];
    var pointsPositions = [];
    var groupsColors = {
        "PSOL": "#700000",
        "PCdoB": "#A30000",
        "PT": "#CC0000",
        "PSB": "#FFCC00",
        "PDT": "#FF0000",
        "REDE": "#379E8D",
        "Cidadania": "#EC008C",
        "PV": "#006600",
        "Solidariedade": "#FF9C2B",
        "AVANTE": "#ED5F36",
        "PSDB": "#0080FF",
        "MDB": "#30914D",
        "PODE": "#2DA933",
        "Independent": "#DDDDDD",
        "NOVO": "#FF4D00",
        "PROS": "#FF5460",
        "PSD": "#FFA500",
        "UNIAO": "#254AA5",
        "PL": "#0F0073",
        "PP": "#7DC9FF",
        "Republicanos": "#005DAA",
        "PTB": "#7B7B7B",
        "PSC": "# 009118",
        "Patriota": "# 00A29B",
    };
    
    data.forEach(function(item){
        var i = senatorObjs.findIndex(x => x["parlament_id"] == item["parlament_id"]);
        if(i <= -1 && item["parlament_id"] != ""){
            senatorObjs.push(item);
        }
    });

    //console.log(senatorObjs);

    var svg = d3.select("svg");
    // style
    var width = 360;
    var height = 185;
    var circleRadius = 8;
    var textFontSize = 36;
    var textFontWeight = "bold";
    var textAlign = "center";
    var textAnchor = "middle";
    var textFontFamily = "sans-serif";

    // logic
    var pointsOnLvl = 11; // default
    var level = 0;
    var maxLevel = 5;
    var addPerLevel = [3, 2]; // even -> 0, odd -> 1
    var radiusFromCenter = 90;
    var radiusPadding = 19;
    var startAngle = 0; // degree
    var endAngle = 180; // degree
    var angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle); // thats depends of the total of points
    angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle + angleFromCenter); // thats depends of the total of points
    //console.log(angleFromCenter);
    var textCenterPoint = {
        "x": 175,
        "y": 175
    };

    // select
    var mainGroup = svg.select("g");
    var allGroups = mainGroup.selectAll("g");
    var card = svg.select("#card");
    
    for(; level < maxLevel; level++){
        var curPointsInLvl = 0;
        var angle = 0;
        
        while(curPointsInLvl < pointsOnLvl){    
            pointsPositions.push(positionBasedOn(textCenterPoint, radiusFromCenter, toRadian(angle)));
            angle += angleFromCenter;
            curPointsInLvl += 1;
        }

        //console.log("on lvl ", level);
        //console.log("many points ", pointsOnLvl);
        pointsOnLvl += addPerLevel[level % 2];
        radiusFromCenter += radiusPadding;
        angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle);
        angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle + angleFromCenter);
    }
    

    //console.log(pointsPositions);

    const enterPoints = enter => enter.append("circle")
    .attr("fill", (d) =>{
        console.log(d["party_acronym"]);
        return groupsColors[d["party_acronym"]];
    })
    .attr("r", circleRadius)
    .attr("cx", (data, index) => {
        return pointsPositions[index]["x"]; 
    })
    .attr("cy", (data, index) => {
        return pointsPositions[index]["y"];
    })
    .on("click", function(_, element) {
        console.log(element);
        buildCardUser(card, element); 
    });
    
    d3.select("body").append("svg")
    .attr("id", "new_svg")
    .attr("width", width)
    .attr("height", height)
    .append("g").selectAll("circle").data(senatorObjs).join(enterPoints)
    .on("mouseenter", function() {
        d3.select(this).style("stroke-width", "3");
        d3.select(this).style("stroke", "black");
    })
    .on("mouseleave", function() {
        d3.select(this).style("stroke-width", "0");
    });

    d3.select("#new_svg").append("text")
    .attr("x", textCenterPoint['x'])
    .attr("y", textCenterPoint['y'])
    .style("font-size", "" + textFontSize + "px")
    .style("font-weight", textFontWeight)
    .style("text-align", textAlign)
    .style("text-anchor", textAnchor)
    .style("font-family", textFontFamily)
    .text("" + senatorObjs.length);

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
