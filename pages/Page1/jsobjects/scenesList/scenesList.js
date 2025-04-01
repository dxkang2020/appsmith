export default {
	isShowBtn:false,
	temText:'',
	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取
	getPrompt(item){
		return `请按以下要求生成一张场景图，尺寸是横版1536x1024 ， 
**Wide shot, camera pulled back**. 3D render simulating stop-motion claymation/plasticine miniature style. Chunky, stylized, clearly defined rounded forms with finely rendered key details. Possesses a matte/low-sheen plasticine texture with a clearly visible yet fine surface grain/texture, featuring only very subtle, controlled simulated handmade marks. Vibrant, saturated, cheerful solid colors. Bright daylight simulation, soft shadows.** Mandatory composition: Bottom 35% of frame MUST be empty ground/floor only,** no objects or details. Whimsical, charming, playful miniature aesthetic maintaining a good finish with visible material detail. cinematic depth of field ::2.2, warm/cool ratio=50±5%. void zone (bottom:0-35%) ::2.
${item.clip}
`
	},
	clipSave(item,index){
		console.log(this.temText,'45454',item.clip)
		// return
		if(!this.temText){
			showAlert('保存失败','error')
			return
		}
		let startIndex = ((sList1.pageNo -1 ) * sList1.pageNo) + index
		if(this.temText != item.clip){
			let val = {
				"clip":this.temText,
				"clip_zh":item.clip_zh,
				"description":item.description,
				"name":item.name
			}

			updateRow.updateScenePrompt(val).then(r=>{
				this.listItems[startIndex].clip = this.temText
				this.temText =''
			})
		}else{
			showAlert('提示词相同')
		}



	},
	InputOnBlur(index){
		let txt = sList1.currentItemsView[index % sList1.pageSize ]?.Input3?.text
		if(!txt?.length ){
			showAlert('不能为空','error')	
			return
		}
		this.temText =txt
		// this.listItems[index].clip = 	txt
		// this.sceneslistItems[index].clip = 	sList1.currentItemsView[index % sList1.pageSize ].Input3.text
	},
	modifySave(){
		let newVal = Input14.text
		console.log(newVal)
		if(newVal.length <= 0){
			showAlert('不能为空','error')
			return
		}
		if(!this.validateInput(newVal)){
			showAlert('错误符号','error')
			return
		}

		updateRow.updateJsonScene(this.updateVal,newVal).then( r=>{
			this.updateVal.name = newVal
			this.uploadImg(this.updateVal,false,this.localIndex)
		}
																												 )


	},
	coverSave(){
		this.uploadImg(this.updateVal,'cover',this.localIndex)
	},
	localIndex :0, //记录index
	// 上传图片
	uploadImg(item, isCover, index){
		this.updateVal = item
		this.localIndex = index
		const file =sList1.triggeredItemView.FilePicker1.files[0]

		// sList1.currentItemsView[index % sList1.pageSize ]?.sImage?.
		let startIndex = ((sList1.pageNo -1 ) * sList1.pageNo) + index

		console.log(startIndex,'startIndex')
		let filename = `${item.name}.png`

		let overwrite =  isCover == 'cover' ? true : false
		console.log("saveScene:", filename, overwrite)

		SaveScene.run({filename, overwrite,file}).then(res =>{
			if(res == "success"){
				showAlert('保存成功','success')
				updateRow.updateScenePrompt(item)

				let uri = 'data:image/png;base64,' + btoa(file.data)
				console.log("listItems",startIndex,  this.listItems[startIndex])
				this.listItems[startIndex].urls = uri
				this.listItems[startIndex].clip = item.clip
				this.listItems[startIndex].name = item.name

				// debugger;
				// if(isCover == 'cover'){
				closeModal(Modal7.name)
				// }

			}else if (res == "exists"){
				//弹窗提示改名或者覆盖
				Input14.setValue(item.name)
				showModal(Modal7.name)
			}	else{
				//failed
			}
		})

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


	},
	listItems : [],

	// 获取列表

	getScenesList(){
		let names = PackageTools.calcScenes(Table1.selectedRow.script_json)
		console.log("images", names)
		getScenesPrompt.run({names}).then(res=>{
			// console.log("scenes:",res)
			this.listItems = res.map((v)=>{
				return {
					...v,
					urls :`https://af.runfox.cn/courses/scenes/${v.name}.png?r=${Math.random()}` 

				}
			})
			console.log("scenes:",		this.listItems)
			// return 	this.listItems


		})
	},

	getNewList(){

		const newArray = [];
		for (const sceneName in Table1.selectedRow.scenes_prompt) {
			const newObj = {
				sceneName: sceneName,
				...Table1.selectedRow.scenes_prompt[sceneName],

				// `https://s.runfox.cn/storage/v1/object/public/images/scenes/${sceneName}.png`
			};
			newObj.ImgURL = `https://af.runfox.cn/courses/scenes/${sceneName}.png?r=${newObj.prompt_id ?? Math.random()}`
			console.log("imgurl:", newObj.ImgURL)
			newArray.push(newObj);

		}

		this.listItems =  newArray
	},
	// 查看图片
	priviewImg(item){
		this.imgP = item.urls
		showModal(Modal2.name)
	},
	imgP:'',
	validateInput(input) {
		const regex = /^[a-zA-Z0-9_]+$/;
		return regex.test(input);
	},



}