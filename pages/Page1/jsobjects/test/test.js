export default {
	myVar1: [],
	myVar2: {},
	async testImg () {
		//	write code here
		//	this.myVar1 = [1,2,3]
		await getImage.run({path:"/images/tests/2.jpeg"})
		console.log(getImage.data)
		await uploadImage.run({path:"/images/tests/5.jpeg",
													 "data":getImage.data,
													 "contentType":"image/jpeg"
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