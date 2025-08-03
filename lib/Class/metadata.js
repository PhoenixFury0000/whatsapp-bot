const { spawn } = require('child_process'); 
const ID3Writer = require('browser-id3-writer');

function toAudio(buffer, format) { return new Promise((resolve, reject) => { const ffmpeg = spawn('ffmpeg', [ '-i', 'pipe:0', '-f', format, '-vn', '-acodec', 'libmp3lame', '-ab', '192k', '-ar', '44100', 'pipe:1' ]);
const chunks = [];
ffmpeg.stdout.on('data', chunk => chunks.push(chunk));
ffmpeg.stderr.on('data', () => {});
ffmpeg.on('error', reject);
ffmpeg.on('close', code => {
  if (code !== 0) return reject(new Error('failed'));
  resolve(Buffer.concat(chunks));
});

ffmpeg.stdin.write(buffer);
ffmpeg.stdin.end();

}); }

async function AddMp3Meta(songBuffer, coverBuffer, options = {}) { const title = options.title || 'diegoson'; const artist = options.artist || '';
const audio = await toAudio(songBuffer, 'mp3'); const writer = new ID3Writer(audio);
writer.setFrame('TIT2', title); writer.setFrame('TPE1', [artist]); writer.setFrame('TALB', ''); writer.setFrame('TYER', 2024); writer.setFrame('APIC', { type: 3, data: coverBuffer, description: 'Cover' });
writer.addTag();
return Buffer.from(writer.arrayBuffer); }

module.exports = AddMp3Meta;

                                          
