// describe('hello', function(){
//     it('should say hello', function(){
//         expect(hello()).toBe('hello world');
//     });
//     it('should say hello to person', function(){
//         expect(hello('Bob')).toBe('hello Bob')
//     });
// });

describe('bbmap test', function(){
	beforeEach(function() {
		/////////////////////////////////////////////////////////////////////////////////////////////
	    // Realtime connection
	    /////////////////////////////////////////////////////////////////////////////////////////////
	    function rt (io, callback) {
	        // as soon as this file is loaded, connect automatically, 
	        var socket = io.connect("/",{'sync disconnect on unload ': true});
	        socket.on('connect', function socketConnected() {
	          
          		socket.get("/auth/openChannels", function(data){
		            console.log(data.msg);
		            console.log(data.channels);
		        });

	          	socket.on('notification:create', function socketConnected(x) {
		            console.log("xxxxxx",x)
		        });

	          	console.log(
		            'Socket is now connected and globally accessible as `socket`.\n' + 
		            'e.g. to send a GET request to Sails, try \n' + 
		            '`socket.get("/", function (response) ' +
		              '{ console.log(response); })`'
		        );
	         	callback();
	        });
	        window.socket = socket;
	    };
    	////////////////////////////////////////
    	rt(io, function(){
    		var json = {};
	    	///////////////////
	    	// Models
	    	json.user = new global.Models.User();
	      	json.project = new global.Models.ProjectModel();
	    	///////////////////
	    	// Collections
	      	json.users = new global.Collections.UsersCollection();
	      	json.knowledges = new global.Collections.Knowledges();
	      	json.projects = new global.Collections.ProjectsCollection();
	      	json.poches = new global.Collections.Poches();
	      	json.concepts = new global.Collections.ConceptsCollection();
	      	json.links = new global.Collections.CKLinks();
	      	json.notifications = new Backbone.Collection();
	      	json.permissions = new global.Collections.PermissionsCollection();
	      	//////////////////
	      	// Re-build models inside
	      	_.each(json.knowledges, function(k){
	      	  k.comments = new global.Collections.Comments(k.comments);
	      	  k.members = new global.Collections.UsersCollection(k.members);
	      	})
	      	_.each(json.concepts, function(c){
	      	  c.comments = new global.Collections.Comments(c.comments);
	      	  c.members = new global.Collections.UsersCollection(c.members);
	      	})

	      	global.init(json, function(){
	       	 	// Modules
	       	 	bbmap.init();
	       	 	/*activat of "hashchange events's monitoring"*/
	       	 	Backbone.history.start();  
	      	});
	    });
	});
    
    afterEach(function() {
      
    });

    it('bbmap say hello', function(){
    	console.log(bbmap.views.main.hello())
    	expect(bbmap.views.main.hello('Bob')).toBe('hello Bob');
    	//expect('bob').toBe('bob');
    });
});