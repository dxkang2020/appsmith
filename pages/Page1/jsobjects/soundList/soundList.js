export default {
	audioArr:[],

	listItems:null,
	getTexts(jsonArr,currentIndex){
		if (!Array.isArray(jsonArr)) {
			jsonArr = [jsonArr];
		}

		var that = this
		let texts = []
		let index = currentIndex;
		jsonArr.forEach((v)=>{
			if(v.text  &&v.character){

				texts.push({
					'text':v.text,
					"character":v.character,
					'index': ++index
				})
			}
			if(v.feedback && v.feedback.length > 0){

				v.feedback.forEach((item)=>{
					let items = that.getTexts(item, index)
					texts.push(...items)
					console.log(items,'ssss',...items,items.length)
					index += items.length
				})
			}
		})
		// let arr =  Array.from(texts) 
		// console.log(texts)
		this.audioArr = texts
		return texts
	},
	showText:'',
	audioIndex:0,

	openMoadl4(){
		Audio1.setPlaying(false)
		showModal(Modal4.name)
	},
	RowSelected(next){

		// let selectedRow =	Table2.selectedRow  //选中某一行
		let sIndex = Table2.selectedRowIndex //选中行index
		let arr = Table2.filteredTableData  //数据列表

		if(next){
			if(!Checkbox1.isChecked)
				return
			this.audioIndex += 1
		}else{
			//选中某一行 赋值给index 
			this.audioIndex = sIndex
		}
		console.log('12121',arr,this.audioIndex)
		if(this.audioIndex >= arr.length) return;

		let	selectedRow = arr[this.audioIndex]
		this.showText = selectedRow.text;


		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let url = `https://af.runfox.cn/courses/sounds/${level}/${course_number}/${this.generateAudioName(selectedRow)}.mp3`
		console.log("url:", url)
		Audio1.setPlaying(false)
		Audio1.setURL(url)
		Audio1.setPlaying(true)
	},
	testPause(){

		showAlert('暂停播放','warning')
	},
	resetAudio(item){
		console.log(item)

		showAlert('正在生成','success')
		Audio1.setURL('')
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let overwrite = true
		let course = {
			"scripts": [
				{
					"character":  item.character,
					"text": item.text
				}
			]
		}

		GenResource.run({course_number,level,overwrite, course}).then(()=>	{
			showAlert('生成成功','success')

			let url = `https://af.runfox.cn/courses/sounds/${level}/${course_number}/${this.generateAudioName(item)}.mp3`
			console.log("url:", url)


			Audio1.setURL(url)
			Audio1.setPlaying(true)

			// Audio1.setURL('')
		})
	},
	// 音频名字处理
	generateAudioName(item) {
		// 保留字母、数字、波浪号和指定标点
		let text = item.text
		let character = item.character || ""
		const cleaned = text.replace("<player>","").trim().replace(/[^a-zA-Z0-9~\']/g, ' ');

		return character.toLocaleLowerCase() + "_" + cleaned.toLowerCase().trim().replace(/\s+/g, '_');
	}
}