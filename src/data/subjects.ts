import type { Subject } from '../types'

export const subjects: Subject[] = [
  { id:'japanese', label:'国語', ruby:'こくご', icon:'あ', monsterId:'japanese-dragon', monsterName:'国語ドラゴン', itemIds:['japanese-notebook','japanese-textbook'], message:'こえに だせば、ことばは もっと つよくなる！', color:'#ff8d77' },
  { id:'math', label:'算数', ruby:'さんすう', icon:'＋', monsterId:'math-griffin', monsterName:'算数グリフォン', itemIds:['math-notebook','math-textbook'], message:'ひとつずつなら、かならず とける！', color:'#62b8f3' },
  { id:'special-schedule', label:'特別時程', ruby:'とくべつじてい', icon:'時', monsterId:'special-schedule-owl', monsterName:'特別時程ヤタガラス', itemIds:[], message:'いつもと ちがう ときも、ゆっくり たしかめよう！', color:'#8b5cf6' },
  { id:'moral', label:'道徳', ruby:'どうとく', icon:'♡', monsterId:'moral-unicorn', monsterName:'道徳ユニコーン', itemIds:[], message:'やさしい いっぽが、みんなを まもるよ。', color:'#e897c5' },
  { id:'music', label:'音楽', ruby:'おんがく', icon:'♪', monsterId:'music-phoenix', monsterName:'音楽フェニックス', itemIds:['pencilcase'], message:'きみの おとを、そらまで ひびかせよう！', color:'#b38ce8' },
  { id:'library', label:'図書', ruby:'としょ', icon:'本', monsterId:'library-sphinx', monsterName:'図書スフィンクス', itemIds:['returnbook'], message:'ほんを ひらけば、ぼうけんの はじまりだ。', color:'#f0aa55' },
  { id:'life', label:'生活', ruby:'せいかつ', icon:'葉', monsterId:'life-giraffe', monsterName:'生活キリン', itemIds:['pencilcase'], message:'よく みて、さわって、はっけんしよう！', color:'#70bf81' },
  { id:'english', label:'英語', ruby:'えいご', icon:'A', monsterId:'english-pegasus', monsterName:'英語ペガサス', itemIds:['pencilcase'], message:'まちがえて OK！まず こえに だそう。', color:'#5cbcb7' },
  { id:'pe', label:'体育', ruby:'たいいく', icon:'走', monsterId:'pe-golem', monsterName:'体育ゴーレム', itemIds:['bottle','redwhitecap'], message:'げんきに うごいて、さいごまで ちょうせんだ！', color:'#ef7b65' },
  { id:'art', label:'図工', ruby:'ずこう', icon:'色', monsterId:'art-chimera', monsterName:'図工キマイラ', itemIds:['smock','pencilcase'], message:'じゆうな いろで、きみだけの かたちを つくろう！', color:'#ea9d46' },
  { id:'pool', label:'プール', ruby:'ぷーる', icon:'水', monsterId:'pool-leviathan', monsterName:'プールリヴァイアサン', itemIds:['swimsuit','towel','swimcap','poolcard'], message:'あわてず、ゆっくり みずと なかよく。', color:'#4aaed7' }
]

export const subjectMap = Object.fromEntries(subjects.map((subject) => [subject.id, subject]))
