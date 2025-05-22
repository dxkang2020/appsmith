export default {
	myVar1: [],
	myVar2: {},
	getMarkdown(json) { return "```json\n" + JSON.stringify(json,null,2) + "\n``` \n\n"; },
	getScriptJson(){
		return this.getMarkdown(Table1.selectedRow.script_json)
	},
	getScenePrompts(){
		return  this.getMarkdown(Table1.selectedRow.scenes_prompt)
	},
	getCardPrompts(){
		return  this.getMarkdown(Table1.selectedRow.cards_prompt)
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}