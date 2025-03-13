export default {
	myVar1: [],
	myVar2: {},

	imgData:"",
	async testImg () {
		//	write code here
		//	this.myVar1 = [1,2,3]
		await getImage.run({path:"/images/tests/2.jpeg"})
		console.log("length1::",getImage.data.length)
		this.imgData = `data:image/png;base64,${getImage.data}`
		Image1.setImage(  this.imgData  )

		console.log("length2::",this.imgData.length)
		await Api9.run({path:"/images/tests/6.jpeg",
										"data":atob(getImage.data),
										"contentType":"image/jpeg"
									 })

	},
	upload1(path, data){

		const byteCharacters = atob(data); // 去除前缀并解码
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: "image/jpeg" });

		// 使用 fetch 发起请求
		fetch(`https://s.runfox.cn/storage/v1/object/${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "image/jpeg",
				"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik"
			},
			body: blob
		})
			.then(response => response.json())
			.then(data => console.log("Success:", data))
			.catch(error => console.error("Error:", error));

	},
	async upload(){
		let data = FilePicker1.files[0].data

		// uploadImageCopy.run({path:"/images/tests/6.jpeg"
		// })
		await uploadImage.run({path:"/images/tests/7.jpeg",
													 data,
													 "contentType":"image/jpeg"
													})
		// this.upload1("/images/tests/8.jpeg",data)
	},
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