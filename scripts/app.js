// Main js file for the project

let mainContent; // when the page is loades, this will get a reference to the HTML element containing the main content of the web app

// ------------------------------------------------------ Application models -------------------------------------------------

class Attack {
    constructor(id, latitude, langitude) {
        this.id = id;
        this.latitude = latitude;
        this.langitude = langitude;
    }
}

// ------------------------------------------------------ Fake database ------------------------------------------------------

let attacks = [];

attacks.push(new Attack(1, 18.456792, -69.9512));
attacks.push(new Attack(2, 19.37189, -99.0866));
attacks.push(new Attack(3, 15.4786, -120.5997));

// ------------------------------------------------------ Templates ----------------------------------------------------------

let homePage = `
    <section id="home">
        Home Page
    </section>
`;

let statisticsPage = `
<div class='statisticsForm'>
    <!-- <section class='videoContainer'>
     <video autoplay muted loop id="myVideo">
         <source src="soldiers.mp4" type="video/mp4">
     </video>
 </section> -->

    <h1>Terrorism record search</h1>

    <div class='firstRow1'>
        <div class='dateForm'>
            <label for='dateInput' id='textDateInterval'><b>Date Interval:</b></label>
            <input type='date' id='dateInput'></input>
            <span>-</span>
            <input type='date' id='dateInput'></input>
        </div>
    </div>
    <div class='firstRow2'>
        <div class='nrTerrForm'>
            <label for='nrTerrInput'><b>Number of terrorists:</b></label>
            <input type='text' id='nrTerrInput'></input>
            <span>-</span>
            <input type='text' id='nrTerrInput'></input>
        </div>
        <div class='nrDeathsForm'>
            <label for='nrDeathsInput'><b>Number of deaths:</b></label>
            <input type='text' id='nrDeathsInput'></input>
            <span>-</span>
            <input type='text' id='nrDeathsInput'></input>
        </div>
        <div class='nrWoundedForm'>
            <label for='nrWoundedInput'><b>Number of wounded:</b></label>
            <input type='text' id='nrWoundedInput'></input>
            <span>-</span>
            <input type='text' id='nrWoundedInput'></input>
        </div>
    </div>

    <div class='secondRow'>
        <div class='attackTypeForm'>
            <!-- Attack list is generated in actions.js-->
        </div>
        <div class='targetTypeForm'>
            <!-- Target list is generated in actions.js-->
        </div>
        <div class='weaponTypeForm'>
            <!-- Weapon list is generated in actions.js-->
        </div>
        <div class='damageForm'>
            <label><b>Amount of damage made</b></label>
            <br>
            <input type='radio' id='minorDamage' name='amountDamage'>Minor damages</input>
            <br>
            <input type='radio' id='majorDamage' name='amountDamage'>Major damages</input>
            <br>
            <input type='radio' id='catastrophicDamage' name='amountDamage'>Catastrophic damages</input>
            <br>
            <input type='radio' id='unknownDamage' name='amountDamage'>Unknown damages</input>
        </div>
    </div>

    <div class='thirdRow'>
        <div class='regionForm'>
            <!-- Region list is generated in actions.js-->
        </div>
        <div class='countryForm'>
            <!-- Country list is generated in actions.js-->
        </div>
    </div>

    <div class='fourthRow'>
        <div class='successForm'>
            <label for='succesInput'><b>Successfull attack</b></label>
            <input type='checkbox' id='succesInput'></input>
        </div>
        <div class='knownForm'>
            <label for='knownInput'><b>It is known who attacked</b></label>
            <input type='checkbox' id='knownInput'></input>
        </div>
    </div>
    <section class='submitForm'>
        <input type='button' value='Submit' id='submitButton'> </input>
    </section>
</div>
`;

let mapPage = `
    <div id="mapDiv"></div>
`;

let attacksPage = `
    <div id="attacksPage">
        <div class="searchAnAttack">
            <div>
                View detailed information about an attack
            </div>
            <div class="searchZone">
                <div class="inputZone">
                    <label for="searchAttackButton">Attack id</label>
                    <input type="text" id="searchAttackButton">
                </div>
            <button onclick="searchAttack()">Search</button>
            </div>
        </div>
        <div class="mostInterestingAttacks">
            The most interesting attacks
        </div>
    </div>
`;

// ---------------------------------------------------- Routing -------------------------------------------------------------
// The routing system was implementing having the following tutorial as a starting point 
// https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573

class route {
    constructor(url) {
        this.url = url;
        this.children = [];
    }
}

let root = new route('');

let homeRoute = new route('home');
homeRoute.template = homePage;
homeRoute.afterCallback = () => {
    console.log('Entered home');
};
root.children.push(homeRoute);

let statisticsRoute = new route('statistics');
statisticsRoute.template = statisticsPage;
statisticsRoute.afterCallback = () => {
    generateWeapons();
    generateAttacks();
    generateTargets();
    generateRegions();
    generateCountries();
}
root.children.push(statisticsRoute);

