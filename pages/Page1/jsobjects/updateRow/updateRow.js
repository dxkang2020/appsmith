export default {
	json:null,
	async update(){
		// console.log("row update:")
		// let idx = Table1.selectedRowIndex
		// console.log("row index", idx)
		// updateTable.data[idx] = Table1.selectedRow
		// await Table1.setData(updateTable.data)
		// // await Table1.setSelectedRowIndex(idx)
		// 
		// Tab.onTabSelectChanged()
		updateTable.run().then(r=>{
			Tab.onTabSelectChanged()
		})
	},
	showError(e){
		showAlert(e,"error")
	},
	async updateScreenplay(){

		if (Input2.text == Table1.selectedRow.screenplay){
			return
		}
		console.log("updateScreenplay")
		Button5.setDisabled(true)
		await updateScreenplay.run().then(_=>{

			Table1.selectedRow.screenplay = Input2.text
			this.update()
		}).catch(this.showError)
		Button5.setDisabled(false)
	},
	async updateCardPrompt(item){
		updateCardPrompt.run(item).then(()=>this.update())
	},
	async updateScenePrompt(item){
		updateScenePrompt.run(item).then(res=>{
			this.update()
		})
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
		Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
		// console.log(Table1.selectedRow.script_json["scripts"][25])
		await updateScriptJson.run(Table1.selectedRow).then(v=>{


			// delete Table1.selectedRow.cards_prompt[oldName]
			// this.updateCardsPrompt()
			let item = {
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"name":newName
			}
			updateCardPrompt.run(item).then(()=>	this.update()	)

		})

	},
	async updateJsonSceneByName(oldName, newName){

		if(!oldName || !newName || oldName == newName || !Table1.selectedRow?.script_json?.scripts?.length)
			return
		function _updateScrits(scripts, on, nn){
			console.log("scripts?.lenth", scripts?.length, typeof scripts)
			if(!scripts?.length)
				return
			scripts.forEach(function(v){
				if(v.type == "scene" && v.name == on){
					console.log("rename scene",on, nn)
					v.name = nn
				}
				else if(v.type == "task" && v.image == on){
					console.log("rename scene task",on, nn)
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
		console.log("calcScenes", PackageTools.calcScenes(Table1.selectedRow.script_json))
		await updateScriptJson.run(Table1.selectedRow).then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))


		})

		// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
	},
	async updateJsonScene(updateVal, newName){
		let oldName = updateVal?.name
		console.log("updateVal:", updateVal)
		if(!oldName || !newName || oldName == newName || !Table1.selectedRow?.script_json?.scripts?.length)
			return
		function _updateScrits(scripts, on, nn){
			console.log("scripts?.lenth", scripts?.length, typeof scripts)
			if(!scripts?.length)
				return
			scripts.forEach(function(v){
				if(v.type == "scene" && v.name == on){
					console.log("rename scene",on, nn)
					v.name = nn
				}
				else if(v.type == "task" && v.image == on){
					console.log("rename scene task",on, nn)
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
		console.log("calcScenes", PackageTools.calcScenes(Table1.selectedRow.script_json))
		await updateScriptJson.run(Table1.selectedRow).then(v=>{
			// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
			// delete Table1.selectedRow.scenes_prompt[oldName]
			let item = {
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"name":newName
			}
			updateScenePrompt.run(item).then(res=>{
				this.update()
			})
			// this.updateScenesPrompt().then( r =>{
			// console.log("calcScenes2", PackageTools.calcScenes(Table1.selectedRow.script_json))
			// })

		})

		// Input2Copy1.setValue(JSON.stringify(Table1.selectedRow.script_json,null,2))
	},

	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}