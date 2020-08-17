import sheet from '../../../../../public/img/sprites.json'
import sizes from '../../../../../public/img/sprite-sizes.json'

for (let frameKey of Object.keys(sheet.frames)) {
	let layer = frameKey.split(':')[0]
	let frame = sheet.frames[frameKey as keyof typeof sheet.frames]
	frame.sourceSize = sizes[layer as keyof typeof sizes]
}

export default sheet
