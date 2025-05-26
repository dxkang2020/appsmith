export default {
	myVar1: [],
	myVar2: {},
	jsonData:{},
	async onTableClick(){
		await queryJson.run().then(res=>{
			if(res){
				this.jsonData  = res
				// Table1.setData([{ level: 'John', course_number: 36 ,test:1}, { level: 'Jane', course_number: 28,test:2 }])
				Table1.setData([{level:this.JsonArr[0]['level'],course_number:this.JsonArr[0]['course_number'],script_json:this.jsonData} ])

			}
		})

	},
	async	onTabSelectChanged () {
		if(Tabs1.selectedTab == "Json"){
			Button20.setVisibility(true)

		}else{
			Button20.setVisibility(false)
		}
		if(Tabs1.selectedTab == "Cards"){
			// await updateRow.getCourseById()
			await	cardList.getCardsList()

			// Test.getCardsList()
		}else if(Tabs1.selectedTab == "Sounds"){
			// soundList.getTexts(Table1.selectedRow.script_json.scripts,0)
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
	test(){


	},
	onQueryClick(){

		// let course_numbers = this.parseCourseRange(Input1.text)
		let course_numbers = Input1.text
		let  level = Select1.selectedOptionValue
		let  val =`scripts/${level}/${course_numbers}_lt.json`

		// updateTable.run({course_numbers})
		console.log(val,'params')

		SearchFiles.run({filename:val}).then(res=>{
			console.log(res)
			if(res.length > 0){
				this.JsonArr = res.map(filePath => {
					// 1. 拆分路径
					const parts = filePath.split('/'); // ["scripts", "starters", "3.3_lt.json"]
					const fileName = parts.pop();      // "3.3_lt.json"

					// 2. 提取 level 和 course_number
					const level = parts[parts.length - 1]; // "starters"
					const courseNumber = fileName.split('_')[0]; // "3.3"

					// 3. 返回目标对象
					return {
						level: level,
						course_number: courseNumber
					};
				});


			}
		})
		// this.JsonArr  = testJson.json

	},
	JsonArr :'',
	async 	saveJson(){
		if(!this.isJson)return
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = JSON.parse(this.JsonText.slice(1, -1).trim()) 	

		await GenResource.run({course_number,level,course}).then(async res=>{
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