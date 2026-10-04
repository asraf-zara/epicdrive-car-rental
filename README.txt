EPICDRIVE CAR RENTAL WEBSITE
============================

RUN ON YOUR LAPTOP
------------------
1. Install Node.js (LTS) if you do not already have it.
2. Open Terminal / CMD inside this project folder.
3. Run:

   npm install

4. Then run:

   node index.js

5. Open:

   http://localhost:3000


IMPORTANT: CHANGE PHONE / WHATSAPP / LOCATION
---------------------------------------------
Open index.js and edit these values near the top:

const BUSINESS_PHONE = '+966 50 000 0000';
const BUSINESS_PHONE_LINK = '+966500000000';
const WHATSAPP_NUMBER = '966500000000';
const BUSINESS_LOCATION = 'Riyadh, Saudi Arabia';


CHANGE CAR PRICES
-----------------
Open index.js and edit each car's price value:

price: 'SAR 150 / Day'
price: 'SAR 220 / Day'
price: 'SAR 300 / Day'


MAIN PAGES (ALL EJS)
--------------------
views/home.ejs
views/cars.ejs
views/baleno.ejs
views/ertiga.ejs
views/carens-clavis.ejs
views/how-it-works.ejs
views/contact.ejs
views/404.ejs

Shared EJS parts are inside views/partials/.


FOLDER STRUCTURE
----------------
index.js
package.json
views/
  home.ejs
  cars.ejs
  baleno.ejs
  ertiga.ejs
  carens-clavis.ejs
  how-it-works.ejs
  contact.ejs
  404.ejs
  partials/
public/
  css/style.css
  js/main.js
  images/

