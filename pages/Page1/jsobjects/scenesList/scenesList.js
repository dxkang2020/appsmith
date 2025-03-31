export default {
	isShowBtn:false,

	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取
	getPrompt(item){
		return `请按以下要求生成一张场景图，尺寸是横版1536x1024 ，
**Wide-angle lens perspective, emphasizing spatial depth and environmental narrative.** 3D render simulating stop-motion claymation/plasticine miniature style. Chunky, stylized, clearly defined rounded forms with finely rendered key details. Possesses a matte/low-sheen plasticine texture with a clearly visible yet fine surface grain/texture, featuring only very subtle, controlled simulated handmade marks. Vibrant, saturated, cheerful solid colors. Bright daylight simulation, soft shadows. **Mandatory composition: Bottom 35% of frame MUST be empty ground/floor only,** no objects or details. Whimsical, charming, playful miniature aesthetic maintaining a good finish with visible material detail. cinematic depth of field ::2.2, warm/cool ratio=50±5%. void zone (bottom:0-35%) ::2.
${item.clip}
`
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
		const file =sList1.triggeredItemView.FilePicker1.files[0].data
		let filename = `${newVal}.png`
		let data = file
		let overwrite = false

		SaveScene.run({filename, overwrite,data}).then(res =>{
			if(res == "success"){

				closeModal(Modal7.name)
				Input14.setValue('')
				showAlert("修改成功","success")
				updateRow.updateJsonScene(this.updateVal,newVal)

			}	else if(res == "exists"){
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
		let txt = sList1.currentItemsView[index % sList1.pageSize ]?.Input3?.text
		if(!txt?.length ){
			showAlert('不能为空','error')	
			return
		}

		// this.listItems[index].clip = 	txt
		// this.sceneslistItems[index].clip = 	sList1.currentItemsView[index % sList1.pageSize ].Input3.text


	},
	// 上传图片
	uploadImg(item,isCover){
		this.updateVal = item
		const file =sList1.triggeredItemView.FilePicker1.files[0].data
		// sList1.selectedItemView.Image1Copy.image = file
		// return
		let filename = `${item.name}.png`
		let data = file

		let overwrite =  isCover == 'cover' ? true : false
		SaveScene.run({filename, overwrite,data}).then(res =>{
			if(res == "success"){
				showAlert('保存成功','sucess')
				updateRow.updateScenePrompt(item)

				if(isCover == 'cover'){
					closeModal(Modal7.name)
				}

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