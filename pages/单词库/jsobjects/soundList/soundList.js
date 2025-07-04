export default {
	audioArr:[],

	listItems:null,
	soundList:{},
	getTexts(jsonArr,currentIndex){
		console.log(jsonArr,'222')
		var val = jsonArr.scripts
		var other = jsonArr.word_metadata
		if (!Array.isArray(val)) {
			val = [val];
		}

		var that = this
		let texts = []
		let index = currentIndex;
		if(other.basic_info){
			texts.push({
				'text':other.basic_info.word,
				"character":'ben',
				'index': ++index
			})
		}
		// if(other.linguistic_properties.syllable_split){
		// console.log('dydyy')
		// 
		// let str = other.linguistic_properties.syllable_split
		// if(str.indexOf("-") > 1 && str.indexOf(" ") == -1){
		// console.log('dydyy22')
		// texts.push({
		// 'text':`ben_${str}`,
		// "character":'ben',
		// 'index': ++index
		// })
		// texts.push({
		// 'text':`ben__sy_${str}`,
		// "character":'ben',
		// 'index': ++index
		// })
		// }
		// }
		if(other.examples){
			Object.values(other.examples).forEach(exampleArray => {
				// 遍历当前数组中的每个示例
				exampleArray.forEach(example => {
					texts.push({
						'text':example.en,
						"character":'ben',
						'index': ++index
					})

				});
			});
		}
		val.forEach((v)=>{

			if(v.text  &&v.character){

				texts.push({
					'text':v.text,
					"character":v.character,
					'index': ++index
				})
				// this.soundList[v.character][v.text] =1

			}
			if(v.scripts && v.scripts.length > 0){

				v.scripts.forEach((item)=>{
					let items = that.getTexts(item, index)
					texts.push(...items)
					index += items.length
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
			if(v.answer_analysis){
				// let items = that.getTexts(item, index)
				// texts.push(...items)
				// index += items.length

				texts.push({
					'text':v.answer_analysis.text,
					"character":v.answer_analysis.character,
					'index': ++index
				})
			}


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
		showAlert('正在生成','success')
		Audio1.setURL('')
		// let level = Table1.selectedRow.level
		// let course_number = Table1.selectedRow.course_number
		let overwrite = true
		let word_scripts = {
			"scripts": [
				{
					"character":  item.character,
					"text": item.text
				}
			]
		}

		GenAudio.run({overwrite, word_scripts}).then(()=>	{
			showAlert('生成成功','success')

			let url = `https://af.runfox.cn/courses/sounds/dialogues/${this.generateAudioName(item)}.mp3`
			Audio1.setURL(url)
			Audio1.setPlaying(true)
		}).catch(error =>{
			showAlert(error.error,'error')
		})
	},
	test(){
		console.log(this.generateAudioName({
			text:"What do you **have**?",
			character:"ben"
		}))
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