/**
 * 分词
 * @param text 句
 * @param local 国家
 */
export function SegmenterWord(text: string, local: string = "zh") {
  const zh = new Intl.Segmenter("zh", { granularity: "word" });
  return Array.from(zh.segment(text));
}
