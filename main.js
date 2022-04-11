var svg = d3.select("svg");
var mainGroup = svg.select("g");
var allGroups = mainGroup.selectAll("g");


/// selecting all circles inside groups
/// if you use arrow function here the this pointer will be pointing to the navegator window
allGroups.selectAll("circle").on("mouseenter", function() {
    d3.select(this).style("stroke-width", "3");
    d3.select(this).style("stroke", "black");
});

allGroups.selectAll("circle").on("mouseleave", function() {
    d3.select(this).style("stroke-width", "0");
});

d3.csv("./lista_parlamentar.csv", (data) => {
    //console.log(Object.keys(data));
});