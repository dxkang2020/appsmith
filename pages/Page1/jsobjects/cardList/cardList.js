export default {
	myVar1: [],
	myVar2: {},
	isShowBtn:false,
	temText:'',
	getPrompt(item){
		return `**Goal:** Create a 512x512 vocabulary card image for a children's English learning app (ages 6-10).
**Priority:** Achieve **extremely low cognitive cost** for instant, unambiguous recognition. Must be clean, kid-friendly, and visually appealing.
**Style:** Use **Simplified Realism / Modern Illustration**. Enforce these key features for consistency:
    *   **Outlines:** Apply **bold, clean, dark-colored outlines, Hex:1F150D,24-pixel border** with a **consistent line weight** throughout the illustration.
    *   **Texture:** Integrate a **uniform, subtle noise or grain texture** across color-filled areas to add gentle surface detail.
    *   **Shading:** Use **simple, clean cell-shading** (minimal blending) beneath the texture layer to indicate form and dimension. Avoid overly complex gradients or photorealistic lighting.
    *   **Colors:** Employ a palette of **bright, clear, appealing, kid-friendly solid colors**.
**Format:** Isolate subject with a **transparent background (alpha channel, PNG)**, **centered**, **no text/letters**.
------------
${item.clip}
`
	},

	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取

	clipSave(item,index){

		if(!this.temText){
			showAlert('保存失败','error')
			return
		}
		let startIndex = ((cList1.pageNo -1 ) * cList1.pageNo) + index
		if(this.temText != item.clip){
			let val = {
				"clip":this.temText,
				"clip_zh":item.clip_zh,
				"description":item.description,
				"name":item.name
			}

			updateRow.updateCardPrompt(val).then(()=>{
				this.listItems[startIndex].clip =	this.temText
				this.temText =''
			})
		}else{
			showAlert('提示词相同')
		}



	},
	InputOnBlur(index){
		let txt = cList1.currentItemsView[index % cList1.pageSize ]?.Input9?.text
		if(!txt?.length ){
			showAlert('不能为空','error')	
			return
		}
		this.temText =txt
		// if(Input9.text.length <=0 ){
		// showAlert('不能为空','error')	
		// return
		// }
		// let idx = index % cList1.pageSize 
		// console.log("idx::", idx, index)
		// this.temText = Input9.text
		// this.listItems[index].clip = 	cList1.currentItemsView[idx].Input9.text


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

		updateRow.updateJsonImage(this.updateVal,newVal).then(()=>{
			this.updateVal.name = newVal
			// closeModal(Modal6.name)
			// Input13.setValue('')
			// showAlert("修改成功","success")
			// console.log(res)

			this.uploadImg(this.updateVal,false,this.localIndex)
		})
	},
	coverSave(){
		this.uploadImg(this.updateVal,'cover',this.localIndex)
	},
	localIndex :0,
	// 上传图片
	uploadImg(item,isCover,index){
		showModal(Modal9.name)
		this.updateVal = item
		const file =cList1.triggeredItemView.FilePicker3.files[0]
		console.log("file::", file.name, file.dataFormat, file.size, file.type)

		let filename = `${item.name}.png`
		// let data = file

		let startIndex = ((cList1.pageNo -1 ) * cList1.pageNo) + index

		let overwrite =  isCover == 'cover' ? true : false

		SaveCard.run({filename, overwrite,file}).then(res =>{
			if(res == "success"){
				showAlert('保存成功','success')
				closeModal(Modal9.name)
				updateRow.updateCardPrompt(item)

				// let uri = 'data:image/png;base64,' + btoa(file.data)
				this.listItems[startIndex].urls = file.data

				this.listItems[startIndex].clip = item.clip
				this.listItems[startIndex].name = item.name
				// if(isCover == 'cover'){

				closeModal(Modal6.name)
				// }

			}else if (res == "exists"){
				//弹窗提示改名或者覆盖
				closeModal(Modal9.name)
				Input13.setValue(item.name)
				showModal(Modal6.name)
			}	else{
				//failed
				closeModal(Modal9.name)
			}
		}).catch(()=>{
			closeModal(Modal9.name)
		})

	},


	listItems : [],
	getCardsList(){
		let rlt = PackageTools.calcImages(Table1.selectedRow?.script_json)
		let names = rlt[0]
		let refs = rlt[1]
		// console.log("images", names)
		let obj ={}
		getCardsPrompt.run({names}).then(res=>{
			console.log("res", res)

			obj[res.name] = res

		})
		this.listItems = names.map((v)=>{
			let item = {
				name:v,
				urls :`https://af.runfox.cn/courses/cards/${v}.png?r=${Math.random()}` ,
				clip:obj[v]?.clip ?? "",
				clip_zh:obj[v]?.clip_zh ?? v,
				description:obj[v]?.description ?? v,
			}
			// if(refs[item.name])
			if(!item.clip.includes('Illustrate')){
				item.clip = `**Illustrate the word**: ${item.name}\n**references**:\n${refs[item.name].join("\n")}`
			}

			return item
		})
		console.log("images:",this.listItems)



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