d3.csv("lista_parlamentar.csv").then((data) => {
    console.log(data);

    var svg = d3.select("svg");
    var mainGroup = svg.select("g");
    var allGroups = mainGroup.selectAll("g");
    var card = svg.select("#card");

    const buildCardUser = (card, user) => {
        var cardImg = card.select("#card_img");
        var nameText = card.select("#card_user_name");
        var entourageName = card.select("#card_entourage_name");
        
        cardImg.attr("href", "user_href_goes_here");
        nameText.text("user_text_goes_here");
        entourageName.text("user_entourage_text_goes_here");

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
