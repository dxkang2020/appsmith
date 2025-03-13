export default {
	myVar1: [],
	myVar2: {},
	async testImg () {
		//	write code here
		//	this.myVar1 = [1,2,3]
		await getImage.run({path:"/images/tests/7.jpeg"})
		console.log("Content-Type",getImage.responseMeta.headers["Content-Type"])
		await uploadImage.run({path:"/images/tests/6.png",
													 "data":atob(getImage.data),
													 "contentType":"image/png"
													})
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