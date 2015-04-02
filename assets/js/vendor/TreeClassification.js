  var TreeClassification ={
elements : [],
// Permet de créer une chaine de 5 caractere aléatoire, qui nous permet de génerer un id
// aléatoire pour la création des arbres 
ChaineAleatoire : function(){
  var ListeCar = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
  var Chaine ="";
  for(i = 0; i < 5; i++)
  {
    Chaine = Chaine + ListeCar[Math.floor(Math.random()*ListeCar.length)];
  }
  return Chaine;
},
// Fonction utilisée pour choisir aléatoirement le nombre d'enfant d'un père pour la création des arbres
ChiffreAleatoire : function(nbint){
  var chiffre = Math.floor((Math.random() * nbint) + 0)
  return chiffre
},
// Crée des arbre totalement aléatoire avec un père "A" positionné au centre du Canvas
// L'algo crée un abre avec en parametre le Level qui correspond au nombre de level max de l'arbre
// et du CM : ChildrenMax c'est a dire le nombre maximum d'enfant par parent.
TreeRandom : function(level,CM){
  var elemen = [];
  var nbrFinal = 1;
  var childLvl =0;
  var i = 0;
  elemen.push({id : "A",id_father : "" , top: 5000, left: 5000, level : 0})
  for ( var z = 0; z < level; z ++){
    for ( t in elemen){
      if( elemen[t].level == z){
        childLvl = childLvl +  1
      }
    }
    for ( var i = i; i < childLvl; i++){
      var nbrchild = TreeClassification.ChiffreAleatoire(CM)
      for( var a =0; a < nbrchild; a++ ){
        var idAleatoire = TreeClassification.ChaineAleatoire()
        elemen.push({id : idAleatoire,id_father : elemen[i].id , top: Math.floor((Math.random() * 1000) + 100), left: Math.floor((Math.random() * 1000) + 100), level : z+1})
      }
    }
  }
  return elemen
},
//anime les éléments en les faisant glisser jusqu'à leur pôsition finale
animate : function(tableau, color){
  tableau.forEach(function(el){
  $('#'+el.id+'').animate({ top : ''+el.top+'px', left : ''+el.left+'px' },'slow');$('#'+el.id+'').css({background : ''+color+''});});
},
//crée les traits du root aux premiers enfants  
animateTraitFatherChild : function(tableau, color,elemen) { 
  var c = document.getElementById("id_canvas"); 
  var ctx = c.getContext("2d"); 
  ctx.lineWidth = 5; 
  ctx.beginPath(); 
  ctx.strokeStyle = color; 
  for ( var t = 0; t < tableau.length ;t++){ 
        if ( tableau[t].id_father == elemen[0].id){ 
          ctx.moveTo(elemen[0].left,elemen[0].top) 
          ctx.lineTo(tableau[t].left,tableau[t].top)  
    		}
  		}
   ctx.stroke(); 
},
//crée les traits d'une génération à la suivante
animateTrait : function( tableau, color){ 
  var c = document.getElementById("id_canvas"); 
  var ctx = c.getContext("2d");
   ctx.lineWidth = 5;
   ctx.beginPath();
    ctx.strokeStyle = color;
    for ( var t = 0; t < tableau.length ;t++){ 
      for ( var y = 0; y < tableau.length; y++){
          if ( tableau[y].id_father == tableau[t].id){
           ctx.moveTo(tableau[y].left,tableau[y].top) 
           ctx.lineTo(tableau[t].left,tableau[t].top)
            }}
             } 
            ctx.stroke(); 
          },
//retourne l'objet élément à partir de son id
GetElement : function(idelement){
  for ( i in TreeClassification.elements){
    if ( TreeClassification.elements[i].id == idelement ){
      return TreeClassification.elements[i];
    }
  }
},
// Dessine, créer les elements HTML en leur donnant un Width et un Height aléatoire compris entre 50 et 150.
render : function(tableau, color){
  TreeClassification.elements.forEach(function(el){
  var html = "<div id='"+el.id+"' class='el' style='top:"+el.top+"px;left:"+el.left+"px;width:"+Math.floor((Math.random() * 150) + 50)+"; height:"+Math.floor((Math.random() * 100) + 5)+";background:"+color+"'><spam>"+el.id+"</div>";$('#container').append(html)});
},
//permet d'aditionner 
AddBoard : function ( tableau, tableauaAjouter){
  for ( i in tableauaAjouter){
    tableau.push(tableauaAjouter[i])
  }
},
//retourne l'objet père d'un élément
GetFatherreal : function(idelement, root){
  if (idelement != root){
  element = TreeClassification.GetElement(idelement)
  	for ( i in TreeClassification.elements){
  	  if ( TreeClassification.elements[i].id == element.id_father ){
      return TreeClassification.elements[i];
    	}
  	}
	}
},
//différencie les éléments qui possèdent le même left en incrémentant chaque left différent par 1
MajLeft : function(elements){
 var verifLeft = false
 while (verifLeft == false){
 var verif = 0
  for ( var i =0; i < elements.length; i++){
  var diff = 1
  	for ( var a =0; a < elements.length; a++){
  		if ( elements[i].id != elements[a].id){
   		if ( elements[i].left == elements[a].left ){
      	elements[a].left += diff
					diff += 1
					verif = 1
    		}
  		}    
  	}
	}
  if ( verif == 0){
    verifLeft = true
  }
 }
},
//différencie les éléments qui possèdent le même top en incrémentant chaque top différent par 1
MajTop : function(elements){
 var verifTop = false
 while (verifTop == false){
 var verif = 0
  for ( var i =0; i < elements.length; i++){
  var diff = 1
  	for ( var a =0; a < elements.length; a++){
  		if ( elements[i].id != elements[a].id){
    		if ( elements[i].top == elements[a].top ){
      	elements[a].top += diff
				diff += 1
				verif = 1
    		}
	  	}    
	  }
	}
  if ( verif == 0){
    verifTop = true
  }
 }
},
//Crée la table "elements" des éléments à aligner avec le root en 1ere position et trie les éléments en fonction de leur left (permet de réorganiser l'arbre en déplaçant les branches)
BaseTableH : function(father, elemen){
  for ( var i =0; i < elemen.length; i++){
    if ( elemen[i].id == father){
      TreeClassification.elements.push(elemen[i])
    }
  }
  TreeClassification.elements[0].id_father = "";
  for ( var e = 0; e < TreeClassification.elements.length; e++){
    var TabChild = []
    for ( var t =0; t < elemen.length; t++)
    {
      if ( elemen[t].id_father == TreeClassification.elements[e].id ){
        TabChild.push(elemen[t])
      }
    }
    TreeClassification.MajLeft(TabChild)
		TabChild.sort(function(a, b){return a.left-b.left});
    TreeClassification.AddBoard(TreeClassification.elements,TabChild)
  }
},
//Crée la table "elements" des éléments à aligner avec le root en 1ere position et trie les éléments en fonction de leur top (permet de réorganiser l'arbre en déplaçant les branches)
BaseTableV : function(father, elemen){
  for ( var i =0; i < elemen.length; i++){
    if ( elemen[i].id == father){
      TreeClassification.elements.push(elemen[i])
    }
  }
  TreeClassification.elements[0].id_father = "";
  for ( var e = 0; e < TreeClassification.elements.length; e++){
    var TabChild = []
    for ( var t =0; t < elemen.length; t++)
    {
      if ( elemen[t].id_father == TreeClassification.elements[e].id ){
        TabChild.push(elemen[t])
      }
    }
    TreeClassification.MajTop(TabChild)
		TabChild.sort(function(a, b){return a.top-b.top});
    TreeClassification.AddBoard(TreeClassification.elements,TabChild)
  }
},
//retourne la 1ere génération d'enfants d'un élément
GetChilds : function(father){
  TabChild = [];
  for ( i in TreeClassification.elements){
    if ( TreeClassification.elements[i].id_father == father ){
      TabChild.push(TreeClassification.elements[i])
    }
  }
  return TabChild;
},
GetAllChilds : function(father){
  var TabChild = TreeClassification.GetChilds(father)
  var TabAllChild = []
  var TabInterm = []
//si father a des enfants et tant qu'on en trouve
while (TabChild.length>0){
//on parcours tab enfants
  for (q in TabChild){
  //on y met ce qu'on y trouve
    TabAllChild.push(TabChild[q])
    //Si un enfant a des enfants
    if (TreeClassification.GetChilds(TabChild[q].id).length > 0){
      //On fout tout ce bordel dans une table intermédiaire
      TreeClassification.AddBoard(TabInterm, TreeClassification.GetChilds(TabChild[q].id))
    }
  }
  //on récupère la tab interm en remplaçant la TabChild
  TabChild = TabInterm
  //et on vide la tabInterm
  TabInterm = []
  //et c'est repartit pour un tour
}
return TabAllChild
},
//permet d'avoir un tableau des éléments ascendents d'un élément défini jusqu'au root
GetAscendents : function (oneElement, TabAllChild, root){
var TabAscendents = [];
var son = TreeClassification.GetElement(oneElement);
TabAscendents.push(son)
if (oneElement == root){
  return TabAscendents
}else{
  var father = TreeClassification.GetFatherreal(oneElement, root)
  while (son.id_father != root){
      TabAscendents.push(father)
      son = father
        if (son.id_father != root){
          father = TreeClassification.GetFatherreal(son.id)
      }      
    }
  TabAscendents.push(TreeClassification.GetElement(root))
}
return TabAscendents
},
//Permet d'obtenir le level d'un élément en comptant le nombre de ses ascendants jusqu'au root
GetLevel : function (oneElement, TabAllChild, root){
var level = 0
var TabAscendents=TreeClassification.GetAscendents(oneElement, TabAllChild, root)
level = TabAscendents.length-1 ;
return level;
},
//crée une table copiant la table de tous les enfants et ajoutant pour chaque élément son level et le nombre de colonnes que ses feuilles occupent
GetTabAllInfo : function(TabAllChild, root){
var TabAllInfo =[];
  for ( v in TabAllChild){
    if ( TreeClassification.GetAllFeuilles(TabAllChild[v].id).length < 1){
      TabAllInfo.push({id : TabAllChild[v].id, id_father : TabAllChild[v].id_father , top: TabAllChild[v].top, left : TabAllChild[v].left, nbrC : 1, lvl : TreeClassification.GetLevel(TabAllChild[v].id, TabAllChild, root)})
    }else{
      TabAllInfo.push({id : TabAllChild[v].id, 
        id_father : TabAllChild[v].id_father , 
        top: TabAllChild[v].top, 
        left : TabAllChild[v].left, 
        nbrC : TreeClassification.GetAllFeuilles(TabAllChild[v].id).length, 
        lvl : TreeClassification.GetLevel(TabAllChild[v].id, TabAllChild, root)})
    }
  }
return TabAllInfo;
},
//permet d'obtenir les feuilles de la 1ere génération d'un élément
GetFeuilles : function(tableau, TabFeuilles){
  var TabChildsIntermediaire =[];
  var TabChilds = tableau;
  for ( f in TabChilds){
    var TabChildFeuille = TreeClassification.GetChilds(TabChilds[f].id)
    if ( TabChildFeuille.length < 1){
      TabFeuilles.push(TabChilds[f])
    }else{
      TreeClassification.AddBoard(TabChildsIntermediaire, TabChildFeuille);
    }
  }
  return TabChildsIntermediaire;
},
//permet d'obtenir toutes les feuilles d'un élément
GetAllFeuilles : function(father){
  var TabFeuilles =[];
  var TabDChilds = TreeClassification.GetChilds(father);
   for ( var f = 0; TabDChilds.length > 0; f++){
    TabDChilds = TreeClassification.GetFeuilles(TabDChilds, TabFeuilles)
  }
return TabFeuilles;
},
//FONCTIONS RELATIVES A L ALIGNEMENT HORIZONTAL
//retourne la largeur d'une première génération d'enfants avec en paramètre la largeur de base entre éléments
GetWidthChilds : function(father, TabChild, espaceLeftH){
  var widthChilds = 0
  var TabChild = TreeClassification.GetChilds(father)
  if (TabChild.length>0){
    for (r in TabChild){
      //si le père d'un fils unique est plus gros, on prend son width à la place de celle du fils (anti-collision)
           if ( TabChild.length == 1 & $("#"+father+"").width() > $("#"+TabChild[r].id+"").width()){
              widthChilds = $("#"+father+"").width() + espaceLeftH
          }else{
             widthChilds = widthChilds + $("#"+TabChild[r].id+"").width() + espaceLeftH
          }
        }
    }
  return widthChilds
},
//retourne la largeur de toutes les feuilles d'un élément selon la largeur de base entre éléments
GetWidthAllFeuilles : function(father, root, TabAllChild, espaceLeftH){
  var widthAllFeuilles = 0
  var TabFeuilles = TreeClassification.GetAllFeuilles(father)
  if (TabFeuilles.length>0){
    for (r in TabFeuilles){
      //si le père d'un fils unique est plus gros, on prend son width à la place de celle du fils
        var TabAscendents = TreeClassification.GetAscendents( TabFeuilles[r].id, TabAllChild, root)
        var width = $("#"+TabFeuilles[r].id+"").width() + espaceLeftH
          for (m in TabAscendents){
            if (TreeClassification.GetChilds(TabAscendents[m].id).length == 1 & $("#"+TabAscendents[m].id+"").width() + espaceLeftH > width ){
              width = $("#"+TabAscendents[m].id+"").width() + espaceLeftH
            }
          }
        widthAllFeuilles = widthAllFeuilles + width
    }
  }
  return widthAllFeuilles;
},
//retourne pour un élément donné le width que toutes ses feuilles occupent 
GetDeltaXH : function(espaceLeftH, father, TabChild, idChild, root, TabAllInforoot, boolcompact){
var DeltaXH= $("#"+idChild+"").width() + espaceLeftH ;
  TabAllChild = TreeClassification.GetAllChilds(idChild)
    //on cherche la largeur max d'une chaine de fils uniques
    if (TreeClassification.GetAllFeuilles(idChild).length == 1){
      var TabChild2 = TreeClassification.GetChilds(idChild)
      while (TabChild2.length == 1){
        if ($("#"+TabChild2[0].id+"").width() > DeltaXH){
          DeltaXH = $("#"+TabChild2[0].id+"").width() + espaceLeftH ;
        }
      TabChild2 = TreeClassification.GetChilds(TabChild2[0].id)
      }
    }
    //cas d'une feuille dont le père est plus grand
    if (TreeClassification.GetChilds(father).length ==1 & ($("#"+father+"").width() + espaceLeftH) > ($("#"+idChild+"").width() + espaceLeftH)){
      DeltaXH = $("#"+father+"").width() + espaceLeftH
    }
    //si l'élément à plus d'une feuille
    if (TreeClassification.GetAllFeuilles(idChild).length>1){
      DeltaXH = TreeClassification.GetWidthAllFeuilles(idChild, root, TabAllChild, espaceLeftH)
    }
return DeltaXH;
},
//permet d'obtenir le top de tous les éléments d'une ligne en fonction de l'élément le plus gros du level superieur (anti-collision)
GetDeltaYHajuste : function(father, espaceTopH, TabAllChild, TabAllInforoot, root){
  var fatherheightmax = $("#"+father+"").height()
  for (t in TabAllInforoot){
    if (TabAllInforoot[t].lvl == TreeClassification.GetLevel(father, TabAllChild, root) & $("#"+TabAllInforoot[t].id+"").height() > fatherheightmax){
     fatherheightmax =  $("#"+TabAllInforoot[t].id+"").height()
    }
  }
  DeltaYH = fatherheightmax + espaceTopH ;
  return DeltaYH;
},
//utilise les fonctions précédentes pour positionner HORIZONTALEMENT une génération de fils par rapport à leur père
ChangePositionH : function(father, TabChild, TabAllChild, espaceTopH, espaceLeftH, DeltaYH, root, TabAllInforoot, boolcompact, boolmirror, booldossier, booldossiermirror){
  //on place le 1er enfant
  if (TabChild.length>0){
      if (booldossier == false){
        //left classique
        TabChild[0].left = this.GetElement(father).left + ($("#"+father+"").width()/2) - (TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, father, root, TabAllInforoot, false)/2)+ (TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, TabChild[0].id, root, TabAllInforoot, false)/2) - ($("#"+TabChild[0].id+"").width() /2);
      }else{
        if (booldossiermirror == false){
          //left dossier
          TabChild[0].left = this.GetElement(father).left
        }else{
          //left dossiermirroir
          TabChild[0].left = this.GetElement(father).left + $("#"+father+"").width() - $("#"+TabChild[0].id+"").width() ;
        }
      }
      if (boolmirror == false){
        if (boolcompact == false){
          //top classique
          TabChild[0].top = this.GetElement(father).top + DeltaYH ;
        }else{
          //top compact
          TabChild[0].top = this.GetElement(father).top + $("#"+father+"").height() + espaceTopH ;
          }
      }else{
        if (boolcompact == false){
          //top mirroir
          var DeltaYHnext = TreeClassification.GetDeltaYHajuste(TabChild[0].id, espaceTopH, TabAllChild, TabAllInforoot, root)
          TabChild[0].top = this.GetElement(father).top - DeltaYHnext ;
        }else{
          //top compact mirroir
          TabChild[0].top = this.GetElement(father).top - espaceTopH - $("#"+TabChild[0].id+"").height();
        }
      }
    }
    //on place les enfants suivants par rapport au premier
    for ( j in TabChild){
      if (j > 0){
        if (booldossier == false){
          //left classique
        TabChild[j].left = TabChild[(j-1)].left + ($("#"+TabChild[j-1].id+"").width() /2) + (TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, TabChild[(j-1)].id, root, TabAllInforoot, boolcompact)/2) + (TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, TabChild[(j)].id, root, TabAllInforoot, boolcompact)/2) - ($("#"+TabChild[j].id+"").width() /2);
      }else{
        if (booldossiermirror == false){
          //left dossier
          TabChild[j].left = TabChild[(j-1)].left + TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, TabChild[(j-1)].id, root, TabAllInforoot, boolcompact)
        }else{
          //left dossiermirroir
          TabChild[j].left = TabChild[(j-1)].left + $("#"+TabChild[j-1].id+"").width() - TreeClassification.GetDeltaXH(espaceLeftH, father, TabChild, TabChild[(j-1)].id, root, TabAllInforoot, boolcompact) - $("#"+TabChild[j].id+"").width()
        }
      }
        if (boolmirror == false){
          if (boolcompact == false){
            //top classique
            TabChild[j].top = this.GetElement(father).top + DeltaYH ;
          }else{
            //top compact
            TabChild[j].top = this.GetElement(father).top + $("#"+father+"").height() + espaceTopH ;
          }
        }else{
          if (boolcompact == false){
            //top mirroir
            var DeltaYHnext = TreeClassification.GetDeltaYHajuste(TabChild[0].id, espaceTopH, TabAllChild, TabAllInforoot, root)
            TabChild[j].top = this.GetElement(father).top - DeltaYHnext ;
          }else{
            //top compact mirroir
            TabChild[j].top = this.GetElement(father).top - espaceTopH - $("#"+TabChild[j].id+"").height() ;
          }
        }
      }
    }
  return TabChild;
},
//fonctions relatives à l'alignement VERTICAL
//retourne le résultat de l'addition du width de tous les derniers fils et l'espace entre eux
GetHeightAllFeuilles : function(father, root, TabAllChild, espaceTopH){
  var heightAllFeuilles = 0
  var TabFeuilles = TreeClassification.GetAllFeuilles(father)
  if (TabFeuilles.length>0){
    for (r in TabFeuilles){
      //si le père d'un fils unique est plus haut, on prend son height à la place de celle du fils
        var TabAscendents = TreeClassification.GetAscendents( TabFeuilles[r].id, TabAllChild, root)
        var height = $("#"+TabFeuilles[r].id+"").height() + espaceTopH
        for (m in TabAscendents){
          if (TreeClassification.GetChilds(TabAscendents[m].id).length == 1 & ($("#"+TabAscendents[m].id+"").height() + espaceTopH) > height){
            height = $("#"+TabAscendents[m].id+"").height() + espaceTopH
          }
        }
      heightAllFeuilles = heightAllFeuilles + height
    }
  }
  return heightAllFeuilles;
},
//retourne l'espace entre 2 lignes par rapport au père
GetDeltaYV : function(espaceTopH, father, TabChild, idChild, root){
  var DeltaYV= $("#"+idChild+"").height() + espaceTopH ;
  TabAllChild = TreeClassification.GetAllChilds(idChild)
  //on traite les cas des fils uniques
    if (TreeClassification.GetAllFeuilles(idChild).length == 1){
      var TabChild2 = TreeClassification.GetChilds(idChild)
      while (TabChild2.length == 1){
        if ($("#"+TabChild2[0].id+"").height() > DeltaYV ){
          DeltaYV = $("#"+TabChild2[0].id+"").height() + espaceTopH ;
        }
      TabChild2 = TreeClassification.GetChilds(TabChild2[0].id)
      }
    }
    //pour recentrer une feuille unique qui a un père plus large
    if (TreeClassification.GetChilds(father).length == 1 & ($("#"+father+"").height() + espaceTopH) > ($("#"+idChild+"").height() + espaceTopH)){
      DeltaYV = $("#"+father+"").height() + espaceTopH
    }
    //cas des fils multiples
    if (TreeClassification.GetAllFeuilles(idChild).length>1){
      DeltaYV = TreeClassification.GetHeightAllFeuilles(idChild, root, TabAllChild, espaceTopH)
    }
return DeltaYV;
},
//permet d'obtenir le left de tous les éléments d'une ligne en fonction de l'élément le plus gros du level superieur (anti-collision horizontale)
GetDeltaXVajuste : function(father, espaceLeftH, TabChild, TabAllChild, TabAllInforoot, root){
  var fatherwidthmax = $("#"+father+"").width()
  for (t in TabAllInforoot){
    if (TabAllInforoot[t].lvl == TreeClassification.GetLevel(father, TabAllChild, root) & $("#"+TabAllInforoot[t].id+"").width() > fatherwidthmax){
     fatherwidthmax =  $("#"+TabAllInforoot[t].id+"").width()
    }
  }
  DeltaXV = fatherwidthmax + espaceLeftH ;
  return DeltaXV;
},
//utilise les fonctions précédentes pour positionner VERTICALEMENT une génération de fils par rapport à leur père
ChangePositionV : function(father, TabChild, TabAllChild, espaceTopH, espaceLeftH, DeltaXV, root, TabAllInforoot, boolcompact, boolmirror, booldossier, booldossiermirror){
  //on place le 1er enfant
  if (TabChild.length>0){
    if (booldossier == false){
      //le top normal
      TabChild[0].top = this.GetElement(father).top + ($("#"+father+"").height() /2) - (TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, father, root) /2) + (TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, TabChild[0].id, root)/2) - ($("#"+TabChild[0].id+"").height() /2);
    }else{
      if (booldossiermirror == false){
        //le top dossier
        TabChild[0].top = this.GetElement(father).top
      }else{
        //le top dossiermirroir
        TabChild[0].top = this.GetElement(father).top + $("#"+father+"").height() - $("#"+TabChild[0].id+"").height() ;
      }
    }
        if (boolmirror == false){
          if (boolcompact == false){
            //le left normal
            TabChild[0].left = this.GetElement(father).left + DeltaXV ;
          }else{
            //le left compact 
            TabChild[0].left = this.GetElement(father).left + $("#"+father+"").width() + espaceLeftH
          }
        }else{
          if(boolcompact == false){
            //le left miroir
            TabChild[0].left =  this.GetElement(father).left + $("#"+father+"").width() - DeltaXV - espaceLeftH - $("#"+TabChild[0].id+"").width() ;
          }else{
            //le left miroir compact 
            TabChild[0].left =  this.GetElement(father).left - espaceLeftH - $("#"+TabChild[0].id+"").width() ;
      }
         }
    //on place les enfants suivants par rapport au premier
    for ( j in TabChild){
      if (j > 0){
        if (booldossier == false){
          //le top normal
          TabChild[j].top = TabChild[(j-1)].top + ($("#"+TabChild[j-1].id+"").height() /2) + (TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, TabChild[(j-1)].id, root)/2) + (TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, TabChild[(j)].id, root)/2) - ($("#"+TabChild[j].id+"").height() /2) ;
        }else{
            if (booldossiermirror == false){
              //le top dossier
              TabChild[j].top = TabChild[(j-1)].top + TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, TabChild[(j-1)].id, root)
            }else{
              //le top dossier miroir
              TabChild[j].top = TabChild[(j-1)].top + $("#"+TabChild[j-1].id+"").height() - TreeClassification.GetDeltaYV(espaceTopH, father, TabChild, TabChild[(j-1)].id, root) - $("#"+TabChild[j].id+"").height()
            }
        }
        if (boolmirror == false){
            if (boolcompact == false){
              //le left normal
              TabChild[j].left = this.GetElement(father).left + DeltaXV ;
            }else{
              //le left compact
              TabChild[j].left = this.GetElement(father).left + $("#"+father+"").width() + espaceLeftH
            }
        }else{
            if(boolcompact == false){
              //le left mirroir
              TabChild[j].left = this.GetElement(father).left + $("#"+father+"").width() - DeltaXV - espaceLeftH - $("#"+TabChild[j].id+"").width() ;
            }else{
              //le left mirroir compact
              TabChild[j].left = this.GetElement(father).left - espaceLeftH - $("#"+TabChild[j].id+"").width() ;
          }
        }
      }
    }
  }
  return TabChild;
},
//Fonction finale de placement des éléments d'une ligne par rapport à un père.
//chaque élément est placé en fonction de la taille de ses feuilles et de son père
align : function(father, espaceLeftH, espaceTopH, TabAllChildroot, TabAllInforoot, root, boolcompact, boolvertical, boolmirror, booldossier, booldossiermirror){
  var TabChild = TreeClassification.GetChilds(father)
  var TabAllChild = TreeClassification.GetAllChilds(father)
  var TabAllInfo = TreeClassification.GetTabAllInfo(TabAllChild, father)
  var TabFeuilles = TreeClassification.GetAllFeuilles(father)
    if (boolvertical == false){
      var DeltaYH = TreeClassification.GetDeltaYHajuste(father, espaceTopH, TabAllChild, TabAllInforoot, root)
      var TabChildPosition = TreeClassification.ChangePositionH(father, TabChild, TabAllChild, espaceTopH, espaceLeftH, DeltaYH, root, TabAllInforoot, boolcompact, boolmirror, booldossier, booldossiermirror)
    }else{
      var DeltaXV = TreeClassification.GetDeltaXVajuste(father, espaceTopH, TabChild, TabAllChild, TabAllInforoot, root)
      var TabChildPosition = TreeClassification.ChangePositionV(father, TabChild, TabAllChild, espaceTopH, espaceLeftH, DeltaXV, root, TabAllInforoot, boolcompact, boolmirror, booldossier, booldossiermirror)
    }
  return TabChildPosition
},
//Fonction finale de placement itérant chaque ligne en commençant par le root
//
//elemen correspond au tableau en entrée
//le root correspond à l'id du père sans pères à partir ducquel on veut élaborer l'arbre
//espaceleftH est l'espace horizontal prédéfini entre 2 noeuds
//espaceTopH est l'espace vertical prédéfini entre 2 noeuds
//LevelMax prédéfini le nb de générations  max à la construction de l'arbre random
//CM prédéfini le nb de fils max pour chaque noeuds à la construction de l'arbre random
//boolcompact(beta) permet d'avoir une arborisation plus dense
//boolvertical permet de classer verticalement
//boolmirror permet d'obtenir une symétrie de l'arbre par rapport au root
//booldossier permet un classement en arborescence classique de dossier
//booldossiermirror permet un classement en arborescence en dossier mais symétrique à l'arborescence dossier classique
alignAll : function(elemen, root, espaceLeftH, espaceTopH, boolvertical, boolmirror, booldossier, booldossiermirror, boolcompact){
  TreeClassification.elements.length = 0;
  // variable à rajouter pour créer l'abre random, Il faut enlever le tableau elemen dans les paramettre de la fonction alignAll et rajouter LevelMax, ChildMax
  //ex : function(root, espaceLeftH, espaceTopH, boolvertical, boolmirror, booldossier, booldossiermirror, boolcompact, LevelMax, ChildMax)
  //var elemen = TreeClassification.TreeRandom(LevelMax,ChildMax)
if (boolvertical == false){
  TreeClassification.BaseTableH(root, elemen)
}else{
  TreeClassification.BaseTableV(root, elemen)
}
//Permet de dessiner les elements en Rouge. Ne pas oublier cette fonction pour les tests de test.html
//TreeClassification.render(TreeClassification.elements, "red");
  var Final = []
  var TabAllChildroot = TreeClassification.GetAllChilds(root)
  var TabAllInforoot = TreeClassification.GetTabAllInfo(TabAllChildroot, root)
    if (TabAllChildroot.length == 0) {alert("No childs !")}
  for (e in TreeClassification.elements){
      TabChildPosition = TreeClassification.align(TreeClassification.elements[e].id, espaceLeftH, espaceTopH, TabAllChildroot, TabAllInforoot, root, boolcompact, boolvertical, boolmirror, booldossier, booldossiermirror)
      TreeClassification.AddBoard(Final, TabChildPosition)
  }
  // ajouter la couleur pour les test dans la test.html ex : TreeClassification.animate(Final, "blue")
  //TreeClassification.animate(Final, "blue")
  TreeClassification.animate(Final, "")
  // 2 Fonctions pour dessiner les traits
  //TreeClassification.animateTraitFatherChild(Final,"blue",elemen)
  //TreeClassification.animateTrait(Final,"red")
  return Final;
},
}