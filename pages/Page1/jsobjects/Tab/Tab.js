export default {
	myVar1: [],
	myVar2: {},

	async	onTabSelectChanged () {
		// console.log(table,'table')
		// if(table)
		// Table1 = table
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
			Button20.setDisabled(false)
			if(!Table1.selectedRow?.script_json?.scripts?.length)
				label = "生成JSON"
			else if (Table1.selectedRow.status != "scripting" || diffMinute > 5 )
				label = "重新生成"
			if(label.length>0){
				Button5.setLabel(label) 
				Button5.setVisibility(true)
			}

		} else{
			Button5.setVisibility(false)
			Button20.setDisabled(true)
		}

		if(Tabs1.selectedTab == "Scenes"){
			await updateRow.getCourseById()
			await	scenesList.getScenesList()
			// Test.getScenesList()
		}else if(Tabs1.selectedTab == "Cards"){
			await updateRow.getCourseById()
			await	cardList.getCardsList()

			// Test.getCardsList()
		}else if(Tabs1.selectedTab == "Sounds"){
			soundList.getTexts(Table1.selectedRow.script_json.scripts,0)
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
	parseCourseRange(input) {
		if (!input.includes('-')) return [input];

		const [start, end] = input.split('-');
		const [startUnit, startLesson] = start.split('.').map(Number);
		const [endUnit, endLesson] = end.split('.').map(Number);

		const results = [];
		let currentUnit = startUnit;
		let currentLesson = startLesson;

		while (currentUnit < endUnit || (currentUnit === endUnit && currentLesson <= endLesson)) {
			results.push(`${currentUnit}.${currentLesson}`);

			currentLesson++;
			if (currentLesson > 3) {
				currentUnit++;
				currentLesson = 1;
			}
		}

		return results;
	},
	onQueryClick(){
		let course_numbers = this.parseCourseRange(Input1.text)
		updateTable.run({course_numbers})

	},
	async 	saveJson(){
		if(!this.isJson)return
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = JSON.parse(this.JsonText) 	
		let scenes =Table1.selectedRow.scenes_prompt
		let cards = Table1.selectedRow.cards_prompt

		await updateRow.getCourseById()
		let val ={
			script_json:course,
			id:Table1.selectedRow.id
		}
		await updateScriptJson.run(val)
		await GenResource.run({course_number,level,course,scenes,cards}).then(async res=>{
			if(res.scripts == 'success'){
				showAlert('保存成功','success')
				// await updateRow.update()

			}
		}).catch(error =>{
			showAlert(error,'error')
		})
	},
	JsonText:'',
	isJson:false,
	input2OnBlur(){
		let txt = 	Input2Copy1.text
		this.JsonText = txt
		try{
			this.isJson =true
			JSON.parse(this.JsonText)
			return true
		}catch(e){
			showAlert('不是标准的JSON格式','error')

			return false
		}

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
			let id = Table1.selectedRow.id

			Button5.setDisabled(true)
			showAlert('正在生成','success')
			Table1.selectedRow.status = "scripting"
			n8Json.run({course_number,version,level, id}).then(
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