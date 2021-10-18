 Web Scraping Project
In this the data of all matches in Cricket worldcup 2019 is scraped from espncricinfo.com. The data is then presented in two formats :

.xls Ecxel File.
Folders of each team is created inside IPL2020 folder and pdfs with match details is created inside each folder.
Installation and Execution
JavaScript is the langauage used here, to run .js files node must be installed in your system.
Click Here to download node for your Operating System.
After installing node, install the npm modules listed below using terminal.
npm init -y
npm install minimist
npm install axios
npm install jsdom
npm install excel4node
npm install pdf-lib
Now create a folder and add main.js and template.pdf files in that folder.
Open the above folder in your terminal and paste the following command in your terminal.
node ESPN.js --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --excel=worldcup.csv --datafolder=data
You can change the folder and excel name according to your choice. If you want to get detail of some other series, just copy that link from Espn Cricinfo's match and result section and paste it after source in the above command.
After execution, the excel file and folders with pdf file will be created.
Code Summary
Read the command line arguments using minimist.
Read the HTML file use axios and convert it to DOM using JSDOM.
Using HTML elements and their class read the data which we need and push it into a JSO object.
Using the above JSO object with all match details we make another JSO which has team details using array manipulation.
Using the teams JSO and excel4node create an excel file with every team match details in a sheet.
Make folders using fs.
Make a template.pdf using MS Word beforehand, and add the data in that pdf for each team and its matches using pdf-lib.
