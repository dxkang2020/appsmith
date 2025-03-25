export default {

	getMarkdown() { return "```json\n" + this.test() + "\n``` \n"; },
	test(){
		updateRow.updateJsonScene("runfox_school_gate","runfox_school_gate1")
		updateRow.updateJsonImage("3","3.3")
	},
	lines100(){
		return Array.from({length: 100}, (_, i) => `${i+1}`).join("\n")
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}