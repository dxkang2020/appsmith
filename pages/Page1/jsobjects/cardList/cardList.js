export default {
	myVar1: [],
	myVar2: {},
	isShowBtn:false,

	getPrompt(item){
		return `**Goal:** Create a 512x512 vocabulary card image for a children's English learning app (ages 6-10).
**Priority:** Achieve **extremely low cognitive cost** for instant, unambiguous recognition. Must be clean, kid-friendly, and visually appealing.
**Style:** Use **Simplified Realism / Modern Illustration**. Enforce these key features for consistency:
    *   **Outlines:** Apply **bold, clean, dark-colored outlines** with a **consistent line weight** throughout the illustration.
    *   **Texture:** Integrate a **uniform, subtle noise or grain texture** across color-filled areas to add gentle surface detail.
    *   **Shading:** Use **simple, clean cell-shading** (minimal blending) beneath the texture layer to indicate form and dimension. Avoid overly complex gradients or photorealistic lighting.
    *   **Colors:** Employ a palette of **bright, clear, appealing, kid-friendly solid colors**.
**Format:** Isolate subject with a **transparent background (alpha channel, PNG)**, **centered**, **no text/letters**.
-----------------------------------
${item.clip}
`
	},

	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取

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
		const file =cList1.triggeredItemView.FilePicker3.files[0].data
		let filename = `${newVal}.png`
		let data = file
		let overwrite = false


		SaveCard.run({filename, overwrite,data}).then(res =>{
			if(res == "success"){
				closeModal(Modal6.name)
				Input13.setValue('')
				showAlert("修改成功","success")
				updateRow.updateJsonImage(this.updateVal,newVal)
			}	
			else if(res == "exists"){
				showAlert("名称重复","error")
			}else {
				showAlert("failed","error") 
			}


		})

	},
	coverSave(){
		this.uploadImg(this.updateVal,'cover')
	},
	InputOnBlur(index){
		if(Input9.text.length <=0 ){
			showAlert('不能为空','error')	
			return
		}
		let idx = index % cList1.pageSize 
		console.log("idx::", idx, index)
		this.listItems[index].clip = 	cList1.currentItemsView[idx].Input9.text


	},
	// 上传图片
	uploadImg(item,isCover){
		this.updateVal = item
		const file =cList1.triggeredItemView.FilePicker3.files[0].data

		let filename = `${item.name}.png`
		let data = file

		let overwrite =  isCover == 'cover' ? true : false
		SaveCard.run({filename, overwrite,data}).then(res =>{
			if(res == "success"){
				showAlert('保存成功','sucess')
				updateRow.updateCardPrompt(item)

				if(isCover == 'cover'){
					closeModal(Modal6.name)
				}

			}else if (res == "exists"){
				//弹窗提示改名或者覆盖
				Input13.setValue(item.name)
				showModal(Modal6.name)
			}	else{
				//failed
			}
		})

	},


	listItems : [],
	getCardsList(){
		let rlt = PackageTools.calcImages(Table1.selectedRow?.script_json)
		let names = rlt[0]
		let refs = rlt[1]
		console.log("images", names)
		getCardsPrompt.run({names}).then(res=>{
			console.log("images:",getCardsPrompt.data)

			this.listItems = res.map((v)=>{
				let item = {
					...v,
					urls :`https://af.runfox.cn/courses/cards/${v.name}.png?r=${Math.random()}` 

				}
				if(refs[item.name])
					item.clip = `**Illustrate the word**: ${item.name}\n**references**:\n${refs[item.name].join("\n")}
`
					return item
			})
		})


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