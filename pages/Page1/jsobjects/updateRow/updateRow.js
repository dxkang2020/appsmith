export default {
	json:null,
	rowIndex:'',
	row:{},
	async update(){

		let idx = Table1.selectedRowIndex

		this.rowIndex = Table1.selectedRowIndex

		// let updatedTableData =[...Table1.tableData]
		// updatedTableData[idx] = this.row

		updateTable.data[idx] = this.row
		await Table1.setData(updateTable.data)
		Table1.setSelectedRowIndex(	this.rowIndex)
		// await Table1.setSelectedRowIndex(idx)


		// await updateTable.run().then(res=>{
		// 
		// })
		// Tab.onTabSelectChanged()

	},
	showError(e){
		showAlert(e,"error")
	},
	async updateScreenplay(){
		await this.getCourseById()
		if (Input2.text == this.row.screenplay){
			return
		}
		console.log("updateScreenplay")
		Button5.setDisabled(true)
		await updateScreenplay.run().then(_=>{

			this.row.screenplay = Input2.text
			this.update()
		}).catch(this.showError)
		Button5.setDisabled(false)
	},
	async updateCardPrompt(item){
		await this.getCourseById()
		updateCardPrompt.run(item).then(async(res)=>{
			await		this.update()
			await Tab.onTabSelectChanged()
		})
	},
	async updateScenePrompt(item){
		await this.getCourseById()
		updateScenePrompt.run(item).then(async res=>{
			await this.update()

			await Tab.onTabSelectChanged()
		})
	},
	async updateJsonImage(updateVal, newName){
		console.log('45454',updateVal)
		let oldName = updateVal?.name
		await this.getCourseById()
		
		
		if(!oldName || !newName || oldName == newName || !this.row?.script_json?.scripts?.length)
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
		console.log(this.row,'rou')
		_updateScrits(this.row.script_json.scripts, oldName, newName)


		// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
		// console.log(this.row.script_json["scripts"][25])
		await updateScriptJson.run(this.row).then(async v=>{

			let item = {
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"name":newName
			}

			await	updateCardPrompt.run(item).then(async ()=>	{
				await this.update()
				await Tab.onTabSelectChanged()

			})
		})

	},

	async	getCourseById(){
		this.row = Table1.selectedRow
		await getCourseById.run(Table1.selectedRow).then(s =>{
			let arr =s[0]
			// console.log(arr,'arr')
			for(let k in arr){
				if(Table1.selectedRow[k] == arr[k]){
					this.row[k] = arr[k]
				}
			}
			// console.log(this.row, 'getCourseById')
		})
	},


	async updateJsonScene(updateVal, newName){
		let oldName = updateVal?.name
		console.log("updateVal:", updateVal)
		await this.getCourseById()

		if(!oldName || !newName || oldName == newName || !this.row?.script_json?.scripts?.length)
			return

		function _updateScrits(scripts, on, nn){

			// console.log("scripts?.lenth", scripts?.length, typeof scripts)
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

		_updateScrits(this.row.script_json.scripts, oldName, newName)
		console.log(this.row.script_json,'script_json')




		await updateScriptJson.run(this.row).then(async v=>{
			// await updateScriptJson.run(this.row).then(v=>{
			// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
			// delete this.row.scenes_prompt[oldName]
			// ****
			// this.row.script_json = PackageTools.calcScenes(this.row.script_json)

			// console.log(test,'test')
			let item = {
				"clip":updateVal.clip,
				"clip_zh":updateVal.clip_zh,
				"description":updateVal.description,
				"prompt_id":updateVal.prompt_id,
				"name":newName
			}
			await	updateScenePrompt.run(item).then( async res=>{
				// console.log(this.row.script_json,'script_json2',test)

				await this.update()
				await Tab.onTabSelectChanged()
				// await scenesList.getScenesList()
			})

			// this.row.script_json.scripts[0].name = newName
			// console.log(this.row.script_json.scripts[0].name,'22222222')
			//Tab.onTabSelectChanged()
			// ****
			// this.updateScenesPrompt().then( r =>{
			// console.log("calcScenes2", PackageTools.calcScenes(this.row.script_json))
			// })

		})
		// console.log(this.row.script_json.scripts[0].name,'selectRow name')
		// console.log(Table1.tableData[0].script_json.scripts[0].name,'tableData name')
		// console.log(updateTable.data[0].script_json.scripts[0].name,'updateTable name')
		// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
	},

	async updateJsonSceneByName(oldName, newName){

		if(!oldName || !newName || oldName == newName || !this.row?.script_json?.scripts?.length)
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
					// console.log("rename scene task",on, nn)
					v.image = nn
				}
				if(v.feedback?.length)
					v.feedback.forEach(function(v){
						_updateScrits(v, on, nn)
					})
			})

		}
		_updateScrits(this.row.script_json["scripts"], oldName, newName)
		// updateScriptJson.run().then(v=>{
		// // Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
		// updateTable.run()
		// })

		await updateScriptJson.run(this.row).then(v=>{
			// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
			this.update()
			closeModal(Modal8.name)
			showAlert('修改成功')

		})

		// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}