

module.exports = {

	generateConcepts : function (req,res){

		Concept.create({
			id : 1,
			title : "Chaise légère et pas chère",
		}).done(function (err,c0){
			Concept.create({
				id : 2,
				id_father : 1,
				title : "Chaise à 0 pieds",
			}).done(function (err, c1){

			})

		})

	}


}