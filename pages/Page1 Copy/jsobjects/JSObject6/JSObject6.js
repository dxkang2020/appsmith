export default {

	getMarkdown() { return "```json\n" + this.test() + "\n``` \n"; },
	test(){
		return JSON.stringify(Table1.selectedRow.script_json,null,2)
	},
	lines100(){
		return Array.from({length: 100}, (_, i) => `${i+1}`).join("\n")
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}