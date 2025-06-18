export default {
	myVar1: [],
	myVar2: {},
	jsonData:{},
	checkInput(input){
		if (!input.includes('-')) return [input];
	},
	onQueryClick(){
		let inputNum = Input19.text
		var startNum,endNum = 0
		if(inputNum.includes('-')){
			[startNum, endNum] = inputNum.split('-');
		}else{
			showAlert('输入错误','error')
			return
		}
		if(startNum <= 0){
			showAlert('不能小于0','error')
			return
		}
		UniqueWords.run().then(res=>{

			let arr = res.slice(startNum-1,endNum)
			this.JsonArr = arr.map((v)=>{
				return {
					name:v.word_id,

				}
			})
		})

		return
		let params ={
			filename:`words/${Input19.text}*.json`
		} 
		SearchFiles.run(params).then(res=>{
			console.log(res)
			// this.JsonArr =res
			this.JsonArr = res.map(v=>{
				return {
					name:v
				}
			})
		})

	},
	JsonArr :[],
	async onTableClick(){
		let  rowIndex = Table1.selectedRowIndex
		console.log(rowIndex)
		Button20.setDisabled(true)
		await wordJson.run().then(res=>{
			if(res){
				this.jsonData  = res

				// Table1.setSelectedRowIndex(rowIndex)
				// if(Array.isArray(res)){
				// this.JsonArr[rowIndex].script_json = res[0]
				// }else{
				// this.JsonArr[rowIndex].script_json = res
				// }
				this.onTabSelectChanged()
				// Table1.setData()
				// Table1.setData([{level:this.JsonArr[rowIndex]['level'],course_number:this.JsonArr[rowIndex]['course_number'],script_json:this.jsonData} ])

			}
		})

	},
	async	onTabSelectChanged () {
		if(Tabs1.selectedTab == "Json"){
			Text11.setVisibility(true)
			Button20.setVisibility(true)
			Button20.setDisabled(true)

		}else{
			Button20.setVisibility(false)
			Text11.setVisibility(false)
		}
		if(Tabs1.selectedTab == "Cards"){
			// await updateRow.getCourseById()
			await	cardList.getCardsList()

			// Test.getCardsList()
		}else if(Tabs1.selectedTab == "Sounds"){
			// soundList.getTexts(Table1.selectedRow.script_json.scripts,0)
			soundList.getTexts(this.jsonData,0)
		}else if(Tabs1.selectedTab == 'Scenes'){
			await scenesList.getScenesList()
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

	async 	saveJson(){

		let checkJson = this.isValidJSON(Input2Copy1.text)
		console.log(checkJson)
		if(checkJson){
			let	word_scripts = JSON.parse(Input2Copy1.text)
			await GenResource.run({word_scripts,overwrite:true}).then(async res=>{
				if(res.scripts == 'success'){
					showAlert('保存成功','success')
					// await updateRow.update()
					this.onTableClick()
				}else{
					showAlert('保存失败'+res.scripts ,'error')
				}
			}).catch(error =>{
				showAlert('保存失败 catch','error')
			})
		}
	},
	JsonText:'',
	isJson:false,
	input2OnBlur(){

		this.isValidJSON(Input2Copy1.text)
		Button20.setDisabled(false)
	},
	isValidJSON(str) {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			showAlert('不是标准的JSON格式','error')
			return false;
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