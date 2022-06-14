import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { Util } from "./util.ts";

const defaultWord = "しりとり";
let previousWord = defaultWord;
let stockWord = ["しりとり"];

console.log("Listening on http://localhost:8000");
serve(async (req) => {
	const pathname = new URL(req.url).pathname;

	if (req.method === "GET" && pathname === "/shiritori") {
		return new Response(previousWord);
	}
	if (req.method === "POST" && pathname === "/shiritori") {
		const requestJson = await req.json();
		const nextWord = requestJson.nextWord;

		//カタカナ→ひらがなに変換
		let ch_nextWord = Util.kataToHira(nextWord);
		let ch_previousWord = Util.kataToHira(previousWord);

		//空文字チェック
		if (!nextWord) {
			return new Response("単語を入力してください", { status: 400 });
		}

		//記号などが含まれていないかチェック
		if (!nextWord.match(/^[ぁ-んー　]*$/)) {
			if (!nextWord.match(/^[ア-ヶー　]*$/)) {
				return new Response("記号などがふくまれています", {
					status: 400,
				});
			}
		}

		//すでに使われているかチェック
		if (stockWord.includes(nextWord) || stockWord.includes(ch_nextWord)) {
			return new Response("その単語はすでに使われています", { status: 400 });
		}

		//「ん」のチェック
		if (ch_nextWord.charAt(nextWord.length - 1) === "ん") {
			return new Response("まけ", { status: 400 });
		}

		//最後の文字が伸ばし棒の場合削除する
		if (ch_previousWord.charAt(ch_previousWord.length - 1) === "ー") {
			ch_previousWord = ch_previousWord.slice(0, -1);
		}

		//続いているかチェック
		if (
			ch_previousWord.charAt(ch_previousWord.length - 1) !==
			ch_nextWord.charAt(0)
		) {
			return new Response("前の単語に続いていません", { status: 400 });
		} else {
			stockWord.push(ch_nextWord);
			stockWord.push(nextWord);
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
