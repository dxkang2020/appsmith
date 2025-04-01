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
		let names = PackageTools.calcScenes(Table1.selectedRow.script_json)
		console.log("images", names)

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