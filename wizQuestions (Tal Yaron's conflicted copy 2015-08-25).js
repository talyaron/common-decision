// start listen to DB counting of voters
//wizCountVotes();

// --------------- Functions ------------------------

// set the tpe of questions in the form (for the buttons)

function setTypeOfQuestion(type){
                  
    switch(type){
      case "reg":
          
          $("#regQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          $("#yesnoQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#wisQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          break;
      case "yesno":
          
          $("#regQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#yesnoQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          $("#wisQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          break;
      case "wiz":
          
          $("#regQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#yesnoQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#wisQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          break;
      default:
          
          $("#regQuestion").css({"background-color":"nul"});
          $("#yesnoQuestion").css({"background-color":"null"});
          $("#wisQuestion").css({"background-color":"null"});
    }
}

var v_KeepPrevList = null;
var v_stam = "-999";
var v_KeepHtml = "-999";

function wizShowOptions(questionKey){
    
    //$("#wizQuestion").slideUp(300);

    // --------- Ziv ------------------
    if (v_KeepPrevList != null) {
    //    hideAllEcept("wizQuestion");
    //    $("#wizQuestion").show();
     $("#wizQuestion").html(v_KeepHtml);
    //    $("#editWizQuestion").hide();
   }
  // --------------- End Ziv -------------
            
    var questionKeyStr = JSON.stringify(questionKey);
    
    // all options for the question

  //  sessionDB.child("questions/" + questionKey + "/options").once("value", function (optionsDB) {
    sessionDB.child("questions/" + questionKey + "/options").once("value", function (optionsDB) {

        console.log("=========== START ===============");
        console.log("===                            ==");
        console.log("=================================");

        //for each option create :
        var optionsHtml = new Array();
        //var ids = new Array(); // ZN

        var l_index = 0;

        // get information for the option and write it on a html-DIV, then add it to the overall html
        optionsDB.forEach(function (optionDB) {

            var optionKey = optionDB.key();

            //listen to changes in texts

            sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/text").on("value", function (textData) {
                $("#" + questionKey + optionKey).text(textData.val().mainText);
                $("#" + questionKey + optionKey + "T").text(textData.val().title);
            })
            
            //listen to changes in votes

            

            // ------------------

            var yesVotes = 0;
            var noVotes = 0;


            //DB for no and yes voters
            var votesDB = sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes");
            

            // get text and title of option 
            var textOption = optionDB.val().text.mainText;
            var titleOption = optionDB.val().text.title;
            var color = optionDB.val().text.color;

            //count votes

            votesDB.once("value", function (voters) {
                voters.forEach(function (vote) {
                    if (vote.val() === "no") {
                        noVotes++;
                        console.log("number of nies: " + noVotes);
                    }

                    if (vote.val() === "yes") {
                        yesVotes++;
                        console.log("number of yeses: " + yesVotes);
                    }
                })

            });
            
            // if votes changed in DB, do the following: update text...
            
            sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes").on("value", function (textData) {
                console.log("vote changed");
                
                var noVotesCh = 0;
                var yesVotesCh = 0;
                
                votesDB.once("value", function (voters) {
                voters.forEach(function (vote) {
                    if (vote.val() === "no") {
                        noVotesCh++;
                        console.log("number of nies: " + noVotesCh);
                    }

                    if (vote.val() === "yes") {
                        yesVotesCh++;
                        console.log("number of yeses: " + yesVotesCh);
                    }
                })

            });
                $("#" + questionKey + optionKey+ "votes").text("בעד: " + yesVotesCh + ", נגד: " + noVotesCh);
                
                
            })
           
            var optionKeyStr = JSON.stringify(optionKey);

            var yesStr = JSON.stringify("yes");
            var noStr = JSON.stringify("no")
            if (color === undefined) {
                var colorStr = "brown";
            } else {
                var colorStr = color;
            }

            var titleOptionStr = JSON.stringify(titleOption);

            //ZN
            var l_id = "Z_" + questionKey + "_" + optionKey + "_div";

            //  ids.push(l_id);
            //  console.log("in: id=" + l_id);

            var optionHtmlCurrent =
                      "<div class='wizLayout' id='" + l_id + "' >" +
                            "<div class='wizLeftPanel'>" +
                                "<div class='wizVoteUp wizButtons clickables' onclick='setWizVote(" + questionKeyStr + "," + optionKeyStr + "," + yesStr + ")'><img src='img/Yes.png' width='30px'>" +
                                "</div>" +
                                "<div class='wizVoteDown wizButtons clickables' onclick='setWizVote(" + questionKeyStr + "," + optionKeyStr + "," + noStr + ")'><img src='img/no.png' height='30px'>" +
                                "</div>" +
                                "<div class='wizSuggest wizButtons clickables' onclick='setSuggestion()'><img src='img/suggestion.png' height='30px'>" +
                                "</div>" +
                                "<div class='wizTalk wizButtons clickables' onclick='startWizTalk(" + questionKeyStr + "," + optionKeyStr + ", " + titleOptionStr + ")'><img src='img/talk.png' height='30px'>" +
                                "</div>" +
                            "</div>" +
                            "<div class='wizMainWrapText' style='background-color:" + colorStr + "'>" +
                                "<div dir='rtl' class='wizMainText'>" +
                                    "<div class='wizMainTextTitle' contenteditable='false' id='" + questionKey + optionKey + "T'>" +
                                        titleOption +
                                    "</div>" +
                                    "<div class='wizMainTextText' contenteditable='false' id='" + questionKey + optionKey + "'>" +
                                        textOption +
                                    "</div>" +
                                "</div>" +
                                " <input type='button' class='pure-button pure-button-primary' value='עריכה' onclick='editWizOption(" + questionKeyStr + "," + optionKeyStr + ")'> " +
                                " <span style='color: white' id='"+questionKey + optionKey+"votes'>בעד:" + yesVotes + ", נגד: " + noVotes + "</span>" +
                            "</div></div>";

            optionsHtml.push([(yesVotes - noVotes), optionHtmlCurrent, l_id, l_index]);
            console.log("InWhile : index =" + l_index + "  Yes=" + yesVotes + "  No=" + noVotes + " id=" + l_id);

            var score = (noVotes - yesVotes)
            l_index++;


        })
        for (i in optionsHtml) {
            console.log("BeforeSort: " + i + ":" + optionsHtml[i][0] + " id=" + optionsHtml[i][2] + " index=" + optionsHtml[i][3]);
        }


        optionsHtml.sort(function (a, b) { return b[0] - a[0] });
        for (i in optionsHtml) {
            optionsHtml[i][3] = i;
            console.log("AfterSort: " + i + ":" + optionsHtml[i][0] + " id= " + optionsHtml[i][2] + " new index=" + optionsHtml[i][3]);
        }


        //   optionsHtml.reverse();// Don't need it anymore

        // For the first time - no movement, just presnet them


        var headerText = '';

        sessionDB.child("questions/" + questionKey + "/header").once("value", function (headerData) {
            headerText = headerData.val();
        })

        questionsList = JSON.stringify("questionsList");

        var htmlwizQuestion = "<img src='img/plus.png' id='wizPlus' class='clickables' onclick='crearteNewOptionTexbox(" + questionKeyStr + ")'>" +
                    "<img src='img/update.png' id='wizUpdate' class='clickables' onclick='wizShowOptions(" + questionKeyStr + ")'>" +
                    "<img src='img/close.png' width='35px' class='clickables' onclick='hideAllEcept(" + questionsList + ")' id='okWizQuestion'>" +
                    "<div class='wizHeader'>שאלה: " + headerText + "</div><div id='editWizQuestion'></div>";

        for (i in optionsHtml) {
            htmlwizQuestion += optionsHtml[i][1];
        }



        if (v_KeepPrevList == null) {
            hideAllEcept("wizQuestion");
            $("#wizQuestion").show();
            $("#wizQuestion").html(htmlwizQuestion);
            $("#editWizQuestion").hide();
        }


        if (v_KeepPrevList == null) {
            v_KeepPrevList = optionsHtml;
            v_KeepHtml = htmlwizQuestion;
            console.log("===========null and return ===============");

            return;
        }


        console.log("===========2nd stage ===============");


        // 2nd time and hence forth
        for (i in optionsHtml) {
            console.log("2nd stage " + i + ":" + optionsHtml[i][0] + " id= " + optionsHtml[i][2] + " l_index=" + optionsHtml[i][3]);
            var l_id = optionsHtml[i][2]; ;
            v_stam = l_id;

            var l_item = v_KeepPrevList.find(Functional);

            // TBD not exists
            if (l_item == null) {
                console.log("===== ERROR   =====");
            }

            var j = l_item[3];
            var l_id2 = "#" + l_id;
            var l = $(l_id2).height() + 10;

            var del = (i - j) * l;
            console.log(i + "item found=  j ==> i   " + j + " ==>" + i + "  i-j=" + (i - j));
       //     if (del != 0) {

                
                move(l_id2).
                y(del).
                duration('2s')
                .end();
/*
                var l_new_y = i * l;
                move(l_id2).
                set('margin-top', l_new_y).
                duration('2s')
            .end();
            */


      //      }

        }

 //      v_KeepPrevList = optionsHtml;
        v_KeepHtml = htmlwizQuestion;

    })
}

