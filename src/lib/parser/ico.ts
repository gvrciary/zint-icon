export function createICOFile(images: ImageData[], sizes: number[]): ArrayBuffer {
	const header = new ArrayBuffer(6);
	const headerView = new DataView(header);
	headerView.setUint16(0, 0, true);
	headerView.setUint16(2, 1, true);
	headerView.setUint16(4, images.length, true);

	const dirEntries = new ArrayBuffer(16 * images.length);
	const dirView = new DataView(dirEntries);

	let imageDataOffset = 6 + 16 * images.length;
	const imageDataArray: ArrayBuffer[] = [];

	for (let i = 0; i < images.length; i++) {
		const size = sizes[i];
		const imageData = images[i];

		const bmpData = createBMPFromImageData(imageData, size);
		imageDataArray.push(bmpData);

		const offset = i * 16;
		dirView.setUint8(offset + 0, size === 256 ? 0 : size);
		dirView.setUint8(offset + 1, size === 256 ? 0 : size);
		dirView.setUint8(offset + 2, 0);
		dirView.setUint8(offset + 3, 0);
		dirView.setUint16(offset + 4, 1, true);
		dirView.setUint16(offset + 6, 32, true);
		dirView.setUint32(offset + 8, bmpData.byteLength, true);
		dirView.setUint32(offset + 12, imageDataOffset, true);

		imageDataOffset += bmpData.byteLength;
	}

	const totalSize =
		6 + 16 * images.length + imageDataArray.reduce((sum, data) => sum + data.byteLength, 0);
	const result = new ArrayBuffer(totalSize);
	const resultView = new Uint8Array(result);

	resultView.set(new Uint8Array(header), 0);

	resultView.set(new Uint8Array(dirEntries), 6);

	let offset = 6 + 16 * images.length;
	for (const imageData of imageDataArray) {
		resultView.set(new Uint8Array(imageData), offset);
		offset += imageData.byteLength;
	}

	return result;
}

function createBMPFromImageData(imageData: ImageData, size: number): ArrayBuffer {
	const width = size;
	const height = size;
	const imageSize = width * height * 4;
	const fileSize = 40 + imageSize;

	const buffer = new ArrayBuffer(fileSize);
	const view = new DataView(buffer);

	view.setUint32(0, 40, true);
	view.setInt32(4, width, true);
	view.setInt32(8, height * 2, true);
	view.setUint16(12, 1, true);
	view.setUint16(14, 32, true);
	view.setUint32(16, 0, true);
	view.setUint32(20, imageSize, true);
	view.setInt32(24, 0, true);
	view.setInt32(28, 0, true);
	view.setUint32(32, 0, true);
	view.setUint32(36, 0, true);

	const pixels = new Uint8Array(buffer, 40);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const srcIndex = ((height - 1 - y) * width + x) * 4;
			const dstIndex = (y * width + x) * 4;

			pixels[dstIndex + 0] = imageData.data[srcIndex + 2];
			pixels[dstIndex + 1] = imageData.data[srcIndex + 1];
			pixels[dstIndex + 2] = imageData.data[srcIndex + 0];
			pixels[dstIndex + 3] = imageData.data[srcIndex + 3];
		}
	}

	return buffer;
}
