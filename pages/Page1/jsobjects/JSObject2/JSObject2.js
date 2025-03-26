export default {
	Switch1onChange () {
		console.log("Switch1onChange")
		update_status.run().then(v =>{
			console.log("success!")
			updateTable.run()
		}).catch(e=>{
			console.log("eeee:",e)
			Switch1.setValue(false)
			showAlert(update_status.data)
		})
		//	write code here

	}
}