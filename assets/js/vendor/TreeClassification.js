var TreeClassification ={



elements : [],







// A VIRER



render : function(tableau, color)



{



  tableau.forEach(function(el)



  {



    var html = "<div id='"+el.id+"' class='el' style='top:"+el.top+"px;left:"+el.left+"px;width: "+Math.floor((Math.random() * 100) + 10)+"; height: "+Math.floor((Math.random() * 50) + 10)+";background:"+color+"'><spam>"+el.id+"</div>";



      $('#container').append(html)



    });



  },







// Récupère un élément père en donnant son Id.



GetFather : function(father)



{



  for ( i in TreeClassification.elements)



  {



    if ( TreeClassification.elements[i].id == father ){



      return TreeClassification.elements[i];



    }



  }



},



// Donne le dernier objet enfant du tableau de tous les enfants



GetLastChild : function()



{



  return TabChild[(TabChild.length - 1)];



},



// Retourne un tableau d'objets enfants à partir d'un id père



GetChilds : function(father)



{



  TabChild = [];



  for ( i in TreeClassification.elements)



  {



    if ( TreeClassification.elements[i].id_father == father ){



      TabChild.push(TreeClassification.elements[i])



    }



  }



  return TabChild;



},



// Crée un tableau contenant tous les fils d'un père en plus de ce père en 1ere position



CreateTab : function(father, elemen)



{







  for ( var i =0; i < elemen.length; i++)



  {



    if ( elemen[i].id == father){



      TreeClassification.elements.push(elemen[i])



    }



  }



  TreeClassification.elements[0].id_father = "";



  var TabChild = []



  for ( var e = 0; e < TreeClassification.elements.length; e++)



  {



    var TabChild = []



    for ( var t =0; t < elemen.length; t++)



    {



      if ( elemen[t].id_father == TreeClassification.elements[e].id ){



        TabChild.push(elemen[t])



      }



    }



    TreeClassification.AddBoard(TreeClassification.elements,TabChild)



  }



},



// Copie un tableau



AddBoard : function ( tableau, tableauAAjouter)



{



  for ( i in tableauAAjouter)



  {



    tableau.push(tableauAAjouter[i])



  }



},



// Récupère le tableau final des positions et anime les éléments jusqu'à leur position alignée



animate : function(tableau, color)



{



  for ( var a = 0 ; a < tableau.length; a++ )



  {



    tableau[a].forEach(function(el)



    {



      $('#'+el.id+'').animate({



        top : ''+el.top+'px', left : ''+el.left+'px'



      },'slow');



      $('#'+el.id+'').css({



        background : ''+color+''



      });



    });



  }



},



  // Retourne pour un élément donné un tableau de ses feuilles (fils n'ayant aucun autre fils)



  GetFeuilles : function(tableau, feuilles)



  {



    var TabChildsIntermediaire =[];



    var TabChilds = tableau;



    for ( f in TabChilds)



    {



      var TabChildFeuille = TreeClassification.GetChilds(TabChilds[f].id)



      if ( TabChildFeuille.length < 1)



      {



        feuilles.push(TabChilds[f])



      }else



      {



        TreeClassification.AddBoard(TabChildsIntermediaire, TabChildFeuille);



      }



    }



    return TabChildsIntermediaire;



  },



  // Retourne toutes les feuilles (fils n'ayant aucun autre fils) d'un élément donné



  GetAllFeuilles : function(father)



  {



    var TabFeuilles =[];



    var TabDChilds = TreeClassification.GetChilds(father);



    for ( var f = 0; TabDChilds.length > 0; f++)



    {



      TabDChilds = TreeClassification.GetFeuilles(TabDChilds, TabFeuilles)



    }



    return TabFeuilles;



  },



  //Retourne un tableau contenant, pour chaque élément de la table enfants, son id et



  //le nombre de "colonnes" (emplacement vertical d'un élément) que ses descendants vont occuper.



  GetNbColonne : function()



  {



    var TabColonne =[];



    for ( var i = 0; i < TreeClassification.elements.length; i++)



    {



      TreeClassification.GetAllFeuilles(TreeClassification.elements[i].id)



      if ( TreeClassification.GetAllFeuilles(TreeClassification.elements[i].id).length < 1)



      {



        TabColonne.push({id : TreeClassification.elements[i].id, nbrC : 1 })



      }else{



        TabColonne.push({id : TreeClassification.elements[i].id, nbrC : TreeClassification.GetAllFeuilles(TreeClassification.elements[i].id).length })



      }



    }



    return TabColonne;



  },



  // Cette fonction est la base pour l'organisation de l'arbre.



  // Elle permet de créer un échiquier de cases vides et



  // place au bon endroit chaque élément



  // dans une des cases.



  // Le tableau de colonnes est utilisé pour connaitre la



  // taille de l'échiquier ainsi que pour placer chaque élément



  // en les centrant horizontalement sur leurs fils.



  // Si le nombre de fils est pairs, le père est placé dans la colonne inferieure.



  // Les cases sont alors remplies par des éléments réels ou virtuels.



  // Un tableau d'objets fils est créé pour chaque génération, formant la matrice finale.



  GetMatrice : function(tableauColonne, father)



  {



    var TbC = tableauColonne;



    var matrice = [];



    var TabDChilds = TreeClassification.GetChilds(father);



    var Elzero = 0;



    var Elinter = 0;



    var El = 0;



    var a = 0;







    if (TabDChilds.length == 0 )



    {



      TreeClassification.GetFather(father).vide = false;



      matrice.push({ id : 0 ,top : 10, left : 10, width : 10, height : 10, vide : true, id_father: father})                                                 // et que l'on as un element B avec un nbrC ( Nombre de colonne)



    }else{



      for ( p in TbC )



      {



        if ( TbC[p].id == father){



          for ( i = 0; i < TbC[p].nbrC  ; i++)



          {



            matrice.push({ id : i ,top : 10, left : 10, width : 10, height : 10, vide : true, id_father: father})



          }



        }



      }



      for ( var c = 0; c < TbC.length ; c++)



      {



        if( TabDChilds[0].id == TbC[c].id)



        {



          Elzero = TbC[c].nbrC / 2



          Elzero = Math.floor(Elzero);



          matrice[Elzero] = TabDChilds[0]



          Elinter = TbC[c].nbrC - 1



          matrice[Elzero].vide = false;







        }



      }







      for ( j = 1; j < TabDChilds.length ; j++)



      {



        for ( var c = 0; c < TbC.length ; c++)



        {



          if( TabDChilds[j].id == TbC[c].id)



          {







            El =  TbC[c].nbrC / 2



            test =  Elinter + Math.ceil(El)



            Elinter = test + Math.floor(TbC[c].nbrC / 2)



            matrice[test] = TabDChilds[j]







            matrice[test].vide = false;



          }



        }



      }



    }







    return matrice;



  },



  //Permet de calculer l'espace entre chaques cases réelles d'une ligne



  GetDeltaXH : function(tableau,espaceLeftH)



  {



    var espace =0 ;



    var nbrchild = tableau[0].length;



    for ( var a = 0; a < tableau[0].length; a++)



    {



      if( tableau[0][a].vide == true )



      {



        espace = espace + tableau[0][a].width;



      }



      else



      {



        espace = espace + $("#"+tableau[0][a].id+"").width();



      }



    }







    DeltaXH = ((( nbrchild - 1) * espaceLeftH )+ espace )/2  ;







    return DeltaXH;







  },



  //Remplace le tableau des enfants par la matrice des enfants incluant leur reposition brute



  alignH : function(father)



  {



    var TabChild = TreeClassification.GetMatrice(TreeClassification.GetNbColonne(), father);







    return TabChild;



  },



  //Ajuste la position horizontale de chaque élément afin qu'il se centre sur sa case



  MajEspaceLeft : function (tableau,TcolonneW,Tlvl, espaceleftH)



  {



    var espaceL = 0;



    var espaceLeftF = 0;



    var Gros = 0;



    for ( var i = 0; i < TcolonneW.length; i++){



      for ( var a = 0; a < Tlvl.length; a++){



        if ( tableau.id == TcolonneW[i][a].id){



          for ( var u = 0; u < TcolonneW[0].length; u++){



            if ( TcolonneW[i][u].vide == true){



              if ( TcolonneW[i][u].width > Gros){



                Gros = TcolonneW[i][u].width



              }



            }else{



              if ( $("#"+TcolonneW[i][u].id+"").width() > Gros){



                Gros = $("#"+TcolonneW[i][u].id+"").width()



              }



            }



          }



        }



      }



    }



    if ( tableau.vide == false ){



      espaceL = Gros - $("#"+tableau.id+"").width()



    }else{



      espaceL = Gros - tableau.width



    }



    if ( espaceL <= 0){



      espaceLeftFinal = espaceleftH



    }else{







      espaceLeftFinal = espaceleftH + espaceL



    }



    return espaceLeftFinal



  },



  //appliquée dans la matrice, cette fonction permet de définir la position d'un élément dans la case qui lui est attribuée



  GetHeightMaxLigne : function(tableau)



  {



    var HeightMax = 0;



    for ( var i = 0; i < tableau.length; i++){



        if ( $("#"+tableau[i].id+"").height() > HeightMax ){



          HeightMax = $("#"+tableau[i].id+"").height()



        }







    }



    return HeightMax







  },



  GetPosition : function(tableau, DeltaX, TcolonneW,Tlvl, espaceLeftH, espaceTopH)



  {



    var espaceLeftHF =0 ;



    tableau[0][0].left = TreeClassification.elements[0].left + ($("#"+TreeClassification.elements[0].id+"").width() /2)



    tableau[0][0].top = TreeClassification.elements[0].top + $("#"+TreeClassification.elements[0].id+"").height() + espaceTopH







    for ( var i = 0; i < tableau.length; i++){



      for ( var a = 0; a < tableau[0].length; a++){



        if (a == 0){



          tableau[i][a].left = tableau[0][0].left



          if ( i >= 1){







          if ( tableau[i-1][0].vide == true){



//console.log(tableau[i-1][0])



            tableau[i][0].top = tableau[i-1][0].top + tableau[i-1][0].height + espaceTopH

          }

          if( tableau[i-1][0].vide == false){

                var HeightMax = TreeClassification.GetHeightMaxLigne(tableau[i-1])

                tableau[i][0].top = tableau[i-1][0].top + HeightMax + espaceTopH

          }

        }

        }else{

          tableau[i][a].top = tableau[i][a-1].top

        }



        if ( i == 0 & a !=0){



          if ( tableau[i][a].vide == true){



            if ( tableau[i][a-1].vide == true){



              tableau[i][a].left = tableau[i][a-1].left +  tableau[i][a-1].width + espaceLeftH;



            }else {



              espaceLeftHF = TreeClassification.MajEspaceLeft( tableau[i][a-1], TcolonneW, Tlvl, espaceLeftH)



              tableau[i][a].left = tableau[i][a-1].left +  $("#"+tableau[i][a-1].id+"").width() + espaceLeftHF;



            }



          }else{



            espaceLeftHF = TreeClassification.MajEspaceLeft( tableau[i][a-1], TcolonneW, Tlvl, espaceLeftH)



            if ( tableau[i][a-1].vide == true){



              tableau[i][a].left = tableau[i][a-1].left +  tableau[i][a-1].width + espaceLeftHF;



            }else {



              tableau[i][a].left = tableau[i][a-1].left +  $("#"+tableau[i][a-1].id+"").width() + espaceLeftHF



            }



          }



        }if ( i > 0 & a != 0){



          tableau[i][a].left = tableau[i-1][a].left



        }



        if ( tableau[i][0].level == 1){



          tableau[i][a].top = tableau[0][0].top



        }



      }



    }



    return tableau;



  },



  //Crée un tableau dans lequel on associe à chaque id d'élément un level



  GetLevel : function(TabAlignAllH, lvlmax)



  {



    TabAlignAllH[0].forEach(function(el){



      el.level = 1



    });



    for ( i = 1; i < TabAlignAllH.length ; i++){



      for ( t = 0; t < TabAlignAllH[i].length; t++){



        father = TabAlignAllH[i][t].id_father



        if ( father == null ){



        }else{



          TabAlignAllH[i].forEach(function(el){



            el.level = TreeClassification.GetFather(father).level + 1



          });



        }



      }



    }



    return TabAlignAllH



  },



  //Crée un tableau contenant chaque ligne d'objets créée avec la fonction alignH



  alignAllH : function(espaceLeftH, espaceTopH )



  {



    var TabAlignAllH = []



    for ( i in TreeClassification.elements){



      TabAlignAllH.push(TreeClassification.alignH(TreeClassification.elements[i].id,espaceLeftH, espaceTopH ))



    }



    return TabAlignAllH



  },



  //Récupère le niveau de la dernière génération d'enfants à partir du tableau de niveaux créé par GetLevel



  LvlMax : function(tab)



  {



    var lvlMax=0



    for ( var a = 0 ; a < tab.length; a++){



      if ( tab[a][0].level > lvlMax){



        lvlMax = tab[a][0].level



      }



    }



    return lvlMax



  },



  //Génère un tableau contenant les blocs vides



  GetTabLevelColonne : function(Tlevel, Tlvl, Tcolonne, lvlmax)



  {



    for (var a = 1; a <= lvlmax -1 ; a++){



      Tlvl[a-1]= []



      var BlocVide = []



      BlocVide.push({ id : i ,top : 20, left : 10, width : 10, height : 30, vide : true})



      for ( var i = 0; i < Tlevel.length ; i++){



        if ( a == 1){



          if ( Tlevel[i][0].level == a){



            TreeClassification.AddBoard(Tlvl[a-1],Tlevel[i])



          }



        }else{



          if ( Tlevel[i][0].level == a){



            for ( var t = 0; t < Tlvl[a-2].length ; t++){



              if( Tlevel[i][0].id_father == Tlvl[a-2][t].id){



                condition = t - Tlvl[a-1].length - Math.floor(Tlevel[i].length)



                for ( var z = 0; z <= condition ; z++){



                  TreeClassification.AddBoard(Tlvl[a-1],BlocVide)



                }



                TreeClassification.AddBoard(Tlvl[a-1],Tlevel[i])



              }







            }



          }



        }



      }



    }



    for ( var a = 0; a < Tlvl[0].length; a++){



      Tcolonne[a]= []



      for ( var z = 0; z < Tlvl.length; z ++){



        Tcolonne[a].push(Tlvl[z][a])



      }



    }



    for ( var i = 0; i < Tcolonne.length; i++){



      for ( var e = 0; e < Tcolonne[0].length; e++){



        if ( Tcolonne[i][e] == null){



          var BlocVide = []



          BlocVide.push({ id : i ,top : 20, left : 10, width : 10, height : 10, vide : true, id_father: father})



          Tcolonne[i][e] = BlocVide[0]



        }



      }



    }



    for ( var i = 0; i < Tlvl.length; i++){



      for ( var e = 0; e < Tlvl[0].length; e++){



        if ( Tlvl[i][e] == null){



          var BlocVide = []



          BlocVide.push({ id : i ,top : 20, left : 10, width : 10, height : 10, vide : true, id_father: father})



          Tlvl[i][e] = BlocVide[0]



        }



      }



    }



  },



  //Retourne le width max d'une colonne



  GetDimensionEmptyBloc : function ( TlvlH, TcolonneW)



  {



    for ( var i = 0; i < TlvlH.length; i++){



      for ( var z = 0; z < TcolonneW.length; z++){



        if ( TlvlH[i][z].vide == true){



          TlvlH[i][z].width = TcolonneW[z][i].width



        }



      }



    }



    return TlvlH



  },



  //Retourne le height max d'une ligne à partir du tableau des levels



  GetHeightMax : function (Tlvl)



  {



    var heightMax = 0;



    for ( var i = 0; i < Tlvl.length; i++){



      for ( var u = 0; u < Tlvl[0].length; u++){



        if ( Tlvl[i][u].vide == false){



          if ( $("#"+Tlvl[i][u].id+"").height() > heightMax){



            heightMax = $("#"+Tlvl[i][u].id+"").height()



          }



        }



      }



      for ( var e = 0; e < Tlvl[0].length; e++){



        if ( Tlvl[i][e].vide == true){



          Tlvl[i][e].height = heightMax



        }



      }



      heightMax = 0;



    }



    return Tlvl;



  },



  //Retourne le width max d'une colonne à partir du tableau de colonnes



  GetWidthMax : function (Tcolonne)



  {



    var widthMax = 0;



    for ( var i = 0; i < Tcolonne.length; i++){



      for ( var u = 0; u < Tcolonne[0].length; u++){



        if ( Tcolonne[i][u].vide == false){



          if ( $("#"+Tcolonne[i][u].id+"").width() > widthMax){



            widthMax = $("#"+Tcolonne[i][u].id+"").width()



          }



        }



      }



      for ( var e = 0; e < Tcolonne[0].length; e++){



        if ( Tcolonne[i][e].vide == true){



          Tcolonne[i][e].width = widthMax



        }



      }



      widthMax = 0;



    }



    return Tcolonne;



  },



//retourne le width max d'une ligne

   GetWidthMaxNode : function (NbColonne, position)



  {



    var widthMax = 0;



    for ( var z = 0; z < position.length; z++){



        if ( position[z][NbColonne].vide == false){



          if ( $("#"+position[z][NbColonne].id+"").width() > widthMax){



            widthMax = $("#"+position[z][NbColonne].id+"").width()



          }

        }else {

          if (position[z][NbColonne].width > widthMax){



            widthMax = position[z][NbColonne].width

          }

        }



      }

    return widthMax ;

  },





  //Recentre chacun des éléments dans la case qui leur est attribuée



  MajCenterMatrice : function (final)



  {



    var ecartVide = 0;



    var Tinter = []



    var TinterVide =[]



    for ( var u = 0; u < final[0].length; u++){



      if ( final[0][u].vide == false){



        Tinter.push(final[0][u])



      }



    }



    for ( var t = 0; t != -1; t++ ){



      if ( final[0][t].vide == false){



        t = -2



      }else{



        TinterVide.push(final[0][t])



      }



    }



    if ( TinterVide.length == 0 ){



      ecartVide = 0



    }else{



      ecartVide =  Tinter[0].left - TinterVide[0].left



    }



    var ecartTotal =  (Tinter[Tinter.length-1].left + $("#"+Tinter[Tinter.length-1].id+"").width()) - Tinter[0].left



    for ( var a = 0; a < final.length; a++){



      for (var i = 0; i < final[a].length ; i++ ){



        final[a][i].left = final[a][i].left - ( ecartTotal / 2  + ecartVide )



      }



    }



    return final



  },



  //Recentre horizontalement tous les pères au centre de ceux-ci



  AlignFather : function (position)



  {



    for ( var u = position.length -2 ; u >= 0 ; u--){



      for (var i = 0; i < position[u].length ; i++ ){





        var WidthMaxNode = TreeClassification.GetWidthMaxNode(i, position)



        //console.log(WidthMaxNode)





        var TabChilds = TreeClassification.GetChilds(position[u][i].id)



        if (TabChilds.length == 1  ){



          if( TabChilds[0].id != "A"){

            console.log(position[u][i].id)

            console.log(TabChilds)

            if ( $("#"+TabChilds[0].id+"").width() > $("#"+position[u][i].id+"").width() )

            {

              position[u][i].left = TabChilds[0].left + ( ( $("#"+TabChilds[0].id+"").width() - $("#"+position[u][i].id+"").width()) / 2)

            }else{

              position[u][i].left = TabChilds[0].left - ( ( $("#"+position[u][i].id+"").width() - $("#"+TabChilds[0].id+"").width() ) / 2)



            }



        if ( TabChilds.length == 1 & u == position.length -2 ){

          TabChilds[0].left = TabChilds[0].left + ( ( WidthMaxNode - $("#"+TabChilds[0].id+"").width()) / 2)

        }

        }

        }

        if (TabChilds.length > 1){





    position[u][i].left = (TabChilds[0].left + (((TabChilds[TabChilds.length-1].left + $("#"+TabChilds[TabChilds.length-1].id+"").width()) - TabChilds[0].left) / 2)) - ($("#"+position[u][i].id+"").width() / 2)





        }

      }



    }



    return position



  },



  //Crée la liste contenant les éléments existants et leur position finale



  GetTabFinal : function(tableau){



    var TabFinal=[];



    for ( var i = 0; i < tableau.length; i++){



      for ( var a= 0; a < tableau[i].length; a++){



        if ( tableau[i][a].vide == false){







          TabFinal.push(tableau[i][a])

        }

      }

    }

    return TabFinal

  },

  //Fonction finale d'alignement horizontal réunissant chacune des fonctions précédentes afin de générer l'arbre généalogique final

  alignHF : function(father, espaceLeftH, espaceTopH, elemen)

  {
    var TreeClassification.elements.length = 0;

    var Tlvl = [];

    var Tcolonne = [];

    TreeClassification.CreateTab(father, elemen)

    TreeClassification.render(TreeClassification.elements, "red");

    TabAlignAllH = TreeClassification.alignAllH(espaceLeftH, espaceTopH)

    var Tlevel = TreeClassification.GetLevel(TabAlignAllH)

    var lvlmax = TreeClassification.LvlMax(Tlevel)

    TreeClassification.GetTabLevelColonne(Tlevel, Tlvl, Tcolonne, lvlmax)

    var TcolonneW = TreeClassification.GetWidthMax(Tcolonne)

    var TlvlH = TreeClassification.GetHeightMax(Tlvl)

    var dimensionEmptyBloc = TreeClassification.GetDimensionEmptyBloc(TlvlH, TcolonneW)

    var DeltaX = TreeClassification.GetDeltaXH(dimensionEmptyBloc, espaceLeftH)

    var Position = TreeClassification.GetPosition(dimensionEmptyBloc, DeltaX, TcolonneW,Tlvl ,espaceLeftH, espaceTopH)

    var AlignFP= TreeClassification.AlignFather(Position)

    var Final = TreeClassification.MajCenterMatrice(AlignFP)

    TreeClassification.animate(Final)

    var TabFinal = TreeClassification.GetTabFinal(Position)

    return TabFinal

  },

}

