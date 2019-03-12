const exec = require('child_process').execSync;
const fs = require("fs");

const folder = "C:/Users/Joshua/drgvid/";
const input = "input";
const output = "part";
const times = require("./times");

const execCommand = command => {
	console.log(command);
	exec(command);
};

const cutPart = (time, index) => {
	const [start, end] = time;
	const command = `C:/ffmpeg/bin/ffmpeg.exe -ss ${start} -to ${end} -i ${folder}${input}.mp4 -c copy -avoid_negative_ts make_zero -fflags +genpts ${folder}${output}${index}.mp4`;
	execCommand(command);
};

const concatParts = () => {
	const outputs = times.map((time, index) => `file '${output}${index}.mp4'\n`).join("");
	fs.writeFileSync(`${folder}concat.txt`, outputs);

	const concatCommand = `C:/ffmpeg/bin/ffmpeg.exe -f concat -i ${folder}concat.txt -c copy ${folder}merged.mp4`;
	execCommand(concatCommand);

	const removeFileCommand = `rm ${folder}concat.txt`;
	execCommand(removeFileCommand);
};

const removePart = (time, index) => {
	const command = `rm ${folder}${output}${index}.mp4`;
	execCommand(command);
};

const fixTimestamps = () => {
	const reencodeCommand = `C:/ffmpeg/bin/ffmpeg.exe -i ${folder}merged.mp4 -vcodec h264 -acodec aac ${folder}final.mp4`;
	exec(reencodeCommand);

	const removeMergedCommand = `rm ${folder}merged.mp4`;
	exec(removeMergedCommand);
};

const encodeForYoutube = () => {
	const encodeCommand = `C:/ffmpeg/bin/ffmpeg.exe -i ${folder}merged.mp4 -c:v libx264 -preset fast -crf 18 -c:a copy -pix_fmt yuv420p ${folder}final.mp4`;
	execCommand(encodeCommand)
};

times.forEach(cutPart);
concatParts();
times.forEach(removePart);
// fixTimestamps();
// encodeForYoutube();
