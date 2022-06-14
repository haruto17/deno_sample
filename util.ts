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
