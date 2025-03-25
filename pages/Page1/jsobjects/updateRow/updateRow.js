export default {
	async update(){

	},

	async updateScreenplay(){
		if (Input2.text == Table1.selectedRow.screenplay)
			return
		Button5.setDisabled(true)
		await updateScreenplay.run()
		Button5.setDisabled(false)
	},

	async updateJsonImage(oldName, newName){
		if(!oldName || !newName || oldName == newName || !Table1.selectedRow?.script_json?.scripts?.length)
			return
		function _updateScrits(scripts, on, nn){
			if(!scripts?.length)
				return
			scripts.forEach(function(v,idx){

				if(v.image == on){
					console.log("rename image",idx, on, nn)
					v.image = nn
				}
				if(v.images?.length){
					for(let i = 0;i<v.images.length;i++){
						if(v.images[i] == on){
							console.log("rename images",idx, on, nn)
							v.images[i] = nn
						}
					}
				}
				if(v.feedback && v.feedback.length > 0)
					v.feedback.forEach(function(v){
						_updateScrits(v, on, nn)
					})
			})

		}
		_updateScrits(Table1.selectedRow?.script_json["scripts"], oldName, newName)
		console.log(Table1.selectedRow.script_json["scripts"][25])
		updateScriptJson.run().then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
			Query2.run()
		})

	},

	async updateJsonScene(oldName, newName){
		if(!oldName || !newName || oldName == newName || !Table1.selectedRow?.script_json?.scripts?.length)
			return
		function _updateScrits(scripts, on, nn){
			console.log("scripts?.lenth", scripts?.length, typeof scripts)
			if(!scripts?.length)
				return
			scripts.forEach(function(v){
				if(v.type == "scene" && v.name == on){
					// console.log("rename scene",on, nn)
					v.name = nn
				}
				if(v.feedback?.length)
					v.feedback.forEach(function(v){
						_updateScrits(v, on, nn)
					})
			})

		}
		_updateScrits(Table1.selectedRow.script_json["scripts"], oldName, newName)
		updateScriptJson.run().then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
			Query2.run()
		})

		// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
	},

	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}