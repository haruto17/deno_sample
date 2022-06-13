import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

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
		if (nextWord.charAt(nextWord.length - 1) === "ん") {
			return new Response("最後の文字が「ん」になっています!", { status: 400 });
		}

		//続いているかチェック
		if (
			nextWord.length > 0 &&
			previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
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
