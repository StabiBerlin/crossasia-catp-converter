import * as wanakana from 'wanakana'



const patched = str => str.replace(/ー/gm, '**---**')
.replace(/ッチュウ/gm, 'tchū')
.replace(/ッチョ/gm, 'tcho')
.replace(/ッチャ/gm, 'tcha')
.replace(/ッチュ/gm, 'tchu')
.replace(/ッチ/gm, 'tchi')
.replace(/ッ/gm, '@@***@@')

.replace(/キュウ/gm,'kyū')
.replace(/キョウ/gm,'kyō')
.replace(/ギュウ/gm,'gyū')
.replace(/ギョウ/gm,'gyō')
.replace(/シュウ/gm,'shū')
.replace(/ジュウ/gm,'jū')
.replace(/ショウ/gm,'shō')
.replace(/ジョウ/gm,'jō')
.replace(/チュウ/gm,'chū')
.replace(/チョウ/gm,'chō')
.replace(/ニュウ/gm,'nyū')
.replace(/ニョウ/gm,'nyō')
.replace(/ヒュウ/gm,'hyū')
.replace(/ヒョウ/gm,'hyō')
.replace(/ビュウ/gm,'byū')
.replace(/ビョウ/gm,'byō')
.replace(/ピュウ/gm,'pyū')
.replace(/ピョウ/gm,'pyō')
.replace(/ミュウ/gm,'myū')
.replace(/ミョウ/gm,'myō')
.replace(/リュウ/gm,'ryū')
.replace(/リョウ/gm,'ryō')
.replace(/オウ/gm,'ō')
.replace(/ウウ/gm,'ū')
.replace(/コウ/gm,'kō')
.replace(/ゴウ/gm,'gō')
.replace(/クウ/gm,'kū')
.replace(/グウ/gm,'gū')
.replace(/ソウ/gm,'sō')
.replace(/ゾウ/gm,'zō')
.replace(/スウ/gm,'sū')
.replace(/ズウ/gm,'zū')
.replace(/ツウ/gm,'tsū')
.replace(/ヅウ/gm,'zū')
.replace(/トウ/gm,'tō')
.replace(/ドウ/gm,'dō')
.replace(/ヌウ/gm,'nū')
.replace(/ノウ/gm,'nō')
.replace(/フウ/gm,'fū')
.replace(/ホウ/gm,'hō')
.replace(/プウ/gm,'pū')
.replace(/ポウ/gm,'pō')
.replace(/ブウ/gm,'bū')
.replace(/ボウ/gm,'bō')
.replace(/ムウ/gm,'mū')
.replace(/モウ/gm,'mō')
.replace(/ユウ/gm,'yū')
.replace(/ヨウ/gm,'yō')
.replace(/ルウ/gm,'rū')
.replace(/ロウ/gm,'rō')

.replace(/オオ/gm,'ō')
.replace(/コオ/gm,'kō')
.replace(/ゴオ/gm,'gō')
.replace(/ソオ/gm,'sō')
.replace(/ゾオ/gm,'zō')
.replace(/トオ/gm,'tō')
.replace(/ドオ/gm,'dō')
.replace(/ノオ/gm,'nō')
.replace(/ホオ/gm,'hō')
.replace(/ボオ/gm,'bō')
.replace(/ポオ/gm,'pō')
.replace(/モオ/gm,'mō')
.replace(/ヨオ/gm,'yō')
.replace(/ロオ/gm,'rō')
.replace(/ファ/gm,'fa')
.replace(/フィ/gm,'fi')
.replace(/フェ/gm,'fe')
.replace(/フォ/gm,'fo')
.replace(/ティ/gm,'ti')
.replace(/ディ/gm,'di')


const SPECIAL_SYMBOLS = {
  '。': '.',
  '、': ',',
  '：': '：',
  '・': ' ',
  '！': '！',
  '？': '？',
  '〜': '〜',
  'ー': 'ー',
  '「': ' “',
  '」': '” ',
  '『': ' “',
  '』': '” ',
  '［': '［',
  '］': '］',
  '（': '(',
  '）': ')',
  '｛': '｛',
  '｝': '｝',
  '　': '　',
};
const kanaToLatn = function(str) {
  if (str.length > 0) {
  const result = wanakana.toRomaji(patched(str)
 /*eslint no-misleading-character-class: off */            
  , { customRomajiMapping: SPECIAL_SYMBOLS})
            .replace(/a\*\*---\*\*/gm, 'ā')
            .replace(/i\*\*---\*\*/gm, 'ī')
            .replace(/u\*\*---\*\*/gm, 'ū')
            .replace(/e\*\*---\*\*/gm, 'ē')
            .replace(/o\*\*---\*\*/gm, 'ō')
            .replace(/@@\*\*\*@@([a-zA-Z])([a-zA-Zēūōāī])/gm, '$1$1$2')
            // .replace(/@@\*\*\*@@/gm, '')
    return (result.charAt(0).toUpperCase() + result.slice(1)).replace(/([a-zA-Z])=([a-zA-Z])/gm,'$1 = $2')
    .replace(/ {2,}/gm, ' ').replace(/^ {1,}/, '')
  } else {
    return ''
  }
}

export {kanaToLatn}