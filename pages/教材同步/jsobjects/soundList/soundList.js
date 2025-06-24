export default {
	audioArr:[],

	listItems:null,
	soundList:{},
	getTexts(jsonArr,currentIndex){
		var assessList = jsonArr.assess_lists
		var dialogues = jsonArr.dialogues

		// if (!Array.isArray(dialogues)) {
		// dialogues = [dialogues];
		// }


		// 测试后
		var that = this
		let texts = []
		let index = currentIndex;
		assessList.forEach(vi=>{
			vi.texts.forEach(sv =>{
				texts.push({
					'text':sv,
					"character":vi.character,
					'index': ++index
				})
			})
		})
		dialogues.forEach((v)=>{
			if(v?.text  &&v?.character){

				texts.push({
					'text':v?.text,
					"character":v?.character,
					'index': ++index
				})
				// this.soundList[v.character][v.text] =1

			}
			if(v?.scripts && v?.scripts.length > 0){

				v?.scripts.forEach((item)=>{
					if(item?.text  &&item?.character){

						texts.push({
							'text':item?.text,
							"character":item?.character,
							'index': ++index	
						})


					}
					// let items = that.getTexts(item, index)
					// texts.push(...items)
					// index += items.length
				})
			}
			// if(v.feedback && v.feedback.length > 0){
			// 
			// v.feedback.forEach((item)=>{
			// let items = that.getTexts(item, index)
			// texts.push(...items)
			// index += items.length
			// })
			// }
			// if(v.answer_analysis){
			// 
			// texts.push({
			// 'text':v.answer_analysis.text,
			// "character":v.answer_analysis.character,
			// 'index': ++index
			// })
			// }


		})
		// let arr =  Array.from(texts) 
		// console.log(texts)
		this.audioArr = texts

		return texts
	},

	reviewAudio(){
		let script =  Table1.selectedRow.screenplay.replaceAll("[player]","<player>")//剧本
		const scriptArray = [];
		const regex = /([\w\. _]+)[：:\s]+\[[^\]]+\]\s*"([^\[]*)"/gm
		let match;
		while ((match = regex.exec(script))) {
			scriptArray.push({
				character: match[1].trim(),
				text: match[2]
			});
		}
		const audioSet = new Set();
		scriptArray.forEach(item => {
			let key2 = `${item.text}`;
			audioSet.add(key2);
		});


		var missingDialogues = this.audioArr.filter(item => {
			//不拿角色名进行匹配
			// const result = item.character.replace(/_/g, '. ').replace(/\b\w/g, char => char.toUpperCase()); // 每个单词首字母大写
			// let itemkey = `${result}|${item.text}`;
			let itemkey = `${item.text}`;
			return !audioSet.has(itemkey);
		});

		let extra = 0
		// let yiExtra= 0

		missingDialogues =  missingDialogues.filter(v=>{
			if (script.indexOf(v.text) >= 0){
				extra+=1
				return false
			}else{
				return true
			}
		})

		// if(scriptArray.length + extra  > this.audioArr.length){
		// 
		// }
		showModal(Modal11.name)
		this.soundTextArr = missingDialogues


		// , 未找到: ${extra}
		this.soundNumText = `剧本条数:${scriptArray.length + extra},JSON音频条数:${this.audioArr.length}`
		console.log(extra,"lenght",this.audioArr.length, scriptArray.length,this.soundTextArr.length)



	},
	soundTextArr:'',
	soundNumText:'',
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


		// let level = Table1.selectedRow.level
		// let course_number = Table1.selectedRow.course_number
		let url = `https://af.runfox.cn/courses/sounds/dialogues/${this.generateAudioName(selectedRow)}.mp3`
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

			let url = `https://af.runfox.cn/courses/sounds/dialogues/${this.generateAudioName(item)}.mp3`
			console.log("url:", url)


			Audio1.setURL(url)
			Audio1.setPlaying(true)

			// Audio1.setURL('')
		}).catch(error =>{
			showAlert(error,'error')
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