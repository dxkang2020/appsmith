export default {

	cardslistItems : [],
	getMarkdown() { return "```json\n" + this.test() + "\n``` \n"; },

	test(){
		// updateRow.updateJsonSceneByName("hospital_boy","hospital")
		// updateRow.updateJsonSceneByName("farm_00","farm")
		// updateRow.updateJsonSceneByName("school_restaurant_123","school_restaurant")
		// let rlt = PackageTools.calcImages(Table1.selectedRow?.script_json)
		// let names = rlt[0]
		// let refs = rlt[1]
		// console.log(names, refs)
		// let names = PackageTools.calcScenes(Table1.selectedRow.script_json)
		// console.log("images", names)
		console.log(Table1.selectedRow.updated_at)
		let diffMinute = (Date.now() - new Date(Table1.selectedRow.updated_at))/60000
		console.log(diffMinute)
		let hour = 1
		let min
		

	},
	genTestJson(){
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
	onFileSelected(){
		console.log("data len", FilePicker2.files[0].data.length)
		SaveCard.run({
			filename:"_1.png",
			overwrite:true,
			data:FilePicker2.files[0].data
		})
	},
	lines100(){
		return Array.from({length: 100}, (_, i) => `${i+1}`).join("\n")
	},

}