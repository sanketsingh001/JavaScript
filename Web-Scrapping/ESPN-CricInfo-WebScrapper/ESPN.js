//node ESPN.js --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results --excel=worldcup.csv --datafolder=data
let fs = require("fs");
let minimist = require("minimist");
let axios = require("axios");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");
let jsdom = require("jsdom");
let path=require("path");

let args = minimist(process.argv);

//Download using axios
let responsepromine = axios.get(args.source);
responsepromine.then(function (response) {
   let html = response.data;
   let dom = new jsdom.JSDOM(html);
   let document = dom.window.document;
   let matchscore = document.querySelectorAll("div.match-score-block");
   let matches = [];
   for (let i = 0; i < matchscore.length; i++) {
      let match = {}
      match.t1 = "";
      match.t2 = "";
      match.t1s = "";
      match.t2s = "";
      match.result = "";


      let teamparas = matchscore[i].querySelectorAll("div.name-detail > p.name");
      match.t1 = teamparas[0].textContent;
      match.t2 = teamparas[1].textContent;
      let scorespan = matchscore[i].querySelectorAll("span.score");
      if (scorespan.length == 2) {

         match.t1s = scorespan[0].textContent;
         match.t2s = scorespan[1].textContent;
      } else if (scorespan.length == 1) {

         match.t1s = scorespan[0].textContent;
         match.t2s = "";

      }
      else {
         match.t1s = "";
         match.t2s = "";
      }

      let resultSpan = matchscore[i].querySelector("div.status-text > span");
      match.result = resultSpan.textContent;

      matches.push(match);
   }
  let  matcheskajson = JSON.stringify(matches);
   fs.writeFileSync("matchs.json", matcheskajson, "utf-8");
   let teams = [];
   for (let i = 0; i < matches.length; i++) {
      pushifnot(teams, matches[i].t1);
      pushifnot(teams, matches[i].t2);
   }
   for (let i = 0; i < matches.length; i++) {
      putmatchinteam(teams, matches[i].t1,matches[i].t2,matches[i].t1s,matches[i].t2s,matches[i].result);
      putmatchinteam(teams, matches[i].t2,matches[i].t1,matches[i].t2s,matches[i].t1s,matches[i].result);
   }

   let teamskajson=JSON.stringify(teams);
   fs.writeFileSync("teams.json",teamskajson,"utf-8");
   prepareexcel(teams,args.excel);



   preparefoldersandpdf(teams,args.datafolder);





})



function preparefoldersandpdf(teams,datadir){
   if(fs.existsSync(datadir)==false){
      fs.mkdirSync(datadir);
   }
   for(let i=0;i<teams.length;i++){
      let teamfoldersname=path.join(datadir,teams[i].name);
      if(fs.existsSync(teamfoldersname)==false){
         fs.mkdirSync(teamfoldersname);
      }
      for(let j=0;j<teams[i].matches.length;j++){
         let match=teams[i].matches[j];
         createScoreCard(teamfoldersname,teams[i].name,match);
      }
   }
function createScoreCard(teamfoldersname,homeTeam,match){
   let matchfilename=path.join(teamfoldersname,match.vs+".pdf");
   fs.writeFileSync(matchfilename,"","utf-8");
   let templatefilebytes=fs.readFileSync("template.pdf");
   let pdfdocKaPromise = pdf.PDFDocument.load(templatefilebytes);
   pdfdocKaPromise.then(function(pdfdoc){
      let page=pdfdoc.getPage(0);
      page.drawText(homeTeam, {
         x: 320,
         y: 703,
         size: 8
     });
      page.drawText(match.vs, {
         x: 320,
         y: 688,
         size: 8
     });
      page.drawText(match.selfscore, {
         x: 320,
         y: 673,
         size: 8
     });
      page.drawText(match.oppscore, {
         x: 320,
         y: 658,
         size: 8
     });
      page.drawText(match.results, {
         x: 320,
         y: 646,
         size: 8
     });
      
      let changedbyteskapromise=pdfdoc.save();
      changedbyteskapromise.then(function(data){
         fs.writeFileSync(matchfilename,data);
      })

   })

   
}




 
}

function putmatchinteam(teams,hometeam,oppteam,homescore,oppscore,result){
   let idx=-1;
 for(j=0;j<teams.length;j++){

    if(teams[j].name==hometeam){
       idx=j;
       break;
    }}
let team=teams[idx];
    team.matches.push(
       {
       vs:oppteam,
       selfscore:homescore,
       oppscore:oppscore,
       results:result
      }

    )


 
}

function pushifnot(teams, teamname) {
   let tidx = -1;
   for (let j = 0; j < teams.length; j++) {
      if (teams[j].name == teamname) {
         tidx = j;
         break;
      }
   }

      if (tidx == -1) {
         teams.push({
            name: teamname,
            matches:[]
         })
      }

   

}

function prepareexcel(teams,excelfilename){
   let wb= new excel4node.Workbook();
   for(let i=0;i<teams.length;i++){
      let tsheet=wb.addWorksheet(teams[i].name);
      tsheet.cell(1, 1).string("Vs");
      tsheet.cell(1, 2).string("Self Score");
      tsheet.cell(1, 3).string("Opp Score");
      tsheet.cell(1, 4).string("Result");
      for(let j=0;j<teams[i].matches.length;j++){
         tsheet.cell(2+j,1).string(teams[i].matches[j].vs);
         tsheet.cell(2+j,2).string(teams[i].matches[j].selfscore);
         tsheet.cell(2+j,3).string(teams[i].matches[j].oppscore);
         tsheet.cell(2+j,4).string(teams[i].matches[j].results);
      }
   }
  


   wb.write(excelfilename);

}


