/***************************************/    
function resizeChart(){
    var h=$(window).height()-65;
    var w=$(window).width()-29;
    if($('#chart_div4').height()===h && $('#chart_div4').width()===w) return false;
    $('#chart_div4').height(h);
    $('#chart_div4').width (w);
    /*logIf.All();*/
   /* sendLog(CATID.Configuration,ACTID_CONFIG.WindowSize,{ height:$(window).height(),width:$(window).width(),agent:navigator.userAgent });*/
    return true;
}

google.setOnLoadCallback(function() {
    resizeChart();
    $(window).resize(function() {
        if(resizeChart()) kshf.updateLayout();
    });

    /*logIf.Check = logIf.All();*/

    var conceptStatesCol, knowledgeStatesCol, knowledgesCol, conceptsCol, expertsCol, authorCol, pubCol, keywordCol, knowledgeSpacesCol;

    // set height of the source dom as 
    kshf.init({
        chartTitle: "CreaKtive visu K(c)",
        domID : "#chart_div4",
        listMaxColWidthMult: 0.4,
        categoryTextWidth:165,
        dirRoot: "/",
        source : {
            // google spreadsheet ID
            gdocId : '0AjHlmhPaIb3XdFBDUnhhX241RkhXSjdXTmlrMnRoOXc',
            // the sheets to load from the spreadsheet
            sheets : [
                {name: "Knowledges"},
                {name: "Concepts"},
                {name: "KnowledgeSpaces"},
                {name: "Experts"},
                {name: "KnowledgeStates"}
            ]
        },
        loadedCb: function(){
            knowledgesCol = kshf.dt_ColNames.Knowledges;
            conceptsCol = kshf.dt_ColNames.Concepts;
            expertsCol = kshf.dt_ColNames.Experts;
            knowledgeSpacesCol = kshf.dt_ColNames.KnowledgeSpaces;
            // convert authors and keywords columns in publication table ( space separated IDs) to array
            kshf.cellToArray(kshf.dt.Knowledges, [knowledgesCol.expert, knowledgesCol.knowledgeSpace, knowledgesCol.conceptLink]);
        },
        charts : [
            {
                facetTitle: "conceptLink",
                catTableName: "Concepts",
                timeTitle: "date",
                timeBarShow: true,
<<<<<<< Updated upstream
                catLabelText: function(cpt){ return cpt.data[conceptsCol.title]+" - "+cpt.data[conceptsCol.State]; },
=======
                catLabelText: function(cpt){ return cpt.data[conceptsCol.title]; },//+" - "+cpt.data[conceptsCol.State]
>>>>>>> Stashed changes
//                selectType:"Single",
                barClassFunc: function(k){ return "bar_style_conceptState_"+k.data[conceptsCol.State];},
                sortingFuncs : [
                    { name: "Last pub.",  func: kshf.sortFunc_Time_Last },
                    { name: "First pub.",  func: kshf.sortFunc_Time_First },
                    { name:"# of Pub." }
                ],
                textFilter: 'about'
            },{
                facetTitle: "knowledgeSpace",
                catTableName: "KnowledgeSpaces",
                textFilter: 'in'
            },{
                facetTitle: "expert",
                catTableName: "Experts",
                textFilter: 'from'
            },{
                facetTitle: "State",
                barClassFunc: function(k){ return "bar_style_knowledgeState_"+k.data[1];},
                textFilter: 'as'
            }
        ],
        list : {
            sortColWidth: 85,
            sortOpts : [
                {   name: 'Date',
                    value: function(d){ return d.data[knowledgesCol['date']].getFullYear(); }
                }
            ],
            textSearch : 'title',
            detailsToggle : true,
            detailsDefault : false,
            contentFunc : function(d){
                str="";
                str+="<div class=\"iteminfo iteminfo_0\">";
                str+="<span onclick=\"kshf.listItemDetailToggleFunc2(this)\" style=\"cursor:pointer\">"+d.data[knowledgesCol.title]+"</span>";
                str+="</div>";

                str+="<span class=\"item_details\">"
                str+="<div class=\"iteminfo iteminfo_1\">desc: "+d.data[knowledgesCol.content]+"</div>"
                str+="<div class=\"iteminfo iteminfo_1\">date: "+d.data[knowledgesCol.date]+"</div>"
                str+="<div class=\"iteminfo iteminfo_3\">&#9733; expert: "+d.data[knowledgesCol.expert]+"</div>"
                str+="</span>";

                return str;
            }
        }
    });
});