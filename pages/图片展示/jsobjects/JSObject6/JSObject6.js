export default {
	handlePaste: function(event) {
		const clipboardData = event.originalEvent?.clipboardData || window.clipsboardData;
		const items = clipboardData.items;
		for (const item of items) {
			if (item.type.indexOf('image') != -1) {
				const blob = item.getAsFile();
				const reader = new FormData();
				reader.readAsDataURL(blob);
				reader.onload = function() {
					const base64Image = reader.result;
					Image1.image = base64Image;
				};
			}
		}
	},
	setupPasteListener: function() {
		const inputElement = document.getElementById(input1._id);
		inputElement.addEventListener('paste', this.handlePaste);
	}
}