//????????????????????????????????????????????

function Functional(element, index, array) {
    var l_bool = element[2] == v_stam;
    return l_bool;
}

// --------------------     ZN ---------------------------
function switch_i_j(ids,i, j) 
{
    if (i > j) {
        var temp = i;
        i = j;
        j = temp;
    }

    var idj = "#" + ids[j];

    var l = $(idj).height() + 10;

 //   var ll = $(".wizLayout").margin-top;
    //var ll = document.getElementById(".wizLayout").getAttribute("margin-top");

   // var x = $(ids[1]).offsetTop;

//    var l = $(ids[1]).offsetTop - $(ids[0]).offsetTop;
     
    var del = (i - j) * l;
    move(idj)
          .y(del).duration('2s')
          .end();
          
    for (var k = i; k < j ; k++) {
        var id_k = "#" + ids[k];

        var del_k = l;
  
        move(id_k)
          .y(del_k).duration('2s')
          .end();
    } 
}

// --------------------  End ZN ------------------------
//    Vote

function setWizVote(questionKey, optionKey, yesOrNot) {

    //Set new vote to an option    
    var votingDB = sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes/");

    votingDB.child(userName).set(yesOrNot);
    
}

// update text

function updateText(questionKey, optionKey){
    
    var textID = questionKey+optionKey;
        
    var textInput = $("#"+textID+"Edit").html();
    textInput = textInput.replace(/(?:\r\n|\r|\n)/g, '<br />');
    var titleInput = $("#"+textID+"TEdit").html();
        
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey+"/text/").update({mainText: textInput, title: titleInput});
    
    wizShowOptions(questionKey);
    $("#editWizQuestion").hide(500);
}


