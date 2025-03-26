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
	async updateCardsPrompt(item){
		let cards_prompt =  Table1.selectedRow.cards_prompt
		let nowItem = Table1.selectedRow.cards_prompt[item.sceneName];
		if(!nowItem){
			nowItem = {
				"clip":item.clip,
				"clip_zh":item.clip_zh,
				"description":item.description
			}
			Table1.selectedRow.cards_prompt[item.sceneName] = nowItem
		}
		if(nowItem.clip != item.clip ||nowItem.prompt_id != item.prompt_id){
			nowItem.clip = item.clip;
			nowItem.prompt_id = item.prompt_id

			return await updateCardsPrompt.run({cards_prompt}).then(()=>updateTable.run())

		}
	},
	async updateScenesPrompt(item){
		let scenes_prompt =  Table1.selectedRow.scenes_prompt
		let nowItem = Table1.selectedRow.scenes_prompt[item.sceneName];
		if(!nowItem){
			nowItem = {
				"clip":item.clip,
				"clip_zh":item.clip_zh,
				"description":item.description
			}
			Table1.selectedRow.scenes_prompt[item.sceneName] = nowItem
		}
		if(nowItem.clip != item.clip ||nowItem.prompt_id != item.prompt_id){
			nowItem.clip = item.clip;
			nowItem.prompt_id = item.prompt_id

			return await updateScenePrompt.run({scenes_prompt}).then(()=>updateTable.run())

		}
	},
	async updateJsonImage(updateVal, newName){
		let oldName = updateVal?.sceneName
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
		await updateScriptJson.run().then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
			delete Table1.selectedRow.cards_prompt[oldName]
			this.updateCardsPrompt({
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"sceneName":newName
			})

		})

	},

	async updateJsonScene(updateVal, newName){
		let oldName = updateVal?.sceneName
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
				else if(v.type == "task" && v.image == on){
					// console.log("rename scene",on, nn)
					v.image = nn
				}
				if(v.feedback?.length)
					v.feedback.forEach(function(v){
						_updateScrits(v, on, nn)
					})
			})

		}
		_updateScrits(Table1.selectedRow.script_json["scripts"], oldName, newName)
		// updateScriptJson.run().then(v=>{
		// // Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
		// updateTable.run()
		// })
		await updateScriptJson.run().then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
			delete Table1.selectedRow.scenes_prompt[oldName]
			this.updateScenesPrompt({
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"sceneName":newName
			})

		})

		// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
	},

	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}