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
			// Button5.setVisibility( Table1.selectedRow.screenplay == Input2.text)
			Button5.setVisibility(true)
			Button20.setVisibility(false)
		}
		else if(Tabs1.selectedTab == "Json" &&
						Table1.selectedRow.screenplay&& Table1.selectedRow.screenplay.length > 300 ){
			let label = ""
			let diffMinute = (Date.now() - new Date(Table1.selectedRow.updated_at))/60000
			Button20.setVisibility(true)
			Button20.setDisabled(true)
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
			Button20.setVisibility(false)
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
	checkJson(data){

		function validateData(data,path='scripts'){
			if (Array.isArray(data)) {
				for (let i = 0; i < data.length; i++) {
					const result = validateData(data[i], `${path}[${i}]`);
					if (result !== true) return result;
				}
				return true;
			}

			// 处理对象
			const stringFields = ['type', 'name', 'character', 'text'];
			const booleanFields = ['image_only', 'retry'];
			// 验证字符串字段
			for (const field of stringFields) {
				if (data.hasOwnProperty(field) && (typeof data[field] !== 'string'  && typeof data[field] !== 'object')) {
					showAlert(`错误：在 ${path}.${field} 处应为字符串，实际为 ${typeof data[field]}`,'error')
					return `错误：在 ${path}.${field} 处应为字符串，实际为 ${typeof data[field]}`;
				}
			}
			// 验证布尔字段
			for (const field of booleanFields) {
				if (data.hasOwnProperty(field) && typeof data[field] !== 'boolean') {
					showAlert(`错误：在 ${path}.${field} 处应为布尔值，实际为 ${typeof data[field]}`,'error')
					return `错误：在 ${path}.${field} 处应为布尔值，实际为 ${typeof data[field]}`;
				}
			}
			// 递归验证所有对象属性（包括feedback）
			for (const key in data) {
				if (data.hasOwnProperty(key) && (typeof data[key] === 'object' || Array.isArray(data[key]))) {
					const result = validateData(data[key], `${path}.${key}`);
					if (result !== true) return result;
				}
			}
			return true
		}


		return validateData(data)
	},

	async 	saveJson(){
		let b = JSON.parse(Input2Copy1.text)
		let a =this.checkJson(b.scripts)
		console.log(a,'+++++++a')
		if(typeof a ==='string'  && a.includes('错误'))return

		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = ''
		let scenes =Table1.selectedRow.scenes_prompt
		let cards = Table1.selectedRow.cards_prompt
		// console.log(level,course_number,Input2Copy1.text)
		// return
		try{
			course = JSON.parse(Input2Copy1.text) 	
			await updateRow.getCourseById()
			let val ={
				script_json:course,
				id:Table1.selectedRow.id
			}

			await GenResource.run({course_number,level,course,scenes,cards}).then(async res=>{
				if(res.scripts == 'success'){
					showAlert('保存成功','success')
					// await updateRow.update()
					await updateScriptJson.run(val)
				}else{
					showAlert('保存失败'+res.scripts ,'error')

				}
			}).catch(error =>{
				showAlert('保存失败','error')
			})
		}catch{
			showAlert('不是标准的JSON格式','error')

			return false
		}

	},
	JsonText:'',
	isJson:false,
	input2OnBlur(){
		let txt = 	Input2Copy1.text
		// this.JsonText = txt
		try{
			this.isJson =true
			JSON.parse(txt)

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