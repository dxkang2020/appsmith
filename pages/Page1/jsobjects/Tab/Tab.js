export default {
	myVar1: [],
	myVar2: {},
	onTabSelectChanged () {
		//	write code here
		//	this.myVar1 = [1,2,3]
		console.log("selectedTab1:", Tabs1.selectedTab)
		if(Tabs1.selectedTab == "剧本"){
			Button5.setLabel("保存修改") 
			Button5.setVisibility( Table1.selectedRow.screenplay == Input2.text)
		}
		else if(Tabs1.selectedTab == "Json" &&
						Table1.selectedRow.screenplay&& Table1.selectedRow.screenplay.length > 300 ){
			let label = ""
			let diffMinute = (Date.now() - new Date(Table1.selectedRow.updated_at))/60000
			if(!Table1.selectedRow?.script_json?.scripts?.length)
				label = "生成JSON"
			else if (Table1.selectedRow.status != "scripting" || diffMinute > 5 )
				label = "重新生成"
			if(label.length>0){
				Button5.setLabel(label) 
				Button5.setVisibility(true)
			}

		}
		else if(Tabs1.selectedTab == "Sounds"){
			soundList.getTexts(Table1.selectedRow.script_json.scripts,0)
		}
		else
			Button5.setVisibility(false)
		if(Tabs1.selectedTab == "Scenes"){
			scenesList.getScenesList()
			// Test.getScenesList()
		}else if(Tabs1.selectedTab == "Cards"){
			cardList.getCardsList()
			// Test.getCardsList()
		}
	},
	onGenRes(){
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = Table1.selectedRow.script_json
		let scenes =Table1.selectedRow.scenes_prompt
		let cards = Table1.selectedRow.cards_prompt
		GenResource.run({course_number,level,course,scenes,cards})
	},
	onTestClicked(){
		console.log("gen json")
		let version = Table1.selectedRow.version
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = Table1.selectedRow.script_json
		let scenes =Table1.selectedRow.scenes_prompt
		let cards = Table1.selectedRow.cards_prompt

		// n8Json.run({course_number,version,level})
		// n8JsonTest.run({course_number,version,level})
		Button5.setDisabled(true)
		showAlert('正在生成','success')
		n8JsonTest.run({course_number,version,level}).then(
			function(){
				Button5.setDisabled(false)
			}
		).catch(function(){
			Button5.setDisabled(false)
		})
	},
	onBtnClicked(){
		console.log("onBtnClicked")
		if(Tabs1.selectedTab == "剧本")
			updateRow.updateScreenplay()
		else if(Tabs1.selectedTab == "Json"){
			console.log("gen json")
			let version = Table1.selectedRow.version
			let level = Table1.selectedRow.level
			let course_number = Table1.selectedRow.course_number

			Button5.setDisabled(true)
			showAlert('正在生成','success')
			Table1.selectedRow.status = "scripting"
			n8Json.run({course_number,version,level}).then(
				function(){
					Button5.setDisabled(false)
					updateTable.run()
				}
			).catch(function(){
				Button5.setDisabled(false)
			})

			// n8JsonTest.run({course_number,version,level})


		}
	},
	onPlayBlur(){

	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}