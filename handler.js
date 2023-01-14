const sourceMap = require("source-map");
const fs = require("fs");
const mkdirp = require("mkdirp");
const { dirname } = require("path");

function getRawSourceMap(file) {
	try {
		const data = fs.readFileSync(file, 'utf8');
		return JSON.parse(data);
	} catch (err) {
		console.error(err);
	}
}

async function writeFolderAndFile(path, content) {
  await mkdirp(dirname("/tmp/generated/" + path));
  fs.writeFileSync("/tmp/generated/" + path, content);
}

async function writeSourceToFile(consumer) {
  console.log("writeSourceToFile");
  return Promise.all(
    consumer.sources.map(async (source, index) => {
      await writeFolderAndFile(source, consumer.sourcesContent[index]);
    })
  );
}

function handleError(message) {
  console.log(message);
  return {
    body: message || "An error occurred",
    statusCode: 500
  };
}

async function main() {
  var file = process.argv[2];
	const parsedMap = await getRawSourceMap(file);
	await sourceMap.SourceMapConsumer.with(
		parsedMap,
		null,
		writeSourceToFile
	).catch(error => handleError(error));
}

main();
