export default {
	isShowBtn:false,

	changeImg(){
		showAlert(
			'选中图片',
			'success'
		)
	},
	async confirm (item,index) {


		console.log("item:", index, item )
		if(item.prompt_id){
			let path = `scenes/${item.sceneName}.png`
			let prompt_id = item.prompt_id
			let overwrite = false
			SaveImage.run({path, prompt_id, overwrite}).then(res =>{
				if(res == "sucess"){
					let scenes_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.scenes_prompt));
					if(scenes_prompt[item.sceneName].clip != item.clip){
						scenes_prompt[item.sceneName].clip = item.clip;
						// cards_prompt[item.sceneName].prompt_id = item.prompt_id;
						updateScenePrompt.run({scenes_prompt})
					}
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
	InputOnBlur(index){

		this.listItems[index].clip = 	sList1.currentItemsView[index].Input3.text


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
			newObj.ImgURL = `https://af.runfox.cn/courses/scenes/${sceneName}.png`
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