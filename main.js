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
        nameText.text(senator["name"]);
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
        "CIDADANIA": "#EC008C",
        "PV": "#006600",
        "SOLIDARIEDADE": "#FF9C2B",
        "AVANTE": "#ED5F36",
        "PSDB": "#0080FF",
        "MDB": "#30914D",
        "PODEMOS": "#2DA933",
        "INDEPENDENT": "#DDDDDD",
        "NOVO": "#FF4D00",
        "PROS": "#FF5460",
        "PSD": "#FFA500",
        "UNIAO": "#254AA5",
        "PSL": "#254AA5",
        "DEM":"#254AA5",
        "PL": "#0F0073",
        "PP": "#7DC9FF",
        "REPUBLICANOS": "#005DAA",
        "PTB": "#7B7B7B",
        "PSC": "#009118",
        "PATRIOTA": "#00A29B",
    };

    //var gS = {};
    
    data.forEach(function(item){
        var i = senatorObjs.findIndex(x => x["parlament_id"] == item["parlament_id"]);
        if(i <= -1 && item["parlament_id"] != ""){
            senatorObjs.push(item);

            /*if (item["party_acronym"] in gS){
                gS[item["party_acronym"]] += 1;
            }else{
                gS[item["party_acronym"]] = 1;
            }*/
        }
    });

    //console.log(gS);

    // style
    var minWidth = 720;
    var minHeight = 480;
    
    var cardWidth = 180;
    var cardHeight = 150;
    var cardBoarderRadius = 8;
    var cardBorderColor = "black";
    var cardBorderWidth = 50;
    var cardImageWidth = 100;
    var cardImageHeight = 100;
    var cardBackgroudColor = "#FFFFFF";
    var cardTextAlign = "center";
    var cardTextAnchor = "middle";
    var cardTextFontFamily = "sans-serif";
    var cardExitButtonWidth = 25; 
    var cardExitButtonHeight = 15; 

    var cardUserNamePos = {
        "x": cardWidth / 2,
        "y": 120
    };

    var cardEntourageNamePos = {
        "x": cardWidth / 2,
        "y": 140
    };

    var cardExitButtonPos = {
        "x": cardWidth - cardExitButtonWidth - 5,
        "y": 5
    }

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
    var angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle);
    angleFromCenter = getAnglePadding(pointsOnLvl, startAngle, endAngle + angleFromCenter); /// thats depends of the total of points
    //console.log(angleFromCenter);
    var textCenterPoint = {
        "x": 175,
        "y": 175
    };
    
    /// adding points based on members
    for(; level < maxLevel; level++){
        var curPointsInLvl = 0;
        var angle = 0;
        
        while(curPointsInLvl < pointsOnLvl){
            var curPoint = positionBasedOn(textCenterPoint, radiusFromCenter, toRadian(angle));
            curPoint["teta"] = angle;
            curPoint["radius"] = radiusFromCenter;
            pointsPositions.push(curPoint);
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

    var sortedSenatorByGroup = senatorObjs.slice(0) // copys the array;

    /*for(let curPoint = 0, j = 0, base = 0, pointsOverLvls = 0, level = 0; j < pointsPositions.length; j++){
        curPoint = base + pointsOverLvls;
        sortedPointsPositions.push(pointsPositions[curPoint]);
        
        pointsOverLvls += 11;
        
        for (let k = 0; k < level; k++){
            pointsOverLvls += addPerLevel[k % 2];
        }

        level += 1;
        
        if (level == maxLevel){
            level = 0;
            base += 1;
            pointsOverLvls = 0;
        }
    }*/

    pointsPositions.sort((a, b) => {
        return toRadian(a["teta"]) - toRadian(b["teta"]) || b["radius"] - a["radius"];
    });

    sortedSenatorByGroup.sort((a, b) => {
        let aIndex = Object.keys(groupsColors).indexOf(a["party_acronym"]);
        let bIndex = Object.keys(groupsColors).indexOf(b["party_acronym"]);

        if (aIndex > bIndex) return 1;
        else if(aIndex < bIndex) return -1;
        else return 0;
    })

    const enterPoints = enter => enter.append("circle")
    .attr("fill", (data, index) =>{
        //console.log(data["party_acronym"]);

        if (data["party_acronym"] in groupsColors) return groupsColors[data["party_acronym"]];
        
        return "black";
    })
    .attr("r", circleRadius)
    .attr("cx", (data, index) => {
        return pointsPositions[index]["x"]; 
    })
    .attr("cy", (data, index) => {
        return pointsPositions[index]["y"];
    })
    .on("click", function(_, element) {
        //console.log(element);
        buildCardUser(d3.select("#card"), element); 
        d3.select("#card")
        .attr("transform", "translate("+ d3.select(this).attr("cx") + "," + d3.select(this).attr("cy") + ") translate(" + -cardWidth / 2 + ", -20)")
    }).append("title").text((d) => {
        return d["party_acronym"];
    });
    
    /// adding points with the connected data
    d3.select("body").append("svg")
    .attr("id", "new_svg")
    .attr("width", minWidth)
    .attr("height", minHeight)
    .style("width", "100%")
    .style("height", "100%")
    .style("display", "block")
    .style("margin", "0 auto")
    .append("g")
    .attr("id", "view_group")
    .attr("transform", "translate(" + minWidth / 2 + "," + minHeight / 2 + ") scale(2, 2)");

    d3.select("#view_group").selectAll("circle").data(sortedSenatorByGroup).join(enterPoints);
    
    d3.select("#view_group").selectAll("circle").on("mouseenter", function() {
        d3.select(this).style("stroke-width", "3");
        d3.select(this).style("stroke", "black");
    })
    .on("mouseleave", function() {
        d3.select(this).style("stroke-width", "0");
    });
    
    /// adding text based on style and  data points
    /// if you use arrow function here the this pointer will be pointing to the navegator window
    d3.select("#new_svg").select("g").append("text")
    .attr("x", textCenterPoint['x'])
    .attr("y", textCenterPoint['y'])
    .style("font-size", "" + textFontSize + "px")
    .style("font-weight", textFontWeight)
    .style("text-align", textAlign)
    .style("text-anchor", textAnchor)
    .style("font-family", textFontFamily)
    .text("" + senatorObjs.length);

    /// adding card for click
    d3.select("#new_svg").select("g").append("g")
    .attr("id", "card")
    .style("visibility", "hidden")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", cardWidth)
    .attr("height", cardHeight)
    .style("text-align", cardTextAlign)
    .style("text-anchor", cardTextAnchor)
    .style("font-family", cardTextFontFamily);

    d3.select("#card").append("rect")
    .style("fill", cardBackgroudColor)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", cardWidth)
    .attr("height", cardHeight)
    .attr("rx", cardBoarderRadius)
    .style("border-color", cardBorderColor)
    .style("border-width", cardBorderWidth + "px");

    d3.select("#card").append("image")
    .attr("id", "card_img")
    .attr("x", cardWidth / 2 - cardImageWidth / 2)
    .attr("y", 2)
    .attr("href", "")
    .attr("width", cardImageWidth)
    .attr("height", cardImageHeight);
    
    d3.select("#card").append("text")
    .attr("id", "card_user_name")
    .attr("x", cardUserNamePos["x"])
    .attr("y", cardUserNamePos["y"])
    .text("Some");

    d3.select("#card").append("text")
    .attr("id", "card_entourage_name")
    .attr("x", cardEntourageNamePos["x"])
    .attr("y", cardEntourageNamePos["y"])
    .text("Text");

    d3.select("#card").append("g").append("rect")
    .attr("x", cardExitButtonPos["x"])
    .attr("y", cardExitButtonPos["y"])
    .attr("width",cardExitButtonWidth)
    .attr("height", cardExitButtonHeight)
    .style("fill", "red")
    .on("click", function(){
        d3.select("#card").style("visibility", "hidden");
    });
    
});