let mapRoute = new route('map');
mapRoute.template = mapPage;
mapRoute.afterCallback = () => {
    let el = document.querySelector("#mapDiv");
    map = new google.maps.Map(el, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
}
root.children.push(mapRoute);

let thatAttackRoute = new route(':id');
thatAttackRoute.processCallback = function (arg) {
    this.beforeCallback(arg);
}
thatAttackRoute.beforeCallback = function (id) {
    let found = false;
    let currentAttack;
    for (let i = 0; i < attacks.length; ++i) {
        if (attacks[i].id == id) {
            currentAttack = attacks[i];
            found = true;
        }
    }
    if (!found) {
        mainContent.innerHTML = 'Error';
        return;
    }
    mainContent.innerHTML = this.templateCallback(currentAttack);
}
thatAttackRoute.templateCallback = function (attack) {
    return `
                <div> Test </div>
            `;
}

let attacksRoute = new route('attacks');
attacksRoute.template = attacksPage;
attacksRoute.afterCallback = () => {
    console.log('Attacks page entered');
}
attacksRoute.children.push(thatAttackRoute);
root.children.push(attacksRoute);

function updateMainContentRecursive(node, pathParts, index) {
    // Leaf route with parameter
    if (node.url && node.url[0] == ':' && index == pathParts.length) {
        node.processCallback(pathParts[index - 1]);
        return false;
    }
    // Leaf route with no parameter
    if (index == pathParts.length) {
        mainContent.innerHTML = node.template;
        node.afterCallback();
        return false;
    }
    if (node.children != null) {
        for (let i = 0; i < node.children.length; ++i) {
            if (node.children[i].url === pathParts[index] || node.children[i].url[0] == ':') {
                return updateMainContentRecursive(node.children[i], pathParts, index + 1);
            }
        }
    }
    // No match, redirect
    return true;
}

function updateMainContent(pathName) {
    let pathParts = pathName.split('/');
    let redirect = false;
    if (pathParts[0] === root.url) {
        redirect = updateMainContentRecursive(root, pathParts, 1);
    } else {
        redirect = true;
    }
    if (redirect) {
        navigate(root.url + '/home');
    }
}

function navigate(pathName) {
    window.history.pushState({},
        pathName,
        window.location.origin + pathName
    );
    updateMainContent(pathName);
}

function setContent() {
    mainContent = document.querySelector('#content');
    updateMainContent(window.location.pathname);
}

window.onpopstate = () => {
    updateMainContent(window.location.pathname);
}

document.addEventListener('DOMContentLoaded', setContent);

// ----------------------------------------------- Statistics form ----------------------------------------------------------

function generateWeapons() {
    let weaponForm = document.querySelector('.weaponTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Weapon1', 'Weapon2', 'Weapon3', 'Weapon4', 'Weapon5', 'Weapon6', 'Weapon7', 'Weapon8', 'Weapon9']
    weaponFormTitle.innerHTML = `<b>Weapon Type</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateAttacks() {
    let weaponForm = document.querySelector('.attackTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Attack1', 'Attack2', 'Attack3', 'Attack4', 'Attack5', 'Attack6', 'Attack7', 'Attack8', 'Attack9']
    weaponFormTitle.innerHTML = `<b>Attack Type</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateTargets() {
    let weaponForm = document.querySelector('.targetTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8', 'Target9']
    weaponFormTitle.innerHTML = `<b>Who was the target</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateRegions() {
    let regionForm = document.querySelector('.regionForm')
    let regionFormTitle = document.createElement('label')
    let regionOptionChoose = document.createElement('datalist');
    regionOptionChoose.setAttribute('id', 'allRegions')
    let regionList = ['Central America & Caribbean', 'Eastern Europe', 'Middle East & North Africa', 'North America', 'South America', 'Southeast Asia',
        'Sub-Saharan Africa', 'Western Europe'
    ]
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<b>Region of the attack</b> <br>
                                                            <input list='allRegions'>`
    let index = 0;
    for (index = 0; index < regionList.length; index++)
        regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
    regionFormTitle.appendChild(regionOptionChoose)
    regionForm.appendChild(regionFormTitle)
}

function generateCountries() {
    let regionForm = document.querySelector('.countryForm')
    let regionFormTitle = document.createElement('label')
    let regionOptionChoose = document.createElement('datalist');
    regionOptionChoose.setAttribute('id', 'allCountries')
    let regionList = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan (Province of China)",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands"
    ];
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<b>Country</b> <br>
                                                            <input list='allCountries'>`
    let index = 0;
    for (index = 0; index < regionList.length; index++)
        regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
    regionFormTitle.appendChild(regionOptionChoose)
    regionForm.appendChild(regionFormTitle)
}

// -------------------------------------------------- Attacks page --------------------------------------------------

function searchAttack() {
    let attackInput = document.querySelector('#searchAttackButton');
    navigate('/attacks/' + attackInput.value);
}