//create new div

function crearteNewOptionTexbox (questionKey) {
    
    var questionKeyStr = JSON.stringify(questionKey);
        
    var htmlText = "<div id='newOptionBoard'>אנא הציעו הצעה חדשה:<form class='pure-form'><input name='title' type='text' placeholder='כותרת ההצעה' size='20'><textarea name='text' placeholder='הסבר על ההצעה' rows='4' cols='30'></textarea><input type='button' value='אישור' class='pure-button pure-button-primary' onclick='createOption("+questionKeyStr+", this.form)'> <input type='button' class='pure-button button-warning' value='ביטול' onclick='hideEditWizQuestion()'></form></div>";
        
        $("#editWizQuestion").html(htmlText).show(500);
    
}

//create newoption in DB and show the options

function createOption(questionKey, form){
    
    var title = form.title.value;
    var text = form.text.value;
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');   
      
    sessionDB.child("questions/"+questionKey+"/options").push({text:
                                                               {
                                                                   mainText:text,
                                                                   title:title,
                                                                   color: getRandomColor()
                                                               }
                                                              });
    wizShowOptions(questionKey);
}

// delete option
       
function deleteWizOption (questionKey, optionKey){
    
    if (confirm("האם למחוק?") === false) {
        return;
    }
    
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey).remove();
    wizShowOptions(questionKey);
}

// --------------Edit Box ----------------------------
function editWizOption (questionKey, optionKey) {
    
    var questionKeyStr = JSON.stringify(questionKey);
    var optionKeyStr = JSON.stringify(optionKey);
    
        
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey).once("value",function(optionData){
        var titleOption = optionData.val().text.title;
        var textOption = optionData.val().text.mainText;
        textOption = textOption.replace(/(?:\r\n|\r|\n)/g, '<br />');
        
        if (optionData.val().text.color === undefined){            
            var color = "brown";
        } else {
            var color = optionData.val().text.color;
        }
            
        var colorStr = JSON.stringify(color);
        
        var htmlText = "<div class='wizLayout wizLayoutEdit' style='background-color:"+colorStr+">"+                            
                            "<div class='wizMainWrapText wizMainWrapTextEdit'>"+
                                "<div dir='rtl' class='wizMainText wizMainTextEdit'>"+
                                    "<div class='wizMainTextTitle wizMainTextTitleEdit' contenteditable='true' id='"+questionKey+optionKey+"TEdit'>"+
                                        titleOption+
                                    "</div>"+
                                    "<div class='wizMainTextText wizMainTextTextEdit' contenteditable='true' id='"+questionKey+optionKey+"Edit'>"+
                                        textOption+
                                    "</div>"+
                                "</div>"+
                                " <input type='button' class='pure-button pure-button-primary' value='OK' onclick='updateText("+questionKeyStr+","+optionKeyStr+")'> "+
                                 "<input type='button' class='pure-button button-error' value='מחיקה'"+
                                " onclick='deleteWizOption("+questionKeyStr+","+optionKeyStr+")'> "+                                
                            "</div></div>";
        
        $("#editWizQuestion").html(htmlText).show(500);
        
    })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hideEditWizQuestion () {
    $("#editWizQuestion").hide(500);
}