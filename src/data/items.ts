import type { Item } from '../types'

const raw: [string, string, string, string, string][] = [
  ['japanese-notebook','国語ノート','こくごのーと','📓','いぬ'],
  ['japanese-textbook','国語教科書','こくごきょうかしょ','📕','ねこ'],
  ['reading','音読カード','おんどくかーど','🎤','ふくろう'],
  ['math-notebook','算数ノート','さんすうのーと','📓','さる'],
  ['math-textbook','算数教科書','さんすうきょうかしょ','📘','きつね'],
  ['pencilcase','筆箱','ふでばこ','✏️','うさぎ'],
  ['bottle','水筒','すいとう','🧃','ぞう'],
  ['smock','スモック','すもっく','🥼','くま'],
  ['redwhitecap','赤白帽','あかしろぼう','⛑️','かえる'],
  ['swimsuit','水着','みずぎ','🩱','いるか'],
  ['towel','タオル','たおる','▤','ぱんだ'],
  ['swimcap','水泳帽','すいえいぼう','◉','あざらし'],
  ['poolcard','プールカード','ぷーるかーど','💧','ぺんぎん'],
  ['returnbook','返す本','かえすほん','📚','しか'],
  ['tablet','タブレット','たぶれっと','▣','こぐま'],
  ['contact','連絡帳','れんらくちょう','📔','あらいぐま'],
  ['freebook','自由帳','じゆうちょう','🗒️','はむすたー'],
  ['deskpad','下じき','したじき','▣','かめ'],
  ['contactbag','連絡袋','れんらくぶくろ','👜','やぎ'],
  ['handkerchief','ハンカチ','はんかち','◇','ひつじ'],
  ['tissue','ティッシュ','てぃっしゅ','▱','こあら'],
  ['cap','帽子','ぼうし','🧢','にわとり'],
  ['homework','宿題','しゅくだい','✓','りす'],
]

export const items: Item[] = raw.map(([id, label, ruby, icon, motif]) => ({
  id,
  label,
  ruby,
  icon,
  motif,
  monsterId: `${id}-monster`,
  monsterName: `${label}${motif}`,
}))

export const itemMap = Object.fromEntries(items.map((item) => [item.id, item]))

export const commonItemIds = [
  'bottle',
  'pencilcase',
  'contact',
  'freebook',
  'deskpad',
  'contactbag',
  'handkerchief',
  'tissue',
  'cap',
  'homework',
  'reading',
]

export const mondayItemIds = ['tablet']
