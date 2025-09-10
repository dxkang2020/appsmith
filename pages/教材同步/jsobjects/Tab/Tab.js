export default {
	myVar1: [],
	myVar2: {},
	jsonData:{},
	BookJson :{},

	unitInfo:'',
	async onTableClick(){
		showModal(Modal9.name)
		Button20.setDisabled(true)
		Button22.setDisabled(true)
		this.unitInfo = Table1.selectedRow.units
		// let params ={ 
		// t:Math.random()
		// new Date().getTime()
		// }params
		await SearchBooks.run().then(res=>{
			// console.log(res)
			closeModal(Modal9.name)
			storeValue('defaulttab', 'Json')
			this.jsonData  = res
		}).catch(err=>{
			closeModal(Modal9.name)
			this.jsonData = {}
			showAlert('加载失败','error')
		})

	},
	onQueryClick(){
		storeValue('select1', Select1.selectedOptionValue)
		storeValue('select2', Select2.selectedOptionValue)
		storeValue('select3', Select3.selectedOptionValue)
		storeValue('select4', Select4.selectedOptionValue)


		let  filename =`${Select4.selectedOptionValue}` 
		showModal(Modal9.name)
		storeValue('defaulttab', 'Json')
		Button20.setVisibility(true)
		Button20.setDisabled(true)
		Button22.setVisibility(true)
		Button22.setDisabled(true)

		this.jsonData = {}
		GetBook.run({filename}).then(res=>{
			if(res.units){
				closeModal(Modal9.name)
				this.JsonArr = res.units.map(v=>{
					return {
						units:`${v.page_start}_${v.page_end}_${v.title.replace(/[^a-zA-Z0-9]+/g, " ").trim().replace(/ /g, "_").toLowerCase()}.json`,
						name:`books/${Select4.selectedOptionValue}/${v.page_start}_${v.page_end}_${v.title.replace(/[^a-zA-Z0-9]+/g, " ").trim().replace(/ /g, "_").toLowerCase()}.json`
					}
				})
			}else{
				this.JsonArr =[]
				showAlert('没有数据','error')
				closeModal(Modal9.name)
			}
		}).catch(err=>{
			showAlert('搜索失败','error')
			closeModal(Modal9.name)
		})
		// let  filename =`books/${Select4.selectedOptionValue}/*.json` 
		// showModal(Modal9.name)
		// SearchFiles.run({filename}).then(res=>{
		// console.log(res)
		// if(res.length >0){
		// closeModal(Modal9.name)
		// this.JsonArr =  res.map(v=>{
		// return {
		// units:v.split('/').pop(),
		// name:v
		// }
		// }).sort((a, b) => {
		// // 提取a中的第一个数字
		// const numA = parseInt(a.units.match(/\d+/)[0]);
		// // 提取b中的第一个数字
		// const numB = parseInt(b.units.match(/\d+/)[0]);
		// return numA - numB;
		// });
		// }else{
		// this.JsonArr =[]
		// showAlert('没有数据','error')
		// closeModal(Modal9.name)
		// }
		// 
		// }).catch(err=>{
		// showAlert('搜索失败','error')
		// closeModal(Modal9.name)
		// })


	},
	async	onTabSelectChanged () {
		storeValue('defaulttab',Tabs1.selectedTab)
		console.log(appsmith.store.defaulttab)

		if(Tabs1.selectedTab == "Json"){
			Button20.setVisibility(true)
			Button20.setDisabled(true)
			Button22.setVisibility(true)
			Button22.setDisabled(true)


		}else{
			Button20.setVisibility(false)
			Button20.setDisabled(false)
			Button22.setVisibility(false)
			Button22.setDisabled(false)

		}
		if(Tabs1.selectedTab == "Cards"){
			// await updateRow.getCourseById()
			await	cardList.getCardsList()

			// Test.getCardsList()
		}else if(Tabs1.selectedTab == "Sounds"){
			// soundList.getTexts(Table1.selectedRow.script_json.scripts,0)
			soundList.getTexts(	this.jsonData,0)
		}else if(Tabs1.selectedTab == 'Scenes'){
			await scenesList.getScenesList()
		} if(Tabs1.selectedTab == 'BOOKJSON'){
			await this.getBookJson()
		}
	},
	getBookJson(){
		let  filename =`${Select4.selectedOptionValue}` 
		// showModal(Modal9.name)
		GetBook.run({filename}).then(res=>{

			this.BookJson = res
		})
	},



	JsonArr :[],

	saveJsonAudio(){

		let checkJson = this.isValidJSON(Input2Copy1.text)
		let checkNum = this.checkJsonNum(Input2Copy1.text)
		if(!checkNum){
			showAlert('页码不符' ,'error')
			return
		}
		showModal(Modal9.name)

		if(checkJson){
			let	book_scripts = JSON.parse(Input2Copy1.text)
			GenResource.run({book_scripts,overwrite:true}).then(async res=>{
				closeModal(Modal9.name)
				if(res.scripts == 'success' && res.audio  == 'success'){
					showAlert('保存成功','success')
					// await updateRow.update()
					this.onTableClick()
				}else{
					showAlert(`scripts:${res.scripts }, audio:${ res.audio}`,'error')
				}
			}).catch(error =>{
				closeModal(Modal9.name)
				showAlert('保存失败 catch','error')
			})
		}else{
			closeModal(Modal9.name)
		}
	},
	async 	saveJson(){

		let checkJson = this.isValidJSON(Input2Copy1.text)
		let checkNum = this.checkJsonNum(Input2Copy1.text)
		if(!checkNum){
			showAlert('页码不符' ,'error')
			return
		}
		showModal(Modal9.name)
		if(checkJson){
			let	book_scripts = JSON.parse(Input2Copy1.text)
			await GenResource.run({book_scripts,overwrite:true,skip_audio:true}).then(async res=>{
				closeModal(Modal9.name)
				if(res.scripts == 'success'){
					showAlert('保存成功','success')
					// await updateRow.update()
					this.onTableClick()
				}else{
					// showAlert('保存失败'+res.scripts ,'error')
					let  filename =`${Select4.selectedOptionValue}` 
					GetBook.run({filename}).then(async gv=>{
						await SaveBook.run(gv).then(async v=>{

							if(v == 'success'){
								// showAlert('保存成功','success')
								await GenResource.run({book_scripts,overwrite:true,skip_audio:true}).then(rv=>{
									if(rv.scripts == 'success'){
										showAlert('保存成功','success')
										this.onTableClick()
									}else{
										showAlert('保存失败'+rv ,'error')
									}
								})
							}else{
								showAlert('保存失败'+v ,'error')
							}
						})
					})
				}
			}).catch(error =>{
				closeModal(Modal9.name)
				showAlert('保存失败 catch','error')
			})
		}else{
			closeModal(Modal9.name)
		}

	},
	SaveBookJson(){

		let checkJson = this.isValidJSON(Input30.text)
		showModal(Modal9.name)
		if(checkJson){
			let	params = JSON.parse(Input30.text)
			SaveBook.run(params).then(async res=>{
				closeModal(Modal9.name)
				console.log(res,'452')
				if(res == 'success'){
					showAlert('保存成功','success')

					this.onQueryClick() 
				}else{
					showAlert('保存失败'+res ,'error')
				}
			}).catch(error =>{
				closeModal(Modal9.name)
				showAlert('保存失败 catch','error')
			})
		}else{
			closeModal(Modal9.name)
		}
	},

	JsonText:'',
	isJson:false,
	input2OnBlur(){
		this.isValidJSON(Input2Copy1.text)
		Button20.setDisabled(false)
	},
	input30OnBlur(){
		this.isValidJSON(Input30.text)
		// Button20.setDisabled(false)
	},
	checkJsonNum(json){
		let val = JSON.parse(json)
		let num =`${val.page_start}_${val.page_end}` 

		if( !this.unitInfo.includes(num) ){
			return false
		}else{
			return true
		}
	},

	isValidJSON(str) {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			showAlert('不是标准的JSON格式','error')
			return false;
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

	onGenRes(){
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let course = Table1.selectedRow.script_json
		let scenes =Table1.selectedRow.scenes_prompt
		let cards = Table1.selectedRow.cards_prompt
		GenResource.run({course_number,level,course,scenes,cards})
	},
	onPlayBlur(){

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
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}