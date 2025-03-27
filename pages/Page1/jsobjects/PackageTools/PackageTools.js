export default {
	calcImages(json){
		function _calcImages(scripts){
			let images = new Set()
			if(scripts){
				scripts.forEach(function(v){
					if(v.image && v.type != "task"  && v.image.length > 0){
						images.add(v.image)

					}

					if(v.images && v.images.length > 0)
						v.images.forEach(function(v){
							images.add(v)
						})
					if(v.feedback && v.feedback.length > 0)
						v.feedback.forEach(function(fv){
							_calcImages(fv).forEach(i=>images.add(i))
						})
				})
			}
			return images
		}
		return Array.from(_calcImages(json?.scripts))
	},

	calcScenes(json){

		function _calcScenes(scripts){
			let scenes = new Set()
			if(scripts){
				scripts.forEach(function(v){
					if(v.type == "scene" && v.name){
						scenes.add(v.name)

					}
					if(v.feedback && v.feedback.length > 0)
						v.feedback.forEach(function(fv){
							_calcScenes(fv).forEach(i=>scenes.add(i))
						})
				})
			}
			return scenes
		}
		return Array.from(_calcScenes(json?.scripts))

	},
	verifyTask(json, scenes){
		
	},
	verify () {
		for(let row of updateTable.data){
			// d.script_json,
			// d.scenes_prompt,
			// d.cards_prompt,
			if(row.script_json){
				let scenes = this.calcScenes(row.script_json)
			}
		}
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}