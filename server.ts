import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { Util } from "./util.ts";

let previousWord = "しりとり";

console.log("Listening on http://localhost:8000");
serve(async (req) => {
	const pathname = new URL(req.url).pathname;

	if (req.method === "GET" && pathname === "/shiritori") {
		return new Response(previousWord);
	}
	if (req.method === "POST" && pathname === "/shiritori") {
		const requestJson = await req.json();
		const nextWord = requestJson.nextWord;

		//空文字チェック
		if (!nextWord) {
			return new Response("単語を入力してください!", { status: 400 });
		}

		//すべてひらがなorカタカナかチェック
		if (!nextWord.match(/^[ぁ-んー　]*$/)) {
			if (!nextWord.match(/^[ア-ヶー　]*$/)) {
				return new Response("不適切な文字が含まれています!", {
					status: 400,
				});
			}
		}

		//「ん」のチェック
		if (
			nextWord.charAt(nextWord.length - 1) === "ん" ||
			nextWord.charAt(nextWord.length - 1) === "ン"
		) {
			return new Response("まけ", { status: 400 });
		}

		let ch_nextWord = Util.kataToHira(nextWord);
		let ch_previousWord = Util.kataToHira(previousWord);

		console.log(ch_nextWord);
		console.log(ch_nextWord.charAt(0));
		console.log(ch_previousWord);
		console.log(ch_previousWord.charAt(ch_previousWord.length - 1));

		//最後の文字が伸ばし棒の場合削除する
		if (ch_previousWord.charAt(ch_previousWord.length - 1) === "ー") {
			ch_previousWord = ch_previousWord.slice(0, -1);
		}

		//続いているかチェック
		if (
			ch_previousWord.charAt(ch_previousWord.length - 1) !==
			ch_nextWord.charAt(0)
		) {
			return new Response("前の単語に続いていません!", { status: 400 });
		}

		previousWord = nextWord;
		return new Response(previousWord);
	}

	return serveDir(req, {
		fsRoot: "public",
		urlRoot: "",
		showDirListing: true,
		enableCors: true,
	});
});
