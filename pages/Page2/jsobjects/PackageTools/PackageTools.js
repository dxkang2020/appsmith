export default {
	calcImages(json){
		console.log(json)
		let refrences = {}

		function _calcImages(scripts){
			let images = new Set()

			function addRef(img,v){
				let ref = ""
				if(v.type == "select"){
					ref = "cards:"
				}

				if(v.text){
					if(v.character){
						ref += `${v.character.toUpperCase()}:`
					}
					if(v.state){
						ref += `[${v.state.toUpperCase()}]`
					}
					ref += `${v.text}`
				}
				// `${v.character.toUpperCase()}: ${v.state ? ""} ${v.text ?? ""}`
				if(!refrences[img]){
					refrences[img] = [ref]
				}
				else
					refrences[img].push(ref)
			}
			if(scripts){
				// 确保 scripts 是数组
				const myScripts = Array.isArray(scripts) ? scripts : [];

				myScripts.forEach(function(v){
					if(v.image && v.type != "task"  && v.image.length > 0){
						images.add(v.image)
						addRef(v.image, v)
					}

					if(v.images && v.images.length > 0){
						v.images.forEach(function(vi){
							images.add(vi)
							addRef(vi, v)
						})
					}
					if(v.answer_analysis?.image){
						// console.log(v.answer_analysis.image)
						images.add(v.answer_analysis.image)
						addRef(v.answer_analysis.image, v.answer_analysis)
						// _calcImages(v.answer_analysis).forEach(i=>{ images.add(i)})

					}
					// if(v.feedback && v.feedback.length > 0){
					// v.feedback.forEach(function(fv){
					// _calcImages(fv).forEach(i=>images.add(i))
					// })
					// }
					if(v.scripts && v.scripts.length > 0){
						let rlt = _calcImages(v.scripts)
						console.log("rlt:",rlt)
						images.add(...rlt)
						// v.scripts.forEach(function(fvs){
						// _calcImages(fvs).forEach(is=>images.add(is))
						// })
					}


				})
			}
			return images
		}
		return [Array.from(_calcImages(json?.scripts)),refrences]
	},

	calcScenes(json){

		function _calcScenes(scripts){
			let scenes = new Set()
			if(scripts){
				scripts.forEach(function(v){
					if(v.type == "scene" && v.name){
						scenes.add(v.name)

					}
					if(v.scripts && v.scripts.length > 0){
						let rlt = _calcScenes(v.scripts)
						console.log("rlt:",rlt)
						scenes.add(...rlt)
						// v.scripts.forEach(function(fv){
						// console.log(fv,'fv')
						// // _calcScenes(fv)
						// // _calcScenes(fv).forEach(i=>scenes.add(i))
						// scenes.add(fv.name)
						// })
					}


					// if(v.feedback && v.feedback.length > 0)
					// v.feedback.forEach(function(fv){
					// _calcScenes(fv).forEach(i=>scenes.add(i))
					// })
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