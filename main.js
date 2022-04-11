var svg = d3.select("svg");

d3.csv("./lista_parlamentar.csv", (data) => {
    console.log(Object.keys(data));
});