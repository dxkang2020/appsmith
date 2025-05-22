export default {
	isShowBtn:false,
	temText:'',
	newNameText:'',
	oldNameText:'',
	updateVal:{}, //确认要上传的参数 覆盖后重新上传提取
	getPrompt(item){
		if(item.name.includes('task_')){
			return `A colorful and clean 2D digital illustration designed as a children's educational app visual. Size 1536x1024. Features a slightly claymation-inspired surface with a playful and whimsical atmosphere. Clean composition with a focused subject. Use a solid, low-saturation background color that provides clear value (light/dark) contrast with the subject, in order to enhance subject visibility. Ensure the subject stands out clearly using subtle soft shadows or light outlines if needed. Maintain generous spacing around the subject (visual breathing room). No scenery, no people, no characters, no text, no signature, no watermark. Simple flat background, optimized for UI integration in kids' content.
illustrate：${item.clip}
`
		}else{
			return `请按以下要求生成一张第一视角的游戏场景图，场景下方三分之一位置将会添加游戏角色，要留够角色走动的空间，尺寸是横版1536x1024 ， Wide shot, camera pulled back. 3D render simulating stop-motion claymation/plasticine miniature style. Chunky, stylized, clearly defined rounded forms with finely rendered key details. Matte, low-sheen plasticine texture with visible fine surface grain, subtle handmade marks. Vibrant, saturated, cheerful solid colors. Bright daylight simulation, soft shadows. **IMPORTANT COMPOSITION REQUIREMENT: Bottom 30% of the image MUST be completely empty floor ONLY — no tables, no objects, clean ground. This area will be used for character movement. Leave this area totally clear.** Whimsical, charming, playful miniature aesthetic with visible material detail. Cinematic depth of field ::2.2. Balanced warm/cool light ratio: 50±5%. void zone (bottom:0-30%) ::2. 
${item.clip}
`
		}

	},
	openScens(item,index){
		this.updateVal = item
		this.oldNameText = item.name
		Input15.setValue(item.name)
		showModal(Modal8.name)
		// let startIndex = ((sList1.pageNo -1 ) * sList1.pageNo) + index
		// this.localIndex = startIndex
	},
	confirmName(){
		let txt = Input15.text
		console.log(this.oldNameText,this.newNameText)
		// return
		if(!txt?.length ){
			showAlert('不能为空','error')	
			return
		}
		if(this.oldNameText == txt){
			showAlert('场景名相同')
			return
		}
		updateRow.updateJsonScene(this.updateVal,this.newNameText).then(res=>{
			closeModal(Modal8.name)
			// this.listItems[this.localIndex].name =  txt
		})


	},
	Input15OnBlur(){
		let txt = Input15.text
		if(!txt?.length ){
			showAlert('不能为空','error')	
			return
		}
		if(!this.validateInput(txt)){
			showAlert('错误符号','error')
			return
		}
		this.newNameText = txt
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

		updateRow.updateJsonScene(this.updateVal,newVal,'ismodify').then( r=>{
			// this.updateVal.name = newVal
			// this.uploadImg(this.updateVal,false,this.localIndex)
		}
																																		)


	},
	coverSave(){
		this.uploadImg(this.updateVal,'cover',this.localIndex)
	},
	localIndex :0, //记录index
	// 上传图片
	async	uploadImg(item, isCover, index){
		showModal(Modal9.name)

		this.updateVal = item
		this.localIndex = index
		const file =sList1.triggeredItemView.FilePicker1.files[0]
		let startIndex = ((sList1.pageNo -1 ) * sList1.pageNo) + index

		// console.log(startIndex,'startIndex')
		let filename = `${item.name}.webp`

		let overwrite =  isCover == 'cover' ? true : false
		console.log("saveScene:", filename, overwrite)

		await	SaveScene.run({filename, overwrite,file}).then(res =>{
			if(res == "success"){
				showAlert('保存成功','success')
				closeModal(Modal9.name)
				if(isCover != 'modify'){
					// 如果是修改保存的话 则不在此处掉updateRow.updateScenePrompt()
					updateRow.updateScenePrompt(item)
				}

				this.listItems[startIndex].urls = file.data
				this.listItems[startIndex].clip = item.clip
				this.listItems[startIndex].name = item.name
				closeModal(Modal7.name)
			}else if (res == "exists"){
				closeModal(Modal9.name)
				//弹窗提示改名或者覆盖
				Input14.setValue(item.name)
				showModal(Modal7.name)
			}	else{
				//failed
				closeModal(Modal9.name)

			}
		}).catch((error)=>{
			closeModal(Modal9.name)
			showAlert(error,'error')
		})

	},


	listItems : [],

	// 获取列表

	async getScenesList(){
		// console.log(Table1.selectedRow.script_json.scripts[0].name, '3333')
		// await updateRow.getCourseById()
		// console.log(updateRow.row.script_json,'updateRow.row.script_json')
		let names = PackageTools.calcScenes(updateRow.row.script_json)

		// console.log("images", names)
		let screenplay = Table1.selectedRow.screenplay
		let level = Table1.selectedRow.level
		let course_number =  Table1.selectedRow.course_number
		let jbArr = [] 
		let obj ={}
		const matches =Array.from( screenplay.matchAll(/\[出现任务卡：(.*)\]/g));
		let index = 0
		// console.log(matches)
		if(matches.length > 0){
			for(let  m of matches){
				obj.name= `task_${level}_${course_number}_${index+1}`
				obj.clip = m[1]
				obj.description = m[1]
				index++;
				// console.log("clip:",m[1])
				jbArr.push(obj) 
				names.push(obj.name)
			}
		}
		// console.log(names,'match')

		await getScenesPrompt.run({names}).then(res=>{
			// console.log("scenes:",res)
			if(names.length !== res.length){

				// console.log('1111122')
				var urlarr = res.map((v)=>{
					return {
						...v,
						urls :`https://af.runfox.cn/courses/scenes/${v.name}.webp?r=${Math.random()}` 
					}
				})

				this.listItems = [...urlarr,...jbArr]


			}else{
				this.listItems = res.map((v,i)=>{
					return {
						...v,
						urls :`https://af.runfox.cn/courses/scenes/${v.name}.webp?r=${Math.random()}` 
					}
				})
			}

			console.log("scenes:",		this.listItems)
			// return 	this.listItems


		}).catch(error =>{
			showAlert(error,'error')
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

	downloadImg(){

		download(this.imgP,
						 'my-image-name',
						 'image/png').then(res=>{
			console.log(res)
		}).catch(err =>{
			console.log('err',err)
		})
	},
	// 查看图片
	priviewImg(item){

		this.imgP = `https://af.runfox.cn/courses/scenes/${item.name}.webp`
		showModal(Modal2.name)
	},
	imgP:'',
	validateInput(input) {
		const regex = /^[a-zA-Z0-9_]+$/;
		return regex.test(input);
	},



}