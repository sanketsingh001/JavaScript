# ESPN CRICINFO Web Scraping Project

In this the data of all matches in world cup 2019 is scrapped from espncricinfo.com. The data is then presented in two formats :

1. .xls Ecxel File. 
2. Folders of each team is created inside IPL2020 folder and pdfs with match details is created inside each folder. 

## Installation and Execution

1. **JavaScript** is the langauage used here, to run .js files node must be installed in your system.
2. [Click Here](https://nodejs.org/en/download/) to download node for your Operating System.   
3. After installing node, install the **npm modules** listed below using terminal.

```bash
npm init -y
npm install minimist
npm install axios
npm install jsdom
npm install excel4node
npm install pdf-lib
```
4. Now create a folder and add *main.js* and *template.pdf* files in that folder.
5. Open the above folder in your terminal and paste the following command in your terminal.
```bash
node ESPN.js --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --excel=worldcup.csv --datafolder=data
``` 
6. You can change the folder and excel name according to your choice. If you want to get detail of some other series, just copy that link from [Espn Cricinfo's](https://www.espncricinfo.com/) match and result section and paste it after source in the above command.
7. After execution, the excel file and folders with pdf file will be created.

## Code Summary
1. Read the command line arguments using minimist.
2. Read the HTML file use axios and convert it to DOM using JSDOM.
3. Using HTML elements and their class read the data which we need and push it into a JSO object.
4. Using the above JSO object with all match details we make another JSO which has team details using array manipulation.
5. Using the teams JSO and excel4node create an excel file with every team match details in a sheet.
6. Make folders using fs.
7. Make a template.pdf using MS Word beforehand, and add the data in that pdf for each team and its matches using pdf-lib.
