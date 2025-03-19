export default {
	audioArr:[],
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},

	getTexts(jsonArr){
		if (!Array.isArray(jsonArr)) {
			jsonArr = [jsonArr];
		}
		var that = this
		let texts = []
		let a = 0;
		jsonArr.forEach((v,i)=>{
			if(v.text && v.type != "assess"){

				texts.push({
					'text':v.text,
					"character":v.character,
					'index': ++a
				})
			}
			if(v.feedback && v.feedback.length > 0){
				v.feedback.forEach((item)=>{
					texts.push(...that.getTexts(item))
				})
			}
		})
		// let arr =  Array.from(texts) 
		console.log(texts)
		this.audioArr = texts
		return texts
	},
	showText:'',
	playAudio(item){
		this.showText = item.text;

		console.log(item)
		// return
		let level = Table1.selectedRow.level
		let course_number = Table1.selectedRow.course_number
		let url = `https://a.runfox.cn/courses/sounds/${level}/${course_number}/${this.generateAudioName(item)}.mp3`
		console.log("url:", url)
		Audio1.setURL(url)
		Audio1.setPlaying(true)

	},


	// 音频名字处理
	generateAudioName(item) {
		// 保留字母、数字、波浪号和指定标点
		let text = item.text
		let character = item.character || ""
		const cleaned = text.replace(/[^a-zA-Z0-9~\']/g, ' ');
		return character.toLocaleLowerCase() + "_" + cleaned.toLowerCase().trim().replace(/\s+/g, '_');
	}
}