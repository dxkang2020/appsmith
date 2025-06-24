export default {

	cardslistItems : [],
	getMarkdown() { return "```json\n" + this.test() + "\n``` \n"; },
	publisher:[],
	gradeArr:[],
	seriseArr:[],
	booksArr:[],
	temporaryArr:[],
	temGradeArr:[],
	testpublishers(){
		
		this.publisher = JSObject4.publishers.map(v=>{
			return{
				name: v.name,
				code:v.name
			}
		})
	},
	allChange(){
		this.booksArr = ''
		this.gradeArr = ''
		this.seriseArr = ''

	},
	seriesChange(){
		this.booksArr = ''
		this.gradeArr = ''
	},
	gradeChange(){
		this.booksArr = ''
	},
	testSerise(){

		const val = 	JSObject4.publishers.find(p=>p.name ===  Select1.selectedOptionValue)
		this.temporaryArr = val
		console.log(this.temporaryArr)
		this.seriseArr = 	val.series.map(vi=>{
			return{
				name: vi.name,
				code: vi.name
			}
		})

	},
	testGrade(){

		let val =  Select2.selectedOptionValue
		const grade = 		this.temporaryArr.series.find(p=>p.name === val)
		console.log(grade)
		this.temGradeArr = grade
		this.gradeArr = grade.grades.map(grade =>{
			return{
				name: grade.name,
				code: grade.name
			}
		})
	},
	testBook(){
		let val =  Select3.selectedOptionValue
		const books = 	this.temGradeArr.grades.find(p=>p.name ===val)
		console.log(books,'hh',val)
		this.booksArr = books.volumes.map(book=>{
			return{
				name: book.full_shortname,
				code: book.full_shortname
			}
		})
	},
	updateScenesPrompt(){
		let keys = Object.keys(Table1.selectedRow.scenes_prompt)
		for (let k of keys ){
			console.log(k)

		}
	},
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
		// console.log(Table1.selectedRow.scenes_prompt)
		fetch("")
		let splay = Table1.selectedRow.screenplay.replace("[player]","<player>")
		let matches = Table1.selectedRow.screenplay.matchAll(/\[出现任务卡(.*)\]/g)
		for(let m of matches){
			console.log("clip:",m[1])
		}



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