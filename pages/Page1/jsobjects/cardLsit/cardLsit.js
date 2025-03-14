export default {
	myVar1: [],
	myVar2: {},
	isShowBtn:true,

	changeImg(){
		showAlert(
			'选中图片',
			'success'
		)
	},
	async cardconfirm (item,index) {


		const base64Data = item.ImgURL.split(',')[1];
		await uploadImage.run({path:`/images/cards/${item.sceneName}.png`,
													 "data":atob(base64Data),
													 "contentType":"image/png"
													})

		if(Table1.selectedRow.cards_prompt[item.sceneName].clip != this.listItems[index].clip){
			let cards_prompt = JSON.parse(JSON.stringify(Table1.selectedRow.cards_prompt));
			updateScene.run({cards_prompt})
			cards_prompt[item.sceneName].clip = this.listItems[index].clip;


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


		if(this.isShowBtn){
			this.isShowBtn = false
			await Api3.run(item).then((res)=>{

				this.listItems[currentIndex].ImgURL =  'data:image/png;base64,' + res
				this.isShowBtn = true
			}).catch((err) =>{
				console.log(err)
				this.isShowBtn = true
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
		for (const sceneName in Table1.selectedRow.cards_prompt) {
			const newObj = {
				sceneName: sceneName,
				...Table1.selectedRow.cards_prompt[sceneName],
				ImgURL:`https://s.runfox.cn/storage/v1/object/public/images/cards/${sceneName}.png`
			};
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
		await updateScene.run({cards_prompt})
		let id = Table1?.selectedRow?.id
		await getCourseById.run({id})
		console.log(`data:::${Table1?.selectedRow?.id}`, getCourseById.data)
		return
	}
}