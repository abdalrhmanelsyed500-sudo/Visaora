import type { Country } from "../types";
import { slugify } from "../slug";

/**
 * Directory metadata only. Visa content deliberately does not live in this
 * file; it belongs in the content database and is only exposed after review.
 */
const COUNTRY_ROWS = `
Afghanistan|Islamic Republic of Afghanistan|AF|AFG|004|Asia|Asia|Southern Asia|Kabul
Albania|Republic of Albania|AL|ALB|008|Europe|Europe|Southern Europe|Tirana
Algeria|People's Democratic Republic of Algeria|DZ|DZA|012|Africa|Africa|Northern Africa|Algiers
Andorra|Principality of Andorra|AD|AND|020|Europe|Europe|Southern Europe|Andorra la Vella
Angola|Republic of Angola|AO|AGO|024|Africa|Africa|Middle Africa|Luanda
Antigua and Barbuda|Antigua and Barbuda|AG|ATG|028|North America|North America|Caribbean|Saint John's
Argentina|Argentine Republic|AR|ARG|032|South America|South America|South America|Buenos Aires
Armenia|Republic of Armenia|AM|ARM|051|Asia|Asia|Western Asia|Yerevan
Australia|Commonwealth of Australia|AU|AUS|036|Oceania|Oceania|Australia and New Zealand|Canberra
Austria|Republic of Austria|AT|AUT|040|Europe|Europe|Western Europe|Vienna
Azerbaijan|Republic of Azerbaijan|AZ|AZE|031|Asia|Asia|Western Asia|Baku
Bahamas|Commonwealth of the Bahamas|BS|BHS|044|North America|North America|Caribbean|Nassau
Bahrain|Kingdom of Bahrain|BH|BHR|048|Asia|Middle East|Western Asia|Manama
Bangladesh|People's Republic of Bangladesh|BD|BGD|050|Asia|Asia|Southern Asia|Dhaka
Barbados|Barbados|BB|BRB|052|North America|North America|Caribbean|Bridgetown
Belarus|Republic of Belarus|BY|BLR|112|Europe|Europe|Eastern Europe|Minsk
Belgium|Kingdom of Belgium|BE|BEL|056|Europe|Europe|Western Europe|Brussels
Belize|Belize|BZ|BLZ|084|North America|North America|Central America|Belmopan
Benin|Republic of Benin|BJ|BEN|204|Africa|Africa|Western Africa|Porto-Novo
Bhutan|Kingdom of Bhutan|BT|BTN|064|Asia|Asia|Southern Asia|Thimphu
Bolivia|Plurinational State of Bolivia|BO|BOL|068|South America|South America|South America|Sucre
Bosnia and Herzegovina|Bosnia and Herzegovina|BA|BIH|070|Europe|Europe|Southern Europe|Sarajevo
Botswana|Republic of Botswana|BW|BWA|072|Africa|Africa|Southern Africa|Gaborone
Brazil|Federative Republic of Brazil|BR|BRA|076|South America|South America|South America|Brasília
Brunei|Brunei Darussalam|BN|BRN|096|Asia|Asia|South-Eastern Asia|Bandar Seri Begawan
Bulgaria|Republic of Bulgaria|BG|BGR|100|Europe|Europe|Eastern Europe|Sofia
Burkina Faso|Burkina Faso|BF|BFA|854|Africa|Africa|Western Africa|Ouagadougou
Burundi|Republic of Burundi|BI|BDI|108|Africa|Africa|Eastern Africa|Gitega
Cabo Verde|Republic of Cabo Verde|CV|CPV|132|Africa|Africa|Western Africa|Praia
Cambodia|Kingdom of Cambodia|KH|KHM|116|Asia|Asia|South-Eastern Asia|Phnom Penh
Cameroon|Republic of Cameroon|CM|CMR|120|Africa|Africa|Middle Africa|Yaoundé
Canada|Canada|CA|CAN|124|North America|North America|Northern America|Ottawa
Central African Republic|Central African Republic|CF|CAF|140|Africa|Africa|Middle Africa|Bangui
Chad|Republic of Chad|TD|TCD|148|Africa|Africa|Middle Africa|N'Djamena
Chile|Republic of Chile|CL|CHL|152|South America|South America|South America|Santiago
China|People's Republic of China|CN|CHN|156|Asia|Asia|Eastern Asia|Beijing
Colombia|Republic of Colombia|CO|COL|170|South America|South America|South America|Bogotá
Comoros|Union of the Comoros|KM|COM|174|Africa|Africa|Eastern Africa|Moroni
Congo|Republic of the Congo|CG|COG|178|Africa|Africa|Middle Africa|Brazzaville
Costa Rica|Republic of Costa Rica|CR|CRI|188|North America|North America|Central America|San José
Côte d'Ivoire|Republic of Côte d'Ivoire|CI|CIV|384|Africa|Africa|Western Africa|Yamoussoukro
Croatia|Republic of Croatia|HR|HRV|191|Europe|Europe|Southern Europe|Zagreb
Cuba|Republic of Cuba|CU|CUB|192|North America|North America|Caribbean|Havana
Cyprus|Republic of Cyprus|CY|CYP|196|Europe|Europe|Southern Europe|Nicosia
Czechia|Czech Republic|CZ|CZE|203|Europe|Europe|Eastern Europe|Prague
Democratic Republic of the Congo|Democratic Republic of the Congo|CD|COD|180|Africa|Africa|Middle Africa|Kinshasa
Denmark|Kingdom of Denmark|DK|DNK|208|Europe|Europe|Northern Europe|Copenhagen
Djibouti|Republic of Djibouti|DJ|DJI|262|Africa|Africa|Eastern Africa|Djibouti
Dominica|Commonwealth of Dominica|DM|DMA|212|North America|North America|Caribbean|Roseau
Dominican Republic|Dominican Republic|DO|DOM|214|North America|North America|Caribbean|Santo Domingo
Ecuador|Republic of Ecuador|EC|ECU|218|South America|South America|South America|Quito
Egypt|Arab Republic of Egypt|EG|EGY|818|Africa|Middle East|Northern Africa|Cairo
El Salvador|Republic of El Salvador|SV|SLV|222|North America|North America|Central America|San Salvador
Equatorial Guinea|Republic of Equatorial Guinea|GQ|GNQ|226|Africa|Africa|Middle Africa|Malabo
Eritrea|State of Eritrea|ER|ERI|232|Africa|Africa|Eastern Africa|Asmara
Estonia|Republic of Estonia|EE|EST|233|Europe|Europe|Northern Europe|Tallinn
Eswatini|Kingdom of Eswatini|SZ|SWZ|748|Africa|Africa|Southern Africa|Mbabane
Ethiopia|Federal Democratic Republic of Ethiopia|ET|ETH|231|Africa|Africa|Eastern Africa|Addis Ababa
Fiji|Republic of Fiji|FJ|FJI|242|Oceania|Oceania|Melanesia|Suva
Finland|Republic of Finland|FI|FIN|246|Europe|Europe|Northern Europe|Helsinki
France|French Republic|FR|FRA|250|Europe|Europe|Western Europe|Paris
Gabon|Gabonese Republic|GA|GAB|266|Africa|Africa|Middle Africa|Libreville
Gambia|Republic of The Gambia|GM|GMB|270|Africa|Africa|Western Africa|Banjul
Georgia|Georgia|GE|GEO|268|Asia|Asia|Western Asia|Tbilisi
Germany|Federal Republic of Germany|DE|DEU|276|Europe|Europe|Western Europe|Berlin
Ghana|Republic of Ghana|GH|GHA|288|Africa|Africa|Western Africa|Accra
Greece|Hellenic Republic|GR|GRC|300|Europe|Europe|Southern Europe|Athens
Grenada|Grenada|GD|GRD|308|North America|North America|Caribbean|Saint George's
Guatemala|Republic of Guatemala|GT|GTM|320|North America|North America|Central America|Guatemala City
Guinea|Republic of Guinea|GN|GIN|324|Africa|Africa|Western Africa|Conakry
Guinea-Bissau|Republic of Guinea-Bissau|GW|GNB|624|Africa|Africa|Western Africa|Bissau
Guyana|Co-operative Republic of Guyana|GY|GUY|328|South America|South America|South America|Georgetown
Haiti|Republic of Haiti|HT|HTI|332|North America|North America|Caribbean|Port-au-Prince
Honduras|Republic of Honduras|HN|HND|340|North America|North America|Central America|Tegucigalpa
Hungary|Hungary|HU|HUN|348|Europe|Europe|Eastern Europe|Budapest
Iceland|Republic of Iceland|IS|ISL|352|Europe|Europe|Northern Europe|Reykjavík
India|Republic of India|IN|IND|356|Asia|Asia|Southern Asia|New Delhi
Indonesia|Republic of Indonesia|ID|IDN|360|Asia|Asia|South-Eastern Asia|Jakarta
Iran|Islamic Republic of Iran|IR|IRN|364|Asia|Middle East|Southern Asia|Tehran
Iraq|Republic of Iraq|IQ|IRQ|368|Asia|Middle East|Western Asia|Baghdad
Ireland|Ireland|IE|IRL|372|Europe|Europe|Northern Europe|Dublin
Israel|State of Israel|IL|ISR|376|Asia|Middle East|Western Asia|Jerusalem
Italy|Italian Republic|IT|ITA|380|Europe|Europe|Southern Europe|Rome
Jamaica|Jamaica|JM|JAM|388|North America|North America|Caribbean|Kingston
Japan|Japan|JP|JPN|392|Asia|Asia|Eastern Asia|Tokyo
Jordan|Hashemite Kingdom of Jordan|JO|JOR|400|Asia|Middle East|Western Asia|Amman
Kazakhstan|Republic of Kazakhstan|KZ|KAZ|398|Asia|Asia|Central Asia|Astana
Kenya|Republic of Kenya|KE|KEN|404|Africa|Africa|Eastern Africa|Nairobi
Kiribati|Republic of Kiribati|KI|KIR|296|Oceania|Oceania|Micronesia|South Tarawa
Kuwait|State of Kuwait|KW|KWT|414|Asia|Middle East|Western Asia|Kuwait City
Kyrgyzstan|Kyrgyz Republic|KG|KGZ|417|Asia|Asia|Central Asia|Bishkek
Laos|Lao People's Democratic Republic|LA|LAO|418|Asia|Asia|South-Eastern Asia|Vientiane
Latvia|Republic of Latvia|LV|LVA|428|Europe|Europe|Northern Europe|Riga
Lebanon|Lebanese Republic|LB|LBN|422|Asia|Middle East|Western Asia|Beirut
Lesotho|Kingdom of Lesotho|LS|LSO|426|Africa|Africa|Southern Africa|Maseru
Liberia|Republic of Liberia|LR|LBR|430|Africa|Africa|Western Africa|Monrovia
Libya|State of Libya|LY|LBY|434|Africa|Middle East|Northern Africa|Tripoli
Liechtenstein|Principality of Liechtenstein|LI|LIE|438|Europe|Europe|Western Europe|Vaduz
Lithuania|Republic of Lithuania|LT|LTU|440|Europe|Europe|Northern Europe|Vilnius
Luxembourg|Grand Duchy of Luxembourg|LU|LUX|442|Europe|Europe|Western Europe|Luxembourg
Madagascar|Republic of Madagascar|MG|MDG|450|Africa|Africa|Eastern Africa|Antananarivo
Malawi|Republic of Malawi|MW|MWI|454|Africa|Africa|Eastern Africa|Lilongwe
Malaysia|Malaysia|MY|MYS|458|Asia|Asia|South-Eastern Asia|Kuala Lumpur
Maldives|Republic of Maldives|MV|MDV|462|Asia|Asia|Southern Asia|Malé
Mali|Republic of Mali|ML|MLI|466|Africa|Africa|Western Africa|Bamako
Malta|Republic of Malta|MT|MLT|470|Europe|Europe|Southern Europe|Valletta
Marshall Islands|Republic of the Marshall Islands|MH|MHL|584|Oceania|Oceania|Micronesia|Majuro
Mauritania|Islamic Republic of Mauritania|MR|MRT|478|Africa|Africa|Western Africa|Nouakchott
Mauritius|Republic of Mauritius|MU|MUS|480|Africa|Africa|Eastern Africa|Port Louis
Mexico|United Mexican States|MX|MEX|484|North America|North America|Central America|Mexico City
Micronesia|Federated States of Micronesia|FM|FSM|583|Oceania|Oceania|Micronesia|Palikir
Moldova|Republic of Moldova|MD|MDA|498|Europe|Europe|Eastern Europe|Chișinău
Monaco|Principality of Monaco|MC|MCO|492|Europe|Europe|Western Europe|Monaco
Mongolia|Mongolia|MN|MNG|496|Asia|Asia|Eastern Asia|Ulaanbaatar
Montenegro|Montenegro|ME|MNE|499|Europe|Europe|Southern Europe|Podgorica
Morocco|Kingdom of Morocco|MA|MAR|504|Africa|Africa|Northern Africa|Rabat
Mozambique|Republic of Mozambique|MZ|MOZ|508|Africa|Africa|Eastern Africa|Maputo
Myanmar|Republic of the Union of Myanmar|MM|MMR|104|Asia|Asia|South-Eastern Asia|Naypyidaw
Namibia|Republic of Namibia|NA|NAM|516|Africa|Africa|Southern Africa|Windhoek
Nauru|Republic of Nauru|NR|NRU|520|Oceania|Oceania|Micronesia|Yaren
Nepal|Federal Democratic Republic of Nepal|NP|NPL|524|Asia|Asia|Southern Asia|Kathmandu
Netherlands|Kingdom of the Netherlands|NL|NLD|528|Europe|Europe|Western Europe|Amsterdam
New Zealand|New Zealand|NZ|NZL|554|Oceania|Oceania|Australia and New Zealand|Wellington
Nicaragua|Republic of Nicaragua|NI|NIC|558|North America|North America|Central America|Managua
Niger|Republic of the Niger|NE|NER|562|Africa|Africa|Western Africa|Niamey
Nigeria|Federal Republic of Nigeria|NG|NGA|566|Africa|Africa|Western Africa|Abuja
North Korea|Democratic People's Republic of Korea|KP|PRK|408|Asia|Asia|Eastern Asia|Pyongyang
North Macedonia|Republic of North Macedonia|MK|MKD|807|Europe|Europe|Southern Europe|Skopje
Norway|Kingdom of Norway|NO|NOR|578|Europe|Europe|Northern Europe|Oslo
Oman|Sultanate of Oman|OM|OMN|512|Asia|Middle East|Western Asia|Muscat
Pakistan|Islamic Republic of Pakistan|PK|PAK|586|Asia|Asia|Southern Asia|Islamabad
Palau|Republic of Palau|PW|PLW|585|Oceania|Oceania|Micronesia|Ngerulmud
Palestine|State of Palestine|PS|PSE|275|Asia|Middle East|Western Asia|Ramallah
Panama|Republic of Panama|PA|PAN|591|North America|North America|Central America|Panama City
Papua New Guinea|Independent State of Papua New Guinea|PG|PNG|598|Oceania|Oceania|Melanesia|Port Moresby
Paraguay|Republic of Paraguay|PY|PRY|600|South America|South America|South America|Asunción
Peru|Republic of Peru|PE|PER|604|South America|South America|South America|Lima
Philippines|Republic of the Philippines|PH|PHL|608|Asia|Asia|South-Eastern Asia|Manila
Poland|Republic of Poland|PL|POL|616|Europe|Europe|Eastern Europe|Warsaw
Portugal|Portuguese Republic|PT|PRT|620|Europe|Europe|Southern Europe|Lisbon
Qatar|State of Qatar|QA|QAT|634|Asia|Middle East|Western Asia|Doha
Romania|Romania|RO|ROU|642|Europe|Europe|Eastern Europe|Bucharest
Russia|Russian Federation|RU|RUS|643|Europe|Europe|Eastern Europe|Moscow
Rwanda|Republic of Rwanda|RW|RWA|646|Africa|Africa|Eastern Africa|Kigali
Saint Kitts and Nevis|Saint Kitts and Nevis|KN|KNA|659|North America|North America|Caribbean|Basseterre
Saint Lucia|Saint Lucia|LC|LCA|662|North America|North America|Caribbean|Castries
Saint Vincent and the Grenadines|Saint Vincent and the Grenadines|VC|VCT|670|North America|North America|Caribbean|Kingstown
Samoa|Independent State of Samoa|WS|WSM|882|Oceania|Oceania|Polynesia|Apia
San Marino|Republic of San Marino|SM|SMR|674|Europe|Europe|Southern Europe|San Marino
Sao Tome and Principe|Democratic Republic of São Tomé and Príncipe|ST|STP|678|Africa|Africa|Middle Africa|São Tomé
Saudi Arabia|Kingdom of Saudi Arabia|SA|SAU|682|Asia|Middle East|Western Asia|Riyadh
Senegal|Republic of Senegal|SN|SEN|686|Africa|Africa|Western Africa|Dakar
Serbia|Republic of Serbia|RS|SRB|688|Europe|Europe|Southern Europe|Belgrade
Seychelles|Republic of Seychelles|SC|SYC|690|Africa|Africa|Eastern Africa|Victoria
Sierra Leone|Republic of Sierra Leone|SL|SLE|694|Africa|Africa|Western Africa|Freetown
Singapore|Republic of Singapore|SG|SGP|702|Asia|Asia|South-Eastern Asia|Singapore
Slovakia|Slovak Republic|SK|SVK|703|Europe|Europe|Eastern Europe|Bratislava
Slovenia|Republic of Slovenia|SI|SVN|705|Europe|Europe|Southern Europe|Ljubljana
Solomon Islands|Solomon Islands|SB|SLB|090|Oceania|Oceania|Melanesia|Honiara
Somalia|Federal Republic of Somalia|SO|SOM|706|Africa|Africa|Eastern Africa|Mogadishu
South Africa|Republic of South Africa|ZA|ZAF|710|Africa|Africa|Southern Africa|Pretoria
South Korea|Republic of Korea|KR|KOR|410|Asia|Asia|Eastern Asia|Seoul
South Sudan|Republic of South Sudan|SS|SSD|728|Africa|Africa|Eastern Africa|Juba
Spain|Kingdom of Spain|ES|ESP|724|Europe|Europe|Southern Europe|Madrid
Sri Lanka|Democratic Socialist Republic of Sri Lanka|LK|LKA|144|Asia|Asia|Southern Asia|Sri Jayawardenepura Kotte
Sudan|Republic of the Sudan|SD|SDN|729|Africa|Africa|Northern Africa|Khartoum
Suriname|Republic of Suriname|SR|SUR|740|South America|South America|South America|Paramaribo
Sweden|Kingdom of Sweden|SE|SWE|752|Europe|Europe|Northern Europe|Stockholm
Switzerland|Swiss Confederation|CH|CHE|756|Europe|Europe|Western Europe|Bern
Syria|Syrian Arab Republic|SY|SYR|760|Asia|Middle East|Western Asia|Damascus
Tajikistan|Republic of Tajikistan|TJ|TJK|762|Asia|Asia|Central Asia|Dushanbe
Tanzania|United Republic of Tanzania|TZ|TZA|834|Africa|Africa|Eastern Africa|Dodoma
Thailand|Kingdom of Thailand|TH|THA|764|Asia|Asia|South-Eastern Asia|Bangkok
Timor-Leste|Democratic Republic of Timor-Leste|TL|TLS|626|Asia|Asia|South-Eastern Asia|Dili
Togo|Togolese Republic|TG|TGO|768|Africa|Africa|Western Africa|Lomé
Tonga|Kingdom of Tonga|TO|TON|776|Oceania|Oceania|Polynesia|Nuku'alofa
Trinidad and Tobago|Republic of Trinidad and Tobago|TT|TTO|780|North America|North America|Caribbean|Port of Spain
Tunisia|Republic of Tunisia|TN|TUN|788|Africa|Middle East|Northern Africa|Tunis
Türkiye|Republic of Türkiye|TR|TUR|792|Asia|Asia|Western Asia|Ankara
Turkmenistan|Turkmenistan|TM|TKM|795|Asia|Asia|Central Asia|Ashgabat
Tuvalu|Tuvalu|TV|TUV|798|Oceania|Oceania|Polynesia|Funafuti
Uganda|Republic of Uganda|UG|UGA|800|Africa|Africa|Eastern Africa|Kampala
Ukraine|Ukraine|UA|UKR|804|Europe|Europe|Eastern Europe|Kyiv
United Arab Emirates|United Arab Emirates|AE|ARE|784|Asia|Middle East|Western Asia|Abu Dhabi
United Kingdom|United Kingdom of Great Britain and Northern Ireland|GB|GBR|826|Europe|Europe|Northern Europe|London
United States|United States of America|US|USA|840|North America|North America|Northern America|Washington, D.C.
Uruguay|Oriental Republic of Uruguay|UY|URY|858|South America|South America|South America|Montevideo
Uzbekistan|Republic of Uzbekistan|UZ|UZB|860|Asia|Asia|Central Asia|Tashkent
Vanuatu|Republic of Vanuatu|VU|VUT|548|Oceania|Oceania|Melanesia|Port Vila
Vatican City|Vatican City State|VA|VAT|336|Europe|Europe|Southern Europe|Vatican City
Venezuela|Bolivarian Republic of Venezuela|VE|VEN|862|South America|South America|South America|Caracas
Vietnam|Socialist Republic of Viet Nam|VN|VNM|704|Asia|Asia|South-Eastern Asia|Hanoi
Yemen|Republic of Yemen|YE|YEM|887|Asia|Middle East|Western Asia|Sana'a
Zambia|Republic of Zambia|ZM|ZMB|894|Africa|Africa|Eastern Africa|Lusaka
Zimbabwe|Republic of Zimbabwe|ZW|ZWE|716|Africa|Africa|Eastern Africa|Harare
`.trim();

