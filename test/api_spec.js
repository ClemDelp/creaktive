describe('bbmap api test', function(){
	beforeEach(function() {
		
	});
    
    afterEach(function() {
      
    });

    it('getJsonSize', function(){
        var json_0 = {};
        var json_1 = {'1':1,'2':2};
        var json_2 = {'1':1,'2':2,'z':1,'tr':2};

        expect(api.getJsonSize(json_0)).toBe(0);
        expect(api.getJsonSize(json_1)).toBe(2);
        expect(api.getJsonSize(json_2)).toBe(4);
    });

    it('getMapCentroid', function(){
        var map_1 = {'width':0,'height':0};
        var map_2 = {'width':50,'height':50};
        var map_3 = {'width':1000,'height':2000};
        var map_4 = {'width':0,'height':100};

        expect(api.getMapCentroid(map_1.width,map_1.height)).toEqual({'left':0,'top':0});
        expect(api.getMapCentroid(map_2.width,map_2.height)).toEqual({'left':25,'top':25});
        expect(api.getMapCentroid(map_3.width,map_3.height)).toEqual({'left':500,'top':1000});
        expect(api.getMapCentroid(map_4.width,map_4.height)).toEqual({'left':0,'top':50});
    });

    it('getXYTranslationBtwTwoPoints', function(){
        var point_1 = {'left':1,'top':1};
        var point_2 = {'left':3,'top':4};
        var point_3 = {'left':12,'top':56};
        var point_4 = {'left':12,'top':56};
        var point_5 = {'left':12,'top':56};

        expect(api.getXYTranslationBtwTwoPoints(point_1,point_2)).toEqual({"y":3,"x":2});
    });
});