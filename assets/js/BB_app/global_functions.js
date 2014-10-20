function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

global.Functions.uploadScreenshot = function(file,cb){   

    $.post('s3/uploadScreenshot', {screenshot : file}, function(data){
      cb(data);
    })

}


global.Functions.uploadFile = function(files,cb){   

    //console.log(files);
    var data = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    $.ajax({
        url: 's3/upload',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    }).success(function(data) {
        cb(data.amz_id, files[0].name);
  }).error(function(jqXHR, textStatus, errorThrown){
      alert("Upload error, please try again later")
  });

}

global.Functions.getProjectsUsersDictionary = function(projects,permissions){
	var dictionary = {};
	/////////////////////////////
	// CREATION DES KEYS
	/////////////////////////////
	projects.each(function(project){
		dictionary[project.get('id')] = [];
	});
	/////////////////////////////
	// CREATION DES VALUES
	/////////////////////////////
	permissions.each(function(permission){
		try{dictionary[permission.get('project_id')].push(permission.get('user_id'));}catch(err){}
	});
	return dictionary;
}

global.Functions.getNotificationsDictionary = function(user_model,notifications,projects,knowledges,concepts,categories,activityLog){
	var dictionary = {"projects":{},"models":{},"allNews":{},"allRead":{}};
	/////////////////////////////
	// CREATION DES KEYS
	/////////////////////////////
	//
	dictionary.allNews = new Backbone.Collection();
	dictionary.allRead = new Backbone.Collection();
	// 
	concepts.each(function(concept){
		dictionary.models[concept.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	categories.each(function(category){
		dictionary.models[category.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	knowledges.each(function(knowledge){
		dictionary.models[knowledge.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	projects.each(function(project){
		dictionary.projects[project.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	//
	notifications.each(function(notif){
		dictionary.models[notif.get('to')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
		dictionary.projects[notif.get('project_id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	/////////////////////////////
	// CREATION DES VALUES
	/////////////////////////////
	notifications.each(function(notif){
		if((_.indexOf(notif.get('read'), user_model.get('id')) == -1)){
     try{
       dictionary.models[notif.get('to').id].news.add(notif);
       dictionary.projects[notif.get('project_id')].news.add(notif);
       dictionary.allNews.add(notif);
    }catch(err){}
   }else{
    try{
      dictionary.models[notif.get('to').id].read.add(notif);		
      dictionary.projects[notif.get('project_id')].read.add(notif);		
      dictionary.allRead.add(notif);
    }catch(err){}
  }
});


	/////////////////////////////////////////
	// RECUPERATION DES NOTIFICATIONS LUES
	/////////////////////////////////////////
	if(activityLog){
   projects.each(function(project){
    dictionary.projects[project.id].read.add(activityLog[project.id]);	
  });
 }


 return dictionary;
}

global.Functions.whatChangeInModel = function(origin_m,new_m){
	var keys = [];
	for (var k in origin_m.attributes){
		if(origin_m.attributes[k] != new_m.attributes[k]){
			keys.unshift(k);
		}
	}
	return keys;
}

global.Functions.whatChangedInModel = function(model){
	var keys = [];
	for (var k in model.attributes){
		if(model.attributes[k] != model._previousAttributes[k]){
			keys.unshift(k);
		}
	}
	return keys;
}

global.Functions.format_ckobject_collection = function(collection){
	collection.each(function(model){
		global.Functions.format_ckobject_model(model);        
  });
  return collection;
}

global.Functions.format_ckobject_model = function(model){
	model.set({comments : new global.Collections.Comments(model.get('comments'))});
  model.set({members : new global.Collections.UsersCollection(model.get('members'))});
  return model;
}

global.Functions.cloneCollection = function(collection){
	var ks_cloned = new Backbone.Collection();
  collection.each(function(model) {
    ks_cloned.add(new Backbone.Model(model.toJSON()));
  });
  return ks_cloned;
}


///////////////////////////////////////////////////////////////////////////////////////
// DRAFT API
///////////////////////////////////////////////////////////////////////////////////////

// var bbmap.node_size() = 18
// var bbmap.horizontal_gap() = 200
// var bbmap.vertical_gap() = 80

// Draw a graph node.
// function node(lbl, x, y, sz) {
//   if (!sz) sz = bbmap.node_size()
//   var h = sz / 2
//   document.write('<div class="node window concept" style="left:' + (x - h) + 'px;top:' + (y - h) +
//       'px;width:' + sz + 'px;height:' + sz + 'px;line-height:' + sz +
//       'px;">' + lbl + '</div>')
// }

// Tree node.
function Tree(lbl, children) {
  this.lbl = lbl
  this.children = children ? children : []
  // This will be filled with the x-offset of this node wrt its parent.
  this.offset = 0
  // Optional coordinates that can be written by place(x, y)
  this.x = 0
  this.y = 0
}

Tree.prototype.is_leaf = function() { return this.children.length == 0 }

// Label the tree with given root (x,y) coordinates using the offset
// information created by extent().
Tree.prototype.place = function(x, y) {
  var n_children = this.children.length
  var y_children = y + bbmap.vertical_gap() + bbmap.node_size()
  for (var i = 0; i < n_children; i++) {
    var child = this.children[i]
    child.place(x + child.offset, y_children)
  }
  this.x = x
  this.y = y
}

// Draw the tree after it has been labeled w ith extent() and place().
// Tree.prototype.draw = function () {
//   var n_children = this.children.length
//   for (var i = 0; i < n_children; i++) {
//     var child = this.children[i]
//     //arc(this.x, this.y + 0.5 * bbmap.node_size() + 2, child.x, child.y - 0.5 * bbmap.node_size())
//     child.draw()
//   }
//   node(this.lbl, this.x, this.y)
// }

// Recursively assign offsets to subtrees and return an extent
// that gives the shape of this tree.
//
// An extent is an array of left-right x-coordinate ranges,
// one element per tree level.  The root of the tree is at
// the origin of its coordinate system.
//
// We merge successive extents by finding the minimum shift
// to the right that will cause the extent being merged to
// not overlap any of the previous ones.
Tree.prototype.extent = function() {
  var n_children = this.children.length
  // Get the extents of the children
  var child_extents = []
  for (var i = 0; i < n_children; i++)
    child_extents.push(this.children[i].extent())

  // Compute a minimum non-overlapping x-offset for each extent
  var rightmost = []
  var offset = 0
  for (i = 0; i < n_children; i++) {
    var ext = child_extents[i]
    // Find the necessary offset.
    offset = 0
    for (var j = 0; j < min(ext.length, rightmost.length); j++)
      offset = max(offset, rightmost[j] - ext[j][0] + bbmap.horizontal_gap())
    // Update rightmost
    for (var j = 0; j < ext.length; j++)
      if (j < rightmost.length)
        rightmost[j] = offset + ext[j][1]
      else
        rightmost.push(offset + ext[j][1])
      this.children[i].offset = offset
    }
  rightmost = null  // Gc, come get it.

  // Center leaves between non-leaf siblings with a tiny state machine.
  // This is optional, but eliminates a minor leftward skew in appearance.
  var state = 0
  var i0 = 0
  for (i = 0; i < n_children; i++) {
    if (state == 0) {
      state = this.children[i].is_leaf() ? 3 : 1
    } else if (state == 1) {
      if (this.children[i].is_leaf()) {
        state = 2
        i0 = i - 1 // Found leaf after non-leaf. Remember the non-leaf.
      }
    } else if (state == 2) {
      if (!this.children[i].is_leaf()) {
        state = 1  // Found matching non-leaf. Reposition the leaves between.
        var dofs = (this.children[i].offset - this.children[i0].offset) / (i - i0)
        offset = this.children[i0].offset
        for (j = i0 + 1; j < i; j++)
          this.children[j].offset = (offset += dofs)
      }
    } else {
      if (!this.children[i].is_leaf()) state = 1
    }
}

  // Adjust to center the root on its children
  for (i = 0; i < n_children; i++)
    this.children[i].offset -= 0.5 * offset

  // Merge the offset extents of the children into one for this tree
  var rtn = [ [-0.5 * bbmap.node_size(), 0.5 * bbmap.node_size()] ]
  // Keep track of subtrees currently on left and right edges.
  var lft = 0
  var rgt = n_children - 1
  i = 0
  for (i = 0; lft <= rgt; i++) {
    while (lft <= rgt && i >= child_extents[lft].length) ++lft
      while (lft <= rgt && i >= child_extents[rgt].length) --rgt
        if (lft > rgt) break
          var x0 = child_extents[lft][i][0] + this.children[lft].offset
        var x1 = child_extents[rgt][i][1] + this.children[rgt].offset
        rtn.push([x0, x1])
      }
      return rtn
    }

// Return what the bounding box for the tree would be if it were drawn at (0,0).
// To place it at the upper left corner of a div, draw at (-bb[0], -bb[1])
// The box is given as [x_left, y_top, width, height]
function bounding_box(extent) {
  var x0 = extent[0][0]
  var x1 = extent[0][1]
  for (var i = 1; i < extent.length; i++) {
    x0 = min(x0, extent[i][0])
    x1 = max(x1, extent[i][1])
  }
  return [x0, -0.5 * bbmap.node_size(), x1 - x0, (bbmap.node_size() + bbmap.vertical_gap()) * extent.length - bbmap.vertical_gap() ]
}

function min(x, y) { return x < y ? x : y }
function max(x, y) { return x > y ? x : y }
function abs(x) { return x < 0 ? -x : x }

// Generate a random tree with given depth and minimum number of children of the root.
// The min_children field is optional.  Use e.g. 2 to avoid trivial trees.
var node_label = 0
function random_tree(depth, min_children) {
  var n_children = depth <= 1 || Math.random() < 0.5 ? 0 : Math.round(Math.random() * 4)
  if (min_children) n_children = max(n_children, min_children)
    var children = []
  for (var i = 0; i < n_children; i++)
    children.push(random_tree(depth - 1, min_children - 1))
  return new Tree('' + node_label++, children)
}
