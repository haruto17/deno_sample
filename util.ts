const _convertList = [
	{ ぁ: "あ" },
	{ ぃ: "い" },
	{ ぅ: "う" },
	{ ぇ: "え" },
	{ ぉ: "お" },
	{ っ: "つ" },
	{ ゃ: "や" },
	{ ゅ: "ゆ" },
	{ ょ: "よ" },
	{ ゎ: "わ" },
	{ ァ: "ア" },
	{ ィ: "イ" },
	{ ゥ: "ウ" },
	{ ェ: "エ" },
	{ ォ: "オ" },
	{ ッ: "ツ" },
	{ ャ: "ヤ" },
	{ ュ: "ユ" },
	{ ョ: "ヨ" },
	{ ヮ: "ワ" },
];

export class Util {
	static hiraToKata(str: string): string {
		return str.replace(/[\u3041-\u3096]/g, (ch) =>
			String.fromCharCode(ch.charCodeAt(0) + 0x60)
		);
	}

	static kataToHira(str: string): string {
		return str.replace(/[\u30A1-\u30FA]/g, (ch) =>
			String.fromCharCode(ch.charCodeAt(0) - 0x60)
		);
	}
}