const COUNTRY_ALIASES: Record<string, string[]> = {
  US: ["USA", "US", "America", "United States of America"],
  GB: ["UK", "Britain", "Great Britain", "England"],
  AE: ["UAE", "Emirates"],
  KR: ["Korea", "South Korea", "Republic of Korea"],
  KP: ["DPRK", "North Korea"],
  CD: ["DRC", "Congo Kinshasa"],
  CG: ["Congo Brazzaville", "Republic of Congo"],
  CZ: ["Czech Republic"],
  TR: ["Turkey", "Türkiye"],
  CV: ["Cape Verde"],
  CI: ["Ivory Coast"],
  TZ: ["Tanzania"],
};

function flagFromIso2(iso2: string) {
  return iso2
    .toUpperCase()
    .split("")
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}

export const COUNTRIES: Country[] = COUNTRY_ROWS.split("\n").map((row) => {
  const [
    name,
    officialName,
    iso2,
    iso3,
    numericCode,
    continent,
    region,
    subregion,
    capital,
  ] = row.split("|");

  return {
    id: `country-${iso3.toLowerCase()}`,
    name,
    officialName,
    iso2,
    iso3,
    numericCode,
    continent,
    region,
    subregion,
    capital,
    flag: flagFromIso2(iso2),
    slug: slugify(name),
    description: null,
    status: "PUBLISHED",
    publishedVisaCount: 0,
    aliases: COUNTRY_ALIASES[iso2] ?? [],
  };
});

export function getCountryBySlug(slug: string) {
  return COUNTRIES.find((country) => country.slug === slug);
}

export function getCountryById(id: string) {
  return COUNTRIES.find((country) => country.id === id);
}

export function getCountryByIso2(iso2: string) {
  return COUNTRIES.find((country) => country.iso2.toLowerCase() === iso2.toLowerCase());
}
