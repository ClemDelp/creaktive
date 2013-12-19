/////////////////////////////////////////////////////////////////////
/*Explorer Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Knowledges = Backbone.Collection.extend({
    model : global.Models.Knowledge,
    initialize : function() {
        console.log('Knowleges collection Constructor');
        this.url = "knowledge";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Poches = Backbone.Collection.extend({
    model : global.Models.Poche,
    initialize : function() {
        console.log('Poches collection Constructor');
        this.url = "poche";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/////////////////////////////////////////////////////////////////////
/*Timela Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Timelines = Backbone.Collection.extend({
    model : global.Models.Timeline,
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        console.log('Timelines collection Constructor');
        this.url = "timeline";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Posts = Backbone.Collection.extend({
    model : global.Models.Post,
    /*url : "post",*/
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Post collection Constructor');
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.CommentsCollection = Backbone.Collection.extend({
    model : global.Models.Comment,
    //url : "comment",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
/***************************************/
    