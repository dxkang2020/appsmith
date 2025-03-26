export default {
	myVar1: [],
	myVar2: {},
	isShowBtn:false,

	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取

	async cardconfirm (item,index) {
		this.updateVal = item
		console.log("item:", index, item )
		if(item.prompt_id){
			let path = `cards/${item.sceneName}.png`
			let prompt_id = item.prompt_id
			let overwrite = index =='cover' ? true :  false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "success"){
					showAlert('保存成功','success')
					closeModal(Modal6.name)
					updateRow.updateCardsPrompt(item)

				}	
				else if (res == "exists")
				{
					//弹窗提示改名或者覆盖
					Input13.setValue(item.sceneName)
					showModal(Modal6.name)
				}
				else
				{
					//failed
				}
			})
		}

		// await uploadImage.run({path:"/images/scen/6.png",
		// "data":atob(getImage.data),
		// "contentType":"image/png"
		// })
	},
	modifySave(){
		let newVal = Input13.text
		if(newVal.length <= 0){
			showAlert('不能为空','error')
			return
		}
		if(!this.validateInput(newVal)){
			showAlert('错误符号','error')
			return
		}
		console.log(newVal)
		if(this.updateVal.prompt_id){
			let path = `cards/${newVal}.png`
			let prompt_id = this.updateVal.prompt_id
			let overwrite = false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "success"){
					closeModal(Modal6.name)
					Input13.setValue('')
					updateRow.updateJsonImage(this.updateVal,newVal)
				}	
				else if(res == "exists"){
					showAlert("名称重复","error")
				}


			})
		}
	},
	coverSave(){
		this.cardconfirm(this.updateVal,'cover')
	},
	InputOnBlur(index){
		let idx = index % cList1.pageSize 
		console.log("idx::", idx, index)
		this.listItems[index].clip = 	cList1.currentItemsView[idx].Input9.text


	},

	// 生成图片事件
	async getAIIMG(currentIndex,item){
		this.isShowBtn = true
		if(this.isShowBtn){
			console.log(item)
			await GenCard.run(item).then((res)=>{
				console.log("currentIndex", currentIndex)
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
			newObj.ImgURL = `https://af.runfox.cn/courses/cards/${sceneName}.png?r=${ newObj.prompt_id ?? Math.random()}`
			newArray.push(newObj);
			// cList1.listData
		}

		this.listItems =  newArray
	},
	// 查看图片
	priviewImg(item){
		this.imgP = item
		showModal(Modal3.name)
	},
	imgP:'',
	validateInput(input) {
		const regex = /^[a-zA-Z0-9_]+$/;
		return regex.test(input);
	},

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