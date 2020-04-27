var frequencyOfCountries;
var frequencyOfSuccess;
var frequencyOfTargets;


function initStatisticsResult2D(node){
    mainContent.innerHTML = loadPage(node.template);

    createMatrices();
    getFrequencies();
    addCountryPreferences();
    addSuccessRate();
    addTargetPreferences();
}

// stackoverflow.com/questions/8301400/how-do-you-easily-create-empty-matrices-javascript
function createMatrices(){
    let i;
    let j;
    frequencyOfCountries = [];
    frequencyOfTargets = [];
    for(i=1; i < countries.length; i++){
        frequencyOfCountries[countries[i][0]] = [];
        for(j=0; j<=2200; j++){
            frequencyOfCountries[countries[i][0]][j] = 0;
        }
    }
    for(i=1; i < targTypes.length; i++){
        frequencyOfTargets[targTypes[i][0]] = [];
        for(j=0; j<=2200; j++){
            frequencyOfTargets[targTypes[i][0]][j] = 0;
        }
    }

    frequencyOfSuccess = [];
    for(i=0; i<=2200; i++){
        frequencyOfSuccess[i] = 0;
    }
}

function getFrequencies(){
    let dateOccured;
    let yearOccured;
    let countryAttacked;
    let successStatus;
    let targetAttacked;
    for(attack in parsed1){
        dateOccured = parsed1[attack]["date"];
        dateOccured = dateOccured.substring(0, 4);
        yearOccured = parseInt(dateOccured);

        countryAttacked = parsed1[attack]["country"];
        successStatus = parsed1[attack]["success"];
        targetAttacked = parsed1[attack]["targType"];

        frequencyOfCountries[countryAttacked][yearOccured] = frequencyOfCountries[countryAttacked][yearOccured] + 1;
        frequencyOfTargets[targetAttacked][yearOccured] = frequencyOfTargets[targetAttacked][yearOccured] + 1;
        if(successStatus == 1){
            frequencyOfSuccess[yearOccured] =  frequencyOfSuccess[yearOccured] + 1;
        }
    }
    console.log(frequencyOfSuccess);
}

function addCountryPreferences(){
    let i;
    let data;
    let countryPreferencesDocument = document.querySelector('.plotCountry');
    data = [];
    data.push(['Year', countries[1][0], countries[2][0], countries[3][0], countries[4][0], countries[5][0]]);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfCountries[countries[1][0]][i], frequencyOfCountries[countries[2][0]][i], frequencyOfCountries[countries[3][0]][i], frequencyOfCountries[countries[4][0]][i], frequencyOfCountries[countries[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of attacks per country in the last years',
            backgroundColor: 'lightgray',
            width: 1200,
            height: 400,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(countryPreferencesDocument);
          chart.draw(dataForChart, options);
    }
}

function addSuccessRate(){
    let i;
    let data;
    let successRateDocument = document.querySelector('.plotSuccess');
    data = [];
    data.push(['Year', 'Successful terrorist attacks']);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfSuccess[i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of successful attacks in the last years',
            backgroundColor: 'lightgray',
            width: 1200,
            height: 400,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(successRateDocument);
          chart.draw(dataForChart, options);
    }
}

function addTargetPreferences(){
    let i;
    let data;
    let countryTargetDocument = document.querySelector('.plotTargets');
    data = [];
    data.push(['Year', targTypes[1][0], targTypes[2][0], targTypes[3][0], targTypes[4][0], targTypes[5][0]]);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfTargets[targTypes[1][0]][i], frequencyOfTargets[targTypes[2][0]][i], frequencyOfTargets[targTypes[3][0]][i], frequencyOfTargets[targTypes[4][0]][i], frequencyOfTargets[targTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of attacks which had a certain type of target',
            backgroundColor: 'lightgray',
            width: 1200,
            height: 400,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(countryTargetDocument);
          chart.draw(dataForChart, options);
    }
}