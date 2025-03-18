export default {

	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},

	jsonArr :Table1.selectedRow.script_json.scripts,
	textArr:[
		{
			"step": "#1",
			"task": "Drop a table",
			"status": "approved"
		},
		{
			"step": "#2",
			"task": "Create a query fetch_users with the Mock DB",
			"status": "pending"
		},
		{
			"step": "#3",
			"task": "Bind the query using => fetch_users.data",
			"status": "pending"
		}
	],
	getTexts(jsonArr){
		const innerGetTexts = getTexts;
		if (!Array.isArray(jsonArr)) {
			jsonArr = [jsonArr];
		}
		let texts = new Set()
		jsonArr.forEach((v)=>{
			if(v.text && v.type != "assess"){
				texts.add(v.text)
			}
			if(v.feedback && v.feedback.length > 0){
				v.feedback.forEach((item)=>{
					texts.add(...getTexts([item]))
				})
			}
		})
		return texts
	}

}