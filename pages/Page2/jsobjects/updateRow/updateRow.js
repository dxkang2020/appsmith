export default {
	json:null,
	rowIndex:'',
	row:{},
	async update(){

		// let idx = Table1.selectedRowIndex

		this.rowIndex = Table1.selectedRowIndex

		// updateTable.data[idx] = this.row
		// await Table1.setData(updateTable.data)
		Table1.setSelectedRowIndex(	this.rowIndex)
		console.log(Table1.selectedRow,'====')


	},
	showError(e){
		showAlert(e,"error")
	},

	async updateCardPrompt(item){
		await this.getCourseById()
		updateCardPrompt.run(item).then(async(res)=>{
			await		this.update()
			await cardList.getCardsList()
			// await Tab.onTabSelectChanged()
		}).catch(error =>{
			showAlert(error,'error')
		})

	},
	async updateRes(){
		let level = this.row.level
		let course_number = this.row.course_number
		let course = this.row.script_json
		let scenes = this.row.scenes_prompt
		let cards = this.row.cards_prompt
		GenResource.run({course_number,level,course,scenes,cards})
	},
	async updateScenePrompt(item){
		await this.getCourseById()
		// console.log(item,'item')

		updateScenePrompt.run(item).then(async res=>{
			await this.update()
			await scenesList.getScenesList()

			// await Tab.onTabSelectChanged()
		}).catch(error =>{
			showAlert(error,'error')
		})

	},
	async updateJsonImage(updateVal, newName,ismodify){


		console.log('45454',updateVal)
		let oldName = updateVal?.name
		// await this.getCourseById()


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
				// if(v.scripts && v.scripts.length > 0){
				// v.scripts.forEach(function(fvs){
				// // _calcImages(fvs).forEach(is=>images.add(is))
				// })
				// }
				// if(v.feedback && v.feedback.length > 0){
				// v.feedback.forEach(function(v){
				// _updateScrits(v, on, nn)
				// })
				// }

			})

		}
		console.log( Table1.selectedRow,'rou')
		_updateScrits( Table1.selectedRow.script_json.scripts, oldName, newName)

		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course =  Table1.selectedRow.script_json

		await GenResource.run({course_number,level,course}).then(async res=>{
			if(res.scripts == 'success'){
				showAlert('保存成功','success')
				// await updateRow.update()
				if(ismodify){
					// 修改保存则不此处调用updateCardPrompt
					// this.uploadImg(this.updateVal,'modify',this.localIndex)
					updateVal.name = newName
					cardList.uploadImg(updateVal,'modify',cardList.localIndex)
				}
				Tab.onTableClick()
				await cardList.getCardsList()
			}
		}).catch(error =>{
			showAlert(error,'error')
		})
		return
		// Input2Copy1.setValue(JSON.stringify(this.row.script_json,null,2))
		// console.log(this.row.script_json["scripts"][25])
		await updateScriptJson.run( Table1.selectedRow).then(async v=>{
			if(ismodify){
				// 修改保存则不此处调用updateCardPrompt
				// this.uploadImg(this.updateVal,'modify',this.localIndex)
				updateVal.name = newName
				cardList.uploadImg(updateVal,'modify',cardList.localIndex)
			}
			// let item = {
			// "clip":updateVal.clip,
			// "clip_zh":updateVal.clip_zh,
			// "description":updateVal.description,
			// "prompt_id":updateVal.prompt_id,
			// "name":newName
			// }

			// await	updateCardPrompt.run(item).then(async ()=>	{
			// await this.update()
			// 
			// await cardList.getCardsList()
			// this.updateRes()
			// 
			// }).catch(error =>{
			// showAlert(error,'error')
			// })


		}).catch(error =>{
			showAlert(error,'error')
		})

	},

	async	getCourseById(){
		this.row = Table1.selectedRow
		await getCourseById.run(Table1.selectedRow).then(s =>{
			let arr =s[0]
			// console.log(arr,'arr')
			for(let k in arr){
				// if(Table1.selectedRow[k] == arr[k]){
				this.row[k] = arr[k]
				// console.log('du',	this.row[k])

				// }
			}
			// console.log(this.row, 'getCourseById')
		})
	},


	async updateJsonScene(updateVal, newName,ismodify){
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
			if(ismodify){
				// 修改保存则不此处调用updateCardPrompt
				// this.uploadImg(this.updateVal,'modify',this.localIndex)
				updateVal.name = newName
				scenesList.uploadImg(updateVal,'modify',scenesList.localIndex)
			}
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
				// await Tab.onTabSelectChanged()
				await scenesList.getScenesList()
				this.updateRes()
			}).catch(error =>{
				showAlert(error,'error')
			})

			// this.row.script_json.scripts[0].name = newName
			// console.log(this.row.script_json.scripts[0].name,'22222222')
			//Tab.onTabSelectChanged()
			// ****
			// this.updateScenesPrompt().then( r =>{
			// console.log("calcScenes2", PackageTools.calcScenes(this.row.script_json))
			// })

		}).catch(error =>{
			showAlert(error,'error')
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