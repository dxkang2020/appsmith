export default {
	isShowBtn:false,

	changeImg(){
		showAlert(
			'选中图片',
			'success'
		)
	},
	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取
	async confirm (item,index) {
		this.updateVal = item

		console.log("item:", index, item )
		if(item.prompt_id){
			let path = `scenes/${item.sceneName}.png`
			let prompt_id = item.prompt_id
			let overwrite = index =='cover' ? true :  false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "success"){

					showAlert('保存成功','sucess')
					if(index == 'cover'){
						closeModal(Modal7.name)
					}

					let scenes_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.scenes_prompt));
					if(scenes_prompt[item.sceneName].clip != item.clip){
						scenes_prompt[item.sceneName].clip = item.clip;
						// cards_prompt[item.sceneName].prompt_id = item.prompt_id;
					}
					updateScenePrompt.run({scenes_prompt}).then(()=>updateTable.run())


				}else if (res == "exists"){
					//弹窗提示改名或者覆盖
					Input14.setValue(item.sceneName)
					showModal(Modal7.name)
				}	else{
					//failed
				}
			})
		}
		// 
		// const base64Data = item.ImgURL.split(',')[1];
		// console.log("path:::", item.sceneName)
		// await uploadImage.run({path:`/images/scenes/${item.sceneName}.png`,
		// "data":atob(base64Data),
		// "contentType":"image/png"
		// })
		// if(Table1.selectedRow.scenes_prompt[item.sceneName].clip != this.listItems[index].clip){
		// let scenes_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.scenes_prompt));
		// updateScenePrompt.run({scenes_prompt})
		// scenes_prompt[item.sceneName].clip = this.listItems[index].clip;
		// }

		// await uploadImage.run({path:"/images/scen/6.png",
		// "data":atob(getImage.data),
		// "contentType":"image/png"
		// })
	},
	modifySave(){
		let newVal = Input14.text
		console.log(newVal)

		if(newVal.length <= 0){
			showAlert('请输入','error')
			return
		}
		if(this.updateVal.prompt_id){
			let path = `scenes/${newVal}.png`
			let prompt_id = this.updateVal.prompt_id
			let overwrite = false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "success"){

					let scenes_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.scenes_prompt));
					scenes_prompt[newVal] = scenes_prompt[this.updateVal.sceneName]
					delete scenes_prompt[this.updateVal.sceneName]
					closeModal(Modal7.name)
					Input14.setValue('')
					updateRow.updateJsonScene(this.updateVal.sceneName,newVal)
					updateCardsPrompt.run({scenes_prompt})

				}	
				else if(res == "exists"){
					showAlert("名称重复","error")
				}


			})
		}
	},
	coverSave(){
		this.confirm(this.updateVal,'cover')
	},
	InputOnBlur(index){

		this.listItems[index].clip = 	sList1.currentItemsView[index % sList1.pageSize ].Input3.text


	},

	// 生成图片事件
	async getAIIMG(currentIndex,item){
		// console.log('123',this.isShowBtn)
		this.isShowBtn = true

		if(this.isShowBtn){
			await GenScene.run(item).then((res)=>{
				this.isShowBtn = false

				this.listItems[currentIndex].ImgURL =  'data:image/png;base64,' + res
				this.listItems[currentIndex].prompt_id = GenScene.responseMeta.headers?.prompt_id[0]

				this.imgP =  'data:image/png;base64,' + res
				showModal(Modal2.name)
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
	getNewList(){

		const newArray = [];
		for (const sceneName in Table1.selectedRow.scenes_prompt) {
			const newObj = {
				sceneName: sceneName,
				...Table1.selectedRow.scenes_prompt[sceneName],

				// `https://s.runfox.cn/storage/v1/object/public/images/scenes/${sceneName}.png`
			};
			newObj.ImgURL = `https://af.runfox.cn/courses/scenes/${sceneName}.png?r=${Math.random()}`
			console.log("imgurl:", newObj.ImgURL)
			newArray.push(newObj);

		}

		this.listItems =  newArray
	},
	// 查看图片
	priviewImg(item){
		this.imgP = item
		showModal(Modal2.name)
	},
	imgP:'',




}