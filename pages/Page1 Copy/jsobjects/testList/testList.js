export default {
	
	changeImg(){
		showAlert(
			'选中图片',
			'success'
		)
	},
	ImgURL:'',
	imgItem:'',
	// 生成图片事件
	async getAIIMG(currentIndex,item){
		console.log(currentIndex,'45')
		this.imgItem = item
			 // {prompt:item}
		await Api4.run().then((res)=>{
			console.log(res,'我是小杜')
			this.ImgURL = 'data:image/png;base64' + res
		})
	},
	base64ToImageUrl(base64Data) {
    // 去掉 Base64 数据中的前缀（例如 data:image/png;base64,）
    const parts = base64Data.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    const blob = new Blob([uInt8Array], { type: contentType });
    return URL.createObjectURL(blob);
},


	// getList(){
	// var scenes = Object.keys(this.testList)
	// return scenes
	// },

	getNewList(){

		console.log(Table1.selectedRow.scenes_prompt)
		const newArray = [];
		for (const sceneName in Table1.selectedRow.scenes_prompt) {
			const newObj = {
				sceneName: sceneName,
				...Table1.selectedRow.scenes_prompt[sceneName]
			};
			newArray.push(newObj);
		}

		return newArray
	},

	// testList:{
	// "library": {
	// "description": "明亮的图书馆内，书架整齐排列，放着各种书籍。左侧有一个小型阅览区，右侧是服务台。Mrs. Clove站在服务台后面整理书籍。Ben站在阅览区的桌子旁。",
	// "clip_zh": "晴天, 上午, 图书馆内部, 书架整齐排列, 各种书籍, 小型阅览区, 服务台",
	// "confidence": "95",
	// "clip": "sunny, morning, library interior, neatly arranged bookshelves, various books, small reading area, service desk"
	// },
	// "hospital": {
	// "description": "明亮干净的医院候诊室，墙上挂着健康宣传海报。左边是候诊椅，右边是护士站。Doctor坐在护士站后面的椅子上，似乎在打瞌睡。Ben和Mallow站在护士站前。",
	// "clip_zh": "晴天, 上午, 医院候诊室, 健康宣传海报, 候诊椅, 护士站, 椅子",
	// "confidence": "95",
	// "clip": "sunny, morning, hospital waiting room, health promotion posters, waiting chairs, nurse station, chair"
	// },
	// "farm": {
	// "description": "阳光明媚的农场，左侧是一片蔬菜田，右侧是一个小谷仓。田地里种着各种蔬菜，谷仓旁边有一些农场动物。Ross站在田地边缘，手里拿着一个小铲子。Ben和Mallow走进画面。",
	// "clip_zh": "晴天, 上午, 阳光明媚的农场, 蔬菜田, 小谷仓, 各种蔬菜, 农场动物, 小铲子",
	// "confidence": "95",
	// "clip": "sunny, morning, sunny farm, vegetable field, small barn, various vegetables, farm animals, small shovel"
	// },
	// "school_cafeteria": {
	// "description": "学校餐厅内，左侧是配餐区，右侧是用餐区。餐厅内有数张长桌和椅子。Rico站在配餐区后面，戴着厨师帽。Ben和Mallow走到配餐区前。",
	// "clip_zh": "晴天, 中午, 学校餐厅, 配餐区, 用餐区, 长桌, 椅子, 厨师帽",
	// "confidence": "95",
	// "clip": "sunny, noon, school cafeteria, serving area, dining area, long tables, chairs, chef's hat"
	// }
	// },
	appList:[
		{
			"id": "001",
			"name": "Blue",
			"img": "https://assets.appsmith.com/widgets/default.png"
		},
		{
			"id": "002",
			"name": "Green",
			"img": "https://assets.appsmith.com/widgets/default.png"
		},
		{
			"id": "003",
			"name": "Red",
			"img": "https://assets.appsmith.com/widgets/default.png"
		}
	],



}