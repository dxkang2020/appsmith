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
						Table1.selectedRow.screenplay&& Table1.selectedRow.screenplay.length > 300 &&
						(!Table1.selectedRow.script_json || Table1.selectedRow.script_json == "null")){
			Button5.setLabel("生成JSON") 
			Button5.setVisibility(true)

		}
		else
			Button5.setVisibility(false)
		if(Tabs1.selectedTab == "Scenes"){
			scenesList.getNewList()
		}else if(Tabs1.selectedTab == "Cards"){
			cardLsit.getNewList()
		}
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
		n8Gen.run({course_number,version,level,course,scenes,cards})
	},
	onBtnClicked(){
		console.log("onBtnClicked")
		if(Tabs1.selectedTab == "剧本")
			Query3.run()
		else if(Tabs1.selectedTab == "Json"){
			console.log("gen json")
			let version = Table1.selectedRow.version
			let level = Table1.selectedRow.level
			let course_number = Table1.selectedRow.course_number
			let course = btoa(JSON.stringify(Table1.selectedRow.script_json))
			let scenes = btoa(JSON.stringify(Table1.selectedRow.scenes_prompt))
			let cards = btoa(JSON.stringify(Table1.selectedRow.cards_prompt))

			// n8Json.run({course_number,version,level})
			n8JsonTest.run({course_number,version,level})
			// n8Gen.run({course_number,version,level,course,scenes,cards})

		}
	},
	onPlayBlur(){

	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}