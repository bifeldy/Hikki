export interface DialogInfoData {
  title?: string;
  htmlMessage?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface DialogDmakData {
  romaji?: string;
  hiragana_katakana_kanji?: string;
}

export interface DialogEdictData {
  character?: string;
  context?: number;
  freq?: number;
  gakken?: number;
  harlpern_kkld?: number;
  harlpern_njecd?: number;
  jlpt?: number;
  maniette?: number;
  nelson_c?: number;
  nelson_n?: string;
  remember?: number;
  school?: number;
  skip?: string;
  stroke?: number;
  translate?: string;
  v_kunyomi?: string;
  v_onyomi?: string;
}
