const path   = require('path');
const fs     = require('fs');
const ytdl   = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const program = require('commander')

program
  .version('0.0.1')
  .option('-u, --url [type]', 'YouTube video URL you wish to convert.', 'https://www.youtube.com/watch?v=NqxSgp385N0')
  .option('-o, --output [type]', 'The name of the output file. [default = {video-title}.gif', false)
  .option('-f, --fps [type]', 'Frames per second of the output GIF. [default = 10]', 10)
  .option('-s, --size [type]', 'Dimensions of the output GIF. [default = 320x?]', '320x?')
  .option('-b, --beginTime [type]', 'The offset start of the video. [default = 3]', 3)
  .option('-d, --duration [type]', 'Number of seconds GIF should last. [default = 10]', 2)
  .parse(process.argv)
  ;

go();

function go(){
	
	var url = program.url;
	if (!program.output) {
	    filename = "output" + '.gif';
	} else {
	    filename = program.output;
	}
	
	y2gif(url,filename, program.beginTime, program.fps, program.size, program.duration)
}

function y2gif(url,filename,beginTime,fps ,size, duration){
	
	beginTime  = beginTime == null ? 3 : beginTime;
	fps = fps == null ? 10 : fps;
	size = size == null ? '320x?' : size;
	duration = duration == null ? 2 : duration;
	
	var tmpobj = tmp.dirSync();
	var videoOutput = path.resolve(tmpobj.name, 'video.mp4');
	ytdl(url)
	  .pipe(fs.createWriteStream(videoOutput))
	  .on('finish', () => {
	    ffmpeg()
	    .input(ytdl(url))
		  .noAudio()
	      .videoCodec('gif')
		  .setStartTime(beginTime)
		  .fps(fps)
		  .size(size)
		  .duration(duration)
	      .save(path.resolve(__dirname, filename ))
	      .on('error', console.error)
	      .on('progress', function(progress) {
	        process.stdout.cursorTo(0);
	        process.stdout.clearLine(1);
	        process.stdout.write(progress.timemark);
	      }).on('end', () => {
	        console.log();
			tmp.setGracefulCleanup();
	      });
	});
	
}
