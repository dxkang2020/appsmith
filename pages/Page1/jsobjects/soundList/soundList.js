export default {
	audioArr:[],
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},
	listItems:null,
	getTexts(jsonArr,currentIndex){
		if (!Array.isArray(jsonArr)) {
			jsonArr = [jsonArr];
		}
		
		var that = this
		let texts = []
		let index = currentIndex;
		jsonArr.forEach((v)=>{
			if(v.text && v.type != "assess" &&v.character){

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
	playAudio(item){
		// 继续播放不传值
		if(!item){
			if(!Checkbox1.isChecked)
				return
			this.audioIndex = this.audioIndex + 1
		}else{
			this.audioIndex = item.index
		}
		item =   this.audioArr[this.audioIndex-1]
		this.showText = item.text;

		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let url = `https://af.runfox.cn/courses/sounds/${level}/${course_number}/${this.generateAudioName(item)}.mp3`
		console.log("url:", url)
		Audio1.setPlaying(false)
		Audio1.setURL(url)
		Audio1.setPlaying(true)

	},
	openMoadl4(){
		Audio1.setPlaying(false)
		showModal(Modal4.name)
	},
	RowSelected(currentRow){
		console.log('12121',currentRow)
	},
	resetAudio(){
		showAlert('正在生成','success')
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let overwrite = true
		let course = {
			"scripts": [
				{
					"character":  this.audioArr[this.audioIndex-1 >=0 ?this.audioIndex-1 :  0].character,
					"text": this.audioArr[this.audioIndex-1 >=0 ?this.audioIndex-1 :  0].text
				}
			]
		}

		GenResource.run({course_number,level,overwrite, course}).then(()=>	{
			showAlert('生成成功','success')
			Audio1.setURL('')
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