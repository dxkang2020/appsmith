export default {
	myVar1: [],
	myVar2: {},
	isShowBtn:false,
	// testbtn(){
	// this.isShowBtn =true
	// Button6.setLabel('加载中')
	// setTimeout(()=>{
	// this.isShowBtn =false
	// },8000)
	// },
	changeImg(){
		showAlert(
			'选中图片',
			'success'
		)
	},

	async cardconfirm (item,index) {

		console.log("item:", index, item )
		if(item.prompt_id){
			let path = `cards/${item.sceneName}.png`
			let prompt_id = item.prompt_id
			let overwrite = false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "sucess"){
					let cards_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.cards_prompt));
					if(cards_prompt[item.sceneName].clip != item.clip){
						cards_prompt[item.sceneName].clip = item.clip;
						// cards_prompt[item.sceneName].prompt_id = item.prompt_id;
						updateCardsPrompt.run({cards_prompt})
					}


				}	
			})
		}

		// await uploadImage.run({path:"/images/scen/6.png",
		// "data":atob(getImage.data),
		// "contentType":"image/png"
		// })
	},
	InputOnBlur(index){

		this.listItems[index].clip = 	cList1.currentItemsView[index].Input9.text


	},

	// 生成图片事件
	async getAIIMG(currentIndex,item){
		this.isShowBtn = true
		if(this.isShowBtn){

			await GenCard.run(item).then((res)=>{

				this.listItems[currentIndex].ImgURL =  'data:image/png;base64,' + res
				this.listItems[currentIndex].prompt_id = GenCard.responseMeta.headers?.prompt_id[0]
				this.isShowBtn = false
				console.log(this.isShowBtn,'hhaa')

				this.imgP =  'data:image/png;base64,' + res
				showModal(Modal3.name)


			}).catch((err) =>{
				console.log(err)
				this.isShowBtn = false
			})
		}
		// storeValue('isShowBtn',true)
		// List1.currentItemsView[currentIndex].Button6.isVisible = false
		// return

	},
	listItems : [],

	// 获取列表
	getNewList(srow){
		let row = srow ||  Table1.selectedRow
		const newArray = [];
		console.log("cards_prompt", row.cards_prompt)
		for (const sceneName in Table1.selectedRow.cards_prompt) {

			const newObj = {
				sceneName: sceneName,
				...Table1.selectedRow.cards_prompt[sceneName],

				// ImgURL:`https://s.runfox.cn/storage/v1/object/public/images/cards/${sceneName}.png`
			};
			newObj.ImgURL = `https://af.runfox.cn/courses/cards/${sceneName}.png`
			console.log("imgurl:", newObj.ImgURL)
			newArray.push(newObj);

		}

		this.listItems =  newArray
	},
	// 查看图片
	priviewImg(item){
		this.imgP = item
		showModal(Modal3.name)
	},
	imgP:'',


	async myFun2 () {
		//	use async-await or promises
		let cards_prompt = Table1?.selectedRow?.cards_prompt
		if(!cards_prompt)
			return;
		if(cards_prompt["doctor_treating"])
			cards_prompt["doctor_treating"].url = ""
		console.log("cards_prompt::", cards_prompt)
		await updateScenePrompt.run({cards_prompt})
		let id = Table1?.selectedRow?.id
		await getCourseById.run({id})
		console.log(`data:::${Table1?.selectedRow?.id}`, getCourseById.data)
		return
	}
}