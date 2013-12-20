/****************************************************************/
interface2.Views.Main = Backbone.View.extend({
    //el : $('#?'),
    initialize : function(json) {
        console.log("interface2 view initialise");
        _.bindAll(this, 'render');
        
    },
    render : function() {
    
        return this;
    }
});
/****************************************************************/
