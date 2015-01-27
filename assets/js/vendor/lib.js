var lib ={
  elements : [],
  // Cette fonction permet de récuperer
  // l'element dit "Père" juste en donnant
  // son Id.
  GetFather : function(father)
  {
    for ( i in lib.elements)
    {
      if ( lib.elements[i].id == father ){
        return lib.elements[i];
      }
    }
  },
  // Cette fonction nous donne le dernier
  // "Enfant" de notre tableau TabChild
  GetLastChild : function()
  {
    return TabChild[(TabChild.length - 1)];
  },
  // Cette fonction nous crée un tableau "d'Enfant"
  // Elle parcours le tableau en comparant
  // Id_Father avec le Father donné à la fonction
  // Puis elle return le tableau
  GetChilds : function(father)
  {
    TabChild = [];
    for ( i in lib.elements)
    {
      if ( lib.elements[i].id_father == father ){
        TabChild.push(lib.elements[i])
      }
    }

    return TabChild;

  },

  CreateTab : function(father, elemen)
  {

    for ( var i =0; i < elemen.length; i++)
    {
      if ( elemen[i].id == father){
        lib.elements.push(elemen[i])
      }
    }
    lib.elements[0].id_father = "";

    var TabChild = []
    for ( var e = 0; e < lib.elements.length; e++)
    {
      var TabChild = []
      for ( var t =0; t < elemen.length; t++)
      {
        if ( elemen[t].id_father == lib.elements[e].id ){
          TabChild.push(elemen[t])
        }
      }
      lib.AddBoard(lib.elements,TabChild)
    }
  },
  // Cette Fonction nous permet d'ajouter les lib.elements d'un
  // dans un autre. Cela permet d'éviter d'avoir un tableau
  // dans un autre on recupere un tableau contenant tous
  // les lib.elements d'autres tableau.
  AddBoard : function ( tableau, tableauAjouter)
  {
    for ( i in tableauAjouter)
    {
      tableau.push(tableauAjouter[i])
    }
  },

  // Elle nous permet d'animer des lib.elements
  // Elle recupere un tableau et modifie le
  // Top et le Left de l'element tous en l'animant
  animate : function(tableau)
  {
    for ( var a = 0 ; a < tableau.length; a++ )
    {
      tableau[a].forEach(function(el)
      {
        $('#'+el.id+'').animate({
          top : ''+el.top+'px', left : ''+el.left+'px'
        },'slow');

        
      });
    }
  },

  // Cette fonction nous permet de dessiner un tableau
  // Elle crée un DIV par lib.elements du tableau
  // avec un width et height aléatoire.
  render : function(tableau, color)
  {
    tableau.forEach(function(el)
    {

      var html = "<div id='"+el.id+"' class='el' style='top:"+el.top+"px;left:"+el.left+"px;width: "+Math.floor((Math.random() * 50) + 10)+"; height: "+Math.floor((Math.random() * 50) + 10)+";background:"+color+"'><spam>"+el.id+"</div>";

        $('#container').append(html)
      });
    },
    // Cette fonction genere nos "Feuilles"
    // Une feuilles correspond à un element
    // qui n'est "Père" de personne, qui ne
    // possede donc pas "d'Enfant".
    // Elle vas crée un Tableau "d'Enfant"
    // pour un element, si un element
    // n'as pas d'enfant, il est envoyé
    // tous ses "Enfant" dans un tableau
    // dans notre tableau de Feuilles
    // si il as des enfants, on ajoute
    // de sauvegarde pour ne pas perdre
    // ses "Enfant" et le réutiliser plus tard.
    // Elle retourne notre tableau "d'Enfant"
    // à réutiliser.
    GetFeuilles : function(tableau, feuilles)
    {
      var TabChildsIntermediaire =[];
      var TabChilds = tableau;
      for ( f in TabChilds)
      {
        var TabChildFeuille = lib.GetChilds(TabChilds[f].id)
        if ( TabChildFeuille.length < 1)
        {
          feuilles.push(TabChilds[f])
        }else
        {
          lib.AddBoard(TabChildsIntermediaire, TabChildFeuille);
        }
      }
      return TabChildsIntermediaire;
    },

    // Cette fonction vas réutiliser en boucle
    // la fonction GetFeuilles.
    // Cela nous permet de faire un tableau des
    // de TOUS les lib.elements et donc de savoir
    // qui est la feuille, qui se situe à la
    // fin de la branche.
    // Elle retourne notre tableau contenant
    // toutes les feuilles.
    GetAllFeuilles : function(father)
    {
      var TabFeuilles =[];
      var TabDChilds = lib.GetChilds(father);

      for ( var f = 0; TabDChilds.length > 0; f++)
      {
        TabDChilds = lib.GetFeuilles(TabDChilds, TabFeuilles)
      }

      return TabFeuilles;
    },

    //Cette fonction permet de savoir combien
    // de feuilles possede un element
    // cela nous permet de savoir sur combien
    // de colonne la branche de cette element
    // vas grandir. Une colonne = une feuille
    // elle nous retourn un tableau contenant
    // l'Id de l'element et le nbrC ( nombre de colonne)

    GetNbColonne : function()
    {
      var TabColonne =[];
      for ( var i = 0; i < lib.elements.length; i++)
      {
        lib.GetAllFeuilles(lib.elements[i].id)
        if ( lib.GetAllFeuilles(lib.elements[i].id).length < 1)
        {
          TabColonne.push({id : lib.elements[i].id, nbrC : 1 })
        }else{
          TabColonne.push({id : lib.elements[i].id, nbrC : lib.GetAllFeuilles(lib.elements[i].id).length })
        }
      }
      return TabColonne;
    },
    // Cette fonction est la base pour l'organisation de l'abre
    // Elle permet de créer un échiquier de case vide et
    // vas placer au bonne endroit l'element que l'on souhaite
    // dans une des cases.
    // Elle se sert du tableau des colonnes pour connaitre la
    // taille de l'échiquier
    // Ensuite elle place l'element au bonne endroit en regardant
    // Combien de colonne il vas falloir pour que la branche
    // si on prend pas exemple un echiquier de longueur 7
    // se devellope.
    //  de 5, alors il va considerer que B prendra la place de 5
    // colonne sur les 7 disponible
    // Ensuite il placeras B au milieu des "5 colonnes"
    // C'est à dire on cosidere qui vas occuper les colonnes
    // ([0],[1],[2],[3],[4],)
    // On divise le nombre de colonne de B donc 5 / 2 = 2,5
    // Du coup on place l'element B dans la case [2].
    // Puis le Math.floor() permet d'arrondir au chiffre inferieur
    // On fait cela en boucle en ajoutant a chaque fois les cases
    // déjà occupé, par exemple si C prend 1 case, il ne seras
    // pas à la case [0] mais à la case [5] car B occupe les autres.
    GetMatrice : function(tableauColonne, father)
    {
      var TbC = tableauColonne;
      var matrice = [];
      var TabDChilds = lib.GetChilds(father);
      var Elzero = 0;
      var Elinter = 0;
      var El = 0;
      var a = 0;

      if (TabDChilds.length == 0 )
      {
        lib.GetFather(father).vide = false;
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

    alignH : function(father)
    {
      var TabChild = lib.GetMatrice(lib.GetNbColonne(), father);

      return TabChild;
    },
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
    GetPosition : function(tableau, DeltaX, TcolonneW,Tlvl, espaceLeftH, espaceTopH)
    {
      var espaceLeftHF =0 ;
      tableau[0][0].left = lib.elements[0].left + ($("#"+lib.elements[0].id+"").width() /2)
      tableau[0][0].top = lib.elements[0].top + $("#"+lib.elements[0].id+"").height() + espaceTopH

      for ( var i = 0; i < tableau.length; i++){
        for ( var a = 0; a < tableau[0].length; a++){
          if (a == 0){
            tableau[i][a].left = tableau[0][0].left
            if ( i >= 1){

            if ( tableau[i-1][a].vide == true){

              tableau[i][a].top = tableau[i-1][a].top + tableau[i-1][a].height + espaceTopH
            }else{
              for ( var l = 0; l < tableau[i-1].length; l++ ){
                if (tableau[i-1][l].vide == true ){
                  tableau[i][a].top = tableau[i-1][l].top + tableau[i-1][l].height + espaceTopH
                }
              }
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
                espaceLeftHF = lib.MajEspaceLeft( tableau[i][a-1], TcolonneW, Tlvl, espaceLeftH)
                tableau[i][a].left = tableau[i][a-1].left +  $("#"+tableau[i][a-1].id+"").width() + espaceLeftHF;
              }
            }else{
              espaceLeftHF = lib.MajEspaceLeft( tableau[i][a-1], TcolonneW, Tlvl, espaceLeftH)
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
              el.level = lib.GetFather(father).level + 1
            });
          }
        }
      }
      return TabAlignAllH
    },

    alignAllH : function(espaceLeftH, espaceTopH )
    {
      var TabAlignAllH = []
      for ( i in lib.elements){
        TabAlignAllH.push(lib.alignH(lib.elements[i].id,espaceLeftH, espaceTopH ))
      }
      return TabAlignAllH
    },

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

    GetTabLevelColonne : function(Tlevel, Tlvl, Tcolonne, lvlmax)
    {
      for (var a = 1; a <= lvlmax -1 ; a++){
        Tlvl[a-1]= []
        var BlocVide = []
        BlocVide.push({ id : i ,top : 10, left : 10, width : 10, height : 30, vide : true})

        for ( var i = 0; i < Tlevel.length ; i++){
          if ( a == 1){
            if ( Tlevel[i][0].level == a){
              lib.AddBoard(Tlvl[a-1],Tlevel[i])
            }
          }else{
            if ( Tlevel[i][0].level == a){
              for ( var t = 0; t < Tlvl[a-2].length ; t++){
                if( Tlevel[i][0].id_father == Tlvl[a-2][t].id){
                  condition = t - Tlvl[a-1].length - Math.floor(Tlevel[i].length)


                  for ( var z = 0; z <= condition ; z++){
                    lib.AddBoard(Tlvl[a-1],BlocVide)
                  }
                  lib.AddBoard(Tlvl[a-1],Tlevel[i])

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
            BlocVide.push({ id : i ,top : 10, left : 10, width : 10, height : 10, vide : true, id_father: father})
            Tcolonne[i][e] = BlocVide[0]
          }
        }
      }
      for ( var i = 0; i < Tlvl.length; i++){
        for ( var e = 0; e < Tlvl[0].length; e++){
          if ( Tlvl[i][e] == null){
            var BlocVide = []
            BlocVide.push({ id : i ,top : 10, left : 10, width : 10, height : 10, vide : true, id_father: father})
            Tlvl[i][e] = BlocVide[0]
          }
        }
      }
    },
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

    AlignFatherPair : function (position)
    {
      for ( var u = position.length - 2 ; u >= 0 ; u--){
        for (var i = 0; i < position[u].length ; i++ ){
          var TabChilds = lib.GetChilds(position[u][i].id)
          if ( TabChilds.length > 1){
            espacechilds = (TabChilds[TabChilds.length-1].left + $("#"+TabChilds[TabChilds.length-1].id+"").width() - TabChilds[0].left) /2
            position[u][i].left = TabChilds[0].left + espacechilds - ($("#"+position[u][i].id+"").width()/2)
          }
          if ( TabChilds.length == 1){
            if ($("#"+TabChilds[0].id+"").width() > $("#"+position[u][i].id+"").width()){
              var test = ($("#"+TabChilds[0].id+"").width() - $("#"+position[u][i].id+"").width()) / 2
              position[u][i].left = TabChilds[0].left + test
            }else{
              var test = ($("#"+position[u][i].id+"").width() - $("#"+TabChilds[0].id+"").width()) / 2
              position[u][i].left = TabChilds[0].left - test
            }

          }
        }
      }
      return position
    },
    alignHF : function(father, espaceLeftH, espaceTopH, elemen)
    {
      lib.elements.length = 0;
      var Tlvl = [];
      var Tcolonne = [];
      lib.CreateTab(father, elemen)
      lib.render(lib.elements, "red");
      TabAlignAllH = lib.alignAllH(espaceLeftH, espaceTopH)
      var Tlevel = lib.GetLevel(TabAlignAllH)
      var lvlmax = lib.LvlMax(Tlevel)
      lib.GetTabLevelColonne(Tlevel, Tlvl, Tcolonne, lvlmax)
      var TcolonneW = lib.GetWidthMax(Tcolonne)
      var TlvlH = lib.GetHeightMax(Tlvl)
      var dimensionEmptyBloc = lib.GetDimensionEmptyBloc(TlvlH, TcolonneW)
      var DeltaX = lib.GetDeltaXH(dimensionEmptyBloc, espaceLeftH)
      var Position = lib.GetPosition(dimensionEmptyBloc, DeltaX, TcolonneW,Tlvl ,espaceLeftH, espaceTopH)
      var AlignFP= lib.AlignFatherPair(Position)
      var Final = lib.MajCenterMatrice(AlignFP)
      lib.animate(AlignFP)
      return Final
    },
  }
